import { Color, PageContent, PageContentMutable } from "../pageModel";
import { nextNode, SENTINEL_INDEX, treeMinimum } from "../tree";
import { ContentNode, ContentNodeMutable } from "./contentModel";
import { fixInsert, insertNode } from "./insert";
import { leftRotate, rightRotate } from "./rotate";
import {
  calculateCharCount,
  calculateLineFeedCount,
  findNodeAtOffset,
  NodePositionOffset,
  recomputeTreeMetadata,
  resetSentinel,
  updateTreeMetadata,
} from "./tree";

/**
 * The logical offset range for the content to be deleted.
 */
export interface ContentDelete {
  readonly startOffset: number;
  readonly endOffset: number;
}

/**
 * Gets the number of line feeds before, between, and after a start and end offset.
 * Returns `-1` if nodePosition.remainder === nodePosition.nodeStartOffset.
 * @param page The page/piece table.
 * @param nodePosition The position of the node which contains the offset.
 * @param startLocalOffset The logical offset inside the entire piece table.
 * @param endLocalOffset The logical offset inside the entire piece table.
 */
function getLineFeedCountsForOffsets(
  page: PageContent,
  nodePosition: NodePositionOffset,
  startLocalOffset: number,
  endLocalOffset: number,
): {
    lineFeedCountBeforeNodeStart: number;
    lineFeedCountAfterNodeStartBeforeStart: number;
    lineFeedCountBetweenOffset: number;
    lineFeedCountAfterEnd: number;
  } {
  const buffer = page.buffers[nodePosition.node.bufferIndex];
  const nodeStartOffset =
    page.buffers[nodePosition.node.bufferIndex].lineStarts[
      nodePosition.node.start.line
    ] + nodePosition.node.start.column;
  let lineFeedCountBeforeNodeStart = 0;
  let lineFeedCountAfterNodeStartBeforeStart = 0;
  let lineFeedCountBetweenOffset = 0;
  let lineFeedCountAfterEnd = 0;

  for (let i = 1; i < buffer.lineStarts.length; i++) {
    const el = buffer.lineStarts[i];
    if (el < nodeStartOffset) {
      lineFeedCountBeforeNodeStart++;
    } else if (nodeStartOffset <= el && el < startLocalOffset) {
      lineFeedCountAfterNodeStartBeforeStart++;
    } else if (startLocalOffset <= el && el < endLocalOffset) {
      lineFeedCountBetweenOffset++;
    } else if (endLocalOffset <= el) {
      lineFeedCountAfterEnd++;
    }
  }
  return {
    lineFeedCountAfterEnd,
    lineFeedCountAfterNodeStartBeforeStart,
    lineFeedCountBeforeNodeStart,
    lineFeedCountBetweenOffset,
  };
}

/**
 * Restores the properties of a red-black tree after the deletion of a node.
 * @param page The page/piece table.
 * @param x The node to start the fixup from.
 */
