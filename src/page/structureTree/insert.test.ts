import { NEWLINE } from "../contentTree/contentModel";
import { Color, PageContentMutable, StatePages } from "../pageModel";
import { SENTINEL_INDEX } from "../tree/tree";
import { SENTINEL_STRUCTURE } from "./tree";
import { SENTINEL_CONTENT } from "../contentTree/tree";
import pageReducer from "../reducer";
import { insertStructure } from "./actions";

describe("structureTree insert tests", () => {
  test("Less than insertion - left side", () => {
    const page: PageContentMutable = {
      buffers: [],
      content: { nodes: [SENTINEL_CONTENT], root: SENTINEL_INDEX },
      newlineFormat: NEWLINE.LF,
      previouslyInsertedContentNodeIndex: null,
      previouslyInsertedContentNodeOffset: null,
      structure: {
        nodes: [
          SENTINEL_STRUCTURE,
          {
            // 1
            color: Color.Red,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 2,
            right: SENTINEL_INDEX,
            tag: "span",
          },
          {
            // 2
            color: Color.Black,
            id: "helloWorld",
            left: 1,
            leftSubTreeLength: 1,
            parent: 3,
            right: SENTINEL_INDEX,
            tag: "span",
          },
          {
            // 3
            color: Color.Black,
            id: "helloWorld",
            left: 2,
            leftSubTreeLength: 2,
            parent: 5,
            right: 4,
            tag: "span",
          },
          {
            // 4
            color: Color.Black,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 3,
            right: SENTINEL_INDEX,
            tag: "span",
          },
          {
            // 5
            color: Color.Black,
            id: "helloWorld",
            left: 3,
            leftSubTreeLength: 4,
            parent: SENTINEL_INDEX,
            right: 7,
            tag: "span",
          },
          {
            // 6
            color: Color.Black,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 7,
            right: SENTINEL_INDEX,
            tag: "span",
          },
          {
            // 7
            color: Color.Black,
            id: "helloWorld",
            left: 6,
            leftSubTreeLength: 1,
            parent: 5,
            right: 10,
            tag: "span",
          },
          {
            // 8
            color: Color.Black,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 10,
            right: 9,
            tag: "span",
          },
          {
            // 9
            color: Color.Red,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 8,
            right: SENTINEL_INDEX,
            tag: "span",
          },
          {
            // 10
            color: Color.Red,
            id: "helloWorld",
            left: 8,
            leftSubTreeLength: 2,
            parent: 7,
            right: 12,
            tag: "span",
          },
          {
            // 11
            color: Color.Red,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 12,
            right: SENTINEL_INDEX,
            tag: "span",
          },
          {
            // 12
            color: Color.Black,
            id: "helloWorld",
            left: 11,
            leftSubTreeLength: 1,
            parent: 10,
            right: 13,
            tag: "span",
          },
          {
            // 13
            color: Color.Red,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 12,
            right: SENTINEL_INDEX,
            tag: "span",
          },
        ],
        root: 5,
      },
    };
    const state: StatePages = {
      pageId: page,
    };

    const expectedPage: PageContentMutable = {
      buffers: [],
      content: { nodes: [SENTINEL_CONTENT], root: SENTINEL_INDEX },
      newlineFormat: NEWLINE.LF,
      previouslyInsertedContentNodeIndex: null,
      previouslyInsertedContentNodeOffset: null,
      structure: {
        nodes: [
          SENTINEL_STRUCTURE,
          {
            // 1
            color: Color.Red,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 2,
            right: SENTINEL_INDEX,
            tag: "span",
          },
          {
            // 2
            color: Color.Black,
            id: "helloWorld",
            left: 1,
            leftSubTreeLength: 1,
            parent: 3,
            right: SENTINEL_INDEX,
            tag: "span",
          },
          {
            // 3
            color: Color.Black,
            id: "helloWorld",
            left: 2,
            leftSubTreeLength: 2,
            parent: 5,
            right: 4,
            tag: "span",
          },
          {
            // 4
            color: Color.Black,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 3,
            right: SENTINEL_INDEX,
            tag: "span",
          },
          {
            // 5
            color: Color.Black,
            id: "helloWorld",
            left: 3,
            leftSubTreeLength: 4,
            parent: SENTINEL_INDEX,
            right: 7,
            tag: "span",
          },
          {
            // 6
            color: Color.Black,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 7,
            right: SENTINEL_INDEX,
            tag: "span",
          },
          {
            // 7
            color: Color.Black,
            id: "helloWorld",
            left: 6,
            leftSubTreeLength: 1,
            parent: 5,
            right: 10,
            tag: "span",
          },
          {
            // 8
            color: Color.Black,
            id: "helloWorld",
            left: 14,
            leftSubTreeLength: 1,
            parent: 10,
            right: 9,
            tag: "span",
          },
          {
            // 9
            color: Color.Red,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 8,
            right: SENTINEL_INDEX,
            tag: "span",
          },
          {
            // 10
            color: Color.Red,
            id: "helloWorld",
            left: 8,
            leftSubTreeLength: 3,
            parent: 7,
            right: 12,
            tag: "span",
          },
          {
            // 11
            color: Color.Red,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 12,
            right: SENTINEL_INDEX,
            tag: "span",
          },
          {
            // 12
            color: Color.Black,
            id: "helloWorld",
            left: 11,
            leftSubTreeLength: 1,
            parent: 10,
            right: 13,
            tag: "span",
          },
          {
            // 13
            color: Color.Red,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 12,
            right: SENTINEL_INDEX,
            tag: "span",
          },
          {
            // 14
            color: Color.Red,
            id: "newNode",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 8,
            right: SENTINEL_INDEX,
            styles: undefined,
            tag: "img",
          },
        ],
        root: 5,
      },
    };
    const expectedState: StatePages = {
      pageId: expectedPage,
    };

    const resultState = pageReducer(
      state,
      insertStructure("pageId", 8, "img", "newNode"),
    );
    expect(resultState).toStrictEqual(expectedState);
  });

  test("Less than insertion - right side", () => {
    const page: PageContentMutable = {
      buffers: [],
      content: { nodes: [SENTINEL_CONTENT], root: SENTINEL_INDEX },
      newlineFormat: NEWLINE.LF,
      previouslyInsertedContentNodeIndex: null,
      previouslyInsertedContentNodeOffset: null,
      structure: {
        nodes: [
          SENTINEL_STRUCTURE,
          {
            // 1
            color: Color.Red,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 2,
            right: SENTINEL_INDEX,
            tag: "span",
          },
          {
            // 2
            color: Color.Black,
            id: "helloWorld",
            left: 1,
            leftSubTreeLength: 1,
            parent: 3,
            right: SENTINEL_INDEX,
            tag: "span",
          },
          {
            // 3
            color: Color.Black,
            id: "helloWorld",
            left: 2,
            leftSubTreeLength: 2,
            parent: 5,
            right: 4,
            tag: "span",
          },
          {
            // 4
            color: Color.Black,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 3,
            right: SENTINEL_INDEX,
            tag: "span",
          },
          {
            // 5
            color: Color.Black,
            id: "helloWorld",
            left: 3,
            leftSubTreeLength: 4,
            parent: SENTINEL_INDEX,
            right: 7,
            tag: "span",
          },
          {
            // 6
            color: Color.Black,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 7,
            right: SENTINEL_INDEX,
            tag: "span",
          },
          {
            // 7
            color: Color.Black,
            id: "helloWorld",
            left: 6,
            leftSubTreeLength: 1,
            parent: 5,
            right: 10,
            tag: "span",
          },
          {
            // 8
            color: Color.Red,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 9,
            right: SENTINEL_INDEX,
            tag: "span",
          },
          {
            // 9
            color: Color.Black,
            id: "helloWorld",
            left: 8,
            leftSubTreeLength: 1,
            parent: 10,
            right: SENTINEL_INDEX,
            tag: "span",
          },
          {
            // 10
            color: Color.Red,
            id: "helloWorld",
            left: 9,
            leftSubTreeLength: 2,
            parent: 7,
            right: 12,
            tag: "span",
          },
          {
            // 11
            color: Color.Red,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 12,
            right: SENTINEL_INDEX,
            tag: "span",
          },
          {
            // 12
            color: Color.Black,
            id: "helloWorld",
            left: 11,
            leftSubTreeLength: 1,
            parent: 10,
            right: 13,
            tag: "span",
          },
          {
            // 13
            color: Color.Red,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 12,
            right: SENTINEL_INDEX,
            tag: "span",
          },
        ],
        root: 5,
      },
    };
    const state: StatePages = {
      pageId: page,
    };

    const expectedPage: PageContentMutable = {
      buffers: [],
      content: { nodes: [SENTINEL_CONTENT], root: SENTINEL_INDEX },
      newlineFormat: NEWLINE.LF,
      previouslyInsertedContentNodeIndex: null,
      previouslyInsertedContentNodeOffset: null,
      structure: {
        nodes: [
          SENTINEL_STRUCTURE,
          {
            // 1
            color: Color.Red,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 2,
            right: SENTINEL_INDEX,
            tag: "span",
          },
          {
            // 2
            color: Color.Black,
            id: "helloWorld",
            left: 1,
            leftSubTreeLength: 1,
            parent: 3,
            right: SENTINEL_INDEX,
            tag: "span",
          },
          {
            // 3
            color: Color.Black,
            id: "helloWorld",
            left: 2,
            leftSubTreeLength: 2,
            parent: 5,
            right: 4,
            tag: "span",
          },
          {
            // 4
            color: Color.Black,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 3,
            right: SENTINEL_INDEX,
            tag: "span",
          },
          {
            // 5
            color: Color.Black,
            id: "helloWorld",
            left: 3,
            leftSubTreeLength: 4,
            parent: SENTINEL_INDEX,
            right: 7,
            tag: "span",
          },
          {
            // 6
            color: Color.Black,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 7,
            right: SENTINEL_INDEX,
            tag: "span",
          },
          {
            // 7
            color: Color.Black,
            id: "helloWorld",
            left: 6,
            leftSubTreeLength: 1,
            parent: 5,
            right: 10,
            tag: "span",
          },
          {
            // 8
            color: Color.Red,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 9,
            right: SENTINEL_INDEX,
            tag: "span",
          },
          {
            // 9
            color: Color.Black,
            id: "helloWorld",
            left: 8,
            leftSubTreeLength: 1,
            parent: 10,
            right: 14,
            tag: "span",
          },
          {
            // 10
            color: Color.Red,
            id: "helloWorld",
            left: 9,
            leftSubTreeLength: 3,
            parent: 7,
            right: 12,
            tag: "span",
          },
          {
            // 11
            color: Color.Red,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 12,
            right: SENTINEL_INDEX,
            tag: "span",
          },
          {
            // 12
            color: Color.Black,
            id: "helloWorld",
            left: 11,
            leftSubTreeLength: 1,
            parent: 10,
            right: 13,
            tag: "span",
          },
          {
            // 13
            color: Color.Red,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 12,
            right: SENTINEL_INDEX,
            tag: "span",
          },
          {
            // 14
            color: Color.Red,
            id: "newNode",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 9,
            right: SENTINEL_INDEX,
            styles: undefined,
            tag: "img",
          },
        ],
        root: 5,
      },
    };
    const expectedState: StatePages = {
      pageId: expectedPage,
    };

    const resultState = pageReducer(
      state,
      insertStructure("pageId", 10, "img", "newNode"),
    );
    expect(resultState).toStrictEqual(expectedState);
  });

  test("Greater than insertion", () => {
    const page: PageContentMutable = {
      buffers: [],
      content: { nodes: [SENTINEL_CONTENT], root: SENTINEL_INDEX },
      newlineFormat: NEWLINE.LF,
      previouslyInsertedContentNodeIndex: null,
      previouslyInsertedContentNodeOffset: null,
      structure: {
        nodes: [
          SENTINEL_STRUCTURE,
          {
            // 1
            color: Color.Red,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 2,
            right: SENTINEL_INDEX,
            tag: "span",
          },
          {
            // 2
            color: Color.Black,
            id: "helloWorld",
            left: 1,
            leftSubTreeLength: 1,
            parent: 3,
            right: SENTINEL_INDEX,
            tag: "span",
          },
          {
            // 3
            color: Color.Black,
            id: "helloWorld",
            left: 2,
            leftSubTreeLength: 2,
            parent: 5,
            right: 4,
            tag: "span",
          },
          {
            // 4
            color: Color.Black,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 3,
            right: SENTINEL_INDEX,
            tag: "span",
          },
          {
            // 5
            color: Color.Black,
            id: "helloWorld",
            left: 3,
            leftSubTreeLength: 4,
            parent: SENTINEL_INDEX,
            right: 7,
            tag: "span",
          },
          {
            // 6
            color: Color.Black,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 7,
            right: SENTINEL_INDEX,
            tag: "span",
          },
          {
            // 7
            color: Color.Black,
            id: "helloWorld",
            left: 6,
            leftSubTreeLength: 1,
            parent: 5,
            right: 10,
            tag: "span",
          },
          {
            // 8
            color: Color.Red,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 9,
            right: SENTINEL_INDEX,
            tag: "span",
          },
          {
            // 9
            color: Color.Black,
            id: "helloWorld",
            left: 8,
            leftSubTreeLength: 1,
            parent: 10,
            right: SENTINEL_INDEX,
            tag: "span",
          },
          {
            // 10
            color: Color.Red,
            id: "helloWorld",
            left: 9,
            leftSubTreeLength: 2,
            parent: 7,
            right: 12,
            tag: "span",
          },
          {
            // 11
            color: Color.Red,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 12,
            right: SENTINEL_INDEX,
            tag: "span",
          },
          {
            // 12
            color: Color.Black,
            id: "helloWorld",
            left: 11,
            leftSubTreeLength: 1,
            parent: 10,
            right: 13,
            tag: "span",
          },
          {
            // 13
            color: Color.Red,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 12,
            right: SENTINEL_INDEX,
            tag: "span",
          },
        ],
        root: 5,
      },
    };
    const state: StatePages = {
      pageId: page,
    };

    const expectedPage: PageContentMutable = {
      buffers: [],
      content: { nodes: [SENTINEL_CONTENT], root: SENTINEL_INDEX },
      newlineFormat: NEWLINE.LF,
      previouslyInsertedContentNodeIndex: null,
      previouslyInsertedContentNodeOffset: null,
      structure: {
        nodes: [
          SENTINEL_STRUCTURE,
          {
            // 1
            color: Color.Red,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 2,
            right: SENTINEL_INDEX,
            tag: "span",
          },
          {
            // 2
            color: Color.Black,
            id: "helloWorld",
            left: 1,
            leftSubTreeLength: 1,
            parent: 3,
            right: SENTINEL_INDEX,
            tag: "span",
          },
          {
            // 3
            color: Color.Black,
            id: "helloWorld",
            left: 2,
            leftSubTreeLength: 2,
            parent: 5,
            right: 4,
            tag: "span",
          },
          {
            // 4
            color: Color.Black,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 3,
            right: SENTINEL_INDEX,
            tag: "span",
          },
          {
            // 5
            color: Color.Black,
            id: "helloWorld",
            left: 3,
            leftSubTreeLength: 4,
            parent: SENTINEL_INDEX,
            right: 10,
            tag: "span",
          },
          {
            // 6
            color: Color.Black,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 7,
            right: SENTINEL_INDEX,
            tag: "span",
          },
          {
            // 7
            color: Color.Red,
            id: "helloWorld",
            left: 6,
            leftSubTreeLength: 1,
            parent: 10,
            right: 9,
            tag: "span",
          },
          {
            // 8
            color: Color.Red,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 9,
            right: SENTINEL_INDEX,
            tag: "span",
          },
          {
            // 9
            color: Color.Black,
            id: "helloWorld",
            left: 8,
            leftSubTreeLength: 1,
            parent: 7,
            right: SENTINEL_INDEX,
            tag: "span",
          },
          {
            // 10
            color: Color.Black,
            id: "helloWorld",
            left: 7,
            leftSubTreeLength: 4,
            parent: 5,
            right: 12,
            tag: "span",
          },
          {
            // 11
            color: Color.Black,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 12,
            right: SENTINEL_INDEX,
            tag: "span",
          },
          {
            // 12
            color: Color.Red,
            id: "helloWorld",
            left: 11,
            leftSubTreeLength: 1,
            parent: 10,
            right: 13,
            tag: "span",
          },
          {
            // 13
            color: Color.Black,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 12,
            right: 14,
            tag: "span",
          },
          {
            // 14
            color: Color.Red,
            id: "newNode",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            parent: 13,
            right: SENTINEL_INDEX,
            styles: undefined,
            tag: "img",
          },
        ],
        root: 5,
      },
    };
    const expectedState: StatePages = {
      pageId: expectedPage,
    };

    const resultState = pageReducer(
      state,
      insertStructure("pageId", 14, "img", "newNode"),
    );
    expect(resultState).toStrictEqual(expectedState);
  });
});
