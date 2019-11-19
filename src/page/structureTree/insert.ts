import { PageContent, Color } from "../pageModel";
import { StructureNode } from "./structureModel";
import { SENTINEL_INDEX } from "../tree/tree";
import { insertNode, fixInsert } from "../tree/insert";
import { InsertStructureProps } from "./actions";

/**
 * Inserts a new `StructureNode` into `.structure.nodes`.
 * @param page The page in which the structure node is going to be inserted.
 * @param insertStructureAction The insertion action.
 */
export function insertStructureNode(
  page: PageContent,
  insertStructureAction: InsertStructureProps,
): void {
  const {
    attributes,
    id,
    style,
    tag,
    tagType,
    offset,
    length,
    insertAfterNode,
  } = insertStructureAction;
  const newNode: StructureNode = {
    color: Color.Red,
    id,
    left: SENTINEL_INDEX,
    leftSubTreeLength: 0,
    length,
    parent: SENTINEL_INDEX,
    right: SENTINEL_INDEX,
    tag,
    tagType,
  };
  if (style) {
    newNode.style = style;
  }
  if (attributes) {
    newNode.attributes = attributes;
  }
  insertNode(page.structure, newNode, offset, insertAfterNode);
  fixInsert(page.structure, page.structure.nodes.length - 1);
}
