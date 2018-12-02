import { Color, NEWLINE, PageContent } from "../model";
import { ContentInsert, fixInsert, insertContent } from "./insert";
import { MAX_BUFFER_LENGTH, SENTINEL, SENTINEL_INDEX } from "./tree";

describe("page/tree/insert", () => {
  describe("insert functions", () => {
    test("Scenario 1: insert at the end of the previously inserted node", () => {
      const getPage = (): PageContent => ({
        buffers: [
          {
            isReadOnly: false,
            lineStarts: [0],
            content: "a",
          },
        ],
        newlineFormat: NEWLINE.LF,
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
        root: 1,
        previouslyInsertedNodeIndex: 1,
        previouslyInsertedNodeOffset: 0,
      });
      const expectedPage = getPage();
      expectedPage.buffers[0].content += "b";
      expectedPage.nodes[1] = {
        ...expectedPage.nodes[1],
        end: {
          line: 0,
          column: 2,
        },
        length: 2,
        color: Color.Black,
      };
      const page = getPage();
      const content: ContentInsert = {
        content: "b",
        offset: 1,
      };
      const receivedPage = insertContent(content, page, MAX_BUFFER_LENGTH);
      expect(receivedPage).toEqual(expectedPage);
    });

    test("Scenario 2: insert at the end of the previously inserted node", () => {
      const getPage = (): PageContent => ({
        buffers: [
          {
            isReadOnly: false,
            lineStarts: [0, 4],
            content: "abc\nd",
          },
        ],
        newlineFormat: NEWLINE.LF,
        nodes: [
          SENTINEL,
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
        root: 1,
        previouslyInsertedNodeIndex: 1,
        previouslyInsertedNodeOffset: 0,
      });
      const expectedPage = getPage();
      expectedPage.buffers.push({
        isReadOnly: false,
        lineStarts: [0],
        content: "ef",
      });
      expectedPage.nodes[1].right = 2;
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
        parent: 1,
        left: SENTINEL_INDEX,
        right: SENTINEL_INDEX,
      });
      expectedPage.previouslyInsertedNodeIndex = 2;
      expectedPage.previouslyInsertedNodeOffset = 5;
      const page = getPage();
      const content: ContentInsert = {
        content: "ef",
        offset: 5,
      };
      const maxBufferLength = 5;
      const receivedPage = insertContent(content, page, maxBufferLength);
      expect(receivedPage).toEqual(expectedPage);
    });

    test("Scenario 3: insert at the end of a node (test 1)", () => {
      const getPage = (): PageContent => ({
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
          SENTINEL,
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
            right: 3,
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
            parent: 1,
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
            parent: 1,
            left: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
          },
        ],
        newlineFormat: NEWLINE.LF,
        root: 1,
        previouslyInsertedNodeIndex: 3,
        previouslyInsertedNodeOffset: 5,
      });
      const page = getPage();
      const expectedPage = getPage();
      expectedPage.buffers[1].content += "ij\nk";
      expectedPage.buffers[1].lineStarts.push(7);
      expectedPage.nodes[1].leftCharCount = 6;
      expectedPage.nodes[1].leftLineFeedCount = 1;
      expectedPage.nodes.push({
        bufferIndex: 1,
        start: { line: 0, column: 4 },
        end: { line: 1, column: 1 },
        leftCharCount: 0,
        leftLineFeedCount: 0,
        length: 4,
        lineFeedCount: 1,
        color: Color.Red,
        parent: 2,
        left: SENTINEL_INDEX,
        right: SENTINEL_INDEX,
      });
      expectedPage.nodes[2].right = 4;
      expectedPage.nodes[2].color = Color.Black;
      expectedPage.nodes[3].color = Color.Black;
      expectedPage.previouslyInsertedNodeIndex = 4;
      expectedPage.previouslyInsertedNodeOffset = 2;
      const content: ContentInsert = {
        content: "ij\nk",
        offset: 2,
      };
      const maxBufferLength = 8;
      const receivedPage = insertContent(content, page, maxBufferLength);
      expect(receivedPage).toEqual(expectedPage);
    });

    test("Scenario 3: insert at the end of a node (test 2)", () => {
      const getPage = (): PageContent => ({
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
          SENTINEL,
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
            left: 3,
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
            parent: 1,
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
            parent: 1,
            left: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
          },
        ],
        newlineFormat: NEWLINE.LF,
        root: 1,
        previouslyInsertedNodeIndex: 2,
        previouslyInsertedNodeOffset: 0,
      });
      const page = getPage();
      const expectedPage = getPage();
      expectedPage.buffers[1].content += "ij\nk";
      expectedPage.buffers[1].lineStarts.push(7);
      expectedPage.nodes.push({
        bufferIndex: 1,
        start: { line: 0, column: 4 },
        end: { line: 1, column: 1 },
        leftCharCount: 0,
        leftLineFeedCount: 0,
        length: 4,
        lineFeedCount: 1,
        color: Color.Red,
        parent: 2,
        left: SENTINEL_INDEX,
        right: SENTINEL_INDEX,
      });
      expectedPage.nodes[2].right = 4;
      expectedPage.nodes[2].color = Color.Black;
      expectedPage.nodes[3].color = Color.Black;
      expectedPage.previouslyInsertedNodeIndex = 4;
      expectedPage.previouslyInsertedNodeOffset = 9;
      const content: ContentInsert = {
        content: "ij\nk",
        offset: 9,
      };
      const maxBufferLength = 8;
      const receivedPage = insertContent(content, page, maxBufferLength);
      expect(receivedPage).toEqual(expectedPage);
    });

    test("Scenario 4: insert at the end of a node (test 1)", () => {
      const getPage = (): PageContent => ({
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
            lineFeedCount: 0,
            color: Color.Red,
            parent: 0,
            left: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
          },
        ],
        newlineFormat: NEWLINE.LF,
        root: 0,
        previouslyInsertedNodeIndex: 2,
        previouslyInsertedNodeOffset: 7,
      });
      const page = getPage();
      const expectedPage = getPage();
      expectedPage.buffers.push({
        isReadOnly: false,
        lineStarts: [0, 3],
        content: "ij\nkl",
      });
      expectedPage.nodes.push({
        bufferIndex: 2,
        start: { line: 0, column: 0 },
        end: { line: 1, column: 2 },
        leftCharCount: 0,
        leftLineFeedCount: 0,
        length: 5,
        lineFeedCount: 1,
        color: Color.Red,
        parent: 1,
        left: SENTINEL_INDEX,
        right: SENTINEL_INDEX,
      });
      expectedPage.nodes[0].leftCharCount = 7;
      expectedPage.nodes[0].leftLineFeedCount = 1;
      expectedPage.nodes[1].right = 3;
      expectedPage.nodes[1].color = Color.Black;
      expectedPage.nodes[2].color = Color.Black;
      expectedPage.previouslyInsertedNodeIndex = 3;
      expectedPage.previouslyInsertedNodeOffset = 2;
      const content: ContentInsert = {
        content: "ij\nkl",
        offset: 2,
      };
      const maxBufferLength = 8;
      const receivedPage = insertContent(content, page, maxBufferLength);
      expect(receivedPage).toEqual(expectedPage);
    });

    test("Scenario 4: insert at the end of a node (test 2)", () => {
      const getPage = (): PageContent => ({
        buffers: [
          {
            isReadOnly: true,
            lineStarts: [0, 4],
            content: "abc\nd",
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
        newlineFormat: NEWLINE.LF,
        root: 0,
        previouslyInsertedNodeIndex: 2,
        previouslyInsertedNodeOffset: 7,
      });
      const expectedPage = getPage();
      expectedPage.buffers.push({
        isReadOnly: false,
        lineStarts: [0],
        content: "ef",
      });
      expectedPage.nodes.push({
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
      });
      expectedPage.nodes[0].right = 1;
      const page = getPage();
      const content: ContentInsert = {
        content: "ef",
        offset: 5,
      };
      expectedPage.previouslyInsertedNodeIndex = 1;
      expectedPage.previouslyInsertedNodeOffset = 5;
      const maxBufferLength = 8;
      const receivedPage = insertContent(content, page, maxBufferLength);
      expect(receivedPage).toEqual(expectedPage);
    });

    test("Scenario 5: insert at the start of the content", () => {
      const page: PageContent = {
        buffers: [
          {
            isReadOnly: true,
            lineStarts: [0, 4],
            content: "abc\nd",
          },
          {
            isReadOnly: false,
            lineStarts: [0],
            content: "ef",
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
            right: SENTINEL_INDEX,
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
        ],
        newlineFormat: NEWLINE.LF,
        root: 0,
        previouslyInsertedNodeIndex: 1,
        previouslyInsertedNodeOffset: 0,
      };
      const expectedPage: PageContent = {
        buffers: [
          {
            isReadOnly: true,
            lineStarts: [0, 4],
            content: "abc\nd",
          },
          {
            isReadOnly: false,
            lineStarts: [0, 5],
            content: "efgh\nij",
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
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 5,
            lineFeedCount: 1,
            color: Color.Red,
            parent: 1,
            left: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
          },
          {
            bufferIndex: 1,
            start: { line: 0, column: 0 },
            end: { line: 0, column: 2 },
            leftCharCount: 5,
            leftLineFeedCount: 1,
            length: 2,
            lineFeedCount: 0,
            color: Color.Black,
            parent: SENTINEL_INDEX,
            left: 2,
            right: 0,
          },
          {
            bufferIndex: 1,
            start: { line: 0, column: 2 },
            end: { line: 1, column: 2 },
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 5,
            lineFeedCount: 1,
            color: Color.Red,
            parent: 1,
            left: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
          },
        ],
        newlineFormat: NEWLINE.LF,
        root: 1,
        previouslyInsertedNodeIndex: 2,
        previouslyInsertedNodeOffset: 0,
      };
      const content: ContentInsert = {
        content: "gh\nij",
        offset: 0,
      };
      const maxBufferLength = 8;
      const receivedPage = insertContent(content, page, maxBufferLength);
      expect(receivedPage).toEqual(expectedPage);
    });

    test("Scenario 6: insert at the start of the content (test 1)", () => {
      const page: PageContent = {
        buffers: [
          {
            isReadOnly: false,
            lineStarts: [0, 4],
            content: "abc\ndef",
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
            parent: 0,
            left: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
          },
        ],
        newlineFormat: NEWLINE.LF,
        root: 0,
        previouslyInsertedNodeIndex: 1,
        previouslyInsertedNodeOffset: 0,
      };
      const expectedPage: PageContent = {
        buffers: [
          {
            isReadOnly: false,
            lineStarts: [0, 4],
            content: "abc\ndef",
          },
          {
            isReadOnly: false,
            lineStarts: [0, 3],
            content: "gh\nij",
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
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 5,
            lineFeedCount: 1,
            color: Color.Red,
            parent: 1,
            left: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
          },
          {
            bufferIndex: 0,
            start: { line: 1, column: 1 },
            end: { line: 1, column: 3 },
            leftCharCount: 5,
            leftLineFeedCount: 1,
            length: 2,
            lineFeedCount: 0,
            color: Color.Black,
            parent: SENTINEL_INDEX,
            left: 2,
            right: 0,
          },
          {
            bufferIndex: 1,
            start: { line: 0, column: 0 },
            end: { line: 1, column: 2 },
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 5,
            lineFeedCount: 1,
            color: Color.Red,
            parent: 1,
            left: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
          },
        ],
        newlineFormat: NEWLINE.LF,
        root: 1,
        previouslyInsertedNodeIndex: 2,
        previouslyInsertedNodeOffset: 0,
      };
      const content: ContentInsert = {
        content: "gh\nij",
        offset: 0,
      };
      const maxBufferLength = 8;
      const receivedPage = insertContent(content, page, maxBufferLength);
      expect(receivedPage).toEqual(expectedPage);
    });

    test("Scenario 6: insert at the start of the content (test 2)", () => {
      const page: PageContent = {
        buffers: [
          {
            isReadOnly: true,
            lineStarts: [0, 4],
            content: "abc\nd",
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
        newlineFormat: NEWLINE.LF,
        root: 0,
        previouslyInsertedNodeIndex: null,
        previouslyInsertedNodeOffset: null,
      };
      const expectedPage: PageContent = {
        buffers: [
          {
            isReadOnly: true,
            lineStarts: [0, 4],
            content: "abc\nd",
          },
          {
            isReadOnly: false,
            lineStarts: [0],
            content: "ef",
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
            right: SENTINEL_INDEX,
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
        ],
        newlineFormat: NEWLINE.LF,
        root: 0,
        previouslyInsertedNodeIndex: 1,
        previouslyInsertedNodeOffset: 0,
      };
      const content: ContentInsert = {
        content: "ef",
        offset: 0,
      };
      const maxBufferLength = 8;
      const receivedPage = insertContent(content, page, maxBufferLength);
      expect(receivedPage).toEqual(expectedPage);
    });

    test("Scenario 7: insert inside a node's content", () => {
      const page: PageContent = {
        buffers: [
          {
            isReadOnly: false,
            lineStarts: [0, 4],
            content: "abc\ndefgh",
          },
        ],
        nodes: [
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
            left: 1,
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
            parent: 0,
            left: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
          },
          {
            bufferIndex: 0,
            start: { line: 1, column: 3 },
            end: { line: 1, column: 5 },
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
        root: 0,
        newlineFormat: NEWLINE.LF,
        previouslyInsertedNodeIndex: 2,
        previouslyInsertedNodeOffset: 7,
      };
      const expectedPage: PageContent = {
        buffers: [
          {
            isReadOnly: false,
            lineStarts: [0, 4, 12],
            content: "abc\ndefghij\nkl",
          },
        ],
        nodes: [
          {
            bufferIndex: 0,
            start: { line: 0, column: 0 },
            end: { line: 0, column: 3 },
            leftCharCount: 2,
            leftLineFeedCount: 0,
            length: 3,
            lineFeedCount: 0,
            color: Color.Black,
            parent: SENTINEL_INDEX,
            left: 1,
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
            color: Color.Black,
            parent: 0,
            left: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
          },
          {
            bufferIndex: 0,
            start: { line: 1, column: 3 },
            end: { line: 1, column: 5 },
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
            leftCharCount: 5,
            leftLineFeedCount: 1,
            length: 2,
            lineFeedCount: 1,
            color: Color.Black,
            parent: 0,
            left: 4,
            right: 2,
          },
          {
            bufferIndex: 0,
            start: { line: 1, column: 5 },
            end: { line: 2, column: 2 },
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 5,
            lineFeedCount: 1,
            color: Color.Red,
            parent: 3,
            left: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
          },
        ],
        root: 0,
        newlineFormat: NEWLINE.LF,
        previouslyInsertedNodeIndex: 4,
        previouslyInsertedNodeOffset: 5,
      };
      const content: ContentInsert = {
        content: "ij\nkl",
        offset: 5,
      };
      const maxBufferLength = 16;
      const receivedPage = insertContent(content, page, maxBufferLength);
      expect(receivedPage).toEqual(expectedPage);
    });

    test("Scenario 8: insert inside a node's content (test 1)", () => {
      const page: PageContent = {
        buffers: [
          {
            isReadOnly: false,
            lineStarts: [0, 4],
            content: "abc\ndefgh",
          },
        ],
        nodes: [
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
            left: 1,
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
            parent: 0,
            left: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
          },
          {
            bufferIndex: 0,
            start: { line: 1, column: 3 },
            end: { line: 1, column: 5 },
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
        root: 0,
        newlineFormat: NEWLINE.LF,
        previouslyInsertedNodeIndex: 2,
        previouslyInsertedNodeOffset: 7,
      };
      const expectedPage: PageContent = {
        buffers: [
          {
            isReadOnly: false,
            lineStarts: [0, 4],
            content: "abc\ndefgh",
          },
          {
            isReadOnly: false,
            lineStarts: [0, 3, 6],
            content: "ij\nkl\nmn",
          },
        ],
        nodes: [
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
            left: 1,
            right: 4,
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
            parent: 0,
            left: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
          },
          {
            bufferIndex: 0,
            start: { line: 1, column: 3 },
            end: { line: 1, column: 4 },
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 1,
            lineFeedCount: 0,
            color: Color.Red,
            parent: 4,
            left: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
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
            parent: 4,
            left: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
          },
          {
            bufferIndex: 1,
            start: { line: 0, column: 0 },
            end: { line: 2, column: 2 },
            leftCharCount: 1,
            leftLineFeedCount: 0,
            length: 8,
            lineFeedCount: 2,
            color: Color.Black,
            parent: 0,
            left: 2,
            right: 3,
          },
        ],
        newlineFormat: NEWLINE.LF,
        previouslyInsertedNodeIndex: 4,
        previouslyInsertedNodeOffset: 8,
        root: 0,
      };
      const content: ContentInsert = {
        offset: 8,
        content: "ij\nkl\nmn",
      };
      const maxBufferLength = 16;
      const receivedPage = insertContent(content, page, maxBufferLength);
      expect(receivedPage).toEqual(expectedPage);
    });

    test("Scenario 8: insert inside a node's content (test 2", () => {
      const page: PageContent = {
        buffers: [
          {
            isReadOnly: true,
            lineStarts: [0, 4],
            content: "abc\ndefgh",
          },
        ],
        nodes: [
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
        ],
        root: 0,
        newlineFormat: NEWLINE.LF,
        previouslyInsertedNodeIndex: null,
        previouslyInsertedNodeOffset: null,
      };
      const expectedPage: PageContent = {
        buffers: [
          {
            isReadOnly: true,
            lineStarts: [0, 4],
            content: "abc\ndefgh",
          },
          {
            isReadOnly: false,
            lineStarts: [0],
            content: "ef",
          },
        ],
        nodes: [
          {
            bufferIndex: 0,
            start: { line: 0, column: 0 },
            end: { line: 0, column: 1 },
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 1,
            lineFeedCount: 0,
            color: Color.Red,
            parent: 2,
            left: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
          },
          {
            bufferIndex: 0,
            start: { line: 0, column: 1 },
            end: { line: 1, column: 1 },
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 4,
            lineFeedCount: 1,
            color: Color.Red,
            parent: 2,
            left: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
          },
          {
            bufferIndex: 1,
            start: { line: 0, column: 0 },
            end: { line: 0, column: 2 },
            leftCharCount: 1,
            leftLineFeedCount: 0,
            length: 2,
            lineFeedCount: 0,
            color: Color.Black,
            parent: SENTINEL_INDEX,
            left: 0,
            right: 1,
          },
        ],
        previouslyInsertedNodeIndex: 2,
        previouslyInsertedNodeOffset: 1,
        newlineFormat: NEWLINE.LF,
        root: 2,
      };
      const content: ContentInsert = {
        offset: 1,
        content: "ef",
      };
      const maxBufferLength = 8;
      const receivedPage = insertContent(content, page, maxBufferLength);
      expect(receivedPage).toEqual(expectedPage);
    });
  });

  describe("fix insert functions", () => {
    describe("black uncle cases", () => {
      test("Scenario 1: Left left case", () => {
        const page: PageContent = {
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
        const expectedPage: PageContent = {
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
        const page: PageContent = {
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
        const expectedPage: PageContent = {
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
        const page: PageContent = {
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
        const expectedPage: PageContent = {
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
        const page: PageContent = {
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
        const expectedPage: PageContent = {
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
    });

    describe("red uncle cases", () => {
      test("Right red uncle", () => {
        const page: PageContent = {
          buffers: [],
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
              color: Color.Red,
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
          ],
          root: 0,
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
          newlineFormat: NEWLINE.LF,
        };
        const expectedPage: PageContent = {
          buffers: [],
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
              color: Color.Black,
              parent: 0,
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
          ],
          root: 0,
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
          newlineFormat: NEWLINE.LF,
        };
        const receivedPage = fixInsert(page, 3);
        expect(receivedPage).toEqual(expectedPage);
      });

      test("Left red uncle", () => {
        const page: PageContent = {
          buffers: [],
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
              color: Color.Red,
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
              left: SENTINEL_INDEX,
              right: 3,
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
          ],
          root: 0,
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
          newlineFormat: NEWLINE.LF,
        };
        const expectedPage: PageContent = {
          buffers: [],
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
              color: Color.Black,
              parent: 0,
              left: SENTINEL_INDEX,
              right: 3,
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
          ],
          root: 0,
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
          newlineFormat: NEWLINE.LF,
        };
        const receivedPage = fixInsert(page, 3);
        expect(receivedPage).toEqual(expectedPage);
      });
    });

    test("Inserted node is root", () => {
      const getPage = (): PageContent => ({
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
      const expectedPage = getPage();
      expectedPage.nodes[0].color = Color.Black;
      const page = getPage();
      const receivedPage = fixInsert(page, 0);
      expect(receivedPage).toEqual(expectedPage);
    });
  });
});
