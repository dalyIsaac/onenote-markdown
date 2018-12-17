import {
  DELETE_CONTENT,
  DeleteContentAction,
  INSERT_CONTENT,
  InsertContentAction,
  PageActionPartial,
  REPLACE_CONTENT,
  ReplaceContentAction,
  STORE_RECEIVED_PAGE,
  StoreReceivedPageAction,
} from "./actions";
import { PageContent, StatePages } from "./model";
import { createNewPage } from "./tree/createNewPage";
import { deleteContent } from "./tree/delete";
import { insertContent } from "./tree/insert";
import { MAX_BUFFER_LENGTH } from "./tree/tree";

/**
 * Reducer for the slice of the state referring to the storage of a page.
 * @param state
 * @param action
 */
export default function pageReducer(
  state: StatePages = {},
  action: PageActionPartial,
): StatePages {
  let extractedPage: PageContent;
  let newPage: PageContent;
  let newState: StatePages;

  if (!action.hasOwnProperty("pageId")) {
    console.error("The action does not contain the property pageId");
    console.error(action);
    return state;
  } else if (
    !(
      state.hasOwnProperty(action.pageId) || action.type === STORE_RECEIVED_PAGE
    )
  ) {
    console.error(`The state does not contain the key ${action.pageId}`);
    console.error(action);
    return state;
  }

  switch (action.type) {
    case STORE_RECEIVED_PAGE:
      newState = { ...state };
      const receivedPage = (action as StoreReceivedPageAction).receivedPage;
      newPage = createNewPage(receivedPage);
      newState[receivedPage.id as string] = newPage;
      return newState;
    case INSERT_CONTENT:
      newState = { ...state };
      const insertAction = action as InsertContentAction;
      extractedPage = {
        ...state[insertAction.pageId],
        nodes: [...state[insertAction.pageId].nodes],
      };
      newPage = insertContent(
        extractedPage,
        { content: insertAction.content, offset: insertAction.offset },
        MAX_BUFFER_LENGTH,
      );
      newState[insertAction.pageId] = newPage;
      return newState;
    case DELETE_CONTENT:
      newState = { ...state };
      const deleteAction = action as DeleteContentAction;
      extractedPage = {
        ...state[deleteAction.pageId],
        nodes: [...state[deleteAction.pageId].nodes],
      };
      newPage = deleteContent(extractedPage, {
        startOffset: deleteAction.startOffset,
        endOffset: deleteAction.endOffset,
      });
      newState[deleteAction.pageId] = newPage;
      return newState;
    case REPLACE_CONTENT:
      newState = { ...state };
      const replaceAction = action as ReplaceContentAction;
      extractedPage = {
        ...state[replaceAction.pageId],
        nodes: [...state[replaceAction.pageId].nodes],
      };
      const pageAfterDelete = deleteContent(extractedPage, {
        startOffset: replaceAction.startOffset,
        endOffset: replaceAction.endOffset,
      });
      const pageAfterInsert = insertContent(
        pageAfterDelete,
        {
          content: replaceAction.content,
          offset: replaceAction.startOffset,
        },
        MAX_BUFFER_LENGTH,
      );
      newState[replaceAction.pageId] = pageAfterInsert;
      return newState;
    default:
      return state;
  }
}