function fixDelete(page: PageContentMutable, x: number): void {
  let w: number;

  while (x !== page.contentRoot && page.contentNodes[x].color === Color.Black) {
    if (x === page.contentNodes[page.contentNodes[x].parent].left) {
      w = page.contentNodes[page.contentNodes[x].parent].right;
      (page.contentNodes[w] as ContentNodeMutable) = {
        ...page.contentNodes[w],
      };

      if ((page.contentNodes[w] as ContentNodeMutable).color === Color.Red) {
        (page.contentNodes[w] as ContentNodeMutable).color = Color.Black;
        (page.contentNodes[
          page.contentNodes[x].parent
        ] as ContentNodeMutable) = {
          ...page.contentNodes[page.contentNodes[x].parent],
          color: Color.Red,
        };
        leftRotate(page, page.contentNodes[x].parent);
        w = page.contentNodes[page.contentNodes[x].parent].right;
        (page.contentNodes[w] as ContentNodeMutable) = {
          ...page.contentNodes[w],
        };
      }

      if (
        page.contentNodes[page.contentNodes[w].left].color === Color.Black &&
        page.contentNodes[page.contentNodes[w].right].color === Color.Black
      ) {
        (page.contentNodes[w] as ContentNodeMutable).color = Color.Red;
        x = page.contentNodes[x].parent;
        (page.contentNodes[x] as ContentNodeMutable) = {
          ...page.contentNodes[x],
        };
      } else {
        if (
          page.contentNodes[page.contentNodes[w].right].color === Color.Black
        ) {
          (page.contentNodes[
            page.contentNodes[w].left
          ] as ContentNodeMutable) = {
            ...page.contentNodes[page.contentNodes[w].left],
            color: Color.Black,
          };
          (page.contentNodes[w] as ContentNodeMutable).color = Color.Red;
          rightRotate(page, w);
          w = page.contentNodes[page.contentNodes[x].parent].right;
          (page.contentNodes[w] as ContentNodeMutable) = {
            ...page.contentNodes[w],
          };
        }

        (page.contentNodes[w] as ContentNodeMutable).color =
          page.contentNodes[page.contentNodes[x].parent].color;
        (page.contentNodes[
          page.contentNodes[x].parent
        ] as ContentNodeMutable) = {
          ...page.contentNodes[page.contentNodes[x].parent],
          color: Color.Black,
        };
        (page.contentNodes[
          page.contentNodes[w].right
        ] as ContentNodeMutable) = {
          ...page.contentNodes[page.contentNodes[w].right],
          color: Color.Black,
        };
        leftRotate(page, page.contentNodes[x].parent);
        x = page.contentRoot;
        (page.contentNodes[x] as ContentNodeMutable) = {
          ...page.contentNodes[x],
        };
      }
    } else {
      w = page.contentNodes[page.contentNodes[x].parent].left;
      (page.contentNodes[w] as ContentNodeMutable) = {
        ...page.contentNodes[w],
      };

      if (page.contentNodes[w].color === Color.Red) {
        (page.contentNodes[w] as ContentNodeMutable).color = Color.Black;
        (page.contentNodes[
          page.contentNodes[x].parent
        ] as ContentNodeMutable) = {
          ...page.contentNodes[page.contentNodes[x].parent],
          color: Color.Red,
        };
        rightRotate(page, page.contentNodes[x].parent);
        w = page.contentNodes[page.contentNodes[x].parent].left;
        (page.contentNodes[w] as ContentNodeMutable) = {
          ...page.contentNodes[w],
        };
      }

      if (
        page.contentNodes[page.contentNodes[w].left].color === Color.Black &&
        page.contentNodes[page.contentNodes[w].right].color === Color.Black
      ) {
        (page.contentNodes[w] as ContentNodeMutable).color = Color.Red;
        x = page.contentNodes[x].parent;
        (page.contentNodes[x] as ContentNodeMutable) = {
          ...page.contentNodes[x],
        };
      } else {
        if (
          page.contentNodes[page.contentNodes[w].left].color === Color.Black
        ) {
          (page.contentNodes[
            page.contentNodes[w].right
          ] as ContentNodeMutable) = {
            ...page.contentNodes[page.contentNodes[w].right],
            color: Color.Black,
          };
          (page.contentNodes[w] as ContentNodeMutable).color = Color.Red;
          leftRotate(page, w);
          w = page.contentNodes[page.contentNodes[x].parent].left;
        }

        (page.contentNodes[w] as ContentNodeMutable).color =
          page.contentNodes[page.contentNodes[x].parent].color;
        (page.contentNodes[
          page.contentNodes[x].parent
        ] as ContentNodeMutable) = {
          ...page.contentNodes[page.contentNodes[x].parent],
          color: Color.Black,
        };
        (page.contentNodes[page.contentNodes[w].left] as ContentNodeMutable) = {
          ...page.contentNodes[page.contentNodes[w].left],
          color: Color.Black,
        };
        rightRotate(page, page.contentNodes[x].parent);
        x = page.contentRoot;
        (page.contentNodes[x] as ContentNodeMutable) = {
          ...page.contentNodes[x],
        };
      }
    }
  }
  (page.contentNodes[x] as ContentNodeMutable) = {
    ...page.contentNodes[x],
    color: Color.Black,
  };
}

