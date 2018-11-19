import { IPageContent } from "../model";
import { SENTINEL_INDEX } from "../reducer";

export function leftRotate(pieceTable: IPageContent, nodeIndex: number) {
  const nodes = pieceTable.nodes;
  const xIndex = nodeIndex;
  const x = nodes[xIndex];
  const yIndex = x.right;
  const y = nodes[yIndex];

  // fix leftCharCount
  y.leftCharCount += x.leftCharCount + x.length;
  y.leftLineFeedCount += x.leftLineFeedCount + x.lineFeedCount;

  x.right = y.left;
  if (y.left !== SENTINEL_INDEX) {
    nodes[y.left].parent = xIndex;
  }
  y.parent = x.parent;
  if (x.parent === SENTINEL_INDEX) {
    pieceTable.root = yIndex;
  } else if (xIndex === nodes[x.parent].left) {
    nodes[x.parent].left = yIndex;
  } else {
    nodes[x.parent].right = yIndex;
  }
  y.left = xIndex;
  x.parent = yIndex;
}

export function rightRotate(pieceTable: IPageContent, nodeIndex: number) {
  const nodes = pieceTable.nodes;
  const yIndex = nodeIndex;
  const y = nodes[yIndex];
  const xIndex = y.left;
  const x = nodes[xIndex];

  y.left = x.right;
  if (x.right !== SENTINEL_INDEX) {
    nodes[x.right].parent = yIndex;
  }
  x.parent = y.parent;

  // fix leftCharCount
  y.leftCharCount -= x.leftCharCount + x.length;
  y.leftLineFeedCount -= x.leftLineFeedCount + x.lineFeedCount;

  if (y.parent === SENTINEL_INDEX) {
    pieceTable.root = xIndex;
  } else if (yIndex === nodes[y.parent].right) {
    nodes[y.parent].right = xIndex;
  } else {
    nodes[y.parent].left = xIndex;
  }
  x.right = yIndex;
  y.parent = xIndex;
}
