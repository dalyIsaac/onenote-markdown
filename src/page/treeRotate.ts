import { IPageContent } from "./model";
import {
  getLeft,
  getNode,
  getRight,
  updateLeftChild,
  updateParent,
  updateRightChild,
} from "./node";
import { SENTINEL_INDEX } from "./reducer";

export function leftRotate(pieceTable: IPageContent, nodeIndex: number) {
  const xIndex = nodeIndex;
  const x = getNode(xIndex, pieceTable);
  const yIndex = x.right;
  const y = getNode(yIndex, pieceTable);

  // fix leftCharCount
  y.leftCharCount += x.leftCharCount + x.length;
  y.leftLineFeedCount += x.leftLineFeedCount + x.lineFeedCount;

  x.right = y.left;
  if (y.left !== SENTINEL_INDEX) {
    updateParent(y.left, xIndex, pieceTable);
  }
  y.parent = x.parent;
  if (x.parent === SENTINEL_INDEX) {
    pieceTable.root = yIndex;
  } else if (getLeft(x.parent, pieceTable) === x) {
    updateLeftChild(x.parent, yIndex, pieceTable);
  } else {
    updateRightChild(x.parent, yIndex, pieceTable);
  }
  updateLeftChild(y.left, xIndex, pieceTable);
  updateParent(x.parent, yIndex, pieceTable);
}

export function rightRotate(pieceTable: IPageContent, nodeIndex: number) {
  const yIndex = nodeIndex;
  const y = getNode(yIndex, pieceTable);
  const xIndex = y.left;
  const x = getNode(xIndex, pieceTable);

  y.left = x.right;
  if (x.right !== SENTINEL_INDEX) {
    updateParent(x.right, yIndex, pieceTable);
  }
  x.parent = y.parent;

  // fix leftCharCount
  y.leftCharCount -= x.leftCharCount + x.length;
  y.leftLineFeedCount -= x.leftLineFeedCount + x.lineFeedCount;

  if (y.parent === SENTINEL_INDEX) {
    pieceTable.root = xIndex;
  } else if (y === getRight(y.parent, pieceTable)) {
    updateRightChild(y.parent, xIndex, pieceTable);
  } else {
    updateLeftChild(y.parent, xIndex, pieceTable);
  }
  x.right = yIndex;
  y.parent = xIndex;
}