/**
 * Sets the color of the node to `Color.BLack`, and sets `parent`, `left`, and `right` to `SENTINEL_INDEX`.
 * @param page The page/piece table.
 * @param node The index of the node to detach.
 */
function detach(page: PageContentMutable, node: number): void {
  const parent = page.contentNodes[page.contentNodes[node].parent]; // NEVER ASSIGN TO THIS
  if (parent.left === node) {
    page.contentNodes[page.contentNodes[node].parent] = {
      ...page.contentNodes[page.contentNodes[node].parent],
      left: SENTINEL_INDEX,
    };
  } else if (parent.right === node) {
    page.contentNodes[page.contentNodes[node].parent] = {
      ...page.contentNodes[page.contentNodes[node].parent],
      right: SENTINEL_INDEX,
    };
  }
  page.contentNodes[node] = {
    ...page.contentNodes[node],
    color: Color.Black,
    parent: SENTINEL_INDEX,
    left: SENTINEL_INDEX,
    right: SENTINEL_INDEX,
  };
}

/**
 * Deletes a node from the page/piece table. The node itself still resides inside the piece table, however `parent`,
 * `left`, and `right` will point to `SENTINEL_INDEX`, and no other nodes will point to the deleted node.
 * @param page The page/piece table.
 * @param z The index of the node to delete.
 */
