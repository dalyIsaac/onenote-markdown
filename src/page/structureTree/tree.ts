import { Color, RedBlackTree, PageContent } from "../pageModel";
import {
  SENTINEL_INDEX,
  inorderTreeTraversal,
  NodePosition,
  getNextNode,
  getPrevNode,
} from "../tree/tree";
import { StructureNode, TagType } from "./structureModel";
import { alea } from "seedrandom";

export const SENTINEL_STRUCTURE: StructureNode = {
  color: Color.Black,
  id: "SENTINEL",
  left: SENTINEL_INDEX,
  leftSubTreeLength: 0,
  length: 0,
  parent: SENTINEL_INDEX,
  right: SENTINEL_INDEX,
  tag: "",
  tagType: TagType.StartEndTag,
};

/**
 * Calculates the number of nodes below a node, inclusive.
 * @param tree The red-black tree for the content.
 * @param index The index of the node in the `nodes` array of the red-black
 * tree.
 */
export function calculateLengthCount(
  tree: RedBlackTree<StructureNode>,
  index: number,
): number {
  if (index === SENTINEL_INDEX) {
    return 0;
  }

  const node = tree.nodes[index];
  return 1 + node.leftSubTreeLength + calculateLengthCount(tree, node.right);
}

/**
 * Ensures that the `SENTINEL` node in the piece table is true to the values of
 * the `SENTINEL` node. This function does mutate the `SENTINEL` node, to ensure
 * that `SENTINEL` is a singleton.
 * @param tree The red-black tree for the content.
 */
export function resetSentinelStructure(
  tree: RedBlackTree<StructureNode>,
): void {
  SENTINEL_STRUCTURE.color = Color.Black;
  SENTINEL_STRUCTURE.id = "SENTINEL";
  SENTINEL_STRUCTURE.left = SENTINEL_INDEX;
  SENTINEL_STRUCTURE.leftSubTreeLength = 0;
  SENTINEL_STRUCTURE.parent = SENTINEL_INDEX;
  SENTINEL_STRUCTURE.right = SENTINEL_INDEX;
  SENTINEL_STRUCTURE.tag = "";
  SENTINEL_STRUCTURE.tagType = TagType.StartEndTag;
  tree.nodes[0] = SENTINEL_STRUCTURE;
}

/**
 * Goes up the tree, and updates the metadata of each node.
 * @param tree The red-black tree for the structure.
 * @param x The index of the current node.
 * @param lengthDelta The length delta to be applied.
 */
export function updateStructureTreeMetadata(
  tree: RedBlackTree<StructureNode>,
  x: number,
  lengthDelta: number,
): void {
  // node length change or line feed count change
  while (x !== tree.root && x !== SENTINEL_INDEX) {
    if (tree.nodes[tree.nodes[x].parent].left === x) {
      tree.nodes[tree.nodes[x].parent].leftSubTreeLength =
        tree.nodes[tree.nodes[x].parent].leftSubTreeLength + lengthDelta;
    }
    x = tree.nodes[x].parent;
  }
}

/**
 * Finds the corresponding end node for a given id. Returns `null` if the `id`
 * cannot be found.
 * @param id The `id` of the `StructureNode`.
 * @param startIndex The `id` of the start `StructureNode`.
 */
export function findEndNode(
  tree: RedBlackTree<StructureNode>,
  id: string,
  startIndex: number,
): NodePosition<StructureNode> | null {
  const { index: indexAfterStart } = getNextNode(tree.nodes, startIndex);
  for (const { index, node } of inorderTreeTraversal(tree, indexAfterStart)) {
    if (node.id === id) {
      return { index, node };
    }
  }
  return null;
}

const aleaGen = alea(Date.now().toString());

/**
 * Generates a new `id` for a `StructureNode`. This is only to be used
 * locally, and will not be synced to the Microsoft Graph.
 */
export function generateNewId(): string {
  return `{!localGeneratedId}${aleaGen()}`;
}

/**
 * Updates the start node, with the new tag, and the end node if it exists.
 * @param page The page.
 * @param nodeIndex The index of the start `StructureNode`.
 * @param newTag The new tag.
 */
export function updateNodePairTag(
  page: PageContent,
  nodeIndex: number,
  newTag: string,
): void {
  const startNode = page.structure.nodes[nodeIndex];
  startNode.tag = newTag;
  const endNodePosition = findEndNode(page.structure, startNode.id, nodeIndex);
  if (endNodePosition) {
    endNodePosition.node.tag = newTag;
  }
}

/**
 * Gets the previous `StartTag` or `StartEndTag` from the page.
 * @param page The page which contains the `StructureNode`s.
 * @param nodeIndex The index of the node, from whom the previous start node
 * will be retrieved.
 */
export function getPrevStartNode(
  page: PageContent,
  nodeIndex: number,
): NodePosition<StructureNode> {
  let prev = getPrevNode(page.structure.nodes, nodeIndex);
  while (prev.node.tagType === TagType.EndTag) {
    prev = getPrevNode(page.structure.nodes, prev.index);
  }
  return prev;
}
