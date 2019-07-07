import { PageContent, Color, StatePages } from "../pageModel";
import { SENTINEL_CONTENT } from "../contentTree/tree";
import { SENTINEL_INDEX } from "../tree/tree";
import { SENTINEL_STRUCTURE } from "./tree";
import { TagType } from "./structureModel";
import pageReducer from "../reducer";
import { updateStructure } from "./actions";

describe("Update a structure node", (): void => {
  const getPage = (): PageContent => ({
    buffers: [],
    content: { nodes: [SENTINEL_CONTENT], root: SENTINEL_INDEX },

    previouslyInsertedContentNodeIndex: null,
    previouslyInsertedContentNodeOffset: null,
    structure: {
      nodes: [
        SENTINEL_STRUCTURE,
        {
          // u
          // 1
          color: Color.Red,
          id: "helloWorld",
          left: SENTINEL_INDEX,
          leftSubTreeLength: 0,
          length: 0,
          parent: 2,
          right: SENTINEL_INDEX,
          tag: "id",
          tagType: TagType.StartEndTag,
        },
        {
          // v
          // 2
          color: Color.Black,
          id: "helloWorld",
          left: 1,
          leftSubTreeLength: 1,
          length: 0,
          parent: 3,
          right: SENTINEL_INDEX,
          tag: "id",
          tagType: TagType.StartEndTag,
        },
        {
          // 3
          color: Color.Black,
          id: "helloWorld",
          left: 2,
          leftSubTreeLength: 2,
          length: 0,
          parent: SENTINEL_INDEX,
          right: 4,
          tag: "id",
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
          tag: "id",
          tagType: TagType.StartEndTag,
        },
      ],
      root: 3,
    },
  });

  const getExpectedPage = (): PageContent => ({
    buffers: [],
    content: { nodes: [SENTINEL_CONTENT], root: SENTINEL_INDEX },

    previouslyInsertedContentNodeIndex: null,
    previouslyInsertedContentNodeOffset: null,
    structure: {
      nodes: [
        SENTINEL_STRUCTURE,
        {
          // u
          // 1
          color: Color.Red,
          id: "helloWorld",
          left: SENTINEL_INDEX,
          leftSubTreeLength: 0,
          length: 0,
          parent: 2,
          right: SENTINEL_INDEX,
          tag: "id",
          tagType: TagType.StartEndTag,
        },
        {
          // v
          // 2
          color: Color.Black,
          id: "helloWorld",
          left: 1,
          leftSubTreeLength: 1,
          length: 0,
          parent: 3,
          right: SENTINEL_INDEX,
          tag: "id",
          tagType: TagType.StartEndTag,
        },
        {
          // 3
          color: Color.Black,
          id: "helloWorld",
          left: 2,
          leftSubTreeLength: 2,
          length: 0,
          parent: SENTINEL_INDEX,
          right: 4,
          tag: "id",
          tagType: TagType.StartEndTag,
        },
        {
          // 4
          attributes: { smelliness: "excessive" },
          color: Color.Black,
          id: "helloWorld",
          left: SENTINEL_INDEX,
          leftSubTreeLength: 0,
          length: 1,
          parent: 3,
          right: SENTINEL_INDEX,
          style: { camelLength: "2" },
          tag: "id",
          tagType: TagType.StartEndTag,
        },
      ],
      root: 3,
    },
  });

  test("Ensures that the references are different", (): void => {
    const state: StatePages = {
      pageId: getPage(),
    };

    const action = updateStructure("pageId", 4, {
      attributes: { smelliness: "excessive" },
      length: 1,
      style: { camelLength: "2" },
    });

    const result = pageReducer(state, action);
    expect(result["pageId"].structure.nodes[4]).not.toBe(
      state["pageId"].structure.nodes[4],
    );
  });

  test("Ensures that the update occurs successfully", (): void => {
    const state: StatePages = {
      pageId: getPage(),
    };

    const expectedState: StatePages = {
      pageId: getExpectedPage(),
    };

    const action = updateStructure("pageId", 4, {
      attributes: { smelliness: "excessive" },
      length: 1,
      style: { camelLength: "2" },
    });
    const result = pageReducer(state, action);
    expect(result).toStrictEqual(expectedState);
  });
});