export function deleteNode(page: PageContentMutable, z: number): void {
  page.contentNodes[z] = { ...page.contentNodes[z] };
  let xTemp: number;
  let yTemp: number;

  if (page.contentNodes[z].left === SENTINEL_INDEX) {
    yTemp = z;
    page.contentNodes[yTemp] = page.contentNodes[z];
    xTemp = page.contentNodes[yTemp].right;
  } else if (page.contentNodes[z].right === SENTINEL_INDEX) {
    yTemp = z;
    page.contentNodes[yTemp] = page.contentNodes[z];
    xTemp = page.contentNodes[yTemp].left;
  } else {
    const result = treeMinimum(page.contentNodes, page.contentNodes[z].right);
    yTemp = result.index;
    page.contentNodes[yTemp] = { ...(result.node as ContentNode) };
    xTemp = page.contentNodes[yTemp].right;
  }

  // This ensures that x and y don't change after this point
  const x = xTemp;
  const y = yTemp;

  page.contentNodes[x] = { ...page.contentNodes[x] };

  if (y === page.contentRoot) {
    page.contentRoot = x;

    // if page.nodes[x] is null, we are removing the only node
    (page.contentNodes[x] as ContentNodeMutable).color = Color.Black;
    detach(page, z);
    page.contentNodes[page.contentRoot] = {
      ...page.contentNodes[page.contentRoot],
      parent: SENTINEL_INDEX,
    };
    resetSentinel(page);
    return;
  }

  const yWasRed = page.contentNodes[y].color === Color.Red;

  if (y === page.contentNodes[page.contentNodes[y].parent].left) {
    page.contentNodes[page.contentNodes[y].parent] = {
      ...page.contentNodes[page.contentNodes[y].parent],
      left: x,
    };
  } else {
    page.contentNodes[page.contentNodes[y].parent] = {
      ...page.contentNodes[page.contentNodes[y].parent],
      right: x,
    };
  }

  if (y === z) {
    (page.contentNodes[x] as ContentNodeMutable).parent =
      page.contentNodes[y].parent;
    recomputeTreeMetadata(page, x);
  } else {
    if (page.contentNodes[y].parent === z) {
      (page.contentNodes[x] as ContentNodeMutable).parent = y;
    } else {
      (page.contentNodes[x] as ContentNodeMutable).parent =
        page.contentNodes[y].parent;
    }

    // as we make changes to page.nodes[x]'s hierarchy, update leftCharCount of subtree first
    recomputeTreeMetadata(page, x);

    (page.contentNodes[y] as ContentNodeMutable).left =
      page.contentNodes[z].left;
    (page.contentNodes[y] as ContentNodeMutable).right =
      page.contentNodes[z].right;
    (page.contentNodes[y] as ContentNodeMutable).parent =
      page.contentNodes[z].parent;
    (page.contentNodes[y] as ContentNodeMutable).color =
      page.contentNodes[z].color;

    if (z === page.contentRoot) {
      page.contentRoot = y;
    } else {
      if (z === page.contentNodes[page.contentNodes[z].parent].left) {
        page.contentNodes[page.contentNodes[z].parent] = {
          ...page.contentNodes[page.contentNodes[z].parent],
          left: y,
        };
      } else {
        page.contentNodes[page.contentNodes[z].parent] = {
          ...page.contentNodes[page.contentNodes[z].parent],
          right: y,
        };
      }
    }

    if (page.contentNodes[y].left !== SENTINEL_INDEX) {
      page.contentNodes[page.contentNodes[y].left] = {
        ...page.contentNodes[page.contentNodes[y].left],
        parent: y,
      };
    }
    if (page.contentNodes[y].right !== SENTINEL_INDEX) {
      page.contentNodes[page.contentNodes[y].right] = {
        ...page.contentNodes[page.contentNodes[y].right],
        parent: y,
      };
    }
    // update metadata
    // we replace page.nodes[z] with page.nodes[y], so in this sub tree, the length change is page.nodes[z].item.length
    (page.contentNodes[y] as ContentNodeMutable).leftCharCount =
      page.contentNodes[z].leftCharCount;
    (page.contentNodes[y] as ContentNodeMutable).leftLineFeedCount =
      page.contentNodes[z].leftLineFeedCount;
    recomputeTreeMetadata(page, y);
  }

  detach(page, z);

  if (page.contentNodes[page.contentNodes[x].parent].left === x) {
    const newSizeLeft = calculateCharCount(page, x);
    const newLFLeft = calculateLineFeedCount(page, x);
    if (
      newSizeLeft !==
        page.contentNodes[page.contentNodes[x].parent].leftCharCount ||
      newLFLeft !==
        page.contentNodes[page.contentNodes[x].parent].leftLineFeedCount
    ) {
      const charDelta =
        newSizeLeft -
        page.contentNodes[page.contentNodes[x].parent].leftCharCount;
      const lineFeedDelta =
        newLFLeft -
        page.contentNodes[page.contentNodes[x].parent].leftLineFeedCount;
      page.contentNodes[page.contentNodes[x].parent] = {
        ...page.contentNodes[page.contentNodes[x].parent],
        leftCharCount: newSizeLeft,
        leftLineFeedCount: newSizeLeft,
      };
      updateTreeMetadata(
        page,
        page.contentNodes[x].parent,
        charDelta,
        lineFeedDelta,
      );
    }
  }

  recomputeTreeMetadata(page, page.contentNodes[x].parent);

  if (yWasRed) {
    resetSentinel(page);
    return;
  }

  fixDelete(page, x);
  resetSentinel(page);
  return;
}

/**
 * Deletes nodes inorder between the start and end index.
 * Format: `startIndex <= in order node to delete < endIndex`
 * @param page The page/piece table.
 * @param startIndex The index of the first node to delete.
 * @param endIndex The index of the node after the last node to delete.
 */
function deleteBetweenNodes(
  page: PageContentMutable,
  startIndex: number,
  endIndex: number,
): void {
  let currentIndex = startIndex;
  let nextIndex = currentIndex;
  while (nextIndex !== endIndex) {
    currentIndex = nextIndex;
    nextIndex = nextNode(page.contentNodes, currentIndex).index;
    deleteNode(page, currentIndex);
  }
}

/**
 * Gets the node after the content.
 * @param page The page/piece table.
 * @param deleteRange The start and end offset of the content to delete.
 * @param nodePosition The position of the old node after the content to delete.
 */
