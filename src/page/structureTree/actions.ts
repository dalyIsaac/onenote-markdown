import { PageActionPartial } from "../actions";
import { KeyValueStr } from "./structureModel";

//#region Insert new structure node
export const INSERT_STRUCTURE_NODE = "INSERT_STRUCTURE_NODE";

export interface InsertStructureAction extends PageActionPartial {
  readonly tag: string;
  readonly id: string;
  readonly styles?: KeyValueStr;
  readonly offset: number;
}

/**
 * Action creator for `InsertStructureAction`.
 */
export const insertStructure = (
  pageId: string,
  offset: number,
  tag: string,
  id: string,
  styles?: KeyValueStr,
): InsertStructureAction => ({
  id,
  offset,
  pageId,
  styles,
  tag,
  type: INSERT_STRUCTURE_NODE,
});
//#endregion
