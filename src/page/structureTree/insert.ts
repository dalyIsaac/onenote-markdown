import { PageContentMutable, Color } from "../pageModel";
import { StructureNode } from "./structureModel";
import { SENTINEL_INDEX } from "../tree/tree";
import { insertNode, fixInsert } from "../tree/insert";
import { InsertStructureAction } from "./actions";

/**
 * Inserts a new `StructureNode` into `.structure.nodes`.
 * @param page The page in which the structure node is going to be inserted.
 * @param insertStructureAction The insertion action.
 */
export function insertStructureNode(
  page: PageContentMutable,
  insertStructureAction: InsertStructureAction,
): void {
  const {
    attributes,
    id,
    styles,
    tag,
    tagType,
    offset,
  } = insertStructureAction;
  const newNode: StructureNode = {
    attributes,
    color: Color.Red,
    id,
    left: SENTINEL_INDEX,
    leftSubTreeLength: 0,
    parent: SENTINEL_INDEX,
    right: SENTINEL_INDEX,
    styles,
    tag,
    tagType,
  };
  insertNode(page.structure, newNode, offset);
  fixInsert(page.structure, page.structure.nodes.length - 1);
}
