import { ContentInsert } from "./insert";
import { PageActionPartial } from "../actions";

//#region Insert content
export const INSERT_CONTENT = "INSERT_CONTENT";

export interface InsertContentAction extends PageActionPartial, ContentInsert {
  structureNodeIndex: number;
  structureNodeOffset?: number;
}

export const insertContent = (
  pageId: string,
  content: string,
  offset: number,
  structureNodeIndex: number,
  structureNodeOffset?: number,
): InsertContentAction => ({
  content,
  offset,
  pageId,
  structureNodeIndex,
  structureNodeOffset,
  type: INSERT_CONTENT,
});
//#endregion

export interface Location {
  contentOffset: number;
  structureNodeIndex: number;
  structureNodeContentOffset?: number;
}

export interface ContentLocations {
  start: Location;
  end: Location;
}

//#region Delete content
export const DELETE_CONTENT = "DELETE_CONTENT";

export type DeletionType = "Backspace" | "Delete";

export interface DeleteContentAction extends PageActionPartial {
  contentLocations: ContentLocations;
  deletionType?: DeletionType;
}

export const deleteContent = (
  pageId: string,
  contentLocations: ContentLocations,
  deletionType?: DeletionType,
): DeleteContentAction => ({
  contentLocations,
  deletionType,
  pageId,
  type: DELETE_CONTENT,
});
//#endregion

//#region Replace content
export const REPLACE_CONTENT = "REPLACE_CONTENT";

export interface ReplaceContentAction extends PageActionPartial {
  content: string;
  contentLocations: ContentLocations;
}

export const replaceContent = (
  pageId: string,
  content: string,
  contentLocations: ContentLocations,
): ReplaceContentAction => ({
  content,
  contentLocations,
  pageId,
  type: REPLACE_CONTENT,
});
//#endregion
