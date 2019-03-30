import { Color, RedBlackTree, Node } from "../pageModel";
import {
  SENTINEL_INDEX,
  getNextNode,
  treeMinimum,
  recomputeTreeMetadata,
  resetSentinel,
} from "./tree";
import { leftRotate, rightRotate } from "./rotate";
import { isContentRedBlackTree } from "../contentTree/contentModel";
import {
  calculateCharCount,
  calculateLineFeedCount,
  updateContentTreeMetadata,
} from "../contentTree/tree";
import { isStructureRedBlackTree } from "../structureTree/structureModel";
import {
  calculateLengthCount,
  updateStructureTreeMetadata,
} from "../structureTree/tree";

/**
 * Restores the properties of a red-black tree after the deletion of a node.
 * @param tree The red-black tree.
 * @param x The node to start the fixup from.
 */
export function fixDelete<T extends Node>(
  tree: RedBlackTree<T>,
  x: number,
): void {
  let w: number;
  while (x !== tree.root && tree.nodes[x].color === Color.Black) {
    if (x === tree.nodes[tree.nodes[x].parent].left) {
      w = tree.nodes[tree.nodes[x].parent].right;
      if (tree.nodes[w].color === Color.Red) {
        tree.nodes[w].color = Color.Black;
        tree.nodes[tree.nodes[x].parent].color = Color.Red;
        leftRotate(tree, tree.nodes[x].parent);
        w = tree.nodes[tree.nodes[x].parent].right;
      }
      if (
        tree.nodes[tree.nodes[w].left].color === Color.Black &&
        tree.nodes[tree.nodes[w].right].color === Color.Black
      ) {
        tree.nodes[w].color = Color.Red;
        x = tree.nodes[x].parent;
      } else {
        if (tree.nodes[tree.nodes[w].right].color === Color.Black) {
          tree.nodes[tree.nodes[w].left].color = Color.Black;
          tree.nodes[w].color = Color.Red;
          rightRotate(tree, w);
          w = tree.nodes[tree.nodes[x].parent].right;
        }
        tree.nodes[w].color = tree.nodes[tree.nodes[x].parent].color;
        tree.nodes[tree.nodes[x].parent].color = Color.Black;
        tree.nodes[tree.nodes[w].right].color = Color.Black;
        leftRotate(tree, tree.nodes[x].parent);
        x = tree.root;
      }
    } else {
      w = tree.nodes[tree.nodes[x].parent].left;
      if (tree.nodes[w].color === Color.Red) {
        tree.nodes[w].color = Color.Black;
        tree.nodes[tree.nodes[x].parent].color = Color.Red;
        rightRotate(tree, tree.nodes[x].parent);
        w = tree.nodes[tree.nodes[x].parent].left;
      }
      if (
        tree.nodes[tree.nodes[w].left].color === Color.Black &&
        tree.nodes[tree.nodes[w].right].color === Color.Black
      ) {
        tree.nodes[w].color = Color.Red;
        x = tree.nodes[x].parent;
      } else {
        if (tree.nodes[tree.nodes[w].left].color === Color.Black) {
          tree.nodes[tree.nodes[w].right].color = Color.Black;
          tree.nodes[w].color = Color.Red;
          leftRotate(tree, w);
          w = tree.nodes[tree.nodes[x].parent].left;
        }
        tree.nodes[w].color = tree.nodes[tree.nodes[x].parent].color;
        tree.nodes[tree.nodes[x].parent].color = Color.Black;
        tree.nodes[tree.nodes[w].left].color = Color.Black;
        rightRotate(tree, tree.nodes[x].parent);
        x = tree.root;
      }
    }
  }
  tree.nodes[x].color = Color.Black;
}

/**
 * Sets the color of the node to `Color.BLack`, and sets `parent`, `left`, and
 * `right` to `SENTINEL_INDEX`.
 * @param tree The red-black tree.
 * @param node The index of the node to detach.
 */
export function detach<T extends Node>(
  tree: RedBlackTree<T>,
  node: number,
): void {
  const parent = tree.nodes[tree.nodes[node].parent]; // NEVER ASSIGN TO THIS
  if (parent.left === node) {
    tree.nodes[tree.nodes[node].parent].left = SENTINEL_INDEX;
  } else if (parent.right === node) {
    tree.nodes[tree.nodes[node].parent].right = SENTINEL_INDEX;
  }
  tree.nodes[node].color = Color.Black;
  tree.nodes[node].parent = SENTINEL_INDEX;
  tree.nodes[node].left = SENTINEL_INDEX;
  tree.nodes[node].right = SENTINEL_INDEX;
}

/**
 * Deletes a node from the red-black tree. The node itself still resides inside
 * the piece table, however `parent`, `left`, and `right` will point to
 * `SENTINEL_INDEX`, and no other nodes will point to the deleted node.
 * @param tree The red-black tree.
 * @param z The index of the node to delete.
 */
