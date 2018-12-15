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
export interface Buffer {
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

/**
 * Represents a location inside a buffer.
 */
export interface BufferCursor {
  column: number;
  line: number;
}

/**
 * Possible node colors, inside the red and black tree.
 */
export enum Color {
  Red = 0,
  Black = 1,
}

/**
 * Represents a "piece" inside the piece table.
 */
export interface Node {
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
 * Represents the piece table for a single Onenote page.
 */
export interface PageContent {
  /**
   * Array of the buffers for the piece table.
   */
  buffers: Buffer[];

  /**
   * The newline format, which is determined by the received content from the Microsoft Graph.
   */
  newlineFormat: CharValues[];

  /**
   * The nodes of the piece table. The first node is always the `SENTINEL` node.
   */
  nodes: Node[];

  /**
   * The index of the root node for the piece table for this page.
   * When the tree is empty, the root will be `SENTINEL_INDEX`.
   */
  root: number;

  /**
   * The index of the last node which had content inserted into it.
   * `null` if another operation which wasn't an insert was performed.
   */
  previouslyInsertedNodeIndex: number | null;

  /**
   * The logical offset of the last node which had content inserted into it.
   * `null` if another operation which wasn't an insert was performed.
   */
  previouslyInsertedNodeOffset: number | null;
}

/**
 * Represents the content of all the piece tables.
 */
export interface StatePages {
  [key: string]: PageContent;
}
