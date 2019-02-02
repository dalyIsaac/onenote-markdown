import { Color, PageContent, PageContentMutable, StatePages } from "../pageModel";
import { SENTINEL_INDEX, EMPTY_TREE_ROOT } from "../tree/tree";
import { SENTINEL_STRUCTURE } from "./tree";
import { SENTINEL_CONTENT } from "../contentTree/tree";
import pageReducer from "../reducer";
import { insertStructure } from "./actions";
import { TagType } from "./structureModel";

export const getBigTree = (): PageContent => ({
  buffers: [],
  content: { nodes: [SENTINEL_CONTENT], root: SENTINEL_INDEX },

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
        length: 0,
        parent: 2,
        right: SENTINEL_INDEX,
        tag: "span",
        tagType: TagType.StartEndTag,
      },
      {
        // 2
        color: Color.Black,
        id: "helloWorld",
        left: 1,
        leftSubTreeLength: 1,
        length: 0,
        parent: 3,
        right: SENTINEL_INDEX,
        tag: "span",
        tagType: TagType.StartEndTag,
      },
      {
        // 3
        color: Color.Black,
        id: "helloWorld",
        left: 2,
        leftSubTreeLength: 2,
        length: 0,
        parent: 5,
        right: 4,
        tag: "span",
        tagType: TagType.StartEndTag,
      },
      {
        // 4
        color: Color.Black,
        id: "helloWorld",
        left: SENTINEL_INDEX,
        leftSubTreeLength: 0,
        length: 0,
        parent: 3,
        right: SENTINEL_INDEX,
        tag: "span",
        tagType: TagType.StartEndTag,
      },
      {
        // 5
        color: Color.Black,
        id: "helloWorld",
        left: 3,
        leftSubTreeLength: 4,
        length: 0,
        parent: SENTINEL_INDEX,
        right: 7,
        tag: "span",
        tagType: TagType.StartEndTag,
      },
      {
        // 6
        color: Color.Black,
        id: "helloWorld",
        left: SENTINEL_INDEX,
        leftSubTreeLength: 0,
        length: 0,
        parent: 7,
        right: SENTINEL_INDEX,
        tag: "span",
        tagType: TagType.StartEndTag,
      },
      {
        // 7
        color: Color.Black,
        id: "helloWorld",
        left: 6,
        leftSubTreeLength: 1,
        length: 0,
        parent: 5,
        right: 10,
        tag: "span",
        tagType: TagType.StartEndTag,
      },
      {
        // 8
        color: Color.Black,
        id: "helloWorld",
        left: 14,
        leftSubTreeLength: 1,
        length: 0,
        parent: 10,
        right: 9,
        tag: "span",
        tagType: TagType.StartEndTag,
      },
      {
        // 9
        color: Color.Red,
        id: "helloWorld",
        left: SENTINEL_INDEX,
        leftSubTreeLength: 0,
        length: 0,
        parent: 8,
        right: SENTINEL_INDEX,
        tag: "span",
        tagType: TagType.StartEndTag,
      },
      {
        // 10
        color: Color.Red,
        id: "helloWorld",
        left: 8,
        leftSubTreeLength: 3,
        length: 0,
        parent: 7,
        right: 12,
        tag: "span",
        tagType: TagType.StartEndTag,
      },
      {
        // 11
        color: Color.Red,
        id: "helloWorld",
        left: SENTINEL_INDEX,
        leftSubTreeLength: 0,
        length: 0,
        parent: 12,
        right: SENTINEL_INDEX,
        tag: "span",
        tagType: TagType.StartEndTag,
      },
      {
        // 12
        color: Color.Black,
        id: "helloWorld",
        left: 11,
        leftSubTreeLength: 1,
        length: 0,
        parent: 10,
        right: 13,
        tag: "span",
        tagType: TagType.StartEndTag,
      },
      {
        // 13
        color: Color.Red,
        id: "helloWorld",
        left: SENTINEL_INDEX,
        leftSubTreeLength: 0,
        length: 0,
        parent: 12,
        right: SENTINEL_INDEX,
        tag: "span",
        tagType: TagType.StartEndTag,
      },
      {
        // 14
        color: Color.Red,
        id: "newNode",
        left: SENTINEL_INDEX,
        leftSubTreeLength: 0,
        length: 0,
        parent: 8,
        right: SENTINEL_INDEX,
        tag: "img",
        tagType: TagType.StartEndTag,
      },
    ],
    root: 5,
  },
})

