import { PageActionPartial } from "../actions";
import { KeyValueStr, TagType } from "./structureModel";
import { UpdateStructureValues } from "./update";

//#region Insert new structure node
export const INSERT_STRUCTURE_NODE = "INSERT_STRUCTURE_NODE";

export interface InsertStructureAction extends PageActionPartial {
  readonly tag: string;
  readonly tagType: TagType;
  readonly id: string;
  readonly style?: KeyValueStr;
  readonly attributes?: KeyValueStr;
  readonly offset: number;
  readonly length: number;
}

/**
 * Action creator for `InsertStructureAction`.
 */
export const insertStructure = (
  pageId: string,
  offset: number,
  length: number,
  tag: string,
  tagType: TagType,
  id: string,
  style?: KeyValueStr,
  attributes?: KeyValueStr,
): InsertStructureAction => ({
  attributes,
  id,
  length,
  offset,
  pageId,
  style,
  tag,
  tagType,
  type: INSERT_STRUCTURE_NODE,
});
//#endregion

//#region Delete structure node
export const DELETE_STRUCTURE_NODE = "DELETE_STRUCTURE_NODE";

export interface DeleteStructureAction extends PageActionPartial {
  readonly nodeIndex: number;
}

export const deleteStructure = (
  pageId: string,
  index: number,
): DeleteStructureAction => ({
  nodeIndex: index,
  pageId,
  type: DELETE_STRUCTURE_NODE,
});
//#endregion

//#region Update structure node
export const UPDATE_STRUCTURE_NODE = "UPDATE_STRUCTURE_NODE";

export interface UpdateStructureAction extends PageActionPartial {
  readonly nodeIndex: number;
  readonly values: UpdateStructureValues;
}

export const updateStructure = (
  pageId: string,
  nodeIndex: number,
  values: UpdateStructureValues,
): UpdateStructureAction => ({
  nodeIndex,
  pageId,
  type: UPDATE_STRUCTURE_NODE,
  values,
});
//#endregion
