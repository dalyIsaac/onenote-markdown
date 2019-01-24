import { OnenotePage } from "@microsoft/microsoft-graph-types";
import { Action } from "../common";

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
