/* eslint-disable max-len */

import { PageActionPartial } from "./actions";
import {
  DELETE_CONTENT,
  DeleteContentAction,
  INSERT_CONTENT,
  InsertContentAction,
  REPLACE_CONTENT,
  ReplaceContentAction,
} from "./contentTree/actions";
import { SENTINEL_CONTENT } from "./contentTree/tree";
import { Color, PageContent, StatePages } from "./pageModel";
import pageReducer from "./reducer";
import { SENTINEL_STRUCTURE } from "./structureTree/tree";
import { SENTINEL_INDEX } from "./tree/tree";
import { TagType } from "./structureTree/structureModel";
import { deleteStructure } from "./structureTree/actions";

export const getStartPage = (): PageContent => ({
  buffers: [
    {
      content:
        "Do not go gentle into that good night,\nOld age should burn and rave at close of shop;\n" +
        "Todo: Add the end of this stanza",
      isReadOnly: true,
      lineStarts: [0, 39, 86],
    },
    {
      content: "vdayRave, rave against the dying of the lightgg.",
      isReadOnly: false,
      lineStarts: [0],
    },
  ],
  content: {
    nodes: [
      SENTINEL_CONTENT,
      {
        // 1
        bufferIndex: 0,
        color: Color.Red,
        end: { column: 26, line: 1 },
        left: SENTINEL_INDEX,
        leftCharCount: 0,
        leftLineFeedCount: 0,
        length: 65,
        lineFeedCount: 1,
        parent: 2,
        right: SENTINEL_INDEX,
        start: { column: 0, line: 0 },
      },
      {
        // 2
        bufferIndex: 1,
        color: Color.Black,
        end: { column: 1, line: 0 },
        left: 1,
        leftCharCount: 65,
        leftLineFeedCount: 1,
        length: 1,
        lineFeedCount: 0,
        parent: 4,
        right: 3,
        start: { column: 0, line: 0 },
      },
      {
        // 3
        bufferIndex: 0,
        color: Color.Red,
        end: { column: 41, line: 1 },
        left: SENTINEL_INDEX,
        leftCharCount: 0,
        leftLineFeedCount: 0,
        length: 14,
        lineFeedCount: 0,
        parent: 2,
        right: SENTINEL_INDEX,
        start: { column: 27, line: 1 },
      },
      {
        // 4
        bufferIndex: 1,
        color: Color.Red,
        end: { column: 4, line: 0 },
        left: 2,
        leftCharCount: 80,
        leftLineFeedCount: 1,
        length: 3,
        lineFeedCount: 0,
        parent: 6,
        right: 5,
        start: { column: 1, line: 0 },
      },
      {
        // 5
        bufferIndex: 0,
        color: Color.Black,
        end: { column: 47, line: 1 },
        left: SENTINEL_INDEX,
        leftCharCount: 0,
        leftLineFeedCount: 0,
        length: 2,
        lineFeedCount: 1,
        parent: 4,
        right: SENTINEL_INDEX,
        start: { column: 45, line: 1 },
      },
      {
        // 6
        bufferIndex: 1,
        color: Color.Black,
        end: { column: 6, line: 0 },
        left: 4,
        leftCharCount: 85,
        leftLineFeedCount: 2,
        length: 2,
        lineFeedCount: 0,
        parent: SENTINEL_INDEX,
        right: 8,
        start: { column: 4, line: 0 },
      },
      {
        // 7
        bufferIndex: 1,
        color: Color.Black,
        end: { column: 46, line: 0 },
        left: SENTINEL_INDEX,
        leftCharCount: 0,
        leftLineFeedCount: 0,
        length: 1,
        lineFeedCount: 0,
        parent: 8,
        right: SENTINEL_INDEX,
        start: { column: 45, line: 0 },
      },
      {
        // 8
        bufferIndex: 1,
        color: Color.Red,
        end: { column: 12, line: 0 },
        left: 7,
        leftCharCount: 1,
        leftLineFeedCount: 0,
        length: 5,
        lineFeedCount: 0,
        parent: 6,
        right: 10,
        start: { column: 7, line: 0 },
      },
      {
        // 9
        bufferIndex: 1,
        color: Color.Red,
        end: { column: 47, line: 0 },
        left: SENTINEL_INDEX,
        leftCharCount: 0,
        leftLineFeedCount: 0,
        length: 1,
        lineFeedCount: 0,
        parent: 10,
        right: SENTINEL_INDEX,
        start: { column: 46, line: 0 },
      },
      {
        // 10
        bufferIndex: 1,
        color: Color.Black,
        end: { column: 45, line: 0 },
        left: 9,
        leftCharCount: 1,
        leftLineFeedCount: 0,
        length: 32,
        lineFeedCount: 0,
        parent: 8,
        right: 11,
        start: { column: 13, line: 0 },
      },
      {
        // 11
        bufferIndex: 1,
        color: Color.Red,
        end: { column: 48, line: 0 },
        left: SENTINEL_INDEX,
        leftCharCount: 0,
        leftLineFeedCount: 0,
        length: 1,
        lineFeedCount: 0,
        parent: 10,
        right: SENTINEL_INDEX,
        start: { column: 47, line: 0 },
      },
    ],
    root: 6,
  },
  previouslyInsertedContentNodeIndex: null,
  previouslyInsertedContentNodeOffset: null,
  structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
});

