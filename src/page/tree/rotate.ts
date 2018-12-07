import { PageContent } from "../model";
import { SENTINEL_INDEX } from "./tree";

/**
 * Performs a left rotation on the red-black tree, on the given node.
 * @param pieceTable The page/piece table.
 * @param nodeIndex The index of the node in the array for which the left rotation is performed on.
 */
export function leftRotate(
  pieceTable: PageContent,
  nodeIndex: number,
): PageContent {
  pieceTable.nodes = [...pieceTable.nodes];

  const x = nodeIndex;
  pieceTable.nodes[x] = { ...pieceTable.nodes[x] };

  if (pieceTable.nodes[x].right === SENTINEL_INDEX) {
    //  you can't left rotate
    return pieceTable;
  }
  const y = pieceTable.nodes[x].right;
  pieceTable.nodes[y] = { ...pieceTable.nodes[y] };

  let root = pieceTable.root;

  // fix leftCharCount
  pieceTable.nodes[y].leftCharCount +=
    pieceTable.nodes[x].leftCharCount + pieceTable.nodes[x].length;
  pieceTable.nodes[y].leftLineFeedCount +=
    pieceTable.nodes[x].leftLineFeedCount + pieceTable.nodes[x].lineFeedCount;

  pieceTable.nodes[x].right = pieceTable.nodes[y].left;
  if (pieceTable.nodes[y].left !== SENTINEL_INDEX) {
    pieceTable.nodes[pieceTable.nodes[y].left] = {
      ...pieceTable.nodes[pieceTable.nodes[y].left],
      parent: x,
    };
  }
  pieceTable.nodes[y].parent = pieceTable.nodes[x].parent;
  if (pieceTable.nodes[x].parent === SENTINEL_INDEX) {
    root = y;
  } else if (x === pieceTable.nodes[pieceTable.nodes[x].parent].left) {
    pieceTable.nodes[pieceTable.nodes[x].parent] = {
      ...pieceTable.nodes[pieceTable.nodes[x].parent],
      left: y,
    };
  } else {
    pieceTable.nodes[pieceTable.nodes[x].parent] = {
      ...pieceTable.nodes[pieceTable.nodes[x].parent],
      right: y,
    };
  }
  pieceTable.nodes[y].left = x;
  pieceTable.nodes[x].parent = y;

  pieceTable.nodes[x] = pieceTable.nodes[x];
  pieceTable.nodes[y] = pieceTable.nodes[y];

  return {
    ...pieceTable,
    root,
  };
}

/**
 * Performs a right rotation on the red-black tree, on the given node.
 * @param pieceTable The page/piece table.
 * @param nodeIndex The index of the node in the array for which the right rotation is performed on.
 */
export function rightRotate(
  pieceTable: PageContent,
  nodeIndex: number,
): PageContent {
  const nodes = [...pieceTable.nodes];

  const y = nodeIndex;
  pieceTable.nodes[y] = { ...nodes[y] };

  if (pieceTable.nodes[y].left === SENTINEL_INDEX) {
    // you can't right rotate
    return pieceTable;
  }
  const x = pieceTable.nodes[y].left;
  pieceTable.nodes[x] = { ...nodes[x] };

  let root = pieceTable.root;

  pieceTable.nodes[y].left = pieceTable.nodes[x].right;
  if (pieceTable.nodes[x].right !== SENTINEL_INDEX) {
    nodes[pieceTable.nodes[x].right] = {
      ...nodes[pieceTable.nodes[x].right],
      parent: y,
    };
  }
  pieceTable.nodes[x].parent = pieceTable.nodes[y].parent;

  // fix leftCharCount
  pieceTable.nodes[y].leftCharCount -=
    pieceTable.nodes[x].leftCharCount + pieceTable.nodes[x].length;
  pieceTable.nodes[y].leftLineFeedCount -=
    pieceTable.nodes[x].leftLineFeedCount + pieceTable.nodes[x].lineFeedCount;

  if (pieceTable.nodes[y].parent === SENTINEL_INDEX) {
    root = x;
  } else if (y === nodes[pieceTable.nodes[y].parent].right) {
    nodes[pieceTable.nodes[y].parent] = {
      ...nodes[pieceTable.nodes[y].parent],
      right: x,
    };
  } else {
    nodes[pieceTable.nodes[y].parent] = {
      ...nodes[pieceTable.nodes[y].parent],
      left: x,
    };
  }
  pieceTable.nodes[x].right = y;
  pieceTable.nodes[y].parent = x;

  nodes[y] = pieceTable.nodes[y];
  nodes[x] = pieceTable.nodes[x];

  return {
    ...pieceTable,
    nodes,
    root,
  };
}
