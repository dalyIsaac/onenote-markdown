/* eslint-disable max-len */

import { Color, PageContent } from "../pageModel";
import { getStartPage } from "../reducer.test";
import { SENTINEL_STRUCTURE } from "../structureTree/tree";
import { SENTINEL_INDEX } from "../tree/tree";
import { deleteContent } from "./delete";
import { SENTINEL_CONTENT } from "./tree";

describe("delete content", (): void => {
  describe("Scenario 1", (): void => {
    describe("Scenario 1a: delete the content from an entire node", (): void => {
      test("Scenario 1a: Test 1", (): void => {
        const page: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              isReadOnly: false,
              lineStarts: [0, 4],
            },
          ],
          content: {
            nodes: [
              SENTINEL_CONTENT,
              {
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 1, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                parent: SENTINEL_INDEX,
                right: 2,
                start: { column: 0, line: 0 },
              },
              {
                bufferIndex: 0,
                color: Color.Red,
                end: { column: 3, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                parent: 1,
                right: SENTINEL_INDEX,
                start: { column: 1, line: 1 },
              },
            ],
            root: 1,
          },
          previouslyInsertedContentNodeIndex: 1,
          previouslyInsertedContentNodeOffset: 5,
          structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
        };
        const expectedPage: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              isReadOnly: false,
              lineStarts: [0, 4],
            },
          ],
          content: {
            nodes: [
              SENTINEL_CONTENT,
              {
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 1, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 0, line: 0 },
              },
              {
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 3, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 1, line: 1 },
              },
            ],
            root: 1,
          },
          previouslyInsertedContentNodeIndex: null,
          previouslyInsertedContentNodeOffset: null,
          structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
        };
        deleteContent(page, {
          endOffset: 7,
          startOffset: 5,
        });
        expect(page).toStrictEqual(expectedPage);
      });

      test("Scenario 1a: Test 2", (): void => {
        const page: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              isReadOnly: false,
              lineStarts: [0, 4],
            },
          ],
          content: {
            nodes: [
              SENTINEL_CONTENT,
              {
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 1, line: 1 },
                left: 2,
                leftCharCount: 2,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 0, line: 0 },
              },
              {
                bufferIndex: 0,
                color: Color.Red,
                end: { column: 3, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                parent: 1,
                right: SENTINEL_INDEX,
                start: { column: 1, line: 1 },
              },
            ],
            root: 1,
          },
          previouslyInsertedContentNodeIndex: 1,
          previouslyInsertedContentNodeOffset: 0,
          structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
        };
        const expectedPage: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              isReadOnly: false,
              lineStarts: [0, 4],
            },
          ],
          content: {
            nodes: [
              SENTINEL_CONTENT,
              {
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 1, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 0, line: 0 },
              },
              {
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 3, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 1, line: 1 },
              },
            ],
            root: 1,
          },
          previouslyInsertedContentNodeIndex: null,
          previouslyInsertedContentNodeOffset: null,
          structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
        };
        deleteContent(page, {
          endOffset: 2,
          startOffset: 0,
        });
        expect(page).toStrictEqual(expectedPage);
      });

      test("Scenario 1a: Test 3", (): void => {
        const page: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              isReadOnly: false,
              lineStarts: [0, 4],
            },
          ],
          content: {
            nodes: [
              SENTINEL_CONTENT,
              {
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 1, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                parent: SENTINEL_INDEX,
                right: 2,
                start: { column: 0, line: 0 },
              },
              {
                bufferIndex: 0,
                color: Color.Red,
                end: { column: 3, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                parent: 1,
                right: SENTINEL_INDEX,
                start: { column: 1, line: 1 },
              },
            ],
            root: 1,
          },
          previouslyInsertedContentNodeIndex: 1,
          previouslyInsertedContentNodeOffset: 5,
          structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
        };
        const expectedPage: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              isReadOnly: false,
              lineStarts: [0, 4],
            },
          ],
          content: {
            nodes: [
              SENTINEL_CONTENT,
              {
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 1, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 0, line: 0 },
              },
              {
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 3, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 1, line: 1 },
              },
            ],
            root: 2,
          },
          previouslyInsertedContentNodeIndex: null,
          previouslyInsertedContentNodeOffset: null,
          structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
        };
        deleteContent(page, {
          endOffset: 5,
          startOffset: 0,
        });
        expect(page).toStrictEqual(expectedPage);
      });

      test("Scenario 1a: Test 4", (): void => {
        const page: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              isReadOnly: false,
              lineStarts: [0, 4],
            },
          ],
          content: {
            nodes: [
              SENTINEL_CONTENT,
              {
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 1, line: 1 },
                left: 2,
                leftCharCount: 2,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 0, line: 0 },
              },
              {
                bufferIndex: 0,
                color: Color.Red,
                end: { column: 3, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                parent: 1,
                right: SENTINEL_INDEX,
                start: { column: 1, line: 1 },
              },
            ],
            root: 1,
          },
          previouslyInsertedContentNodeIndex: 1,
          previouslyInsertedContentNodeOffset: 0,
          structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
        };
        const expectedPage: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              isReadOnly: false,
              lineStarts: [0, 4],
            },
          ],
          content: {
            nodes: [
              SENTINEL_CONTENT,
              {
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 1, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 2,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 0, line: 0 },
              },
              {
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 3, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 1, line: 1 },
              },
            ],
            root: 2,
          },
          previouslyInsertedContentNodeIndex: null,
          previouslyInsertedContentNodeOffset: null,
          structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
        };
        deleteContent(page, {
          endOffset: 7,
          startOffset: 2,
        });
        expect(page).toStrictEqual(expectedPage);
      });
    });

    describe("Scenario 1b: delete from the start of a node to a point in the node", (): void => {
      test("Scenario 1b: Test 1", (): void => {
        const page: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              isReadOnly: false,
              lineStarts: [0, 4],
            },
          ],
          content: {
            nodes: [
              SENTINEL_CONTENT,
              {
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 1, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                parent: SENTINEL_INDEX,
                right: 2,
                start: { column: 0, line: 0 },
              },
              {
                bufferIndex: 0,
                color: Color.Red,
                end: { column: 3, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                parent: 1,
                right: SENTINEL_INDEX,
                start: { column: 1, line: 1 },
              },
            ],
            root: 1,
          },
          previouslyInsertedContentNodeIndex: 1,
          previouslyInsertedContentNodeOffset: 5,
          structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
        };
        const expectedPage: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              isReadOnly: false,
              lineStarts: [0, 4],
            },
          ],
          content: {
            nodes: [
              SENTINEL_CONTENT,
              {
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 1, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 1,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: 2,
                start: { column: 0, line: 1 },
              },
              {
                bufferIndex: 0,
                color: Color.Red,
                end: { column: 3, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                parent: 1,
                right: SENTINEL_INDEX,
                start: { column: 1, line: 1 },
              },
            ],
            root: 1,
          },
          previouslyInsertedContentNodeIndex: null,
          previouslyInsertedContentNodeOffset: null,
          structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
        };
        deleteContent(page, {
          endOffset: 4,
          startOffset: 0,
        });
        expect(page).toStrictEqual(expectedPage);
      });

      test("Scenario 1b: Test 2", (): void => {
        const page: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              isReadOnly: false,
              lineStarts: [0, 4],
            },
          ],
          content: {
            nodes: [
              SENTINEL_CONTENT,
              {
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 1, line: 1 },
                left: 2,
                leftCharCount: 2,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 0, line: 0 },
              },
              {
                bufferIndex: 0,
                color: Color.Red,
                end: { column: 3, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                parent: 1,
                right: SENTINEL_INDEX,
                start: { column: 1, line: 1 },
              },
            ],
            root: 1,
          },
          previouslyInsertedContentNodeIndex: 1,
          previouslyInsertedContentNodeOffset: 0,
          structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
        };
        const expectedPage: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              isReadOnly: false,
              lineStarts: [0, 4],
            },
          ],
          content: {
            nodes: [
              SENTINEL_CONTENT,
              {
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 1, line: 1 },
                left: 2,
                leftCharCount: 2,
                leftLineFeedCount: 0,
                length: 1,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 0, line: 1 },
              },
              {
                bufferIndex: 0,
                color: Color.Red,
                end: { column: 3, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                parent: 1,
                right: SENTINEL_INDEX,
                start: { column: 1, line: 1 },
              },
            ],
            root: 1,
          },
          previouslyInsertedContentNodeIndex: null,
          previouslyInsertedContentNodeOffset: null,
          structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
        };
        deleteContent(page, {
          endOffset: 6,
          startOffset: 2,
        });
        expect(page).toStrictEqual(expectedPage);
      });

      test("Scenario 1b: Test 3", (): void => {
        const page: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              isReadOnly: false,
              lineStarts: [0, 4],
            },
          ],
          content: {
            nodes: [
              SENTINEL_CONTENT,
              {
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 1, line: 1 },
                left: 2,
                leftCharCount: 2,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 0, line: 0 },
              },
              {
                bufferIndex: 0,
                color: Color.Red,
                end: { column: 3, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                parent: 1,
                right: SENTINEL_INDEX,
                start: { column: 1, line: 1 },
              },
            ],
            root: 1,
          },
          previouslyInsertedContentNodeIndex: 1,
          previouslyInsertedContentNodeOffset: 0,
          structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
        };
        const expectedPage: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              isReadOnly: false,
              lineStarts: [0, 4],
            },
          ],
          content: {
            nodes: [
              SENTINEL_CONTENT,
              {
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 1, line: 1 },
                left: 2,
                leftCharCount: 2,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 1,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 3, line: 0 },
              },
              {
                bufferIndex: 0,
                color: Color.Red,
                end: { column: 3, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                parent: 1,
                right: SENTINEL_INDEX,
                start: { column: 1, line: 1 },
              },
            ],
            root: 1,
          },
          previouslyInsertedContentNodeIndex: null,
          previouslyInsertedContentNodeOffset: null,
          structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
        };
        deleteContent(page, {
          endOffset: 5,
          startOffset: 2,
        });
        expect(page).toStrictEqual(expectedPage);
      });

      test("Scenario 1b: Test 4", (): void => {
        const page: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              isReadOnly: false,
              lineStarts: [0, 4],
            },
          ],
          content: {
            nodes: [
              SENTINEL_CONTENT,
              {
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 1, line: 1 },
                left: 2,
                leftCharCount: 2,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 0, line: 0 },
              },
              {
                bufferIndex: 0,
                color: Color.Red,
                end: { column: 3, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                parent: 1,
                right: SENTINEL_INDEX,
                start: { column: 1, line: 1 },
              },
            ],
            root: 1,
          },
          previouslyInsertedContentNodeIndex: 1,
          previouslyInsertedContentNodeOffset: 0,
          structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
        };
        const expectedPage: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              isReadOnly: false,
              lineStarts: [0, 4],
            },
          ],
          content: {
            nodes: [
              SENTINEL_CONTENT,
              {
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 1, line: 1 },
                left: 2,
                leftCharCount: 2,
                leftLineFeedCount: 0,
                length: 3,
                lineFeedCount: 1,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 2, line: 0 },
              },
              {
                bufferIndex: 0,
                color: Color.Red,
                end: { column: 3, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                parent: 1,
                right: SENTINEL_INDEX,
                start: { column: 1, line: 1 },
              },
            ],
            root: 1,
          },
          previouslyInsertedContentNodeIndex: null,
          previouslyInsertedContentNodeOffset: null,
          structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
        };
        deleteContent(page, {
          endOffset: 4,
          startOffset: 2,
        });
        expect(page).toStrictEqual(expectedPage);
      });

      test("Scenario 1b: Test 5", (): void => {
        const page: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              isReadOnly: false,
              lineStarts: [0, 4],
            },
          ],
          content: {
            nodes: [
              SENTINEL_CONTENT,
              {
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 1, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                parent: SENTINEL_INDEX,
                right: 2,
                start: { column: 0, line: 0 },
              },
              {
                bufferIndex: 0,
                color: Color.Red,
                end: { column: 3, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                parent: 1,
                right: SENTINEL_INDEX,
                start: { column: 1, line: 1 },
              },
            ],
            root: 1,
          },
          previouslyInsertedContentNodeIndex: 1,
          previouslyInsertedContentNodeOffset: 5,
          structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
        };
        const expectedPage: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              isReadOnly: false,
              lineStarts: [0, 4],
            },
          ],
          content: {
            nodes: [
              SENTINEL_CONTENT,
              {
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 1, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                parent: SENTINEL_INDEX,
                right: 2,
                start: { column: 0, line: 0 },
              },
              {
                bufferIndex: 0,
                color: Color.Red,
                end: { column: 3, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 1,
                lineFeedCount: 0,
                parent: 1,
                right: SENTINEL_INDEX,
                start: { column: 2, line: 1 },
              },
            ],
            root: 1,
          },
          previouslyInsertedContentNodeIndex: null,
          previouslyInsertedContentNodeOffset: null,
          structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
        };
        deleteContent(page, {
          endOffset: 6,
          startOffset: 5,
        });
        expect(page).toStrictEqual(expectedPage);
      });

      test("Scenario 1b: Test 6", (): void => {
        const page: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              isReadOnly: false,
              lineStarts: [0, 4],
            },
          ],
          content: {
            nodes: [
              SENTINEL_CONTENT,
              {
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 1, line: 1 },
                left: 2,
                leftCharCount: 2,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 0, line: 0 },
              },
              {
                bufferIndex: 0,
                color: Color.Red,
                end: { column: 3, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                parent: 1,
                right: SENTINEL_INDEX,
                start: { column: 1, line: 1 },
              },
            ],
            root: 1,
          },
          previouslyInsertedContentNodeIndex: 1,
          previouslyInsertedContentNodeOffset: 0,
          structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
        };
        const expectedPage: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              isReadOnly: false,
              lineStarts: [0, 4],
            },
          ],
          content: {
            nodes: [
              SENTINEL_CONTENT,
              {
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 1, line: 1 },
                left: 2,
                leftCharCount: 1,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 0, line: 0 },
              },
              {
                bufferIndex: 0,
                color: Color.Red,
                end: { column: 3, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 1,
                lineFeedCount: 0,
                parent: 1,
                right: SENTINEL_INDEX,
                start: { column: 2, line: 1 },
              },
            ],
            root: 1,
          },
          previouslyInsertedContentNodeIndex: null,
          previouslyInsertedContentNodeOffset: null,
          structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
        };
        deleteContent(page, {
          endOffset: 1,
          startOffset: 0,
        });
        expect(page).toStrictEqual(expectedPage);
      });
    });

    describe("Scenario 1c: delete from a point in a node to the end of the node", (): void => {
      test("Scenario 1c: Test 1", (): void => {
        const page: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              isReadOnly: false,
              lineStarts: [0, 4],
            },
          ],
          content: {
            nodes: [
              SENTINEL_CONTENT,
              {
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 1, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                parent: SENTINEL_INDEX,
                right: 2,
                start: { column: 0, line: 0 },
              },
              {
                bufferIndex: 0,
                color: Color.Red,
                end: { column: 3, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                parent: 1,
                right: SENTINEL_INDEX,
                start: { column: 1, line: 1 },
              },
            ],
            root: 1,
          },
          previouslyInsertedContentNodeIndex: 1,
          previouslyInsertedContentNodeOffset: 5,
          structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
        };
        const expectedPage: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              isReadOnly: false,
              lineStarts: [0, 4],
            },
          ],
          content: {
            nodes: [
              SENTINEL_CONTENT,
              {
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 2, line: 0 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: 2,
                start: { column: 0, line: 0 },
              },
              {
                bufferIndex: 0,
                color: Color.Red,
                end: { column: 3, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                parent: 1,
                right: SENTINEL_INDEX,
                start: { column: 1, line: 1 },
              },
            ],
            root: 1,
          },
          previouslyInsertedContentNodeIndex: null,
          previouslyInsertedContentNodeOffset: null,
          structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
        };
        deleteContent(page, {
          endOffset: 5,
          startOffset: 2,
        });
        expect(page).toStrictEqual(expectedPage);
      });

      test("Scenario 1c: Test 2", (): void => {
        const page: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              isReadOnly: false,
              lineStarts: [0, 4],
            },
          ],
          content: {
            nodes: [
              SENTINEL_CONTENT,
              {
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 1, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                parent: SENTINEL_INDEX,
                right: 2,
                start: { column: 0, line: 0 },
              },
              {
                bufferIndex: 0,
                color: Color.Red,
                end: { column: 3, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                parent: 1,
                right: SENTINEL_INDEX,
                start: { column: 1, line: 1 },
              },
            ],
            root: 1,
          },
          previouslyInsertedContentNodeIndex: 1,
          previouslyInsertedContentNodeOffset: 5,
          structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
        };
        const expectedPage: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              isReadOnly: false,
              lineStarts: [0, 4],
            },
          ],
          content: {
            nodes: [
              SENTINEL_CONTENT,
              {
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 3, line: 0 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 3,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: 2,
                start: { column: 0, line: 0 },
              },
              {
                bufferIndex: 0,
                color: Color.Red,
                end: { column: 3, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                parent: 1,
                right: SENTINEL_INDEX,
                start: { column: 1, line: 1 },
              },
            ],
            root: 1,
          },
          previouslyInsertedContentNodeIndex: null,
          previouslyInsertedContentNodeOffset: null,
          structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
        };
        deleteContent(page, {
          endOffset: 5,
          startOffset: 3,
        });
        expect(page).toStrictEqual(expectedPage);
      });

      test("Scenario 1c: Test 3", (): void => {
        const page: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              isReadOnly: false,
              lineStarts: [0, 4],
            },
          ],
          content: {
            nodes: [
              SENTINEL_CONTENT,
              {
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 1, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                parent: SENTINEL_INDEX,
                right: 2,
                start: { column: 0, line: 0 },
              },
              {
                bufferIndex: 0,
                color: Color.Red,
                end: { column: 3, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                parent: 1,
                right: SENTINEL_INDEX,
                start: { column: 1, line: 1 },
              },
            ],
            root: 1,
          },
          previouslyInsertedContentNodeIndex: 1,
          previouslyInsertedContentNodeOffset: 5,
          structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
        };
        const expectedPage: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              isReadOnly: false,
              lineStarts: [0, 4],
            },
          ],
          content: {
            nodes: [
              SENTINEL_CONTENT,
              {
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 4, line: 0 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 4,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: 2,
                start: { column: 0, line: 0 },
              },
              {
                bufferIndex: 0,
                color: Color.Red,
                end: { column: 3, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                parent: 1,
                right: SENTINEL_INDEX,
                start: { column: 1, line: 1 },
              },
            ],
            root: 1,
          },
          previouslyInsertedContentNodeIndex: null,
          previouslyInsertedContentNodeOffset: null,
          structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
        };
        deleteContent(page, {
          endOffset: 5,
          startOffset: 4,
        });
        expect(page).toStrictEqual(expectedPage);
      });

      test("Scenario 1c: Test 4", (): void => {
        const page: PageContent = {
          buffers: [
            {
              content: "abc\ndzef",
              isReadOnly: false,
              lineStarts: [0, 4],
            },
          ],
          content: {
            nodes: [
              SENTINEL_CONTENT,
              {
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 2, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 6,
                lineFeedCount: 1,
                parent: SENTINEL_INDEX,
                right: 2,
                start: { column: 0, line: 0 },
              },
              {
                bufferIndex: 0,
                color: Color.Red,
                end: { column: 4, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                parent: 1,
                right: SENTINEL_INDEX,
                start: { column: 2, line: 1 },
              },
            ],
            root: 1,
          },
          previouslyInsertedContentNodeIndex: 1,
          previouslyInsertedContentNodeOffset: 5,
          structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
        };
        const expectedPage: PageContent = {
          buffers: [
            {
              content: "abc\ndzef",
              isReadOnly: false,
              lineStarts: [0, 4],
            },
          ],
          content: {
            nodes: [
              SENTINEL_CONTENT,
              {
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 1, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                parent: SENTINEL_INDEX,
                right: 2,
                start: { column: 0, line: 0 },
              },
              {
                bufferIndex: 0,
                color: Color.Red,
                end: { column: 4, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                parent: 1,
                right: SENTINEL_INDEX,
                start: { column: 2, line: 1 },
              },
            ],
            root: 1,
          },
          previouslyInsertedContentNodeIndex: null,
          previouslyInsertedContentNodeOffset: null,
          structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
        };
        deleteContent(page, {
          endOffset: 6,
          startOffset: 5,
        });
        expect(page).toStrictEqual(expectedPage);
      });

      test("Scenario 1c: Test 5", (): void => {
        const page: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              isReadOnly: false,
              lineStarts: [0, 4],
            },
          ],
          content: {
            nodes: [
              SENTINEL_CONTENT,
              {
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 1, line: 1 },
                left: 2,
                leftCharCount: 2,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 0, line: 0 },
              },
              {
                bufferIndex: 0,
                color: Color.Red,
                end: { column: 3, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                parent: 1,
                right: SENTINEL_INDEX,
                start: { column: 1, line: 1 },
              },
            ],
            root: 1,
          },
          previouslyInsertedContentNodeIndex: 1,
          previouslyInsertedContentNodeOffset: 0,
          structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
        };
        const expectedPage: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              isReadOnly: false,
              lineStarts: [0, 4],
            },
          ],
          content: {
            nodes: [
              SENTINEL_CONTENT,
              {
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 2, line: 0 },
                left: 2,
                leftCharCount: 2,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 0, line: 0 },
              },
              {
                bufferIndex: 0,
                color: Color.Red,
                end: { column: 3, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                parent: 1,
                right: SENTINEL_INDEX,
                start: { column: 1, line: 1 },
              },
            ],
            root: 1,
          },
          previouslyInsertedContentNodeIndex: null,
          previouslyInsertedContentNodeOffset: null,
          structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
        };
        deleteContent(page, {
          endOffset: 7,
          startOffset: 4,
        });
        expect(page).toStrictEqual(expectedPage);
      });

      test("Scenario 1c: Test 6", (): void => {
        const page: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              isReadOnly: false,
              lineStarts: [0, 4],
            },
          ],
          content: {
            nodes: [
              SENTINEL_CONTENT,
              {
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 1, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                parent: SENTINEL_INDEX,
                right: 2,
                start: { column: 0, line: 0 },
              },
              {
                bufferIndex: 0,
                color: Color.Red,
                end: { column: 3, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                parent: 1,
                right: SENTINEL_INDEX,
                start: { column: 1, line: 1 },
              },
            ],
            root: 1,
          },
          previouslyInsertedContentNodeIndex: 1,
          previouslyInsertedContentNodeOffset: 0,
          structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
        };
        const expectedPage: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              isReadOnly: false,
              lineStarts: [0, 4],
            },
          ],
          content: {
            nodes: [
              SENTINEL_CONTENT,
              {
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 1, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                parent: SENTINEL_INDEX,
                right: 2,
                start: { column: 0, line: 0 },
              },
              {
                bufferIndex: 0,
                color: Color.Red,
                end: { column: 2, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 1,
                lineFeedCount: 0,
                parent: 1,
                right: SENTINEL_INDEX,
                start: { column: 1, line: 1 },
              },
            ],
            root: 1,
          },
          previouslyInsertedContentNodeIndex: null,
          previouslyInsertedContentNodeOffset: null,
          structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
        };
        deleteContent(page, {
          endOffset: 7,
          startOffset: 6,
        });
        expect(page).toStrictEqual(expectedPage);
      });

      test("Scenario 1c: Test 7", (): void => {
        const page: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              isReadOnly: false,
              lineStarts: [0, 4],
            },
          ],
          content: {
            nodes: [
              SENTINEL_CONTENT,
              {
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 1, line: 1 },
                left: 2,
                leftCharCount: 2,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 0, line: 0 },
              },
              {
                bufferIndex: 0,
                color: Color.Red,
                end: { column: 3, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                parent: 1,
                right: SENTINEL_INDEX,
                start: { column: 1, line: 1 },
              },
            ],
            root: 1,
          },
          previouslyInsertedContentNodeIndex: 1,
          previouslyInsertedContentNodeOffset: 0,
          structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
        };
        const expectedPage: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              isReadOnly: false,
              lineStarts: [0, 4],
            },
          ],
          content: {
            nodes: [
              SENTINEL_CONTENT,
              {
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 1, line: 1 },
                left: 2,
                leftCharCount: 2,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 0, line: 0 },
              },
              {
                bufferIndex: 0,
                color: Color.Red,
                end: { column: 2, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 1,
                lineFeedCount: 0,
                parent: 1,
                right: SENTINEL_INDEX,
                start: { column: 1, line: 1 },
              },
            ],
            root: 1,
          },
          previouslyInsertedContentNodeIndex: null,
          previouslyInsertedContentNodeOffset: null,
          structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
        };
        deleteContent(page, {
          endOffset: 2,
          startOffset: 1,
        });
        expect(page).toStrictEqual(expectedPage);
      });
    });

    describe("Scenario 1d: delete from a point in a node to another point in the node", (): void => {
      test("Scenario 1d: Test 1", (): void => {
        const page: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              isReadOnly: false,
              lineStarts: [0, 4],
            },
          ],
          content: {
            nodes: [
              SENTINEL_CONTENT,
              {
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 1, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                parent: SENTINEL_INDEX,
                right: 2,
                start: { column: 0, line: 0 },
              },
              {
                bufferIndex: 0,
                color: Color.Red,
                end: { column: 3, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                parent: 1,
                right: SENTINEL_INDEX,
                start: { column: 1, line: 1 },
              },
            ],
            root: 1,
          },
          previouslyInsertedContentNodeIndex: 1,
          previouslyInsertedContentNodeOffset: 5,
          structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
        };
        const expectedPage: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              isReadOnly: false,
              lineStarts: [0, 4],
            },
          ],
          content: {
            nodes: [
              SENTINEL_CONTENT,
              {
                bufferIndex: 0,
                color: Color.Red,
                end: { column: 2, line: 0 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                parent: 3,
                right: SENTINEL_INDEX,
                start: { column: 0, line: 0 },
              },
              {
                bufferIndex: 0,
                color: Color.Red,
                end: { column: 3, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                parent: 3,
                right: SENTINEL_INDEX,
                start: { column: 1, line: 1 },
              },
              {
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 1, line: 1 },
                left: 1,
                leftCharCount: 2,
                leftLineFeedCount: 0,
                length: 1,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: 2,
                start: { column: 0, line: 1 },
              },
            ],
            root: 3,
          },
          previouslyInsertedContentNodeIndex: null,
          previouslyInsertedContentNodeOffset: null,
          structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
        };
        deleteContent(page, {
          endOffset: 4,
          startOffset: 2,
        });
        expect(page).toStrictEqual(expectedPage);
      });

      test("Scenario 1d: Test 2", (): void => {
        const page: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              isReadOnly: false,
              lineStarts: [0, 4],
            },
          ],
          content: {
            nodes: [
              SENTINEL_CONTENT,
              {
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 1, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                parent: SENTINEL_INDEX,
                right: 2,
                start: { column: 0, line: 0 },
              },
              {
                bufferIndex: 0,
                color: Color.Red,
                end: { column: 3, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                parent: 1,
                right: SENTINEL_INDEX,
                start: { column: 1, line: 1 },
              },
            ],
            root: 1,
          },
          previouslyInsertedContentNodeIndex: 1,
          previouslyInsertedContentNodeOffset: 5,
          structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
        };
        const expectedPage: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              isReadOnly: false,
              lineStarts: [0, 4],
            },
          ],
          content: {
            nodes: [
              SENTINEL_CONTENT,
              {
                bufferIndex: 0,
                color: Color.Red,
                end: { column: 3, line: 0 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 3,
                lineFeedCount: 0,
                parent: 3,
                right: SENTINEL_INDEX,
                start: { column: 0, line: 0 },
              },
              {
                bufferIndex: 0,
                color: Color.Red,
                end: { column: 3, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                parent: 3,
                right: SENTINEL_INDEX,
                start: { column: 1, line: 1 },
              },
              {
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 1, line: 1 },
                left: 1,
                leftCharCount: 3,
                leftLineFeedCount: 0,
                length: 1,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: 2,
                start: { column: 0, line: 1 },
              },
            ],
            root: 3,
          },
          previouslyInsertedContentNodeIndex: null,
          previouslyInsertedContentNodeOffset: null,
          structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
        };
        deleteContent(page, {
          endOffset: 4,
          startOffset: 3,
        });
        expect(page).toStrictEqual(expectedPage);
      });

      test("Scenario 1d: Test 3", (): void => {
        const page: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              isReadOnly: false,
              lineStarts: [0, 4],
            },
          ],
          content: {
            nodes: [
              SENTINEL_CONTENT,
              {
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 1, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                parent: SENTINEL_INDEX,
                right: 2,
                start: { column: 0, line: 0 },
              },
              {
                bufferIndex: 0,
                color: Color.Red,
                end: { column: 3, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                parent: 1,
                right: SENTINEL_INDEX,
                start: { column: 1, line: 1 },
              },
            ],
            root: 1,
          },
          previouslyInsertedContentNodeIndex: 1,
          previouslyInsertedContentNodeOffset: 5,
          structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
        };
        const expectedPage: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              isReadOnly: false,
              lineStarts: [0, 4],
            },
          ],
          content: {
            nodes: [
              SENTINEL_CONTENT,
              {
                bufferIndex: 0,
                color: Color.Red,
                end: { column: 2, line: 0 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                parent: 3,
                right: SENTINEL_INDEX,
                start: { column: 0, line: 0 },
              },
              {
                bufferIndex: 0,
                color: Color.Red,
                end: { column: 3, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                parent: 3,
                right: SENTINEL_INDEX,
                start: { column: 1, line: 1 },
              },
              {
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 1, line: 1 },
                left: 1,
                leftCharCount: 2,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 1,
                parent: SENTINEL_INDEX,
                right: 2,
                start: { column: 3, line: 0 },
              },
            ],
            root: 3,
          },
          previouslyInsertedContentNodeIndex: null,
          previouslyInsertedContentNodeOffset: null,
          structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
        };
        deleteContent(page, {
          endOffset: 3,
          startOffset: 2,
        });
        expect(page).toStrictEqual(expectedPage);
      });

      test("Scenario 1d: Test 4", (): void => {
        const page: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              isReadOnly: false,
              lineStarts: [0, 4],
            },
          ],
          content: {
            nodes: [
              SENTINEL_CONTENT,
              {
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 1, line: 1 },
                left: 2,
                leftCharCount: 2,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 0, line: 0 },
              },
              {
                bufferIndex: 0,
                color: Color.Red,
                end: { column: 3, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                parent: 1,
                right: SENTINEL_INDEX,
                start: { column: 1, line: 1 },
              },
            ],
            root: 1,
          },
          previouslyInsertedContentNodeIndex: null,
          previouslyInsertedContentNodeOffset: null,
          structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
        };
        const expectedPage: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              isReadOnly: false,
              lineStarts: [0, 4],
            },
          ],
          content: {
            nodes: [
              SENTINEL_CONTENT,
              {
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 2, line: 0 },
                left: 2,
                leftCharCount: 2,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: 3,
                start: { column: 0, line: 0 },
              },
              {
                bufferIndex: 0,
                color: Color.Red,
                end: { column: 3, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                parent: 1,
                right: SENTINEL_INDEX,
                start: { column: 1, line: 1 },
              },
              {
                bufferIndex: 0,
                color: Color.Red,
                end: { column: 1, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 1,
                lineFeedCount: 0,
                parent: 1,
                right: SENTINEL_INDEX,
                start: { column: 0, line: 1 },
              },
            ],
            root: 1,
          },
          previouslyInsertedContentNodeIndex: null,
          previouslyInsertedContentNodeOffset: null,
          structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
        };
        deleteContent(page, {
          endOffset: 6,
          startOffset: 4,
        });
        expect(page).toStrictEqual(expectedPage);
      });

      test("Scenario 1d: Test 5", (): void => {
        const page: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              isReadOnly: false,
              lineStarts: [0, 4],
            },
          ],
          content: {
            nodes: [
              SENTINEL_CONTENT,
              {
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 1, line: 1 },
                left: 2,
                leftCharCount: 2,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 0, line: 0 },
              },
              {
                bufferIndex: 0,
                color: Color.Red,
                end: { column: 3, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                parent: 1,
                right: SENTINEL_INDEX,
                start: { column: 1, line: 1 },
              },
            ],
            root: 1,
          },
          previouslyInsertedContentNodeIndex: null,
          previouslyInsertedContentNodeOffset: null,
          structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
        };
        const expectedPage: PageContent = {
          buffers: [
            {
              content: "abc\ndef",
              isReadOnly: false,
              lineStarts: [0, 4],
            },
          ],
          content: {
            nodes: [
              SENTINEL_CONTENT,
              {
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 2, line: 0 },
                left: 2,
                leftCharCount: 2,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: 3,
                start: { column: 0, line: 0 },
              },
              {
                bufferIndex: 0,
                color: Color.Red,
                end: { column: 3, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                parent: 1,
                right: SENTINEL_INDEX,
                start: { column: 1, line: 1 },
              },
              {
                bufferIndex: 0,
                color: Color.Red,
                end: { column: 1, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 1,
                parent: 1,
                right: SENTINEL_INDEX,
                start: { column: 3, line: 0 },
              },
            ],
            root: 1,
          },
          previouslyInsertedContentNodeIndex: null,
          previouslyInsertedContentNodeOffset: null,
          structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
        };
        deleteContent(page, {
          endOffset: 5,
          startOffset: 4,
        });
        expect(page).toStrictEqual(expectedPage);
      });

      test("Scenario 1d: Test 6", (): void => {
        const page: PageContent = {
          buffers: [
            {
              content: "abc\ndefgh",
              isReadOnly: false,
              lineStarts: [0, 4],
            },
          ],
          content: {
            nodes: [
              SENTINEL_CONTENT,
              {
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 1, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                parent: SENTINEL_INDEX,
                right: 2,
                start: { column: 0, line: 0 },
              },
              {
                bufferIndex: 0,
                color: Color.Red,
                end: { column: 5, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 4,
                lineFeedCount: 0,
                parent: 1,
                right: SENTINEL_INDEX,
                start: { column: 1, line: 1 },
              },
            ],
            root: 1,
          },
          previouslyInsertedContentNodeIndex: null,
          previouslyInsertedContentNodeOffset: null,
          structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
        };
        const expectedPage: PageContent = {
          buffers: [
            {
              content: "abc\ndefgh",
              isReadOnly: false,
              lineStarts: [0, 4],
            },
          ],
          content: {
            nodes: [
              SENTINEL_CONTENT,
              {
                bufferIndex: 0,
                color: Color.Red,
                end: { column: 1, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                parent: 2,
                right: SENTINEL_INDEX,
                start: { column: 0, line: 0 },
              },
              {
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 2, line: 1 },
                left: 1,
                leftCharCount: 5,
                leftLineFeedCount: 1,
                length: 1,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: 3,
                start: { column: 1, line: 1 },
              },
              {
                bufferIndex: 0,
                color: Color.Red,
                end: { column: 5, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 1,
                lineFeedCount: 0,
                parent: 2,
                right: SENTINEL_INDEX,
                start: { column: 4, line: 1 },
              },
            ],
            root: 2,
          },
          previouslyInsertedContentNodeIndex: null,
          previouslyInsertedContentNodeOffset: null,
          structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
        };
        deleteContent(page, {
          endOffset: 8,
          startOffset: 6,
        });
        expect(page).toStrictEqual(expectedPage);
      });

      test("Scenario 1d: Test 7", (): void => {
        const page: PageContent = {
          buffers: [
            {
              content: "abc\ndefgh",
              isReadOnly: false,
              lineStarts: [0, 4],
            },
          ],
          content: {
            nodes: [
              SENTINEL_CONTENT,
              {
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 1, line: 1 },
                left: 2,
                leftCharCount: 4,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 0, line: 0 },
              },
              {
                bufferIndex: 0,
                color: Color.Red,
                end: { column: 5, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 4,
                lineFeedCount: 0,
                parent: 1,
                right: SENTINEL_INDEX,
                start: { column: 1, line: 1 },
              },
            ],
            root: 1,
          },
          previouslyInsertedContentNodeIndex: null,
          previouslyInsertedContentNodeOffset: null,
          structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
        };
        const expectedPage: PageContent = {
          buffers: [
            {
              content: "abc\ndefgh",
              isReadOnly: false,
              lineStarts: [0, 4],
            },
          ],
          content: {
            nodes: [
              SENTINEL_CONTENT,
              {
                bufferIndex: 0,
                color: Color.Red,
                end: { column: 1, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 1,
                parent: 3,
                right: SENTINEL_INDEX,
                start: { column: 0, line: 0 },
              },
              {
                bufferIndex: 0,
                color: Color.Red,
                end: { column: 2, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 1,
                lineFeedCount: 0,
                parent: 3,
                right: SENTINEL_INDEX,
                start: { column: 1, line: 1 },
              },
              {
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 5, line: 1 },
                left: 2,
                leftCharCount: 1,
                leftLineFeedCount: 0,
                length: 1,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: 1,
                start: { column: 4, line: 1 },
              },
            ],
            root: 3,
          },
          previouslyInsertedContentNodeIndex: null,
          previouslyInsertedContentNodeOffset: null,
          structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
        };
        deleteContent(page, {
          endOffset: 3,
          startOffset: 1,
        });
        expect(page).toStrictEqual(expectedPage);
      });
    });
  });

  describe("Scenario 2", (): void => {
    describe("Scenario 2a: delete from the start of a node to the end of another node", (): void => {
      test("Scenario 2a: Test 1", (): void => {
        const page = getStartPage();
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
                parent: 10,
                right: SENTINEL_INDEX,
                start: { column: 0, line: 0 },
              },
              {
                // 3
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 41, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 14,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 27, line: 1 },
              },
              {
                // 4
                bufferIndex: 1,
                color: Color.Black,
                end: { column: 4, line: 0 },
                left: SENTINEL_INDEX,
                leftCharCount: 66,
                leftLineFeedCount: 1,
                length: 3,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
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
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 45, line: 1 },
              },
              {
                // 6
                bufferIndex: 1,
                color: Color.Black,
                end: { column: 6, line: 0 },
                left: SENTINEL_INDEX,
                leftCharCount: 66,
                leftLineFeedCount: 1,
                length: 2,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 4, line: 0 },
              },
              {
                // 7
                bufferIndex: 1,
                color: Color.Black,
                end: { column: 46, line: 0 },
                left: SENTINEL_INDEX,
                leftCharCount: 66,
                leftLineFeedCount: 1,
                length: 1,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 45, line: 0 },
              },
              {
                // 8
                bufferIndex: 1,
                color: Color.Black,
                end: { column: 12, line: 0 },
                left: SENTINEL_INDEX,
                leftCharCount: 66,
                leftLineFeedCount: 1,
                length: 5,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 7, line: 0 },
              },
              {
                // 9
                bufferIndex: 1,
                color: Color.Black,
                end: { column: 47, line: 0 },
                left: SENTINEL_INDEX,
                leftCharCount: 66,
                leftLineFeedCount: 1,
                length: 1,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 46, line: 0 },
              },
              {
                // 10
                bufferIndex: 1,
                color: Color.Black,
                end: { column: 45, line: 0 },
                left: 2,
                leftCharCount: 66,
                leftLineFeedCount: 1,
                length: 32,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
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
                right: SENTINEL_INDEX,
                start: { column: 47, line: 0 },
              },
            ],
            root: 10,
          },
          previouslyInsertedContentNodeIndex: null,
          previouslyInsertedContentNodeOffset: null,
          structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
        };
        deleteContent(page, {
          endOffset: 94,
          startOffset: 66,
        });
        expect(page).toStrictEqual(expectedPage);
      });

      test("Scenario 2a: Test 2", (): void => {
        const page = getStartPage();
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
                color: Color.Black,
                end: { column: 26, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 65,
                lineFeedCount: 1,
                parent: 10,
                right: SENTINEL_INDEX,
                start: { column: 0, line: 0 },
              },
              {
                // 2
                bufferIndex: 1,
                color: Color.Black,
                end: { column: 1, line: 0 },
                left: SENTINEL_INDEX,
                leftCharCount: 65,
                leftLineFeedCount: 1,
                length: 1,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 0, line: 0 },
              },
              {
                // 3
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 41, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 65,
                leftLineFeedCount: 1,
                length: 14,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 27, line: 1 },
              },
              {
                // 4
                bufferIndex: 1,
                color: Color.Black,
                end: { column: 4, line: 0 },
                left: SENTINEL_INDEX,
                leftCharCount: 65,
                leftLineFeedCount: 1,
                length: 3,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 1, line: 0 },
              },
              {
                // 5
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 47, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 65,
                leftLineFeedCount: 1,
                length: 2,
                lineFeedCount: 1,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 45, line: 1 },
              },
              {
                // 6
                bufferIndex: 1,
                color: Color.Black,
                end: { column: 6, line: 0 },
                left: SENTINEL_INDEX,
                leftCharCount: 65,
                leftLineFeedCount: 1,
                length: 2,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 4, line: 0 },
              },
              {
                // 7
                bufferIndex: 1,
                color: Color.Black,
                end: { column: 46, line: 0 },
                left: SENTINEL_INDEX,
                leftCharCount: 65,
                leftLineFeedCount: 1,
                length: 1,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 45, line: 0 },
              },
              {
                // 8
                bufferIndex: 1,
                color: Color.Black,
                end: { column: 12, line: 0 },
                left: SENTINEL_INDEX,
                leftCharCount: 65,
                leftLineFeedCount: 1,
                length: 5,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 7, line: 0 },
              },
              {
                // 9
                bufferIndex: 1,
                color: Color.Black,
                end: { column: 47, line: 0 },
                left: SENTINEL_INDEX,
                leftCharCount: 65,
                leftLineFeedCount: 1,
                length: 1,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 46, line: 0 },
              },
              {
                // 10
                bufferIndex: 1,
                color: Color.Black,
                end: { column: 45, line: 0 },
                left: 1,
                leftCharCount: 65,
                leftLineFeedCount: 1,
                length: 32,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
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
                right: SENTINEL_INDEX,
                start: { column: 47, line: 0 },
              },
            ],
            root: 10,
          },
          previouslyInsertedContentNodeIndex: null,
          previouslyInsertedContentNodeOffset: null,
          structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
        };
        deleteContent(page, {
          endOffset: 94,
          startOffset: 65,
        });
        expect(page).toStrictEqual(expectedPage);
      });

      test("Scenario 2a: Test 3", (): void => {
        const page = getStartPage();
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
                color: Color.Black,
                end: { column: 26, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 65,
                lineFeedCount: 1,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 0, line: 0 },
              },
              {
                // 2
                bufferIndex: 1,
                color: Color.Black,
                end: { column: 1, line: 0 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 1,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 0, line: 0 },
              },
              {
                // 3
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 41, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 14,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 27, line: 1 },
              },
              {
                // 4
                bufferIndex: 1,
                color: Color.Black,
                end: { column: 4, line: 0 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 3,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
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
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 45, line: 1 },
              },
              {
                // 6
                bufferIndex: 1,
                color: Color.Black,
                end: { column: 6, line: 0 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
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
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 45, line: 0 },
              },
              {
                // 8
                bufferIndex: 1,
                color: Color.Black,
                end: { column: 12, line: 0 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
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
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 46, line: 0 },
              },
              {
                // 10
                bufferIndex: 1,
                color: Color.Black,
                end: { column: 45, line: 0 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 32,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
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
            root: 10,
          },
          previouslyInsertedContentNodeIndex: null,
          previouslyInsertedContentNodeOffset: null,
          structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
        };
        deleteContent(page, {
          endOffset: 94,
          startOffset: 0,
        });
        expect(page).toStrictEqual(expectedPage);
      });

      test("Scenario 2a: Test 4", (): void => {
        const page = getStartPage();
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
                color: Color.Black,
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
                color: Color.Red,
                end: { column: 1, line: 0 },
                left: 1,
                leftCharCount: 65,
                leftLineFeedCount: 1,
                length: 1,
                lineFeedCount: 0,
                parent: 8,
                right: 4,
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
                parent: 4,
                right: SENTINEL_INDEX,
                start: { column: 27, line: 1 },
              },
              {
                // 4
                bufferIndex: 1,
                color: Color.Black,
                end: { column: 4, line: 0 },
                left: 3,
                leftCharCount: 14,
                leftLineFeedCount: 0,
                length: 3,
                lineFeedCount: 0,
                parent: 2,
                right: SENTINEL_INDEX,
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
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 45, line: 1 },
              },
              {
                // 6
                bufferIndex: 1,
                color: Color.Black,
                end: { column: 6, line: 0 },
                left: SENTINEL_INDEX,
                leftCharCount: 83,
                leftLineFeedCount: 1,
                length: 2,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 4, line: 0 },
              },
              {
                // 7
                bufferIndex: 1,
                color: Color.Black,
                end: { column: 46, line: 0 },
                left: SENTINEL_INDEX,
                leftCharCount: 83,
                leftLineFeedCount: 1,
                length: 1,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 45, line: 0 },
              },
              {
                // 8
                bufferIndex: 1,
                color: Color.Black,
                end: { column: 12, line: 0 },
                left: 2,
                leftCharCount: 83,
                leftLineFeedCount: 1,
                length: 5,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
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
                right: SENTINEL_INDEX,
                start: { column: 47, line: 0 },
              },
            ],
            root: 8,
          },
          previouslyInsertedContentNodeIndex: null,
          previouslyInsertedContentNodeOffset: null,
          structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
        };
        deleteContent(page, {
          endOffset: 88,
          startOffset: 83,
        });
        expect(page).toStrictEqual(expectedPage);
      });

      test("Scenario 2a: Test 5", (): void => {
        const page = getStartPage();
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
                color: Color.Black,
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
                parent: SENTINEL_INDEX,
                right: 4,
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
                parent: 4,
                right: SENTINEL_INDEX,
                start: { column: 27, line: 1 },
              },
              {
                // 4
                bufferIndex: 1,
                color: Color.Black,
                end: { column: 4, line: 0 },
                left: 3,
                leftCharCount: 14,
                leftLineFeedCount: 0,
                length: 3,
                lineFeedCount: 0,
                parent: 2,
                right: SENTINEL_INDEX,
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
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 45, line: 1 },
              },
              {
                // 6
                bufferIndex: 1,
                color: Color.Black,
                end: { column: 6, line: 0 },
                left: SENTINEL_INDEX,
                leftCharCount: 83,
                leftLineFeedCount: 1,
                length: 2,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 4, line: 0 },
              },
              {
                // 7
                bufferIndex: 1,
                color: Color.Black,
                end: { column: 46, line: 0 },
                left: SENTINEL_INDEX,
                leftCharCount: 83,
                leftLineFeedCount: 1,
                length: 1,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 45, line: 0 },
              },
              {
                // 8
                bufferIndex: 1,
                color: Color.Black,
                end: { column: 12, line: 0 },
                left: SENTINEL_INDEX,
                leftCharCount: 83,
                leftLineFeedCount: 1,
                length: 5,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 7, line: 0 },
              },
              {
                // 9
                bufferIndex: 1,
                color: Color.Black,
                end: { column: 47, line: 0 },
                left: SENTINEL_INDEX,
                leftCharCount: 83,
                leftLineFeedCount: 1,
                length: 1,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 46, line: 0 },
              },
              {
                // 10
                bufferIndex: 1,
                color: Color.Black,
                end: { column: 45, line: 0 },
                left: SENTINEL_INDEX,
                leftCharCount: 83,
                leftLineFeedCount: 1,
                length: 32,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
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
            root: 2,
          },
          previouslyInsertedContentNodeIndex: null,
          previouslyInsertedContentNodeOffset: null,
          structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
        };
        deleteContent(page, {
          endOffset: 127,
          startOffset: 83,
        });
        expect(page).toStrictEqual(expectedPage);
      });

      test("Scenario 2a: Test 6", (): void => {
        const page = getStartPage();
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
                color: Color.Red,
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
                right: SENTINEL_INDEX,
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
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 46, line: 0 },
              },
              {
                // 10
                bufferIndex: 1,
                color: Color.Black,
                end: { column: 45, line: 0 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 32,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
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
        deleteContent(page, {
          endOffset: 127,
          startOffset: 93,
        });
        expect(page).toStrictEqual(expectedPage);
      });

      test("Scenario 2a: Test 7", (): void => {
        const page = getStartPage();
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
                color: Color.Black,
                end: { column: 26, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 65,
                lineFeedCount: 1,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 0, line: 0 },
              },
              {
                // 2
                bufferIndex: 1,
                color: Color.Black,
                end: { column: 1, line: 0 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 1,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 0, line: 0 },
              },
              {
                // 3
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 41, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 14,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 27, line: 1 },
              },
              {
                // 4
                bufferIndex: 1,
                color: Color.Black,
                end: { column: 4, line: 0 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 3,
                lineFeedCount: 0,
                parent: 6,
                right: 5,
                start: { column: 1, line: 0 },
              },
              {
                // 5
                bufferIndex: 0,
                color: Color.Red,
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
                leftCharCount: 5,
                leftLineFeedCount: 1,
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
        };
        deleteContent(page, {
          endOffset: 80,
          startOffset: 0,
        });
        expect(page).toStrictEqual(expectedPage);
      });

      test("Scenario 2a: Test 8", (): void => {
        const page = getStartPage();
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
                color: Color.Black,
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
                color: Color.Red,
                end: { column: 1, line: 0 },
                left: 1,
                leftCharCount: 65,
                leftLineFeedCount: 1,
                length: 1,
                lineFeedCount: 0,
                parent: 6,
                right: 3,
                start: { column: 0, line: 0 },
              },
              {
                // 3
                bufferIndex: 0,
                color: Color.Black,
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
                left: SENTINEL_INDEX,
                leftCharCount: 80,
                leftLineFeedCount: 1,
                length: 3,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 1, line: 0 },
              },
              {
                // 5
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 47, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 14,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 1,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 45, line: 1 },
              },
              {
                // 6
                bufferIndex: 1,
                color: Color.Black,
                end: { column: 6, line: 0 },
                left: 2,
                leftCharCount: 80,
                leftLineFeedCount: 1,
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
        };
        deleteContent(page, {
          endOffset: 85,
          startOffset: 80,
        });
        expect(page).toStrictEqual(expectedPage);
      });
    });

    describe("Scenario 2b: delete from the start of a node to a point in another node", (): void => {
      test("Scenario 2b: Test 1", (): void => {
        const page = getStartPage();
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
                parent: 8,
                right: SENTINEL_INDEX,
                start: { column: 0, line: 0 },
              },
              {
                // 3
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 41, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 14,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 27, line: 1 },
              },
              {
                // 4
                bufferIndex: 1,
                color: Color.Black,
                end: { column: 4, line: 0 },
                left: SENTINEL_INDEX,
                leftCharCount: 66,
                leftLineFeedCount: 1,
                length: 3,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
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
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 45, line: 1 },
              },
              {
                // 6
                bufferIndex: 1,
                color: Color.Black,
                end: { column: 6, line: 0 },
                left: SENTINEL_INDEX,
                leftCharCount: 66,
                leftLineFeedCount: 1,
                length: 2,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 4, line: 0 },
              },
              {
                // 7
                bufferIndex: 1,
                color: Color.Black,
                end: { column: 46, line: 0 },
                left: SENTINEL_INDEX,
                leftCharCount: 66,
                leftLineFeedCount: 1,
                length: 1,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 45, line: 0 },
              },
              {
                // 8
                bufferIndex: 1,
                color: Color.Black,
                end: { column: 12, line: 0 },
                left: 2,
                leftCharCount: 66,
                leftLineFeedCount: 1,
                length: 3,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: 10,
                start: { column: 9, line: 0 },
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
                right: SENTINEL_INDEX,
                start: { column: 47, line: 0 },
              },
            ],
            root: 8,
          },
          previouslyInsertedContentNodeIndex: null,
          previouslyInsertedContentNodeOffset: null,
          structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
        };
        deleteContent(page, {
          endOffset: 90,
          startOffset: 66,
        });
        expect(page).toStrictEqual(expectedPage);
      });

      test("Scenario 2b: Test 2", (): void => {
        const page = getStartPage();
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
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 26, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 65,
                lineFeedCount: 1,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 0, line: 0 },
              },
              {
                bufferIndex: 1,
                color: Color.Black,
                end: { column: 1, line: 0 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 1,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 0, line: 0 },
              },
              {
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 41, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 14,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 27, line: 1 },
              },
              {
                bufferIndex: 1,
                color: Color.Black,
                end: { column: 4, line: 0 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 3,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
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
                length: 1,
                lineFeedCount: 1,
                parent: 6,
                right: SENTINEL_INDEX,
                start: { column: 46, line: 1 },
              },
              {
                // 6
                bufferIndex: 1,
                color: Color.Black,
                end: { column: 6, line: 0 },
                left: 5,
                leftCharCount: 1,
                leftLineFeedCount: 1,
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
        };
        deleteContent(page, {
          endOffset: 84,
          startOffset: 0,
        });
        expect(page).toStrictEqual(expectedPage);
      });

      test("Scenario 2b: Test 3", (): void => {
        const page = getStartPage();
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
                parent: 3,
                right: SENTINEL_INDEX,
                start: { column: 0, line: 0 },
              },
              {
                // 2
                bufferIndex: 1,
                color: Color.Black,
                end: { column: 1, line: 0 },
                left: SENTINEL_INDEX,
                leftCharCount: 65,
                leftLineFeedCount: 1,
                length: 1,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 0, line: 0 },
              },
              {
                // 3
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 41, line: 1 },
                left: 1,
                leftCharCount: 65,
                leftLineFeedCount: 1,
                length: 10,
                lineFeedCount: 0,
                parent: 4,
                right: SENTINEL_INDEX,
                start: { column: 31, line: 1 },
              },
              {
                // 4
                bufferIndex: 1,
                color: Color.Red,
                end: { column: 4, line: 0 },
                left: 3,
                leftCharCount: 75,
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
                leftCharCount: 80,
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
        };
        deleteContent(page, {
          endOffset: 70,
          startOffset: 65,
        });
        expect(page).toStrictEqual(expectedPage);
      });

      test("Scenario 2b: Test 4", (): void => {
        const page = getStartPage();
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
                right: 10,
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
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 45, line: 0 },
              },
              {
                // 8
                bufferIndex: 1,
                color: Color.Black,
                end: { column: 12, line: 0 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 3,
                lineFeedCount: 0,
                parent: 10,
                right: 9,
                start: { column: 9, line: 0 },
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
                parent: 8,
                right: SENTINEL_INDEX,
                start: { column: 46, line: 0 },
              },
              {
                // 10
                bufferIndex: 1,
                color: Color.Red,
                end: { column: 45, line: 0 },
                left: 8,
                leftCharCount: 4,
                leftLineFeedCount: 0,
                length: 32,
                lineFeedCount: 0,
                parent: 6,
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
        deleteContent(page, {
          endOffset: 90,
          startOffset: 87,
        });
        expect(page).toStrictEqual(expectedPage);
      });
    });

    describe("Scenario 2c: delete from a point in a node to the end of another node", (): void => {
      test("Scenario 2c: Test 1", (): void => {
        const page = getStartPage();
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
                end: { column: 31, line: 0 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 31,
                lineFeedCount: 0,
                parent: 3,
                right: SENTINEL_INDEX,
                start: { column: 0, line: 0 },
              },
              {
                // 2
                bufferIndex: 1,
                color: Color.Black,
                end: { column: 1, line: 0 },
                left: SENTINEL_INDEX,
                leftCharCount: 31,
                leftLineFeedCount: 0,
                length: 1,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 0, line: 0 },
              },
              {
                // 3
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 41, line: 1 },
                left: 1,
                leftCharCount: 31,
                leftLineFeedCount: 0,
                length: 14,
                lineFeedCount: 0,
                parent: 4,
                right: SENTINEL_INDEX,
                start: { column: 27, line: 1 },
              },
              {
                // 4
                bufferIndex: 1,
                color: Color.Red,
                end: { column: 4, line: 0 },
                left: 3,
                leftCharCount: 45,
                leftLineFeedCount: 0,
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
                leftCharCount: 50,
                leftLineFeedCount: 1,
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
        };
        deleteContent(page, {
          endOffset: 66,
          startOffset: 31,
        });
        expect(page).toStrictEqual(expectedPage);
      });

      test("Scenario 2c: Test 2", (): void => {
        const page = getStartPage();
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
                color: Color.Black,
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
                color: Color.Red,
                end: { column: 1, line: 0 },
                left: 1,
                leftCharCount: 65,
                leftLineFeedCount: 1,
                length: 1,
                lineFeedCount: 0,
                parent: 6,
                right: 4,
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
                parent: 4,
                right: SENTINEL_INDEX,
                start: { column: 27, line: 1 },
              },
              {
                // 4
                bufferIndex: 1,
                color: Color.Black,
                end: { column: 2, line: 0 },
                left: 3,
                leftCharCount: 14,
                leftLineFeedCount: 0,
                length: 1,
                lineFeedCount: 0,
                parent: 2,
                right: SENTINEL_INDEX,
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
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 45, line: 1 },
              },
              {
                // 6
                bufferIndex: 1,
                color: Color.Black,
                end: { column: 6, line: 0 },
                left: 2,
                leftCharCount: 81,
                leftLineFeedCount: 1,
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
        };
        deleteContent(page, {
          endOffset: 85,
          startOffset: 81,
        });
        expect(page).toStrictEqual(expectedPage);
      });

      test("Scenario 2c: Test 3", (): void => {
        const page = getStartPage();
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
                parent: 7,
                right: 5,
                start: { column: 1, line: 0 },
              },
              {
                // 5
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 46, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 1,
                lineFeedCount: 0,
                parent: 4,
                right: SENTINEL_INDEX,
                start: { column: 45, line: 1 },
              },
              {
                // 6
                bufferIndex: 1,
                color: Color.Black,
                end: { column: 6, line: 0 },
                left: SENTINEL_INDEX,
                leftCharCount: 84,
                leftLineFeedCount: 1,
                length: 2,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 4, line: 0 },
              },
              {
                // 7
                bufferIndex: 1,
                color: Color.Black,
                end: { column: 46, line: 0 },
                left: 4,
                leftCharCount: 84,
                leftLineFeedCount: 1,
                length: 1,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: 10,
                start: { column: 45, line: 0 },
              },
              {
                // 8
                bufferIndex: 1,
                color: Color.Black,
                end: { column: 12, line: 0 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 5,
                lineFeedCount: 0,
                parent: 10,
                right: 9,
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
                parent: 8,
                right: SENTINEL_INDEX,
                start: { column: 46, line: 0 },
              },
              {
                // 10
                bufferIndex: 1,
                color: Color.Red,
                end: { column: 45, line: 0 },
                left: 8,
                leftCharCount: 6,
                leftLineFeedCount: 0,
                length: 32,
                lineFeedCount: 0,
                parent: 7,
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
                right: SENTINEL_INDEX,
                start: { column: 47, line: 0 },
              },
            ],
            root: 7,
          },
          previouslyInsertedContentNodeIndex: null,
          previouslyInsertedContentNodeOffset: null,
          structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
        };
        deleteContent(page, {
          endOffset: 87,
          startOffset: 84,
        });
        expect(page).toStrictEqual(expectedPage);
      });

      test("Scenario 2c: Test 4", (): void => {
        const page = getStartPage();
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
                end: { column: 39, line: 0 },
                left: 9,
                leftCharCount: 1,
                leftLineFeedCount: 0,
                length: 26,
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
        deleteContent(page, {
          endOffset: 127,
          startOffset: 120,
        });
        expect(page).toStrictEqual(expectedPage);
      });

      test("Scenario 2c: Test 5", (): void => {
        const page = getStartPage();
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
                color: Color.Red,
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
                end: { column: 9, line: 0 },
                left: 7,
                leftCharCount: 1,
                leftLineFeedCount: 0,
                length: 2,
                lineFeedCount: 0,
                parent: 6,
                right: SENTINEL_INDEX,
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
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 46, line: 0 },
              },
              {
                // 10
                bufferIndex: 1,
                color: Color.Black,
                end: { column: 45, line: 0 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 32,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
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
        deleteContent(page, {
          endOffset: 127,
          startOffset: 90,
        });
        expect(page).toStrictEqual(expectedPage);
      });

      test("Scenario 2c: Test 6", (): void => {
        const page = getStartPage();
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
                color: Color.Black,
                end: { column: 21, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 60,
                lineFeedCount: 1,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 0, line: 0 },
              },
              {
                // 2
                bufferIndex: 1,
                color: Color.Black,
                end: { column: 1, line: 0 },
                left: SENTINEL_INDEX,
                leftCharCount: 65,
                leftLineFeedCount: 1,
                length: 1,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 0, line: 0 },
              },
              {
                // 3
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 41, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 65,
                leftLineFeedCount: 1,
                length: 14,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 27, line: 1 },
              },
              {
                // 4
                bufferIndex: 1,
                color: Color.Black,
                end: { column: 4, line: 0 },
                left: SENTINEL_INDEX,
                leftCharCount: 60,
                leftLineFeedCount: 1,
                length: 3,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 1, line: 0 },
              },
              {
                // 5
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 47, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 60,
                leftLineFeedCount: 1,
                length: 2,
                lineFeedCount: 1,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 45, line: 1 },
              },
              {
                // 6
                bufferIndex: 1,
                color: Color.Black,
                end: { column: 6, line: 0 },
                left: SENTINEL_INDEX,
                leftCharCount: 60,
                leftLineFeedCount: 1,
                length: 2,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 4, line: 0 },
              },
              {
                // 7
                bufferIndex: 1,
                color: Color.Black,
                end: { column: 46, line: 0 },
                left: SENTINEL_INDEX,
                leftCharCount: 60,
                leftLineFeedCount: 1,
                length: 1,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 45, line: 0 },
              },
              {
                // 8
                bufferIndex: 1,
                color: Color.Black,
                end: { column: 12, line: 0 },
                left: SENTINEL_INDEX,
                leftCharCount: 60,
                leftLineFeedCount: 1,
                length: 5,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 7, line: 0 },
              },
              {
                // 9
                bufferIndex: 1,
                color: Color.Black,
                end: { column: 47, line: 0 },
                left: SENTINEL_INDEX,
                leftCharCount: 60,
                leftLineFeedCount: 1,
                length: 1,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 46, line: 0 },
              },
              {
                // 10
                bufferIndex: 1,
                color: Color.Black,
                end: { column: 45, line: 0 },
                left: SENTINEL_INDEX,
                leftCharCount: 60,
                leftLineFeedCount: 1,
                length: 32,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
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
            root: 1,
          },
          previouslyInsertedContentNodeIndex: null,
          previouslyInsertedContentNodeOffset: null,
          structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
        };
        deleteContent(page, {
          endOffset: 127,
          startOffset: 60,
        });
        expect(page).toStrictEqual(expectedPage);
      });
    });

    describe("Scenario 2d: delete from a point in a node to a point in another node", (): void => {
      test("Scenario 2d: Test 1", (): void => {
        const page = getStartPage();
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
                end: { column: 21, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 60,
                lineFeedCount: 1,
                parent: 3,
                right: SENTINEL_INDEX,
                start: { column: 0, line: 0 },
              },
              {
                // 2
                bufferIndex: 1,
                color: Color.Black,
                end: { column: 1, line: 0 },
                left: SENTINEL_INDEX,
                leftCharCount: 60,
                leftLineFeedCount: 1,
                length: 1,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 0, line: 0 },
              },
              {
                // 3
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 41, line: 1 },
                left: 1,
                leftCharCount: 60,
                leftLineFeedCount: 1,
                length: 10,
                lineFeedCount: 0,
                parent: 4,
                right: SENTINEL_INDEX,
                start: { column: 31, line: 1 },
              },
              {
                // 4
                bufferIndex: 1,
                color: Color.Red,
                end: { column: 4, line: 0 },
                left: 3,
                leftCharCount: 70,
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
                leftCharCount: 75,
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
        };
        deleteContent(page, {
          endOffset: 70,
          startOffset: 60,
        });
        expect(page).toStrictEqual(expectedPage);
      });

      test("Scenario 2d: Test 2", (): void => {
        const page = getStartPage();
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
                end: { column: 30, line: 0 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 30,
                lineFeedCount: 0,
                parent: 3,
                right: SENTINEL_INDEX,
                start: { column: 0, line: 0 },
              },
              {
                // 2
                bufferIndex: 1,
                color: Color.Black,
                end: { column: 1, line: 0 },
                left: SENTINEL_INDEX,
                leftCharCount: 30,
                leftLineFeedCount: 0,
                length: 1,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 0, line: 0 },
              },
              {
                // 3
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 41, line: 1 },
                left: 1,
                leftCharCount: 30,
                leftLineFeedCount: 0,
                length: 10,
                lineFeedCount: 0,
                parent: 4,
                right: SENTINEL_INDEX,
                start: { column: 31, line: 1 },
              },
              {
                // 4
                bufferIndex: 1,
                color: Color.Red,
                end: { column: 4, line: 0 },
                left: 3,
                leftCharCount: 40,
                leftLineFeedCount: 0,
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
                leftCharCount: 45,
                leftLineFeedCount: 1,
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
        };
        deleteContent(page, {
          endOffset: 70,
          startOffset: 30,
        });
        expect(page).toStrictEqual(expectedPage);
      });

      test("Scenario 2d: Test 3", (): void => {
        const page = getStartPage();
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
                parent: 8,
                right: 5,
                start: { column: 1, line: 0 },
              },
              {
                // 5
                bufferIndex: 0,
                color: Color.Black,
                end: { column: 46, line: 1 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 1,
                lineFeedCount: 0,
                parent: 4,
                right: SENTINEL_INDEX,
                start: { column: 45, line: 1 },
              },
              {
                // 6
                bufferIndex: 1,
                color: Color.Black,
                end: { column: 6, line: 0 },
                left: SENTINEL_INDEX,
                leftCharCount: 84,
                leftLineFeedCount: 1,
                length: 2,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 4, line: 0 },
              },
              {
                // 7
                bufferIndex: 1,
                color: Color.Black,
                end: { column: 46, line: 0 },
                left: SENTINEL_INDEX,
                leftCharCount: 84,
                leftLineFeedCount: 1,
                length: 1,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 45, line: 0 },
              },
              {
                // 8
                bufferIndex: 1,
                color: Color.Black,
                end: { column: 12, line: 0 },
                left: 4,
                leftCharCount: 84,
                leftLineFeedCount: 1,
                length: 4,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: 10,
                start: { column: 8, line: 0 },
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
                right: SENTINEL_INDEX,
                start: { column: 47, line: 0 },
              },
            ],
            root: 8,
          },
          previouslyInsertedContentNodeIndex: null,
          previouslyInsertedContentNodeOffset: null,
          structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
        };
        deleteContent(page, {
          endOffset: 89,
          startOffset: 84,
        });
        expect(page).toStrictEqual(expectedPage);
      });

      test("Scenario 2d: Test 4", (): void => {
        const page = getStartPage();
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
                color: Color.Black,
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
                color: Color.Red,
                end: { column: 1, line: 0 },
                left: 1,
                leftCharCount: 65,
                leftLineFeedCount: 1,
                length: 1,
                lineFeedCount: 0,
                parent: 6,
                right: 4,
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
                parent: 4,
                right: SENTINEL_INDEX,
                start: { column: 27, line: 1 },
              },
              {
                // 4
                bufferIndex: 1,
                color: Color.Black,
                end: { column: 2, line: 0 },
                left: 3,
                leftCharCount: 14,
                leftLineFeedCount: 0,
                length: 1,
                lineFeedCount: 0,
                parent: 2,
                right: SENTINEL_INDEX,
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
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 45, line: 1 },
              },
              {
                // 6
                bufferIndex: 1,
                color: Color.Black,
                end: { column: 6, line: 0 },
                left: 2,
                leftCharCount: 81,
                leftLineFeedCount: 1,
                length: 1,
                lineFeedCount: 0,
                parent: SENTINEL_INDEX,
                right: 8,
                start: { column: 5, line: 0 },
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
        };
        deleteContent(page, {
          endOffset: 86,
          startOffset: 81,
        });
        expect(page).toStrictEqual(expectedPage);
      });

      test("Scenario 2d: Test 5", (): void => {
        const page = getStartPage();
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
                end: { column: 8, line: 0 },
                left: 7,
                leftCharCount: 1,
                leftLineFeedCount: 0,
                length: 1,
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
                parent: SENTINEL_INDEX,
                right: SENTINEL_INDEX,
                start: { column: 46, line: 0 },
              },
              {
                // 10
                bufferIndex: 1,
                color: Color.Black,
                end: { column: 45, line: 0 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 26,
                lineFeedCount: 0,
                parent: 8,
                right: 11,
                start: { column: 19, line: 0 },
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
        };
        deleteContent(page, {
          endOffset: 100,
          startOffset: 89,
        });
        expect(page).toStrictEqual(expectedPage);
      });
    });
  });
});
