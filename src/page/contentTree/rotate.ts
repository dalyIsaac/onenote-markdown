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

  if (page.contentNodes[x].right === SENTINEL_INDEX) {
    //  you can't left rotate
    return;
  }

  page.contentNodes[x] = { ...page.contentNodes[x] };

  const y = page.contentNodes[x].right;
  page.contentNodes[y] = {
    ...page.contentNodes[y],
    leftCharCount:
      page.contentNodes[y].leftCharCount +
      page.contentNodes[x].leftCharCount +
      page.contentNodes[x].length,
    leftLineFeedCount:
      page.contentNodes[y].leftLineFeedCount +
      page.contentNodes[x].leftLineFeedCount +
      page.contentNodes[x].lineFeedCount,
  };

  (page.contentNodes[x] as ContentNodeMutable).right =
    page.contentNodes[y].left;
  if (page.contentNodes[y].left !== SENTINEL_INDEX) {
    page.contentNodes[page.contentNodes[y].left] = {
      ...page.contentNodes[page.contentNodes[y].left],
      parent: x,
    };
  }

  (page.contentNodes[y] as ContentNodeMutable).parent =
    page.contentNodes[x].parent;
  if (page.contentNodes[x].parent === SENTINEL_INDEX) {
    page.contentRoot = y;
  } else if (x === page.contentNodes[page.contentNodes[x].parent].left) {
    page.contentNodes[page.contentNodes[x].parent] = {
      ...page.contentNodes[page.contentNodes[x].parent],
      left: y,
    };
  } else {
    page.contentNodes[page.contentNodes[x].parent] = {
      ...page.contentNodes[page.contentNodes[x].parent],
      right: y,
    };
  }

  (page.contentNodes[y] as ContentNodeMutable).left = x;
  (page.contentNodes[x] as ContentNodeMutable).parent = y;
}

/**
 * Performs a right rotation on the red-black tree, on the given node.
 * @param page The page/piece table.
 * @param nodeIndex The index of the node in the array for which the right rotation is performed on.
 */
export function rightRotate(page: PageContentMutable, nodeIndex: number): void {
  const y = nodeIndex;

  if (page.contentNodes[y].left === SENTINEL_INDEX) {
    // you can't right rotate
    return;
  }

  page.contentNodes[y] = { ...page.contentNodes[y] };

  const x = page.contentNodes[y].left;
  page.contentNodes[x] = { ...page.contentNodes[x] };

  (page.contentNodes[y] as ContentNodeMutable).left =
    page.contentNodes[x].right;
  if (page.contentNodes[x].right !== SENTINEL_INDEX) {
    page.contentNodes[page.contentNodes[x].right] = {
      ...page.contentNodes[page.contentNodes[x].right],
      parent: y,
    };
  }
  (page.contentNodes[x] as ContentNodeMutable).parent =
    page.contentNodes[y].parent;

  (page.contentNodes[y] as ContentNodeMutable).leftCharCount -=
    page.contentNodes[x].leftCharCount + page.contentNodes[x].length;
  (page.contentNodes[y] as ContentNodeMutable).leftLineFeedCount -=
    page.contentNodes[x].leftLineFeedCount + page.contentNodes[x].lineFeedCount;

  if (page.contentNodes[y].parent === SENTINEL_INDEX) {
    page.contentRoot = x;
  } else if (y === page.contentNodes[page.contentNodes[y].parent].right) {
    page.contentNodes[page.contentNodes[y].parent] = {
      ...page.contentNodes[page.contentNodes[y].parent],
      right: x,
    };
  } else {
    page.contentNodes[page.contentNodes[y].parent] = {
      ...page.contentNodes[page.contentNodes[y].parent],
      left: x,
    };
  }
  (page.contentNodes[x] as ContentNodeMutable).right = y;
  (page.contentNodes[y] as ContentNodeMutable).parent = x;

  page.contentNodes[y] = page.contentNodes[y];
  page.contentNodes[x] = page.contentNodes[x];
}
