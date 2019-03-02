import { PageContent } from "../pageModel";
import { deleteNode } from "../tree/delete";

/**
 * Deletes a structure node from a page's red-black tree of structure nodes.
 * @param page The page from which to delete the structure node.
 * @param nodeIndex The index of the structure node to delete.
 */
export function deleteStructureNode(
  page: PageContent,
  nodeIndex: number,
): void {
  deleteNode(page.structure, nodeIndex);
}
