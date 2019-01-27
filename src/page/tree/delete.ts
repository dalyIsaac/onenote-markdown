import { Color, RedBlackTree, NodeMutable } from "../pageModel";
import {
  SENTINEL_INDEX,
  nextNode,
  treeMinimum,
  recomputeTreeMetadata,
  resetSentinel,
} from "./tree";
import { leftRotate, rightRotate } from "./rotate";
import {
  ContentNode,
  ContentNodeMutable,
  isContentNode,
  ContentRedBlackTree,
} from "../contentTree/contentModel";
import {
  calculateCharCount,
  calculateLineFeedCount,
  updateContentTreeMetadata,
} from "../contentTree/tree";
import {
  isStructureNode,
  StructureNodeMutable,
  StructureNode,
  StructureRedBlackTree,
} from "../structureTree/structureModel";
import {
  calculateLengthCount,
  updateStructureTreeMetadata,
} from "../structureTree/tree";

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

/**
 * Deletes a node from the red-black tree. The node itself still resides inside the piece table, however `parent`,
 * `left`, and `right` will point to `SENTINEL_INDEX`, and no other nodes will point to the deleted node.
 * @param tree The red-black tree.
 * @param z The index of the node to delete.
 */
export function deleteNode(tree: RedBlackTree, z: number): void {
  tree.nodes[z] = { ...tree.nodes[z] };
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
    tree.nodes[yTemp] = { ...(result.node as ContentNode) };
    xTemp = tree.nodes[yTemp].right;
  }

  // This ensures that x and y don't change after this point
  const x = xTemp;
  const y = yTemp;
  tree.nodes[x] = { ...tree.nodes[x] };

  if (y === tree.root) {
    tree.root = x; // if page.nodes[x] is null, we are removing the only node

    (tree.nodes[x] as ContentNodeMutable).color = Color.Black;
    detach(tree, z);
    tree.nodes[tree.root] = {
      ...tree.nodes[tree.root],
      parent: SENTINEL_INDEX,
    };
    resetSentinel(tree);
    return;
  }

  const yWasRed = tree.nodes[y].color === Color.Red;

  if (y === tree.nodes[tree.nodes[y].parent].left) {
    tree.nodes[tree.nodes[y].parent] = {
      ...tree.nodes[tree.nodes[y].parent],
      left: x,
    };
  } else {
    tree.nodes[tree.nodes[y].parent] = {
      ...tree.nodes[tree.nodes[y].parent],
      right: x,
    };
  }

  if (y === z) {
    (tree.nodes[x] as NodeMutable).parent = tree.nodes[y].parent;
    recomputeTreeMetadata(tree, x);
  } else {
    if (tree.nodes[y].parent === z) {
      (tree.nodes[x] as NodeMutable).parent = y;
    } else {
      (tree.nodes[x] as NodeMutable).parent = tree.nodes[y].parent;
    } // as we make changes to page.nodes[x]'s hierarchy, update leftCharCount of subtree first

    recomputeTreeMetadata(tree, x);
    (tree.nodes[y] as ContentNodeMutable).left = tree.nodes[z].left;
    (tree.nodes[y] as ContentNodeMutable).right = tree.nodes[z].right;
    (tree.nodes[y] as NodeMutable).parent = tree.nodes[z].parent;
    (tree.nodes[y] as ContentNodeMutable).color = tree.nodes[z].color;

    if (z === tree.root) {
      tree.root = y;
    } else {
      if (z === tree.nodes[tree.nodes[z].parent].left) {
        tree.nodes[tree.nodes[z].parent] = {
          ...tree.nodes[tree.nodes[z].parent],
          left: y,
        };
      } else {
        tree.nodes[tree.nodes[z].parent] = {
          ...tree.nodes[tree.nodes[z].parent],
          right: y,
        };
      }
    }

    if (tree.nodes[y].left !== SENTINEL_INDEX) {
      tree.nodes[tree.nodes[y].left] = {
        ...tree.nodes[tree.nodes[y].left],
        parent: y,
      };
    }

    if (tree.nodes[y].right !== SENTINEL_INDEX) {
      tree.nodes[tree.nodes[y].right] = {
        ...tree.nodes[tree.nodes[y].right],
        parent: y,
      };
    } // update metadata
    // we replace page.nodes[z] with page.nodes[y], so in this sub tree, the length change is page.nodes[z].item.length

    if (isContentNode(tree.nodes[z])) {
      (tree.nodes[y] as ContentNodeMutable).leftCharCount = (tree.nodes[
        z
      ] as ContentNode).leftCharCount;
      (tree.nodes[y] as ContentNodeMutable).leftLineFeedCount = (tree.nodes[
        z
      ] as ContentNode).leftLineFeedCount;
    } else if (isStructureNode(tree.nodes[z])) {
      (tree.nodes[y] as StructureNodeMutable).leftSubTreeLength = (tree.nodes[
        z
      ] as StructureNode).leftSubTreeLength;
    }
    recomputeTreeMetadata(tree, y);
  }

  detach(tree, z);

  if (tree.nodes[tree.nodes[x].parent].left === x) {
    if (isContentNode(tree.nodes[x])) {
      const newSizeLeft = calculateCharCount(tree as ContentRedBlackTree, x);
      const newLFLeft = calculateLineFeedCount(tree as ContentRedBlackTree, x);

      if (
        newSizeLeft !==
          (tree.nodes[tree.nodes[x].parent] as ContentNode).leftCharCount ||
        newLFLeft !==
          (tree.nodes[tree.nodes[x].parent] as ContentNode).leftLineFeedCount
      ) {
        const charDelta =
          newSizeLeft -
          (tree.nodes[tree.nodes[x].parent] as ContentNode).leftCharCount;
        const lineFeedDelta =
          newLFLeft -
          (tree.nodes[tree.nodes[x].parent] as ContentNode).leftLineFeedCount;
        (tree.nodes[tree.nodes[x].parent] as ContentNode) = {
          ...(tree.nodes[tree.nodes[x].parent] as ContentNode),
          leftCharCount: newSizeLeft,
          leftLineFeedCount: newSizeLeft,
        };
        updateContentTreeMetadata(
          tree as ContentRedBlackTree,
          tree.nodes[x].parent,
          charDelta,
          lineFeedDelta,
        );
      }
    } else if (isStructureNode(tree.nodes[x])) {
      const newLeftSubTreeLength = calculateLengthCount(
        tree as StructureRedBlackTree,
        x,
      );

      if (
        newLeftSubTreeLength !==
        (tree.nodes[tree.nodes[x].parent] as StructureNode).leftSubTreeLength
      ) {
        const lengthDelta =
          newLeftSubTreeLength -
          (tree.nodes[tree.nodes[x].parent] as StructureNode).leftSubTreeLength;
        updateStructureTreeMetadata(
          tree as StructureRedBlackTree,
          tree.nodes[x].parent,
          lengthDelta,
        );
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
export function deleteBetweenNodes(
  tree: RedBlackTree,
  startIndex: number,
  endIndex: number,
): void {
  let currentIndex = startIndex;
  let nextIndex = currentIndex;

  while (nextIndex !== endIndex) {
    currentIndex = nextIndex;
    nextIndex = nextNode(tree.nodes, currentIndex).index;
    deleteNode(tree, currentIndex);
  }
}
