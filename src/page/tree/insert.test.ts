import { Color, IPageContent, NEWLINE } from "../model";
import { SENTINEL_INDEX } from "../reducer";
import {
  calculateCharCount,
  calculateLineFeedCount,
  fixInsert,
  IContentInsert,
  insertContent,
  recomputeTreeMetadata,
} from "./insert";

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
      };
      const page = getScenarioOneInitialPage();
      const content: IContentInsert = {
        content: "b",
        offset: 1,
      };
      const receivedPage = insertContent(content, page);
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
    });
  });
});
