import { Color, RedBlackTree, NodeMutable } from "../pageModel";
import { SENTINEL_INDEX, recomputeContentTreeMetadata } from "./tree";
import { ContentNodeMutable, isContentNode } from "../contentTree/contentModel";
import { leftRotate, rightRotate } from "./rotate";
import { isStructureNode } from "../structureTree/structureModel";

/**
 * Restores the properties of a red-black tree after the insertion of a node.
 * @param page The page/piece table.
 * @param x The index of the node in the `node` array, which is the basis for fixing the tree.
 */
export function fixInsert(tree: RedBlackTree, x: number): void {
  recomputeContentTreeMetadata(tree, x);

  tree.nodes[x] = { ...tree.nodes[x] };
  if (x === tree.root) {
    (tree.nodes[x] as ContentNodeMutable).color = Color.Black;
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
      tree.nodes[y] = { ...tree.nodes[y] };
      if (tree.nodes[y].color === Color.Red) {
        tree.nodes[tree.nodes[x].parent] = {
          ...tree.nodes[tree.nodes[x].parent],
          color: Color.Black,
        };
        (tree.nodes[y] as ContentNodeMutable).color = Color.Black;
        tree.nodes[tree.nodes[tree.nodes[x].parent].parent] = {
          ...tree.nodes[tree.nodes[tree.nodes[x].parent].parent],
          color: Color.Red,
        };
        x = tree.nodes[tree.nodes[x].parent].parent;
        tree.nodes[x] = { ...tree.nodes[x] };
      } else {
        if (x === tree.nodes[tree.nodes[x].parent].right) {
          x = tree.nodes[x].parent;
          tree.nodes[x] = { ...tree.nodes[x] };
          leftRotate(tree, x);
        }
        tree.nodes[tree.nodes[x].parent] = {
          ...tree.nodes[tree.nodes[x].parent],
          color: Color.Black,
        };
        tree.nodes[tree.nodes[tree.nodes[x].parent].parent] = {
          ...tree.nodes[tree.nodes[tree.nodes[x].parent].parent],
          color: Color.Red,
        };
        rightRotate(tree, tree.nodes[tree.nodes[x].parent].parent);
      }
    } else {
      const y = tree.nodes[tree.nodes[tree.nodes[x].parent].parent].left;
      tree.nodes[y] = { ...tree.nodes[y] };
      if (tree.nodes[y].color === Color.Red) {
        tree.nodes[tree.nodes[x].parent] = {
          ...tree.nodes[tree.nodes[x].parent],
          color: Color.Black,
        };
        (tree.nodes[y] as ContentNodeMutable).color = Color.Black;
        tree.nodes[tree.nodes[tree.nodes[x].parent].parent] = {
          ...tree.nodes[tree.nodes[tree.nodes[x].parent].parent],
          color: Color.Red,
        };
        x = tree.nodes[tree.nodes[x].parent].parent;
        tree.nodes[x] = { ...tree.nodes[x] };
      } else {
        if (
          tree.nodes[x] === tree.nodes[tree.nodes[tree.nodes[x].parent].left]
        ) {
          x = tree.nodes[x].parent;
          tree.nodes[x] = { ...tree.nodes[x] };
          rightRotate(tree, x);
        }
        tree.nodes[tree.nodes[x].parent] = {
          ...tree.nodes[tree.nodes[x].parent],
          color: Color.Black,
        };
        tree.nodes[tree.nodes[tree.nodes[x].parent].parent] = {
          ...tree.nodes[tree.nodes[tree.nodes[x].parent].parent],
          color: Color.Red,
        };
        leftRotate(tree, tree.nodes[tree.nodes[x].parent].parent);
      }
    }
  }
  tree.nodes[tree.root] = {
    ...tree.nodes[tree.root],
    color: Color.Black,
  };
}

function getLHSValue(currentNode: NodeMutable): number {
  if (isContentNode(currentNode)) {
    return currentNode.leftCharCount;
  } else if (isStructureNode(currentNode)) {
    return currentNode.leftSubTreeLength + 1;
  } else {
    throw new TypeError("Passed an unknown node type for the red-black tree.");
  }
}

function getRHSValue(currentNode: NodeMutable): number {
  if (isContentNode(currentNode)) {
    return currentNode.leftCharCount + currentNode.length;
  } else if (isStructureNode(currentNode)) {
    return currentNode.leftSubTreeLength + 1;
  } else {
    throw new TypeError("Passed an unknown node type for the red-black tree.");
  }
}

/**
 * Modifies the metadata of nodes to "insert" a node. **The node should already exist inside `page.nodes`.**
 * @param tree The red-black tree.
 * @param newNode Reference to the newly created node. The node already exists inside `page.nodes`.
 * @param offset The offset of the new node.
 */
export function insertNode(
  tree: RedBlackTree,
  newNode: NodeMutable,
  offset: number,
): void {
  tree.nodes.push(newNode);
  let prevIndex = SENTINEL_INDEX;

  let currentIndex = tree.root;
  let currentNode = tree.nodes[currentIndex];

  let nodeStartOffset = 0;
  const nodeIndex = tree.nodes.length - 1; // the index of the new node

  while (currentIndex !== SENTINEL_INDEX) {
    prevIndex = currentIndex;
    if (offset <= nodeStartOffset + getLHSValue(currentNode)) {
      // left
      currentIndex = currentNode.left;
      if (currentIndex === SENTINEL_INDEX) {
        tree.nodes[prevIndex] = {
          ...tree.nodes[prevIndex],
          left: nodeIndex,
        };
        newNode.parent = prevIndex; // can mutate the node since it's new
        return;
      }
      currentNode = tree.nodes[currentIndex];
    } else if (offset >= nodeStartOffset + getRHSValue(currentNode)) {
      // right
      nodeStartOffset += getRHSValue(currentNode);
      currentIndex = currentNode.right;
      if (currentIndex === SENTINEL_INDEX) {
        tree.nodes[prevIndex] = {
          ...tree.nodes[prevIndex],
          right: nodeIndex,
        };
        newNode.parent = prevIndex; // can mutate the node since it's new
        return;
      }
      currentNode = tree.nodes[currentIndex];
    } else {
      // middle
      throw RangeError(
        "Looking for the place to insert a node should never result in looking in the middle of another node.",
      );
    }
  }
  throw RangeError(
    "The currentIndex has reached a SENTINEL node before locating a suitable insertion location.",
  );
}