function getNodeAfterContent(
  page: PageContent,
  deleteRange: ContentDelete,
  nodePosition: NodePositionOffset,
): ContentNode {
  // localStartOffset is the index of nodePosition.startOffset inside the buffer
  const localStartOffset =
    page.buffers[nodePosition.node.bufferIndex].lineStarts[
      nodePosition.node.start.line
    ] + nodePosition.node.start.column;
  const deletedLength = deleteRange.endOffset - deleteRange.startOffset;

  const firstSection = nodePosition.nodeStartOffset - deleteRange.startOffset;
  const secondSection = deletedLength - firstSection;
  // localEndOffset is the offset of the content after the deleted content
  const localEndOffset = localStartOffset + secondSection + 1;

  const length =
    nodePosition.nodeStartOffset +
    nodePosition.node.length -
    deleteRange.endOffset;
  const {
    lineFeedCountAfterNodeStartBeforeStart,
    lineFeedCountBetweenOffset,
  } = getLineFeedCountsForOffsets(
    page,
    nodePosition,
    localEndOffset,
    localEndOffset + length,
  );
  const nodeAfterContentStartLine =
    nodePosition.node.start.line + lineFeedCountAfterNodeStartBeforeStart;
  const lineStartOffset =
    page.buffers[nodePosition.node.bufferIndex].lineStarts[
      nodeAfterContentStartLine
    ];
  const nodeAfterContent: ContentNode = {
    bufferIndex: nodePosition.node.bufferIndex,
    color: Color.Red,
    end: nodePosition.node.end,
    left: 0,
    leftCharCount: 0,
    leftLineFeedCount: 0,
    length,
    lineFeedCount: lineFeedCountBetweenOffset,
    parent: 0,
    right: 0,
    start: {
      column: localEndOffset - lineStartOffset - 1,
      line: nodeAfterContentStartLine,
    },
  };
  return nodeAfterContent;
}

/**
 * Gets the node after the content.
 * @param page The page/piece table.
 * @param deleteRange The start and end offset of the content to delete.
 * @param nodePosition The position of the old node before the content to delete.
 */
function getNodeBeforeContent(
  page: PageContent,
  deleteRange: ContentDelete,
  nodePosition: NodePositionOffset,
): ContentNode {
  // "local" offsets refer to local within the buffer
  const localStartOffset =
    page.buffers[nodePosition.node.bufferIndex].lineStarts[
      nodePosition.node.start.line
    ] +
    nodePosition.node.start.column +
    nodePosition.remainder;
  const deletedLength = deleteRange.endOffset - deleteRange.startOffset;
  const localEndOffset = localStartOffset + deletedLength + 1;
  const {
    lineFeedCountBeforeNodeStart,
    lineFeedCountAfterNodeStartBeforeStart,
  } = getLineFeedCountsForOffsets(
    page,
    nodePosition,
    localStartOffset,
    localEndOffset,
  );
  const nodeBeforeContent: ContentNode = {
    ...nodePosition.node,
    end: {
      column:
        localStartOffset -
        page.buffers[nodePosition.node.bufferIndex].lineStarts[
          lineFeedCountBeforeNodeStart + lineFeedCountAfterNodeStartBeforeStart
        ],
      line:
        lineFeedCountBeforeNodeStart + lineFeedCountAfterNodeStartBeforeStart,
    },
    length: nodePosition.remainder,
    lineFeedCount: lineFeedCountAfterNodeStartBeforeStart,
  };
  return nodeBeforeContent;
}

/**
 * Updates the new node with tree metadata provided by the old node. The node is then placed inside the tree, and
 * tree metadata is recomputed.
 * @param page The page/piece table.
 * @param index The index of the old node.
 * @param newNode The new node to replace the old node.
 */
function updateNode(
  page: PageContentMutable,
  index: number,
  newNode: ContentNodeMutable,
): void {
  newNode.leftCharCount = page.contentNodes[index].leftCharCount;
  newNode.leftLineFeedCount = page.contentNodes[index].leftLineFeedCount;
  newNode.parent = page.contentNodes[index].parent;
  newNode.left = page.contentNodes[index].left;
  newNode.right = page.contentNodes[index].right;
  newNode.color = page.contentNodes[index].color;
  page.contentNodes[index] = newNode;
  recomputeTreeMetadata(page, index);
}

