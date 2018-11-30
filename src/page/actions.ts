import { OnenotePage } from "@microsoft/microsoft-graph-types";
import { Action } from "../common";

export const STORE_RECEIVED_PAGE = "STORE_RECEIVED_PAGE";

export interface StoreReceivedPageAction extends Action {
  receivedPage: OnenotePage;
}

export const storeReceivedPage = (
  receivedPage: OnenotePage,
): StoreReceivedPageAction => ({
  receivedPage,
  type: STORE_RECEIVED_PAGE,
});
