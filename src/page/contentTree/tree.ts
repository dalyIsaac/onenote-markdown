/**
 * Contains common items.
 */

import { Color, PageContent, PageContentMutable } from "../pageModel";
import { SENTINEL_INDEX } from "../tree/tree";
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
          nodeStartOffset,
          remainder: 0,
        };
      }
    } else if (nodes[x].leftCharCount + nodes[x].length > offset) {
      // note, the vscode nodeAt function uses >= instead of >
      nodeStartOffset += nodes[x].leftCharCount;
      return {
        node: nodes[x],
        nodeIndex: x,
        nodeStartOffset,
        remainder: offset - nodes[x].leftCharCount,
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
          nodeStartOffset: oldNodeStartOffset,
          remainder: nodes[oldXIndex].length,
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
    nodeStartOffset: 0,
    remainder: 0,
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
 * Gets the contents of a node.
 * @param nodeIndex The index of the node in `page.nodes`.
 * @param page The page/piece table.
 */
export function getNodeContent(nodeIndex: number, page: PageContent): string {
  if (nodeIndex === SENTINEL_INDEX) {
    return "";
  }
  const node = page.content.nodes[nodeIndex];
  const buffer = page.buffers[node.bufferIndex];
  const startOffset = getOffsetInBuffer(node.bufferIndex, node.start, page);
  const endOffset = getOffsetInBuffer(node.bufferIndex, node.end, page);
  const currentContent = buffer.content.slice(startOffset, endOffset);
  return currentContent;
}

/**
 * Calculates the character count for the node and its subtrees.
 * @param tree The red-black tree for the content.
 * @param index The index of the node in the `node` array of the page/piece table to find the character count for.
 */
export function calculateCharCount(
  tree: { nodes: ContentNodeMutable[]; root: number },
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
 * @param index The index of the node in the `node` array of the page/piece table to find the line feed count for.
 */
export function calculateLineFeedCount(
  tree: { nodes: ContentNodeMutable[]; root: number },
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
 * Recomputes the metadata for the tree based on the newly inserted/updated node.
 * @param tree The red-black tree for the content.
 * @param index The index of the node in the `node` array, which is the basis for updating the tree.
 */
export function recomputeContentTreeMetadata(
  tree: { nodes: ContentNodeMutable[]; root: number },
  x: number,
): void {
  let lengthDelta = 0;
  let lineFeedDelta = 0;
  if (x === tree.root) {
    return;
  }
  tree.nodes[x] = { ...tree.nodes[x] };

  // go upwards till the node whose left subtree is changed.
  while (x !== tree.root && x === tree.nodes[tree.nodes[x].parent].right) {
    x = tree.nodes[x].parent;
  }

  if (x === tree.root) {
    // well, it means we add a node to the end (inorder)
    return;
  }

  // tree.nodes[x] is the node whose right subtree is changed.
  x = tree.nodes[x].parent;
  tree.nodes[x] = { ...tree.nodes[x] };

  lengthDelta =
    calculateCharCount(tree, tree.nodes[x].left) - tree.nodes[x].leftCharCount;
  lineFeedDelta =
    calculateLineFeedCount(tree, tree.nodes[x].left) -
    tree.nodes[x].leftLineFeedCount;
  (tree.nodes[x] as ContentNodeMutable).leftCharCount += lengthDelta;
  (tree.nodes[x] as ContentNodeMutable).leftLineFeedCount += lineFeedDelta;

  // go upwards till root. O(logN)
  while (x !== tree.root && (lengthDelta !== 0 || lineFeedDelta !== 0)) {
    if (tree.nodes[tree.nodes[x].parent].left === x) {
      tree.nodes[tree.nodes[x].parent] = {
        ...tree.nodes[tree.nodes[x].parent],
      };
      (tree.nodes[
        tree.nodes[x].parent
      ] as ContentNodeMutable).leftCharCount += lengthDelta;
      (tree.nodes[
        tree.nodes[x].parent
      ] as ContentNodeMutable).leftLineFeedCount += lineFeedDelta;
    }

    x = tree.nodes[x].parent;
    tree.nodes[x] = { ...tree.nodes[x] };
  }

  return;
}

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
  page.content.nodes[0] = SENTINEL_CONTENT;
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
  while (x !== page.content.root && x !== SENTINEL_INDEX) {
    if (page.content.nodes[page.content.nodes[x].parent].left === x) {
      page.content.nodes[page.content.nodes[x].parent] = {
        ...page.content.nodes[page.content.nodes[x].parent],
        leftCharCount:
          page.content.nodes[page.content.nodes[x].parent].leftCharCount +
          charCountDelta,
        leftLineFeedCount:
          page.content.nodes[page.content.nodes[x].parent].leftLineFeedCount +
          lineFeedCountDelta,
      };
    }

    x = page.content.nodes[x].parent;
  }
}
