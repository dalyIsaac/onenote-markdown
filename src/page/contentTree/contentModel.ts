import { Node, NodeMutable, RedBlackTreeMutable } from "../pageModel";

/**
 * Mutable objects are only used in constructing the next state.
 * Immutable (interfaces with readonly properties) are used in the state.
 */

//#region Buffer
/**
 * Represents a buffer for a piece table.
 */
export interface Buffer {
  /**
   * Indicates whether this buffer is an **original content** or an **added content** buffer.
   */
  readonly isReadOnly: boolean;

  /**
   * The characters at which there is a line start.
   */
  readonly lineStarts: ReadonlyArray<number>;

  /**
   * The content of the buffer.
   */
  readonly content: string;
}

/**
 * Used for constructing a buffer for a piece table.
 */
export interface BufferMutable {
  /**
   * Indicates whether this buffer is an **original content** or an **added content** buffer.
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

//#endregion

//#region BufferCursor
/**
 * Represents a location inside a buffer.
 */
export interface BufferCursor {
  readonly line: number;
  readonly column: number;
}

/**
 * Used for constructing a location inside a buffer.
 */
export interface BufferCursorMutable {
  line: number;
  column: number;
}

//#endregion

//#region ContentNode
export function isContentNode(node: Node): node is ContentNode {
  return (node as ContentNode).leftCharCount !== undefined;
}

export function isContentRedBlackTreeMutable(
  tree: RedBlackTreeMutable<Node>,
): tree is RedBlackTreeMutable<ContentNode> {
  return isContentNode(tree.nodes[0]);
}

/**
 * Represents a "piece" inside the piece table.
 */
export interface ContentNode extends Node {
  /**
   * The index of the buffer which this node refers to.
   */
  readonly bufferIndex: number;

  /**
   * The start cursor for this piece, within the buffer.
   */
  readonly start: BufferCursor;

  /**
   * The end cursor for this piece, within the buffer.
   */
  readonly end: BufferCursor;

  /**
   * The count of the number of characters in the left subtree of this node.
   */
  readonly leftCharCount: number;

  /**
   * The count of the number of line feeds in the left subtree of this node.
   */
  readonly leftLineFeedCount: number;

  /**
   * The number of characters in this node/piece.
   */
  readonly length: number;

  /**
   * The count of the number of line feeds in this node/piece.
   */
  readonly lineFeedCount: number;
}

export interface ContentNodeMutable extends NodeMutable {
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

//#endregion

export interface ContentRedBlackTreeMutable {
  nodes: ContentNode[];
  root: number;
}

export interface ContentRedBlackTree {
  readonly nodes: ReadonlyArray<ContentNode>;
  readonly root: number;
}
