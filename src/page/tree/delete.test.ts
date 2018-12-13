import { Color, NEWLINE, PageContent } from "../model";
import { deleteContent, deleteNode } from "./delete";
import { SENTINEL, SENTINEL_INDEX } from "./tree";

describe("page/tree/delete", () => {
  describe("delete node", () => {
    test("Scenario 1: Simple case", () => {
      const page: PageContent = {
        buffers: [],
        previouslyInsertedNodeIndex: null,
        previouslyInsertedNodeOffset: null,
        newlineFormat: NEWLINE.LF,
        root: 3,
        nodes: [
          SENTINEL,
          {
            // u
            bufferIndex: 1,
            start: {
              line: 0,
              column: 0,
            },
            end: {
              line: 0,
              column: 0,
            },
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 10,
            lineFeedCount: 2,
            color: Color.Red,
            parent: 2,
            left: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
          },
          {
            // v
            bufferIndex: 2,
            start: {
              line: 0,
              column: 0,
            },
            end: {
              line: 0,
              column: 0,
            },
            leftCharCount: 10,
            leftLineFeedCount: 2,
            length: 10,
            lineFeedCount: 2,
            color: Color.Black,
            parent: 3,
            left: 1,
            right: SENTINEL_INDEX,
          },
          {
            bufferIndex: 3,
            start: {
              line: 0,
              column: 0,
            },
            end: {
              line: 0,
              column: 0,
            },
            leftCharCount: 20,
            leftLineFeedCount: 4,
            length: 10,
            lineFeedCount: 2,
            color: Color.Black,
            parent: SENTINEL_INDEX,
            left: 2,
            right: 4,
          },
          {
            bufferIndex: 4,
            start: {
              line: 0,
              column: 0,
            },
            end: {
              line: 0,
              column: 0,
            },
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 10,
            lineFeedCount: 2,
            color: Color.Black,
            parent: 3,
            left: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
          },
        ],
      };
      const expectedPage: PageContent = {
        buffers: [],
        previouslyInsertedNodeIndex: null,
        previouslyInsertedNodeOffset: null,
        newlineFormat: NEWLINE.LF,
        root: 3,
        nodes: [
          SENTINEL,
          {
            // u
            bufferIndex: 1,
            start: {
              line: 0,
              column: 0,
            },
            end: {
              line: 0,
              column: 0,
            },
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 10,
            lineFeedCount: 2,
            color: Color.Black,
            parent: SENTINEL_INDEX,
            left: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
          },
          {
            // v
            bufferIndex: 2,
            start: {
              line: 0,
              column: 0,
            },
            end: {
              line: 0,
              column: 0,
            },
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 10,
            lineFeedCount: 2,
            color: Color.Black,
            parent: 3,
            left: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
          },
          {
            bufferIndex: 3,
            start: {
              line: 0,
              column: 0,
            },
            end: {
              line: 0,
              column: 0,
            },
            leftCharCount: 10,
            leftLineFeedCount: 2,
            length: 10,
            lineFeedCount: 2,
            color: Color.Black,
            parent: SENTINEL_INDEX,
            left: 2,
            right: 4,
          },
          {
            bufferIndex: 4,
            start: {
              line: 0,
              column: 0,
            },
            end: {
              line: 0,
              column: 0,
            },
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 10,
            lineFeedCount: 2,
            color: Color.Black,
            parent: 3,
            left: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
          },
        ],
      };
      const receivedPage = deleteNode(page, 1);
      expect(receivedPage).toEqual(expectedPage);
    });

    describe("Sibling s is black and at least of one of s's children is red", () => {
      test("Scenario 2: Right right case", () => {
        const page: PageContent = {
          buffers: [],
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
          newlineFormat: NEWLINE.LF,
          root: 2,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 1,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: 2,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 2,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 10,
              leftLineFeedCount: 2,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: 1,
              right: 4,
            },
            {
              bufferIndex: 3,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Red,
              parent: 4,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 4,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 10,
              leftLineFeedCount: 2,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: 2,
              left: 3,
              right: 5,
            },
            {
              bufferIndex: 5,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Red,
              parent: 4,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
        };
        const expectedPage: PageContent = {
          buffers: [],
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
          newlineFormat: NEWLINE.LF,
          root: 4,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 1,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 2,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: 4,
              left: SENTINEL_INDEX,
              right: 3,
            },
            {
              bufferIndex: 3,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Red,
              parent: 2,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 4,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 20,
              leftLineFeedCount: 4,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: 2,
              right: 5,
            },
            {
              bufferIndex: 5,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: 4,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
        };
        const receivedPage = deleteNode(page, 1);
        expect(receivedPage).toEqual(expectedPage);
      });

      test("Scenario 3: Right left case", () => {
        const page: PageContent = {
          buffers: [],
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
          newlineFormat: NEWLINE.LF,
          root: 2,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 1,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: 2,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },

            {
              bufferIndex: 2,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 10,
              leftLineFeedCount: 2,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: 1,
              right: 4,
            },

            {
              bufferIndex: 3,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Red,
              parent: 2,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 4,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 10,
              leftLineFeedCount: 2,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: 2,
              left: 3,
              right: SENTINEL_INDEX,
            },
          ],
        };
        const expectedPage: PageContent = {
          buffers: [],
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
          newlineFormat: NEWLINE.LF,
          root: 3,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 1,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 2,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: 3,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 3,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 10,
              leftLineFeedCount: 2,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: 2,
              right: 4,
            },
            {
              bufferIndex: 4,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: 3,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
        };
        const receivedPage = deleteNode(page, 1);
        expect(receivedPage).toEqual(expectedPage);
      });

      test("Scenario 4: Left left case", () => {
        const page: PageContent = {
          buffers: [],
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
          newlineFormat: NEWLINE.LF,
          root: 4,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 1,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Red,
              parent: 2,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 2,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 10,
              leftLineFeedCount: 2,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: 4,
              left: 1,
              right: 3,
            },
            {
              bufferIndex: 3,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Red,
              parent: 2,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 4,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 30,
              leftLineFeedCount: 6,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: 2,
              right: 5,
            },
            {
              bufferIndex: 5,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: 4,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
        };
        const expectedPage: PageContent = {
          buffers: [],
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
          newlineFormat: NEWLINE.LF,
          root: 2,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 1,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: 2,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 2,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 10,
              leftLineFeedCount: 2,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: 1,
              right: 4,
            },
            {
              bufferIndex: 3,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Red,
              parent: 4,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 4,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 10,
              leftLineFeedCount: 2,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: 2,
              left: 3,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 5,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
        };
        const receivedPage = deleteNode(page, 5);
        expect(receivedPage).toEqual(expectedPage);
      });

      test("Scenario 5: Left right case", () => {
        const page: PageContent = {
          buffers: [],
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
          newlineFormat: NEWLINE.LF,
          root: 3,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 1,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: 3,
              left: SENTINEL_INDEX,
              right: 2,
            },
            {
              bufferIndex: 2,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Red,
              parent: 1,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 3,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 20,
              leftLineFeedCount: 4,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: 1,
              right: 4,
            },
            {
              bufferIndex: 4,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: 3,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
        };
        const expectedPage: PageContent = {
          buffers: [],
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
          newlineFormat: NEWLINE.LF,
          root: 2,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 1,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: 2,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 2,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 10,
              leftLineFeedCount: 2,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: 1,
              right: 3,
            },
            {
              bufferIndex: 3,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: 2,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 4,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
        };
        const receivedPage = deleteNode(page, 4);
        expect(receivedPage).toEqual(expectedPage);
      });
    });

    test("Scenario 6: Sibling s is black, and both its children are black", () => {
      const page: PageContent = {
        buffers: [],
        previouslyInsertedNodeIndex: null,
        previouslyInsertedNodeOffset: null,
        newlineFormat: NEWLINE.LF,
        root: 2,
        nodes: [
          SENTINEL,
          {
            bufferIndex: 1,
            start: {
              line: 0,
              column: 0,
            },
            end: {
              line: 0,
              column: 0,
            },
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 10,
            lineFeedCount: 2,
            color: Color.Black,
            parent: 2,
            left: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
          },
          {
            bufferIndex: 2,
            start: {
              line: 0,
              column: 0,
            },
            end: {
              line: 0,
              column: 0,
            },
            leftCharCount: 10,
            leftLineFeedCount: 2,
            length: 10,
            lineFeedCount: 2,
            color: Color.Black,
            parent: SENTINEL_INDEX,
            left: 1,
            right: 3,
          },
          {
            bufferIndex: 3,
            start: {
              line: 0,
              column: 0,
            },
            end: {
              line: 0,
              column: 0,
            },
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 10,
            lineFeedCount: 2,
            color: Color.Black,
            parent: 2,
            left: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
          },
        ],
      };
      const expectedPage: PageContent = {
        buffers: [],
        previouslyInsertedNodeIndex: null,
        previouslyInsertedNodeOffset: null,
        newlineFormat: NEWLINE.LF,
        root: 2,
        nodes: [
          SENTINEL,
          {
            bufferIndex: 1,
            start: {
              line: 0,
              column: 0,
            },
            end: {
              line: 0,
              column: 0,
            },
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 10,
            lineFeedCount: 2,
            color: Color.Black,
            parent: SENTINEL_INDEX,
            left: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
          },
          {
            bufferIndex: 2,
            start: {
              line: 0,
              column: 0,
            },
            end: {
              line: 0,
              column: 0,
            },
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 10,
            lineFeedCount: 2,
            color: Color.Black,
            parent: SENTINEL_INDEX,
            left: SENTINEL_INDEX,
            right: 3,
          },
          {
            bufferIndex: 3,
            start: {
              line: 0,
              column: 0,
            },
            end: {
              line: 0,
              column: 0,
            },
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 10,
            lineFeedCount: 2,
            color: Color.Red,
            parent: 2,
            left: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
          },
        ],
      };
      const receivedPage = deleteNode(page, 1);
      expect(receivedPage).toEqual(expectedPage);
    });

    describe("Sibling s is red", () => {
      test("Scenario 7: sibling s is right child of its parent", () => {
        const page: PageContent = {
          buffers: [],
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
          newlineFormat: NEWLINE.LF,
          root: 2,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 1,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: 2,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 2,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 10,
              leftLineFeedCount: 2,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: 1,
              right: 4,
            },
            {
              bufferIndex: 3,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: 4,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 4,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 10,
              leftLineFeedCount: 2,
              length: 10,
              lineFeedCount: 2,
              color: Color.Red,
              parent: 2,
              left: 3,
              right: 5,
            },
            {
              bufferIndex: 5,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: 4,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
        };
        const expectedPage: PageContent = {
          buffers: [],
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
          newlineFormat: NEWLINE.LF,
          root: 4,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 1,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 2,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: 4,
              left: SENTINEL_INDEX,
              right: 3,
            },
            {
              bufferIndex: 3,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Red,
              parent: 2,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 4,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 20,
              leftLineFeedCount: 4,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: 2,
              right: 5,
            },
            {
              bufferIndex: 5,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: 4,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
        };
        const receivedPage = deleteNode(page, 1);
        expect(receivedPage).toEqual(expectedPage);
      });

      test("Scenario 8: sibling s is left child of its parent", () => {
        const page: PageContent = {
          buffers: [],
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
          newlineFormat: NEWLINE.LF,
          root: 4,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 1,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: 2,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 2,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 10,
              leftLineFeedCount: 2,
              length: 10,
              lineFeedCount: 2,
              color: Color.Red,
              parent: 4,
              left: 1,
              right: 3,
            },
            {
              bufferIndex: 3,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: 2,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 4,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 30,
              leftLineFeedCount: 6,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: 2,
              right: 5,
            },
            {
              bufferIndex: 5,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: 4,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
        };
        const expectedPage: PageContent = {
          buffers: [],
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
          newlineFormat: NEWLINE.LF,
          root: 2,
          nodes: [
            SENTINEL,
            {
              bufferIndex: 1,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: 2,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 2,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 10,
              leftLineFeedCount: 2,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: 1,
              right: 4,
            },
            {
              bufferIndex: 3,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Red,
              parent: 4,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 4,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 10,
              leftLineFeedCount: 2,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: 2,
              left: 3,
              right: SENTINEL_INDEX,
            },
            {
              bufferIndex: 5,
              start: {
                line: 0,
                column: 0,
              },
              end: {
                line: 0,
                column: 0,
              },
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
        };
        const receivedPage = deleteNode(page, 5);
        expect(receivedPage).toEqual(expectedPage);
      });
    });

    test("Scenario 9: delete root", () => {
      const page: PageContent = {
        buffers: [],
        previouslyInsertedNodeIndex: null,
        previouslyInsertedNodeOffset: null,
        newlineFormat: NEWLINE.LF,
        root: 1,
        nodes: [
          SENTINEL,
          {
            bufferIndex: 1,
            start: {
              line: 0,
              column: 0,
            },
            end: {
              line: 0,
              column: 0,
            },
            leftCharCount: 30,
            leftLineFeedCount: 6,
            length: 10,
            lineFeedCount: 2,
            color: Color.Black,
            parent: SENTINEL_INDEX,
            left: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
          },
        ],
      };
      const expectedPage: PageContent = {
        buffers: [],
        previouslyInsertedNodeIndex: null,
        previouslyInsertedNodeOffset: null,
        newlineFormat: NEWLINE.LF,
        root: SENTINEL_INDEX,
        nodes: [
          SENTINEL,
          {
            bufferIndex: 1,
            start: {
              line: 0,
              column: 0,
            },
            end: {
              line: 0,
              column: 0,
            },
            leftCharCount: 30,
            leftLineFeedCount: 6,
            length: 10,
            lineFeedCount: 2,
            color: Color.Black,
            parent: SENTINEL_INDEX,
            left: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
          },
        ],
      };
      const receivedPage = deleteNode(page, 1);
      expect(receivedPage).toEqual(expectedPage);
    });
  });

  describe("delete content", () => {
    describe("Scenario 1", () => {
      describe("Scenario 1a: delete the content from an entire node", () => {
        test("Scenario 1a: Test 1", () => {
          const page: PageContent = {
            buffers: [
              {
                content: "abc\ndef",
                lineStarts: [0, 4],
                isReadOnly: false,
              },
            ],
            newlineFormat: NEWLINE.LF,
            nodes: [
              SENTINEL,
              {
                bufferIndex: 0,
                start: { line: 0, column: 0 },
                end: { line: 1, column: 1 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: 2,
              },
              {
                bufferIndex: 0,
                start: { line: 1, column: 1 },
                end: { line: 1, column: 3 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                color: Color.Red,
                parent: 1,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
            ],
            root: 1,
            previouslyInsertedNodeIndex: 1,
            previouslyInsertedNodeOffset: 5,
          };
          const expectedPage: PageContent = {
            buffers: [
              {
                content: "abc\ndef",
                lineStarts: [0, 4],
                isReadOnly: false,
              },
            ],
            newlineFormat: NEWLINE.LF,
            nodes: [
              SENTINEL,
              {
                bufferIndex: 0,
                start: { line: 0, column: 0 },
                end: { line: 1, column: 1 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                bufferIndex: 0,
                start: { line: 1, column: 1 },
                end: { line: 1, column: 3 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
            ],
            root: 1,
            previouslyInsertedNodeIndex: null,
            previouslyInsertedNodeOffset: null,
          };
          const receivedPage = deleteContent(page, {
            startOffset: 5,
            endOffset: 7,
          });
          expect(receivedPage).toEqual(expectedPage);
        });

        test("Scenario 1a: Test 2", () => {
          const page: PageContent = {
            buffers: [
              {
                content: "abc\ndef",
                lineStarts: [0, 4],
                isReadOnly: false,
              },
            ],
            newlineFormat: NEWLINE.LF,
            nodes: [
              SENTINEL,
              {
                bufferIndex: 0,
                start: { line: 0, column: 0 },
                end: { line: 1, column: 1 },
                leftCharCount: 2,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: 2,
                right: SENTINEL_INDEX,
              },
              {
                bufferIndex: 0,
                start: { line: 1, column: 1 },
                end: { line: 1, column: 3 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                color: Color.Red,
                parent: 1,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
            ],
            root: 1,
            previouslyInsertedNodeIndex: 1,
            previouslyInsertedNodeOffset: 0,
          };
          const expectedPage: PageContent = {
            buffers: [
              {
                content: "abc\ndef",
                lineStarts: [0, 4],
                isReadOnly: false,
              },
            ],
            newlineFormat: NEWLINE.LF,
            nodes: [
              SENTINEL,
              {
                bufferIndex: 0,
                start: { line: 0, column: 0 },
                end: { line: 1, column: 1 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                bufferIndex: 0,
                start: { line: 1, column: 1 },
                end: { line: 1, column: 3 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
            ],
            root: 1,
            previouslyInsertedNodeIndex: null,
            previouslyInsertedNodeOffset: null,
          };
          const receivedPage = deleteContent(page, {
            startOffset: 0,
            endOffset: 2,
          });
          expect(receivedPage).toEqual(expectedPage);
        });

        test("Scenario 1a: Test 3", () => {
          const page: PageContent = {
            buffers: [
              {
                content: "abc\ndef",
                lineStarts: [0, 4],
                isReadOnly: false,
              },
            ],
            newlineFormat: NEWLINE.LF,
            nodes: [
              SENTINEL,
              {
                bufferIndex: 0,
                start: { line: 0, column: 0 },
                end: { line: 1, column: 1 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: 2,
              },
              {
                bufferIndex: 0,
                start: { line: 1, column: 1 },
                end: { line: 1, column: 3 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                color: Color.Red,
                parent: 1,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
            ],
            root: 1,
            previouslyInsertedNodeIndex: 1,
            previouslyInsertedNodeOffset: 5,
          };
          const expectedPage: PageContent = {
            buffers: [
              {
                content: "abc\ndef",
                lineStarts: [0, 4],
                isReadOnly: false,
              },
            ],
            newlineFormat: NEWLINE.LF,
            nodes: [
              SENTINEL,
              {
                bufferIndex: 0,
                start: { line: 0, column: 0 },
                end: { line: 1, column: 1 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                bufferIndex: 0,
                start: { line: 1, column: 1 },
                end: { line: 1, column: 3 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
            ],
            root: 2,
            previouslyInsertedNodeIndex: null,
            previouslyInsertedNodeOffset: null,
          };
          const receivedPage = deleteContent(page, {
            startOffset: 0,
            endOffset: 5,
          });
          expect(receivedPage).toEqual(expectedPage);
        });

        test("Scenario 1a: Test 4", () => {
          const page: PageContent = {
            buffers: [
              {
                content: "abc\ndef",
                lineStarts: [0, 4],
                isReadOnly: false,
              },
            ],
            newlineFormat: NEWLINE.LF,
            nodes: [
              SENTINEL,
              {
                bufferIndex: 0,
                start: { line: 0, column: 0 },
                end: { line: 1, column: 1 },
                leftCharCount: 2,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: 2,
                right: SENTINEL_INDEX,
              },
              {
                bufferIndex: 0,
                start: { line: 1, column: 1 },
                end: { line: 1, column: 3 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                color: Color.Red,
                parent: 1,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
            ],
            root: 1,
            previouslyInsertedNodeIndex: 1,
            previouslyInsertedNodeOffset: 0,
          };
          const expectedPage: PageContent = {
            buffers: [
              {
                content: "abc\ndef",
                lineStarts: [0, 4],
                isReadOnly: false,
              },
            ],
            newlineFormat: NEWLINE.LF,
            nodes: [
              SENTINEL,
              {
                bufferIndex: 0,
                start: { line: 0, column: 0 },
                end: { line: 1, column: 1 },
                leftCharCount: 2,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                bufferIndex: 0,
                start: { line: 1, column: 1 },
                end: { line: 1, column: 3 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
            ],
            root: 2,
            previouslyInsertedNodeIndex: null,
            previouslyInsertedNodeOffset: null,
          };
          const receivedPage = deleteContent(page, {
            startOffset: 2,
            endOffset: 7,
          });
          expect(receivedPage).toEqual(expectedPage);
        });
      });

      describe("Scenario 1b: delete from the start of a node to a point in the node", () => {
        test("Scenario 1b: Test 1", () => {
          const page: PageContent = {
            buffers: [
              {
                content: "abc\ndef",
                lineStarts: [0, 4],
                isReadOnly: false,
              },
            ],
            newlineFormat: NEWLINE.LF,
            nodes: [
              SENTINEL,
              {
                bufferIndex: 0,
                start: { line: 0, column: 0 },
                end: { line: 1, column: 1 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: 2,
              },
              {
                bufferIndex: 0,
                start: { line: 1, column: 1 },
                end: { line: 1, column: 3 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                color: Color.Red,
                parent: 1,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
            ],
            root: 1,
            previouslyInsertedNodeIndex: 1,
            previouslyInsertedNodeOffset: 5,
          };
          const expectedPage: PageContent = {
            buffers: [
              {
                content: "abc\ndef",
                lineStarts: [0, 4],
                isReadOnly: false,
              },
            ],
            newlineFormat: NEWLINE.LF,
            nodes: [
              SENTINEL,
              {
                bufferIndex: 0,
                start: { line: 1, column: 0 },
                end: { line: 1, column: 1 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 1,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: 2,
              },
              {
                bufferIndex: 0,
                start: { line: 1, column: 1 },
                end: { line: 1, column: 3 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                color: Color.Red,
                parent: 1,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
            ],
            root: 1,
            previouslyInsertedNodeIndex: null,
            previouslyInsertedNodeOffset: null,
          };
          const receivedPage = deleteContent(page, {
            startOffset: 0,
            endOffset: 4,
          });
          expect(receivedPage).toEqual(expectedPage);
        });

        test("Scenario 1b: Test 2", () => {
          const page: PageContent = {
            buffers: [
              {
                content: "abc\ndef",
                lineStarts: [0, 4],
                isReadOnly: false,
              },
            ],
            newlineFormat: NEWLINE.LF,
            nodes: [
              SENTINEL,
              {
                bufferIndex: 0,
                start: { line: 0, column: 0 },
                end: { line: 1, column: 1 },
                leftCharCount: 2,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: 2,
                right: SENTINEL_INDEX,
              },
              {
                bufferIndex: 0,
                start: { line: 1, column: 1 },
                end: { line: 1, column: 3 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                color: Color.Red,
                parent: 1,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
            ],
            root: 1,
            previouslyInsertedNodeIndex: 1,
            previouslyInsertedNodeOffset: 0,
          };
          const expectedPage: PageContent = {
            buffers: [
              {
                content: "abc\ndef",
                lineStarts: [0, 4],
                isReadOnly: false,
              },
            ],
            newlineFormat: NEWLINE.LF,
            nodes: [
              SENTINEL,
              {
                bufferIndex: 0,
                start: { line: 1, column: 0 },
                end: { line: 1, column: 1 },
                leftCharCount: 2,
                leftLineFeedCount: 0,
                length: 1,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: 2,
                right: SENTINEL_INDEX,
              },
              {
                bufferIndex: 0,
                start: { line: 1, column: 1 },
                end: { line: 1, column: 3 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                color: Color.Red,
                parent: 1,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
            ],
            root: 1,
            previouslyInsertedNodeIndex: null,
            previouslyInsertedNodeOffset: null,
          };
          const receivedPage = deleteContent(page, {
            startOffset: 2,
            endOffset: 6,
          });
          expect(receivedPage).toEqual(expectedPage);
        });

        test("Scenario 1b: Test 3", () => {
          const page: PageContent = {
            buffers: [
              {
                content: "abc\ndef",
                lineStarts: [0, 4],
                isReadOnly: false,
              },
            ],
            newlineFormat: NEWLINE.LF,
            nodes: [
              SENTINEL,
              {
                bufferIndex: 0,
                start: { line: 0, column: 0 },
                end: { line: 1, column: 1 },
                leftCharCount: 2,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: 2,
                right: SENTINEL_INDEX,
              },
              {
                bufferIndex: 0,
                start: { line: 1, column: 1 },
                end: { line: 1, column: 3 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                color: Color.Red,
                parent: 1,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
            ],
            root: 1,
            previouslyInsertedNodeIndex: 1,
            previouslyInsertedNodeOffset: 0,
          };
          const expectedPage: PageContent = {
            buffers: [
              {
                content: "abc\ndef",
                lineStarts: [0, 4],
                isReadOnly: false,
              },
            ],
            newlineFormat: NEWLINE.LF,
            nodes: [
              SENTINEL,
              {
                bufferIndex: 0,
                start: { line: 0, column: 3 },
                end: { line: 1, column: 1 },
                leftCharCount: 2,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 1,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: 2,
                right: SENTINEL_INDEX,
              },
              {
                bufferIndex: 0,
                start: { line: 1, column: 1 },
                end: { line: 1, column: 3 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                color: Color.Red,
                parent: 1,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
            ],
            root: 1,
            previouslyInsertedNodeIndex: null,
            previouslyInsertedNodeOffset: null,
          };
          const receivedPage = deleteContent(page, {
            startOffset: 2,
            endOffset: 5,
          });
          expect(receivedPage).toEqual(expectedPage);
        });

        test("Scenario 1b: Test 4", () => {
          const page: PageContent = {
            buffers: [
              {
                content: "abc\ndef",
                lineStarts: [0, 4],
                isReadOnly: false,
              },
            ],
            newlineFormat: NEWLINE.LF,
            nodes: [
              SENTINEL,
              {
                bufferIndex: 0,
                start: { line: 0, column: 0 },
                end: { line: 1, column: 1 },
                leftCharCount: 2,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: 2,
                right: SENTINEL_INDEX,
              },
              {
                bufferIndex: 0,
                start: { line: 1, column: 1 },
                end: { line: 1, column: 3 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                color: Color.Red,
                parent: 1,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
            ],
            root: 1,
            previouslyInsertedNodeIndex: 1,
            previouslyInsertedNodeOffset: 0,
          };
          const expectedPage: PageContent = {
            buffers: [
              {
                content: "abc\ndef",
                lineStarts: [0, 4],
                isReadOnly: false,
              },
            ],
            newlineFormat: NEWLINE.LF,
            nodes: [
              SENTINEL,
              {
                bufferIndex: 0,
                start: { line: 0, column: 2 },
                end: { line: 1, column: 1 },
                leftCharCount: 2,
                leftLineFeedCount: 0,
                length: 3,
                lineFeedCount: 1,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: 2,
                right: SENTINEL_INDEX,
              },
              {
                bufferIndex: 0,
                start: { line: 1, column: 1 },
                end: { line: 1, column: 3 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                color: Color.Red,
                parent: 1,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
            ],
            root: 1,
            previouslyInsertedNodeIndex: null,
            previouslyInsertedNodeOffset: null,
          };
          const receivedPage = deleteContent(page, {
            startOffset: 2,
            endOffset: 4,
          });
          expect(receivedPage).toEqual(expectedPage);
        });

        test("Scenario 1b: Test 5", () => {
          const page: PageContent = {
            buffers: [
              {
                content: "abc\ndef",
                lineStarts: [0, 4],
                isReadOnly: false,
              },
            ],
            newlineFormat: NEWLINE.LF,
            nodes: [
              SENTINEL,
              {
                bufferIndex: 0,
                start: { line: 0, column: 0 },
                end: { line: 1, column: 1 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: 2,
              },
              {
                bufferIndex: 0,
                start: { line: 1, column: 1 },
                end: { line: 1, column: 3 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                color: Color.Red,
                parent: 1,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
            ],
            root: 1,
            previouslyInsertedNodeIndex: 1,
            previouslyInsertedNodeOffset: 5,
          };
          const expectedPage: PageContent = {
            buffers: [
              {
                content: "abc\ndef",
                lineStarts: [0, 4],
                isReadOnly: false,
              },
            ],
            newlineFormat: NEWLINE.LF,
            nodes: [
              SENTINEL,
              {
                bufferIndex: 0,
                start: { line: 0, column: 0 },
                end: { line: 1, column: 1 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: 2,
              },
              {
                bufferIndex: 0,
                start: { line: 1, column: 2 },
                end: { line: 1, column: 3 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 1,
                lineFeedCount: 0,
                color: Color.Red,
                parent: 1,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
            ],
            root: 1,
            previouslyInsertedNodeIndex: null,
            previouslyInsertedNodeOffset: null,
          };
          const receivedPage = deleteContent(page, {
            startOffset: 5,
            endOffset: 6,
          });
          expect(receivedPage).toEqual(expectedPage);
        });

        test("Scenario 1b: Test 6", () => {
          const page: PageContent = {
            buffers: [
              {
                content: "abc\ndef",
                lineStarts: [0, 4],
                isReadOnly: false,
              },
            ],
            newlineFormat: NEWLINE.LF,
            nodes: [
              SENTINEL,
              {
                bufferIndex: 0,
                start: { line: 0, column: 0 },
                end: { line: 1, column: 1 },
                leftCharCount: 2,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: 2,
                right: SENTINEL_INDEX,
              },
              {
                bufferIndex: 0,
                start: { line: 1, column: 1 },
                end: { line: 1, column: 3 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                color: Color.Red,
                parent: 1,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
            ],
            root: 1,
            previouslyInsertedNodeIndex: 1,
            previouslyInsertedNodeOffset: 0,
          };
          const expectedPage: PageContent = {
            buffers: [
              {
                content: "abc\ndef",
                lineStarts: [0, 4],
                isReadOnly: false,
              },
            ],
            newlineFormat: NEWLINE.LF,
            nodes: [
              SENTINEL,
              {
                bufferIndex: 0,
                start: { line: 0, column: 0 },
                end: { line: 1, column: 1 },
                leftCharCount: 1,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: 2,
                right: SENTINEL_INDEX,
              },
              {
                bufferIndex: 0,
                start: { line: 1, column: 2 },
                end: { line: 1, column: 3 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 1,
                lineFeedCount: 0,
                color: Color.Red,
                parent: 1,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
            ],
            root: 1,
            previouslyInsertedNodeIndex: null,
            previouslyInsertedNodeOffset: null,
          };
          const receivedPage = deleteContent(page, {
            startOffset: 0,
            endOffset: 1,
          });
          expect(receivedPage).toEqual(expectedPage);
        });
      });

      describe("Scenario 1c: delete from a point in a node to the end of the node", () => {
        test("Scenario 1c: Test 1", () => {
          const page: PageContent = {
            buffers: [
              {
                content: "abc\ndef",
                lineStarts: [0, 4],
                isReadOnly: false,
              },
            ],
            newlineFormat: NEWLINE.LF,
            nodes: [
              SENTINEL,
              {
                bufferIndex: 0,
                start: { line: 0, column: 0 },
                end: { line: 1, column: 1 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: 2,
              },
              {
                bufferIndex: 0,
                start: { line: 1, column: 1 },
                end: { line: 1, column: 3 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                color: Color.Red,
                parent: 1,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
            ],
            root: 1,
            previouslyInsertedNodeIndex: 1,
            previouslyInsertedNodeOffset: 5,
          };
          const expectedPage: PageContent = {
            buffers: [
              {
                content: "abc\ndef",
                lineStarts: [0, 4],
                isReadOnly: false,
              },
            ],
            newlineFormat: NEWLINE.LF,
            nodes: [
              SENTINEL,
              {
                bufferIndex: 0,
                start: { line: 0, column: 0 },
                end: { line: 0, column: 2 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: 2,
              },
              {
                bufferIndex: 0,
                start: { line: 1, column: 1 },
                end: { line: 1, column: 3 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                color: Color.Red,
                parent: 1,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
            ],
            root: 1,
            previouslyInsertedNodeIndex: null,
            previouslyInsertedNodeOffset: null,
          };
          const receivedPage = deleteContent(page, {
            startOffset: 2,
            endOffset: 5,
          });
          expect(receivedPage).toEqual(expectedPage);
        });

        test("Scenario 1c: Test 2", () => {
          const page: PageContent = {
            buffers: [
              {
                content: "abc\ndef",
                lineStarts: [0, 4],
                isReadOnly: false,
              },
            ],
            newlineFormat: NEWLINE.LF,
            nodes: [
              SENTINEL,
              {
                bufferIndex: 0,
                start: { line: 0, column: 0 },
                end: { line: 1, column: 1 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: 2,
              },
              {
                bufferIndex: 0,
                start: { line: 1, column: 1 },
                end: { line: 1, column: 3 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                color: Color.Red,
                parent: 1,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
            ],
            root: 1,
            previouslyInsertedNodeIndex: 1,
            previouslyInsertedNodeOffset: 5,
          };
          const expectedPage: PageContent = {
            buffers: [
              {
                content: "abc\ndef",
                lineStarts: [0, 4],
                isReadOnly: false,
              },
            ],
            newlineFormat: NEWLINE.LF,
            nodes: [
              SENTINEL,
              {
                bufferIndex: 0,
                start: { line: 0, column: 0 },
                end: { line: 0, column: 3 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 3,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: 2,
              },
              {
                bufferIndex: 0,
                start: { line: 1, column: 1 },
                end: { line: 1, column: 3 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                color: Color.Red,
                parent: 1,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
            ],
            root: 1,
            previouslyInsertedNodeIndex: null,
            previouslyInsertedNodeOffset: null,
          };
          const receivedPage = deleteContent(page, {
            startOffset: 3,
            endOffset: 5,
          });
          expect(receivedPage).toEqual(expectedPage);
        });

        test("Scenario 1c: Test 3", () => {
          const page: PageContent = {
            buffers: [
              {
                content: "abc\ndef",
                lineStarts: [0, 4],
                isReadOnly: false,
              },
            ],
            newlineFormat: NEWLINE.LF,
            nodes: [
              SENTINEL,
              {
                bufferIndex: 0,
                start: { line: 0, column: 0 },
                end: { line: 1, column: 1 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: 2,
              },
              {
                bufferIndex: 0,
                start: { line: 1, column: 1 },
                end: { line: 1, column: 3 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                color: Color.Red,
                parent: 1,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
            ],
            root: 1,
            previouslyInsertedNodeIndex: 1,
            previouslyInsertedNodeOffset: 5,
          };
          const expectedPage: PageContent = {
            buffers: [
              {
                content: "abc\ndef",
                lineStarts: [0, 4],
                isReadOnly: false,
              },
            ],
            newlineFormat: NEWLINE.LF,
            nodes: [
              SENTINEL,
              {
                bufferIndex: 0,
                start: { line: 0, column: 0 },
                end: { line: 0, column: 4 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 4,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: 2,
              },
              {
                bufferIndex: 0,
                start: { line: 1, column: 1 },
                end: { line: 1, column: 3 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                color: Color.Red,
                parent: 1,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
            ],
            root: 1,
            previouslyInsertedNodeIndex: null,
            previouslyInsertedNodeOffset: null,
          };
          const receivedPage = deleteContent(page, {
            startOffset: 4,
            endOffset: 5,
          });
          expect(receivedPage).toEqual(expectedPage);
        });

        test("Scenario 1c: Test 4", () => {
          const page: PageContent = {
            buffers: [
              {
                content: "abc\ndzef",
                lineStarts: [0, 4],
                isReadOnly: false,
              },
            ],
            newlineFormat: NEWLINE.LF,
            nodes: [
              SENTINEL,
              {
                bufferIndex: 0,
                start: { line: 0, column: 0 },
                end: { line: 1, column: 2 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 6,
                lineFeedCount: 1,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: 2,
              },
              {
                bufferIndex: 0,
                start: { line: 1, column: 2 },
                end: { line: 1, column: 4 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                color: Color.Red,
                parent: 1,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
            ],
            root: 1,
            previouslyInsertedNodeIndex: 1,
            previouslyInsertedNodeOffset: 5,
          };
          const expectedPage: PageContent = {
            buffers: [
              {
                content: "abc\ndzef",
                lineStarts: [0, 4],
                isReadOnly: false,
              },
            ],
            newlineFormat: NEWLINE.LF,
            nodes: [
              SENTINEL,
              {
                bufferIndex: 0,
                start: { line: 0, column: 0 },
                end: { line: 1, column: 1 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: 2,
              },
              {
                bufferIndex: 0,
                start: { line: 1, column: 2 },
                end: { line: 1, column: 4 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                color: Color.Red,
                parent: 1,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
            ],
            root: 1,
            previouslyInsertedNodeIndex: null,
            previouslyInsertedNodeOffset: null,
          };
          const receivedPage = deleteContent(page, {
            startOffset: 5,
            endOffset: 6,
          });
          expect(receivedPage).toEqual(expectedPage);
        });

        test("Scenario 1c: Test 5", () => {
          const page: PageContent = {
            buffers: [
              {
                content: "abc\ndef",
                lineStarts: [0, 4],
                isReadOnly: false,
              },
            ],
            newlineFormat: NEWLINE.LF,
            nodes: [
              SENTINEL,
              {
                bufferIndex: 0,
                start: { line: 0, column: 0 },
                end: { line: 1, column: 1 },
                leftCharCount: 2,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: 2,
                right: SENTINEL_INDEX,
              },
              {
                bufferIndex: 0,
                start: { line: 1, column: 1 },
                end: { line: 1, column: 3 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                color: Color.Red,
                parent: 1,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
            ],
            root: 1,
            previouslyInsertedNodeIndex: 1,
            previouslyInsertedNodeOffset: 0,
          };
          const expectedPage: PageContent = {
            buffers: [
              {
                content: "abc\ndef",
                lineStarts: [0, 4],
                isReadOnly: false,
              },
            ],
            newlineFormat: NEWLINE.LF,
            nodes: [
              SENTINEL,
              {
                bufferIndex: 0,
                start: { line: 0, column: 0 },
                end: { line: 0, column: 2 },
                leftCharCount: 2,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: 2,
                right: SENTINEL_INDEX,
              },
              {
                bufferIndex: 0,
                start: { line: 1, column: 1 },
                end: { line: 1, column: 3 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                color: Color.Red,
                parent: 1,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
            ],
            root: 1,
            previouslyInsertedNodeIndex: null,
            previouslyInsertedNodeOffset: null,
          };
          const receivedPage = deleteContent(page, {
            startOffset: 4,
            endOffset: 7,
          });
          expect(receivedPage).toEqual(expectedPage);
        });

        test("Scenario 1c: Test 6", () => {
          const page: PageContent = {
            buffers: [
              {
                content: "abc\ndef",
                lineStarts: [0, 4],
                isReadOnly: false,
              },
            ],
            newlineFormat: NEWLINE.LF,
            nodes: [
              SENTINEL,
              {
                bufferIndex: 0,
                start: { line: 0, column: 0 },
                end: { line: 1, column: 1 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: 2,
              },
              {
                bufferIndex: 0,
                start: { line: 1, column: 1 },
                end: { line: 1, column: 3 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                color: Color.Red,
                parent: 1,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
            ],
            root: 1,
            previouslyInsertedNodeIndex: 1,
            previouslyInsertedNodeOffset: 0,
          };
          const expectedPage: PageContent = {
            buffers: [
              {
                content: "abc\ndef",
                lineStarts: [0, 4],
                isReadOnly: false,
              },
            ],
            newlineFormat: NEWLINE.LF,
            nodes: [
              SENTINEL,
              {
                bufferIndex: 0,
                start: { line: 0, column: 0 },
                end: { line: 1, column: 1 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: 2,
              },
              {
                bufferIndex: 0,
                start: { line: 1, column: 1 },
                end: { line: 1, column: 2 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 1,
                lineFeedCount: 0,
                color: Color.Red,
                parent: 1,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
            ],
            root: 1,
            previouslyInsertedNodeIndex: null,
            previouslyInsertedNodeOffset: null,
          };
          const receivedPage = deleteContent(page, {
            startOffset: 6,
            endOffset: 7,
          });
          expect(receivedPage).toEqual(expectedPage);
        });

        test("Scenario 1c: Test 7", () => {
          const page: PageContent = {
            buffers: [
              {
                content: "abc\ndef",
                lineStarts: [0, 4],
                isReadOnly: false,
              },
            ],
            newlineFormat: NEWLINE.LF,
            nodes: [
              SENTINEL,
              {
                bufferIndex: 0,
                start: { line: 0, column: 0 },
                end: { line: 1, column: 1 },
                leftCharCount: 2,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: 2,
                right: SENTINEL_INDEX,
              },
              {
                bufferIndex: 0,
                start: { line: 1, column: 1 },
                end: { line: 1, column: 3 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                color: Color.Red,
                parent: 1,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
            ],
            root: 1,
            previouslyInsertedNodeIndex: 1,
            previouslyInsertedNodeOffset: 0,
          };
          const expectedPage: PageContent = {
            buffers: [
              {
                content: "abc\ndef",
                lineStarts: [0, 4],
                isReadOnly: false,
              },
            ],
            newlineFormat: NEWLINE.LF,
            nodes: [
              SENTINEL,
              {
                bufferIndex: 0,
                start: { line: 0, column: 0 },
                end: { line: 1, column: 1 },
                leftCharCount: 2,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: 2,
                right: SENTINEL_INDEX,
              },
              {
                bufferIndex: 0,
                start: { line: 1, column: 1 },
                end: { line: 1, column: 2 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 1,
                lineFeedCount: 0,
                color: Color.Red,
                parent: 1,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
            ],
            root: 1,
            previouslyInsertedNodeIndex: null,
            previouslyInsertedNodeOffset: null,
          };
          const receivedPage = deleteContent(page, {
            startOffset: 1,
            endOffset: 2,
          });
          expect(receivedPage).toEqual(expectedPage);
        });
      });

      describe("Scenario 1d: delete from a point in a node to another point in the node", () => {
        test("Scenario 1d: Test 1", () => {
          const page: PageContent = {
            buffers: [
              {
                content: "abc\ndef",
                lineStarts: [0, 4],
                isReadOnly: false,
              },
            ],
            newlineFormat: NEWLINE.LF,
            nodes: [
              SENTINEL,
              {
                bufferIndex: 0,
                start: { line: 0, column: 0 },
                end: { line: 1, column: 1 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: 2,
              },
              {
                bufferIndex: 0,
                start: { line: 1, column: 1 },
                end: { line: 1, column: 3 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                color: Color.Red,
                parent: 1,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
            ],
            root: 1,
            previouslyInsertedNodeIndex: 1,
            previouslyInsertedNodeOffset: 5,
          };
          const expectedPage: PageContent = {
            buffers: [
              {
                content: "abc\ndef",
                lineStarts: [0, 4],
                isReadOnly: false,
              },
            ],
            newlineFormat: NEWLINE.LF,
            nodes: [
              SENTINEL,
              {
                bufferIndex: 0,
                start: { line: 0, column: 0 },
                end: { line: 0, column: 2 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                color: Color.Red,
                parent: 3,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                bufferIndex: 0,
                start: { line: 1, column: 1 },
                end: { line: 1, column: 3 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                color: Color.Red,
                parent: 3,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                bufferIndex: 0,
                start: { line: 1, column: 0 },
                end: { line: 1, column: 1 },
                leftCharCount: 2,
                leftLineFeedCount: 0,
                length: 1,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: 1,
                right: 2,
              },
            ],
            root: 3,
            previouslyInsertedNodeIndex: null,
            previouslyInsertedNodeOffset: null,
          };
          const receivedPage = deleteContent(page, {
            startOffset: 2,
            endOffset: 4,
          });
          expect(receivedPage).toEqual(expectedPage);
        });

        test("Scenario 1d: Test 2", () => {
          const page: PageContent = {
            buffers: [
              {
                content: "abc\ndef",
                lineStarts: [0, 4],
                isReadOnly: false,
              },
            ],
            newlineFormat: NEWLINE.LF,
            nodes: [
              SENTINEL,
              {
                bufferIndex: 0,
                start: { line: 0, column: 0 },
                end: { line: 1, column: 1 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: 2,
              },
              {
                bufferIndex: 0,
                start: { line: 1, column: 1 },
                end: { line: 1, column: 3 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                color: Color.Red,
                parent: 1,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
            ],
            root: 1,
            previouslyInsertedNodeIndex: 1,
            previouslyInsertedNodeOffset: 5,
          };
          const expectedPage: PageContent = {
            buffers: [
              {
                content: "abc\ndef",
                lineStarts: [0, 4],
                isReadOnly: false,
              },
            ],
            newlineFormat: NEWLINE.LF,
            nodes: [
              SENTINEL,
              {
                bufferIndex: 0,
                start: { line: 0, column: 0 },
                end: { line: 0, column: 3 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 3,
                lineFeedCount: 0,
                color: Color.Red,
                parent: 3,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                bufferIndex: 0,
                start: { line: 1, column: 1 },
                end: { line: 1, column: 3 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                color: Color.Red,
                parent: 3,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                bufferIndex: 0,
                start: { line: 1, column: 0 },
                end: { line: 1, column: 1 },
                leftCharCount: 3,
                leftLineFeedCount: 0,
                length: 1,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: 1,
                right: 2,
              },
            ],
            root: 3,
            previouslyInsertedNodeIndex: null,
            previouslyInsertedNodeOffset: null,
          };
          const receivedPage = deleteContent(page, {
            startOffset: 3,
            endOffset: 4,
          });
          expect(receivedPage).toEqual(expectedPage);
        });

        test("Scenario 1d: Test 3", () => {
          const page: PageContent = {
            buffers: [
              {
                content: "abc\ndef",
                lineStarts: [0, 4],
                isReadOnly: false,
              },
            ],
            newlineFormat: NEWLINE.LF,
            nodes: [
              SENTINEL,
              {
                bufferIndex: 0,
                start: { line: 0, column: 0 },
                end: { line: 1, column: 1 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: 2,
              },
              {
                bufferIndex: 0,
                start: { line: 1, column: 1 },
                end: { line: 1, column: 3 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                color: Color.Red,
                parent: 1,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
            ],
            root: 1,
            previouslyInsertedNodeIndex: 1,
            previouslyInsertedNodeOffset: 5,
          };
          const expectedPage: PageContent = {
            buffers: [
              {
                content: "abc\ndef",
                lineStarts: [0, 4],
                isReadOnly: false,
              },
            ],
            newlineFormat: NEWLINE.LF,
            nodes: [
              SENTINEL,
              {
                bufferIndex: 0,
                start: { line: 0, column: 0 },
                end: { line: 0, column: 2 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                color: Color.Red,
                parent: 3,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                bufferIndex: 0,
                start: { line: 1, column: 1 },
                end: { line: 1, column: 3 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                color: Color.Red,
                parent: 3,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                bufferIndex: 0,
                start: { line: 0, column: 3 },
                end: { line: 1, column: 1 },
                leftCharCount: 2,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 1,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: 1,
                right: 2,
              },
            ],
            root: 3,
            previouslyInsertedNodeIndex: null,
            previouslyInsertedNodeOffset: null,
          };
          const receivedPage = deleteContent(page, {
            startOffset: 2,
            endOffset: 3,
          });
          expect(receivedPage).toEqual(expectedPage);
        });

        test("Scenario 1d: Test 4", () => {
          const page: PageContent = {
            buffers: [
              {
                content: "abc\ndef",
                lineStarts: [0, 4],
                isReadOnly: false,
              },
            ],
            newlineFormat: NEWLINE.LF,
            nodes: [
              SENTINEL,
              {
                bufferIndex: 0,
                start: { line: 0, column: 0 },
                end: { line: 1, column: 1 },
                leftCharCount: 2,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: 2,
                right: SENTINEL_INDEX,
              },
              {
                bufferIndex: 0,
                start: { line: 1, column: 1 },
                end: { line: 1, column: 3 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                color: Color.Red,
                parent: 1,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
            ],
            root: 1,
            previouslyInsertedNodeIndex: null,
            previouslyInsertedNodeOffset: null,
          };
          const expectedPage: PageContent = {
            buffers: [
              {
                content: "abc\ndef",
                lineStarts: [0, 4],
                isReadOnly: false,
              },
            ],
            newlineFormat: NEWLINE.LF,
            nodes: [
              SENTINEL,
              {
                bufferIndex: 0,
                start: { line: 0, column: 0 },
                end: { line: 0, column: 2 },
                leftCharCount: 2,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: 2,
                right: 3,
              },
              {
                bufferIndex: 0,
                start: { line: 1, column: 1 },
                end: { line: 1, column: 3 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                color: Color.Red,
                parent: 1,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                bufferIndex: 0,
                start: { line: 1, column: 0 },
                end: { line: 1, column: 1 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 1,
                lineFeedCount: 0,
                color: Color.Red,
                parent: 1,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
            ],
            root: 1,
            previouslyInsertedNodeIndex: null,
            previouslyInsertedNodeOffset: null,
          };
          const receivedPage = deleteContent(page, {
            startOffset: 4,
            endOffset: 6,
          });
          expect(receivedPage).toEqual(expectedPage);
        });

        test("Scenario 1d: Test 5", () => {
          const page: PageContent = {
            buffers: [
              {
                content: "abc\ndefgh",
                lineStarts: [0, 4],
                isReadOnly: false,
              },
            ],
            newlineFormat: NEWLINE.LF,
            nodes: [
              SENTINEL,
              {
                bufferIndex: 0,
                start: { line: 0, column: 0 },
                end: { line: 1, column: 1 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: 2,
              },
              {
                bufferIndex: 0,
                start: { line: 1, column: 1 },
                end: { line: 1, column: 5 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 4,
                lineFeedCount: 0,
                color: Color.Red,
                parent: 1,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
            ],
            root: 1,
            previouslyInsertedNodeIndex: null,
            previouslyInsertedNodeOffset: null,
          };
          const expectedPage: PageContent = {
            buffers: [
              {
                content: "abc\ndefgh",
                lineStarts: [0, 4],
                isReadOnly: false,
              },
            ],
            newlineFormat: NEWLINE.LF,
            nodes: [
              SENTINEL,
              {
                bufferIndex: 0,
                start: { line: 0, column: 0 },
                end: { line: 1, column: 1 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                color: Color.Red,
                parent: 2,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                bufferIndex: 0,
                start: { line: 1, column: 1 },
                end: { line: 1, column: 2 },
                leftCharCount: 5,
                leftLineFeedCount: 1,
                length: 1,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: 1,
                right: 3,
              },
              {
                bufferIndex: 0,
                start: { line: 1, column: 4 },
                end: { line: 1, column: 5 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 1,
                lineFeedCount: 0,
                color: Color.Red,
                parent: 2,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
            ],
            root: 2,
            previouslyInsertedNodeIndex: null,
            previouslyInsertedNodeOffset: null,
          };
          const receivedPage = deleteContent(page, {
            startOffset: 6,
            endOffset: 8,
          });
          expect(receivedPage).toEqual(expectedPage);
        });

        test("Scenario 1d: Test 6", () => {
          const page: PageContent = {
            buffers: [
              {
                content: "abc\ndefgh",
                lineStarts: [0, 4],
                isReadOnly: false,
              },
            ],
            newlineFormat: NEWLINE.LF,
            nodes: [
              SENTINEL,
              {
                bufferIndex: 0,
                start: { line: 0, column: 0 },
                end: { line: 1, column: 1 },
                leftCharCount: 4,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: 2,
                right: SENTINEL_INDEX,
              },
              {
                bufferIndex: 0,
                start: { line: 1, column: 1 },
                end: { line: 1, column: 5 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 4,
                lineFeedCount: 0,
                color: Color.Red,
                parent: 1,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
            ],
            root: 1,
            previouslyInsertedNodeIndex: null,
            previouslyInsertedNodeOffset: null,
          };
          const expectedPage: PageContent = {
            buffers: [
              {
                content: "abc\ndefgh",
                lineStarts: [0, 4],
                isReadOnly: false,
              },
            ],
            newlineFormat: NEWLINE.LF,
            nodes: [
              SENTINEL,
              {
                bufferIndex: 0,
                start: { line: 0, column: 0 },
                end: { line: 1, column: 1 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                color: Color.Red,
                parent: 3,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                bufferIndex: 0,
                start: { line: 1, column: 1 },
                end: { line: 1, column: 2 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 1,
                lineFeedCount: 0,
                color: Color.Red,
                parent: 3,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                bufferIndex: 0,
                start: { line: 1, column: 4 },
                end: { line: 1, column: 5 },
                leftCharCount: 1,
                leftLineFeedCount: 0,
                length: 1,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: 2,
                right: 1,
              },
            ],
            root: 3,
            previouslyInsertedNodeIndex: null,
            previouslyInsertedNodeOffset: null,
          };
          const receivedPage = deleteContent(page, {
            startOffset: 1,
            endOffset: 3,
          });
          expect(receivedPage).toEqual(expectedPage);
        });
      });
    });

    describe("Scenario 2", () => {
      const getStartPage = (): PageContent => ({
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

      describe("Scenario 2a: delete from the start of a node to the end of another node", () => {
        test("Scenario 2a: Test 1", () => {
          const page = getStartPage();
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
                parent: 10,
                left: 1,
                right: SENTINEL_INDEX,
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
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 4
                bufferIndex: 1,
                start: { line: 0, column: 1 },
                end: { line: 0, column: 4 },
                leftCharCount: 66,
                leftLineFeedCount: 1,
                length: 3,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
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
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 6
                bufferIndex: 1,
                start: { line: 0, column: 4 },
                end: { line: 0, column: 6 },
                leftCharCount: 66,
                leftLineFeedCount: 1,
                length: 2,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 7
                bufferIndex: 1,
                start: { line: 0, column: 45 },
                end: { line: 0, column: 46 },
                leftCharCount: 66,
                leftLineFeedCount: 1,
                length: 1,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 8
                bufferIndex: 1,
                start: { line: 0, column: 7 },
                end: { line: 0, column: 12 },
                leftCharCount: 66,
                leftLineFeedCount: 1,
                length: 5,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 9
                bufferIndex: 1,
                start: { line: 0, column: 46 },
                end: { line: 0, column: 47 },
                leftCharCount: 66,
                leftLineFeedCount: 1,
                length: 1,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 10
                bufferIndex: 1,
                start: { line: 0, column: 13 },
                end: { line: 0, column: 45 },
                leftCharCount: 66,
                leftLineFeedCount: 1,
                length: 32,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: 2,
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
                right: SENTINEL_INDEX,
              },
            ],
            root: 10,
            previouslyInsertedNodeIndex: null,
            previouslyInsertedNodeOffset: null,
          };
          const receivedPage = deleteContent(page, {
            startOffset: 66,
            endOffset: 94,
          });
          expect(receivedPage).toEqual(expectedPage);
        });

        test("Scenario 2a: Test 2", () => {
          const page = getStartPage();
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
                color: Color.Black,
                parent: 10,
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
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 3
                bufferIndex: 0,
                start: { line: 1, column: 28 },
                end: { line: 1, column: 42 },
                leftCharCount: 65,
                leftLineFeedCount: 1,
                length: 14,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 4
                bufferIndex: 1,
                start: { line: 0, column: 1 },
                end: { line: 0, column: 4 },
                leftCharCount: 65,
                leftLineFeedCount: 1,
                length: 3,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 5
                bufferIndex: 0,
                start: { line: 1, column: 45 },
                end: { line: 1, column: 47 },
                leftCharCount: 65,
                leftLineFeedCount: 1,
                length: 2,
                lineFeedCount: 1,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 6
                bufferIndex: 1,
                start: { line: 0, column: 4 },
                end: { line: 0, column: 6 },
                leftCharCount: 65,
                leftLineFeedCount: 1,
                length: 2,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 7
                bufferIndex: 1,
                start: { line: 0, column: 45 },
                end: { line: 0, column: 46 },
                leftCharCount: 65,
                leftLineFeedCount: 1,
                length: 1,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 8
                bufferIndex: 1,
                start: { line: 0, column: 7 },
                end: { line: 0, column: 12 },
                leftCharCount: 65,
                leftLineFeedCount: 1,
                length: 5,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 9
                bufferIndex: 1,
                start: { line: 0, column: 46 },
                end: { line: 0, column: 47 },
                leftCharCount: 65,
                leftLineFeedCount: 1,
                length: 1,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 10
                bufferIndex: 1,
                start: { line: 0, column: 13 },
                end: { line: 0, column: 45 },
                leftCharCount: 65,
                leftLineFeedCount: 1,
                length: 32,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: 1,
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
                right: SENTINEL_INDEX,
              },
            ],
            root: 10,
            previouslyInsertedNodeIndex: null,
            previouslyInsertedNodeOffset: null,
          };
          const receivedPage = deleteContent(page, {
            startOffset: 65,
            endOffset: 94,
          });
          expect(receivedPage).toEqual(expectedPage);
        });

        test("Scenario 2a: Test 3", () => {
          const page = getStartPage();
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
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 2
                bufferIndex: 1,
                start: { line: 0, column: 0 },
                end: { line: 0, column: 1 },
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
                // 3
                bufferIndex: 0,
                start: { line: 1, column: 28 },
                end: { line: 1, column: 42 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 14,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 4
                bufferIndex: 1,
                start: { line: 0, column: 1 },
                end: { line: 0, column: 4 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 3,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
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
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 6
                bufferIndex: 1,
                start: { line: 0, column: 4 },
                end: { line: 0, column: 6 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
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
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 8
                bufferIndex: 1,
                start: { line: 0, column: 7 },
                end: { line: 0, column: 12 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
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
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 10
                bufferIndex: 1,
                start: { line: 0, column: 13 },
                end: { line: 0, column: 45 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 32,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
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
            root: 10,
            previouslyInsertedNodeIndex: null,
            previouslyInsertedNodeOffset: null,
          };
          const receivedPage = deleteContent(page, {
            startOffset: 0,
            endOffset: 94,
          });
          expect(receivedPage).toEqual(expectedPage);
        });

        test("Scenario 2a: Test 4", () => {
          const page = getStartPage();
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
                color: Color.Black,
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
                color: Color.Red,
                parent: 8,
                left: 1,
                right: 4,
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
                parent: 4,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 4
                bufferIndex: 1,
                start: { line: 0, column: 1 },
                end: { line: 0, column: 4 },
                leftCharCount: 14,
                leftLineFeedCount: 0,
                length: 3,
                lineFeedCount: 0,
                color: Color.Black,
                parent: 2,
                left: 3,
                right: SENTINEL_INDEX,
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
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 6
                bufferIndex: 1,
                start: { line: 0, column: 4 },
                end: { line: 0, column: 6 },
                leftCharCount: 83,
                leftLineFeedCount: 1,
                length: 2,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 7
                bufferIndex: 1,
                start: { line: 0, column: 45 },
                end: { line: 0, column: 46 },
                leftCharCount: 83,
                leftLineFeedCount: 1,
                length: 1,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 8
                bufferIndex: 1,
                start: { line: 0, column: 7 },
                end: { line: 0, column: 12 },
                leftCharCount: 83,
                leftLineFeedCount: 1,
                length: 5,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: 2,
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
                parent: 8,
                left: 9,
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
                right: SENTINEL_INDEX,
              },
            ],
            root: 8,
            previouslyInsertedNodeIndex: null,
            previouslyInsertedNodeOffset: null,
          };
          const receivedPage = deleteContent(page, {
            startOffset: 83,
            endOffset: 88,
          });
          expect(receivedPage).toEqual(expectedPage);
        });

        test("Scenario 2a: Test 5", () => {
          const page = getStartPage();
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
                color: Color.Black,
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
                parent: SENTINEL_INDEX,
                left: 1,
                right: 4,
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
                parent: 4,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 4
                bufferIndex: 1,
                start: { line: 0, column: 1 },
                end: { line: 0, column: 4 },
                leftCharCount: 14,
                leftLineFeedCount: 0,
                length: 3,
                lineFeedCount: 0,
                color: Color.Black,
                parent: 2,
                left: 3,
                right: SENTINEL_INDEX,
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
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 6
                bufferIndex: 1,
                start: { line: 0, column: 4 },
                end: { line: 0, column: 6 },
                leftCharCount: 83,
                leftLineFeedCount: 1,
                length: 2,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 7
                bufferIndex: 1,
                start: { line: 0, column: 45 },
                end: { line: 0, column: 46 },
                leftCharCount: 83,
                leftLineFeedCount: 1,
                length: 1,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 8
                bufferIndex: 1,
                start: { line: 0, column: 7 },
                end: { line: 0, column: 12 },
                leftCharCount: 83,
                leftLineFeedCount: 1,
                length: 5,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 9
                bufferIndex: 1,
                start: { line: 0, column: 46 },
                end: { line: 0, column: 47 },
                leftCharCount: 83,
                leftLineFeedCount: 1,
                length: 1,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 10
                bufferIndex: 1,
                start: { line: 0, column: 13 },
                end: { line: 0, column: 45 },
                leftCharCount: 83,
                leftLineFeedCount: 1,
                length: 32,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
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
            root: 2,
            previouslyInsertedNodeIndex: null,
            previouslyInsertedNodeOffset: null,
          };
          const receivedPage = deleteContent(page, {
            startOffset: 83,
            endOffset: 127,
          });
          expect(receivedPage).toEqual(expectedPage);
        });

        test("Scenario 2a: Test 6", () => {
          const page = getStartPage();
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
                color: Color.Red,
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
                right: SENTINEL_INDEX,
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
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 10
                bufferIndex: 1,
                start: { line: 0, column: 13 },
                end: { line: 0, column: 45 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 32,
                lineFeedCount: 0,
                color: Color.Black,
                left: SENTINEL_INDEX,
                parent: SENTINEL_INDEX,
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
          const receivedPage = deleteContent(page, {
            startOffset: 93,
            endOffset: 127,
          });
          expect(receivedPage).toEqual(expectedPage);
        });

        test("Scenario 2a: Test 7", () => {
          const page = getStartPage();
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
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 2
                bufferIndex: 1,
                start: { line: 0, column: 0 },
                end: { line: 0, column: 1 },
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
                // 3
                bufferIndex: 0,
                start: { line: 1, column: 28 },
                end: { line: 1, column: 42 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 14,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 4
                bufferIndex: 1,
                start: { line: 0, column: 1 },
                end: { line: 0, column: 4 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 3,
                lineFeedCount: 0,
                color: Color.Black,
                parent: 6,
                left: SENTINEL_INDEX,
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
                color: Color.Red,
                parent: 4,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 6
                bufferIndex: 1,
                start: { line: 0, column: 4 },
                end: { line: 0, column: 6 },
                leftCharCount: 5,
                leftLineFeedCount: 1,
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
          };
          const receivedPage = deleteContent(page, {
            startOffset: 0,
            endOffset: 80,
          });
          expect(receivedPage).toEqual(expectedPage);
        });

        test("Scenario 2a: Test 8", () => {
          const page = getStartPage();
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
                color: Color.Black,
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
                color: Color.Red,
                parent: 6,
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
                color: Color.Black,
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
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 5
                bufferIndex: 0,
                start: { line: 1, column: 45 },
                end: { line: 1, column: 47 },
                leftCharCount: 14,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 1,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 6
                bufferIndex: 1,
                start: { line: 0, column: 4 },
                end: { line: 0, column: 6 },
                leftCharCount: 80,
                leftLineFeedCount: 1,
                length: 2,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: 2,
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
          };
          const receivedPage = deleteContent(page, {
            startOffset: 80,
            endOffset: 85,
          });
          expect(receivedPage).toEqual(expectedPage);
        });
      });

      describe("Scenario 2b: delete from the start of a node to a point in another node", () => {
        test("Scenario 2b: Test 1", () => {
          const page = getStartPage();
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
                parent: 8,
                left: 1,
                right: SENTINEL_INDEX,
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
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 4
                bufferIndex: 1,
                start: { line: 0, column: 1 },
                end: { line: 0, column: 4 },
                leftCharCount: 66,
                leftLineFeedCount: 1,
                length: 3,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
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
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 6
                bufferIndex: 1,
                start: { line: 0, column: 4 },
                end: { line: 0, column: 6 },
                leftCharCount: 66,
                leftLineFeedCount: 1,
                length: 2,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 7
                bufferIndex: 1,
                start: { line: 0, column: 45 },
                end: { line: 0, column: 46 },
                leftCharCount: 66,
                leftLineFeedCount: 1,
                length: 1,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 8
                bufferIndex: 1,
                start: { line: 0, column: 9 },
                end: { line: 0, column: 12 },
                leftCharCount: 66,
                leftLineFeedCount: 1,
                length: 3,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: 2,
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
                parent: 8,
                left: 9,
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
                right: SENTINEL_INDEX,
              },
            ],
            root: 8,
            previouslyInsertedNodeIndex: null,
            previouslyInsertedNodeOffset: null,
          };
          const receivedPage = deleteContent(page, {
            startOffset: 66,
            endOffset: 90,
          });
          expect(receivedPage).toEqual(expectedPage);
        });

        test("Scenario 2b: Test 2", () => {
          const page = getStartPage();
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
                bufferIndex: 0,
                start: { line: 0, column: 0 },
                end: { line: 1, column: 26 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 65,
                lineFeedCount: 1,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                bufferIndex: 1,
                start: { line: 0, column: 0 },
                end: { line: 0, column: 1 },
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
                bufferIndex: 0,
                start: { line: 1, column: 28 },
                end: { line: 1, column: 42 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 14,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                bufferIndex: 1,
                start: { line: 0, column: 1 },
                end: { line: 0, column: 4 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 3,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 5
                bufferIndex: 0,
                start: { line: 1, column: 46 },
                end: { line: 1, column: 47 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 1,
                lineFeedCount: 1,
                color: Color.Black,
                parent: 6,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 6
                bufferIndex: 1,
                start: { line: 0, column: 4 },
                end: { line: 0, column: 6 },
                leftCharCount: 1,
                leftLineFeedCount: 1,
                length: 2,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: 5,
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
                parent: 8,
                left: 9,
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
          };
          const receivedPage = deleteContent(page, {
            startOffset: 0,
            endOffset: 84,
          });
          expect(receivedPage).toEqual(expectedPage);
        });

        test("Scenario 2b: Test 3", () => {
          const page = getStartPage();
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
                parent: 3,
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
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 3
                bufferIndex: 0,
                start: { line: 1, column: 32 },
                end: { line: 1, column: 42 },
                leftCharCount: 65,
                leftLineFeedCount: 1,
                length: 10,
                lineFeedCount: 0,
                color: Color.Black,
                parent: 4,
                left: 1,
                right: SENTINEL_INDEX,
              },
              {
                // 4
                bufferIndex: 1,
                start: { line: 0, column: 1 },
                end: { line: 0, column: 4 },
                leftCharCount: 75,
                leftLineFeedCount: 1,
                length: 3,
                lineFeedCount: 0,
                color: Color.Red,
                parent: 6,
                left: 3,
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
                leftCharCount: 80,
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
          };
          const receivedPage = deleteContent(page, {
            startOffset: 65,
            endOffset: 70,
          });
          expect(receivedPage).toEqual(expectedPage);
        });

        test("Scenario 2b: Test 4", () => {
          const page = getStartPage();
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
                right: 10,
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
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 8
                bufferIndex: 1,
                start: { line: 0, column: 9 },
                end: { line: 0, column: 12 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 3,
                lineFeedCount: 0,
                color: Color.Black,
                parent: 10,
                left: SENTINEL_INDEX,
                right: 9,
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
                parent: 8,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 10
                bufferIndex: 1,
                start: { line: 0, column: 13 },
                end: { line: 0, column: 45 },
                leftCharCount: 4,
                leftLineFeedCount: 0,
                length: 32,
                lineFeedCount: 0,
                color: Color.Red,
                left: 8,
                parent: 6,
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
                right: SENTINEL_INDEX,
              },
            ],
            root: 6,
            previouslyInsertedNodeIndex: null,
            previouslyInsertedNodeOffset: null,
          };
          const receivedPage = deleteContent(page, {
            startOffset: 87,
            endOffset: 90,
          });
          expect(receivedPage).toEqual(expectedPage);
        });
      });

      describe("Scenario 2c: delete from a point in a node to the end of another node", () => {
        test("Scenario 2c: Test 1", () => {
          const page = getStartPage();
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
                end: { line: 0, column: 31 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 31,
                lineFeedCount: 0,
                color: Color.Red,
                parent: 3,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 2
                bufferIndex: 1,
                start: { line: 0, column: 0 },
                end: { line: 0, column: 1 },
                leftCharCount: 31,
                leftLineFeedCount: 0,
                length: 1,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 3
                bufferIndex: 0,
                start: { line: 1, column: 28 },
                end: { line: 1, column: 42 },
                leftCharCount: 31,
                leftLineFeedCount: 0,
                length: 14,
                lineFeedCount: 0,
                color: Color.Black,
                parent: 4,
                left: 1,
                right: SENTINEL_INDEX,
              },
              {
                // 4
                bufferIndex: 1,
                start: { line: 0, column: 1 },
                end: { line: 0, column: 4 },
                leftCharCount: 45,
                leftLineFeedCount: 0,
                length: 3,
                lineFeedCount: 0,
                color: Color.Red,
                parent: 6,
                left: 3,
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
                leftCharCount: 50,
                leftLineFeedCount: 1,
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
          };
          const receivedPage = deleteContent(page, {
            startOffset: 31,
            endOffset: 66,
          });
          expect(receivedPage).toEqual(expectedPage);
        });

        test("Scenario 2c: Test 2", () => {
          const page = getStartPage();
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
                color: Color.Black,
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
                color: Color.Red,
                parent: 6,
                left: 1,
                right: 4,
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
                parent: 4,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 4
                bufferIndex: 1,
                start: { line: 0, column: 1 },
                end: { line: 0, column: 2 },
                leftCharCount: 14,
                leftLineFeedCount: 0,
                length: 1,
                lineFeedCount: 0,
                color: Color.Black,
                parent: 2,
                left: 3,
                right: SENTINEL_INDEX,
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
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 6
                bufferIndex: 1,
                start: { line: 0, column: 4 },
                end: { line: 0, column: 6 },
                leftCharCount: 81,
                leftLineFeedCount: 1,
                length: 2,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: 2,
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
          };
          const receivedPage = deleteContent(page, {
            startOffset: 81,
            endOffset: 85,
          });
          expect(receivedPage).toEqual(expectedPage);
        });

        test("Scenario 2c: Test 3", () => {
          const page = getStartPage();
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
                parent: 7,
                left: 2,
                right: 5,
              },
              {
                // 5
                bufferIndex: 0,
                start: { line: 1, column: 45 },
                end: { line: 1, column: 46 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 1,
                lineFeedCount: 0,
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
                leftCharCount: 84,
                leftLineFeedCount: 1,
                length: 2,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 7
                bufferIndex: 1,
                start: { line: 0, column: 45 },
                end: { line: 0, column: 46 },
                leftCharCount: 84,
                leftLineFeedCount: 1,
                length: 1,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: 4,
                right: 10,
              },
              {
                // 8
                bufferIndex: 1,
                start: { line: 0, column: 7 },
                end: { line: 0, column: 12 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 0,
                color: Color.Black,
                parent: 10,
                left: SENTINEL_INDEX,
                right: 9,
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
                parent: 8,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 10
                bufferIndex: 1,
                start: { line: 0, column: 13 },
                end: { line: 0, column: 45 },
                leftCharCount: 6,
                leftLineFeedCount: 0,
                length: 32,
                lineFeedCount: 0,
                color: Color.Red,
                left: 8,
                parent: 7,
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
                right: SENTINEL_INDEX,
              },
            ],
            root: 7,
            previouslyInsertedNodeIndex: null,
            previouslyInsertedNodeOffset: null,
          };
          const receivedPage = deleteContent(page, {
            startOffset: 84,
            endOffset: 87,
          });
          expect(receivedPage).toEqual(expectedPage);
        });

        test("Scenario 2c: Test 4", () => {
          const page = getStartPage();
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
                end: { line: 0, column: 39 },
                leftCharCount: 1,
                leftLineFeedCount: 0,
                length: 26,
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
          const receivedPage = deleteContent(page, {
            startOffset: 120,
            endOffset: 127,
          });
          expect(receivedPage).toEqual(expectedPage);
        });

        test("Scenario 2c: Test 5", () => {
          const page = getStartPage();
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
                color: Color.Red,
                parent: 8,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 8
                bufferIndex: 1,
                start: { line: 0, column: 7 },
                end: { line: 0, column: 9 },
                leftCharCount: 1,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                color: Color.Black,
                parent: 6,
                left: 7,
                right: SENTINEL_INDEX,
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
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 10
                bufferIndex: 1,
                start: { line: 0, column: 13 },
                end: { line: 0, column: 45 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 32,
                lineFeedCount: 0,
                color: Color.Black,
                left: SENTINEL_INDEX,
                parent: SENTINEL_INDEX,
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
          const receivedPage = deleteContent(page, {
            startOffset: 90,
            endOffset: 127,
          });
          expect(receivedPage).toEqual(expectedPage);
        });

        test("Scenario 2c: Test 6", () => {
          const page = getStartPage();
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
                end: { line: 1, column: 21 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 60,
                lineFeedCount: 1,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 2
                bufferIndex: 1,
                start: { line: 0, column: 0 },
                end: { line: 0, column: 1 },
                leftCharCount: 60,
                leftLineFeedCount: 1,
                length: 1,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 3
                bufferIndex: 0,
                start: { line: 1, column: 28 },
                end: { line: 1, column: 42 },
                leftCharCount: 60,
                leftLineFeedCount: 1,
                length: 14,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 4
                bufferIndex: 1,
                start: { line: 0, column: 1 },
                end: { line: 0, column: 4 },
                leftCharCount: 60,
                leftLineFeedCount: 1,
                length: 3,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 5
                bufferIndex: 0,
                start: { line: 1, column: 45 },
                end: { line: 1, column: 47 },
                leftCharCount: 60,
                leftLineFeedCount: 1,
                length: 2,
                lineFeedCount: 1,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 6
                bufferIndex: 1,
                start: { line: 0, column: 4 },
                end: { line: 0, column: 6 },
                leftCharCount: 60,
                leftLineFeedCount: 1,
                length: 2,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 7
                bufferIndex: 1,
                start: { line: 0, column: 45 },
                end: { line: 0, column: 46 },
                leftCharCount: 60,
                leftLineFeedCount: 1,
                length: 1,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 8
                bufferIndex: 1,
                start: { line: 0, column: 7 },
                end: { line: 0, column: 12 },
                leftCharCount: 60,
                leftLineFeedCount: 1,
                length: 5,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 9
                bufferIndex: 1,
                start: { line: 0, column: 46 },
                end: { line: 0, column: 47 },
                leftCharCount: 60,
                leftLineFeedCount: 1,
                length: 1,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 10
                bufferIndex: 1,
                start: { line: 0, column: 13 },
                end: { line: 0, column: 45 },
                leftCharCount: 60,
                leftLineFeedCount: 1,
                length: 32,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
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
            root: 1,
            previouslyInsertedNodeIndex: null,
            previouslyInsertedNodeOffset: null,
          };
          const receivedPage = deleteContent(page, {
            startOffset: 60,
            endOffset: 127,
          });
          expect(receivedPage).toEqual(expectedPage);
        });
      });

      describe("Scenario 2d: delete from a point in a node to a point in another node", () => {
        test("Scenario 2d: Test 1", () => {
          const page = getStartPage();
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
                end: { line: 1, column: 21 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 60,
                lineFeedCount: 1,
                color: Color.Red,
                parent: 3,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 2
                bufferIndex: 1,
                start: { line: 0, column: 0 },
                end: { line: 0, column: 1 },
                leftCharCount: 60,
                leftLineFeedCount: 1,
                length: 1,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 3
                bufferIndex: 0,
                start: { line: 1, column: 32 },
                end: { line: 1, column: 42 },
                leftCharCount: 60,
                leftLineFeedCount: 1,
                length: 10,
                lineFeedCount: 0,
                color: Color.Black,
                parent: 4,
                left: 1,
                right: SENTINEL_INDEX,
              },
              {
                // 4
                bufferIndex: 1,
                start: { line: 0, column: 1 },
                end: { line: 0, column: 4 },
                leftCharCount: 70,
                leftLineFeedCount: 1,
                length: 3,
                lineFeedCount: 0,
                color: Color.Red,
                parent: 6,
                left: 3,
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
                leftCharCount: 75,
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
          };
          const receivedPage = deleteContent(page, {
            startOffset: 60,
            endOffset: 70,
          });
          expect(receivedPage).toEqual(expectedPage);
        });

        test("Scenario 2d: Test 2", () => {
          const page = getStartPage();
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
                end: { line: 0, column: 30 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 30,
                lineFeedCount: 0,
                color: Color.Red,
                parent: 3,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 2
                bufferIndex: 1,
                start: { line: 0, column: 0 },
                end: { line: 0, column: 1 },
                leftCharCount: 30,
                leftLineFeedCount: 0,
                length: 1,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 3
                bufferIndex: 0,
                start: { line: 1, column: 32 },
                end: { line: 1, column: 42 },
                leftCharCount: 30,
                leftLineFeedCount: 0,
                length: 10,
                lineFeedCount: 0,
                color: Color.Black,
                parent: 4,
                left: 1,
                right: SENTINEL_INDEX,
              },
              {
                // 4
                bufferIndex: 1,
                start: { line: 0, column: 1 },
                end: { line: 0, column: 4 },
                leftCharCount: 40,
                leftLineFeedCount: 0,
                length: 3,
                lineFeedCount: 0,
                color: Color.Red,
                parent: 6,
                left: 3,
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
                leftCharCount: 45,
                leftLineFeedCount: 1,
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
          };
          const receivedPage = deleteContent(page, {
            startOffset: 30,
            endOffset: 70,
          });
          expect(receivedPage).toEqual(expectedPage);
        });

        test("Scenario 2d: Test 3", () => {
          const page = getStartPage();
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
                parent: 8,
                left: 2,
                right: 5,
              },
              {
                // 5
                bufferIndex: 0,
                start: { line: 1, column: 45 },
                end: { line: 1, column: 46 },
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 1,
                lineFeedCount: 0,
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
                leftCharCount: 84,
                leftLineFeedCount: 1,
                length: 2,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 7
                bufferIndex: 1,
                start: { line: 0, column: 45 },
                end: { line: 0, column: 46 },
                leftCharCount: 84,
                leftLineFeedCount: 1,
                length: 1,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 8
                bufferIndex: 1,
                start: { line: 0, column: 8 },
                end: { line: 0, column: 12 },
                leftCharCount: 84,
                leftLineFeedCount: 1,
                length: 4,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: 4,
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
                right: SENTINEL_INDEX,
              },
            ],
            root: 8,
            previouslyInsertedNodeIndex: null,
            previouslyInsertedNodeOffset: null,
          };
          const receivedPage = deleteContent(page, {
            startOffset: 84,
            endOffset: 89,
          });
          expect(receivedPage).toEqual(expectedPage);
        });

        test("Scenario 2d: Test 4", () => {
          const page = getStartPage();
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
                color: Color.Black,
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
                color: Color.Red,
                parent: 6,
                left: 1,
                right: 4,
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
                parent: 4,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 4
                bufferIndex: 1,
                start: { line: 0, column: 1 },
                end: { line: 0, column: 2 },
                leftCharCount: 14,
                leftLineFeedCount: 0,
                length: 1,
                lineFeedCount: 0,
                color: Color.Black,
                parent: 2,
                left: 3,
                right: SENTINEL_INDEX,
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
                parent: SENTINEL_INDEX,
                left: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
              },
              {
                // 6
                bufferIndex: 1,
                start: { line: 0, column: 5 },
                end: { line: 0, column: 6 },
                leftCharCount: 81,
                leftLineFeedCount: 1,
                length: 1,
                lineFeedCount: 0,
                color: Color.Black,
                parent: SENTINEL_INDEX,
                left: 2,
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
          };
          const receivedPage = deleteContent(page, {
            startOffset: 81,
            endOffset: 86,
          });
          expect(receivedPage).toEqual(expectedPage);
        });
      });
    });
  });
});
