import { OnenotePage } from "@microsoft/microsoft-graph-types";
import { Action } from "../common";
import { ContentDelete } from "./internalTree/delete";
import { ContentInsert } from "./internalTree/insert";

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
  type: STORE_RECEIVED_PAGE,
  pageId,
  receivedPage,
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
  type: INSERT_CONTENT,
  pageId,
  content,
  offset,
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
  type: DELETE_CONTENT,
  pageId,
  startOffset,
  endOffset,
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
  type: REPLACE_CONTENT,
  pageId,
  startOffset,
  endOffset,
  content,
});
//#endregion
