import { deleteNode, deleteBetweenNodes } from "../tree/delete";
import { Color, PageContent } from "../pageModel";
import {
  getNextNode,
  SENTINEL_INDEX,
  recomputeTreeMetadata,
  resetSentinel,
} from "../tree/tree";
import { ContentNode } from "./contentModel";
import { insertNode, fixInsert } from "../tree/insert";
import { findNodeAtOffset, NodePositionOffset } from "./tree";
import { deleteStructureNode } from "../structureTree/delete";
import { ContentLocations } from "./actions";
import { getPrevStartNode } from "../structureTree/tree";

/**
 * Gets the number of line feeds before, between, and after a start and end
 * offset.
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
 * Gets the node after the content.
 * @param page The page/piece table.
 * @param deleteRange The start and end offset of the content to delete.
 * @param nodePosition The position of the old node after the content to delete.
 */
function getNodeAfterContent(
  page: PageContent,
  deleteRange: ContentLocations,
  nodePosition: NodePositionOffset,
): ContentNode {
  // localStartOffset is the index of nodePosition.startOffset inside the buffer
  const localStartOffset =
    page.buffers[nodePosition.node.bufferIndex].lineStarts[
      nodePosition.node.start.line
    ] + nodePosition.node.start.column;
  const deletedLength =
    deleteRange.end.contentOffset - deleteRange.start.contentOffset;

  const firstSection =
    nodePosition.nodeStartOffset - deleteRange.start.contentOffset;
  const secondSection = deletedLength - firstSection;
  // localEndOffset is the offset of the content after the deleted content
  const localEndOffset = localStartOffset + secondSection + 1;

  const length =
    nodePosition.nodeStartOffset +
    nodePosition.node.length -
    deleteRange.end.contentOffset;
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
 * Gets the node before the content.
 * @param page The page/piece table.
 * @param deleteRange The start and end offset of the content to delete.
 * @param nodePosition The position of the old node before the content to
 * delete.
 */
function getNodeBeforeContent(
  page: PageContent,
  deleteRange: ContentLocations,
  { node, nodeIndex, nodeStartOffset, remainder }: NodePositionOffset,
): ContentNode {
  // "local" offsets refer to local within the buffer
  const localStartOffset =
    page.buffers[node.bufferIndex].lineStarts[node.start.line] +
    node.start.column +
    remainder;
  const deletedLength =
    deleteRange.end.contentOffset - deleteRange.start.contentOffset;
  const localEndOffset = localStartOffset + deletedLength + 1;
  const {
    lineFeedCountBeforeNodeStart,
    lineFeedCountAfterNodeStartBeforeStart,
  } = getLineFeedCountsForOffsets(
    page,
    { node, nodeIndex, nodeStartOffset, remainder },
    localStartOffset,
    localEndOffset,
  );
  const nodeBeforeContent: ContentNode = {
    ...node,
    end: {
      column:
        localStartOffset -
        page.buffers[node.bufferIndex].lineStarts[
          lineFeedCountBeforeNodeStart + lineFeedCountAfterNodeStartBeforeStart
        ],
      line:
        lineFeedCountBeforeNodeStart + lineFeedCountAfterNodeStartBeforeStart,
    },
    length: remainder,
    lineFeedCount: lineFeedCountAfterNodeStartBeforeStart,
  };
  return nodeBeforeContent;
}

/**
 * Updates the new node with tree metadata provided by the old node. The node is
 *  then placed inside the tree, and tree metadata is recomputed.
 * @param page The page/piece table.
 * @param index The index of the old node.
 * @param newNode The new node to replace the old node.
 */
function updateNode(
  page: PageContent,
  index: number,
  newNode: ContentNode,
): void {
  newNode.leftCharCount = page.content.nodes[index].leftCharCount;
  newNode.leftLineFeedCount = page.content.nodes[index].leftLineFeedCount;
  newNode.parent = page.content.nodes[index].parent;
  newNode.left = page.content.nodes[index].left;
  newNode.right = page.content.nodes[index].right;
  newNode.color = page.content.nodes[index].color;
  page.content.nodes[index] = newNode;
  recomputeTreeMetadata(page.content, index);
}

/**
 * Deletes the given range from the page.
 * @param page The page/piece table to delete the content from.
 * @param deleteRange The start and end offset of the content to delete.
 */
export function deleteContent(
  page: PageContent,
  deleteRange: ContentLocations,
): void {
  const oldNodeStartPosition = findNodeAtOffset(
    page.content,
    deleteRange.start.contentOffset,
  );
  let oldNodeEndPosition: NodePositionOffset;
  const nodeBeforeContent = getNodeBeforeContent(
    page,
    deleteRange,
    oldNodeStartPosition,
  );
  const deleteLength =
    deleteRange.end.contentOffset - deleteRange.start.contentOffset;
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
      page.content,
      deleteRange.end.contentOffset,
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
    page.content.nodes[oldNodeStartPosition.nodeIndex] = nodeBeforeContent;
    insertNode(page.content, nodeAfterContent, deleteRange.start.contentOffset);
    fixInsert(page.content, page.content.nodes.length - 1);
  } else if (nodeBeforeContent.length > 0 && nodeAfterContent.length > 0) {
    // delete from a point in a node to the end of another node
    updateNode(page, oldNodeStartPosition.nodeIndex, nodeBeforeContent);
    updateNode(page, oldNodeEndPosition.nodeIndex, nodeAfterContent);
    firstNodeToDelete = getNextNode(page.content.nodes, firstNodeToDelete)
      .index;
  } else if (nodeBeforeContent.length > 0) {
    // delete from a point in the node to the end of the node
    page.content.nodes[oldNodeStartPosition.nodeIndex] = nodeBeforeContent;
    if (oldNodeStartPosition !== oldNodeEndPosition) {
      // deleting from a point in a node to the end of the content
      deleteNode(page.content, oldNodeEndPosition.nodeIndex);
      nodeAfterLastNodeToDelete = SENTINEL_INDEX;
      firstNodeToDelete = getNextNode(page.content.nodes, firstNodeToDelete)
        .index;
    }
  } else if (nodeAfterContent.length > 0) {
    // delete from the start of the node to a point in the node
    updateNode(page, oldNodeEndPosition.nodeIndex, nodeAfterContent);
  } else if (oldNodeStartPosition === oldNodeEndPosition) {
    // delete the entire node
    deleteNode(page.content, oldNodeStartPosition.nodeIndex);
  } else {
    // deleting up to and including the last node
    nodeAfterLastNodeToDelete = getNextNode(
      page.content.nodes,
      nodeAfterLastNodeToDelete,
    ).index;
  }

  page.previouslyInsertedContentNodeIndex = null;
  page.previouslyInsertedContentNodeOffset = null;

  if (oldNodeStartPosition.nodeIndex !== oldNodeEndPosition.nodeIndex) {
    deleteBetweenNodes(
      page.content,
      firstNodeToDelete,
      nodeAfterLastNodeToDelete,
    );
  }
  resetSentinel(page.content);
}

