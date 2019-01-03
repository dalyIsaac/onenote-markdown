import {
  Color,
  ContentNode,
  ContentNodeMutable,
  NodeType,
  NodeUnion,
  NodeUnionMutable,
  PageContent,
  PageContentMutable,
  TagNodeMutable,
} from "../model";
import { fixInsert, insertNode } from "./insert";
import { leftRotate, rightRotate } from "./rotate";
import {
  calculateCharCount,
  calculateLineFeedCount,
  findNodeAtOffset,
  nextNode,
  NodePositionOffset,
  recomputeTreeMetadata,
  resetSentinel,
  SENTINEL_INDEX,
  treeMinimum,
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
    page.nodes,
    page.root,
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
      page.nodes,
      page.root,
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
    (page.nodes[oldNodeStartPosition.nodeIndex] as
      | ContentNodeMutable
      | TagNodeMutable) = nodeBeforeContent;
    insertNode(page, nodeAfterContent, deleteRange.startOffset);
    fixInsert(page, page.nodes.length - 1);
  } else if (nodeBeforeContent.length > 0 && nodeAfterContent.length > 0) {
    // delete from a point in a node to the end of another node
    updateNode(page, oldNodeStartPosition.nodeIndex, nodeBeforeContent);
    updateNode(page, oldNodeEndPosition.nodeIndex, nodeAfterContent);
    firstNodeToDelete = nextNode(page, firstNodeToDelete).index;
  } else if (nodeBeforeContent.length > 0) {
    // delete from a point in the node to the end of the node
    (page.nodes[oldNodeStartPosition.nodeIndex] as
      | ContentNodeMutable
      | TagNodeMutable) = nodeBeforeContent;
    if (oldNodeStartPosition !== oldNodeEndPosition) {
      // deleting from a point in a node to the end of the content
      deleteNode(page, oldNodeEndPosition.nodeIndex);
      nodeAfterLastNodeToDelete = SENTINEL_INDEX;
      firstNodeToDelete = nextNode(page, firstNodeToDelete).index;
    }
  } else if (nodeAfterContent.length > 0) {
    // delete from the start of the node to a point in the node
    updateNode(page, oldNodeEndPosition.nodeIndex, nodeAfterContent);
  } else if (oldNodeStartPosition === oldNodeEndPosition) {
    // delete the entire node
    deleteNode(page, oldNodeStartPosition.nodeIndex);
  } else {
    // deleting up to and including the last node
    nodeAfterLastNodeToDelete = nextNode(page, nodeAfterLastNodeToDelete).index;
  }

  page.previouslyInsertedNodeIndex = null;
  page.previouslyInsertedNodeOffset = null;

  if (oldNodeStartPosition.nodeIndex !== oldNodeEndPosition.nodeIndex) {
    deleteBetweenNodes(page, firstNodeToDelete, nodeAfterLastNodeToDelete);
  }
  resetSentinel(page);
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
  newNode: NodeUnionMutable,
): void {
  newNode.leftCharCount = page.nodes[index].leftCharCount;
  newNode.leftLineFeedCount = page.nodes[index].leftLineFeedCount;
  newNode.parent = page.nodes[index].parent;
  newNode.left = page.nodes[index].left;
  newNode.right = page.nodes[index].right;
  newNode.color = page.nodes[index].color;
  newNode.nodeType = NodeType.Content;
  page.nodes[index] = newNode as NodeUnion;
  recomputeTreeMetadata(page, index);
}

/**
 * Gets the node after the content.
 * @param page The page/piece table.
 * @param deleteRange The start and end offset of the content to delete.
 * @param nodePosition The position of the old node before the content to delete.
 */
function getNodeBeforeContent(
  page: PageContent | PageContentMutable,
  deleteRange: ContentDelete,
  nodePosition: NodePositionOffset,
): NodeUnion {
  const node = nodePosition.node as ContentNode;
  // "local" offsets refer to local within the buffer
  const localStartOffset =
    page.buffers[node.bufferIndex].lineStarts[node.start.line] +
    node.start.column +
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
    ...node,
    end: {
      line:
        lineFeedCountBeforeNodeStart + lineFeedCountAfterNodeStartBeforeStart,
      column:
        localStartOffset -
        page.buffers[node.bufferIndex].lineStarts[
          lineFeedCountBeforeNodeStart + lineFeedCountAfterNodeStartBeforeStart
        ],
    },
    length: nodePosition.remainder,
    lineFeedCount: lineFeedCountAfterNodeStartBeforeStart,
  };
  return nodeBeforeContent;
}

/**
 * Gets the node after the content.
 * @param page The page/piece table.
 * @param deleteRange The start and end offset of the content to delete.
 * @param nodePosition The position of the old node after the content to delete.
 */
