import { PageActionPartial } from "./actions";
import {
  DELETE_CONTENT,
  DeleteContentAction,
  INSERT_CONTENT,
  InsertContentAction,
  REPLACE_CONTENT,
  ReplaceContentAction,
} from "./contentTree/actions";
import { deleteContent } from "./contentTree/delete";
import { insertContent } from "./contentTree/insert";
import { MAX_BUFFER_LENGTH } from "./contentTree/tree";
import { PageContent, PageContentMutable, StatePages } from "./pageModel";
import {
  INSERT_STRUCTURE_NODE,
  InsertStructureAction,
  DELETE_STRUCTURE_NODE,
  DeleteStructureAction,
  UPDATE_STRUCTURE_NODE,
  UpdateStructureAction,
} from "./structureTree/actions";
import { insertStructureNode } from "./structureTree/insert";
import { deleteStructureNode } from "./structureTree/delete";
import { updateStructureNode } from "./structureTree/update";

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
  let newState: StatePages;

  if (!action.hasOwnProperty("pageId")) {
    return state;
  } else if (!state.hasOwnProperty(action.pageId)) {
    console.error(`The state does not contain the key ${action.pageId}`);
    console.error(action);
    return state;
  }

  switch (action.type) {
    case INSERT_CONTENT: {
      const { pageId, content, offset } = action as InsertContentAction;
      extractedPage = {
        ...state[pageId],
        buffers: [...state[pageId].buffers],
        content: {
          nodes: [...state[pageId].content.nodes],
          root: state[pageId].content.root,
        },
      };
      insertContent(
        extractedPage as PageContentMutable,
        { content: content, offset: offset },
        MAX_BUFFER_LENGTH,
      );
      newState = {
        ...state,
        [pageId]: extractedPage,
      };
      return newState;
    }
    case DELETE_CONTENT: {
      const { pageId, endOffset, startOffset } = action as DeleteContentAction;
      extractedPage = {
        ...state[pageId],
        buffers: [...state[pageId].buffers],
        content: {
          nodes: [...state[pageId].content.nodes],
          root: state[pageId].content.root,
        },
      };
      deleteContent(extractedPage as PageContentMutable, {
        endOffset: endOffset,
        startOffset: startOffset,
      });
      newState = {
        ...state,
        [pageId]: extractedPage,
      };
      return newState;
    }
    case REPLACE_CONTENT: {
      const {
        pageId,
        content,
        endOffset,
        startOffset,
      } = action as ReplaceContentAction;
      extractedPage = {
        ...state[pageId],
        buffers: [...state[pageId].buffers],
        content: {
          nodes: [...state[pageId].content.nodes],
          root: state[pageId].content.root,
        },
      };
      deleteContent(extractedPage as PageContentMutable, {
        endOffset: endOffset,
        startOffset: startOffset,
      });
      insertContent(
        extractedPage as PageContentMutable,
        {
          content: content,
          offset: startOffset,
        },
        MAX_BUFFER_LENGTH,
      );
      newState = {
        ...state,
        [pageId]: extractedPage,
      };
      return newState;
    }
    case INSERT_STRUCTURE_NODE: {
      const { pageId, ...props } = action as InsertStructureAction;
      extractedPage = {
        ...state[pageId],
        structure: {
          nodes: [...state[pageId].structure.nodes],
          root: state[pageId].structure.root,
        },
      };
      insertStructureNode(extractedPage as PageContentMutable, props);
      newState = {
        ...state,
        [pageId]: extractedPage,
      };
      return newState;
    }
    case DELETE_STRUCTURE_NODE: {
      const { pageId, nodeIndex } = action as DeleteStructureAction;
      extractedPage = {
        ...state[pageId],
        structure: {
          nodes: [...state[pageId].structure.nodes],
          root: state[pageId].structure.root,
        },
      };
      deleteStructureNode(extractedPage as PageContentMutable, nodeIndex);
      newState = {
        ...state,
        [pageId]: extractedPage,
      };
      return newState;
    }
    case UPDATE_STRUCTURE_NODE: {
      const { pageId, nodeIndex, values } = action as UpdateStructureAction;
      extractedPage = {
        ...state[pageId],
        structure: {
          nodes: [...state[pageId].structure.nodes],
          root: state[pageId].structure.root,
        },
      };
      updateStructureNode(
        extractedPage as PageContentMutable,
        nodeIndex,
        values,
      );
      newState = {
        ...state,
        [pageId]: extractedPage,
      };
      return newState;
    }
    default: {
      return state;
    }
  }
}
