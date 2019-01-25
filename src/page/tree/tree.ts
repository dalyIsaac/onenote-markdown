import {
  SENTINEL_CONTENT,
  calculateCharCount,
  calculateLineFeedCount,
} from "../contentTree/tree";
import { Node, NodeMutable } from "../pageModel";
import { ContentNodeMutable, isContentNode } from "../contentTree/contentModel";
import {
  isStructureNode,
  StructureNodeMutable,
} from "../structureTree/structureModel";
import { calculateLengthDelta } from "../structureTree/tree";

/**
 * The index of the sentinel node in the `nodes` array of a page/piece table.
 */
export const SENTINEL_INDEX = 0;

/**
 * Contains a node and its index in a page/piece table.
 */
export interface NodePosition {
  readonly node: Node;
  readonly index: number;
}

/**
 * Finds the minimum of the subtree given by the `x`
 * @param nodes The red-black tree.
 * @param x The index from which to find the minimum of that subtree.
 */
export function treeMinimum(
  nodes: ReadonlyArray<Node>,
  x: number,
): NodePosition {
  while (nodes[x].left !== SENTINEL_INDEX) {
    x = nodes[x].left;
  }
  return { index: x, node: nodes[x] };
}

/**
 * Finds the maximum of the subtree given by the `x`
 * @param nodes The red-black tree.
 * @param x The index from which to find the maximum of that subtree.
 */
export function treeMaximum(
  nodes: ReadonlyArray<Node>,
  x: number,
): NodePosition {
  while (nodes[x].right !== SENTINEL_INDEX) {
    x = nodes[x].right;
  }
  return { index: x, node: nodes[x] };
}

/**
 * Gets the next node of a red-black tree, given the current node's index.
 * @param nodes The red-black tree.
 * @param currentNode The index of the current node in the `nodes` array.
 */
export function nextNode(
  nodes: ReadonlyArray<Node>,
  currentNode: number,
): NodePosition {
  if (nodes[currentNode].right !== SENTINEL_INDEX) {
    return treeMinimum(nodes, nodes[currentNode].right);
  }

  while (nodes[currentNode].parent !== SENTINEL_INDEX) {
    if (nodes[nodes[currentNode].parent].left === currentNode) {
      break;
    }

    currentNode = nodes[currentNode].parent;
  }

  if (nodes[currentNode].parent === SENTINEL_INDEX) {
    return { index: SENTINEL_INDEX, node: SENTINEL_CONTENT };
  } else {
    return {
      index: nodes[currentNode].parent,
      node: nodes[nodes[currentNode].parent],
    };
  }
}

/**
 * Gets the previous node of a red-black tree, given the current node's index.
 * @param nodes The red-black tree.
 * @param currentNode The index of the current node in the `nodes` array.
 */
export function prevNode(
  nodes: ReadonlyArray<Node>,
  currentNode: number,
): NodePosition {
  if (nodes[currentNode].left !== SENTINEL_INDEX) {
    return treeMaximum(nodes, nodes[currentNode].left);
  }

  while (nodes[currentNode].parent !== SENTINEL_INDEX) {
    if (nodes[nodes[currentNode].parent].right === currentNode) {
      break;
    }

    currentNode = nodes[currentNode].parent;
  }

  if (nodes[currentNode].parent === SENTINEL_INDEX) {
    return { index: SENTINEL_INDEX, node: SENTINEL_CONTENT };
  } else {
    return {
      index: nodes[currentNode].parent,
      node: nodes[nodes[currentNode].parent],
    };
  }
}

/**
 * Recomputes the metadata for the tree based on the newly inserted/updated node.
 * @param tree The red-black tree for the content.
 * @param index The index of the node in the `node` array, which is the basis for updating the tree.
 */
export function recomputeContentTreeMetadata(
  tree: {
    nodes: NodeMutable[];
    root: number;
  },
  x: number,
): void {
  // content node
  let lengthDelta: number | undefined;
  let lineFeedDelta: number | undefined;

  if (x === tree.root) {
    return;
  }

  tree.nodes[x] = { ...tree.nodes[x] }; // go upwards till the node whose left subtree is changed.

  while (x !== tree.root && x === tree.nodes[tree.nodes[x].parent].right) {
    x = tree.nodes[x].parent;
  }

  if (x === tree.root) {
    // well, it means we add a node to the end (inorder)
    return;
  } // tree.nodes[x] is the node whose right subtree is changed.

  x = tree.nodes[x].parent;
  tree.nodes[x] = { ...tree.nodes[x] };

  if (isContentNode(tree.nodes[x])) {
    lengthDelta =
      calculateCharCount(
        tree as { nodes: ContentNodeMutable[]; root: number },
        tree.nodes[x].left,
      ) - (tree.nodes[x] as ContentNodeMutable).leftCharCount;
    lineFeedDelta =
      calculateLineFeedCount(
        tree as { nodes: ContentNodeMutable[]; root: number },
        tree.nodes[x].left,
      ) - (tree.nodes[x] as ContentNodeMutable).leftLineFeedCount;
    (tree.nodes[x] as ContentNodeMutable).leftCharCount += lengthDelta;
    (tree.nodes[x] as ContentNodeMutable).leftLineFeedCount += lineFeedDelta; // go upwards till root. O(logN)
  } else if (isStructureNode(tree.nodes[x])) {
    lengthDelta =
      calculateLengthDelta(
        tree as { nodes: StructureNodeMutable[]; root: number },
        tree.nodes[x].left,
      ) - (tree.nodes[x] as StructureNodeMutable).leftSubTreeLength;
    (tree.nodes[x] as StructureNodeMutable).leftSubTreeLength += lengthDelta;
  }

  if (length !== undefined && !(lengthDelta !== 0 || lineFeedDelta !== 0)) {
    return;
  }

  while (x !== tree.root) {
    if (tree.nodes[tree.nodes[x].parent].left === x) {
      tree.nodes[tree.nodes[x].parent] = {
        ...tree.nodes[tree.nodes[x].parent],
      };

      if (isContentNode(tree.nodes[x])) {
        (tree.nodes[
          tree.nodes[x].parent
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        ] as ContentNodeMutable).leftCharCount += lengthDelta!;
        (tree.nodes[
          tree.nodes[x].parent
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        ] as ContentNodeMutable).leftLineFeedCount += lineFeedDelta!;
      } else if (isStructureNode(tree.nodes[x])) {
        (tree.nodes[
          tree.nodes[x].parent
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        ] as StructureNodeMutable).leftSubTreeLength += lengthDelta!;
      }
    }

    x = tree.nodes[x].parent;
    tree.nodes[x] = { ...tree.nodes[x] };
  }
}
