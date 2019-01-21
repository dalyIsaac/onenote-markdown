import {
  Buffer,
  CharValues,
  InternalTreeNode,
} from "./internalTree/internalTreeModel";

//#region Node

export interface Node {
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
}

export interface NodeMutable {
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

//#endregion

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
  readonly nodes: ReadonlyArray<InternalTreeNode>;

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
  nodes: InternalTreeNode[];

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

//#endregion

/**
 * Possible node colors, inside the red and black tree.
 */
export enum Color {
  Red = 0,
  Black = 1,
}

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
