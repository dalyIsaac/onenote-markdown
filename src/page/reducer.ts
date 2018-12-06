import { Action } from "../common";
import { STORE_RECEIVED_PAGE, StoreReceivedPageAction } from "./actions";
import { StatePages } from "./model";
import { createNewPage } from "./tree/createNewPage";

/**
 * Reducer for the slice of the state referring to the storage of a page.
 * @param state
 * @param action
 */
export default function pageReducer(
  state: StatePages = {},
  action: Action,
): StatePages {
  switch (action.type) {
    case STORE_RECEIVED_PAGE:
      const receivedPage = (action as StoreReceivedPageAction).receivedPage;
      const newPage = createNewPage(receivedPage);
      state[receivedPage.id as string] = newPage;
      return state;
    default:
      return state;
  }
}
