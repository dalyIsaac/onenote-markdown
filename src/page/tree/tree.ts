import {
  calculateCharCount,
  calculateLineFeedCount,
  resetSentinelContent,
} from "../contentTree/tree";
import {
  Node,
  NodeMutable,
  RedBlackTreeMutable,
  RedBlackTree,
} from "../pageModel";
import {
  ContentNodeMutable,
  isContentRedBlackTreeMutable,
  isContentNode,
} from "../contentTree/contentModel";
import {
  StructureNodeMutable,
  isStructureRedBlackTreeMutable,
  isStructureNode,
} from "../structureTree/structureModel";
import {
  calculateLengthCount,
  resetSentinelStructure,
} from "../structureTree/tree";

/**
 * The index of the sentinel node in the `nodes` array of a page/piece table.
 */
export const SENTINEL_INDEX = 0;

/**
 * The root of the tree when there are no nodes in the tree.
 */
export const EMPTY_TREE_ROOT = -1;

/**
 * Contains a node and its index in a red-black tree.
 */
export interface NodePosition<T extends Node> {
  readonly node: T;
  readonly index: number;
}

/**
 * Finds the minimum of the subtree given by the `x`
 * @param nodes The red-black tree.
 * @param x The index from which to find the minimum of that subtree.
 */
export function treeMinimum<T extends Node>(
  nodes: ReadonlyArray<T>,
  x: number,
): NodePosition<T> {
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
export function treeMaximum<T extends Node>(
  nodes: ReadonlyArray<T>,
  x: number,
): NodePosition<T> {
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
export function nextNode<T extends Node>(
  nodes: ReadonlyArray<T>,
  currentNode: number,
): NodePosition<T> {
  if (nodes[currentNode].right !== SENTINEL_INDEX) {
    return treeMinimum<T>(nodes, nodes[currentNode].right);
  }

  while (nodes[currentNode].parent !== SENTINEL_INDEX) {
    if (nodes[nodes[currentNode].parent].left === currentNode) {
      break;
    }

    currentNode = nodes[currentNode].parent;
  }

  if (nodes[currentNode].parent === SENTINEL_INDEX) {
    return { index: SENTINEL_INDEX, node: nodes[0] }; // SENTINEL node
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
export function prevNode<T extends Node>(
  nodes: ReadonlyArray<T>,
  currentNode: number,
): NodePosition<T> {
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
    return { index: SENTINEL_INDEX, node: nodes[0] };
  } else {
    return {
      index: nodes[currentNode].parent,
      node: nodes[nodes[currentNode].parent],
    };
  }
}

/**
 * Recomputes the metadata for the tree based on the newly inserted/updated
 * node.
 * @param tree The red-black tree for the content.
 * @param index The index of the node in the `node` array, which is the basis
 * for updating the tree.
 */
export function recomputeTreeMetadata<T extends Node>(
  tree: RedBlackTreeMutable<T>,
  x: number,
): void {
  // content node
  let lengthDelta: number | undefined;
  let lineFeedDelta: number | undefined;

  if (x === tree.root) {
    return;
  }

  tree.nodes[x] = { ...tree.nodes[x] };

  while (
    // go upwards till the node whose left subtree is changed.
    x !== tree.root &&
    x === tree.nodes[tree.nodes[x].parent].right &&
    x !== SENTINEL_INDEX
  ) {
    x = tree.nodes[x].parent;
  }

  if (x === tree.root) {
    // well, it means we add a node to the end (inorder)
    return;
  }

  // tree.nodes[x] is the node whose right subtree is changed.
  x = tree.nodes[x].parent;
  tree.nodes[x] = { ...tree.nodes[x] };

  if (isContentRedBlackTreeMutable(tree)) {
    lengthDelta =
      calculateCharCount(tree, tree.nodes[x].left) -
      (tree.nodes[x] as ContentNodeMutable).leftCharCount;
    lineFeedDelta =
      calculateLineFeedCount(tree, tree.nodes[x].left) -
      tree.nodes[x].leftLineFeedCount;
    (tree.nodes[x] as ContentNodeMutable).leftCharCount += lengthDelta;
    (tree.nodes[x] as ContentNodeMutable).leftLineFeedCount += lineFeedDelta;
  } else if (isStructureRedBlackTreeMutable(tree)) {
    lengthDelta =
      calculateLengthCount(tree, tree.nodes[x].left) -
      tree.nodes[x].leftSubTreeLength;
    (tree.nodes[x] as StructureNodeMutable).leftSubTreeLength += lengthDelta;
  }

  if (length !== undefined && !(lengthDelta !== 0 || lineFeedDelta !== 0)) {
    return;
  }

  // go upwards till root. O(logN)
  while (x !== tree.root) {
    if (tree.nodes[tree.nodes[x].parent].left === x) {
      tree.nodes[tree.nodes[x].parent] = {
        ...tree.nodes[tree.nodes[x].parent],
      };

      if (isContentRedBlackTreeMutable(tree)) {
        (tree.nodes[
          tree.nodes[x].parent
        ] as ContentNodeMutable).leftCharCount += lengthDelta!;
        (tree.nodes[
          tree.nodes[x].parent
        ] as ContentNodeMutable).leftLineFeedCount += lineFeedDelta!;
      } else if (isStructureRedBlackTreeMutable(tree)) {
        (tree.nodes[
          tree.nodes[x].parent
        ] as StructureNodeMutable).leftSubTreeLength += lengthDelta!;
      }
    }

    x = tree.nodes[x].parent;
    tree.nodes[x] = { ...tree.nodes[x] };
  }
}

/**
 * Ensures that the `SENTINEL` node in the piece table is true to the values
 * of the `SENTINEL` node. This function does mutate the `SENTINEL` node,
 * to ensure that `SENTINEL` is a singleton.
 * @param tree The red-black tree for the content.
 */
export function resetSentinel<T extends NodeMutable>(
  tree: RedBlackTreeMutable<T>,
): void {
  if (isContentRedBlackTreeMutable(tree)) {
    resetSentinelContent(tree);
  } else if (isStructureRedBlackTreeMutable(tree)) {
    resetSentinelStructure(tree);
  }
}

/**
 * Performs an in-order tree traversal of the given tree.
 * @param startNode The node to start to tree-traversal from.
 */
export function* inorderTreeTraversal<T extends Node>(
  tree: RedBlackTree<T>,
  startNode?: number,
): IterableIterator<{ readonly offset: number } & NodePosition<T>> {
  let value: NodePosition<T>;
  if (startNode) {
    if (startNode >= tree.nodes.length) {
      throw new RangeError(
        `The given start node of ${startNode} is too large for this tree.`,
      );
    }
    value = { index: startNode, node: tree.nodes[startNode] };
  } else {
    value = treeMinimum(tree.nodes, tree.root);
  }
  let offset = 0;
  while (value.index !== SENTINEL_INDEX) {
    yield { ...value, offset };
    if (isContentNode(value.node) || isStructureNode(value.node)) {
      offset += value.node.length;
    }
    value = nextNode(tree.nodes, value.index);
  }
}
