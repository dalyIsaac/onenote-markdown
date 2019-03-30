/**
 * Contains common items.
 */

import { Color, PageContent, RedBlackTree } from "../pageModel";
import { SENTINEL_INDEX, getNextNode } from "../tree/tree";
import { BufferCursor, ContentNode } from "./contentModel";

/**
 * The maximum length of a buffer string.
 */
export const MAX_BUFFER_LENGTH = 65535;

/**
 * The sentinel node of red-black trees.
 */
export const SENTINEL_CONTENT: ContentNode = {
  bufferIndex: 0,
  color: Color.Black,
  end: { column: 0, line: 0 },
  left: SENTINEL_INDEX,
  leftCharCount: 0,
  leftLineFeedCount: 0,
  length: 0,
  lineFeedCount: 0,
  parent: SENTINEL_INDEX,
  right: SENTINEL_INDEX,
  start: { column: 0, line: 0 },
};

/**
 * The returned object from `findNodeAtOffset`.
 */
export interface NodePositionOffset {
  /**
   * Piece Index
   */
  node: ContentNode;

  /**
   * The index of the node inside the array.
   */
  nodeIndex: number;

  /**
   * The remainder between the offset and the character count of the left
   * subtree.
   */
  remainder: number;

  /**
   * The offset of the node against the start of the content.
   */
  nodeStartOffset: number;
}

/**
 * Finds the node which contains the offset.
 * @param tree The red-black tree of the content.
 * @param offset The offset.
 */
export function findNodeAtOffset(
  tree: RedBlackTree<ContentNode>,
  offset: number,
): NodePositionOffset {
  let x = tree.root;
  let nodeStartOffset = 0;

  while (x !== SENTINEL_INDEX) {
    if (tree.nodes[x].leftCharCount > offset) {
      const oldXIndex = x;
      x = tree.nodes[x].left;
      if (x === SENTINEL_INDEX) {
        // to the left of the tree
        return {
          node: tree.nodes[x],
          nodeIndex: oldXIndex,
          nodeStartOffset,
          remainder: 0,
        };
      }
    } else if (tree.nodes[x].leftCharCount + tree.nodes[x].length > offset) {
      // note, the vscode nodeAt function uses >= instead of >
      nodeStartOffset += tree.nodes[x].leftCharCount;
      return {
        node: tree.nodes[x],
        nodeIndex: x,
        nodeStartOffset,
        remainder: offset - tree.nodes[x].leftCharCount,
      };
    } else {
      offset -= tree.nodes[x].leftCharCount + tree.nodes[x].length;
      const oldNodeStartOffset = nodeStartOffset;
      nodeStartOffset += tree.nodes[x].leftCharCount + tree.nodes[x].length;

      const oldXIndex = x;
      x = tree.nodes[x].right;
      if (x === SENTINEL_INDEX) {
        // to the right of the tree
        return {
          node: tree.nodes[oldXIndex],
          nodeIndex: oldXIndex,
          nodeStartOffset: oldNodeStartOffset,
          remainder: tree.nodes[oldXIndex].length,
        };
      }
    }
  }
  console.error(
    "Reaching here means that `nodes[x]` is a SENTINEL node, and stored " +
      "inside the piece table's `nodes` array.",
  );
  // attempt to gracefully handle the error
  return {
    node: SENTINEL_CONTENT,
    nodeIndex: SENTINEL_INDEX,
    nodeStartOffset: 0,
    remainder: 0,
  };
}

/**
 * Gets an array of the indices of the line starts.
 * @param content The HTML content of a OneNote page.
 */
export function getLineStarts(content: string): number[] {
  const lineStarts: number[] = [0];
  for (let i = 1; i < content.length; i++) {
    const char = content[i];
    if (char === "\n") {
      lineStarts.push(i + 1);
    }
  }
  return lineStarts;
}

/**
 * Gets the offset of a cursor inside a buffer.
 * @param page The page/piece table.
 * @param bufferIndex The buffer for which the cursor is located in.
 * @param cursor The cursor for which the offset is desired.
 */
export function getOffsetInBuffer(
  page: PageContent,
  bufferIndex: number,
  cursor: BufferCursor,
): number {
  const lineStarts = page.buffers[bufferIndex].lineStarts;
  return lineStarts[cursor.line] + cursor.column;
}

/**
 * Gets the contents of a content node.
 * @param page The page/piece table.
 * @param nodeIndex The index of the node in `page.nodes`.
 */
