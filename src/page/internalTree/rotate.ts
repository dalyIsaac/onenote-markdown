import { PageContentMutable } from "../pageModel";
import { InternalTreeNodeMutable } from "./internalTreeModel";
import { SENTINEL_INDEX } from "./tree";

/**
 * Performs a left rotation on the red-black tree, on the given node.
 * @param page The page/piece table.
 * @param nodeIndex The index of the node in the array for which the left rotation is performed on.
 */
export function leftRotate(page: PageContentMutable, nodeIndex: number): void {
  const x = nodeIndex;

  if (page.nodes[x].right === SENTINEL_INDEX) {
    //  you can't left rotate
    return;
  }

  page.nodes[x] = { ...page.nodes[x] };

  const y = page.nodes[x].right;
  page.nodes[y] = {
    ...page.nodes[y],
    leftCharCount:
      page.nodes[y].leftCharCount +
      page.nodes[x].leftCharCount +
      page.nodes[x].length,
    leftLineFeedCount:
      page.nodes[y].leftLineFeedCount +
      page.nodes[x].leftLineFeedCount +
      page.nodes[x].lineFeedCount,
  };

  (page.nodes[x] as InternalTreeNodeMutable).right = page.nodes[y].left;
  if (page.nodes[y].left !== SENTINEL_INDEX) {
    page.nodes[page.nodes[y].left] = {
      ...page.nodes[page.nodes[y].left],
      parent: x,
    };
  }

  (page.nodes[y] as InternalTreeNodeMutable).parent = page.nodes[x].parent;
  if (page.nodes[x].parent === SENTINEL_INDEX) {
    page.root = y;
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

  (page.nodes[y] as InternalTreeNodeMutable).left = x;
  (page.nodes[x] as InternalTreeNodeMutable).parent = y;
}

/**
 * Performs a right rotation on the red-black tree, on the given node.
 * @param page The page/piece table.
 * @param nodeIndex The index of the node in the array for which the right rotation is performed on.
 */
export function rightRotate(page: PageContentMutable, nodeIndex: number): void {
  const y = nodeIndex;

  if (page.nodes[y].left === SENTINEL_INDEX) {
    // you can't right rotate
    return;
  }

  page.nodes[y] = { ...page.nodes[y] };

  const x = page.nodes[y].left;
  page.nodes[x] = { ...page.nodes[x] };

  (page.nodes[y] as InternalTreeNodeMutable).left = page.nodes[x].right;
  if (page.nodes[x].right !== SENTINEL_INDEX) {
    page.nodes[page.nodes[x].right] = {
      ...page.nodes[page.nodes[x].right],
      parent: y,
    };
  }
  (page.nodes[x] as InternalTreeNodeMutable).parent = page.nodes[y].parent;

  (page.nodes[y] as InternalTreeNodeMutable).leftCharCount -=
    page.nodes[x].leftCharCount + page.nodes[x].length;
  (page.nodes[y] as InternalTreeNodeMutable).leftLineFeedCount -=
    page.nodes[x].leftLineFeedCount + page.nodes[x].lineFeedCount;

  if (page.nodes[y].parent === SENTINEL_INDEX) {
    page.root = x;
  } else if (y === page.nodes[page.nodes[y].parent].right) {
    page.nodes[page.nodes[y].parent] = {
      ...page.nodes[page.nodes[y].parent],
      right: x,
    };
  } else {
    page.nodes[page.nodes[y].parent] = {
      ...page.nodes[page.nodes[y].parent],
      left: x,
    };
  }
  (page.nodes[x] as InternalTreeNodeMutable).right = y;
  (page.nodes[y] as InternalTreeNodeMutable).parent = x;

  page.nodes[y] = page.nodes[y];
  page.nodes[x] = page.nodes[x];
}
