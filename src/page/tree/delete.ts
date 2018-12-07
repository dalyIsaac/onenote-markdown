import { Color, Node, PageContent } from "../model";
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

export interface ContentDelete {
  startOffset: number;
  endOffset: number;
}

export function deleteContent(
  page: PageContent,
  content: ContentDelete,
): PageContent {
  const oldNodeStartPosition = findNodeAtOffset(
    content.startOffset,
    page.nodes,
    page.root,
  );
  let oldNodeEndPosition: NodePositionOffset;
  const nodeBeforeContent = getNodeBeforeContent(
    page,
    content,
    oldNodeStartPosition,
  );
  const deleteLength = content.endOffset - content.startOffset;
  let nodeAfterContent: Node;
  if (
    oldNodeStartPosition.remainder + deleteLength <=
    oldNodeStartPosition.node.length
  ) {
    nodeAfterContent = getNodeAfterContent(
      page,
      content,
      oldNodeStartPosition,
      nodeBeforeContent,
    );
  } else {
    oldNodeEndPosition = findNodeAtOffset(
      content.endOffset,
      page.nodes,
      page.root,
    );
    nodeAfterContent = getNodeAfterContent(
      page,
      content,
      oldNodeEndPosition,
      nodeBeforeContent,
    );
    if (oldNodeStartPosition.nodeIndex !== oldNodeEndPosition.nodeIndex) {
      page = deleteBetweenNodes(
        page,
        oldNodeStartPosition.nodeIndex,
        oldNodeEndPosition.nodeIndex,
      );
    }
  }

  if (nodeBeforeContent.length > 0 && nodeAfterContent.length > 0) {
    // delete from a point in the node to another point in the node
    page.nodes[oldNodeStartPosition.nodeIndex] = nodeBeforeContent;
    page.nodes.push(nodeAfterContent);
    page = insertNode(page, nodeAfterContent, content.startOffset);
    page = fixInsert(page, page.nodes.length - 1);
  } else if (nodeBeforeContent.length > 0) {
    // delete from a point in the node to the end of the node
    page.nodes[oldNodeStartPosition.nodeIndex] = nodeBeforeContent;
  } else if (nodeAfterContent.length > 0) {
    // delete from the start of the node to a point in the node
    nodeAfterContent.leftCharCount = oldNodeStartPosition.node.leftCharCount;
    nodeAfterContent.leftLineFeedCount =
      oldNodeStartPosition.node.leftLineFeedCount;
    nodeAfterContent.parent = oldNodeStartPosition.node.parent;
    nodeAfterContent.left = oldNodeStartPosition.node.left;
    nodeAfterContent.right = oldNodeStartPosition.node.right;
    nodeAfterContent.color = oldNodeStartPosition.node.color;
    page.nodes[oldNodeStartPosition.nodeIndex] = nodeAfterContent;
  } else {
    // delete the entire node
    page = deleteNode(page, oldNodeStartPosition.nodeIndex);
  }
  page.previouslyInsertedNodeIndex = null;
  page.previouslyInsertedNodeOffset = null;
  return page;
}

function getNodeBeforeContent(
  page: PageContent,
  content: ContentDelete,
  nodePosition: NodePositionOffset,
): Node {
  // "local" offsets refer to local within the buffer
  const localStartOffset =
    page.buffers[nodePosition.node.bufferIndex].lineStarts[
      nodePosition.node.start.line
    ] +
    nodePosition.node.start.column +
    nodePosition.remainder;
  const deletedLength = content.endOffset - content.startOffset;
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
  const nodeBeforeContent: Node = {
    ...nodePosition.node,
    end: {
      line:
        lineFeedCountBeforeNodeStart + lineFeedCountAfterNodeStartBeforeStart,
      column:
        localStartOffset -
        page.buffers[nodePosition.node.bufferIndex].lineStarts[
          lineFeedCountBeforeNodeStart + lineFeedCountAfterNodeStartBeforeStart
        ],
    },
    length: nodePosition.remainder,
    lineFeedCount: lineFeedCountAfterNodeStartBeforeStart,
  };
  return nodeBeforeContent;
}

