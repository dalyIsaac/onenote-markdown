/**
 * Associated Unicode values for various characters.
 */
export enum CharValues {
  LF = 0x0a,
  CR = 0x0d,
}

/**
 * Unicode sequences for various newline (EOL) formats.
 */
export const NEWLINE = {
  CRLF: [CharValues.CR, CharValues.LF],
  LF: [CharValues.LF],
};

/**
 * Represents a buffer for a piece table.
 */
export interface IBuffer {
  isReadOnly: boolean;
  lineStarts: number[];
  value: string;
}

/**
 * Represents a location inside a buffer.
 */
export interface IBufferCursor {
  column: number;
  line: number;
}

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
  leftLFCount: number;

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
 * Represents the piece table for a single Onenote page.
 */
export interface IPageContent {
  /**
   * Array of the buffers for the piece table.
   */
  buffers: IBuffer[];

  /**
   * The newline format, which is determined by the received content from the Microsoft Graph.
   */
  newlineFormat: CharValues[];

  /**
   * The nodes of the piece table.
   */
  nodes: INode[];

  /**
   * The index of the root node for the piece table for this page.
   */
  root: number;
}

/**
 * Represents the content of all the piece tables.
 */
export interface IStatePages {
  [key: string]: IPageContent;
}
