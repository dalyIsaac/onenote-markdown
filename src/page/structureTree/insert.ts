import { PageContentMutable, Color } from "../pageModel";
import { KeyValueStr, StructureNode } from "./structureModel";
import { SENTINEL_INDEX } from "../tree/tree";
import { insertNode, fixInsert } from "../tree/insert";

export function insertStructureNode(
  page: PageContentMutable,
  offset: number,
  tag: string,
  id: string,
  styles?: KeyValueStr,
): void {
  const newNode: StructureNode = {
    color: Color.Red,
    id,
    left: SENTINEL_INDEX,
    leftSubTreeLength: 0,
    parent: SENTINEL_INDEX,
    right: SENTINEL_INDEX,
    styles,
    tag,
  };
  insertNode(page.structure, newNode, offset);
  fixInsert(page.structure, page.structure.nodes.length - 1);
}
