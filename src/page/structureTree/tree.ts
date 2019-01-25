import { Color } from "../pageModel";
import { SENTINEL_INDEX } from "../tree/tree";
import { StructureNode, StructureNodeMutable } from "./structureModel";

export const SENTINEL_STRUCTURE: StructureNode = {
  color: Color.Black,
  id: "",
  left: SENTINEL_INDEX,
  leftSubTreeLength: 0,
  parent: SENTINEL_INDEX,
  right: SENTINEL_INDEX,
  tag: "",
};

/**
 * Calculates the number of nodes below a node, inclusive.
 * @param tree The red-black tree for the content.
 * @param index The index of the node in the `nodes` array of the red-black tree.
 */
export function calculateLengthDelta(
  tree: {
    nodes: StructureNodeMutable[];
    root: number;
  },
  index: number,
): number {
  if (index === SENTINEL_INDEX) {
    return 0;
  }

  const node = tree.nodes[index];
  return node.leftSubTreeLength + 1 + calculateLengthDelta(tree, node.right);
}
