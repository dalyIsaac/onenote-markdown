import { Color, RedBlackTree, Node } from "../pageModel";
import {
  SENTINEL_INDEX,
  recomputeTreeMetadata,
  EMPTY_TREE_ROOT,
  getNextNode,
} from "./tree";
import { isContentNode } from "../contentTree/contentModel";
import { leftRotate, rightRotate } from "./rotate";
import { isStructureNode } from "../structureTree/structureModel";

/**
 * Restores the properties of a red-black tree after the insertion of a node.
 * @param page The page/piece table.
 * @param x The index of the node in the `node` array, which is the basis for
 * fixing the tree.
 */
export function fixInsert<T extends Node>(
  tree: RedBlackTree<T>,
  x: number,
): void {
  recomputeTreeMetadata(tree, x);

  if (x === tree.root) {
    (tree.nodes[x] as T).color = Color.Black;
    return;
  }
  while (
    tree.nodes[x].parent !== SENTINEL_INDEX &&
    tree.nodes[tree.nodes[x].parent].parent !== SENTINEL_INDEX &&
    x !== tree.root &&
    tree.nodes[tree.nodes[x].parent].color === Color.Red
  ) {
    if (
      tree.nodes[x].parent ===
      tree.nodes[tree.nodes[tree.nodes[x].parent].parent].left
    ) {
      const y = tree.nodes[tree.nodes[tree.nodes[x].parent].parent].right;
      if (tree.nodes[y].color === Color.Red) {
        tree.nodes[tree.nodes[x].parent].color = Color.Black;
        (tree.nodes[y] as T).color = Color.Black;
        tree.nodes[tree.nodes[tree.nodes[x].parent].parent].color = Color.Red;
        x = tree.nodes[tree.nodes[x].parent].parent;
      } else {
        if (x === tree.nodes[tree.nodes[x].parent].right) {
          x = tree.nodes[x].parent;
          leftRotate(tree, x);
        }
        tree.nodes[tree.nodes[x].parent].color = Color.Black;
        tree.nodes[tree.nodes[tree.nodes[x].parent].parent].color = Color.Red;
        rightRotate(tree, tree.nodes[tree.nodes[x].parent].parent);
      }
    } else {
      const y = tree.nodes[tree.nodes[tree.nodes[x].parent].parent].left;
      if (tree.nodes[y].color === Color.Red) {
        tree.nodes[tree.nodes[x].parent].color = Color.Black;
        (tree.nodes[y] as T).color = Color.Black;
        tree.nodes[tree.nodes[tree.nodes[x].parent].parent].color = Color.Red;
        x = tree.nodes[tree.nodes[x].parent].parent;
      } else {
        if (
          tree.nodes[x] === tree.nodes[tree.nodes[tree.nodes[x].parent].left]
        ) {
          x = tree.nodes[x].parent;
          rightRotate(tree, x);
        }
        tree.nodes[tree.nodes[x].parent].color = Color.Black;
        tree.nodes[tree.nodes[tree.nodes[x].parent].parent].color = Color.Red;
        leftRotate(tree, tree.nodes[tree.nodes[x].parent].parent);
      }
    }
  }
  tree.nodes[tree.root].color = Color.Black;
}

/**
 * Returns the value for the LHS check for binary search for the red-black tree
 * , for different types.
 */
function getLHSValue(currentNode: Node): number {
  if (isContentNode(currentNode)) {
    return currentNode.leftCharCount;
  } else if (isStructureNode(currentNode)) {
    return currentNode.leftSubTreeLength + 1;
  } else {
    throw new TypeError("Passed an unknown node type for the red-black tree.");
  }
}

/**
 * Returns the value for the RHS check for binary search for the red-black tree
 * , for different types.
 */
function getRHSValue(currentNode: Node): number {
  if (isContentNode(currentNode)) {
    return currentNode.leftCharCount + currentNode.length;
  } else if (isStructureNode(currentNode)) {
    return currentNode.leftSubTreeLength + 1;
  } else {
    throw new TypeError("Passed an unknown node type for the red-black tree.");
  }
}

function insertAfterNode<T extends Node>(
  tree: RedBlackTree<T>,
  newNode: T,
  indexToInsertAfter: number,
): void {
  if (tree.nodes[indexToInsertAfter].right === SENTINEL_INDEX) {
    tree.nodes[indexToInsertAfter].right = tree.nodes.length - 1;
    newNode.parent = indexToInsertAfter;
  } else {
    const next = getNextNode(tree.nodes, indexToInsertAfter);
    tree.nodes[next.index].left = tree.nodes.length - 1;
    newNode.parent = next.index;
  }
}

/**
 * Modifies the metadata of nodes to "insert" a node. **The node should
 * already exist inside `page.nodes`.**
 * @param tree The red-black tree.
 * @param newNode Reference to the newly created node. The node already exists
 * inside `page.nodes`.
 * @param offset The offset of the new node.
 * @param nodeIndex The index of the new node inside `tree`.
 * @param indexToInsertAfter The index of the node to insert the new node after.
 */
export function insertNodeWithoutInserting<T extends Node>(
  tree: RedBlackTree<T>,
  newNode: T,
  offset: number,
  nodeIndex: number,
  indexToInsertAfter?: number,
): void {
  if (indexToInsertAfter) {
    insertAfterNode(tree, newNode, indexToInsertAfter);
    return;
  }

  let prevIndex = SENTINEL_INDEX;

  let currentIndex = tree.root;
  if (currentIndex === EMPTY_TREE_ROOT) {
    tree.root = 1;
    newNode.color = Color.Black;
    return;
  }

  let currentNode = tree.nodes[currentIndex];

  let nodeStartOffset = 0;

  while (currentIndex !== SENTINEL_INDEX) {
    prevIndex = currentIndex;
    if (offset <= nodeStartOffset + getLHSValue(currentNode)) {
      // left
      currentIndex = currentNode.left;
      if (currentIndex === SENTINEL_INDEX) {
        tree.nodes[prevIndex].left = nodeIndex;
        newNode.parent = prevIndex; // can mutate the node since it's new
        return;
      }
      currentNode = tree.nodes[currentIndex];
    } else if (offset >= nodeStartOffset + getRHSValue(currentNode)) {
      // right
      nodeStartOffset += getRHSValue(currentNode);
      currentIndex = currentNode.right;
      if (currentIndex === SENTINEL_INDEX) {
        tree.nodes[prevIndex].right = nodeIndex;
        newNode.parent = prevIndex; // can mutate the node since it's new
        return;
      }
      currentNode = tree.nodes[currentIndex];
    } else {
      // middle
      throw RangeError(
        "Looking for the place to insert a node should never result in " +
          "looking in the middle of another node.",
      );
    }
  }
  throw RangeError(
    "The currentIndex has reached a SENTINEL node before locating a suitable " +
      "insertion location.",
  );
}

/**
 * Modifies the metadata of nodes to "insert" a node.
 * @param tree The red-black tree.
 * @param newNode Reference to the newly created node. The node already exists
 * inside `page.nodes`.
 * @param offset The offset of the new node.
 * @param indexToInsertAfter The index of the node to insert the new node after.
 */
export function insertNode<T extends Node>(
  tree: RedBlackTree<T>,
  newNode: T,
  offset: number,
  indexToInsertAfter?: number,
): void {
  tree.nodes.push(newNode);
  insertNodeWithoutInserting(
    tree,
    newNode,
    offset,
    tree.nodes.length - 1,
    indexToInsertAfter,
  );
}
