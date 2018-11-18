import { INode } from "./node";

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

export enum Color {
  Red,
  Black,
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
