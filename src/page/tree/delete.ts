import { Color, RedBlackTree, NodeMutable } from "../pageModel";
import { SENTINEL_INDEX } from "./tree";
import { leftRotate, rightRotate } from "./rotate";

/**
 * Restores the properties of a red-black tree after the deletion of a node.
 * @param tree The red-black tree.
 * @param x The node to start the fixup from.
 */
export function fixDelete(tree: RedBlackTree, x: number): void {
  let w: number;
  while (x !== tree.root && tree.nodes[x].color === Color.Black) {
    if (x === tree.nodes[tree.nodes[x].parent].left) {
      w = tree.nodes[tree.nodes[x].parent].right;
      tree.nodes[w] = { ...tree.nodes[w] };
      if (tree.nodes[w].color === Color.Red) {
        (tree.nodes[w] as NodeMutable).color = Color.Black;
        tree.nodes[tree.nodes[x].parent] = {
          ...tree.nodes[tree.nodes[x].parent],
          color: Color.Red,
        };
        leftRotate(tree, tree.nodes[x].parent);
        w = tree.nodes[tree.nodes[x].parent].right;
        tree.nodes[w] = { ...tree.nodes[w] };
      }
      if (
        tree.nodes[tree.nodes[w].left].color === Color.Black &&
        tree.nodes[tree.nodes[w].right].color === Color.Black
      ) {
        (tree.nodes[w] as NodeMutable).color = Color.Red;
        x = tree.nodes[x].parent;
        tree.nodes[x] = { ...tree.nodes[x] };
      } else {
        if (tree.nodes[tree.nodes[w].right].color === Color.Black) {
          tree.nodes[tree.nodes[w].left] = {
            ...tree.nodes[tree.nodes[w].left],
            color: Color.Black,
          };
          (tree.nodes[w] as NodeMutable).color = Color.Red;
          rightRotate(tree, w);
          w = tree.nodes[tree.nodes[x].parent].right;
          tree.nodes[w] = { ...tree.nodes[w] };
        }
        (tree.nodes[w] as NodeMutable).color =
          tree.nodes[tree.nodes[x].parent].color;
        tree.nodes[tree.nodes[x].parent] = {
          ...tree.nodes[tree.nodes[x].parent],
          color: Color.Black,
        };
        tree.nodes[tree.nodes[w].right] = {
          ...tree.nodes[tree.nodes[w].right],
          color: Color.Black,
        };
        leftRotate(tree, tree.nodes[x].parent);
        x = tree.root;
        tree.nodes[x] = { ...tree.nodes[x] };
      }
    } else {
      w = tree.nodes[tree.nodes[x].parent].left;
      tree.nodes[w] = { ...tree.nodes[w] };
      if (tree.nodes[w].color === Color.Red) {
        (tree.nodes[w] as NodeMutable).color = Color.Black;
        tree.nodes[tree.nodes[x].parent] = {
          ...tree.nodes[tree.nodes[x].parent],
          color: Color.Red,
        };
        rightRotate(tree, tree.nodes[x].parent);
        w = tree.nodes[tree.nodes[x].parent].left;
        tree.nodes[w] = { ...tree.nodes[w] };
      }
      if (
        tree.nodes[tree.nodes[w].left].color === Color.Black &&
        tree.nodes[tree.nodes[w].right].color === Color.Black
      ) {
        (tree.nodes[w] as NodeMutable).color = Color.Red;
        x = tree.nodes[x].parent;
        tree.nodes[x] = { ...tree.nodes[x] };
      } else {
        if (tree.nodes[tree.nodes[w].left].color === Color.Black) {
          tree.nodes[tree.nodes[w].right] = {
            ...tree.nodes[tree.nodes[w].right],
            color: Color.Black,
          };
          (tree.nodes[w] as NodeMutable).color = Color.Red;
          leftRotate(tree, w);
          w = tree.nodes[tree.nodes[x].parent].left;
        }
        (tree.nodes[w] as NodeMutable).color =
          tree.nodes[tree.nodes[x].parent].color;
        tree.nodes[tree.nodes[x].parent] = {
          ...tree.nodes[tree.nodes[x].parent],
          color: Color.Black,
        };
        tree.nodes[tree.nodes[w].left] = {
          ...tree.nodes[tree.nodes[w].left],
          color: Color.Black,
        };
        rightRotate(tree, tree.nodes[x].parent);
        x = tree.root;
        tree.nodes[x] = { ...tree.nodes[x] };
      }
    }
  }
  tree.nodes[x] = {
    ...tree.nodes[x],
    color: Color.Black,
  };
}

/**
 * Sets the color of the node to `Color.BLack`, and sets `parent`, `left`, and `right` to `SENTINEL_INDEX`.
 * @param tree The red-black tree.
 * @param node The index of the node to detach.
 */
export function detach(tree: RedBlackTree, node: number): void {
  const parent = tree.nodes[tree.nodes[node].parent]; // NEVER ASSIGN TO THIS
  if (parent.left === node) {
    tree.nodes[tree.nodes[node].parent] = {
      ...tree.nodes[tree.nodes[node].parent],
      left: SENTINEL_INDEX,
    };
  } else if (parent.right === node) {
    tree.nodes[tree.nodes[node].parent] = {
      ...tree.nodes[tree.nodes[node].parent],
      right: SENTINEL_INDEX,
    };
  }
  tree.nodes[node] = {
    ...tree.nodes[node],
    color: Color.Black,
    parent: SENTINEL_INDEX,
    left: SENTINEL_INDEX,
    right: SENTINEL_INDEX,
  };
}