function getNodeAfterContent(
  page: PageContent,
  content: ContentDelete,
  nodePosition: NodePositionOffset,
  nodeBeforeContent: Node,
): Node {
  const localStartOffset =
    page.buffers[nodePosition.node.bufferIndex].lineStarts[
      nodePosition.node.start.line
    ] +
    nodePosition.node.start.column +
    nodePosition.remainder;
  const deletedLength = content.endOffset - content.startOffset;
  const localEndOffset = localStartOffset + deletedLength + 1;
  const {
    lineFeedCountAfterNodeStartBeforeStart,
    lineFeedCountBetweenOffset,
    lineFeedCountAfterEnd,
  } = getLineFeedCountsForOffsets(
    page,
    nodePosition,
    localStartOffset,
    localEndOffset,
  );
  const nodeAfterContentLine =
    nodePosition.node.start.line +
    lineFeedCountAfterNodeStartBeforeStart +
    lineFeedCountBetweenOffset;
  const nodeAfterContent: Node = {
    bufferIndex: nodePosition.node.bufferIndex,
    start: {
      line:
        nodePosition.node.start.line +
        lineFeedCountAfterNodeStartBeforeStart +
        lineFeedCountBetweenOffset,
      column:
        localEndOffset -
        page.buffers[nodePosition.node.bufferIndex].lineStarts[
          nodeAfterContentLine
        ] -
        1,
    },
    end: nodePosition.node.end,
    length:
      nodePosition.node.length - (deletedLength + nodeBeforeContent.length),
    lineFeedCount: lineFeedCountAfterEnd,
    leftCharCount: 0,
    leftLineFeedCount: 0,
    left: 0,
    right: 0,
    parent: 0,
    color: Color.Red,
  };
  return nodeAfterContent;
}

function deleteBetweenNodes(
  page: PageContent,
  startIndex: number,
  endIndex: number,
): PageContent {
  let currentIndex = startIndex;
  let nextIndex = currentIndex;
  while (nextIndex !== endIndex) {
    currentIndex = nextIndex;
    nextIndex = nextNode(page, currentIndex).index;
    page = deleteNode(page, currentIndex);
  }
  return page;
}

export function deleteNode(page: PageContent, z: number): PageContent {
  page = { ...page };
  page.nodes[z] = { ...page.nodes[z] };
  let x: number;
  let y: number;

  if (page.nodes[z].left === SENTINEL_INDEX) {
    y = z;
    page.nodes[y] = page.nodes[z];
    x = page.nodes[y].right;
    page.nodes[x] = { ...page.nodes[x] };
  } else if (page.nodes[z].right === SENTINEL_INDEX) {
    y = z;
    page.nodes[y] = page.nodes[z];
    x = page.nodes[y].left;
    page.nodes[x] = { ...page.nodes[page.nodes[y].left] };
  } else {
    const result = treeMinimum(page, page.nodes[z].right);
    y = result.index;
    page.nodes[y] = { ...result.node };
    x = page.nodes[y].right;
    page.nodes[x] = page.nodes[page.nodes[y].right];
  }

  if (y === page.root) {
    page.root = x;

    // if page.nodes[x] is null, we are removing the only node
    page.nodes[x].color = Color.Black;
    detach(page, z);
    resetSentinel(page);
    page.nodes[page.root] = {
      ...page.nodes[page.root],
      parent: SENTINEL_INDEX,
    };

    resetSentinel(page);
    return page;
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
    page.nodes[x].parent = page.nodes[y].parent;
    page = recomputeTreeMetadata(page, x);
  } else {
    if (page.nodes[y].parent === z) {
      page.nodes[x].parent = y;
    } else {
      page.nodes[x].parent = page.nodes[y].parent;
    }

    // as we make changes to page.nodes[x]'s hierarchy, update leftCharCount of subtree first
    page = recomputeTreeMetadata(page, x);

    page.nodes[y].left = page.nodes[z].left;
    page.nodes[y].right = page.nodes[z].right;
    page.nodes[y].parent = page.nodes[z].parent;
    page.nodes[y].color = page.nodes[z].color;

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
    page.nodes[y].leftCharCount = page.nodes[z].leftCharCount;
    page.nodes[y].leftLineFeedCount = page.nodes[z].leftLineFeedCount;
    page = recomputeTreeMetadata(page, y);
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
      page = updateTreeMetadata(
        page,
        page.nodes[x].parent,
        charDelta,
        lineFeedDelta,
      );
    }
  }

  page = recomputeTreeMetadata(page, page.nodes[x].parent);

  if (yWasRed) {
    resetSentinel(page);
    return page;
  }

  page = fixDelete(page, x);
  resetSentinel(page);
  return page;
}

