import { InternalTreeNode } from "./internalTree/internalTreeModel";
import { SENTINEL, SENTINEL_INDEX } from "./internalTree/tree";
import { PageContent } from "./pageModel";

/**
 * Contains a node and its index in a page/piece table.
 */
export interface NodePosition {
  readonly node: InternalTreeNode;
  readonly index: number;
}

/**
 * Finds the minimum of the subtree given by the `x`
 * @param page The piece table/page.
 * @param x The index from which to find the minimum of that subtree.
 */
export function treeMinimum(page: PageContent, x: number): NodePosition {
  while (page.nodes[x].left !== SENTINEL_INDEX) {
    x = page.nodes[x].left;
  }
  return { node: page.nodes[x], index: x };
}

/**
 * Finds the maximum of the subtree given by the `x`
 * @param page The piece table/page.
 * @param x The index from which to find the maximum of that subtree.
 */
export function treeMaximum(page: PageContent, x: number): NodePosition {
  while (page.nodes[x].right !== SENTINEL_INDEX) {
    x = page.nodes[x].right;
  }
  return { node: page.nodes[x], index: x };
}

/**
 * Gets the next node of a red-black tree, given the current node's index.
 * @param page The page/piece table.
 * @param currentNode The index of the current node in the `page.nodes` array.
 */
export function nextNode(page: PageContent, currentNode: number): NodePosition {
  if (page.nodes[currentNode].right !== SENTINEL_INDEX) {
    return treeMinimum(page, page.nodes[currentNode].right);
  }

  while (page.nodes[currentNode].parent !== SENTINEL_INDEX) {
    if (page.nodes[page.nodes[currentNode].parent].left === currentNode) {
      break;
    }

    currentNode = page.nodes[currentNode].parent;
  }

  if (page.nodes[currentNode].parent === SENTINEL_INDEX) {
    return { node: SENTINEL, index: SENTINEL_INDEX };
  } else {
    return {
      index: page.nodes[currentNode].parent,
      node: page.nodes[page.nodes[currentNode].parent],
    };
  }
}

/**
 * Gets the previous node of a red-black tree, given the current node's index.
 * @param page The page/piece table.
 * @param currentNode The index of the current node in the `page.nodes` array.
 */
export function prevNode(page: PageContent, currentNode: number): NodePosition {
  if (page.nodes[currentNode].left !== SENTINEL_INDEX) {
    return treeMaximum(page, page.nodes[currentNode].left);
  }

  while (page.nodes[currentNode].parent !== SENTINEL_INDEX) {
    if (page.nodes[page.nodes[currentNode].parent].right === currentNode) {
      break;
    }

    currentNode = page.nodes[currentNode].parent;
  }

  if (page.nodes[currentNode].parent === SENTINEL_INDEX) {
    return { node: SENTINEL, index: SENTINEL_INDEX };
  } else {
    return {
      index: page.nodes[currentNode].parent,
      node: page.nodes[page.nodes[currentNode].parent],
    };
  }
}
