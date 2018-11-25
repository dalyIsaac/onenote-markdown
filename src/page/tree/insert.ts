import { Color, IBuffer, INode, IPageContent } from "../model";
import { SENTINEL_INDEX } from "../reducer";
import { leftRotate, rightRotate } from "./rotate";
import { getLineStarts, MAX_BUFFER_LENGTH } from "./tree";

export interface IContentInsert {
  content: string;
  offset: number;
}

export function insertContent(
  content: IContentInsert,
  page: IPageContent,
): IPageContent {
  let previouslyInsertedNode: INode | undefined;
  let newPage: IPageContent | undefined;
  if (
    page.previouslyInsertedNodeIndex != null &&
    page.previouslyInsertedNodeOffset != null
  ) {
    previouslyInsertedNode = page.nodes[page.previouslyInsertedNodeIndex];
  }

  if (
    previouslyInsertedNode !== undefined &&
    content.offset ===
      page.previouslyInsertedNodeOffset! + previouslyInsertedNode.length
  ) {
    newPage = insertIntoEndPreviouslyInsertedNode(content, page);
  }

  return newPage ? newPage : page;
}

export function fixInsert(page: IPageContent, xIndex: number): IPageContent {
  page = { ...page };
  page = recomputeTreeMetadata(page, xIndex);
  let nodes = [...page.nodes];
  page.nodes = nodes;
  let x = { ...nodes[xIndex] };
  nodes[xIndex] = x;

  while (
    nodes[nodes[x.parent].parent] &&
    xIndex !== page.root &&
    nodes[x.parent].color === Color.Red
  ) {
    if (x.parent === nodes[nodes[x.parent].parent].left) {
      const yIndex = nodes[nodes[x.parent].parent].right;
      const y = { ...nodes[yIndex] };
      nodes[yIndex] = y;

      if (y.color === Color.Red) {
        nodes[x.parent] = {
          ...nodes[x.parent],
          color: Color.Black,
        };
        y.color = Color.Black;
        nodes[nodes[x.parent].parent] = {
          ...nodes[nodes[x.parent].parent],
          color: Color.Red,
        };
        xIndex = nodes[x.parent].parent;
        x = { ...nodes[xIndex] };
        nodes[xIndex] = x;
      } else {
        if (xIndex === nodes[x.parent].right) {
          xIndex = x.parent;
          x = { ...nodes[xIndex] };
          nodes[xIndex] = x;
          page = leftRotate(page, xIndex);
          nodes = page.nodes;
        }
        nodes[x.parent] = {
          ...nodes[x.parent],
          color: Color.Black,
        };
        nodes[nodes[x.parent].parent] = {
          ...nodes[nodes[x.parent].parent],
          color: Color.Red,
        };
        page = rightRotate(page, nodes[x.parent].parent);
        nodes = page.nodes;
      }
    } else {
      const y = { ...nodes[nodes[nodes[x.parent].parent].left] };
      nodes[nodes[nodes[x.parent].parent].left] = y;

      if (y.color === Color.Red) {
        nodes[x.parent] = {
          ...nodes[x.parent],
          color: Color.Black,
        };
        y.color = Color.Black;
        nodes[nodes[x.parent].parent] = {
          ...nodes[nodes[x.parent].parent],
          color: Color.Red,
        };
        xIndex = nodes[x.parent].parent;
        x = { ...nodes[xIndex] };
        nodes[xIndex] = x;
      } else {
        if (x === nodes[nodes[x.parent].left]) {
          xIndex = x.parent;
          x = { ...nodes[xIndex] };
          nodes[xIndex] = x;
          page = rightRotate(page, xIndex);
          nodes = page.nodes;
        }
        nodes[x.parent] = {
          ...nodes[x.parent],
          color: Color.Black,
        };
        nodes[nodes[x.parent].parent] = {
          ...nodes[nodes[x.parent].parent],
          color: Color.Red,
        };
        page = leftRotate(page, nodes[x.parent].parent);
        nodes = page.nodes;
      }
    }
  }
  nodes[page.root] = {
    ...nodes[page.root],
    color: Color.Black,
  };

  return page;
}

/**
 * Recomputes the metadata for the tree based on the newly inserted node.
 * @param page The page/piece table
 * @param index The index of the node in the `node` array, which is the basis for updating the tree.
 */
export function recomputeTreeMetadata(
  page: IPageContent,
  xIndex: number,
): IPageContent {
  let lengthDelta = 0;
  let lineFeedDelta = 0;
  if (xIndex === page.root) {
    return page;
  }

  const nodes = [...page.nodes];
  let x = { ...nodes[xIndex] };
  nodes[xIndex] = x;

  // go upwards till the node whose left subtree is changed.
  while (xIndex !== page.root && xIndex === nodes[x.parent].right) {
    xIndex = x.parent;
    x = nodes[xIndex];
    // x = { ...nodes[xIndex] };
    // nodes[xIndex] = x;
  }

  if (xIndex === page.root) {
    // well, it means we add a node to the end (inorder)
    return page;
  }

  // x is the node whose right subtree is changed.
  xIndex = x.parent;
  x = { ...nodes[xIndex] };
  nodes[xIndex] = x;

  lengthDelta = calculateCharCount(page, x.left) - x.leftCharCount;
  lineFeedDelta = calculateLineFeedCount(page, x.left) - x.leftLineFeedCount;
  x.leftCharCount += lengthDelta;
  x.leftLineFeedCount += lineFeedDelta;

  // go upwards till root. O(logN)
  while (xIndex !== page.root && (lengthDelta !== 0 || lineFeedDelta !== 0)) {
    if (nodes[x.parent].left === xIndex) {
      nodes[x.parent] = {
        ...nodes[x.parent],
      };
      nodes[x.parent].leftCharCount += lengthDelta;
      nodes[x.parent].leftLineFeedCount += lineFeedDelta;
    }

    xIndex = x.parent;
    x = { ...nodes[xIndex] };
    nodes[xIndex] = x;
  }

  return {
    ...page,
    nodes,
  };
}

/**
 * Calculates the character count for the node and its subtree.
 * @param page The page/piece table
 * @param index The index of the node in the `node` array of the page/piece table to find the character count for.
 */
export function calculateCharCount(page: IPageContent, index: number): number {
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
  page: IPageContent,
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

function insertIntoEndPreviouslyInsertedNode(
  content: IContentInsert,
  page: IPageContent,
): IPageContent {
  // check buffer size
  if (
    content.content.length +
      page.buffers[page.buffers.length - 1].content.length <=
    MAX_BUFFER_LENGTH
  ) {
    // scenario 1: can fit inside the previous buffer
    // appends to the previous node
    // appends to the previous buffer
    const buffer: IBuffer = {
      ...page.buffers[page.buffers.length - 1],
    };
    const newContent = buffer.content + content.content;
    buffer.content = newContent;
    buffer.lineStarts = getLineStarts(newContent, page.newlineFormat);

    const node: INode = {
      ...page.nodes[page.nodes.length - 1],
      end: {
        line: buffer.lineStarts.length - 1,
        column:
          buffer.content.length -
          buffer.lineStarts[buffer.lineStarts.length - 1],
      },
    };
    node.length += content.content.length;

    const newPage: IPageContent = {
      ...page,
    };
    newPage.buffers[newPage.buffers.length - 1] = buffer;
    newPage.nodes[newPage.nodes.length - 1] = node;
    return newPage;
  } else {
    // scenario 2: cannot fit inside the previous buffer
    // creates a new node
    // creates a new buffer
  }
}
