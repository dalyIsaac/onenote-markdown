import { Node, RedBlackTree } from "../pageModel";

/**
 * Represents a buffer for a piece table.
 */
export interface Buffer {
  /**
   * Indicates whether this buffer is an **original content** or an
   * **added content** buffer.
   */
  isReadOnly: boolean;

  /**
   * The characters at which there is a line start.
   */
  lineStarts: number[];

  /**
   * The content of the buffer.
   */
  content: string;
}

/**
 * Represents a location inside a buffer.
 */
export interface BufferCursor {
  line: number;
  column: number;
}

export function isContentNode(node: Node): node is ContentNode {
  return (node as ContentNode).leftCharCount !== undefined;
}

export function isContentRedBlackTree(
  tree: RedBlackTree<Node>,
): tree is RedBlackTree<ContentNode> {
  return isContentNode(tree.nodes[0]);
}

/**
 * Represents a "piece" inside the piece table.
 */
export interface ContentNode extends Node {
  /**
   * The index of the buffer which this node refers to.
   */
  bufferIndex: number;

  /**
   * The start cursor for this piece, within the buffer.
   */
  start: BufferCursor;

  /**
   * The end cursor for this piece, within the buffer.
   */
  end: BufferCursor;

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
}
