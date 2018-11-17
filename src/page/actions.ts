import { OnenotePage } from "@microsoft/microsoft-graph-types";
import { IAction } from "../common";

export const STORE_RECEIVED_PAGE = "STORE_RECEIVED_PAGE";

export interface IStoreReceivedPageAction extends IAction {
  receivedPage: OnenotePage;
}

export const storeReceivedPage = (
  receivedPage: OnenotePage,
): IStoreReceivedPageAction => ({
  receivedPage,
  type: STORE_RECEIVED_PAGE,
});
