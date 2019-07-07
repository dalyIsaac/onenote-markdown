import { PageActionPartial } from "./actions";
import {
  DELETE_CONTENT,
  DeleteContentAction,
  INSERT_CONTENT,
  InsertContentAction,
  REPLACE_CONTENT,
  ReplaceContentAction,
  INSERT_CONTENT_DOM,
  InsertContentDOMAction,
} from "./contentTree/actions";
import { deleteContent } from "./contentTree/delete";
import { insertContent } from "./contentTree/insert";
import { MAX_BUFFER_LENGTH } from "./contentTree/tree";
import { StatePages } from "./pageModel";
import {
  INSERT_STRUCTURE_NODE,
  InsertStructureAction,
  DELETE_STRUCTURE_NODE,
  DeleteStructureAction,
  UPDATE_STRUCTURE_NODE,
  UpdateStructureAction,
  SPLIT_STRUCTURE_NODE,
  SplitStructureAction,
} from "./structureTree/actions";
import { insertStructureNode } from "./structureTree/insert";
import { deleteStructureNode } from "./structureTree/delete";
import { updateStructureNode } from "./structureTree/update";
import { STORE_PAGE, StorePageAction } from "./tree/actions";
import parse from "./parser/parser";
import { splitStructureNode } from "./structureTree/split";
import produce from "immer";
import { insertContentDOM } from "./contentTree/insert.dom";

function handleStorePage(
  state: StatePages,
  { pageId, content }: StorePageAction,
): StatePages {
  const page = parse(content);
  state[pageId] = page;
  return state;
}

function handleInsertContent(
  state: StatePages,
  {
    pageId,
    content,
    globalOffset: offset,
    nodeIndex: structureNodeIndex,
    nodeOffset: structureNodeOffset,
  }: InsertContentAction,
): StatePages {
  insertContent(
    state[pageId],
    { content: content, globalOffset: offset },
    structureNodeIndex,
    MAX_BUFFER_LENGTH,
    structureNodeOffset,
  );
  return state;
}
function handleInsertContentDOM(
  state: StatePages,
  { type, pageId, ...action }: InsertContentDOMAction,
): StatePages {
  insertContentDOM(state[pageId], action, MAX_BUFFER_LENGTH);
  return state;
}

function handleDeleteContent(
  state: StatePages,
  {
    pageId,
    contentLocations: {
      start: {
        contentOffset: startOffset,
        // structureNodeIndex: startStructureNodeIndex,
      },
      end: {
        contentOffset: endOffset,
        // structureNodeIndex: endStructureNodeIndex,
      },
    },
  }: DeleteContentAction,
): StatePages {
  deleteContent(state[pageId], {
    endOffset: endOffset,
    startOffset: startOffset,
  });
  return state;
}

function handleReplaceContent(
  state: StatePages,
  {
    pageId,
    content,
    contentLocations: {
      start: {
        contentOffset: startOffset,
        structureNodeIndex: startStructureNodeIndex,
      },
      end: {
        contentOffset: endOffset,
        // structureNodeIndex: endStructureNodeIndex,
      },
    },
  }: ReplaceContentAction,
): StatePages {
  deleteContent(state[pageId], {
    endOffset: endOffset,
    startOffset: startOffset,
  });
  insertContent(
    state[pageId],
    {
      content: content,
      globalOffset: startOffset,
    },
    startStructureNodeIndex,
    MAX_BUFFER_LENGTH,
  );
  return state;
}

function handleInsertStructureNode(
  state: StatePages,
  { pageId, ...props }: InsertStructureAction,
): StatePages {
  insertStructureNode(state[pageId], props);
  return state;
}

function handleDeleteStructureNode(
  state: StatePages,
  { pageId, nodeIndex }: DeleteStructureAction,
): StatePages {
  deleteStructureNode(state[pageId], nodeIndex);
  return state;
}

function handleUpdateStructureNode(
  state: StatePages,
  { pageId, nodeIndex, values }: UpdateStructureAction,
): StatePages {
  updateStructureNode(state[pageId], nodeIndex, values);
  return state;
}

function handleSplitStructureNode(
  state: StatePages,
  { pageId, ...action }: SplitStructureAction,
): StatePages {
  splitStructureNode(state[pageId], action);
  return state;
}

/**
 * Reducer for the slice of the state referring to the storage of a page.
 * @param state
 * @param action
 */
export const pageReducer = (
  state: StatePages = {},
  action: PageActionPartial,
): StatePages =>
  produce(
    state,
    (draftState): StatePages => {
      if (!action.hasOwnProperty("pageId")) {
        return draftState;
      } else if (!draftState.hasOwnProperty(action.pageId)) {
        if (action.type === STORE_PAGE) {
          return handleStorePage(draftState, action as StorePageAction);
        } else {
          return draftState;
        }
      }

      switch (action.type) {
        case INSERT_CONTENT: {
          return handleInsertContent(draftState, action as InsertContentAction);
        }
        case INSERT_CONTENT_DOM: {
          return handleInsertContentDOM(
            draftState,
            action as InsertContentDOMAction,
          );
        }
        case DELETE_CONTENT: {
          return handleDeleteContent(draftState, action as DeleteContentAction);
        }
        case REPLACE_CONTENT: {
          return handleReplaceContent(
            draftState,
            action as ReplaceContentAction,
          );
        }
        case INSERT_STRUCTURE_NODE: {
          return handleInsertStructureNode(
            draftState,
            action as InsertStructureAction,
          );
        }
        case DELETE_STRUCTURE_NODE: {
          return handleDeleteStructureNode(
            draftState,
            action as DeleteStructureAction,
          );
        }
        case UPDATE_STRUCTURE_NODE: {
          return handleUpdateStructureNode(
            draftState,
            action as UpdateStructureAction,
          );
        }
        case SPLIT_STRUCTURE_NODE: {
          return handleSplitStructureNode(
            draftState,
            action as SplitStructureAction,
          );
        }
        default: {
          return draftState;
        }
      }
    },
  );

export default pageReducer;
