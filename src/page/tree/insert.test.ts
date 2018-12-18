import {
  BufferMutable,
  Color,
  NEWLINE,
  NodeMutable,
  PageContent,
  PageContentMutable,
} from "../model";
import { ContentInsert, fixInsert, insertContent } from "./insert";
import { MAX_BUFFER_LENGTH, SENTINEL, SENTINEL_INDEX } from "./tree";

describe("page/tree/insert", () => {
  describe("insert functions", () => {
    test("Scenario 1: insert at the end of the previously inserted node", () => {
      const getPage = (): PageContentMutable => ({
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
      (expectedPage.buffers[0] as BufferMutable).content += "b";
      (expectedPage.nodes[1] as NodeMutable) = {
        ...(expectedPage.nodes[1] as NodeMutable),
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
      const receivedPage = insertContent(page, content, MAX_BUFFER_LENGTH);
      expect(receivedPage).toStrictEqual(expectedPage);
    });

    test("Scenario 2: insert at the end of the previously inserted node", () => {
      const getPage = (): PageContentMutable => ({
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
      ((expectedPage.nodes[1] as NodeMutable) as NodeMutable).right = 2;
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
      insertContent(page, content, maxBufferLength);
      expect(page).toStrictEqual(expectedPage);
    });

    test("Scenario 3: insert at the end of a node (test 1)", () => {
      const getPage = (): PageContentMutable => ({
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
      ((expectedPage.buffers[1] as BufferMutable) as BufferMutable).content +=
        "ij\nk";
      (expectedPage.buffers[1] as BufferMutable).lineStarts.push(7);
      (expectedPage.nodes[1] as NodeMutable).leftCharCount = 6;
      (expectedPage.nodes[1] as NodeMutable).leftLineFeedCount = 1;
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
      (expectedPage.nodes[2] as NodeMutable).right = 4;
      (expectedPage.nodes[2] as NodeMutable).color = Color.Black;
      (expectedPage.nodes[3] as NodeMutable).color = Color.Black;
      expectedPage.previouslyInsertedNodeIndex = 4;
      expectedPage.previouslyInsertedNodeOffset = 2;
      const content: ContentInsert = {
        content: "ij\nk",
        offset: 2,
      };
      const maxBufferLength = 8;
      insertContent(page, content, maxBufferLength);
      expect(page).toStrictEqual(expectedPage);
    });

    test("Scenario 3: insert at the end of a node (test 2)", () => {
      const getPage = (): PageContentMutable => ({
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
      (expectedPage.buffers[1] as BufferMutable).content += "ij\nk";
      (expectedPage.buffers[1] as BufferMutable).lineStarts.push(7);
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
      (expectedPage.nodes[2] as NodeMutable).right = 4;
      (expectedPage.nodes[2] as NodeMutable).color = Color.Black;
      (expectedPage.nodes[3] as NodeMutable).color = Color.Black;
      expectedPage.previouslyInsertedNodeIndex = 4;
      expectedPage.previouslyInsertedNodeOffset = 9;
      const content: ContentInsert = {
        content: "ij\nk",
        offset: 9,
      };
      const maxBufferLength = 8;
      const receivedPage = insertContent(page, content, maxBufferLength);
      expect(receivedPage).toStrictEqual(expectedPage);
    });

    test("Scenario 4: insert at the end of a node (test 1)", () => {
      const getPage = (): PageContentMutable => ({
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
            lineFeedCount: 0,
            color: Color.Red,
            parent: 1,
            left: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
          },
        ],
        newlineFormat: NEWLINE.LF,
        root: 1,
        previouslyInsertedNodeIndex: 3,
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
        parent: 2,
        left: SENTINEL_INDEX,
        right: SENTINEL_INDEX,
      });
      (expectedPage.nodes[1] as NodeMutable).leftCharCount = 7;
      (expectedPage.nodes[1] as NodeMutable).leftLineFeedCount = 1;
      (expectedPage.nodes[2] as NodeMutable).right = 4;
      (expectedPage.nodes[2] as NodeMutable).color = Color.Black;
      (expectedPage.nodes[3] as NodeMutable).color = Color.Black;
      expectedPage.previouslyInsertedNodeIndex = 4;
      expectedPage.previouslyInsertedNodeOffset = 2;
      const content: ContentInsert = {
        content: "ij\nkl",
        offset: 2,
      };
      const maxBufferLength = 8;
      const receivedPage = insertContent(page, content, maxBufferLength);
      expect(receivedPage).toStrictEqual(expectedPage);
    });

    test("Scenario 4: insert at the end of a node (test 2)", () => {
      const getPage = (): PageContentMutable => ({
        buffers: [
          {
            isReadOnly: true,
            lineStarts: [0, 4],
            content: "abc\nd",
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
        root: 1,
        previouslyInsertedNodeIndex: 1,
        previouslyInsertedNodeOffset: 5,
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
        parent: 1,
        left: SENTINEL_INDEX,
        right: SENTINEL_INDEX,
      });
      (expectedPage.nodes[1] as NodeMutable).right = 2;
      const page = getPage();
      const content: ContentInsert = {
        content: "ef",
        offset: 5,
      };
      expectedPage.previouslyInsertedNodeIndex = 2;
      expectedPage.previouslyInsertedNodeOffset = 5;
      const maxBufferLength = 8;
      const receivedPage = insertContent(page, content, maxBufferLength);
      expect(receivedPage).toStrictEqual(expectedPage);
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
            color: Color.Red,
            parent: 2,
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
            left: 3,
            right: 1,
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
            parent: 2,
            left: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
          },
        ],
        newlineFormat: NEWLINE.LF,
        root: 2,
        previouslyInsertedNodeIndex: 3,
        previouslyInsertedNodeOffset: 0,
      };
      const content: ContentInsert = {
        content: "gh\nij",
        offset: 0,
      };
      const maxBufferLength = 8;
      insertContent(page as PageContentMutable, content, maxBufferLength);
      expect(page).toStrictEqual(expectedPage);
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
        newlineFormat: NEWLINE.LF,
        root: 1,
        previouslyInsertedNodeIndex: 2,
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
            color: Color.Red,
            parent: 2,
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
            left: 3,
            right: 1,
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
            parent: 2,
            left: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
          },
        ],
        newlineFormat: NEWLINE.LF,
        root: 2,
        previouslyInsertedNodeIndex: 3,
        previouslyInsertedNodeOffset: 0,
      };
      const content: ContentInsert = {
        content: "gh\nij",
        offset: 0,
      };
      const maxBufferLength = 8;
      insertContent(page as PageContentMutable, content, maxBufferLength);
      expect(page).toStrictEqual(expectedPage);
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
        newlineFormat: NEWLINE.LF,
        root: 1,
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
        content: "ef",
        offset: 0,
      };
      const maxBufferLength = 8;
      insertContent(page as PageContentMutable, content, maxBufferLength);
      expect(page).toStrictEqual(expectedPage);
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
            start: { line: 1, column: 3 },
            end: { line: 1, column: 5 },
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
        newlineFormat: NEWLINE.LF,
        previouslyInsertedNodeIndex: 3,
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
          SENTINEL,
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
            left: 2,
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
            parent: 1,
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
            parent: 4,
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
            parent: 1,
            left: 5,
            right: 3,
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
            parent: 4,
            left: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
          },
        ],
        root: 1,
        newlineFormat: NEWLINE.LF,
        previouslyInsertedNodeIndex: 5,
        previouslyInsertedNodeOffset: 5,
      };
      const content: ContentInsert = {
        content: "ij\nkl",
        offset: 5,
      };
      const maxBufferLength = 16;
      insertContent(page as PageContentMutable, content, maxBufferLength);
      expect(page).toStrictEqual(expectedPage);
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
            start: { line: 1, column: 3 },
            end: { line: 1, column: 5 },
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
        newlineFormat: NEWLINE.LF,
        previouslyInsertedNodeIndex: 3,
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
            right: 5,
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
            parent: 1,
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
            parent: 5,
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
            parent: 5,
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
            parent: 1,
            left: 3,
            right: 4,
          },
        ],
        newlineFormat: NEWLINE.LF,
        previouslyInsertedNodeIndex: 5,
        previouslyInsertedNodeOffset: 8,
        root: 1,
      };
      const content: ContentInsert = {
        offset: 8,
        content: "ij\nkl\nmn",
      };
      const maxBufferLength = 16;
      insertContent(page as PageContentMutable, content, maxBufferLength);
      expect(page).toStrictEqual(expectedPage);
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
        ],
        root: 1,
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
          SENTINEL,
          {
            bufferIndex: 0,
            start: { line: 0, column: 0 },
            end: { line: 0, column: 1 },
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
            start: { line: 0, column: 1 },
            end: { line: 1, column: 1 },
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 4,
            lineFeedCount: 1,
            color: Color.Red,
            parent: 3,
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
            left: 1,
            right: 2,
          },
        ],
        previouslyInsertedNodeIndex: 3,
        previouslyInsertedNodeOffset: 1,
        newlineFormat: NEWLINE.LF,
        root: 3,
      };
      const content: ContentInsert = {
        offset: 1,
        content: "ef",
      };
      const maxBufferLength = 8;
      insertContent(page as PageContentMutable, content, maxBufferLength);
      expect(page).toStrictEqual(expectedPage);
    });
  });

  describe("fix insert function", () => {
    describe("black uncle cases", () => {
      test("Scenario 1: Left left case", () => {
        const page: PageContent = {
          buffers: [],
          root: 1,
          newlineFormat: NEWLINE.LF,
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
          nodes: [
            SENTINEL,
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
              left: 2,
              right: 3,
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
              parent: 1,
              left: 4,
              right: 5,
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
              parent: 1,
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
              parent: 2,
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
              parent: 2,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
        };
        const expectedPage: PageContent = {
          buffers: [],
          root: 2,
          newlineFormat: NEWLINE.LF,
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
          nodes: [
            SENTINEL,
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
              left: 5,
              right: 3,
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
              left: 4,
              right: 1,
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
              parent: 1,
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
              parent: 2,
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
        const acquiredPage = fixInsert(page as PageContentMutable, 4);
        expect(acquiredPage).toStrictEqual(expectedPage);
      });

      test("Scenario 2: Left right case", () => {
        const page: PageContent = {
          buffers: [],
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
          newlineFormat: NEWLINE.LF,
          root: 1,
          nodes: [
            SENTINEL,
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
              left: 2,
              right: 3,
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
              parent: 1,
              left: 4,
              right: 5,
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
              parent: 1,
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
          root: 5,
          nodes: [
            SENTINEL,
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
              parent: 5,
              left: SENTINEL_INDEX,
              right: 3,
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
              parent: 5,
              left: 4,
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
              parent: 1,
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
              leftCharCount: 20,
              leftLineFeedCount: 4,
              length: 10,
              lineFeedCount: 2,
              color: Color.Black,
              parent: SENTINEL_INDEX,
              left: 2,
              right: 1,
            },
          ],
        };
        const acquiredPage = fixInsert(page as PageContentMutable, 5);
        expect(acquiredPage).toStrictEqual(expectedPage);
      });

      test("Scenario 3: Right right case", () => {
        const page: PageContent = {
          buffers: [],
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
          newlineFormat: NEWLINE.LF,
          root: 1,
          nodes: [
            SENTINEL,
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
              left: 2,
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
              parent: 1,
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
              parent: 1,
              left: 4,
              right: 5,
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
              parent: 3,
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
              left: 2,
              right: 4,
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
              parent: 1,
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
              left: 1,
              right: 5,
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
              parent: 3,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
        };
        const acquiredPage = fixInsert(page as PageContentMutable, 5);
        expect(acquiredPage).toStrictEqual(expectedPage);
      });

      test("Scenario 4: Right left case", () => {
        const page: PageContent = {
          buffers: [],
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
          newlineFormat: NEWLINE.LF,
          root: 1,
          nodes: [
            SENTINEL,
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
              left: 2,
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
              parent: 1,
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
              parent: 1,
              left: 4,
              right: 5,
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
              parent: 3,
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
          root: 4,
          nodes: [
            SENTINEL,
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
              parent: 4,
              left: 2,
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
              parent: 1,
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
              parent: 4,
              left: SENTINEL_INDEX,
              right: 5,
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
              left: 1,
              right: 3,
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
              parent: 3,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
        };
        const acquiredPage = fixInsert(page as PageContentMutable, 4);
        expect(acquiredPage).toStrictEqual(expectedPage);
      });
    });

    describe("red uncle cases", () => {
      test("Right red uncle", () => {
        const page: PageContent = {
          buffers: [],
          nodes: [
            SENTINEL,
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
              left: 2,
              right: 3,
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
              parent: 1,
              left: 4,
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
              parent: 1,
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
              parent: 2,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
          root: 1,
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
          newlineFormat: NEWLINE.LF,
        };
        const expectedPage: PageContent = {
          buffers: [],
          nodes: [
            SENTINEL,
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
              left: 2,
              right: 3,
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
              parent: 1,
              left: 4,
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
              parent: 1,
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
              parent: 2,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
          root: 1,
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
          newlineFormat: NEWLINE.LF,
        };
        const receivedPage = fixInsert(page as PageContentMutable, 4);
        expect(receivedPage).toStrictEqual(expectedPage);
      });

      test("Left red uncle", () => {
        const page: PageContent = {
          buffers: [],
          nodes: [
            SENTINEL,
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
              left: 2,
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
              color: Color.Red,
              parent: 1,
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
              parent: 1,
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
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Red,
              parent: 3,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
          root: 1,
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
          newlineFormat: NEWLINE.LF,
        };
        const expectedPage: PageContent = {
          buffers: [],
          nodes: [
            SENTINEL,
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
              left: 2,
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
              parent: 1,
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
              parent: 1,
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
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              color: Color.Red,
              parent: 3,
              left: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
            },
          ],
          root: 1,
          previouslyInsertedNodeIndex: null,
          previouslyInsertedNodeOffset: null,
          newlineFormat: NEWLINE.LF,
        };
        const receivedPage = fixInsert(page as PageContentMutable, 4);
        expect(receivedPage).toStrictEqual(expectedPage);
      });
    });

    test("Inserted node is root", () => {
      const getPage = (): PageContentMutable => ({
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
            color: Color.Red,
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
      (expectedPage.nodes[1] as NodeMutable).color = Color.Black;
      const page = getPage();
      const receivedPage = fixInsert(page, 1);
      expect(receivedPage).toStrictEqual(expectedPage);
    });
  });
});
