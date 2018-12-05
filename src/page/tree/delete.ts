import { Color, Node, PageContent } from "../model";
import { fixInsert, insertNode } from "./insert";
import { leftRotate, rightRotate } from "./rotate";
import {
  calculateCharCount,
  calculateLineFeedCount,
  findNodeAtOffset,
  NodePosition,
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
  const containingNodePosition = findNodeAtOffset(
    content.startOffset,
    page.nodes,
    page.root,
  );
  const length = content.endOffset - content.startOffset;
  page = { ...page, nodes: [...page.nodes] };
  if (
    containingNodePosition.remainder + length <=
    containingNodePosition.nodeStartOffset + containingNodePosition.node.length
  ) {
    page = deleteContentFromSingleNode(page, content, containingNodePosition);
  } else {
    // TODO deleteContentFromMultipleNodes
  }

  page.previouslyInsertedNodeIndex = null;
  page.previouslyInsertedNodeOffset = null;
  return page;
}

function deleteContentFromSingleNode(
  page: PageContent,
  content: ContentDelete,
  nodePosition: NodePosition,
): PageContent {
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
    lineFeedCountBetweenOffset,
    lineFeedCountAfterEnd,
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
  if (nodeBeforeContent.length > 0 && nodeAfterContent.length > 0) {
    // delete from a point in the node to another point in the node
    page.nodes[nodePosition.nodeIndex] = nodeBeforeContent;
    page.nodes.push(nodeAfterContent);
    page = insertNode(page, nodeAfterContent, content.startOffset);
    page = fixInsert(page, page.nodes.length - 1);
  } else if (nodeBeforeContent.length > 0) {
    // delete from a point in the node to the end of the node
    page.nodes[nodePosition.nodeIndex] = nodeBeforeContent;
  } else if (nodeAfterContent.length > 0) {
    // delete from the start of the node to a point in the node
    nodeAfterContent.leftCharCount = nodePosition.node.leftCharCount;
    nodeAfterContent.leftLineFeedCount = nodePosition.node.leftLineFeedCount;
    nodeAfterContent.parent = nodePosition.node.parent;
    nodeAfterContent.left = nodePosition.node.left;
    nodeAfterContent.right = nodePosition.node.right;
    nodeAfterContent.color = nodePosition.node.color;
    page.nodes[nodePosition.nodeIndex] = nodeAfterContent;
  } else {
    // delete the entire node
    page = deleteNode(page, nodePosition.nodeIndex);
  }
  return page;
}

export function deleteNode(page: PageContent, zIndex: number): PageContent {
  page = { ...page };
  const z = { ...page.nodes[zIndex] };
  page.nodes[zIndex] = z;
  let xIndex: number;
  let x: Node;
  let yIndex: number;
  let y: Node;

  if (z.left === SENTINEL_INDEX) {
    yIndex = zIndex;
    y = z;
    xIndex = y.right;
    x = { ...page.nodes[xIndex] };
    page.nodes[xIndex] = x;
  } else if (z.right === SENTINEL_INDEX) {
    yIndex = zIndex;
    y = z;
    xIndex = y.left;
    x = { ...page.nodes[y.left] };
    page.nodes[xIndex] = x;
  } else {
    const result = treeMinimum(page, z.right);
    yIndex = result.index;
    y = { ...result.node };
    page.nodes[yIndex] = y;

    xIndex = y.right;
    x = page.nodes[y.right];
    page.nodes[xIndex] = x;
  }

  if (yIndex === page.root) {
    page.root = xIndex;

    // if x is null, we are removing the only node
    x.color = Color.Black;
    detach(page, zIndex);
    resetSentinel(page);
    page.nodes[page.root] = {
      ...page.nodes[page.root],
      parent: SENTINEL_INDEX,
    };

    resetSentinel(page);
    return page;
  }

  const yWasRed = y.color === Color.Red;

  if (yIndex === page.nodes[y.parent].left) {
    page.nodes[y.parent] = {
      ...page.nodes[y.parent],
      left: xIndex,
    };
  } else {
    page.nodes[y.parent] = {
      ...page.nodes[y.parent],
      right: xIndex,
    };
  }

  if (yIndex === zIndex) {
    x.parent = y.parent;
    page = recomputeTreeMetadata(page, xIndex);
  } else {
    if (y.parent === zIndex) {
      x.parent = yIndex;
    } else {
      x.parent = y.parent;
    }

    // as we make changes to x's hierarchy, update leftCharCount of subtree first
    page = recomputeTreeMetadata(page, xIndex);

    y.left = z.left;
    y.right = z.right;
    y.parent = z.parent;
    y.color = z.color;

    if (zIndex === page.root) {
      page.root = yIndex;
    } else {
      if (zIndex === page.nodes[z.parent].left) {
        page.nodes[z.parent] = {
          ...page.nodes[z.parent],
          left: yIndex,
        };
      } else {
        page.nodes[z.parent] = {
          ...page.nodes[z.parent],
          right: yIndex,
        };
      }
    }

    if (y.left !== SENTINEL_INDEX) {
      page.nodes[y.left] = {
        ...page.nodes[y.left],
        parent: yIndex,
      };
    }
    if (y.right !== SENTINEL_INDEX) {
      page.nodes[y.right] = {
        ...page.nodes[y.right],
        parent: yIndex,
      };
    }
    // update metadata
    // we replace z with y, so in this sub tree, the length change is z.item.length
    y.leftCharCount = z.leftCharCount;
    y.leftLineFeedCount = z.leftLineFeedCount;
    page = recomputeTreeMetadata(page, yIndex);
  }

  detach(page, zIndex);

  if (page.nodes[x.parent].left === xIndex) {
    const newSizeLeft = calculateCharCount(page, xIndex);
    const newLFLeft = calculateLineFeedCount(page, xIndex);
    if (
      newSizeLeft !== page.nodes[x.parent].leftCharCount ||
      newLFLeft !== page.nodes[x.parent].leftLineFeedCount
    ) {
      const charDelta = newSizeLeft - page.nodes[x.parent].leftCharCount;
      const lineFeedDelta = newLFLeft - page.nodes[x.parent].leftLineFeedCount;
      page.nodes[x.parent] = {
        ...page.nodes[x.parent],
        leftCharCount: newSizeLeft,
        leftLineFeedCount: newSizeLeft,
      };
      page = updateTreeMetadata(page, x.parent, charDelta, lineFeedDelta);
    }
  }

  page = recomputeTreeMetadata(page, x.parent);

  if (yWasRed) {
    resetSentinel(page);
    return page;
  }

  page = fixDelete(page, xIndex);
  resetSentinel(page);
  return page;
}

