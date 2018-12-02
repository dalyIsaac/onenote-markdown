import { Color, NEWLINE, PageContent } from "../model";
import { fixDelete } from "./delete";
import { SENTINEL, SENTINEL_INDEX } from "./tree";

describe("page/tree/delete", () => {
  describe("fix delete function", () => {
    test("Simple case", () => {
      const page: PageContent = {
        root: 1,
        nodes: [
          SENTINEL,
          {
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
            left: 2,
            right: 3,
          },
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
            parent: 1,
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
            parent: 1,
            left: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
          },
        ],
        buffers: [],
        newlineFormat: NEWLINE.LF,
        previouslyInsertedNodeIndex: null,
        previouslyInsertedNodeOffset: null,
      };
      const expectedPage: PageContent = {
        root: 1,
        nodes: [
          SENTINEL,
          {
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
            left: 2,
            right: 3,
          },
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
            parent: 1,
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
            parent: 1,
            left: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
          },
        ],
        buffers: [],
        newlineFormat: NEWLINE.LF,
        previouslyInsertedNodeIndex: null,
        previouslyInsertedNodeOffset: null,
      };
      const receivedPage = fixDelete(page, 2);
      expect(receivedPage).toEqual(expectedPage);
    });
  });
});