function deletePriorAtStructureNodeStart(
  page: PageContent,
  deleteRange: ContentLocations,
): void {
  // Checks if the node is a <br /> tag
  if (page.structure.nodes[deleteRange.start.structureNodeIndex].tag === "br") {
    deleteStructureNode(page, deleteRange.start.structureNodeIndex);
    return;
  }

  const { index: startNodeIndex, node: startNode } = getPrevStartNode(
    page,
    deleteRange.start.structureNodeIndex,
  );

  // Merges the two nodes.
  // First, insert the start and end node.
  // Second, delete the existing nodes.
  const endNode = page.structure.nodes[deleteRange.end.structureNodeIndex];
  insertNode(
    page.structure,
    {
      ...startNode,
      length: startNode.length + endNode.length,
      color: Color.Red,
      leftSubTreeLength: 0,
      left: SENTINEL_INDEX,
      parent: SENTINEL_INDEX,
      right: SENTINEL_INDEX,
    },
    deleteRange.end.contentOffset,
    startNodeIndex,
  );
  insertNode(
    page.structure,
    {
      ...page.structure.nodes[startNodeIndex + 1],
      color: Color.Red,
      leftSubTreeLength: 0,
      left: SENTINEL_INDEX,
      parent: SENTINEL_INDEX,
      right: SENTINEL_INDEX,
    },
    deleteRange.end.contentOffset,
    page.structure.nodes.length - 1,
  );

  deleteStructureNode(page, startNodeIndex);
  deleteStructureNode(page, startNodeIndex + 1);
  deleteStructureNode(page, deleteRange.end.structureNodeIndex);
  deleteStructureNode(page, deleteRange.end.structureNodeIndex + 1);
}

/**
 * Deletes multiple characters prior to the selection.
 * @param page The page/piece table to delete the content from.
 * @param deleteRange The start and end offset of the content to delete.
 */
export function deletePrior(
  page: PageContent,
  deleteRange: ContentLocations,
): void {
  if (deleteRange.start.structureNodeContentOffset === undefined) {
    return;
  }

  if (
    deleteRange.start.structureNodeContentOffset === 0 &&
    deleteRange.start.contentOffset === 0
  ) {
    return;
  }

  // the following are local to the given structure node
  const localDeleteStart =
    deleteRange.start.contentOffset -
    deleteRange.start.structureNodeContentOffset -
    1;

  if (localDeleteStart < 0) {
    deletePriorAtStructureNodeStart(page, deleteRange);
  } else {
    deleteRange.start.contentOffset -= 1;
    deleteContent(page, deleteRange);
    page.structure.nodes[deleteRange.start.structureNodeIndex].length -= 1;
  }
}

export function deleteAfter(): void {
  // deletes multiple characters after the selection
}

export function deleteRange(): void {
  // deletes the characters selected
  // should utilise deletePrior and deleteAfter as necessary
}
