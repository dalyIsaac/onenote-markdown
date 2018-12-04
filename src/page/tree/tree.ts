/**
 * Contains common items.
 */

import {
  BufferCursor,
  CharValues,
  Color,
  NEWLINE,
  Node,
  PageContent,
} from "../model";

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
  // tslint:disable-next-line:no-console
  console.error(
    `Reaching here means that \`x\` is a SENTINEL node, and stored inside the piece table's \`nodes\` array.`,
  );
  // attempt to gracefully handle the error
  return {
    node: SENTINEL,
    nodeIndex: SENTINEL_INDEX,
    remainder: 0,
    nodeStartOffset: 0,
  };
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

/**
 * Recomputes the metadata for the tree based on the newly inserted node.
 * @param page The page/piece table.
 * @param index The index of the node in the `node` array, which is the basis for updating the tree.
 */
export function recomputeTreeMetadata(
  page: PageContent,
  xIndex: number,
): PageContent {
  let lengthDelta = 0;
  let lineFeedDelta = 0;
  if (xIndex === page.root) {
    return page;
  }

  page.nodes = [...page.nodes];
  let x = { ...page.nodes[xIndex] };
  page.nodes[xIndex] = x;

  // go upwards till the node whose left subtree is changed.
  while (
    xIndex !== page.root &&
    xIndex === page.nodes[x.parent].right &&
    xIndex !== SENTINEL_INDEX
  ) {
    xIndex = x.parent;
    x = page.nodes[xIndex];
  }

  if (xIndex === page.root) {
    // well, it means we add a node to the end (inorder)
    return page;
  }

  // x is the node whose right subtree is changed.
  xIndex = x.parent;
  x = { ...page.nodes[xIndex] };
  page.nodes[xIndex] = x;

  lengthDelta = calculateCharCount(page, x.left) - x.leftCharCount;
  lineFeedDelta = calculateLineFeedCount(page, x.left) - x.leftLineFeedCount;
  x.leftCharCount += lengthDelta;
  x.leftLineFeedCount += lineFeedDelta;

  // go upwards till root. O(logN)
  while (xIndex !== page.root && (lengthDelta !== 0 || lineFeedDelta !== 0)) {
    if (page.nodes[x.parent].left === xIndex) {
      page.nodes[x.parent] = {
        ...page.nodes[x.parent],
      };
      page.nodes[x.parent].leftCharCount += lengthDelta;
      page.nodes[x.parent].leftLineFeedCount += lineFeedDelta;
    }

    xIndex = x.parent;
    x = { ...page.nodes[xIndex] };
    page.nodes[xIndex] = x;
  }

  return page;
}

/**
 * Calculates the character count for the node and its subtree.
 * @param page The page/piece table
 * @param index The index of the node in the `node` array of the page/piece table to find the character count for.
 */
export function calculateCharCount(page: PageContent, index: number): number {
  if (index === SENTINEL_INDEX) {
    return 0;
  }
  const node = page.nodes[index];
  return (
    node.leftCharCount + node.length + calculateCharCount(page, node.right)
  );
}

/**
 * Calculates the line feed count for the node and its subtree.
 * @param page The page/piece table
 * @param index The index of the node in the `node` array of the page/piece table to find the line feed count for.
 */
export function calculateLineFeedCount(
  page: PageContent,
  index: number,
): number {
  if (index === SENTINEL_INDEX) {
    return 0;
  }
  const node = page.nodes[index];
  return (
    node.leftLineFeedCount +
    node.lineFeedCount +
    calculateLineFeedCount(page, node.right)
  );
}

/**
 * The index of the sentinel node in the `nodes` array of a page/piece table.
 */
export const SENTINEL_INDEX = 0;

/**
 * The sentinel node of red-black trees.
 */
export const SENTINEL: Node = {
  bufferIndex: 0,
  start: { column: 0, line: 0 },
  end: { column: 0, line: 0 },
  leftCharCount: 0,
  leftLineFeedCount: 0,
  length: 0,
  lineFeedCount: 0,
  color: Color.Black,
  parent: SENTINEL_INDEX,
  left: SENTINEL_INDEX,
  right: SENTINEL_INDEX,
};

export function resetSentinel(page: PageContent): void {
  page.nodes[0] = SENTINEL;
}

/**
 * Finds the minimum of the subtree given by the `xIndex`
 * @param page The piece table/page.
 * @param xIndex The index from which to find the minimum of that subtree.
 */
export function treeMinimum(
  page: PageContent,
  xIndex: number,
): { node: Node; index: number } {
  let x = page.nodes[xIndex];
  while (x.left !== SENTINEL_INDEX) {
    xIndex = x.left;
    x = page.nodes[xIndex];
  }
  return { node: x, index: xIndex };
}

export function updateTreeMetadata(
  page: PageContent,
  xIndex: number,
  delta: number,
  lineFeedCntDelta: number,
): PageContent {
  // node length change or line feed count change
  while (xIndex !== page.root && xIndex !== SENTINEL_INDEX) {
    const x = page.nodes[xIndex];
    if (page.nodes[x.parent].left === xIndex) {
      page.nodes[x.parent] = {
        ...page.nodes[x.parent],
        leftCharCount: page.nodes[x.parent].leftCharCount + delta,
        leftLineFeedCount:
          page.nodes[x.parent].leftLineFeedCount + lineFeedCntDelta,
      };
    }

    xIndex = x.parent;
  }
  return page;
}

/**
 * Gets the number of line feeds before a logical offset.
 * Returns `-1` if nodePosition.remainder === nodePosition.nodeStartOffset.
 * @param page The page/piece table.
 * @param nodePosition The position of the node which contains the offset.
 * @param startLocalOffset The logical offset inside the entire piece table.
 * @param endLocalOffset The logical offset inside the entire piece table.
 */
export function getLineFeedCountBetweenOffsets(
  page: PageContent,
  node: Node,
  startLocalOffset: number,
  endLocalOffset: number,
): number {
  const buffer = page.buffers[node.bufferIndex];
  let counter = 0;
  buffer.lineStarts.forEach((x: number) => {
    if (startLocalOffset <= x && x < endLocalOffset) {
      counter++;
    } else if (startLocalOffset <= x) {
      return counter;
    }
  });
  return counter;
}
