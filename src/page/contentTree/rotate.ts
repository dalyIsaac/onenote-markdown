import { PageContentMutable } from "../pageModel";
import { SENTINEL_INDEX } from "../tree";
import { ContentNodeMutable } from "./contentModel";

/**
 * Performs a left rotation on the red-black tree, on the given node.
 * @param page The page/piece table.
 * @param nodeIndex The index of the node in the array for which the left rotation is performed on.
 */
export function leftRotate(page: PageContentMutable, nodeIndex: number): void {
  const x = nodeIndex;

  if (page.content.nodes[x].right === SENTINEL_INDEX) {
    //  you can't left rotate
    return;
  }

  page.content.nodes[x] = { ...page.content.nodes[x] };

  const y = page.content.nodes[x].right;
  page.content.nodes[y] = {
    ...page.content.nodes[y],
    leftCharCount:
      page.content.nodes[y].leftCharCount +
      page.content.nodes[x].leftCharCount +
      page.content.nodes[x].length,
    leftLineFeedCount:
      page.content.nodes[y].leftLineFeedCount +
      page.content.nodes[x].leftLineFeedCount +
      page.content.nodes[x].lineFeedCount,
  };

  (page.content.nodes[x] as ContentNodeMutable).right =
    page.content.nodes[y].left;
  if (page.content.nodes[y].left !== SENTINEL_INDEX) {
    page.content.nodes[page.content.nodes[y].left] = {
      ...page.content.nodes[page.content.nodes[y].left],
      parent: x,
    };
  }

  (page.content.nodes[y] as ContentNodeMutable).parent =
    page.content.nodes[x].parent;
  if (page.content.nodes[x].parent === SENTINEL_INDEX) {
    page.content.root = y;
  } else if (x === page.content.nodes[page.content.nodes[x].parent].left) {
    page.content.nodes[page.content.nodes[x].parent] = {
      ...page.content.nodes[page.content.nodes[x].parent],
      left: y,
    };
  } else {
    page.content.nodes[page.content.nodes[x].parent] = {
      ...page.content.nodes[page.content.nodes[x].parent],
      right: y,
    };
  }

  (page.content.nodes[y] as ContentNodeMutable).left = x;
  (page.content.nodes[x] as ContentNodeMutable).parent = y;
}

/**
 * Performs a right rotation on the red-black tree, on the given node.
 * @param page The page/piece table.
 * @param nodeIndex The index of the node in the array for which the right rotation is performed on.
 */
export function rightRotate(page: PageContentMutable, nodeIndex: number): void {
  const y = nodeIndex;

  if (page.content.nodes[y].left === SENTINEL_INDEX) {
    // you can't right rotate
    return;
  }

  page.content.nodes[y] = { ...page.content.nodes[y] };

  const x = page.content.nodes[y].left;
  page.content.nodes[x] = { ...page.content.nodes[x] };

  (page.content.nodes[y] as ContentNodeMutable).left =
    page.content.nodes[x].right;
  if (page.content.nodes[x].right !== SENTINEL_INDEX) {
    page.content.nodes[page.content.nodes[x].right] = {
      ...page.content.nodes[page.content.nodes[x].right],
      parent: y,
    };
  }
  (page.content.nodes[x] as ContentNodeMutable).parent =
    page.content.nodes[y].parent;

  (page.content.nodes[y] as ContentNodeMutable).leftCharCount -=
    page.content.nodes[x].leftCharCount + page.content.nodes[x].length;
  (page.content.nodes[y] as ContentNodeMutable).leftLineFeedCount -=
    page.content.nodes[x].leftLineFeedCount +
    page.content.nodes[x].lineFeedCount;

  if (page.content.nodes[y].parent === SENTINEL_INDEX) {
    page.content.root = x;
  } else if (y === page.content.nodes[page.content.nodes[y].parent].right) {
    page.content.nodes[page.content.nodes[y].parent] = {
      ...page.content.nodes[page.content.nodes[y].parent],
      right: x,
    };
  } else {
    page.content.nodes[page.content.nodes[y].parent] = {
      ...page.content.nodes[page.content.nodes[y].parent],
      left: x,
    };
  }
  (page.content.nodes[x] as ContentNodeMutable).right = y;
  (page.content.nodes[y] as ContentNodeMutable).parent = x;

  page.content.nodes[y] = page.content.nodes[y];
  page.content.nodes[x] = page.content.nodes[x];
}
