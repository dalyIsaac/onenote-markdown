import { PageActionPartial } from "../actions";
import { KeyValueStr, TagType } from "./structureModel";

//#region Insert new structure node
export const INSERT_STRUCTURE_NODE = "INSERT_STRUCTURE_NODE";

export interface InsertStructureAction extends PageActionPartial {
  readonly tag: string;
  readonly tagType: TagType;
  readonly id: string;
  readonly styles?: KeyValueStr;
  readonly attributes?: KeyValueStr;
  readonly offset: number;
}

/**
 * Action creator for `InsertStructureAction`.
 */
export const insertStructure = (
  pageId: string,
  offset: number,
  tag: string,
  tagType: TagType,
  id: string,
  styles?: KeyValueStr,
  attributes?: KeyValueStr,
): InsertStructureAction => ({
  attributes,
  id,
  offset,
  pageId,
  styles,
  tag,
  tagType,
  type: INSERT_STRUCTURE_NODE,
});
//#endregion