describe("structureTree insert tests", () => {
  test("Less than insertion - left side", () => {
    const page: PageContentMutable = {
      buffers: [],
      content: { nodes: [SENTINEL_CONTENT], root: SENTINEL_INDEX },

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
            length: 0,
            parent: 2,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 2
            color: Color.Black,
            id: "helloWorld",
            left: 1,
            leftSubTreeLength: 1,
            length: 0,
            parent: 3,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 3
            color: Color.Black,
            id: "helloWorld",
            left: 2,
            leftSubTreeLength: 2,
            length: 0,
            parent: 5,
            right: 4,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 4
            color: Color.Black,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 0,
            parent: 3,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 5
            color: Color.Black,
            id: "helloWorld",
            left: 3,
            leftSubTreeLength: 4,
            length: 0,
            parent: SENTINEL_INDEX,
            right: 7,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 6
            color: Color.Black,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 0,
            parent: 7,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 7
            color: Color.Black,
            id: "helloWorld",
            left: 6,
            leftSubTreeLength: 1,
            length: 0,
            parent: 5,
            right: 10,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 8
            color: Color.Black,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 0,
            parent: 10,
            right: 9,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 9
            color: Color.Red,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 0,
            parent: 8,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 10
            color: Color.Red,
            id: "helloWorld",
            left: 8,
            leftSubTreeLength: 2,
            length: 0,
            parent: 7,
            right: 12,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 11
            color: Color.Red,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 0,
            parent: 12,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 12
            color: Color.Black,
            id: "helloWorld",
            left: 11,
            leftSubTreeLength: 1,
            length: 0,
            parent: 10,
            right: 13,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 13
            color: Color.Red,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 0,
            parent: 12,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
        ],
        root: 5,
      },
    };
    const state: StatePages = {
      pageId: page,
    };

    const expectedState: StatePages = {
      pageId: getBigTree(),
    };

    const resultState = pageReducer(
      state,
      insertStructure("pageId", 8, 0, "img", TagType.StartEndTag, "newNode"),
    );
    expect(resultState).toStrictEqual(expectedState);
  });

  test("Less than insertion - right side", () => {
    const page: PageContentMutable = {
      buffers: [],
      content: { nodes: [SENTINEL_CONTENT], root: SENTINEL_INDEX },

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
            length: 0,
            parent: 2,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 2
            color: Color.Black,
            id: "helloWorld",
            left: 1,
            leftSubTreeLength: 1,
            length: 0,
            parent: 3,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 3
            color: Color.Black,
            id: "helloWorld",
            left: 2,
            leftSubTreeLength: 2,
            length: 0,
            parent: 5,
            right: 4,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 4
            color: Color.Black,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 0,
            parent: 3,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 5
            color: Color.Black,
            id: "helloWorld",
            left: 3,
            leftSubTreeLength: 4,
            length: 0,
            parent: SENTINEL_INDEX,
            right: 7,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 6
            color: Color.Black,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 0,
            parent: 7,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 7
            color: Color.Black,
            id: "helloWorld",
            left: 6,
            leftSubTreeLength: 1,
            length: 0,
            parent: 5,
            right: 10,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 8
            color: Color.Red,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 0,
            parent: 9,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 9
            color: Color.Black,
            id: "helloWorld",
            left: 8,
            leftSubTreeLength: 1,
            length: 0,
            parent: 10,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 10
            color: Color.Red,
            id: "helloWorld",
            left: 9,
            leftSubTreeLength: 2,
            length: 0,
            parent: 7,
            right: 12,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 11
            color: Color.Red,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 0,
            parent: 12,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 12
            color: Color.Black,
            id: "helloWorld",
            left: 11,
            leftSubTreeLength: 1,
            length: 0,
            parent: 10,
            right: 13,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 13
            color: Color.Red,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 0,
            parent: 12,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
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
            length: 0,
            parent: 2,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 2
            color: Color.Black,
            id: "helloWorld",
            left: 1,
            leftSubTreeLength: 1,
            length: 0,
            parent: 3,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 3
            color: Color.Black,
            id: "helloWorld",
            left: 2,
            leftSubTreeLength: 2,
            length: 0,
            parent: 5,
            right: 4,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 4
            color: Color.Black,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 0,
            parent: 3,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 5
            color: Color.Black,
            id: "helloWorld",
            left: 3,
            leftSubTreeLength: 4,
            length: 0,
            parent: SENTINEL_INDEX,
            right: 7,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 6
            color: Color.Black,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 0,
            parent: 7,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 7
            color: Color.Black,
            id: "helloWorld",
            left: 6,
            leftSubTreeLength: 1,
            length: 0,
            parent: 5,
            right: 10,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 8
            color: Color.Red,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 0,
            parent: 9,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 9
            color: Color.Black,
            id: "helloWorld",
            left: 8,
            leftSubTreeLength: 1,
            length: 0,
            parent: 10,
            right: 14,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 10
            color: Color.Red,
            id: "helloWorld",
            left: 9,
            leftSubTreeLength: 3,
            length: 0,
            parent: 7,
            right: 12,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 11
            color: Color.Red,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 0,
            parent: 12,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 12
            color: Color.Black,
            id: "helloWorld",
            left: 11,
            leftSubTreeLength: 1,
            length: 0,
            parent: 10,
            right: 13,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 13
            color: Color.Red,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 0,
            parent: 12,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 14
            color: Color.Red,
            id: "newNode",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 0,
            parent: 9,
            right: SENTINEL_INDEX,
            tag: "img",
            tagType: TagType.StartEndTag,
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
      insertStructure(
        "pageId",
        10,
        0,
        "img",
        TagType.StartEndTag,
        "newNode",
        undefined,
        undefined,
      ),
    );
    expect(resultState).toStrictEqual(expectedState);
  });

  test("Greater than insertion", () => {
    const page: PageContentMutable = {
      buffers: [],
      content: { nodes: [SENTINEL_CONTENT], root: SENTINEL_INDEX },

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
            length: 0,
            parent: 2,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 2
            color: Color.Black,
            id: "helloWorld",
            left: 1,
            leftSubTreeLength: 1,
            length: 0,
            parent: 3,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 3
            color: Color.Black,
            id: "helloWorld",
            left: 2,
            leftSubTreeLength: 2,
            length: 0,
            parent: 5,
            right: 4,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 4
            color: Color.Black,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 0,
            parent: 3,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 5
            color: Color.Black,
            id: "helloWorld",
            left: 3,
            leftSubTreeLength: 4,
            length: 0,
            parent: SENTINEL_INDEX,
            right: 7,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 6
            color: Color.Black,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 0,
            parent: 7,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 7
            color: Color.Black,
            id: "helloWorld",
            left: 6,
            leftSubTreeLength: 1,
            length: 0,
            parent: 5,
            right: 10,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 8
            color: Color.Red,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 0,
            parent: 9,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 9
            color: Color.Black,
            id: "helloWorld",
            left: 8,
            leftSubTreeLength: 1,
            length: 0,
            parent: 10,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 10
            color: Color.Red,
            id: "helloWorld",
            left: 9,
            leftSubTreeLength: 2,
            length: 0,
            parent: 7,
            right: 12,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 11
            color: Color.Red,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 0,
            parent: 12,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 12
            color: Color.Black,
            id: "helloWorld",
            left: 11,
            leftSubTreeLength: 1,
            length: 0,
            parent: 10,
            right: 13,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 13
            color: Color.Red,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 0,
            parent: 12,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
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
            length: 0,
            parent: 2,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 2
            color: Color.Black,
            id: "helloWorld",
            left: 1,
            leftSubTreeLength: 1,
            length: 0,
            parent: 3,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 3
            color: Color.Black,
            id: "helloWorld",
            left: 2,
            leftSubTreeLength: 2,
            length: 0,
            parent: 5,
            right: 4,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 4
            color: Color.Black,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 0,
            parent: 3,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 5
            color: Color.Black,
            id: "helloWorld",
            left: 3,
            leftSubTreeLength: 4,
            length: 0,
            parent: SENTINEL_INDEX,
            right: 10,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 6
            color: Color.Black,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 0,
            parent: 7,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 7
            color: Color.Red,
            id: "helloWorld",
            left: 6,
            leftSubTreeLength: 1,
            length: 0,
            parent: 10,
            right: 9,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 8
            color: Color.Red,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 0,
            parent: 9,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 9
            color: Color.Black,
            id: "helloWorld",
            left: 8,
            leftSubTreeLength: 1,
            length: 0,
            parent: 7,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 10
            color: Color.Black,
            id: "helloWorld",
            left: 7,
            leftSubTreeLength: 4,
            length: 0,
            parent: 5,
            right: 12,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 11
            color: Color.Black,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 0,
            parent: 12,
            right: SENTINEL_INDEX,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 12
            color: Color.Red,
            id: "helloWorld",
            left: 11,
            leftSubTreeLength: 1,
            length: 0,
            parent: 10,
            right: 13,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 13
            color: Color.Black,
            id: "helloWorld",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 0,
            parent: 12,
            right: 14,
            tag: "span",
            tagType: TagType.StartEndTag,
          },
          {
            // 14
            color: Color.Red,
            id: "newNode",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 0,
            parent: 13,
            right: SENTINEL_INDEX,
            tag: "img",
            tagType: TagType.StartEndTag,
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
      insertStructure("pageId", 14, 0, "img", TagType.StartEndTag, "newNode"),
    );
    expect(resultState).toStrictEqual(expectedState);
  });

  test("Insert the root of the tree", () => {
    const state: StatePages = {
      pageId: {
        buffers: [],
        content: { nodes: [SENTINEL_CONTENT], root: EMPTY_TREE_ROOT },
        previouslyInsertedContentNodeIndex: null,
        previouslyInsertedContentNodeOffset: null,
        structure: { nodes: [SENTINEL_STRUCTURE], root: EMPTY_TREE_ROOT },
      },
    };

    const expectedState: StatePages = {
      pageId: {
        buffers: [],
        content: { nodes: [SENTINEL_CONTENT], root: EMPTY_TREE_ROOT },
        previouslyInsertedContentNodeIndex: null,
        previouslyInsertedContentNodeOffset: null,
        structure: {
          nodes: [
            SENTINEL_STRUCTURE,
            {
              color: Color.Black,
              id: "id",
              left: SENTINEL_INDEX,
              leftSubTreeLength: 0,
              length: 0,
              parent: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
              tag: "tag",
              tagType: TagType.StartEndTag,
            },
          ],
          root: 1,
        },
      },
    };

    const resultState = pageReducer(
      state,
      insertStructure("pageId", 1, 0, "tag", TagType.StartEndTag, "id"),
    );
    expect(resultState).toStrictEqual(expectedState);
  });
});
