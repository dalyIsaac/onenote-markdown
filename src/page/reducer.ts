import { Action } from "../common";
import { STORE_RECEIVED_PAGE, StoreReceivedPageAction } from "./actions";
import { Color, Node, StatePages } from "./model";
import { createNewPage } from "./tree/createNewPage";

export const SENTINEL_INDEX = -1;
export const SENTINEL: Node = {
  bufferIndex: -1,
  start: { column: -1, line: -1 },
  end: { column: -1, line: -1 },
  leftCharCount: -1,
  leftLineFeedCount: -1,
  length: -1,
  lineFeedCount: -1,
  color: Color.Black,
  parent: SENTINEL_INDEX,
  left: SENTINEL_INDEX,
  right: SENTINEL_INDEX,
};

/**
 * Reducer for the slice of the state referring to the storage of a page.
 * @param state
 * @param action
 */
export default function pageReducer(state: StatePages = {}, action: Action) {
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
