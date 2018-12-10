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
export interface NodePositionOffset {
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
 * Contains a node and its index in a page/piece table.
 */
export interface NodePosition {
  node: Node;
  index: number;
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
): NodePositionOffset {
  let x = root;
  let nodeStartOffset = 0;

  while (x !== SENTINEL_INDEX) {
    if (nodes[x].leftCharCount > offset) {
      const oldXIndex = x;
      x = nodes[x].left;
      if (nodes[x]) {
        nodes[x] = nodes[x];
      } else {
        // to the left of the tree
        return {
          node: nodes[x],
          nodeIndex: oldXIndex,
          remainder: 0,
          nodeStartOffset,
        };
      }
    } else if (nodes[x].leftCharCount + nodes[x].length > offset) {
      // note, the vscode nodeAt function uses >= instead of >
      nodeStartOffset += nodes[x].leftCharCount;
      return {
        node: nodes[x],
        nodeIndex: x,
        remainder: offset - nodes[x].leftCharCount,
        nodeStartOffset,
      };
    } else {
      offset -= nodes[x].leftCharCount + nodes[x].length;
      nodeStartOffset += nodes[x].leftCharCount + nodes[x].length;

      const oldXIndex = x;
      x = nodes[x].right;
      if (nodes[x]) {
        nodes[x] = nodes[x];
      } else {
        // to the right of the tree
        return {
          node: nodes[x],
          nodeIndex: oldXIndex,
          remainder: nodes[x].length,
          nodeStartOffset,
        };
      }
    }
  }
  // tslint:disable-next-line:no-console
  console.error(
    `Reaching here means that \`nodes[x]\` is a SENTINEL node, and stored inside the piece table's \`nodes\` array.`,
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
): number {
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
  x: number,
): PageContent {
  let lengthDelta = 0;
  let lineFeedDelta = 0;
  if (x === page.root) {
    return page;
  }
  page.nodes = [...page.nodes];
  page.nodes[x] = { ...page.nodes[x] };
  page.nodes[x] = page.nodes[x];

  // go upwards till the node whose left subtree is changed.
  while (
    x !== page.root &&
    x === page.nodes[page.nodes[x].parent].right &&
    x !== SENTINEL_INDEX
  ) {
    x = page.nodes[x].parent;
    page.nodes[x] = page.nodes[x];
  }

  if (x === page.root) {
    // well, it means we add a node to the end (inorder)
    return page;
  }

  // page.nodes[x] is the node whose right subtree is changed.
  x = page.nodes[x].parent;
  page.nodes[x] = { ...page.nodes[x] };
  page.nodes[x] = page.nodes[x];

  lengthDelta =
    calculateCharCount(page, page.nodes[x].left) - page.nodes[x].leftCharCount;
  lineFeedDelta =
    calculateLineFeedCount(page, page.nodes[x].left) -
    page.nodes[x].leftLineFeedCount;
  page.nodes[x].leftCharCount += lengthDelta;
  page.nodes[x].leftLineFeedCount += lineFeedDelta;

  // go upwards till root. O(logN)
  while (x !== page.root && (lengthDelta !== 0 || lineFeedDelta !== 0)) {
    if (page.nodes[page.nodes[x].parent].left === x) {
      page.nodes[page.nodes[x].parent] = {
        ...page.nodes[page.nodes[x].parent],
      };
      page.nodes[page.nodes[x].parent].leftCharCount += lengthDelta;
      page.nodes[page.nodes[x].parent].leftLineFeedCount += lineFeedDelta;
    }

    x = page.nodes[x].parent;
    page.nodes[x] = { ...page.nodes[x] };
    page.nodes[x] = page.nodes[x];
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
export const SENTINEL: Node = getSentinel();

/**
 * Returns `SENTINEL` every time.
 */
function getSentinel(): Node {
  return {
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
}

/**
 * Ensures that the `SENTINEL` node in the piece table is true to the values of the `SENTINEL` node.
 * @param page The page/piece table which contains the `SENTINEL` node.
 */
export function resetSentinel(page: PageContent): void {
  page.nodes[0] = getSentinel();
}

/**
 * Finds the minimum of the subtree given by the `x`
 * @param page The piece table/page.
 * @param x The index from which to find the minimum of that subtree.
 */
export function treeMinimum(page: PageContent, x: number): NodePosition {
  page.nodes[x] = page.nodes[x];
  while (page.nodes[x].left !== SENTINEL_INDEX) {
    x = page.nodes[x].left;
    page.nodes[x] = page.nodes[x];
  }
  return { node: page.nodes[x], index: x };
}

/**
 * Finds the maximum of the subtree given by the `x`
 * @param page The piece table/page.
 * @param x The index from which to find the maximum of that subtree.
 */
export function treeMaximum(page: PageContent, x: number): NodePosition {
  page.nodes[x] = page.nodes[x];
  while (page.nodes[x].right !== SENTINEL_INDEX) {
    x = page.nodes[x].right;
    page.nodes[x] = page.nodes[x];
  }
  return { node: page.nodes[x], index: x };
}

/**
 * Goes up the tree, and updates the metadata of each node.
 * @param page The page/piece table.
 * @param x The index of the current node.
 * @param charCountDelta The character count delta to be applied.
 * @param lineFeedCountDelta The line feed count delta to be applied.
 */
export function updateTreeMetadata(
  page: PageContent,
  x: number,
  charCountDelta: number,
  lineFeedCountDelta: number,
): PageContent {
  // node length change or line feed count change
  while (x !== page.root && x !== SENTINEL_INDEX) {
    page.nodes[x] = page.nodes[x];
    if (page.nodes[page.nodes[x].parent].left === x) {
      page.nodes[page.nodes[x].parent] = {
        ...page.nodes[page.nodes[x].parent],
        leftCharCount:
          page.nodes[page.nodes[x].parent].leftCharCount + charCountDelta,
        leftLineFeedCount:
          page.nodes[page.nodes[x].parent].leftLineFeedCount +
          lineFeedCountDelta,
      };
    }

    x = page.nodes[x].parent;
  }
  return page;
}

/**
 * Gets the next node of a red-black tree, given the current node's index.
 * @param page The page/piece table.
 * @param currentNode The index of the current node in the `page.nodes` array.
 */
export function nextNode(page: PageContent, currentNode: number): NodePosition {
  if (page.nodes[currentNode].right !== SENTINEL_INDEX) {
    return treeMinimum(page, page.nodes[currentNode].right);
  }

  while (page.nodes[currentNode].parent !== SENTINEL_INDEX) {
    if (page.nodes[page.nodes[currentNode].parent].left === currentNode) {
      break;
    }

    currentNode = page.nodes[currentNode].parent;
    page.nodes[currentNode] = page.nodes[currentNode];
  }

  if (page.nodes[currentNode].parent === SENTINEL_INDEX) {
    return { node: SENTINEL, index: SENTINEL_INDEX };
  } else {
    return {
      index: page.nodes[currentNode].parent,
      node: page.nodes[page.nodes[currentNode].parent],
    };
  }
}

/**
 * Gets the previous node of a red-black tree, given the current node's index.
 * @param page The page/piece table.
 * @param currentNode The index of the current node in the `page.nodes` array.
 */
export function prevNode(page: PageContent, currentNode: number): NodePosition {
  if (page.nodes[currentNode].left !== SENTINEL_INDEX) {
    return treeMaximum(page, page.nodes[currentNode].left);
  }

  while (page.nodes[currentNode].parent !== SENTINEL_INDEX) {
    if (page.nodes[page.nodes[currentNode].parent].right === currentNode) {
      break;
    }

    currentNode = page.nodes[currentNode].parent;
  }

  if (page.nodes[currentNode].parent === SENTINEL_INDEX) {
    return { node: SENTINEL, index: SENTINEL_INDEX };
  } else {
    return {
      index: page.nodes[currentNode].parent,
      node: page.nodes[page.nodes[currentNode].parent],
    };
  }
}
