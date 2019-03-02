import { SENTINEL_INDEX } from "../tree/tree";
import { isContentRedBlackTree } from "../contentTree/contentModel";
import { isStructureRedBlackTree } from "../structureTree/structureModel";
import { Node, RedBlackTree } from "../pageModel";

/**
 * Performs a left rotation on the red-black tree, on the given node.
 * @param page The page/piece table.
 * @param nodeIndex The index of the node in the array for which the left
 * rotation is performed on.
 */
export function leftRotate<T extends Node>(
  tree: RedBlackTree<T>,
  nodeIndex: number,
): void {
  const x = nodeIndex;

  if (tree.nodes[x].right === SENTINEL_INDEX) {
    //  you can't left rotate
    return;
  }

  const y = tree.nodes[x].right;

  if (isContentRedBlackTree(tree)) {
    tree.nodes[y].leftCharCount +=
      tree.nodes[x].leftCharCount + tree.nodes[x].length;
    tree.nodes[y].leftLineFeedCount +=
      tree.nodes[x].leftLineFeedCount + tree.nodes[x].lineFeedCount;
  } else if (isStructureRedBlackTree(tree)) {
    tree.nodes[y].leftSubTreeLength += tree.nodes[x].leftSubTreeLength + 1;
  }

  tree.nodes[x].right = tree.nodes[y].left;
  if (tree.nodes[y].left !== SENTINEL_INDEX) {
    tree.nodes[tree.nodes[y].left].parent = x;
  }

  (tree.nodes[y] as Node).parent = tree.nodes[x].parent;
  if (tree.nodes[x].parent === SENTINEL_INDEX) {
    tree.root = y;
  } else if (x === tree.nodes[tree.nodes[x].parent].left) {
    tree.nodes[tree.nodes[x].parent].left = y;
  } else {
    tree.nodes[tree.nodes[x].parent].right = y;
  }

  (tree.nodes[y] as Node).left = x;
  tree.nodes[x].parent = y;
}

/**
 * Performs a right rotation on the red-black tree, on the given node.
 * @param page The page/piece table.
 * @param nodeIndex The index of the node in the array for which the right
 * rotation is performed on.
 */
export function rightRotate<T extends Node>(
  tree: RedBlackTree<T>,
  nodeIndex: number,
): void {
  const y = nodeIndex;

  if (tree.nodes[y].left === SENTINEL_INDEX) {
    // you can't right rotate
    return;
  }

  const x = tree.nodes[y].left;

  if (isContentRedBlackTree(tree)) {
    tree.nodes[y].leftCharCount -=
      tree.nodes[x].leftCharCount + tree.nodes[x].length;
    tree.nodes[y].leftLineFeedCount -=
      tree.nodes[x].leftLineFeedCount + tree.nodes[x].lineFeedCount;
  } else if (isStructureRedBlackTree(tree)) {
    tree.nodes[y].leftSubTreeLength -= tree.nodes[x].leftSubTreeLength + 1;
  }

  (tree.nodes[y] as Node).left = tree.nodes[x].right;

  if (tree.nodes[x].right !== SENTINEL_INDEX) {
    tree.nodes[tree.nodes[x].right].parent = y;
  }

  tree.nodes[x].parent = tree.nodes[y].parent;

  if (tree.nodes[y].parent === SENTINEL_INDEX) {
    tree.root = x;
  } else if (y === tree.nodes[tree.nodes[y].parent].right) {
    tree.nodes[tree.nodes[y].parent].right = x;
  } else {
    tree.nodes[tree.nodes[y].parent].left = x;
  }
  tree.nodes[x].right = y;
  (tree.nodes[y] as Node).parent = x;
}