function getNodeAfterContent(
  page: PageContent | PageContentMutable,
  deleteRange: ContentDelete,
  nodePosition: NodePositionOffset,
): ContentNode {
  const node = nodePosition.node as ContentNode;
  // localStartOffset is the index of nodePosition.startOffset inside the buffer
  const localStartOffset =
    page.buffers[node.bufferIndex].lineStarts[node.start.line] +
    node.start.column;
  const deletedLength = deleteRange.endOffset - deleteRange.startOffset;

  const firstSection = nodePosition.nodeStartOffset - deleteRange.startOffset;
  const secondSection = deletedLength - firstSection;
  // localEndOffset is the offset of the content after the deleted content
  const localEndOffset = localStartOffset + secondSection + 1;

  const length =
    nodePosition.nodeStartOffset + node.length - deleteRange.endOffset;
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
    node.start.line + lineFeedCountAfterNodeStartBeforeStart;
  const lineStartOffset =
    page.buffers[node.bufferIndex].lineStarts[nodeAfterContentStartLine];
  const nodeAfterContent: ContentNode = {
    nodeType: NodeType.Content,
    bufferIndex: node.bufferIndex,
    start: {
      line: nodeAfterContentStartLine,
      column: localEndOffset - lineStartOffset - 1,
    },
    end: node.end,
    length,
    lineFeedCount: lineFeedCountBetweenOffset,
    leftCharCount: 0,
    leftLineFeedCount: 0,
    left: 0,
    right: 0,
    parent: 0,
    color: Color.Red,
  };
  return nodeAfterContent;
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
    nextIndex = nextNode(page, currentIndex).index;
    deleteNode(page, currentIndex);
  }
}

/**
 * Deletes a node from the page/piece table. The node itself still resides inside the piece table, however `parent`,
 * `left`, and `right` will point to `SENTINEL_INDEX`, and no other nodes will point to the deleted node.
 * @param page The page/piece table.
 * @param z The index of the node to delete.
 */
export function deleteNode(page: PageContentMutable, z: number): void {
  page.nodes[z] = { ...page.nodes[z] };
  let xTemp: number;
  let yTemp: number;

  if (page.nodes[z].left === SENTINEL_INDEX) {
    yTemp = z;
    page.nodes[yTemp] = page.nodes[z];
    xTemp = page.nodes[yTemp].right;
  } else if (page.nodes[z].right === SENTINEL_INDEX) {
    yTemp = z;
    page.nodes[yTemp] = page.nodes[z];
    xTemp = page.nodes[yTemp].left;
  } else {
    const result = treeMinimum(page, page.nodes[z].right);
    yTemp = result.index;
    page.nodes[yTemp] = { ...result.node };
    xTemp = page.nodes[yTemp].right;
  }

  // This ensures that x and y don't change after this point
  const x = xTemp;
  const y = yTemp;

  page.nodes[x] = { ...page.nodes[x] };

  if (y === page.root) {
    page.root = x;

    // if page.nodes[x] is null, we are removing the only node
    (page.nodes[x] as NodeUnionMutable).color = Color.Black;
    detach(page, z);
    page.nodes[page.root] = {
      ...page.nodes[page.root],
      parent: SENTINEL_INDEX,
    };
    resetSentinel(page);
    return;
  }

  const yWasRed = page.nodes[y].color === Color.Red;

  if (y === page.nodes[page.nodes[y].parent].left) {
    page.nodes[page.nodes[y].parent] = {
      ...page.nodes[page.nodes[y].parent],
      left: x,
    };
  } else {
    page.nodes[page.nodes[y].parent] = {
      ...page.nodes[page.nodes[y].parent],
      right: x,
    };
  }

  if (y === z) {
    (page.nodes[x] as NodeUnionMutable).parent = page.nodes[y].parent;
    recomputeTreeMetadata(page, x);
  } else {
    if (page.nodes[y].parent === z) {
      (page.nodes[x] as NodeUnionMutable).parent = y;
    } else {
      (page.nodes[x] as NodeUnionMutable).parent = page.nodes[y].parent;
    }

    // as we make changes to page.nodes[x]'s hierarchy, update leftCharCount of subtree first
    recomputeTreeMetadata(page, x);

    (page.nodes[y] as NodeUnionMutable).left = page.nodes[z].left;
    (page.nodes[y] as NodeUnionMutable).right = page.nodes[z].right;
    (page.nodes[y] as NodeUnionMutable).parent = page.nodes[z].parent;
    (page.nodes[y] as NodeUnionMutable).color = page.nodes[z].color;

    if (z === page.root) {
      page.root = y;
    } else {
      if (z === page.nodes[page.nodes[z].parent].left) {
        page.nodes[page.nodes[z].parent] = {
          ...page.nodes[page.nodes[z].parent],
          left: y,
        };
      } else {
        page.nodes[page.nodes[z].parent] = {
          ...page.nodes[page.nodes[z].parent],
          right: y,
        };
      }
    }

    if (page.nodes[y].left !== SENTINEL_INDEX) {
      page.nodes[page.nodes[y].left] = {
        ...page.nodes[page.nodes[y].left],
        parent: y,
      };
    }
    if (page.nodes[y].right !== SENTINEL_INDEX) {
      page.nodes[page.nodes[y].right] = {
        ...page.nodes[page.nodes[y].right],
        parent: y,
      };
    }
    // update metadata
    // we replace page.nodes[z] with page.nodes[y], so in this sub tree, the length change is page.nodes[z].item.length
    (page.nodes[y] as NodeUnionMutable).leftCharCount =
      page.nodes[z].leftCharCount;
    (page.nodes[y] as NodeUnionMutable).leftLineFeedCount =
      page.nodes[z].leftLineFeedCount;
    recomputeTreeMetadata(page, y);
  }

  detach(page, z);

  if (page.nodes[page.nodes[x].parent].left === x) {
    const newSizeLeft = calculateCharCount(page, x);
    const newLFLeft = calculateLineFeedCount(page, x);
    if (
      newSizeLeft !== page.nodes[page.nodes[x].parent].leftCharCount ||
      newLFLeft !== page.nodes[page.nodes[x].parent].leftLineFeedCount
    ) {
      const charDelta =
        newSizeLeft - page.nodes[page.nodes[x].parent].leftCharCount;
      const lineFeedDelta =
        newLFLeft - page.nodes[page.nodes[x].parent].leftLineFeedCount;
      page.nodes[page.nodes[x].parent] = {
        ...page.nodes[page.nodes[x].parent],
        leftCharCount: newSizeLeft,
        leftLineFeedCount: newSizeLeft,
      };
      updateTreeMetadata(page, page.nodes[x].parent, charDelta, lineFeedDelta);
    }
  }

  recomputeTreeMetadata(page, page.nodes[x].parent);

  if (yWasRed) {
    resetSentinel(page);
    return;
  }

  fixDelete(page, x);
  resetSentinel(page);
  return;
}