const PAGE_ID = "pageId";

describe("page/reducer", (): void => {
  const getState = (): StatePages => {
    const state: StatePages = {
      [PAGE_ID]: getStartPage(),
    };
    return state;
  };

  test("Invalid action types returns the state with no changes", (): void => {
    const action: PageActionPartial = { pageId: "", type: "HELLO_WORLD" };
    const state = getState();
    expect(pageReducer(state, action)).toBe(state);
    expect(pageReducer(state, action)).toStrictEqual(state);
  });

  test("Invalid page id", (): void => {
    const action: PageActionPartial = { pageId: "", type: INSERT_CONTENT };
    const state = getState();
    expect(pageReducer(state, action)).toBe(state);
    expect(pageReducer(state, action)).toStrictEqual(state);
  });

  test("Insertion", (): void => {
    const action: InsertContentAction = {
      content: "Hello world",
      offset: 127,
      pageId: PAGE_ID,
      structureNodeIndex: SENTINEL_INDEX,
      type: INSERT_CONTENT,
    };

    const expectedPage: PageContent = {
      buffers: [
        {
          content:
            "Do not go gentle into that good night,\nOld age should burn and rave at close of shop;\n" +
            "Todo: Add the end of this stanza",
          isReadOnly: true,
          lineStarts: [0, 39, 86],
        },
        {
          content:
            "vdayRave, rave against the dying of the lightgg.Hello world",
          isReadOnly: false,
          lineStarts: [0],
        },
      ],
      content: {
        nodes: [
          SENTINEL_CONTENT,
          {
            // 1
            bufferIndex: 0,
            color: Color.Red,
            end: { column: 26, line: 1 },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 65,
            lineFeedCount: 1,
            parent: 2,
            right: SENTINEL_INDEX,
            start: { column: 0, line: 0 },
          },
          {
            // 2
            bufferIndex: 1,
            color: Color.Black,
            end: { column: 1, line: 0 },
            left: 1,
            leftCharCount: 65,
            leftLineFeedCount: 1,
            length: 1,
            lineFeedCount: 0,
            parent: 4,
            right: 3,
            start: { column: 0, line: 0 },
          },
          {
            // 3
            bufferIndex: 0,
            color: Color.Red,
            end: { column: 41, line: 1 },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 14,
            lineFeedCount: 0,
            parent: 2,
            right: SENTINEL_INDEX,
            start: { column: 27, line: 1 },
          },
          {
            // 4
            bufferIndex: 1,
            color: Color.Black,
            end: { column: 4, line: 0 },
            left: 2,
            leftCharCount: 80,
            leftLineFeedCount: 1,
            length: 3,
            lineFeedCount: 0,
            parent: 6,
            right: 5,
            start: { column: 1, line: 0 },
          },
          {
            // 5
            bufferIndex: 0,
            color: Color.Black,
            end: { column: 47, line: 1 },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 2,
            lineFeedCount: 1,
            parent: 4,
            right: SENTINEL_INDEX,
            start: { column: 45, line: 1 },
          },
          {
            // 6
            bufferIndex: 1,
            color: Color.Black,
            end: { column: 6, line: 0 },
            left: 4,
            leftCharCount: 85,
            leftLineFeedCount: 2,
            length: 2,
            lineFeedCount: 0,
            parent: SENTINEL_INDEX,
            right: 8,
            start: { column: 4, line: 0 },
          },
          {
            // 7
            bufferIndex: 1,
            color: Color.Black,
            end: { column: 46, line: 0 },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 1,
            lineFeedCount: 0,
            parent: 8,
            right: SENTINEL_INDEX,
            start: { column: 45, line: 0 },
          },
          {
            // 8
            bufferIndex: 1,
            color: Color.Black,
            end: { column: 12, line: 0 },
            left: 7,
            leftCharCount: 1,
            leftLineFeedCount: 0,
            length: 5,
            lineFeedCount: 0,
            parent: 6,
            right: 10,
            start: { column: 7, line: 0 },
          },
          {
            // 9
            bufferIndex: 1,
            color: Color.Black,
            end: { column: 47, line: 0 },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 1,
            lineFeedCount: 0,
            parent: 10,
            right: SENTINEL_INDEX,
            start: { column: 46, line: 0 },
          },
          {
            // 10
            bufferIndex: 1,
            color: Color.Red,
            end: { column: 45, line: 0 },
            left: 9,
            leftCharCount: 1,
            leftLineFeedCount: 0,
            length: 32,
            lineFeedCount: 0,
            parent: 8,
            right: 11,
            start: { column: 13, line: 0 },
          },
          {
            // 11
            bufferIndex: 1,
            color: Color.Black,
            end: { column: 48, line: 0 },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 1,
            lineFeedCount: 0,
            parent: 10,
            right: 12,
            start: { column: 47, line: 0 },
          },
          {
            // 12
            bufferIndex: 1,
            color: Color.Red,
            end: { column: 59, line: 0 },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 11,
            lineFeedCount: 0,
            parent: 11,
            right: SENTINEL_INDEX,
            start: { column: 48, line: 0 },
          },
        ],
        root: 6,
      },
      previouslyInsertedContentNodeIndex: 12,
      previouslyInsertedContentNodeOffset: 127,
      structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
    };

    const state = getState();
    const result = pageReducer(state, action);
    const expectedState: StatePages = {
      ...state,
      [PAGE_ID]: expectedPage,
    };

    expect(result).toStrictEqual(expectedState);
    expect(result).not.toBe(state);
  });

  test("Deletion", (): void => {
    const action: DeleteContentAction = {
      contentLocations: {
        end: {
          contentOffset: 127,
          structureNodeIndex: SENTINEL_INDEX,
        },
        start: {
          contentOffset: 126,
          structureNodeIndex: SENTINEL_INDEX,
        },
      },
      pageId: PAGE_ID,
      type: DELETE_CONTENT,
    };
    const state = getState();
    const result = pageReducer(state, action);

    const expectedPage: PageContent = {
      buffers: [
        {
          content:
            "Do not go gentle into that good night,\nOld age should burn and rave at close of shop;\n" +
            "Todo: Add the end of this stanza",
          isReadOnly: true,
          lineStarts: [0, 39, 86],
        },
        {
          content: "vdayRave, rave against the dying of the lightgg.",
          isReadOnly: false,
          lineStarts: [0],
        },
      ],
      content: {
        nodes: [
          SENTINEL_CONTENT,
          {
            // 1
            bufferIndex: 0,
            color: Color.Red,
            end: { column: 26, line: 1 },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 65,
            lineFeedCount: 1,
            parent: 2,
            right: SENTINEL_INDEX,
            start: { column: 0, line: 0 },
          },
          {
            // 2
            bufferIndex: 1,
            color: Color.Black,
            end: { column: 1, line: 0 },
            left: 1,
            leftCharCount: 65,
            leftLineFeedCount: 1,
            length: 1,
            lineFeedCount: 0,
            parent: 4,
            right: 3,
            start: { column: 0, line: 0 },
          },
          {
            // 3
            bufferIndex: 0,
            color: Color.Red,
            end: { column: 41, line: 1 },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 14,
            lineFeedCount: 0,
            parent: 2,
            right: SENTINEL_INDEX,
            start: { column: 27, line: 1 },
          },
          {
            // 4
            bufferIndex: 1,
            color: Color.Red,
            end: { column: 4, line: 0 },
            left: 2,
            leftCharCount: 80,
            leftLineFeedCount: 1,
            length: 3,
            lineFeedCount: 0,
            parent: 6,
            right: 5,
            start: { column: 1, line: 0 },
          },
          {
            // 5
            bufferIndex: 0,
            color: Color.Black,
            end: { column: 47, line: 1 },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 2,
            lineFeedCount: 1,
            parent: 4,
            right: SENTINEL_INDEX,
            start: { column: 45, line: 1 },
          },
          {
            // 6
            bufferIndex: 1,
            color: Color.Black,
            end: { column: 6, line: 0 },
            left: 4,
            leftCharCount: 85,
            leftLineFeedCount: 2,
            length: 2,
            lineFeedCount: 0,
            parent: SENTINEL_INDEX,
            right: 8,
            start: { column: 4, line: 0 },
          },
          {
            // 7
            bufferIndex: 1,
            color: Color.Black,
            end: { column: 46, line: 0 },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 1,
            lineFeedCount: 0,
            parent: 8,
            right: SENTINEL_INDEX,
            start: { column: 45, line: 0 },
          },
          {
            // 8
            bufferIndex: 1,
            color: Color.Red,
            end: { column: 12, line: 0 },
            left: 7,
            leftCharCount: 1,
            leftLineFeedCount: 0,
            length: 5,
            lineFeedCount: 0,
            parent: 6,
            right: 10,
            start: { column: 7, line: 0 },
          },
          {
            // 9
            bufferIndex: 1,
            color: Color.Red,
            end: { column: 47, line: 0 },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 1,
            lineFeedCount: 0,
            parent: 10,
            right: SENTINEL_INDEX,
            start: { column: 46, line: 0 },
          },
          {
            // 10
            bufferIndex: 1,
            color: Color.Black,
            end: { column: 45, line: 0 },
            left: 9,
            leftCharCount: 1,
            leftLineFeedCount: 0,
            length: 32,
            lineFeedCount: 0,
            parent: 8,
            right: SENTINEL_INDEX,
            start: { column: 13, line: 0 },
          },
          {
            // 11
            bufferIndex: 1,
            color: Color.Black,
            end: { column: 48, line: 0 },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 1,
            lineFeedCount: 0,
            parent: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
            start: { column: 47, line: 0 },
          },
        ],
        root: 6,
      },
      previouslyInsertedContentNodeIndex: null,
      previouslyInsertedContentNodeOffset: null,
      structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
    };
    const expectedState: StatePages = {
      ...state,
      [PAGE_ID]: expectedPage,
    };
    expect(result).toStrictEqual(expectedState);
    expect(result).not.toBe(state);
  });

  test("Replacement", (): void => {
    const action: ReplaceContentAction = {
      content: "Hello world",
      contentLocations: {
        end: {
          contentOffset: 127,
          structureNodeIndex: SENTINEL_INDEX,
        },
        start: {
          contentOffset: 126,
          structureNodeIndex: SENTINEL_INDEX,
        },
      },
      pageId: PAGE_ID,
      type: REPLACE_CONTENT,
    };
    const state = getState();
    const result = pageReducer(state, action);

    const expectedPage: PageContent = {
      buffers: [
        {
          content:
            "Do not go gentle into that good night,\nOld age should burn and rave at close of shop;\n" +
            "Todo: Add the end of this stanza",
          isReadOnly: true,
          lineStarts: [0, 39, 86],
        },
        {
          content:
            "vdayRave, rave against the dying of the lightgg.Hello world",
          isReadOnly: false,
          lineStarts: [0],
        },
      ],
      content: {
        nodes: [
          SENTINEL_CONTENT,
          {
            // 1
            bufferIndex: 0,
            color: Color.Red,
            end: { column: 26, line: 1 },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 65,
            lineFeedCount: 1,
            parent: 2,
            right: SENTINEL_INDEX,
            start: { column: 0, line: 0 },
          },
          {
            // 2
            bufferIndex: 1,
            color: Color.Black,
            end: { column: 1, line: 0 },
            left: 1,
            leftCharCount: 65,
            leftLineFeedCount: 1,
            length: 1,
            lineFeedCount: 0,
            parent: 4,
            right: 3,
            start: { column: 0, line: 0 },
          },
          {
            // 3
            bufferIndex: 0,
            color: Color.Red,
            end: { column: 41, line: 1 },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 14,
            lineFeedCount: 0,
            parent: 2,
            right: SENTINEL_INDEX,
            start: { column: 27, line: 1 },
          },
          {
            // 4
            bufferIndex: 1,
            color: Color.Red,
            end: { column: 4, line: 0 },
            left: 2,
            leftCharCount: 80,
            leftLineFeedCount: 1,
            length: 3,
            lineFeedCount: 0,
            parent: 6,
            right: 5,
            start: { column: 1, line: 0 },
          },
          {
            // 5
            bufferIndex: 0,
            color: Color.Black,
            end: { column: 47, line: 1 },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 2,
            lineFeedCount: 1,
            parent: 4,
            right: SENTINEL_INDEX,
            start: { column: 45, line: 1 },
          },
          {
            // 6
            bufferIndex: 1,
            color: Color.Black,
            end: { column: 6, line: 0 },
            left: 4,
            leftCharCount: 85,
            leftLineFeedCount: 2,
            length: 2,
            lineFeedCount: 0,
            parent: SENTINEL_INDEX,
            right: 8,
            start: { column: 4, line: 0 },
          },
          {
            // 7
            bufferIndex: 1,
            color: Color.Black,
            end: { column: 46, line: 0 },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 1,
            lineFeedCount: 0,
            parent: 8,
            right: SENTINEL_INDEX,
            start: { column: 45, line: 0 },
          },
          {
            // 8
            bufferIndex: 1,
            color: Color.Red,
            end: { column: 12, line: 0 },
            left: 7,
            leftCharCount: 1,
            leftLineFeedCount: 0,
            length: 5,
            lineFeedCount: 0,
            parent: 6,
            right: 10,
            start: { column: 7, line: 0 },
          },
          {
            // 9
            bufferIndex: 1,
            color: Color.Red,
            end: { column: 47, line: 0 },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 1,
            lineFeedCount: 0,
            parent: 10,
            right: SENTINEL_INDEX,
            start: { column: 46, line: 0 },
          },
          {
            // 10
            bufferIndex: 1,
            color: Color.Black,
            end: { column: 45, line: 0 },
            left: 9,
            leftCharCount: 1,
            leftLineFeedCount: 0,
            length: 32,
            lineFeedCount: 0,
            parent: 8,
            right: 12,
            start: { column: 13, line: 0 },
          },
          {
            // 11
            bufferIndex: 1,
            color: Color.Black,
            end: { column: 48, line: 0 },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 1,
            lineFeedCount: 0,
            parent: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
            start: { column: 47, line: 0 },
          },
          {
            // 12
            bufferIndex: 1,
            color: Color.Red,
            end: { column: 59, line: 0 },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 11,
            lineFeedCount: 0,
            parent: 10,
            right: SENTINEL_INDEX,
            start: { column: 48, line: 0 },
          },
        ],
        root: 6,
      },
      previouslyInsertedContentNodeIndex: 12,
      previouslyInsertedContentNodeOffset: 126,
      structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
    };
    const expectedState: StatePages = {
      ...state,
      [PAGE_ID]: expectedPage,
    };
    expect(result).toStrictEqual(expectedState);
    expect(result).not.toBe(state);
  });

  test("Delete structure node", (): void => {
    const page: PageContent = {
      buffers: [],
      content: { nodes: [SENTINEL_CONTENT], root: SENTINEL_INDEX },
      previouslyInsertedContentNodeIndex: null,
      previouslyInsertedContentNodeOffset: null,
      structure: {
        nodes: [
          SENTINEL_STRUCTURE,
          {
            // 1
            color: Color.Black,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 0,
            parent: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
            tag: "id",
            tagType: TagType.StartEndTag,
          },
        ],
        root: 1,
      },
    };
    const state: StatePages = {
      pageId: page,
    };
    const expectedPage: PageContent = {
      buffers: [],
      content: { nodes: [SENTINEL_CONTENT], root: SENTINEL_INDEX },
      previouslyInsertedContentNodeIndex: null,
      previouslyInsertedContentNodeOffset: null,
      structure: {
        nodes: [
          SENTINEL_STRUCTURE,
          {
            // 1
            color: Color.Black,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 0,
            parent: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
            tag: "id",
            tagType: TagType.StartEndTag,
          },
        ],
        root: SENTINEL_INDEX,
      },
    };
    const expectedState: StatePages = {
      pageId: expectedPage,
    };
    const action = deleteStructure("pageId", 1);
    const result = pageReducer(state, action);
    expect(result).toStrictEqual(expectedState);
  });
});
