import { Color, RedBlackTree } from "../pageModel";
import { SENTINEL_INDEX } from "./tree";
import { ContentNodeMutable, isContentNode } from "../contentTree/contentModel";
import { leftRotate, rightRotate } from "./rotate";
import { recomputeContentTreeMetadata } from "../contentTree/tree";
/**
 * Restores the properties of a red-black tree after the insertion of a node.
 * @param page The page/piece table.
 * @param x The index of the node in the `node` array, which is the basis for fixing the tree.
 */
export function fixInsert(tree: RedBlackTree, x: number): void {
  if (isContentNode(tree.nodes[x])) {
    recomputeContentTreeMetadata(
      tree as { nodes: ContentNodeMutable[]; root: number },
      x,
    );
  }

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
