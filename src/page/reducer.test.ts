import {
  DELETE_CONTENT,
  DeleteContentAction,
  INSERT_CONTENT,
  InsertContentAction,
  PageActionPartial,
  REPLACE_CONTENT,
  ReplaceContentAction,
} from "./actions";
import { Color, NEWLINE, PageContent, StatePages } from "./model";
import pageReducer from "./reducer";
import { LF, LF_CONTENT, pageReducerTest } from "./tree/createNewPage.test";
import { SENTINEL, SENTINEL_INDEX } from "./tree/tree";

export const getStartPage = (): PageContent => ({
  buffers: [
    {
      isReadOnly: true,
      lineStarts: [0, 39, 86],
      content:
        "Do not go gentle into that good night,\nOld age should burn and rave at close of shop;\n" +
        "Todo: Add the end of this stanza",
    },
    {
      isReadOnly: false,
      lineStarts: [0],
      content: "vdayRave, rave against the dying of the lightgg.",
    },
  ],
  newlineFormat: NEWLINE.LF,
  nodes: [
    SENTINEL,
    {
      // 1
      bufferIndex: 0,
      start: { line: 0, column: 0 },
      end: { line: 1, column: 26 },
      leftCharCount: 0,
      leftLineFeedCount: 0,
      length: 65,
      lineFeedCount: 1,
      color: Color.Red,
      parent: 2,
      left: SENTINEL_INDEX,
      right: SENTINEL_INDEX,
    },
    {
      // 2
      bufferIndex: 1,
      start: { line: 0, column: 0 },
      end: { line: 0, column: 1 },
      leftCharCount: 65,
      leftLineFeedCount: 1,
      length: 1,
      lineFeedCount: 0,
      color: Color.Black,
      parent: 4,
      left: 1,
      right: 3,
    },
    {
      // 3
      bufferIndex: 0,
      start: { line: 1, column: 28 },
      end: { line: 1, column: 42 },
      leftCharCount: 0,
      leftLineFeedCount: 0,
      length: 14,
      lineFeedCount: 0,
      color: Color.Red,
      parent: 2,
      left: SENTINEL_INDEX,
      right: SENTINEL_INDEX,
    },
    {
      // 4
      bufferIndex: 1,
      start: { line: 0, column: 1 },
      end: { line: 0, column: 4 },
      leftCharCount: 80,
      leftLineFeedCount: 1,
      length: 3,
      lineFeedCount: 0,
      color: Color.Red,
      parent: 6,
      left: 2,
      right: 5,
    },
    {
      // 5
      bufferIndex: 0,
      start: { line: 1, column: 45 },
      end: { line: 1, column: 47 },
      leftCharCount: 0,
      leftLineFeedCount: 0,
      length: 2,
      lineFeedCount: 1,
      color: Color.Black,
      parent: 4,
      left: SENTINEL_INDEX,
      right: SENTINEL_INDEX,
    },
    {
      // 6
      bufferIndex: 1,
      start: { line: 0, column: 4 },
      end: { line: 0, column: 6 },
      leftCharCount: 85,
      leftLineFeedCount: 2,
      length: 2,
      lineFeedCount: 0,
      color: Color.Black,
      parent: SENTINEL_INDEX,
      left: 4,
      right: 8,
    },
    {
      // 7
      bufferIndex: 1,
      start: { line: 0, column: 45 },
      end: { line: 0, column: 46 },
      leftCharCount: 0,
      leftLineFeedCount: 0,
      length: 1,
      lineFeedCount: 0,
      color: Color.Black,
      parent: 8,
      left: SENTINEL_INDEX,
      right: SENTINEL_INDEX,
    },
    {
      // 8
      bufferIndex: 1,
      start: { line: 0, column: 7 },
      end: { line: 0, column: 12 },
      leftCharCount: 1,
      leftLineFeedCount: 0,
      length: 5,
      lineFeedCount: 0,
      color: Color.Red,
      parent: 6,
      left: 7,
      right: 10,
    },
    {
      // 9
      bufferIndex: 1,
      start: { line: 0, column: 46 },
      end: { line: 0, column: 47 },
      leftCharCount: 0,
      leftLineFeedCount: 0,
      length: 1,
      lineFeedCount: 0,
      color: Color.Red,
      parent: 10,
      left: SENTINEL_INDEX,
      right: SENTINEL_INDEX,
    },
    {
      // 10
      bufferIndex: 1,
      start: { line: 0, column: 13 },
      end: { line: 0, column: 45 },
      leftCharCount: 1,
      leftLineFeedCount: 0,
      length: 32,
      lineFeedCount: 0,
      color: Color.Black,
      left: 9,
      parent: 8,
      right: 11,
    },
    {
      // 11
      bufferIndex: 1,
      start: { line: 0, column: 47 },
      end: { line: 0, column: 48 },
      leftCharCount: 0,
      leftLineFeedCount: 0,
      length: 1,
      lineFeedCount: 0,
      color: Color.Red,
      parent: 10,
      left: SENTINEL_INDEX,
      right: SENTINEL_INDEX,
    },
  ],
  root: 6,
  previouslyInsertedNodeIndex: null,
  previouslyInsertedNodeOffset: null,
});

