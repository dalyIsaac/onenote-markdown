import { PageContent } from "../model";
import { SENTINEL_INDEX } from "./tree";

/**
 * Performs a left rotation on the red-black tree, on the given node.
 * @param page The page/piece table.
 * @param nodeIndex The index of the node in the array for which the left rotation is performed on.
 */
export function leftRotate(page: PageContent, nodeIndex: number): PageContent {
  page.nodes = [...page.nodes];

  const x = nodeIndex;
  page.nodes[x] = { ...page.nodes[x] };

  if (page.nodes[x].right === SENTINEL_INDEX) {
    //  you can't left rotate
    return page;
  }
  const y = page.nodes[x].right;
  page.nodes[y] = { ...page.nodes[y] };

  let root = page.root;

  // fix leftCharCount
  page.nodes[y].leftCharCount +=
    page.nodes[x].leftCharCount + page.nodes[x].length;
  page.nodes[y].leftLineFeedCount +=
    page.nodes[x].leftLineFeedCount + page.nodes[x].lineFeedCount;

  page.nodes[x].right = page.nodes[y].left;
  if (page.nodes[y].left !== SENTINEL_INDEX) {
    page.nodes[page.nodes[y].left] = {
      ...page.nodes[page.nodes[y].left],
      parent: x,
    };
  }
  page.nodes[y].parent = page.nodes[x].parent;
  if (page.nodes[x].parent === SENTINEL_INDEX) {
    root = y;
  } else if (x === page.nodes[page.nodes[x].parent].left) {
    page.nodes[page.nodes[x].parent] = {
      ...page.nodes[page.nodes[x].parent],
      left: y,
    };
  } else {
    page.nodes[page.nodes[x].parent] = {
      ...page.nodes[page.nodes[x].parent],
      right: y,
    };
  }
  page.nodes[y].left = x;
  page.nodes[x].parent = y;

  page.nodes[x] = page.nodes[x];
  page.nodes[y] = page.nodes[y];

  return {
    ...page,
    root,
  };
}

/**
 * Performs a right rotation on the red-black tree, on the given node.
 * @param page The page/piece table.
 * @param nodeIndex The index of the node in the array for which the right rotation is performed on.
 */
export function rightRotate(page: PageContent, nodeIndex: number): PageContent {
  const nodes = [...page.nodes];

  const y = nodeIndex;
  page.nodes[y] = { ...nodes[y] };

  if (page.nodes[y].left === SENTINEL_INDEX) {
    // you can't right rotate
    return page;
  }
  const x = page.nodes[y].left;
  page.nodes[x] = { ...nodes[x] };

  let root = page.root;

  page.nodes[y].left = page.nodes[x].right;
  if (page.nodes[x].right !== SENTINEL_INDEX) {
    nodes[page.nodes[x].right] = {
      ...nodes[page.nodes[x].right],
      parent: y,
    };
  }
  page.nodes[x].parent = page.nodes[y].parent;

  // fix leftCharCount
  page.nodes[y].leftCharCount -=
    page.nodes[x].leftCharCount + page.nodes[x].length;
  page.nodes[y].leftLineFeedCount -=
    page.nodes[x].leftLineFeedCount + page.nodes[x].lineFeedCount;

  if (page.nodes[y].parent === SENTINEL_INDEX) {
    root = x;
  } else if (y === nodes[page.nodes[y].parent].right) {
    nodes[page.nodes[y].parent] = {
      ...nodes[page.nodes[y].parent],
      right: x,
    };
  } else {
    nodes[page.nodes[y].parent] = {
      ...nodes[page.nodes[y].parent],
      left: x,
    };
  }
  page.nodes[x].right = y;
  page.nodes[y].parent = x;

  nodes[y] = page.nodes[y];
  nodes[x] = page.nodes[x];

  return {
    ...page,
    nodes,
    root,
  };
}