export function deleteNode<T extends Node>(
  tree: RedBlackTree<T>,
  z: number,
): void {
  let xTemp: number;
  let yTemp: number;

  if (tree.nodes[z].left === SENTINEL_INDEX) {
    yTemp = z;
    tree.nodes[yTemp] = tree.nodes[z];
    xTemp = tree.nodes[yTemp].right;
  } else if (tree.nodes[z].right === SENTINEL_INDEX) {
    yTemp = z;
    tree.nodes[yTemp] = tree.nodes[z];
    xTemp = tree.nodes[yTemp].left;
  } else {
    const result = treeMinimum(tree.nodes, tree.nodes[z].right);
    yTemp = result.index;
    tree.nodes[yTemp] = result.node;
    xTemp = tree.nodes[yTemp].right;
  }

  // This ensures that x and y don't change after this point
  const x = xTemp;
  const y = yTemp;

  if (y === tree.root) {
    tree.root = x; // if page.nodes[x] is null, we are removing the only node

    (tree.nodes[x] as T).color = Color.Black;
    detach(tree, z);
    tree.nodes[tree.root].parent = SENTINEL_INDEX;
    resetSentinel(tree);
    return;
  }

  const yWasRed = tree.nodes[y].color === Color.Red;

  if (y === tree.nodes[tree.nodes[y].parent].left) {
    tree.nodes[tree.nodes[y].parent].left = x;
  } else {
    tree.nodes[tree.nodes[y].parent].right = x;
  }

  if (y === z) {
    tree.nodes[x].parent = tree.nodes[y].parent;
    recomputeTreeMetadata(tree, x);
  } else {
    if (tree.nodes[y].parent === z) {
      tree.nodes[x].parent = y;
    } else {
      tree.nodes[x].parent = tree.nodes[y].parent;
    }
    // as we make changes to page.nodes[x]'s hierarchy, update leftCharCount
    // of subtree first

    recomputeTreeMetadata(tree, x);
    (tree.nodes[y] as T).left = tree.nodes[z].left;
    (tree.nodes[y] as T).right = tree.nodes[z].right;
    (tree.nodes[y] as T).parent = tree.nodes[z].parent;
    (tree.nodes[y] as T).color = tree.nodes[z].color;

    if (z === tree.root) {
      tree.root = y;
    } else {
      if (z === tree.nodes[tree.nodes[z].parent].left) {
        tree.nodes[tree.nodes[z].parent].left = y;
      } else {
        tree.nodes[tree.nodes[z].parent].right = y;
      }
    }

    if (tree.nodes[y].left !== SENTINEL_INDEX) {
      tree.nodes[tree.nodes[y].left].parent = y;
    }

    if (tree.nodes[y].right !== SENTINEL_INDEX) {
      tree.nodes[tree.nodes[y].right].parent = y;
    } // update metadata
    // we replace page.nodes[z] with page.nodes[y], so in this sub tree, the
    // length change is page.nodes[z].item.length

    if (isContentRedBlackTree(tree)) {
      tree.nodes[y].leftCharCount = tree.nodes[z].leftCharCount;
      tree.nodes[y].leftLineFeedCount = tree.nodes[z].leftLineFeedCount;
    } else if (isStructureRedBlackTree(tree)) {
      tree.nodes[y].leftSubTreeLength = tree.nodes[z].leftSubTreeLength;
    }
    recomputeTreeMetadata(tree, y);
  }

  detach(tree, z);

  if (tree.nodes[tree.nodes[x].parent].left === x) {
    if (isContentRedBlackTree(tree)) {
      const newSizeLeft = calculateCharCount(tree, x);
      const newLFLeft = calculateLineFeedCount(tree, x);

      if (
        newSizeLeft !== tree.nodes[tree.nodes[x].parent].leftCharCount ||
        newLFLeft !== tree.nodes[tree.nodes[x].parent].leftLineFeedCount
      ) {
        const charDelta =
          newSizeLeft - tree.nodes[tree.nodes[x].parent].leftCharCount;
        const lineFeedDelta =
          newLFLeft - tree.nodes[tree.nodes[x].parent].leftLineFeedCount;
        tree.nodes[tree.nodes[x].parent].leftCharCount = newSizeLeft;
        tree.nodes[tree.nodes[x].parent].leftLineFeedCount = newSizeLeft;
        updateContentTreeMetadata(
          tree,
          tree.nodes[x].parent,
          charDelta,
          lineFeedDelta,
        );
      }
    } else if (isStructureRedBlackTree(tree)) {
      const newLeftSubTreeLength = calculateLengthCount(tree, x);

      if (
        newLeftSubTreeLength !==
        tree.nodes[tree.nodes[x].parent].leftSubTreeLength
      ) {
        const lengthDelta =
          newLeftSubTreeLength -
          tree.nodes[tree.nodes[x].parent].leftSubTreeLength;
        updateStructureTreeMetadata(tree, tree.nodes[x].parent, lengthDelta);
      }
    }
  }

  recomputeTreeMetadata(tree, tree.nodes[x].parent);

  if (yWasRed) {
    resetSentinel(tree);
  }

  fixDelete(tree, x);
  resetSentinel(tree);
  return;
}

/**
 * Deletes nodes inorder between the start and end index.
 * Format: `startIndex <= in order node to delete < endIndex`
 * @param tree The red-black tree.
 * @param startIndex The index of the first node to delete.
 * @param endIndex The index of the node after the last node to delete.
 */
export function deleteBetweenNodes<T extends Node>(
  tree: RedBlackTree<T>,
  startIndex: number,
  endIndex: number,
): void {
  let currentIndex = startIndex;
  let nextIndex = currentIndex;

  while (nextIndex !== endIndex) {
    currentIndex = nextIndex;
    nextIndex = getNextNode(tree.nodes, currentIndex).index;
    deleteNode(tree, currentIndex);
  }
}
