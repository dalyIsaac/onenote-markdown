import { PageContent, Color } from "../pageModel";
import { SENTINEL_CONTENT } from "../contentTree/tree";
import { SENTINEL_INDEX } from "./tree";
import { ContentNode } from "../contentTree/contentModel";
import { SENTINEL_STRUCTURE } from "../structureTree/tree";
import { fixInsert } from "./insert";

describe("fix insert function", (): void => {
  describe("black uncle cases", (): void => {
    test("Scenario 1: Left left case", (): void => {
      const page: PageContent = {
        buffers: [],
        content: {
          nodes: [
            SENTINEL_CONTENT,
            {
              // g
              bufferIndex: 0,
              color: Color.Black,
              end: {
                column: 0,
                line: 0,
              },
              left: 2,
              leftCharCount: 20,
              leftLineFeedCount: 4,
              length: 10,
              lineFeedCount: 2,
              parent: SENTINEL_INDEX,
              right: 3,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // p,
              bufferIndex: 1,
              color: Color.Red,
              end: {
                column: 0,
                line: 0,
              },
              left: 4,
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              parent: 1,
              right: 5,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // u
              bufferIndex: 2,
              color: Color.Black,
              end: {
                column: 0,
                line: 0,
              },
              left: SENTINEL_INDEX,
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              parent: 1,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // x
              bufferIndex: 3,
              color: Color.Red,
              end: {
                column: 0,
                line: 0,
              },
              left: SENTINEL_INDEX,
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              parent: 2,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // T3
              bufferIndex: 4,
              color: Color.Black,
              end: {
                column: 0,
                line: 0,
              },
              left: SENTINEL_INDEX,
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              parent: 2,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
          ],
          root: 1,
        },

        previouslyInsertedContentNodeIndex: null,

        previouslyInsertedContentNodeOffset: null,
        structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
      };
      const expectedPage: PageContent = {
        buffers: [],
        content: {
          nodes: [
            SENTINEL_CONTENT,
            {
              // g
              bufferIndex: 0,
              color: Color.Red,
              end: {
                column: 0,
                line: 0,
              },
              left: 5,
              leftCharCount: 10,
              leftLineFeedCount: 2,
              length: 10,
              lineFeedCount: 2,
              parent: 2,
              right: 3,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // p
              bufferIndex: 1,
              color: Color.Black,
              end: {
                column: 0,
                line: 0,
              },
              left: 4,
              leftCharCount: 10,
              leftLineFeedCount: 2,
              length: 10,
              lineFeedCount: 2,
              parent: SENTINEL_INDEX,
              right: 1,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // u
              bufferIndex: 2,
              color: Color.Black,
              end: {
                column: 0,
                line: 0,
              },
              left: SENTINEL_INDEX,
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              parent: 1,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // x
              bufferIndex: 3,
              color: Color.Red,
              end: {
                column: 0,
                line: 0,
              },
              left: SENTINEL_INDEX,
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              parent: 2,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // T3
              bufferIndex: 4,
              color: Color.Black,
              end: {
                column: 0,
                line: 0,
              },
              left: SENTINEL_INDEX,
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              parent: 1,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
          ],
          root: 2,
        },

        previouslyInsertedContentNodeIndex: null,

        previouslyInsertedContentNodeOffset: null,
        structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
      };
      fixInsert(page.content, 4);
      expect(page).toStrictEqual(expectedPage);
    });

    test("Scenario 2: Left right case", (): void => {
      const page: PageContent = {
        buffers: [],
        content: {
          nodes: [
            SENTINEL_CONTENT,
            {
              // g
              bufferIndex: 0,
              color: Color.Black,
              end: {
                column: 0,
                line: 0,
              },
              left: 2,
              leftCharCount: 20,
              leftLineFeedCount: 4,
              length: 10,
              lineFeedCount: 2,
              parent: SENTINEL_INDEX,
              right: 3,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // p
              bufferIndex: 1,
              color: Color.Red,
              end: {
                column: 0,
                line: 0,
              },
              left: 4,
              leftCharCount: 10,
              leftLineFeedCount: 2,
              length: 10,
              lineFeedCount: 2,
              parent: 1,
              right: 5,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // u
              bufferIndex: 2,
              color: Color.Black,
              end: {
                column: 0,
                line: 0,
              },
              left: SENTINEL_INDEX,
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              parent: 1,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // T1
              bufferIndex: 3,
              color: Color.Black,
              end: {
                column: 0,
                line: 0,
              },
              left: SENTINEL_INDEX,
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              parent: 2,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // x
              bufferIndex: 4,
              color: Color.Red,
              end: {
                column: 0,
                line: 0,
              },
              left: SENTINEL_INDEX,
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              parent: 2,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
          ],
          root: 1,
        },

        previouslyInsertedContentNodeIndex: null,
        previouslyInsertedContentNodeOffset: null,
        structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
      };
      const expectedPage: PageContent = {
        buffers: [],
        content: {
          nodes: [
            SENTINEL_CONTENT,
            {
              // g
              bufferIndex: 0,
              color: Color.Red,
              end: {
                column: 0,
                line: 0,
              },
              left: SENTINEL_INDEX,
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              parent: 5,
              right: 3,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // p
              bufferIndex: 1,
              color: Color.Red,
              end: {
                column: 0,
                line: 0,
              },
              left: 4,
              leftCharCount: 10,
              leftLineFeedCount: 2,
              length: 10,
              lineFeedCount: 2,
              parent: 5,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // u
              bufferIndex: 2,
              color: Color.Black,
              end: {
                column: 0,
                line: 0,
              },
              left: SENTINEL_INDEX,
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              parent: 1,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // T1
              bufferIndex: 3,
              color: Color.Black,
              end: {
                column: 0,
                line: 0,
              },
              left: SENTINEL_INDEX,
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              parent: 2,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // x
              bufferIndex: 4,
              color: Color.Black,
              end: {
                column: 0,
                line: 0,
              },
              left: 2,
              leftCharCount: 20,
              leftLineFeedCount: 4,
              length: 10,
              lineFeedCount: 2,
              parent: SENTINEL_INDEX,
              right: 1,
              start: {
                column: 0,
                line: 0,
              },
            },
          ],
          root: 5,
        },

        previouslyInsertedContentNodeIndex: null,
        previouslyInsertedContentNodeOffset: null,
        structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
      };
      fixInsert(page.content, 5);
      expect(page).toStrictEqual(expectedPage);
    });

    test("Scenario 3: Right right case", (): void => {
      const page: PageContent = {
        buffers: [],
        content: {
          nodes: [
            SENTINEL_CONTENT,
            {
              // g
              bufferIndex: 0,
              color: Color.Black,
              end: {
                column: 0,
                line: 0,
              },
              left: 2,
              leftCharCount: 10,
              leftLineFeedCount: 2,
              length: 10,
              lineFeedCount: 2,
              parent: SENTINEL_INDEX,
              right: 3,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // u
              bufferIndex: 1,
              color: Color.Black,
              end: {
                column: 0,
                line: 0,
              },
              left: SENTINEL_INDEX,
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              parent: 1,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // p
              bufferIndex: 2,
              color: Color.Red,
              end: {
                column: 0,
                line: 0,
              },
              left: 4,
              leftCharCount: 10,
              leftLineFeedCount: 2,
              length: 10,
              lineFeedCount: 2,
              parent: 1,
              right: 5,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // T3
              bufferIndex: 3,
              color: Color.Black,
              end: {
                column: 0,
                line: 0,
              },
              left: SENTINEL_INDEX,
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              parent: 3,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // x
              bufferIndex: 4,
              color: Color.Red,
              end: {
                column: 0,
                line: 0,
              },
              left: SENTINEL_INDEX,
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              parent: 3,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
          ],
          root: 1,
        },

        previouslyInsertedContentNodeIndex: null,
        previouslyInsertedContentNodeOffset: null,
        structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
      };
      const expectedPage: PageContent = {
        buffers: [],
        content: {
          nodes: [
            SENTINEL_CONTENT,
            {
              // g
              bufferIndex: 0,
              color: Color.Red,
              end: {
                column: 0,
                line: 0,
              },
              left: 2,
              leftCharCount: 10,
              leftLineFeedCount: 2,
              length: 10,
              lineFeedCount: 2,
              parent: 3,
              right: 4,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // u
              bufferIndex: 1,
              color: Color.Black,
              end: {
                column: 0,
                line: 0,
              },
              left: SENTINEL_INDEX,
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              parent: 1,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // p
              bufferIndex: 2,
              color: Color.Black,
              end: {
                column: 0,
                line: 0,
              },
              left: 1,
              leftCharCount: 30,
              leftLineFeedCount: 6,
              length: 10,
              lineFeedCount: 2,
              parent: SENTINEL_INDEX,
              right: 5,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // T3
              bufferIndex: 3,
              color: Color.Black,
              end: {
                column: 0,
                line: 0,
              },
              left: SENTINEL_INDEX,
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              parent: 1,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // x
              bufferIndex: 4,
              color: Color.Red,
              end: {
                column: 0,
                line: 0,
              },
              left: SENTINEL_INDEX,
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              parent: 3,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
          ],
          root: 3,
        },

        previouslyInsertedContentNodeIndex: null,
        previouslyInsertedContentNodeOffset: null,
        structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
      };
      fixInsert(page.content, 5);
      expect(page).toStrictEqual(expectedPage);
    });

    test("Scenario 4: Right left case", (): void => {
      const page: PageContent = {
        buffers: [],
        content: {
          nodes: [
            SENTINEL_CONTENT,
            {
              // g
              bufferIndex: 0,
              color: Color.Black,
              end: {
                column: 0,
                line: 0,
              },
              left: 2,
              leftCharCount: 10,
              leftLineFeedCount: 2,
              length: 10,
              lineFeedCount: 2,
              parent: SENTINEL_INDEX,
              right: 3,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // u
              bufferIndex: 1,
              color: Color.Black,
              end: {
                column: 0,
                line: 0,
              },
              left: SENTINEL_INDEX,
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              parent: 1,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // p
              bufferIndex: 2,
              color: Color.Red,
              end: {
                column: 0,
                line: 0,
              },
              left: 4,
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              parent: 1,
              right: 5,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // x
              bufferIndex: 3,
              color: Color.Red,
              end: {
                column: 0,
                line: 0,
              },
              left: SENTINEL_INDEX,
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              parent: 3,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // T5
              bufferIndex: 4,
              color: Color.Black,
              end: {
                column: 0,
                line: 0,
              },
              left: SENTINEL_INDEX,
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              parent: 3,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
          ],
          root: 1,
        },

        previouslyInsertedContentNodeIndex: null,
        previouslyInsertedContentNodeOffset: null,
        structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
      };
      const expectedPage: PageContent = {
        buffers: [],
        content: {
          nodes: [
            SENTINEL_CONTENT,
            {
              // g
              bufferIndex: 0,
              color: Color.Red,
              end: {
                column: 0,
                line: 0,
              },
              left: 2,
              leftCharCount: 10,
              leftLineFeedCount: 2,
              length: 10,
              lineFeedCount: 2,
              parent: 4,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // u
              bufferIndex: 1,
              color: Color.Black,
              end: {
                column: 0,
                line: 0,
              },
              left: SENTINEL_INDEX,
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              parent: 1,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // p
              bufferIndex: 2,
              color: Color.Red,
              end: {
                column: 0,
                line: 0,
              },
              left: SENTINEL_INDEX,
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              parent: 4,
              right: 5,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // x
              bufferIndex: 3,
              color: Color.Black,
              end: {
                column: 0,
                line: 0,
              },
              left: 1,
              leftCharCount: 20,
              leftLineFeedCount: 4,
              length: 10,
              lineFeedCount: 2,
              parent: SENTINEL_INDEX,
              right: 3,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // T5
              bufferIndex: 4,
              color: Color.Black,
              end: {
                column: 0,
                line: 0,
              },
              left: SENTINEL_INDEX,
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              parent: 3,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
          ],
          root: 4,
        },

        previouslyInsertedContentNodeIndex: null,
        previouslyInsertedContentNodeOffset: null,
        structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
      };
      fixInsert(page.content, 4);
      expect(page).toStrictEqual(expectedPage);
    });
  });

  describe("red uncle cases", (): void => {
    test("Right red uncle", (): void => {
      const page: PageContent = {
        buffers: [],
        content: {
          nodes: [
            SENTINEL_CONTENT,
            {
              // g
              bufferIndex: 0,
              color: Color.Black,
              end: {
                column: 0,
                line: 0,
              },
              left: 2,
              leftCharCount: 20,
              leftLineFeedCount: 4,
              length: 10,
              lineFeedCount: 2,
              parent: SENTINEL_INDEX,
              right: 3,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // p
              bufferIndex: 1,
              color: Color.Red,
              end: {
                column: 0,
                line: 0,
              },
              left: 4,
              leftCharCount: 10,
              leftLineFeedCount: 2,
              length: 10,
              lineFeedCount: 2,
              parent: 1,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // u
              bufferIndex: 2,
              color: Color.Red,
              end: {
                column: 0,
                line: 0,
              },
              left: SENTINEL_INDEX,
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              parent: 1,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // x
              bufferIndex: 3,
              color: Color.Red,
              end: {
                column: 0,
                line: 0,
              },
              left: SENTINEL_INDEX,
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              parent: 2,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
          ],
          root: 1,
        },

        previouslyInsertedContentNodeIndex: null,

        previouslyInsertedContentNodeOffset: null,
        structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
      };
      const expectedPage: PageContent = {
        buffers: [],
        content: {
          nodes: [
            SENTINEL_CONTENT,
            {
              // g
              bufferIndex: 0,
              color: Color.Black,
              end: {
                column: 0,
                line: 0,
              },
              left: 2,
              leftCharCount: 20,
              leftLineFeedCount: 4,
              length: 10,
              lineFeedCount: 2,
              parent: SENTINEL_INDEX,
              right: 3,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // p
              bufferIndex: 1,
              color: Color.Black,
              end: {
                column: 0,
                line: 0,
              },
              left: 4,
              leftCharCount: 10,
              leftLineFeedCount: 2,
              length: 10,
              lineFeedCount: 2,
              parent: 1,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // u
              bufferIndex: 2,
              color: Color.Black,
              end: {
                column: 0,
                line: 0,
              },
              left: SENTINEL_INDEX,
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              parent: 1,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // x
              bufferIndex: 3,
              color: Color.Red,
              end: {
                column: 0,
                line: 0,
              },
              left: SENTINEL_INDEX,
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              parent: 2,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
          ],
          root: 1,
        },

        previouslyInsertedContentNodeIndex: null,

        previouslyInsertedContentNodeOffset: null,
        structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
      };
      fixInsert(page.content, 4);
      expect(page).toStrictEqual(expectedPage);
    });

    test("Left red uncle", (): void => {
      const page: PageContent = {
        buffers: [],
        content: {
          nodes: [
            SENTINEL_CONTENT,
            {
              // g
              bufferIndex: 0,
              color: Color.Black,
              end: {
                column: 0,
                line: 0,
              },
              left: 2,
              leftCharCount: 10,
              leftLineFeedCount: 2,
              length: 10,
              lineFeedCount: 2,
              parent: SENTINEL_INDEX,
              right: 3,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // u
              bufferIndex: 1,
              color: Color.Red,
              end: {
                column: 0,
                line: 0,
              },
              left: SENTINEL_INDEX,
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              parent: 1,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // p
              bufferIndex: 2,
              color: Color.Red,
              end: {
                column: 0,
                line: 0,
              },
              left: SENTINEL_INDEX,
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              parent: 1,
              right: 4,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // x
              bufferIndex: 3,
              color: Color.Red,
              end: {
                column: 0,
                line: 0,
              },
              left: SENTINEL_INDEX,
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              parent: 3,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
          ],
          root: 1,
        },

        previouslyInsertedContentNodeIndex: null,

        previouslyInsertedContentNodeOffset: null,
        structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
      };
      const expectedPage: PageContent = {
        buffers: [],
        content: {
          nodes: [
            SENTINEL_CONTENT,
            {
              // g
              bufferIndex: 0,
              color: Color.Black,
              end: {
                column: 0,
                line: 0,
              },
              left: 2,
              leftCharCount: 10,
              leftLineFeedCount: 2,
              length: 10,
              lineFeedCount: 2,
              parent: SENTINEL_INDEX,
              right: 3,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // u
              bufferIndex: 1,
              color: Color.Black,
              end: {
                column: 0,
                line: 0,
              },
              left: SENTINEL_INDEX,
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              parent: 1,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // p
              bufferIndex: 2,
              color: Color.Black,
              end: {
                column: 0,
                line: 0,
              },
              left: SENTINEL_INDEX,
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              parent: 1,
              right: 4,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // x
              bufferIndex: 3,
              color: Color.Red,
              end: {
                column: 0,
                line: 0,
              },
              left: SENTINEL_INDEX,
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              parent: 3,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
          ],
          root: 1,
        },

        previouslyInsertedContentNodeIndex: null,

        previouslyInsertedContentNodeOffset: null,
        structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
      };
      fixInsert(page.content, 4);
      expect(page).toStrictEqual(expectedPage);
    });
  });

  test("Inserted node is root", (): void => {
    const getPage = (): PageContent => ({
      buffers: [
        {
          content: "a",
          isReadOnly: false,
          lineStarts: [0],
        },
      ],
      content: {
        nodes: [
          SENTINEL_CONTENT,
          {
            bufferIndex: 0,
            color: Color.Red,
            end: {
              column: 1,
              line: 0,
            },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 1,
            lineFeedCount: 0,
            parent: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
            start: {
              column: 0,
              line: 0,
            },
          },
        ],
        root: 1,
      },
      previouslyInsertedContentNodeIndex: 1,
      previouslyInsertedContentNodeOffset: 0,
      structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
    });
    const expectedPage = getPage();
    (expectedPage.content.nodes[1] as ContentNode).color = Color.Black;
    const page = getPage();
    fixInsert(page.content, 1);
    expect(page).toStrictEqual(expectedPage);
  });
});
