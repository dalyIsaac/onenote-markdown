import { KeyValue } from "../../common";

/**
 * Mutable objects are only used in constructing the next state.
 * Immutable (interfaces with readonly properties) are used in the state.
 */

/**
 * Associated Unicode values for various characters.
 */
export enum CharValues {
  LF = 0x0a,
  CR = 0x0d,
}

interface Newlines {
  [key: string]: ReadonlyArray<CharValues>;
}

/**
 * Unicode sequences for various newline (EOL) formats.
 */
export const NEWLINE: Newlines = {
  CRLF: [CharValues.CR, CharValues.LF],
  LF: [CharValues.LF],
};

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
  readonly column: number;
  readonly line: number;
}

/**
 * Used for constructing a location inside a buffer.
 */
export interface BufferCursorMutable {
  column: number;
  line: number;
}

//#endregion

/**
 * Possible node colors, inside the red and black tree.
 */
export enum Color {
  Red = 0,
  Black = 1,
}

export enum NodeType {
  StartTag = 0,
  EndTag = 1,
  StartEndTag = 2,
  Content = 3,
  Sentinel = -1,
}

//#region Node

/**
 * Represents a node inside the red-black tree.
 */
export interface Node {
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

  /**
   * The color of this node in the tree.
   */
  readonly color: Color;

  /**
   * The index of the parent to this node, in the piece table's `nodes` array.
   */
  readonly parent: number;

  /**
   * The index of the left child to this node, in the piece table's `nodes` array.
   */
  readonly left: number;

  /**
   * The index of the right child to this node, in the piece table's `nodes` array.
   */
  readonly right: number;

  /**
   * The type of tag for this node.
   */
  readonly nodeType: NodeType;
}

/**
 * Represents a "piece" inside the piece table and red-black tree.
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
}

/**
 * Represents an HTML tag inside the red-black tree.
 */
export interface TagNode extends Node {
  /**
   * The HTML tag for this node.
   */
  readonly tag: string;

  /**
   * The HTML properties for this node's tag.
   */
  readonly properties?: KeyValue;

  /**
   * The inline CSS styles for this node's tag.
   */
  readonly styles?: KeyValue;

  /**
   * The id for this node's tag.
   */
  readonly id?: string;
}

/**
 * Union of all the node interfaces.
 */
export type NodeUnion = ContentNode | TagNode;

export interface NodeMutable {
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

  /**
   * The type of tag for this node.
   */
  nodeType: NodeType;
}

/**
 * Represents a "piece" inside the piece table and red-black tree.
 */
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
}

/**
 * Represents an HTML tag inside the red-black tree.
 */
export interface TagNodeMutable extends NodeMutable {
  /**
   * The HTML tag for this node.
   */
  tag: string;

  /**
   * The HTML properties for this node's tag.
   */
  properties?: KeyValue;

  /**
   * The inline CSS styles for this node's tag.
   */
  styles?: KeyValue;

  /**
   * The id for this node's tag.
   */
  id?: string;
}

/**
 * Union of all the mutable node interfaces.
 */
export type NodeUnionMutable = ContentNodeMutable | TagNodeMutable;

//#endregion Node

//#region PageContent

/**
 * Represents the piece table for a single Onenote page.
 */
export interface PageContent {
  /**
   * Array of the buffers for the piece table.
   */
  readonly buffers: ReadonlyArray<Buffer>;

  /**
   * The newline format, which is determined by the received content from the Microsoft Graph.
   */
  readonly newlineFormat: ReadonlyArray<CharValues>;

  /**
   * The nodes of the piece table. The first node is always the `SENTINEL` node.
   */
  readonly nodes: ReadonlyArray<ContentNode | TagNode>;

  /**
   * The index of the root node for the piece table for this page.
   * When the tree is empty, the root will be `SENTINEL_INDEX`.
   */
  readonly root: number;

  /**
   * The index of the last node which had content inserted into it.
   * `null` if another operation which wasn't an insert was performed.
   */
  readonly previouslyInsertedNodeIndex: number | null;

  /**
   * The logical offset of the last node which had content inserted into it.
   * `null` if another operation which wasn't an insert was performed.
   */
  readonly previouslyInsertedNodeOffset: number | null;

  /**
   * The language of the page.
   */
  readonly language?: string;

  /**
   * The title of the page.
   */
  readonly title: string;

  /**
   * The charset of the page.
   */
  readonly charset: string;

  /**
   * The datetime string for when the page was created.
   */
  readonly created: string;

  /**
   * The default font family for this page.
   */
  readonly fontFamily: string;

  /**
   * The default font size for this page.
   */
  readonly fontSize: string;
}

export interface PageContentMutable {
  /**
   * Array of the buffers for the piece table.
   */
  buffers: Buffer[];

  /**
   * The newline format, which is determined by the received content from the Microsoft Graph.
   */
  readonly newlineFormat: ReadonlyArray<CharValues>;

  /**
   * The nodes of the piece table. The first node is always the `SENTINEL` node.
   */
  nodes: Array<ContentNode | TagNode>;

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

  /**
   * The language of the page.
   */
  language?: string;

  /**
   * The title of the page.
   */
  title?: string;

  /**
   * The charset of the page.
   */
  charset?: string;

  /**
   * The datetime string for when the page was created.
   */
  created?: string;

  /**
   * The default font family for this page.
   */
  fontFamily?: string;

  /**
   * The default font size for this page.
   */
  fontSize?: string;
}

//#endregion

//#region StatePages

/**
 * Represents the content of all the piece tables.
 */
export interface StatePages {
  readonly [key: string]: PageContent;
}

/**
 * Represents the content of all the piece tables.
 */
export interface StatePagesMutable {
  [key: string]: PageContent;
}

//#endregion
