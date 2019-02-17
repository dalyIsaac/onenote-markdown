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
  SPLIT_STRUCTURE_NODE,
  SplitStructureAction,
} from "./structureTree/actions";
import { insertStructureNode } from "./structureTree/insert";
import { deleteStructureNode } from "./structureTree/delete";
import { updateStructureNode } from "./structureTree/update";
import { STORE_PAGE, StorePageAction } from "./tree/actions";
import parse from "./parser/parser";
import { splitStructureNode } from "./structureTree/split";

function handleStorePage(
  state: StatePages,
  { pageId, content }: StorePageAction,
): StatePages {
  const page = parse(content);
  const newState: StatePages = {
    ...state,
    [pageId]: page,
  };
  return newState;
}

function handleInsertContent(
  state: StatePages,
  { pageId, content, offset, structureNodeIndex }: InsertContentAction,
): StatePages {
  const extractedPage: PageContent = {
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
    structureNodeIndex,
    MAX_BUFFER_LENGTH,
  );
  const newState: StatePages = {
    ...state,
    [pageId]: extractedPage,
  };
  return newState;
}

function handleDeleteContent(
  state: StatePages,
  {
    pageId,
    contentLocations: {
      start: {
        contentOffset: startOffset,
        structureNodeIndex: startStructureNodeIndex,
      },
      end: {
        contentOffset: endOffset,
        structureNodeIndex: endStructureNodeIndex,
      },
    },
  }: DeleteContentAction,
): StatePages {
  const extractedPage: PageContent = {
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
  const newState: StatePages = {
    ...state,
    [pageId]: extractedPage,
  };
  return newState;
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
        structureNodeIndex: endStructureNodeIndex,
      },
    },
  }: ReplaceContentAction,
): StatePages {
  const extractedPage: PageContent = {
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
    startStructureNodeIndex,
    MAX_BUFFER_LENGTH,
  );
  const newState: StatePages = {
    ...state,
    [pageId]: extractedPage,
  };
  return newState;
}

function handleInsertStructureNode(
  state: StatePages,
  { pageId, ...props }: InsertStructureAction,
): StatePages {
  const extractedPage: PageContent = {
    ...state[pageId],
    structure: {
      nodes: [...state[pageId].structure.nodes],
      root: state[pageId].structure.root,
    },
  };
  insertStructureNode(extractedPage as PageContentMutable, props);
  const newState: StatePages = {
    ...state,
    [pageId]: extractedPage,
  };
  return newState;
}

function handleDeleteStructureNode(
  state: StatePages,
  { pageId, nodeIndex }: DeleteStructureAction,
): StatePages {
  const extractedPage: PageContent = {
    ...state[pageId],
    structure: {
      nodes: [...state[pageId].structure.nodes],
      root: state[pageId].structure.root,
    },
  };
  deleteStructureNode(extractedPage as PageContentMutable, nodeIndex);
  const newState: StatePages = {
    ...state,
    [pageId]: extractedPage,
  };
  return newState;
}

function handleUpdateStructureNode(
  state: StatePages,
  { pageId, nodeIndex, values }: UpdateStructureAction,
): StatePages {
  const extractedPage: PageContent = {
    ...state[pageId],
    structure: {
      nodes: [...state[pageId].structure.nodes],
      root: state[pageId].structure.root,
    },
  };
  updateStructureNode(extractedPage as PageContentMutable, nodeIndex, values);
  const newState: StatePages = {
    ...state,
    [pageId]: extractedPage,
  };
  return newState;
}

function handleSplitStructureNode(
  state: StatePages,
  { pageId, ...action }: SplitStructureAction,
): StatePages {
  const extractedPage: PageContent = {
    ...state[pageId],
    structure: {
      nodes: [...state[pageId].structure.nodes],
      root: state[pageId].structure.root,
    },
  };
  splitStructureNode(extractedPage as PageContentMutable, action);
  const newState: StatePages = {
    ...state,
    [pageId]: extractedPage,
  };
  return newState;
}

/**
 * Reducer for the slice of the state referring to the storage of a page.
 * @param state
 * @param action
 */
export default function pageReducer(
  state: StatePages = {},
  action: PageActionPartial,
): StatePages {
  if (!action.hasOwnProperty("pageId")) {
    return state;
  } else if (!state.hasOwnProperty(action.pageId)) {
    if (action.type === STORE_PAGE) {
      return handleStorePage(state, action as StorePageAction);
    } else {
      return state;
    }
  }

  switch (action.type) {
    case INSERT_CONTENT: {
      return handleInsertContent(state, action as InsertContentAction);
    }
    case DELETE_CONTENT: {
      return handleDeleteContent(state, action as DeleteContentAction);
    }
    case REPLACE_CONTENT: {
      return handleReplaceContent(state, action as ReplaceContentAction);
    }
    case INSERT_STRUCTURE_NODE: {
      return handleInsertStructureNode(state, action as InsertStructureAction);
    }
    case DELETE_STRUCTURE_NODE: {
      return handleDeleteStructureNode(state, action as DeleteStructureAction);
    }
    case UPDATE_STRUCTURE_NODE: {
      return handleUpdateStructureNode(state, action as UpdateStructureAction);
    }
    case SPLIT_STRUCTURE_NODE: {
      return handleSplitStructureNode(state, action as SplitStructureAction);
    }
    default: {
      return state;
    }
  }
}
