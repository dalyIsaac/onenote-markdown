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
import { createNewPage } from "./contentTree/createNewPage";
import { deleteContent } from "./contentTree/delete";
import { insertContent } from "./contentTree/insert";
import { MAX_BUFFER_LENGTH } from "./contentTree/tree";
import { PageContent, PageContentMutable, StatePages } from "./pageModel";

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
    case STORE_RECEIVED_PAGE: {
      const receivedPage = (action as StoreReceivedPageAction).receivedPage;
      newPage = createNewPage(receivedPage);
      newState = {
        ...state,
        [receivedPage.id as string]: newPage,
      };
      return newState;
    }
    case INSERT_CONTENT: {
      const insertAction = action as InsertContentAction;
      extractedPage = {
        ...state[insertAction.pageId],
        buffers: [...state[insertAction.pageId].buffers],
        content: {
          nodes: [...state[insertAction.pageId].content.nodes],
          root: state[insertAction.pageId].content.root,
        },
      };
      insertContent(
        extractedPage as PageContentMutable,
        { content: insertAction.content, offset: insertAction.offset },
        MAX_BUFFER_LENGTH,
      );
      newState = {
        ...state,
        [insertAction.pageId]: extractedPage,
      };
      return newState;
    }
    case DELETE_CONTENT: {
      const deleteAction = action as DeleteContentAction;
      extractedPage = {
        ...state[deleteAction.pageId],
        buffers: [...state[deleteAction.pageId].buffers],
        content: {
          nodes: [...state[deleteAction.pageId].content.nodes],
          root: state[deleteAction.pageId].content.root,
        },
      };
      deleteContent(extractedPage as PageContentMutable, {
        endOffset: deleteAction.endOffset,
        startOffset: deleteAction.startOffset,
      });
      newState = {
        ...state,
        [deleteAction.pageId]: extractedPage,
      };
      return newState;
    }
    case REPLACE_CONTENT: {
      const replaceAction = action as ReplaceContentAction;
      extractedPage = {
        ...state[replaceAction.pageId],
        buffers: [...state[replaceAction.pageId].buffers],
        content: {
          nodes: [...state[replaceAction.pageId].content.nodes],
          root: state[replaceAction.pageId].content.root,
        },
      };
      deleteContent(extractedPage as PageContentMutable, {
        endOffset: replaceAction.endOffset,
        startOffset: replaceAction.startOffset,
      });
      insertContent(
        extractedPage as PageContentMutable,
        {
          content: replaceAction.content,
          offset: replaceAction.startOffset,
        },
        MAX_BUFFER_LENGTH,
      );
      newState = {
        ...state,
        [replaceAction.pageId]: extractedPage,
      };
      return newState;
    }
    default: {
      return state;
    }
  }
}
