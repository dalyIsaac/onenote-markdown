import { Color, IBufferCursor, IPageContent } from "./model";

/**
 * Represents a "piece" inside the piece table.
 */
export interface INode {
  /**
   * The index of the buffer which this node refers to.
   */
  bufferIndex: number;

  /**
   * The start cursor for this piece, within the buffer.
   */
  start: IBufferCursor;

  /**
   * The end cursor for this piece, within the buffer.
   */
  end: IBufferCursor;

  /**
   * The count of the number of characters in the left subtree of this node.
   */
  leftCharCount: number;

  /**
   * The count of the number of line feeds in the left subtree of this node.
   */
  leftLineFeedCount: number;

  /**
   * The number of characters in this node/piece.
   */
  length: number;

  /**
   * The count of the number of line feeds in this node/piece.
   */
  lineFeedCount: number;

  /**
   * The color of this node in the tree.
   */
  color: Color;

  /**
   * The index of the parent to this node, in the piece table's `nodes` array.
   */
  parent: number;

  /**
   * The index of the left child to this node, in the piece table's `nodes` array.
   */
  left: number;

  /**
   * The index of the right child to this node, in the piece table's `nodes` array.
   */
  right: number;
}

/**
 * Returns the node for this index, in the given piece table.
 * @param nodeIndex The index of the node.
 * @param pieceTable The piece which contains the node.
 */
export function getNode(nodeIndex: number, pieceTable: IPageContent): INode {
  return pieceTable.nodes[nodeIndex];
}

/**
 * Returns the parent node for the node at the given index, in the given piece table.
 * @param nodeIndex The index of the node.
 * @param pieceTable The piece which contains the node.
 */
export function getParent(nodeIndex: number, pieceTable: IPageContent): INode {
  const node = pieceTable.nodes[nodeIndex];
  const parent = pieceTable.nodes[node.parent];
  return parent;
}

/**
 * Returns the left node for the node at the given index, in the given piece table.
 * @param nodeIndex The index of the node.
 * @param pieceTable The piece which contains the node.
 */
export function getLeft(nodeIndex: number, pieceTable: IPageContent): INode {
  const node = pieceTable.nodes[nodeIndex];
  const left = pieceTable.nodes[node.left];
  return left;
}

/**
 * Returns the right node for the node at the given index, in the given piece table.
 * @param nodeIndex The index of the node.
 * @param pieceTable The piece which contains the node.
 */
export function getRight(nodeIndex: number, pieceTable: IPageContent): INode {
  const node = pieceTable.nodes[nodeIndex];
  const right = pieceTable.nodes[node.right];
  return right;
}

/**
 * Updates the parent for this node.
 * This should be used when you do not have the node itself, just the node's index.
 * @param nodeIndex The index of the node in the `nodes` array for this page.
 * @param newParentNodeIndex The index of the new parent in the `nodes` array for this page.
 * @param pieceTable The piece table for this page's contents.
 */
export function updateParent(
  nodeIndex: number,
  newParentNodeIndex: number,
  pieceTable: IPageContent,
) {
  pieceTable.nodes[nodeIndex].parent = newParentNodeIndex;
}

/**
 * Updates the left child for this node.
 * This should be used when you do not have the node itself, just the node's index.
 * @param nodeIndex The index of the node in the `nodes` array for this page.
 * @param newLeftNodeIndex The index of the new left child in the `nodes` array for this page.
 * @param pieceTable The piece table for this page's contents.
 */
export function updateLeftChild(
  nodeIndex: number,
  newLeftNodeIndex: number,
  pieceTable: IPageContent,
) {
  pieceTable.nodes[nodeIndex].left = newLeftNodeIndex;
}

/**
 * Updates the right child for this node.
 * This should be used when you do not have the node itself, just the node's index.
 * @param nodeIndex The index of the node in the `nodes` array for this page.
 * @param newRightNodeIndex The index of the new right child in the `nodes` array for this page.
 * @param pieceTable The piece table for this page's contents.
 */
export function updateRightChild(
  nodeIndex: number,
  newRightNodeIndex: number,
  pieceTable: IPageContent,
) {
  pieceTable.nodes[nodeIndex].right = newRightNodeIndex;
}
