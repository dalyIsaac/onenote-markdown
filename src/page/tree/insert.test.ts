import { Color, INode, IPageContent, NEWLINE } from "../model";
import { SENTINEL_INDEX } from "../reducer";
import {
  calculateCharCount,
  calculateLineFeedCount,
  fixInsert,
  IContentInsert,
  insertContent,
  recomputeTreeMetadata,
} from "./insert";
import { MAX_BUFFER_LENGTH } from "./tree";

describe("page/tree/insert", () => {
  describe("insert functions", () => {
    const getScenarioOneInitialPage = (): IPageContent => ({
      buffers: [
        {
          isReadOnly: false,
          lineStarts: [0],
          content: "a",
        },
      ],
      newlineFormat: NEWLINE.LF,
      nodes: [
        {
          bufferIndex: 0,
          start: {
            line: 0,
            column: 0,
          },
          end: {
            line: 0,
            column: 1,
          },
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
      root: 0,
      previouslyInsertedNodeIndex: 0,
      previouslyInsertedNodeOffset: 0,
    });

    test("Scenario 1: insert at the end of the previously inserted node", () => {
      const expectedPage = getScenarioOneInitialPage();
      expectedPage.buffers[0].content += "b";
      expectedPage.nodes[0] = {
        ...expectedPage.nodes[0],
        end: {
          line: 0,
          column: 2,
        },
        length: 2,
        color: Color.Black,
      };
      const page = getScenarioOneInitialPage();
      const content: IContentInsert = {
        content: "b",
        offset: 1,
      };
      const receivedPage = insertContent(content, page, MAX_BUFFER_LENGTH);
      expect(receivedPage).toEqual(expectedPage);
    });

    const getScenarioTwoInitialPage = (): IPageContent => ({
      buffers: [
        {
          isReadOnly: false,
          lineStarts: [0, 4],
          content: "abc\nd",
        },
      ],
      newlineFormat: NEWLINE.LF,
      nodes: [
        {
          bufferIndex: 0,
          start: {
            line: 0,
            column: 0,
          },
          end: {
            line: 1,
            column: 1,
          },
          leftCharCount: 0,
          leftLineFeedCount: 0,
          length: 5,
          lineFeedCount: 1,
          color: Color.Black,
          parent: SENTINEL_INDEX,
          left: SENTINEL_INDEX,
          right: SENTINEL_INDEX,
        },
      ],
      root: 0,
      previouslyInsertedNodeIndex: 0,
      previouslyInsertedNodeOffset: 0,
    });

    test("Scenario 2: insert at the end of the previously inserted node", () => {
      const expectedPage = getScenarioTwoInitialPage();
      expectedPage.buffers.push({
        isReadOnly: false,
        lineStarts: [0],
        content: "ef",
      });
      expectedPage.nodes[0].right = 1;
      expectedPage.nodes.push({
        bufferIndex: 1,
        start: {
          line: 0,
          column: 0,
        },
        end: {
          line: 0,
          column: 2,
        },
        leftCharCount: 0,
        leftLineFeedCount: 0,
        lineFeedCount: 0,
        length: 2,
        color: Color.Red,
        parent: 0,
        left: SENTINEL_INDEX,
        right: SENTINEL_INDEX,
      });
      const page = getScenarioTwoInitialPage();
      const content: IContentInsert = {
        content: "ef",
        offset: 5,
      };
      const maxBufferLength = 5;
      const receivedPage = insertContent(content, page, maxBufferLength);
      expect(receivedPage).toEqual(expectedPage);
    });

    test("Scenario 3: insert at the end of a node (test 1)", () => {
      const getPage = (): IPageContent => ({
        buffers: [
          {
            isReadOnly: true,
            lineStarts: [0, 4],
            content: "abc\nd",
          },
          {
            isReadOnly: false,
            lineStarts: [0],
            content: "efgh",
          },
        ],
        nodes: [
          {
            bufferIndex: 0,
            start: {
              line: 0,
              column: 0,
            },
            end: {
              line: 1,
              column: 1,
            },
            leftCharCount: 2,
            leftLineFeedCount: 0,
            length: 5,
            lineFeedCount: 1,
            color: Color.Black,
            parent: SENTINEL_INDEX,
            left: 1,
            right: 2,
          },
          {
            bufferIndex: 1,
            start: { line: 0, column: 0 },
            end: { line: 0, column: 2 },
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 2,
            lineFeedCount: 0,
            color: Color.Red,
            parent: 0,
            left: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
          },
          {
            bufferIndex: 1,
            start: { line: 0, column: 2 },
            end: { line: 0, column: 4 },
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 2,
            lineFeedCount: 1,
            color: Color.Red,
            parent: 0,
            left: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
          },
        ],
        newlineFormat: NEWLINE.LF,
        root: 0,
        previouslyInsertedNodeIndex: 2,
        previouslyInsertedNodeOffset: 5,
      });
      const page = getPage();
      const expectedPage = getPage();
      expectedPage.buffers[1].content += "ij\nk";
      expectedPage.buffers[1].lineStarts.push(7);
      expectedPage.nodes[0].leftCharCount = 6;
      expectedPage.nodes[0].leftLineFeedCount = 1;
      expectedPage.nodes.push({
        bufferIndex: 1,
        start: { line: 0, column: 2 },
        end: { line: 1, column: 1 },
        leftCharCount: 0,
        leftLineFeedCount: 0,
        length: 4,
        lineFeedCount: 1,
        color: Color.Red,
        parent: 1,
        left: SENTINEL_INDEX,
        right: SENTINEL_INDEX,
      });
      expectedPage.nodes[1].right = 3;
      expectedPage.nodes[1].color = Color.Black;
      expectedPage.nodes[2].color = Color.Black;
      const content: IContentInsert = {
        content: "ij\nk",
        offset: 2,
      };
      const maxBufferLength = 8;
      const receivedPage = insertContent(content, page, maxBufferLength);
      expect(receivedPage).toEqual(expectedPage);
    });

    test("Scenario 3: insert at the end of a node (test 2)", () => {
      const getPage = (): IPageContent => ({
        buffers: [
          {
            isReadOnly: true,
            lineStarts: [0, 4],
            content: "abc\nd",
          },
          {
            isReadOnly: false,
            lineStarts: [0],
            content: "efgh",
          },
        ],
        nodes: [
          {
            bufferIndex: 0,
            start: {
              line: 0,
              column: 0,
            },
            end: {
              line: 1,
              column: 1,
            },
            leftCharCount: 2,
            leftLineFeedCount: 0,
            length: 5,
            lineFeedCount: 1,
            color: Color.Black,
            parent: SENTINEL_INDEX,
            left: 2,
            right: 1,
          },
          {
            bufferIndex: 1,
            start: { line: 0, column: 0 },
            end: { line: 0, column: 2 },
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 2,
            lineFeedCount: 0,
            color: Color.Red,
            parent: 0,
            left: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
          },
          {
            bufferIndex: 1,
            start: { line: 0, column: 2 },
            end: { line: 0, column: 4 },
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 2,
            lineFeedCount: 0,
            color: Color.Red,
            parent: 0,
            left: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
          },
        ],
        newlineFormat: NEWLINE.LF,
        root: 0,
        previouslyInsertedNodeIndex: 1,
        previouslyInsertedNodeOffset: 0,
      });
      const page = getPage();
      const expectedPage = getPage();
      expectedPage.buffers[1].content += "ij\nk";
      expectedPage.buffers[1].lineStarts.push(7);
      expectedPage.nodes.push({
        bufferIndex: 1,
        start: { line: 0, column: 2 },
        end: { line: 1, column: 1 },
        leftCharCount: 0,
        leftLineFeedCount: 0,
        length: 4,
        lineFeedCount: 1,
        color: Color.Red,
        parent: 1,
        left: SENTINEL_INDEX,
        right: SENTINEL_INDEX,
      });
      expectedPage.nodes[1].right = 3;
      expectedPage.nodes[1].color = Color.Black;
      expectedPage.nodes[2].color = Color.Black;
      const content: IContentInsert = {
        content: "ij\nk",
        offset: 9,
      };
      const maxBufferLength = 8;
      const receivedPage = insertContent(content, page, maxBufferLength);
      expect(receivedPage).toEqual(expectedPage);
    });
  });

  describe("fix insert functions", () => {
    const getPage = (): IPageContent => ({
      buffers: [],
      nodes: [
        {
          bufferIndex: 1,
          start: { line: 0, column: 0 },
          end: { line: 2, column: 6 },
          leftCharCount: 0,
          leftLineFeedCount: 0,
          length: 31,
          lineFeedCount: 2,
          color: Color.Black,
          parent: 1,
          left: SENTINEL_INDEX,
          right: SENTINEL_INDEX,
        },
        {
          bufferIndex: 0,
          start: { line: 0, column: 1 },
          end: { line: 0, column: 12 },
          leftCharCount: 31,
          leftLineFeedCount: 2,
          length: 11,
          lineFeedCount: 0,
          color: Color.Black,
          parent: SENTINEL_INDEX,
          left: 0,
          right: 5,
        },
        {
          bufferIndex: 0,
          start: { line: 0, column: 55 },
          end: { line: 0, column: 65 },
          leftCharCount: 0,
          leftLineFeedCount: 0,
          length: 10,
          lineFeedCount: 0,
          color: Color.Black,
          parent: 3,
          left: SENTINEL_INDEX,
          right: SENTINEL_INDEX,
        },
        {
          bufferIndex: 0,
          start: { line: 0, column: 12 },
          end: { line: 0, column: 14 },
          leftCharCount: 10,
          leftLineFeedCount: 0,
          length: 2,
          lineFeedCount: 0,
          color: Color.Black,
          parent: 5,
          left: 2,
          right: 4,
        },
        {
          bufferIndex: 0,
          start: { line: 0, column: 66 },
          end: { line: 0, column: 76 },
          leftCharCount: 0,
          leftLineFeedCount: 0,
          length: 10,
          lineFeedCount: 0,
          color: Color.Red,
          parent: 3,
          left: SENTINEL_INDEX,
          right: SENTINEL_INDEX,
        },
        {
          bufferIndex: 1,
          start: { line: 2, column: 6 },
          end: { line: 2, column: 22 },
          leftCharCount: 22,
          leftLineFeedCount: 0,
          length: 16,
          lineFeedCount: 0,
          color: Color.Black,
          parent: 1,
          left: 3,
          right: 6,
        },
        {
          bufferIndex: 0,
          start: { line: 0, column: 14 },
          end: { line: 0, column: 55 },
          leftCharCount: 0,
          leftLineFeedCount: 0,
          length: 41,
          lineFeedCount: 0,
          color: Color.Black,
          parent: 5,
          left: SENTINEL_INDEX,
          right: SENTINEL_INDEX,
        },
      ],
      root: 1,
      newlineFormat: NEWLINE.LF,
      previouslyInsertedNodeIndex: null,
      previouslyInsertedNodeOffset: null,
    });

    test("Calculate line feed count", () => {
      const page = getPage();
      expect(calculateLineFeedCount(page, page.root)).toBe(2);
    });

    test("Calculate character count", () => {
      const page = getPage();
      expect(calculateCharCount(page, page.root)).toBe(121);
    });

    test("Recompute tree metadata: add a node to the end", () => {
      const page = getPage(); // hypothetically added the last node
      expect(recomputeTreeMetadata(page, 6)).toEqual(getPage());
    });

    test("Recompute tree metadata: add a node in the middle", () => {
      const page = getPage();
      page.nodes[5].leftCharCount = 12;
      page.nodes[4].lineFeedCount = 5;
      const expectedPage = getPage();
      expectedPage.nodes[5].leftLineFeedCount += 5;
      expectedPage.nodes[4].lineFeedCount += 5;

      const receivedPage = recomputeTreeMetadata(page, 4);
      expect(receivedPage).toEqual(expectedPage);
    });

    describe("fixInsert tests", () => {
      test("Scenario 1: Left left case", () => {
        const page: IPageContent = {
          buffers: [],
          root: 0,
          newlineFormat: NEWLINE.LF,
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
          nodes: [
            {
              // g
              bufferIndex: 0,
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
              right: 2,
            },
            {
              // p,
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
              parent: 0,
              left: 3,
              right: 4,
            },
            {
              // u
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
              parent: 0,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              // x
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
              parent: 1,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              // T3
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
              parent: 1,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
        };
        const expectedPage: IPageContent = {
          buffers: [],
          root: 1,
          newlineFormat: NEWLINE.LF,
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
          nodes: [
            {
              // g
              bufferIndex: 0,
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
              parent: 1,
              left: 4,
              right: 2,
            },
            {
              // p
              bufferIndex: 1,
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
              left: 3,
              right: 0,
            },
            {
              // u
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
              parent: 0,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              // x
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
              parent: 1,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              // T3
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
              parent: 0,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
        };
        const acquiredPage = fixInsert(page, 3);
        expect(acquiredPage).toEqual(expectedPage);
      });

      test("Scenario 2: Left right case", () => {
        const page: IPageContent = {
          buffers: [],
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
          newlineFormat: NEWLINE.LF,
          root: 0,
          nodes: [
            {
              // g
              bufferIndex: 0,
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
              right: 2,
            },
            {
              // p
              bufferIndex: 1,
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
              parent: 0,
              left: 3,
              right: 4,
            },
            {
              // u
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
              parent: 0,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              // T1
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
              parent: 1,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              // x
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
              color: Color.Red,
              parent: 1,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
        };
        const expectedPage: IPageContent = {
          buffers: [],
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
          newlineFormat: NEWLINE.LF,
          root: 4,
          nodes: [
            {
              // g
              bufferIndex: 0,
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
              right: 2,
            },
            {
              // p
              bufferIndex: 1,
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
              left: 3,
              right: SENTINEL_INDEX,
            },
            {
              // u
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
              parent: 0,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              // T1
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
              parent: 1,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              // x
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
              left: 1,
              right: 0,
            },
          ],
        };
        const acquiredPage = fixInsert(page, 4);
        expect(acquiredPage).toEqual(expectedPage);
      });

      test("Scenario 3: Right right case", () => {
        const page: IPageContent = {
          buffers: [],
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
          newlineFormat: NEWLINE.LF,
          root: 0,
          nodes: [
            {
              // g
              bufferIndex: 0,
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
              right: 2,
            },
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
              parent: 0,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              // p
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
              parent: 0,
              left: 3,
              right: 4,
            },
            {
              // T3
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
              // x
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
              color: Color.Red,
              parent: 2,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
        };
        const expectedPage: IPageContent = {
          buffers: [],
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
          newlineFormat: NEWLINE.LF,
          root: 2,
          nodes: [
            {
              // g
              bufferIndex: 0,
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
              left: 1,
              right: 3,
            },
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
              parent: 0,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              // p
              bufferIndex: 2,
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
              left: 0,
              right: 4,
            },
            {
              // T3
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
              parent: 0,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              // x
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
              color: Color.Red,
              parent: 2,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
        };
        const acquiredPage = fixInsert(page, 4);
        expect(acquiredPage).toEqual(expectedPage);
      });

      test("Scenario 4: Right left case", () => {
        const page: IPageContent = {
          buffers: [],
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
          newlineFormat: NEWLINE.LF,
          root: 0,
          nodes: [
            {
              // g
              bufferIndex: 0,
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
              right: 2,
            },
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
              parent: 0,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              // p
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
              parent: 0,
              left: 3,
              right: 4,
            },
            {
              // x
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
              // T5
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
              parent: 2,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
        };
        const expectedPage: IPageContent = {
          buffers: [],
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
          newlineFormat: NEWLINE.LF,
          root: 3,
          nodes: [
            {
              // g
              bufferIndex: 0,
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
              parent: 3,
              left: 1,
              right: SENTINEL_INDEX,
            },
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
              parent: 0,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
            {
              // p
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
              parent: 3,
              left: SENTINEL_INDEX,
              right: 4,
            },
            {
              // x
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
              left: 0,
              right: 2,
            },
            {
              // T5
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
              parent: 2,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
        };
        const acquiredPage = fixInsert(page, 3);
        expect(acquiredPage).toEqual(expectedPage);
      });

      const getScenario5Page = (): IPageContent => ({
        buffers: [
          {
            isReadOnly: false,
            lineStarts: [0],
            content: "a",
          },
        ],
        newlineFormat: NEWLINE.LF,
        nodes: [
          {
            bufferIndex: 0,
            start: {
              line: 0,
              column: 0,
            },
            end: {
              line: 0,
              column: 1,
            },
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 1,
            lineFeedCount: 0,
            color: Color.Red,
            parent: SENTINEL_INDEX,
            left: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
          },
        ],
        root: 0,
        previouslyInsertedNodeIndex: 0,
        previouslyInsertedNodeOffset: 0,
      });

      test("Scenario 5: Inserted node is root", () => {
        const expectedPage = getScenario5Page();
        expectedPage.nodes[0].color = Color.Black;
        const page = getScenario5Page();
        const receivedPage = fixInsert(page, 0);
        expect(receivedPage).toEqual(expectedPage);
      });
    });
  });
});