function detach(page: PageContent, nodeIndex: number) {
  const node = page.nodes[nodeIndex];
  const parent = page.nodes[node.parent];
  if (parent.left === nodeIndex) {
    parent.left = SENTINEL_INDEX;
  } else if (parent.right === nodeIndex) {
    parent.right = SENTINEL_INDEX;
  }
  node.parent = SENTINEL_INDEX;
  node.left = SENTINEL_INDEX;
  node.right = SENTINEL_INDEX;
}

function fixDelete(page: PageContent, xIndex: number): PageContent {
  let wIndex: number;
  let w: Node;
  let x = { ...page.nodes[xIndex] };
  page.nodes[xIndex] = x;
  while (xIndex !== page.root && x.color === Color.Black) {
    if (xIndex === page.nodes[x.parent].left) {
      wIndex = page.nodes[x.parent].right;
      w = { ...page.nodes[wIndex] };
      page.nodes[wIndex] = w;

      if (w.color === Color.Red) {
        w.color = Color.Black;
        page.nodes[x.parent] = {
          ...page.nodes[x.parent],
          color: Color.Red,
        };
        page = leftRotate(page, x.parent);
        wIndex = page.nodes[x.parent].right;
        w = { ...page.nodes[wIndex] };
        page.nodes[wIndex] = w;
      }

      if (
        page.nodes[w.left].color === Color.Black &&
        page.nodes[w.right].color === Color.Black
      ) {
        w.color = Color.Red;
        xIndex = x.parent;
        x = { ...page.nodes[xIndex] };
        page.nodes[xIndex] = x;
      } else {
        if (page.nodes[w.right].color === Color.Black) {
          page.nodes[w.left] = {
            ...page.nodes[w.left],
            color: Color.Black,
          };
          w.color = Color.Red;
          page = rightRotate(page, wIndex);
          wIndex = page.nodes[x.parent].right;
          w = { ...page.nodes[wIndex] };
          page.nodes[wIndex] = w;
        }

        w.color = page.nodes[x.parent].color;
        page.nodes[x.parent] = {
          ...page.nodes[x.parent],
          color: Color.Black,
        };
        page.nodes[w.right] = {
          ...page.nodes[w.right],
          color: Color.Black,
        };
        page = leftRotate(page, x.parent);
        xIndex = page.root;
        x = { ...page.nodes[xIndex] };
        page.nodes[xIndex] = x;
      }
    } else {
      wIndex = page.nodes[x.parent].left;
      w = page.nodes[wIndex];

      if (w.color === Color.Red) {
        w.color = Color.Black;
        page.nodes[x.parent] = {
          ...page.nodes[x.parent],
          color: Color.Red,
        };
        page = rightRotate(page, x.parent);
        wIndex = page.nodes[x.parent].left;
        w = { ...page.nodes[wIndex] };
        page.nodes[wIndex] = w;
      }

      if (
        page.nodes[w.left].color === Color.Black &&
        page.nodes[w.right].color === Color.Black
      ) {
        w.color = Color.Red;
        xIndex = x.parent;
        x = { ...page.nodes[xIndex] };
        page.nodes[xIndex] = x;
      } else {
        if (page.nodes[w.left].color === Color.Black) {
          page.nodes[w.right] = {
            ...page.nodes[w.right],
            color: Color.Black,
          };
          w.color = Color.Red;
          page = leftRotate(page, wIndex);
          wIndex = page.nodes[x.parent].left;
          w = page.nodes[wIndex];
        }

        w.color = page.nodes[x.parent].color;
        page.nodes[x.parent] = {
          ...page.nodes[x.parent],
          color: Color.Black,
        };
        page.nodes[w.left] = {
          ...page.nodes[w.left],
          color: Color.Black,
        };
        page = rightRotate(page, x.parent);
        xIndex = page.root;
        x = { ...page.nodes[xIndex] };
        page.nodes[xIndex] = x;
      }
    }
  }
  x.color = Color.Black;

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
  nodePosition: NodePosition,
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