const PAGE_ID = "pageId";

describe("page/reducer", () => {
  const getState = (): StatePages => {
    const state: StatePages = {
      [PAGE_ID]: getStartPage(),
    };
    return state;
  };

  test("Invalid action types returns the state with no changes", () => {
    const action: PageActionPartial = { type: "HELLO_WORLD", pageId: "" };
    const state = getState();
    expect(pageReducer(state, action)).toBe(state);
    expect(pageReducer(state, action)).toStrictEqual(state);
  });

  test("Invalid page id", () => {
    const action: PageActionPartial = { type: INSERT_CONTENT, pageId: "" };
    const state = getState();
    expect(pageReducer(state, action)).toBe(state);
    expect(pageReducer(state, action)).toStrictEqual(state);
  });

  test("Insertion", () => {
    const action: InsertContentAction = {
      type: INSERT_CONTENT,
      pageId: PAGE_ID,
      content: "Hello world",
      offset: 127,
    };

    const expectedPage: PageContent = {
      root: 6,
      previouslyInsertedNodeIndex: 12,
      previouslyInsertedNodeOffset: 127,
      newlineFormat: NEWLINE.LF,
      buffers: [
        {
          isReadOnly: true,
          lineStarts: [0, 39, 86],
          content:
            "Do not go gentle into that good night,\nOld age should burn and rave at close of shop;\n" +
            "Todo: Add the end of this stanza",
        },
        {
          isReadOnly: false,
          lineStarts: [0],
          content:
            "vdayRave, rave against the dying of the lightgg.Hello world",
        },
      ],
      nodes: [
        SENTINEL,
        {
          // 1
          bufferIndex: 0,
          start: { line: 0, column: 0 },
          end: { line: 1, column: 26 },
          leftCharCount: 0,
          leftLineFeedCount: 0,
          length: 65,
          lineFeedCount: 1,
          color: Color.Red,
          parent: 2,
          left: SENTINEL_INDEX,
          right: SENTINEL_INDEX,
        },
        {
          // 2
          bufferIndex: 1,
          start: { line: 0, column: 0 },
          end: { line: 0, column: 1 },
          leftCharCount: 65,
          leftLineFeedCount: 1,
          length: 1,
          lineFeedCount: 0,
          color: Color.Black,
          parent: 4,
          left: 1,
          right: 3,
        },
        {
          // 3
          bufferIndex: 0,
          start: { line: 1, column: 28 },
          end: { line: 1, column: 42 },
          leftCharCount: 0,
          leftLineFeedCount: 0,
          length: 14,
          lineFeedCount: 0,
          color: Color.Red,
          parent: 2,
          left: SENTINEL_INDEX,
          right: SENTINEL_INDEX,
        },
        {
          // 4
          bufferIndex: 1,
          start: { line: 0, column: 1 },
          end: { line: 0, column: 4 },
          leftCharCount: 80,
          leftLineFeedCount: 1,
          length: 3,
          lineFeedCount: 0,
          color: Color.Black,
          parent: 6,
          left: 2,
          right: 5,
        },
        {
          // 5
          bufferIndex: 0,
          start: { line: 1, column: 45 },
          end: { line: 1, column: 47 },
          leftCharCount: 0,
          leftLineFeedCount: 0,
          length: 2,
          lineFeedCount: 1,
          color: Color.Black,
          parent: 4,
          left: SENTINEL_INDEX,
          right: SENTINEL_INDEX,
        },
        {
          // 6
          bufferIndex: 1,
          start: { line: 0, column: 4 },
          end: { line: 0, column: 6 },
          leftCharCount: 85,
          leftLineFeedCount: 2,
          length: 2,
          lineFeedCount: 0,
          color: Color.Black,
          parent: SENTINEL_INDEX,
          left: 4,
          right: 8,
        },
        {
          // 7
          bufferIndex: 1,
          start: { line: 0, column: 45 },
          end: { line: 0, column: 46 },
          leftCharCount: 0,
          leftLineFeedCount: 0,
          length: 1,
          lineFeedCount: 0,
          color: Color.Black,
          parent: 8,
          left: SENTINEL_INDEX,
          right: SENTINEL_INDEX,
        },
        {
          // 8
          bufferIndex: 1,
          start: { line: 0, column: 7 },
          end: { line: 0, column: 12 },
          leftCharCount: 1,
          leftLineFeedCount: 0,
          length: 5,
          lineFeedCount: 0,
          color: Color.Black,
          parent: 6,
          left: 7,
          right: 10,
        },
        {
          // 9
          bufferIndex: 1,
          start: { line: 0, column: 46 },
          end: { line: 0, column: 47 },
          leftCharCount: 0,
          leftLineFeedCount: 0,
          length: 1,
          lineFeedCount: 0,
          color: Color.Black,
          parent: 10,
          left: SENTINEL_INDEX,
          right: SENTINEL_INDEX,
        },
        {
          // 10
          bufferIndex: 1,
          start: { line: 0, column: 13 },
          end: { line: 0, column: 45 },
          leftCharCount: 1,
          leftLineFeedCount: 0,
          length: 32,
          lineFeedCount: 0,
          color: Color.Red,
          left: 9,
          parent: 8,
          right: 11,
        },
        {
          // 11
          bufferIndex: 1,
          start: { line: 0, column: 47 },
          end: { line: 0, column: 48 },
          leftCharCount: 0,
          leftLineFeedCount: 0,
          length: 1,
          lineFeedCount: 0,
          color: Color.Black,
          parent: 10,
          left: SENTINEL_INDEX,
          right: 12,
        },
        {
          // 12
          bufferIndex: 1,
          leftCharCount: 0,
          leftLineFeedCount: 0,
          length: 11,
          lineFeedCount: 0,
          color: Color.Red,
          start: { line: 0, column: 48 },
          end: { line: 0, column: 59 },
          left: SENTINEL_INDEX,
          right: SENTINEL_INDEX,
          parent: 11,
        },
      ],
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

  test("Deletion", () => {
    const action: DeleteContentAction = {
      type: DELETE_CONTENT,
      pageId: PAGE_ID,
      startOffset: 126,
      endOffset: 127,
    };
    const state = getState();
    const result = pageReducer(state, action);

    const expectedPage: PageContent = {
      buffers: [
        {
          isReadOnly: true,
          lineStarts: [0, 39, 86],
          content:
            "Do not go gentle into that good night,\nOld age should burn and rave at close of shop;\n" +
            "Todo: Add the end of this stanza",
        },
        {
          isReadOnly: false,
          lineStarts: [0],
          content: "vdayRave, rave against the dying of the lightgg.",
        },
      ],
      newlineFormat: NEWLINE.LF,
      nodes: [
        SENTINEL,
        {
          // 1
          bufferIndex: 0,
          start: { line: 0, column: 0 },
          end: { line: 1, column: 26 },
          leftCharCount: 0,
          leftLineFeedCount: 0,
          length: 65,
          lineFeedCount: 1,
          color: Color.Red,
          parent: 2,
          left: SENTINEL_INDEX,
          right: SENTINEL_INDEX,
        },
        {
          // 2
          bufferIndex: 1,
          start: { line: 0, column: 0 },
          end: { line: 0, column: 1 },
          leftCharCount: 65,
          leftLineFeedCount: 1,
          length: 1,
          lineFeedCount: 0,
          color: Color.Black,
          parent: 4,
          left: 1,
          right: 3,
        },
        {
          // 3
          bufferIndex: 0,
          start: { line: 1, column: 28 },
          end: { line: 1, column: 42 },
          leftCharCount: 0,
          leftLineFeedCount: 0,
          length: 14,
          lineFeedCount: 0,
          color: Color.Red,
          parent: 2,
          left: SENTINEL_INDEX,
          right: SENTINEL_INDEX,
        },
        {
          // 4
          bufferIndex: 1,
          start: { line: 0, column: 1 },
          end: { line: 0, column: 4 },
          leftCharCount: 80,
          leftLineFeedCount: 1,
          length: 3,
          lineFeedCount: 0,
          color: Color.Red,
          parent: 6,
          left: 2,
          right: 5,
        },
        {
          // 5
          bufferIndex: 0,
          start: { line: 1, column: 45 },
          end: { line: 1, column: 47 },
          leftCharCount: 0,
          leftLineFeedCount: 0,
          length: 2,
          lineFeedCount: 1,
          color: Color.Black,
          parent: 4,
          left: SENTINEL_INDEX,
          right: SENTINEL_INDEX,
        },
        {
          // 6
          bufferIndex: 1,
          start: { line: 0, column: 4 },
          end: { line: 0, column: 6 },
          leftCharCount: 85,
          leftLineFeedCount: 2,
          length: 2,
          lineFeedCount: 0,
          color: Color.Black,
          parent: SENTINEL_INDEX,
          left: 4,
          right: 8,
        },
        {
          // 7
          bufferIndex: 1,
          start: { line: 0, column: 45 },
          end: { line: 0, column: 46 },
          leftCharCount: 0,
          leftLineFeedCount: 0,
          length: 1,
          lineFeedCount: 0,
          color: Color.Black,
          parent: 8,
          left: SENTINEL_INDEX,
          right: SENTINEL_INDEX,
        },
        {
          // 8
          bufferIndex: 1,
          start: { line: 0, column: 7 },
          end: { line: 0, column: 12 },
          leftCharCount: 1,
          leftLineFeedCount: 0,
          length: 5,
          lineFeedCount: 0,
          color: Color.Red,
          parent: 6,
          left: 7,
          right: 10,
        },
        {
          // 9
          bufferIndex: 1,
          start: { line: 0, column: 46 },
          end: { line: 0, column: 47 },
          leftCharCount: 0,
          leftLineFeedCount: 0,
          length: 1,
          lineFeedCount: 0,
          color: Color.Red,
          parent: 10,
          left: SENTINEL_INDEX,
          right: SENTINEL_INDEX,
        },
        {
          // 10
          bufferIndex: 1,
          start: { line: 0, column: 13 },
          end: { line: 0, column: 45 },
          leftCharCount: 1,
          leftLineFeedCount: 0,
          length: 32,
          lineFeedCount: 0,
          color: Color.Black,
          left: 9,
          parent: 8,
          right: SENTINEL_INDEX,
        },
        {
          // 11
          bufferIndex: 1,
          start: { line: 0, column: 47 },
          end: { line: 0, column: 48 },
          leftCharCount: 0,
          leftLineFeedCount: 0,
          length: 1,
          lineFeedCount: 0,
          color: Color.Black,
          parent: SENTINEL_INDEX,
          left: SENTINEL_INDEX,
          right: SENTINEL_INDEX,
        },
      ],
      root: 6,
      previouslyInsertedNodeIndex: null,
      previouslyInsertedNodeOffset: null,
    };
    const expectedState: StatePages = {
      ...state,
      [PAGE_ID]: expectedPage,
    };
    expect(result).toStrictEqual(expectedState);
    expect(result).not.toBe(state);
  });

  test("Replacement", () => {
    const action: ReplaceContentAction = {
      type: REPLACE_CONTENT,
      pageId: PAGE_ID,
      startOffset: 126,
      endOffset: 127,
      content: "Hello world",
    };
    const state = getState();
    const result = pageReducer(state, action);

    const expectedPage: PageContent = {
      buffers: [
        {
          isReadOnly: true,
          lineStarts: [0, 39, 86],
          content:
            "Do not go gentle into that good night,\nOld age should burn and rave at close of shop;\n" +
            "Todo: Add the end of this stanza",
        },
        {
          isReadOnly: false,
          lineStarts: [0],
          content:
            "vdayRave, rave against the dying of the lightgg.Hello world",
        },
      ],
      newlineFormat: NEWLINE.LF,
      nodes: [
        SENTINEL,
        {
          // 1
          bufferIndex: 0,
          start: { line: 0, column: 0 },
          end: { line: 1, column: 26 },
          leftCharCount: 0,
          leftLineFeedCount: 0,
          length: 65,
          lineFeedCount: 1,
          color: Color.Red,
          parent: 2,
          left: SENTINEL_INDEX,
          right: SENTINEL_INDEX,
        },
        {
          // 2
          bufferIndex: 1,
          start: { line: 0, column: 0 },
          end: { line: 0, column: 1 },
          leftCharCount: 65,
          leftLineFeedCount: 1,
          length: 1,
          lineFeedCount: 0,
          color: Color.Black,
          parent: 4,
          left: 1,
          right: 3,
        },
        {
          // 3
          bufferIndex: 0,
          start: { line: 1, column: 28 },
          end: { line: 1, column: 42 },
          leftCharCount: 0,
          leftLineFeedCount: 0,
          length: 14,
          lineFeedCount: 0,
          color: Color.Red,
          parent: 2,
          left: SENTINEL_INDEX,
          right: SENTINEL_INDEX,
        },
        {
          // 4
          bufferIndex: 1,
          start: { line: 0, column: 1 },
          end: { line: 0, column: 4 },
          leftCharCount: 80,
          leftLineFeedCount: 1,
          length: 3,
          lineFeedCount: 0,
          color: Color.Red,
          parent: 6,
          left: 2,
          right: 5,
        },
        {
          // 5
          bufferIndex: 0,
          start: { line: 1, column: 45 },
          end: { line: 1, column: 47 },
          leftCharCount: 0,
          leftLineFeedCount: 0,
          length: 2,
          lineFeedCount: 1,
          color: Color.Black,
          parent: 4,
          left: SENTINEL_INDEX,
          right: SENTINEL_INDEX,
        },
        {
          // 6
          bufferIndex: 1,
          start: { line: 0, column: 4 },
          end: { line: 0, column: 6 },
          leftCharCount: 85,
          leftLineFeedCount: 2,
          length: 2,
          lineFeedCount: 0,
          color: Color.Black,
          parent: SENTINEL_INDEX,
          left: 4,
          right: 8,
        },
        {
          // 7
          bufferIndex: 1,
          start: { line: 0, column: 45 },
          end: { line: 0, column: 46 },
          leftCharCount: 0,
          leftLineFeedCount: 0,
          length: 1,
          lineFeedCount: 0,
          color: Color.Black,
          parent: 8,
          left: SENTINEL_INDEX,
          right: SENTINEL_INDEX,
        },
        {
          // 8
          bufferIndex: 1,
          start: { line: 0, column: 7 },
          end: { line: 0, column: 12 },
          leftCharCount: 1,
          leftLineFeedCount: 0,
          length: 5,
          lineFeedCount: 0,
          color: Color.Red,
          parent: 6,
          left: 7,
          right: 10,
        },
        {
          // 9
          bufferIndex: 1,
          start: { line: 0, column: 46 },
          end: { line: 0, column: 47 },
          leftCharCount: 0,
          leftLineFeedCount: 0,
          length: 1,
          lineFeedCount: 0,
          color: Color.Red,
          parent: 10,
          left: SENTINEL_INDEX,
          right: SENTINEL_INDEX,
        },
        {
          // 10
          bufferIndex: 1,
          start: { line: 0, column: 13 },
          end: { line: 0, column: 45 },
          leftCharCount: 1,
          leftLineFeedCount: 0,
          length: 32,
          lineFeedCount: 0,
          color: Color.Black,
          left: 9,
          parent: 8,
          right: 12,
        },
        {
          // 11
          bufferIndex: 1,
          start: { line: 0, column: 47 },
          end: { line: 0, column: 48 },
          leftCharCount: 0,
          leftLineFeedCount: 0,
          length: 1,
          lineFeedCount: 0,
          color: Color.Black,
          parent: SENTINEL_INDEX,
          left: SENTINEL_INDEX,
          right: SENTINEL_INDEX,
        },
        {
          // 12
          bufferIndex: 1,
          leftCharCount: 0,
          leftLineFeedCount: 0,
          length: 11,
          lineFeedCount: 0,
          color: Color.Red,
          start: { line: 0, column: 48 },
          end: { line: 0, column: 59 },
          left: SENTINEL_INDEX,
          right: SENTINEL_INDEX,
          parent: 10,
        },
      ],
      root: 6,
      previouslyInsertedNodeIndex: 12,
      previouslyInsertedNodeOffset: 126,
    };
    const expectedState: StatePages = {
      ...state,
      [PAGE_ID]: expectedPage,
    };
    expect(result).toStrictEqual(expectedState);
    expect(result).not.toBe(state);
  });

  test("Create new page", () => {
    pageReducerTest(LF_CONTENT, LF);
  });
});
