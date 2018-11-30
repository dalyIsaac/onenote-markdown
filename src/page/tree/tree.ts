/**
 * Contains common items.
 */

import { BufferCursor, CharValues, NEWLINE, Node, PageContent } from "../model";
import { SENTINEL_INDEX } from "../reducer";

/**
 * The maximum length of a buffer string.
 */
export const MAX_BUFFER_LENGTH = 65535;

/**
 * The returned object from `findNodeAtOffset`.
 */
export interface NodePosition {
  /**
   * Piece Index
   */
  node: Node;

  /**
   * The index of the node inside the array.
   */
  nodeIndex: number;

  /**
   * The remainder between the offset and the character count of the left subtree
   */
  remainder: number;

  /**
   * The offset of the node against the start of the content.
   */
  nodeStartOffset: number;
}

/**
 * Finds the node which contains the offset.
 * @param offset The offset.
 * @param nodes The nodes.
 * @param root The root of the tree.
 */
export function findNodeAtOffset(
  offset: number,
  nodes: Node[],
  root: number,
): NodePosition {
  let xIndex = root;
  let x: Node = nodes[xIndex];
  let nodeStartOffset = 0;

  while (xIndex !== SENTINEL_INDEX) {
    if (x.leftCharCount > offset) {
      const oldXIndex = xIndex;
      xIndex = x.left;
      if (nodes[xIndex]) {
        x = nodes[xIndex];
      } else {
        // to the left of the tree
        return {
          node: x,
          nodeIndex: oldXIndex,
          remainder: 0,
          nodeStartOffset,
        };
      }
    } else if (x.leftCharCount + x.length > offset) {
      // note, the vscode nodeAt function uses >= instead of >
      nodeStartOffset += x.leftCharCount;
      return {
        node: x,
        nodeIndex: xIndex,
        remainder: offset - x.leftCharCount,
        nodeStartOffset,
      };
    } else {
      offset -= x.leftCharCount + x.length;
      nodeStartOffset += x.leftCharCount + x.length;

      const oldXIndex = xIndex;
      xIndex = x.right;
      if (nodes[xIndex]) {
        x = nodes[xIndex];
      } else {
        // to the right of the tree
        return {
          node: x,
          nodeIndex: oldXIndex,
          remainder: x.length,
          nodeStartOffset,
        };
      }
    }
  }
  throw RangeError(
    `Reaching here means that \`x\` is a SENTINEL node, and stored inside the piece table's \`nodes\` array.`,
  );
}

/**
 * Checks the first 100 characters of a OneNote page to find what newline format is used. If it can't determine what
 * format is used within the first 100 lines, it assumes that LF is used.
 * @param content The HTML content of a OneNote page.
 */
export function getNewlineFormat(content: string): CharValues[] {
  for (let i = 0; i < 100; i++) {
    if (content.charCodeAt(i) === CharValues.LF) {
      return NEWLINE.LF;
    } else if (content.charCodeAt(i) === CharValues.CR) {
      if (
        i + 1 < content.length &&
        content.charCodeAt(i + 1) === CharValues.LF
      ) {
        return NEWLINE.CRLF;
      }
    }
  }
  return NEWLINE.LF;
}

/**
 * Gets an array of the indices of the line starts.
 * @param content The HTML content of a OneNote page.
 * @param newline The newline format for the OneNote page, as determined by the getNewline function.
 */
export function getLineStarts(
  content: string,
  newline: CharValues[],
): number[] {
  const lineStarts: number[] = [0];
  for (let i = 0; i + newline.length - 1 <= content.length; i++) {
    let match = true;
    for (let j = 0; j < newline.length && match; j++) {
      if (content.charCodeAt(i + j) !== newline[j]) {
        match = false;
      } else if (j === newline.length - 1) {
        lineStarts.push(i + newline.length);
      }
    }
  }
  return lineStarts;
}

/**
 * Gets the contents of a node.
 * @param nodeIndex The index of the node in `page.nodes`.
 * @param page The page/piece table.
 */
export function getNodeContent(nodeIndex: number, page: PageContent): string {
  if (nodeIndex === SENTINEL_INDEX) {
    return "";
  }
  const node = page.nodes[nodeIndex];
  const buffer = page.buffers[node.bufferIndex];
  const startOffset = getOffsetInBuffer(node.bufferIndex, node.start, page);
  const endOffset = getOffsetInBuffer(node.bufferIndex, node.end, page);
  const currentContent = buffer.content.slice(startOffset, endOffset);
  return currentContent;
}

/**
 * Gets the offset of a cursor inside a buffer.
 * @param bufferIndex The buffer for which the cursor is located in.
 * @param cursor The cursor for which the offset is desired.
 * @param page The page/piece table.
 */
export function getOffsetInBuffer(
  bufferIndex: number,
  cursor: BufferCursor,
  page: PageContent,
) {
  const lineStarts = page.buffers[bufferIndex].lineStarts;
  return lineStarts[cursor.line] + cursor.column;
}
