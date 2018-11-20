/**
 * Contains common items.
 */

import { INode, IPageContent } from "../model";
import { SENTINEL } from "../reducer";

export interface INodePosition {
  /**
   * Piece Index
   */
  node: INode;

  /**
   * The index of the node inside the array.
   */
  nodeIndex: number;

  /**
   * The remainder between the offset and the character count of the left subtree
   */
  remainder: number;

  /**
   * The offset of the node against the start of the content.
   */
  nodeStartOffset: number;
}

/**
 * Finds the node which contains the offset.
 * @param offset The offset.
 * @param nodes The nodes.
 * @param root The root of the tree.
 */
export function findNodeAtOffset(
  offset: number,
  nodes: INode[],
  root: number,
): INodePosition {
  let xIndex = root;
  let x: INode = nodes[xIndex];
  let nodeStartOffset = 0;

  while (x !== SENTINEL) {
    if (x.leftCharCount > offset) {
      xIndex = x.left;
      x = nodes[xIndex];
    } else if (x.leftCharCount + x.length > offset) {
      // note, the vscode nodeAt function uses >= instead of >
      nodeStartOffset += x.leftCharCount;
      return {
        node: x,
        nodeIndex: xIndex,
        remainder: offset - x.leftCharCount,
        nodeStartOffset,
      };
    } else {
      offset -= x.leftCharCount + x.length;
      nodeStartOffset += x.leftCharCount + x.length;
      xIndex = x.right;
      x = nodes[xIndex];
    }
  }

  return null!; // this will never be reached - it's just here to make the compiler happy.
}
