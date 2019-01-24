import { PageContentMutable, Color } from "../pageModel";
import { SENTINEL_CONTENT } from "../contentTree/tree";
import { SENTINEL_INDEX } from "./tree";
import { NEWLINE } from "../contentTree/contentModel";
import { SENTINEL_STRUCTURE } from "../structureTree/tree";
import { deleteNode } from "../contentTree/delete";

describe("delete node", () => {
  test("Scenario 1: Simple case", () => {
    const page: PageContentMutable = {
      buffers: [],
      content: {
        nodes: [
          SENTINEL_CONTENT,
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
            parent: 2,
            right: SENTINEL_INDEX,
            start: {
              column: 0,
              line: 0,
            },
          },
          {
            // v
            bufferIndex: 2,
            color: Color.Black,
            end: {
              column: 0,
              line: 0,
            },
            left: 1,
            leftCharCount: 10,
            leftLineFeedCount: 2,
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
            bufferIndex: 3,
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
            right: 4,
            start: {
              column: 0,
              line: 0,
            },
          },
          {
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
        root: 3,
      },
      newlineFormat: NEWLINE.LF,
      previouslyInsertedContentNodeIndex: null,
      previouslyInsertedContentNodeOffset: null,
      structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
    };
    const expectedPage: PageContentMutable = {
      buffers: [],
      content: {
        nodes: [
          SENTINEL_CONTENT,
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
            parent: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
            start: {
              column: 0,
              line: 0,
            },
          },
          {
            // v
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
            parent: 3,
            right: SENTINEL_INDEX,
            start: {
              column: 0,
              line: 0,
            },
          },
          {
            bufferIndex: 3,
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
            right: 4,
            start: {
              column: 0,
              line: 0,
            },
          },
          {
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
        root: 3,
      },
      newlineFormat: NEWLINE.LF,
      previouslyInsertedContentNodeIndex: null,
      previouslyInsertedContentNodeOffset: null,
      structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
    };
    deleteNode(page, 1);
    expect(page).toStrictEqual(expectedPage);
  });

  describe("Sibling s is black and at least one of s's children is red", () => {
    test("Scenario 2: Right right case", () => {
      const page: PageContentMutable = {
        buffers: [],
        content: {
          nodes: [
            SENTINEL_CONTENT,
            {
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
              parent: 2,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              bufferIndex: 2,
              color: Color.Black,
              end: {
                column: 0,
                line: 0,
              },
              left: 1,
              leftCharCount: 10,
              leftLineFeedCount: 2,
              length: 10,
              lineFeedCount: 2,
              parent: SENTINEL_INDEX,
              right: 4,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
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
              parent: 4,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              bufferIndex: 4,
              color: Color.Black,
              end: {
                column: 0,
                line: 0,
              },
              left: 3,
              leftCharCount: 10,
              leftLineFeedCount: 2,
              length: 10,
              lineFeedCount: 2,
              parent: 2,
              right: 5,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              bufferIndex: 5,
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
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
          ],
          root: 2,
        },
        newlineFormat: NEWLINE.LF,
        previouslyInsertedContentNodeIndex: null,
        previouslyInsertedContentNodeOffset: null,
        structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
      };
      const expectedPage: PageContentMutable = {
        buffers: [],
        content: {
          nodes: [
            SENTINEL_CONTENT,
            {
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
              parent: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
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
              parent: 4,
              right: 3,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
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
              right: 5,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              bufferIndex: 5,
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
              parent: 4,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
          ],
          root: 4,
        },
        newlineFormat: NEWLINE.LF,
        previouslyInsertedContentNodeIndex: null,
        previouslyInsertedContentNodeOffset: null,
        structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
      };
      deleteNode(page, 1);
      expect(page).toStrictEqual(expectedPage);
    });

    test("Scenario 3: Right left case", () => {
      const page: PageContentMutable = {
        buffers: [],
        content: {
          nodes: [
            SENTINEL_CONTENT,
            {
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
              parent: 2,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },

            {
              bufferIndex: 2,
              color: Color.Black,
              end: {
                column: 0,
                line: 0,
              },
              left: 1,
              leftCharCount: 10,
              leftLineFeedCount: 2,
              length: 10,
              lineFeedCount: 2,
              parent: SENTINEL_INDEX,
              right: 4,
              start: {
                column: 0,
                line: 0,
              },
            },

            {
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
              bufferIndex: 4,
              color: Color.Black,
              end: {
                column: 0,
                line: 0,
              },
              left: 3,
              leftCharCount: 10,
              leftLineFeedCount: 2,
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
          root: 2,
        },
        newlineFormat: NEWLINE.LF,
        previouslyInsertedContentNodeIndex: null,
        previouslyInsertedContentNodeOffset: null,
        structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
      };
      const expectedPage: PageContentMutable = {
        buffers: [],
        content: {
          nodes: [
            SENTINEL_CONTENT,
            {
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
              parent: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
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
              parent: 3,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              bufferIndex: 3,
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
              right: 4,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
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
          root: 3,
        },
        newlineFormat: NEWLINE.LF,
        previouslyInsertedContentNodeIndex: null,
        previouslyInsertedContentNodeOffset: null,
        structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
      };
      deleteNode(page, 1);
      expect(page).toStrictEqual(expectedPage);
    });

    test("Scenario 4: Left left case", () => {
      const page: PageContentMutable = {
        buffers: [],
        content: {
          nodes: [
            SENTINEL_CONTENT,
            {
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
              parent: 2,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              bufferIndex: 2,
              color: Color.Black,
              end: {
                column: 0,
                line: 0,
              },
              left: 1,
              leftCharCount: 10,
              leftLineFeedCount: 2,
              length: 10,
              lineFeedCount: 2,
              parent: 4,
              right: 3,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
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
              bufferIndex: 4,
              color: Color.Black,
              end: {
                column: 0,
                line: 0,
              },
              left: 2,
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
              bufferIndex: 5,
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
              parent: 4,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
          ],
          root: 4,
        },
        newlineFormat: NEWLINE.LF,
        previouslyInsertedContentNodeIndex: null,
        previouslyInsertedContentNodeOffset: null,
        structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
      };
      const expectedPage: PageContentMutable = {
        buffers: [],
        content: {
          nodes: [
            SENTINEL_CONTENT,
            {
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
              parent: 2,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              bufferIndex: 2,
              color: Color.Black,
              end: {
                column: 0,
                line: 0,
              },
              left: 1,
              leftCharCount: 10,
              leftLineFeedCount: 2,
              length: 10,
              lineFeedCount: 2,
              parent: SENTINEL_INDEX,
              right: 4,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
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
              parent: 4,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              bufferIndex: 4,
              color: Color.Black,
              end: {
                column: 0,
                line: 0,
              },
              left: 3,
              leftCharCount: 10,
              leftLineFeedCount: 2,
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
              bufferIndex: 5,
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
              parent: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
          ],
          root: 2,
        },
        newlineFormat: NEWLINE.LF,
        previouslyInsertedContentNodeIndex: null,
        previouslyInsertedContentNodeOffset: null,
        structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
      };
      deleteNode(page, 5);
      expect(page).toStrictEqual(expectedPage);
    });

    test("Scenario 5: Left right case", () => {
      const page: PageContentMutable = {
        buffers: [],
        content: {
          nodes: [
            SENTINEL_CONTENT,
            {
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
              parent: 3,
              right: 2,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
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
              right: 4,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
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
          root: 3,
        },
        newlineFormat: NEWLINE.LF,
        previouslyInsertedContentNodeIndex: null,
        previouslyInsertedContentNodeOffset: null,
        structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
      };
      const expectedPage: PageContentMutable = {
        buffers: [],
        content: {
          nodes: [
            SENTINEL_CONTENT,
            {
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
              parent: 2,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              bufferIndex: 2,
              color: Color.Black,
              end: {
                column: 0,
                line: 0,
              },
              left: 1,
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
              parent: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
          ],
          root: 2,
        },
        newlineFormat: NEWLINE.LF,
        previouslyInsertedContentNodeIndex: null,
        previouslyInsertedContentNodeOffset: null,
        structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
      };
      deleteNode(page, 4);
      expect(page).toStrictEqual(expectedPage);
    });
  });

  test("Scenario 6: Sibling s is black, and both its children are black", () => {
    const page: PageContentMutable = {
      buffers: [],
      content: {
        nodes: [
          SENTINEL_CONTENT,
          {
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
            parent: 2,
            right: SENTINEL_INDEX,
            start: {
              column: 0,
              line: 0,
            },
          },
          {
            bufferIndex: 2,
            color: Color.Black,
            end: {
              column: 0,
              line: 0,
            },
            left: 1,
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
        ],
        root: 2,
      },
      newlineFormat: NEWLINE.LF,
      previouslyInsertedContentNodeIndex: null,
      previouslyInsertedContentNodeOffset: null,
      structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
    };
    const expectedPage: PageContentMutable = {
      buffers: [],
      content: {
        nodes: [
          SENTINEL_CONTENT,
          {
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
            parent: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
            start: {
              column: 0,
              line: 0,
            },
          },
          {
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
            parent: SENTINEL_INDEX,
            right: 3,
            start: {
              column: 0,
              line: 0,
            },
          },
          {
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
        root: 2,
      },
      newlineFormat: NEWLINE.LF,
      previouslyInsertedContentNodeIndex: null,
      previouslyInsertedContentNodeOffset: null,
      structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
    };
    deleteNode(page, 1);
    expect(page).toStrictEqual(expectedPage);
  });

  describe("Sibling s is red", () => {
    test("Scenario 7: sibling s is right child of its parent", () => {
      const page: PageContentMutable = {
        buffers: [],
        content: {
          nodes: [
            SENTINEL_CONTENT,
            {
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
              parent: 2,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              bufferIndex: 2,
              color: Color.Black,
              end: {
                column: 0,
                line: 0,
              },
              left: 1,
              leftCharCount: 10,
              leftLineFeedCount: 2,
              length: 10,
              lineFeedCount: 2,
              parent: SENTINEL_INDEX,
              right: 4,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
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
              parent: 4,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              bufferIndex: 4,
              color: Color.Red,
              end: {
                column: 0,
                line: 0,
              },
              left: 3,
              leftCharCount: 10,
              leftLineFeedCount: 2,
              length: 10,
              lineFeedCount: 2,
              parent: 2,
              right: 5,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              bufferIndex: 5,
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
              parent: 4,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
          ],
          root: 2,
        },
        newlineFormat: NEWLINE.LF,
        previouslyInsertedContentNodeIndex: null,
        previouslyInsertedContentNodeOffset: null,
        structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
      };
      const expectedPage: PageContentMutable = {
        buffers: [],
        content: {
          nodes: [
            SENTINEL_CONTENT,
            {
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
              parent: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
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
              parent: 4,
              right: 3,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
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
              right: 5,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              bufferIndex: 5,
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
              parent: 4,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
          ],
          root: 4,
        },
        newlineFormat: NEWLINE.LF,
        previouslyInsertedContentNodeIndex: null,
        previouslyInsertedContentNodeOffset: null,
        structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
      };
      deleteNode(page, 1);
      expect(page).toStrictEqual(expectedPage);
    });

    test("Scenario 8: sibling s is left child of its parent", () => {
      const page: PageContentMutable = {
        buffers: [],
        content: {
          nodes: [
            SENTINEL_CONTENT,
            {
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
              parent: 2,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              bufferIndex: 2,
              color: Color.Red,
              end: {
                column: 0,
                line: 0,
              },
              left: 1,
              leftCharCount: 10,
              leftLineFeedCount: 2,
              length: 10,
              lineFeedCount: 2,
              parent: 4,
              right: 3,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
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
              bufferIndex: 4,
              color: Color.Black,
              end: {
                column: 0,
                line: 0,
              },
              left: 2,
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
              bufferIndex: 5,
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
              parent: 4,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
          ],
          root: 4,
        },
        newlineFormat: NEWLINE.LF,
        previouslyInsertedContentNodeIndex: null,
        previouslyInsertedContentNodeOffset: null,
        structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
      };
      const expectedPage: PageContentMutable = {
        buffers: [],
        content: {
          nodes: [
            SENTINEL_CONTENT,
            {
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
              parent: 2,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              bufferIndex: 2,
              color: Color.Black,
              end: {
                column: 0,
                line: 0,
              },
              left: 1,
              leftCharCount: 10,
              leftLineFeedCount: 2,
              length: 10,
              lineFeedCount: 2,
              parent: SENTINEL_INDEX,
              right: 4,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
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
              parent: 4,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              bufferIndex: 4,
              color: Color.Black,
              end: {
                column: 0,
                line: 0,
              },
              left: 3,
              leftCharCount: 10,
              leftLineFeedCount: 2,
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
              bufferIndex: 5,
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
              parent: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
          ],
          root: 2,
        },
        newlineFormat: NEWLINE.LF,
        previouslyInsertedContentNodeIndex: null,
        previouslyInsertedContentNodeOffset: null,
        structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
      };
      deleteNode(page, 5);
      expect(page).toStrictEqual(expectedPage);
    });
  });

  test("Scenario 9: delete root", () => {
    const page: PageContentMutable = {
      buffers: [],
      content: {
        nodes: [
          SENTINEL_CONTENT,
          {
            bufferIndex: 1,
            color: Color.Black,
            end: {
              column: 0,
              line: 0,
            },
            left: SENTINEL_INDEX,
            leftCharCount: 30,
            leftLineFeedCount: 6,
            length: 10,
            lineFeedCount: 2,
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
      newlineFormat: NEWLINE.LF,
      previouslyInsertedContentNodeIndex: null,
      previouslyInsertedContentNodeOffset: null,
      structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
    };
    const expectedPage: PageContentMutable = {
      buffers: [],
      content: {
        nodes: [
          SENTINEL_CONTENT,
          {
            bufferIndex: 1,
            color: Color.Black,
            end: {
              column: 0,
              line: 0,
            },
            left: SENTINEL_INDEX,
            leftCharCount: 30,
            leftLineFeedCount: 6,
            length: 10,
            lineFeedCount: 2,
            parent: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
            start: {
              column: 0,
              line: 0,
            },
          },
        ],
        root: SENTINEL_INDEX,
      },
      newlineFormat: NEWLINE.LF,
      previouslyInsertedContentNodeIndex: null,
      previouslyInsertedContentNodeOffset: null,
      structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
    };
    deleteNode(page, 1);
    expect(page).toStrictEqual(expectedPage);
  });
});