/**
 * Deletes the given range from the page.
 * @param page The page/piece table to delete the content from.
 * @param deleteRange The start and end offset of the content to delete.
 */
export function deleteContent(
  page: PageContentMutable,
  deleteRange: ContentDelete,
): void {
  const oldNodeStartPosition = findNodeAtOffset(
    deleteRange.startOffset,
    page.contentNodes,
    page.contentRoot,
  );
  let oldNodeEndPosition: NodePositionOffset;
  const nodeBeforeContent = getNodeBeforeContent(
    page,
    deleteRange,
    oldNodeStartPosition,
  );
  const deleteLength = deleteRange.endOffset - deleteRange.startOffset;
  let nodeAfterContent: ContentNode;
  if (
    oldNodeStartPosition.remainder + deleteLength <=
    oldNodeStartPosition.node.length
  ) {
    nodeAfterContent = getNodeAfterContent(
      page,
      deleteRange,
      oldNodeStartPosition,
    );
    oldNodeEndPosition = oldNodeStartPosition;
  } else {
    oldNodeEndPosition = findNodeAtOffset(
      deleteRange.endOffset,
      page.contentNodes,
      page.contentRoot,
    );
    nodeAfterContent = getNodeAfterContent(
      page,
      deleteRange,
      oldNodeEndPosition,
    );
  }

  let firstNodeToDelete = oldNodeStartPosition.nodeIndex;
  let nodeAfterLastNodeToDelete = oldNodeEndPosition.nodeIndex;
  if (
    oldNodeStartPosition === oldNodeEndPosition &&
    nodeBeforeContent.length > 0 &&
    nodeAfterContent.length > 0
  ) {
    // delete from a point in the node to another point in the node
    (page.contentNodes[
      oldNodeStartPosition.nodeIndex
    ] as ContentNodeMutable) = nodeBeforeContent;
    insertNode(page, nodeAfterContent, deleteRange.startOffset);
    fixInsert(page, page.contentNodes.length - 1);
  } else if (nodeBeforeContent.length > 0 && nodeAfterContent.length > 0) {
    // delete from a point in a node to the end of another node
    updateNode(page, oldNodeStartPosition.nodeIndex, nodeBeforeContent);
    updateNode(page, oldNodeEndPosition.nodeIndex, nodeAfterContent);
    firstNodeToDelete = nextNode(page.contentNodes, firstNodeToDelete).index;
  } else if (nodeBeforeContent.length > 0) {
    // delete from a point in the node to the end of the node
    (page.contentNodes[
      oldNodeStartPosition.nodeIndex
    ] as ContentNodeMutable) = nodeBeforeContent;
    if (oldNodeStartPosition !== oldNodeEndPosition) {
      // deleting from a point in a node to the end of the content
      deleteNode(page, oldNodeEndPosition.nodeIndex);
      nodeAfterLastNodeToDelete = SENTINEL_INDEX;
      firstNodeToDelete = nextNode(page.contentNodes, firstNodeToDelete).index;
    }
  } else if (nodeAfterContent.length > 0) {
    // delete from the start of the node to a point in the node
    updateNode(page, oldNodeEndPosition.nodeIndex, nodeAfterContent);
  } else if (oldNodeStartPosition === oldNodeEndPosition) {
    // delete the entire node
    deleteNode(page, oldNodeStartPosition.nodeIndex);
  } else {
    // deleting up to and including the last node
    nodeAfterLastNodeToDelete = nextNode(
      page.contentNodes,
      nodeAfterLastNodeToDelete,
    ).index;
  }

  page.previouslyInsertedContentNodeIndex = null;
  page.previouslyInsertedContentNodeOffset = null;

  if (oldNodeStartPosition.nodeIndex !== oldNodeEndPosition.nodeIndex) {
    deleteBetweenNodes(page, firstNodeToDelete, nodeAfterLastNodeToDelete);
  }
  resetSentinel(page);
}
