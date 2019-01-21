/**
 * Contains common items.
 */

import { Color, PageContent, PageContentMutable } from "../pageModel";
import { SENTINEL_INDEX } from "../tree";
import {
  BufferCursor,
  CharValues,
  ContentNode,
  ContentNodeMutable,
  NEWLINE,
} from "./contentModel";

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
  readonly node: ContentNode;

  /**
   * The index of the node inside the array.
   */
  readonly nodeIndex: number;

  /**
   * The remainder between the offset and the character count of the left subtree
   */
  readonly remainder: number;

  /**
   * The offset of the node against the start of the content.
   */
  readonly nodeStartOffset: number;
}

/**
 * Finds the node which contains the offset.
 * @param offset The offset.
 * @param nodes The nodes.
 * @param root The root of the tree.
 */
export function findNodeAtOffset(
  offset: number,
  nodes: ReadonlyArray<ContentNode>,
  root: number,
): NodePositionOffset {
  let x = root;
  let nodeStartOffset = 0;

  while (x !== SENTINEL_INDEX) {
    if (nodes[x].leftCharCount > offset) {
      const oldXIndex = x;
      x = nodes[x].left;
      if (x === SENTINEL_INDEX) {
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
      const oldNodeStartOffset = nodeStartOffset;
      nodeStartOffset += nodes[x].leftCharCount + nodes[x].length;

      const oldXIndex = x;
      x = nodes[x].right;
      if (x === SENTINEL_INDEX) {
        // to the right of the tree
        return {
          node: nodes[oldXIndex],
          nodeIndex: oldXIndex,
          remainder: nodes[oldXIndex].length,
          nodeStartOffset: oldNodeStartOffset,
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
    node: SENTINEL_CONTENT,
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
export function getNewlineFormat(content: string): ReadonlyArray<CharValues> {
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
  newline: ReadonlyArray<CharValues>,
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
  const node = page.contentNodes[nodeIndex];
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
 * Recomputes the metadata for the tree based on the newly inserted/updated node.
 * @param page The page/piece table.
 * @param index The index of the node in the `node` array, which is the basis for updating the tree.
 */
export function recomputeTreeMetadata(
  page: PageContentMutable,
  x: number,
): void {
  let lengthDelta = 0;
  let lineFeedDelta = 0;
  if (x === page.contentRoot) {
    return;
  }
  page.contentNodes[x] = { ...page.contentNodes[x] };

  // go upwards till the node whose left subtree is changed.
  while (
    x !== page.contentRoot &&
    x === page.contentNodes[page.contentNodes[x].parent].right
  ) {
    x = page.contentNodes[x].parent;
  }

  if (x === page.contentRoot) {
    // well, it means we add a node to the end (inorder)
    return;
  }

  // page.nodes[x] is the node whose right subtree is changed.
  x = page.contentNodes[x].parent;
  page.contentNodes[x] = { ...page.contentNodes[x] };

  lengthDelta =
    calculateCharCount(page, page.contentNodes[x].left) -
    page.contentNodes[x].leftCharCount;
  lineFeedDelta =
    calculateLineFeedCount(page, page.contentNodes[x].left) -
    page.contentNodes[x].leftLineFeedCount;
  (page.contentNodes[x] as ContentNodeMutable).leftCharCount += lengthDelta;
  (page.contentNodes[
    x
  ] as ContentNodeMutable).leftLineFeedCount += lineFeedDelta;

  // go upwards till root. O(logN)
  while (x !== page.contentRoot && (lengthDelta !== 0 || lineFeedDelta !== 0)) {
    if (page.contentNodes[page.contentNodes[x].parent].left === x) {
      page.contentNodes[page.contentNodes[x].parent] = {
        ...page.contentNodes[page.contentNodes[x].parent],
      };
      (page.contentNodes[
        page.contentNodes[x].parent
      ] as ContentNodeMutable).leftCharCount += lengthDelta;
      (page.contentNodes[
        page.contentNodes[x].parent
      ] as ContentNodeMutable).leftLineFeedCount += lineFeedDelta;
    }

    x = page.contentNodes[x].parent;
    page.contentNodes[x] = { ...page.contentNodes[x] };
  }

  return;
}

/**
 * Calculates the character count for the node and its subtrees.
 * @param page The page/piece table
 * @param index The index of the node in the `node` array of the page/piece table to find the character count for.
 */
export function calculateCharCount(page: PageContent, index: number): number {
  if (index === SENTINEL_INDEX) {
    return 0;
  }
  const node = page.contentNodes[index];
  return (
    node.leftCharCount + node.length + calculateCharCount(page, node.right)
  );
}

/**
 * Calculates the line feed count for the node and subtrees.
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
  const node = page.contentNodes[index];
  return (
    node.leftLineFeedCount +
    node.lineFeedCount +
    calculateLineFeedCount(page, node.right)
  );
}

/**
 * The sentinel node of red-black trees.
 */
export const SENTINEL_CONTENT: ContentNode = {
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

/**
 * Ensures that the `SENTINEL` node in the piece table is true to the values of the `SENTINEL` node.
 * This function does mutate the `SENTINEL` node, to ensure that `SENTINEL` is a singleton.
 * @param page The page/piece table which contains the `SENTINEL` node.
 */
export function resetSentinel(page: PageContentMutable): void {
  (SENTINEL_CONTENT as ContentNodeMutable).bufferIndex = 0;
  (SENTINEL_CONTENT as ContentNodeMutable).start = { column: 0, line: 0 };
  (SENTINEL_CONTENT as ContentNodeMutable).end = { column: 0, line: 0 };
  (SENTINEL_CONTENT as ContentNodeMutable).leftCharCount = 0;
  (SENTINEL_CONTENT as ContentNodeMutable).leftLineFeedCount = 0;
  (SENTINEL_CONTENT as ContentNodeMutable).length = 0;
  (SENTINEL_CONTENT as ContentNodeMutable).lineFeedCount = 0;
  (SENTINEL_CONTENT as ContentNodeMutable).color = Color.Black;
  (SENTINEL_CONTENT as ContentNodeMutable).parent = SENTINEL_INDEX;
  (SENTINEL_CONTENT as ContentNodeMutable).left = SENTINEL_INDEX;
  (SENTINEL_CONTENT as ContentNodeMutable).right = SENTINEL_INDEX;
  page.contentNodes[0] = SENTINEL_CONTENT;
}

/**
 * Goes up the tree, and updates the metadata of each node.
 * @param page The page/piece table.
 * @param x The index of the current node.
 * @param charCountDelta The character count delta to be applied.
 * @param lineFeedCountDelta The line feed count delta to be applied.
 */
export function updateTreeMetadata(
  page: PageContentMutable,
  x: number,
  charCountDelta: number,
  lineFeedCountDelta: number,
): void {
  // node length change or line feed count change
  while (x !== page.contentRoot && x !== SENTINEL_INDEX) {
    if (page.contentNodes[page.contentNodes[x].parent].left === x) {
      page.contentNodes[page.contentNodes[x].parent] = {
        ...page.contentNodes[page.contentNodes[x].parent],
        leftCharCount:
          page.contentNodes[page.contentNodes[x].parent].leftCharCount +
          charCountDelta,
        leftLineFeedCount:
          page.contentNodes[page.contentNodes[x].parent].leftLineFeedCount +
          lineFeedCountDelta,
      };
    }

    x = page.contentNodes[x].parent;
  }
}