export function getNodeContent(page: PageContent, nodeIndex: number): string {
  if (nodeIndex === SENTINEL_INDEX) {
    return "";
  }
  const node = page.content.nodes[nodeIndex] as ContentNode;
  if (node.bufferIndex === undefined) {
    return "";
  }
  const buffer = page.buffers[node.bufferIndex];
  const startOffset = getOffsetInBuffer(page, node.bufferIndex, node.start);
  const endOffset = getOffsetInBuffer(page, node.bufferIndex, node.end);
  const currentContent = buffer.content.slice(startOffset, endOffset);
  return currentContent;
}
/**
 * Calculates the character count for the node and its subtrees.
 * @param tree The red-black tree for the content.
 * @param index The index of the node in the `node` array of the page/piece
 * table to find the character count for.
 */
export function calculateCharCount(
  tree: RedBlackTree<ContentNode>,
  index: number,
): number {
  if (index === SENTINEL_INDEX) {
    return 0;
  }
  const node = tree.nodes[index];
  return (
    node.leftCharCount + node.length + calculateCharCount(tree, node.right)
  );
}

/**
 * Calculates the line feed count for the node and subtrees.
 * @param tree The red-black tree for the content.
 * @param index The index of the node in the `node` array of the page/piece
 * table to find the line feed count for.
 */
export function calculateLineFeedCount(
  tree: RedBlackTree<ContentNode>,
  index: number,
): number {
  if (index === SENTINEL_INDEX) {
    return 0;
  }
  const node = tree.nodes[index];
  return (
    node.leftLineFeedCount +
    node.lineFeedCount +
    calculateLineFeedCount(tree, node.right)
  );
}

/**
 * Ensures that the `SENTINEL` node in the piece table is true to the values
 * of the `SENTINEL` node. This function does mutate the `SENTINEL` node, to
 * ensure that `SENTINEL` is a singleton.
 * @param tree The red-black tree for the content.
 */
export function resetSentinelContent(tree: RedBlackTree<ContentNode>): void {
  SENTINEL_CONTENT.bufferIndex = 0;
  SENTINEL_CONTENT.start = { column: 0, line: 0 };
  SENTINEL_CONTENT.end = { column: 0, line: 0 };
  SENTINEL_CONTENT.leftCharCount = 0;
  SENTINEL_CONTENT.leftLineFeedCount = 0;
  SENTINEL_CONTENT.length = 0;
  SENTINEL_CONTENT.lineFeedCount = 0;
  SENTINEL_CONTENT.color = Color.Black;
  SENTINEL_CONTENT.parent = SENTINEL_INDEX;
  SENTINEL_CONTENT.left = SENTINEL_INDEX;
  SENTINEL_CONTENT.right = SENTINEL_INDEX;
  tree.nodes[0] = SENTINEL_CONTENT;
}

/**
 * Goes up the tree, and updates the metadata of each node.
 * @param tree The red-black tree for content.
 * @param x The index of the current node.
 * @param charCountDelta The character count delta to be applied.
 * @param lineFeedCountDelta The line feed count delta to be applied.
 */
export function updateContentTreeMetadata(
  tree: RedBlackTree<ContentNode>,
  x: number,
  charCountDelta: number,
  lineFeedCountDelta: number,
): void {
  // node length change or line feed count change
  while (x !== tree.root && x !== SENTINEL_INDEX) {
    if (tree.nodes[tree.nodes[x].parent].left === x) {
      tree.nodes[tree.nodes[x].parent].leftCharCount =
        (tree.nodes[tree.nodes[x].parent] as ContentNode).leftCharCount +
        charCountDelta;
      tree.nodes[tree.nodes[x].parent].leftLineFeedCount =
        (tree.nodes[tree.nodes[x].parent] as ContentNode).leftLineFeedCount +
        lineFeedCountDelta;
    }

    x = tree.nodes[x].parent;
  }
}

/**
 * Gets content between the start and end offset for a page.
 * @param page The page from which to get the content from.
 * @param startOffset The start offset.
 * @param endOffset The end offset.
 */
export function getContentBetweenOffsets(
  page: PageContent,
  startOffset: number,
  endOffset: number,
): string {
  const position = findNodeAtOffset(page.content, startOffset);
  const length = endOffset - startOffset;
  let content = getNodeContent(page, position.nodeIndex).slice(
    startOffset - position.nodeStartOffset,
  );
  if (length <= content.length) {
    content = content.slice(0, length);
  } else {
    let offset = startOffset;
    const { nodeIndex } = position;
    let next = getNextNode(page.content.nodes, nodeIndex);
    while (offset <= endOffset) {
      content += getNodeContent(page, next.index);
      offset += (next.node as ContentNode).length;
      next = getNextNode(page.content.nodes, next.index);
    }
    content = content.slice(0, length);
  }
  return content;
}