function detach(page: PageContent, node: number): void {
  const parent = page.nodes[page.nodes[node].parent];
  if (parent.left === node) {
    parent.left = SENTINEL_INDEX;
  } else if (parent.right === node) {
    parent.right = SENTINEL_INDEX;
  }
  page.nodes[node].parent = SENTINEL_INDEX;
  page.nodes[node].left = SENTINEL_INDEX;
  page.nodes[node].right = SENTINEL_INDEX;
}

function fixDelete(page: PageContent, x: number): PageContent {
  let w: number;
  
  while (x !== page.root && page.nodes[x].color === Color.Black) {
    if (x === page.nodes[page.nodes[x].parent].left) {
      w = page.nodes[page.nodes[x].parent].right;
      page.nodes[w] = { ...page.nodes[w] };
      page.nodes[w] = page.nodes[w];

      if (page.nodes[w].color === Color.Red) {
        page.nodes[w].color = Color.Black;
        page.nodes[page.nodes[x].parent] = {
          ...page.nodes[page.nodes[x].parent],
          color: Color.Red,
        };
        page = leftRotate(page, page.nodes[x].parent);
        w = page.nodes[page.nodes[x].parent].right;
        page.nodes[w] = { ...page.nodes[w] };
        page.nodes[w] = page.nodes[w];
      }

      if (
        page.nodes[page.nodes[w].left].color === Color.Black &&
        page.nodes[page.nodes[w].right].color === Color.Black
      ) {
        page.nodes[w].color = Color.Red;
        x = page.nodes[x].parent;
        page.nodes[x] = { ...page.nodes[x] };
        
      } else {
        if (page.nodes[page.nodes[w].right].color === Color.Black) {
          page.nodes[page.nodes[w].left] = {
            ...page.nodes[page.nodes[w].left],
            color: Color.Black,
          };
          page.nodes[w].color = Color.Red;
          page = rightRotate(page, w);
          w = page.nodes[page.nodes[x].parent].right;
          page.nodes[w] = { ...page.nodes[w] };
          page.nodes[w] = page.nodes[w];
        }

        page.nodes[w].color = page.nodes[page.nodes[x].parent].color;
        page.nodes[page.nodes[x].parent] = {
          ...page.nodes[page.nodes[x].parent],
          color: Color.Black,
        };
        page.nodes[page.nodes[w].right] = {
          ...page.nodes[page.nodes[w].right],
          color: Color.Black,
        };
        page = leftRotate(page, page.nodes[x].parent);
        x = page.root;
        page.nodes[x] = { ...page.nodes[x] };
        
      }
    } else {
      w = page.nodes[page.nodes[x].parent].left;
      page.nodes[w] = page.nodes[w];

      if (page.nodes[w].color === Color.Red) {
        page.nodes[w].color = Color.Black;
        page.nodes[page.nodes[x].parent] = {
          ...page.nodes[page.nodes[x].parent],
          color: Color.Red,
        };
        page = rightRotate(page, page.nodes[x].parent);
        w = page.nodes[page.nodes[x].parent].left;
        page.nodes[w] = { ...page.nodes[w] };
        page.nodes[w] = page.nodes[w];
      }

      if (
        page.nodes[page.nodes[w].left].color === Color.Black &&
        page.nodes[page.nodes[w].right].color === Color.Black
      ) {
        page.nodes[w].color = Color.Red;
        x = page.nodes[x].parent;
        page.nodes[x] = { ...page.nodes[x] };
        
      } else {
        if (page.nodes[page.nodes[w].left].color === Color.Black) {
          page.nodes[page.nodes[w].right] = {
            ...page.nodes[page.nodes[w].right],
            color: Color.Black,
          };
          page.nodes[w].color = Color.Red;
          page = leftRotate(page, w);
          w = page.nodes[page.nodes[x].parent].left;
          page.nodes[w] = page.nodes[w];
        }

        page.nodes[w].color = page.nodes[page.nodes[x].parent].color;
        page.nodes[page.nodes[x].parent] = {
          ...page.nodes[page.nodes[x].parent],
          color: Color.Black,
        };
        page.nodes[page.nodes[w].left] = {
          ...page.nodes[page.nodes[w].left],
          color: Color.Black,
        };
        page = rightRotate(page, page.nodes[x].parent);
        x = page.root;
        page.nodes[x] = { ...page.nodes[x] };
        
      }
    }
  }
  page.nodes[x].color = Color.Black;

  return page;
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
    lineFeedCountBeforeNodeStart,
    lineFeedCountAfterNodeStartBeforeStart,
    lineFeedCountBetweenOffset,
    lineFeedCountAfterEnd,
  };
}
