import { PageActionPartial } from "../actions";
import { KeyValueStr, TagType } from "./structureModel";
import { UpdateStructureValues } from "./update";

//#region Insert new structure node
export const INSERT_STRUCTURE_NODE = "INSERT_STRUCTURE_NODE";

export interface InsertStructureProps {
  tag: string;
  tagType: TagType;
  id: string;
  style?: KeyValueStr;
  attributes?: KeyValueStr;
  offset: number;
  length: number;
}

export interface InsertStructureAction extends PageActionPartial {
  tag: string;
  tagType: TagType;
  id: string;
  style?: KeyValueStr;
  attributes?: KeyValueStr;
  offset: number;
  length: number;
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
  nodeIndex: number;
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
  nodeIndex: number;
  values: UpdateStructureValues;
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

//#region Split structure node
export const SPLIT_STRUCTURE_NODE = "SPLIT_STRUCTURE_NODE";

export interface SplitStructureAction extends PageActionPartial {
  nodeIndex: number;

  /**
   * The local content offset inside the `StructureNode` where the s
   */
  localContentOffset: number;

  /**
   * The content offset of the start of the node.
   */
  nodeContentOffset: number;
}

export const splitStructureNode = (
  pageId: string,
  nodeIndex: number,
  nodeContentOffset: number,
  localContentOffset: number,
): SplitStructureAction => ({
  localContentOffset,
  nodeContentOffset,
  nodeIndex,
  pageId,
  type: SPLIT_STRUCTURE_NODE,
});
//#endregion
