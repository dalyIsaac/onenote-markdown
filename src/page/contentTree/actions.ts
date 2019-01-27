import { ContentDelete } from "./delete";
import { ContentInsert } from "./insert";
import { PageActionPartial } from "../actions";

//#region Insert content
export const INSERT_CONTENT = "INSERT_CONTENT";

export interface InsertContentAction extends PageActionPartial, ContentInsert {}

export const insertContent = (
  pageId: string,
  content: string,
  offset: number,
): InsertContentAction => ({
  content,
  offset,
  pageId,
  type: INSERT_CONTENT,
});
//#endregion

//#region Delete content
export const DELETE_CONTENT = "DELETE_CONTENT";

export interface DeleteContentAction extends PageActionPartial, ContentDelete {}

export const deleteContent = (
  pageId: string,
  startOffset: number,
  endOffset: number,
): DeleteContentAction => ({
  endOffset,
  pageId,
  startOffset,
  type: DELETE_CONTENT,
});
//#endregion

//#region Replace content
export const REPLACE_CONTENT = "REPLACE_CONTENT";

export interface ReplaceContentAction extends PageActionPartial, ContentDelete {
  readonly content: string;
}

export const replaceContent = (
  pageId: string,
  startOffset: number,
  endOffset: number,
  content: string,
): ReplaceContentAction => ({
  content,
  endOffset,
  pageId,
  startOffset,
  type: REPLACE_CONTENT,
});
