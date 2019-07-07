/* eslint-disable max-len */
import { PageContent, Color } from "../pageModel";
import { TagType } from "../structureTree/structureModel";
import { SENTINEL_CONTENT } from "../contentTree/tree";
import { SENTINEL_INDEX } from "./tree";
import { SENTINEL_STRUCTURE } from "../structureTree/tree";
import { deleteNode } from "../tree/delete";

describe("delete node", (): void => {
  describe("Content nodes", (): void => {
    test("Content: Scenario 1: Simple case", (): void => {
      const page: PageContent = {
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
        
        previouslyInsertedContentNodeIndex: null,
        previouslyInsertedContentNodeOffset: null,
        structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
      };
      deleteNode(page.content, 1);
      expect(page).toStrictEqual(expectedPage);
    });

    describe("Sibling s is black and at least one of s's children is red", (): void => {
      test("Content: Scenario 2: Right right case", (): void => {
        const page: PageContent = {
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
          
          previouslyInsertedContentNodeIndex: null,
          previouslyInsertedContentNodeOffset: null,
          structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
        };
        deleteNode(page.content, 1);
        expect(page).toStrictEqual(expectedPage);
      });

      test("Content: Scenario 3: Right left case", (): void => {
        const page: PageContent = {
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
          
          previouslyInsertedContentNodeIndex: null,
          previouslyInsertedContentNodeOffset: null,
          structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
        };
        deleteNode(page.content, 1);
        expect(page).toStrictEqual(expectedPage);
      });

      test("Content: Scenario 4: Left left case", (): void => {
        const page: PageContent = {
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
          
          previouslyInsertedContentNodeIndex: null,
          previouslyInsertedContentNodeOffset: null,
          structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
        };
        deleteNode(page.content, 5);
        expect(page).toStrictEqual(expectedPage);
      });

      test("Content: Scenario 5: Left right case", (): void => {
        const page: PageContent = {
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
          
          previouslyInsertedContentNodeIndex: null,
          previouslyInsertedContentNodeOffset: null,
          structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
        };
        deleteNode(page.content, 4);
        expect(page).toStrictEqual(expectedPage);
      });
    });

    test("Content: Scenario 6: Sibling s is black, and both its children are black", (): void => {
      const page: PageContent = {
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
        
        previouslyInsertedContentNodeIndex: null,
        previouslyInsertedContentNodeOffset: null,
        structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
      };
      deleteNode(page.content, 1);
      expect(page).toStrictEqual(expectedPage);
    });

    describe("Sibling s is red", (): void => {
      test("Content: Scenario 7: sibling s is right child of its parent", (): void => {
        const page: PageContent = {
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
          
          previouslyInsertedContentNodeIndex: null,
          previouslyInsertedContentNodeOffset: null,
          structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
        };
        deleteNode(page.content, 1);
        expect(page).toStrictEqual(expectedPage);
      });

      test("Content: Scenario 8: sibling s is left child of its parent", (): void => {
        const page: PageContent = {
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
          
          previouslyInsertedContentNodeIndex: null,
          previouslyInsertedContentNodeOffset: null,
          structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
        };
        deleteNode(page.content, 5);
        expect(page).toStrictEqual(expectedPage);
      });
    });

    test("Content: Scenario 9: delete root", (): void => {
      const page: PageContent = {
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
        
        previouslyInsertedContentNodeIndex: null,
        previouslyInsertedContentNodeOffset: null,
        structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
      };
      deleteNode(page.content, 1);
      expect(page).toStrictEqual(expectedPage);
    });
  });

  describe("Structure nodes", (): void => {
    test("Structure: Scenario 1: Simple case", (): void => {
      const page: PageContent = {
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
              // u
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
            {
              // v
              // 2
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
            {
              // 3
              color: Color.Black,
              id: "helloWorld",
              left: 2,
              leftSubTreeLength: 1,
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
      };
      deleteNode(page.structure, 1);
      expect(page).toStrictEqual(expectedPage);
    });

    describe("Sibling s is black and at least one of s's children is red", (): void => {
      test("Structure: Scenario 2: Right right case", (): void => {
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
                parent: 2,
                right: SENTINEL_INDEX,
                tag: "id",
                tagType: TagType.StartEndTag,
              },
              {
                // 2
                color: Color.Black,
                id: "helloWorld",
                left: 1,
                leftSubTreeLength: 1,
                length: 0,
                parent: SENTINEL_INDEX,
                right: 4,
                tag: "id",
                tagType: TagType.StartEndTag,
              },
              {
                // 3
                color: Color.Red,
                id: "helloWorld",
                left: SENTINEL_INDEX,
                leftSubTreeLength: 0,
                length: 0,
                parent: 4,
                right: SENTINEL_INDEX,
                tag: "id",
                tagType: TagType.StartEndTag,
              },
              {
                // 4
                color: Color.Black,
                id: "helloWorld",
                left: 3,
                leftSubTreeLength: 1,
                length: 0,
                parent: 2,
                right: 5,
                tag: "id",
                tagType: TagType.StartEndTag,
              },
              {
                // 5
                color: Color.Red,
                id: "helloWorld",
                left: SENTINEL_INDEX,
                leftSubTreeLength: 0,
                length: 0,
                parent: 4,
                right: SENTINEL_INDEX,
                tag: "id",
                tagType: TagType.StartEndTag,
              },
            ],
            root: 2,
          },
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
              {
                // 2
                color: Color.Black,
                id: "helloWorld",
                left: SENTINEL_INDEX,
                leftSubTreeLength: 0,
                length: 0,
                parent: 4,
                right: 3,
                tag: "id",
                tagType: TagType.StartEndTag,
              },
              {
                // 3
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
                // 4
                color: Color.Black,
                id: "helloWorld",
                left: 2,
                leftSubTreeLength: 2,
                length: 0,
                parent: SENTINEL_INDEX,
                right: 5,
                tag: "id",
                tagType: TagType.StartEndTag,
              },
              {
                // 5
                color: Color.Black,
                id: "helloWorld",
                left: SENTINEL_INDEX,
                leftSubTreeLength: 0,
                length: 0,
                parent: 4,
                right: SENTINEL_INDEX,
                tag: "id",
                tagType: TagType.StartEndTag,
              },
            ],
            root: 4,
          },
        };
        deleteNode(page.structure, 1);
        expect(page).toStrictEqual(expectedPage);
      });

      test("Structure: Scenario 3: Right left case", (): void => {
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
                parent: 2,
                right: SENTINEL_INDEX,
                tag: "id",
                tagType: TagType.StartEndTag,
              },

              {
                // 2
                color: Color.Black,
                id: "helloWorld",
                left: 1,
                leftSubTreeLength: 1,
                length: 0,
                parent: SENTINEL_INDEX,
                right: 4,
                tag: "id",
                tagType: TagType.StartEndTag,
              },

              {
                // 3
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
                // 4
                color: Color.Black,
                id: "helloWorld",
                left: 3,
                leftSubTreeLength: 1,
                length: 0,
                parent: 2,
                right: SENTINEL_INDEX,
                tag: "id",
                tagType: TagType.StartEndTag,
              },
            ],
            root: 2,
          },
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
              {
                // 2
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
              {
                // 3
                color: Color.Black,
                id: "helloWorld",
                left: 2,
                leftSubTreeLength: 1,
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
        };
        deleteNode(page.structure, 1);
        expect(page).toStrictEqual(expectedPage);
      });

      test("Structure: Scenario 4: Left left case", (): void => {
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
                // 2
                color: Color.Black,
                id: "helloWorld",
                left: 1,
                leftSubTreeLength: 1,
                length: 0,
                parent: 4,
                right: 3,
                tag: "id",
                tagType: TagType.StartEndTag,
              },
              {
                // 3
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
                // 4
                color: Color.Black,
                id: "helloWorld",
                left: 2,
                leftSubTreeLength: 3,
                length: 0,
                parent: SENTINEL_INDEX,
                right: 5,
                tag: "id",
                tagType: TagType.StartEndTag,
              },
              {
                // 5
                color: Color.Black,
                id: "helloWorld",
                left: SENTINEL_INDEX,
                leftSubTreeLength: 0,
                length: 0,
                parent: 4,
                right: SENTINEL_INDEX,
                tag: "id",
                tagType: TagType.StartEndTag,
              },
            ],
            root: 4,
          },
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
                parent: 2,
                right: SENTINEL_INDEX,
                tag: "id",
                tagType: TagType.StartEndTag,
              },
              {
                // 2
                color: Color.Black,
                id: "helloWorld",
                left: 1,
                leftSubTreeLength: 1,
                length: 0,
                parent: SENTINEL_INDEX,
                right: 4,
                tag: "id",
                tagType: TagType.StartEndTag,
              },
              {
                // 3
                color: Color.Red,
                id: "helloWorld",
                left: SENTINEL_INDEX,
                leftSubTreeLength: 0,
                length: 0,
                parent: 4,
                right: SENTINEL_INDEX,
                tag: "id",
                tagType: TagType.StartEndTag,
              },
              {
                // 4
                color: Color.Black,
                id: "helloWorld",
                left: 3,
                leftSubTreeLength: 1,
                length: 0,
                parent: 2,
                right: SENTINEL_INDEX,
                tag: "id",
                tagType: TagType.StartEndTag,
              },
              {
                // 5
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
            root: 2,
          },
        };
        deleteNode(page.structure, 5);
        expect(page).toStrictEqual(expectedPage);
      });

      test("Structure: Scenario 5: Left right case", (): void => {
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
                parent: 3,
                right: 2,
                tag: "id",
                tagType: TagType.StartEndTag,
              },
              {
                // 2
                color: Color.Red,
                id: "helloWorld",
                left: SENTINEL_INDEX,
                leftSubTreeLength: 0,
                length: 0,
                parent: 1,
                right: SENTINEL_INDEX,
                tag: "id",
                tagType: TagType.StartEndTag,
              },
              {
                // 3
                color: Color.Black,
                id: "helloWorld",
                left: 1,
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
                parent: 2,
                right: SENTINEL_INDEX,
                tag: "id",
                tagType: TagType.StartEndTag,
              },
              {
                // 2
                color: Color.Black,
                id: "helloWorld",
                left: 1,
                leftSubTreeLength: 1,
                length: 0,
                parent: SENTINEL_INDEX,
                right: 3,
                tag: "id",
                tagType: TagType.StartEndTag,
              },
              {
                // 3
                color: Color.Black,
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
                // 4
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
            root: 2,
          },
        };
        deleteNode(page.structure, 4);
        expect(page).toStrictEqual(expectedPage);
      });
    });

    test("Structure: Scenario 6: Sibling s is black, and both its children are black", (): void => {
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
              parent: 2,
              right: SENTINEL_INDEX,
              tag: "id",
              tagType: TagType.StartEndTag,
            },
            {
              // 2
              color: Color.Black,
              id: "helloWorld",
              left: 1,
              leftSubTreeLength: 1,
              length: 0,
              parent: SENTINEL_INDEX,
              right: 3,
              tag: "id",
              tagType: TagType.StartEndTag,
            },
            {
              // 3
              color: Color.Black,
              id: "helloWorld",
              left: SENTINEL_INDEX,
              leftSubTreeLength: 0,
              length: 0,
              parent: 2,
              right: SENTINEL_INDEX,
              tag: "id",
              tagType: TagType.StartEndTag,
            },
          ],
          root: 2,
        },
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
            {
              // 2
              color: Color.Black,
              id: "helloWorld",
              left: SENTINEL_INDEX,
              leftSubTreeLength: 0,
              length: 0,
              parent: SENTINEL_INDEX,
              right: 3,
              tag: "id",
              tagType: TagType.StartEndTag,
            },
            {
              // 3
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
          ],
          root: 2,
        },
      };
      deleteNode(page.structure, 1);
      expect(page).toStrictEqual(expectedPage);
    });

    describe("Sibling s is red", (): void => {
      test("Structure: Scenario 7: sibling s is right child of its parent", (): void => {
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
                parent: 2,
                right: SENTINEL_INDEX,
                tag: "id",
                tagType: TagType.StartEndTag,
              },
              {
                // 2
                color: Color.Black,
                id: "helloWorld",
                left: 1,
                leftSubTreeLength: 1,
                length: 0,
                parent: SENTINEL_INDEX,
                right: 4,
                tag: "id",
                tagType: TagType.StartEndTag,
              },
              {
                // 3
                color: Color.Black,
                id: "helloWorld",
                left: SENTINEL_INDEX,
                leftSubTreeLength: 0,
                length: 0,
                parent: 4,
                right: SENTINEL_INDEX,
                tag: "id",
                tagType: TagType.StartEndTag,
              },
              {
                // 4
                color: Color.Red,
                id: "helloWorld",
                left: 3,
                leftSubTreeLength: 1,
                length: 0,
                parent: 2,
                right: 5,
                tag: "id",
                tagType: TagType.StartEndTag,
              },
              {
                // 5
                color: Color.Black,
                id: "helloWorld",
                left: SENTINEL_INDEX,
                leftSubTreeLength: 0,
                length: 0,
                parent: 4,
                right: SENTINEL_INDEX,
                tag: "id",
                tagType: TagType.StartEndTag,
              },
            ],
            root: 2,
          },
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
              {
                // 2
                color: Color.Black,
                id: "helloWorld",
                left: SENTINEL_INDEX,
                leftSubTreeLength: 0,
                length: 0,
                parent: 4,
                right: 3,
                tag: "id",
                tagType: TagType.StartEndTag,
              },
              {
                // 3
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
                // 4
                color: Color.Black,
                id: "helloWorld",
                left: 2,
                leftSubTreeLength: 2,
                length: 0,
                parent: SENTINEL_INDEX,
                right: 5,
                tag: "id",
                tagType: TagType.StartEndTag,
              },
              {
                // 5
                color: Color.Black,
                id: "helloWorld",
                left: SENTINEL_INDEX,
                leftSubTreeLength: 0,
                length: 0,
                parent: 4,
                right: SENTINEL_INDEX,
                tag: "id",
                tagType: TagType.StartEndTag,
              },
            ],
            root: 4,
          },
        };
        deleteNode(page.structure, 1);
        expect(page).toStrictEqual(expectedPage);
      });

      test("Structure: Scenario 8: sibling s is left child of its parent", (): void => {
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
                parent: 2,
                right: SENTINEL_INDEX,
                tag: "id",
                tagType: TagType.StartEndTag,
              },
              {
                // 2
                color: Color.Red,
                id: "helloWorld",
                left: 1,
                leftSubTreeLength: 1,
                length: 0,
                parent: 4,
                right: 3,
                tag: "id",
                tagType: TagType.StartEndTag,
              },
              {
                // 3
                color: Color.Black,
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
                // 4
                color: Color.Black,
                id: "helloWorld",
                left: 2,
                leftSubTreeLength: 3,
                length: 0,
                parent: SENTINEL_INDEX,
                right: 5,
                tag: "id",
                tagType: TagType.StartEndTag,
              },
              {
                // 5
                color: Color.Black,
                id: "helloWorld",
                left: SENTINEL_INDEX,
                leftSubTreeLength: 0,
                length: 0,
                parent: 4,
                right: SENTINEL_INDEX,
                tag: "id",
                tagType: TagType.StartEndTag,
              },
            ],
            root: 4,
          },
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
                parent: 2,
                right: SENTINEL_INDEX,
                tag: "id",
                tagType: TagType.StartEndTag,
              },
              {
                // 2
                color: Color.Black,
                id: "helloWorld",
                left: 1,
                leftSubTreeLength: 1,
                length: 0,
                parent: SENTINEL_INDEX,
                right: 4,
                tag: "id",
                tagType: TagType.StartEndTag,
              },
              {
                // 3
                color: Color.Red,
                id: "helloWorld",
                left: SENTINEL_INDEX,
                leftSubTreeLength: 0,
                length: 0,
                parent: 4,
                right: SENTINEL_INDEX,
                tag: "id",
                tagType: TagType.StartEndTag,
              },
              {
                // 4
                color: Color.Black,
                id: "helloWorld",
                left: 3,
                leftSubTreeLength: 1,
                length: 0,
                parent: 2,
                right: SENTINEL_INDEX,
                tag: "id",
                tagType: TagType.StartEndTag,
              },
              {
                // 5
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
            root: 2,
          },
        };
        deleteNode(page.structure, 5);
        expect(page).toStrictEqual(expectedPage);
      });
    });

    test("Structure: Scenario 9: delete root", (): void => {
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
      deleteNode(page.structure, 1);
      expect(page).toStrictEqual(expectedPage);
    });
  });
});
