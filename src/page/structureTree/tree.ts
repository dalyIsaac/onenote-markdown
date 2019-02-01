import { Color, RedBlackTree, RedBlackTreeMutable } from "../pageModel";
import { SENTINEL_INDEX } from "../tree/tree";
import { StructureNode, TagType, StructureNodeMutable } from "./structureModel";

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
 * @param index The index of the node in the `nodes` array of the red-black tree.
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
 * Ensures that the `SENTINEL` node in the piece table is true to the values of the `SENTINEL` node.
 * This function does mutate the `SENTINEL` node, to ensure that `SENTINEL` is a singleton.
 * @param tree The red-black tree for the content.
 */
export function resetSentinelStructure(
  tree: RedBlackTreeMutable<StructureNodeMutable>,
): void {
  (SENTINEL_STRUCTURE as StructureNodeMutable).color = Color.Black;
  (SENTINEL_STRUCTURE as StructureNodeMutable).id = "SENTINEL";
  (SENTINEL_STRUCTURE as StructureNodeMutable).left = SENTINEL_INDEX;
  (SENTINEL_STRUCTURE as StructureNodeMutable).leftSubTreeLength = 0;
  (SENTINEL_STRUCTURE as StructureNodeMutable).parent = SENTINEL_INDEX;
  (SENTINEL_STRUCTURE as StructureNodeMutable).right = SENTINEL_INDEX;
  (SENTINEL_STRUCTURE as StructureNodeMutable).tag = "";
  (SENTINEL_STRUCTURE as StructureNodeMutable).tagType = TagType.StartEndTag;
  tree.nodes[0] = SENTINEL_STRUCTURE;
}

/**
 * Goes up the tree, and updates the metadata of each node.
 * @param tree The red-black tree for the structure.
 * @param x The index of the current node.
 * @param lengthDelta The length delta to be applied.
 */
export function updateStructureTreeMetadata(
  tree: RedBlackTreeMutable<StructureNodeMutable>,
  x: number,
  lengthDelta: number,
): void {
  // node length change or line feed count change
  while (x !== tree.root && x !== SENTINEL_INDEX) {
    if (tree.nodes[tree.nodes[x].parent].left === x) {
      tree.nodes[tree.nodes[x].parent] = {
        ...tree.nodes[tree.nodes[x].parent],
        leftSubTreeLength:
          tree.nodes[tree.nodes[x].parent].leftSubTreeLength + lengthDelta,
      };
    }

    x = tree.nodes[x].parent;
  }
}
