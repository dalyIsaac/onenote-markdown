import { OnenotePage } from "@microsoft/microsoft-graph-types";
import { Action } from "../common";
import { ContentDelete } from "./contentTree/delete";
import { ContentInsert } from "./contentTree/insert";

/**
 * Partial action which should be used to extend any action whihch interacts with a page.
 */
export interface PageActionPartial extends Action {
  readonly pageId: string;
}

//#region Store received page
export const STORE_RECEIVED_PAGE = "STORE_RECEIVED_PAGE";

export interface StoreReceivedPageAction extends PageActionPartial {
  readonly receivedPage: OnenotePage;
}

export const storeReceivedPage = (
  pageId: string,
  receivedPage: OnenotePage,
): StoreReceivedPageAction => ({
  pageId,
  receivedPage,
  type: STORE_RECEIVED_PAGE,
});
//#endregion

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
//#endregion