/**
 * Sets the color of the node to `Color.BLack`, and sets `parent`, `left`, and `right` to `SENTINEL_INDEX`.
 * @param page The page/piece table.
 * @param node The index of the node to detach.
 */
function detach(page: PageContentMutable, node: number): void {
  const parent = page.nodes[page.nodes[node].parent]; // NEVER ASSIGN TO THIS
  if (parent.left === node) {
    page.nodes[page.nodes[node].parent] = {
      ...page.nodes[page.nodes[node].parent],
      left: SENTINEL_INDEX,
    };
  } else if (parent.right === node) {
    page.nodes[page.nodes[node].parent] = {
      ...page.nodes[page.nodes[node].parent],
      right: SENTINEL_INDEX,
    };
  }
  page.nodes[node] = {
    ...page.nodes[node],
    color: Color.Black,
    parent: SENTINEL_INDEX,
    left: SENTINEL_INDEX,
    right: SENTINEL_INDEX,
  };
}

/**
 * Restores the properties of a red-black tree after the deletion of a node.
 * @param page The page/piece table.
 * @param x The node to start the fixup from.
 */
function fixDelete(page: PageContentMutable, x: number): void {
  let w: number;

  while (x !== page.root && page.nodes[x].color === Color.Black) {
    if (x === page.nodes[page.nodes[x].parent].left) {
      w = page.nodes[page.nodes[x].parent].right;
      (page.nodes[w] as NodeUnionMutable) = {
        ...page.nodes[w],
      };

      if ((page.nodes[w] as NodeUnionMutable).color === Color.Red) {
        (page.nodes[w] as NodeUnionMutable).color = Color.Black;
        (page.nodes[page.nodes[x].parent] as
          | ContentNodeMutable
          | TagNodeMutable) = {
          ...page.nodes[page.nodes[x].parent],
          color: Color.Red,
        };
        leftRotate(page, page.nodes[x].parent);
        w = page.nodes[page.nodes[x].parent].right;
        (page.nodes[w] as NodeUnionMutable) = {
          ...page.nodes[w],
        };
      }

      if (
        page.nodes[page.nodes[w].left].color === Color.Black &&
        page.nodes[page.nodes[w].right].color === Color.Black
      ) {
        (page.nodes[w] as NodeUnionMutable).color = Color.Red;
        x = page.nodes[x].parent;
        (page.nodes[x] as NodeUnionMutable) = {
          ...page.nodes[x],
        };
      } else {
        if (page.nodes[page.nodes[w].right].color === Color.Black) {
          (page.nodes[page.nodes[w].left] as
            | ContentNodeMutable
            | TagNodeMutable) = {
            ...page.nodes[page.nodes[w].left],
            color: Color.Black,
          };
          (page.nodes[w] as NodeUnionMutable).color = Color.Red;
          rightRotate(page, w);
          w = page.nodes[page.nodes[x].parent].right;
          (page.nodes[w] as NodeUnionMutable) = {
            ...page.nodes[w],
          };
        }

        (page.nodes[w] as NodeUnionMutable).color =
          page.nodes[page.nodes[x].parent].color;
        (page.nodes[page.nodes[x].parent] as
          | ContentNodeMutable
          | TagNodeMutable) = {
          ...page.nodes[page.nodes[x].parent],
          color: Color.Black,
        };
        (page.nodes[page.nodes[w].right] as
          | ContentNodeMutable
          | TagNodeMutable) = {
          ...page.nodes[page.nodes[w].right],
          color: Color.Black,
        };
        leftRotate(page, page.nodes[x].parent);
        x = page.root;
        (page.nodes[x] as NodeUnionMutable) = {
          ...page.nodes[x],
        };
      }
    } else {
      w = page.nodes[page.nodes[x].parent].left;
      (page.nodes[w] as NodeUnionMutable) = {
        ...page.nodes[w],
      };

      if (page.nodes[w].color === Color.Red) {
        (page.nodes[w] as NodeUnionMutable).color = Color.Black;
        (page.nodes[page.nodes[x].parent] as
          | ContentNodeMutable
          | TagNodeMutable) = {
          ...page.nodes[page.nodes[x].parent],
          color: Color.Red,
        };
        rightRotate(page, page.nodes[x].parent);
        w = page.nodes[page.nodes[x].parent].left;
        (page.nodes[w] as NodeUnionMutable) = {
          ...page.nodes[w],
        };
      }

      if (
        page.nodes[page.nodes[w].left].color === Color.Black &&
        page.nodes[page.nodes[w].right].color === Color.Black
      ) {
        (page.nodes[w] as NodeUnionMutable).color = Color.Red;
        x = page.nodes[x].parent;
        (page.nodes[x] as NodeUnionMutable) = {
          ...page.nodes[x],
        };
      } else {
        if (page.nodes[page.nodes[w].left].color === Color.Black) {
          (page.nodes[page.nodes[w].right] as
            | ContentNodeMutable
            | TagNodeMutable) = {
            ...page.nodes[page.nodes[w].right],
            color: Color.Black,
          };
          (page.nodes[w] as NodeUnionMutable).color = Color.Red;
          leftRotate(page, w);
          w = page.nodes[page.nodes[x].parent].left;
        }

        (page.nodes[w] as NodeUnionMutable).color =
          page.nodes[page.nodes[x].parent].color;
        (page.nodes[page.nodes[x].parent] as
          | ContentNodeMutable
          | TagNodeMutable) = {
          ...page.nodes[page.nodes[x].parent],
          color: Color.Black,
        };
        (page.nodes[page.nodes[w].left] as
          | ContentNodeMutable
          | TagNodeMutable) = {
          ...page.nodes[page.nodes[w].left],
          color: Color.Black,
        };
        rightRotate(page, page.nodes[x].parent);
        x = page.root;
        (page.nodes[x] as NodeUnionMutable) = {
          ...page.nodes[x],
        };
      }
    }
  }
  (page.nodes[x] as NodeUnionMutable) = {
    ...page.nodes[x],
    color: Color.Black,
  };
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
  page: PageContent | PageContentMutable,
  nodePosition: NodePositionOffset,
  startLocalOffset: number,
  endLocalOffset: number,
): {
  lineFeedCountBeforeNodeStart: number;
  lineFeedCountAfterNodeStartBeforeStart: number;
  lineFeedCountBetweenOffset: number;
  lineFeedCountAfterEnd: number;
} {
  const node = nodePosition.node as ContentNode;
  const buffer = page.buffers[node.bufferIndex];
  const nodeStartOffset =
    page.buffers[node.bufferIndex].lineStarts[node.start.line] +
    node.start.column;
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
    lineFeedCountBeforeNodeStart,
    lineFeedCountAfterNodeStartBeforeStart,
    lineFeedCountBetweenOffset,
    lineFeedCountAfterEnd,
  };
}
