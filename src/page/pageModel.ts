import { Buffer, ContentNode } from "./contentTree/contentModel";
import { StructureNode } from "./structureTree/structureModel";

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

export interface RedBlackTree {
  nodes: Node[];
  root: number;
}

/**
 * Represents the piece table for a single Onenote page.
 */
export interface PageContent {
  /**
   * Array of the buffers for the piece table.
   */
  readonly buffers: ReadonlyArray<Buffer>;

  readonly content: {
    /**
     * The nodes of the piece table. The first node is always the `SENTINEL` node.
     */
    readonly nodes: ReadonlyArray<ContentNode>;

    /**
     * The index of the root node for the piece table for this page.
     * When the tree is empty, the root will be `SENTINEL_INDEX`.
     */
    readonly root: number;
  };

  readonly structure: {
    /**
     * The nodes of the red-black tree for the HTML structure.
     */
    readonly nodes: ReadonlyArray<StructureNode>;

    /**
     * The root of the red-black tree for the HTML structure.
     */
    readonly root: number;
  };

  /**
   * The index of the last node which had content inserted into it.
   * `null` if another operation which wasn't an insert was performed.
   */
  readonly previouslyInsertedContentNodeIndex: number | null;

  /**
   * The logical offset of the last node which had content inserted into it.
   * `null` if another operation which wasn't an insert was performed.
   */
  readonly previouslyInsertedContentNodeOffset: number | null;
}

export interface PageContentMutable {
  /**
   * Array of the buffers for the piece table.
   */
  buffers: Buffer[];

  content: {
    /**
     * The nodes of the piece table. The first node is always the `SENTINEL` node.
     */
    nodes: ContentNode[];

    /**
     * The index of the root node for the piece table for this page.
     * When the tree is empty, the root will be `SENTINEL_INDEX`.
     */
    root: number;
  };

  structure: {
    /**
     * The nodes of the red-black tree for the HTML structure.
     */
    nodes: StructureNode[];

    /**
     * The root of the red-black tree for the HTML structure.
     */
    root: number;
  };

  /**
   * The index of the last node which had content inserted into it.
   * `null` if another operation which wasn't an insert was performed.
   */
  previouslyInsertedContentNodeIndex: number | null;

  /**
   * The logical offset of the last node which had content inserted into it.
   * `null` if another operation which wasn't an insert was performed.
   */
  previouslyInsertedContentNodeOffset: number | null;
}
//#endregion

/**
 * Possible node colors, inside the red and black tree.
 */
export enum Color {
  Red = "Red",
  Black = "Black",
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
