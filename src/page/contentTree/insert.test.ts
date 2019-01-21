import { Color, PageContent, PageContentMutable } from "../pageModel";
import { SENTINEL_STRUCTURE } from "../structureTree/tree";
import { SENTINEL_INDEX } from "../tree";
import { BufferMutable, ContentNodeMutable, NEWLINE } from "./contentModel";
import { ContentInsert, fixInsert, insertContent } from "./insert";
import { MAX_BUFFER_LENGTH, SENTINEL_CONTENT } from "./tree";

describe("Functions for inserting content into the piece table/red-black tree.", () => {
  describe("insert functions", () => {
    test("Scenario 1: insert at the end of the previously inserted node", () => {
      const getPage = (): PageContentMutable => ({
        structureNodes: [SENTINEL_STRUCTURE],
        structureRoot: SENTINEL_INDEX,
        buffers: [
          {
            isReadOnly: false,
            lineStarts: [0],
            content: "a",
          },
        ],
        newlineFormat: NEWLINE.LF,
        contentNodes: [
          SENTINEL_CONTENT,
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
        contentRoot: 1,
        previouslyInsertedContentNodeIndex: 1,
        previouslyInsertedContentNodeOffset: 0,
      });
      const expectedPage = getPage();
      (expectedPage.buffers[0] as BufferMutable).content += "b";
      (expectedPage.contentNodes[1] as ContentNodeMutable) = {
        ...(expectedPage.contentNodes[1] as ContentNodeMutable),
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
      expect(page).toStrictEqual(expectedPage);
    });

    test("Scenario 2: insert at the end of the previously inserted node", () => {
      const getPage = (): PageContentMutable => ({
        structureNodes: [SENTINEL_STRUCTURE],
        structureRoot: SENTINEL_INDEX,
        buffers: [
          {
            isReadOnly: false,
            lineStarts: [0, 4],
            content: "abc\nd",
          },
        ],
        newlineFormat: NEWLINE.LF,
        contentNodes: [
          SENTINEL_CONTENT,
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
        contentRoot: 1,
        previouslyInsertedContentNodeIndex: 1,
        previouslyInsertedContentNodeOffset: 0,
      });
      const expectedPage = getPage();
      expectedPage.buffers.push({
        isReadOnly: false,
        lineStarts: [0],
        content: "ef",
      });
      ((expectedPage
        .contentNodes[1] as ContentNodeMutable) as ContentNodeMutable).right = 2;
      expectedPage.contentNodes.push({
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
      expectedPage.previouslyInsertedContentNodeIndex = 2;
      expectedPage.previouslyInsertedContentNodeOffset = 5;
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
        structureNodes: [SENTINEL_STRUCTURE],
        structureRoot: SENTINEL_INDEX,
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
        contentNodes: [
          SENTINEL_CONTENT,
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
        contentRoot: 1,
        previouslyInsertedContentNodeIndex: 3,
        previouslyInsertedContentNodeOffset: 5,
      });
      const page = getPage();
      const expectedPage = getPage();
      ((expectedPage.buffers[1] as BufferMutable) as BufferMutable).content +=
        "ij\nk";
      (expectedPage.buffers[1] as BufferMutable).lineStarts.push(7);
      (expectedPage.contentNodes[1] as ContentNodeMutable).leftCharCount = 6;
      (expectedPage
        .contentNodes[1] as ContentNodeMutable).leftLineFeedCount = 1;
      expectedPage.contentNodes.push({
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
      (expectedPage.contentNodes[2] as ContentNodeMutable).right = 4;
      (expectedPage.contentNodes[2] as ContentNodeMutable).color = Color.Black;
      (expectedPage.contentNodes[3] as ContentNodeMutable).color = Color.Black;
      expectedPage.previouslyInsertedContentNodeIndex = 4;
      expectedPage.previouslyInsertedContentNodeOffset = 2;
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
        structureNodes: [SENTINEL_STRUCTURE],
        structureRoot: SENTINEL_INDEX,
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
        contentNodes: [
          SENTINEL_CONTENT,
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
        contentRoot: 1,
        previouslyInsertedContentNodeIndex: 2,
        previouslyInsertedContentNodeOffset: 0,
      });
      const page = getPage();
      const expectedPage = getPage();
      (expectedPage.buffers[1] as BufferMutable).content += "ij\nk";
      (expectedPage.buffers[1] as BufferMutable).lineStarts.push(7);
      expectedPage.contentNodes.push({
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
      (expectedPage.contentNodes[2] as ContentNodeMutable).right = 4;
      (expectedPage.contentNodes[2] as ContentNodeMutable).color = Color.Black;
      (expectedPage.contentNodes[3] as ContentNodeMutable).color = Color.Black;
      expectedPage.previouslyInsertedContentNodeIndex = 4;
      expectedPage.previouslyInsertedContentNodeOffset = 9;
      const content: ContentInsert = {
        content: "ij\nk",
        offset: 9,
      };
      const maxBufferLength = 8;
      insertContent(page, content, maxBufferLength);
      expect(page).toStrictEqual(expectedPage);
    });

    test("Scenario 4: insert at the end of a node (test 1)", () => {
      const getPage = (): PageContentMutable => ({
        structureNodes: [SENTINEL_STRUCTURE],
        structureRoot: SENTINEL_INDEX,
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
        contentNodes: [
          SENTINEL_CONTENT,
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
        contentRoot: 1,
        previouslyInsertedContentNodeIndex: 3,
        previouslyInsertedContentNodeOffset: 7,
      });
      const page = getPage();
      const expectedPage = getPage();
      expectedPage.buffers.push({
        isReadOnly: false,
        lineStarts: [0, 3],
        content: "ij\nkl",
      });
      expectedPage.contentNodes.push({
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
      (expectedPage.contentNodes[1] as ContentNodeMutable).leftCharCount = 7;
      (expectedPage
        .contentNodes[1] as ContentNodeMutable).leftLineFeedCount = 1;
      (expectedPage.contentNodes[2] as ContentNodeMutable).right = 4;
      (expectedPage.contentNodes[2] as ContentNodeMutable).color = Color.Black;
      (expectedPage.contentNodes[3] as ContentNodeMutable).color = Color.Black;
      expectedPage.previouslyInsertedContentNodeIndex = 4;
      expectedPage.previouslyInsertedContentNodeOffset = 2;
      const content: ContentInsert = {
        content: "ij\nkl",
        offset: 2,
      };
      const maxBufferLength = 8;
      insertContent(page, content, maxBufferLength);
      expect(page).toStrictEqual(expectedPage);
    });

    test("Scenario 4: insert at the end of a node (test 2)", () => {
      const getPage = (): PageContentMutable => ({
        structureNodes: [SENTINEL_STRUCTURE],
        structureRoot: SENTINEL_INDEX,
        buffers: [
          {
            isReadOnly: true,
            lineStarts: [0, 4],
            content: "abc\nd",
          },
        ],
        contentNodes: [
          SENTINEL_CONTENT,
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
        contentRoot: 1,
        previouslyInsertedContentNodeIndex: 1,
        previouslyInsertedContentNodeOffset: 5,
      });
      const expectedPage = getPage();
      expectedPage.buffers.push({
        isReadOnly: false,
        lineStarts: [0],
        content: "ef",
      });
      expectedPage.contentNodes.push({
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
      (expectedPage.contentNodes[1] as ContentNodeMutable).right = 2;
      const page = getPage();
      const content: ContentInsert = {
        content: "ef",
        offset: 5,
      };
      expectedPage.previouslyInsertedContentNodeIndex = 2;
      expectedPage.previouslyInsertedContentNodeOffset = 5;
      const maxBufferLength = 8;
      insertContent(page, content, maxBufferLength);
      expect(page).toStrictEqual(expectedPage);
    });

    test("Scenario 5: insert at the start of the content", () => {
      const page: PageContent = {
        structureNodes: [SENTINEL_STRUCTURE],
        structureRoot: SENTINEL_INDEX,
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
        contentNodes: [
          SENTINEL_CONTENT,
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
        contentRoot: 1,
        previouslyInsertedContentNodeIndex: 2,
        previouslyInsertedContentNodeOffset: 0,
      };
      const expectedPage: PageContent = {
        structureNodes: [SENTINEL_STRUCTURE],
        structureRoot: SENTINEL_INDEX,
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
        contentNodes: [
          SENTINEL_CONTENT,
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
        contentRoot: 2,
        previouslyInsertedContentNodeIndex: 3,
        previouslyInsertedContentNodeOffset: 0,
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
        structureNodes: [SENTINEL_STRUCTURE],
        structureRoot: SENTINEL_INDEX,
        buffers: [
          {
            isReadOnly: false,
            lineStarts: [0, 4],
            content: "abc\ndef",
          },
        ],
        contentNodes: [
          SENTINEL_CONTENT,
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
        contentRoot: 1,
        previouslyInsertedContentNodeIndex: 2,
        previouslyInsertedContentNodeOffset: 0,
      };
      const expectedPage: PageContent = {
        structureNodes: [SENTINEL_STRUCTURE],
        structureRoot: SENTINEL_INDEX,
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
        contentNodes: [
          SENTINEL_CONTENT,
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
        contentRoot: 2,
        previouslyInsertedContentNodeIndex: 3,
        previouslyInsertedContentNodeOffset: 0,
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
        structureNodes: [SENTINEL_STRUCTURE],
        structureRoot: SENTINEL_INDEX,
        buffers: [
          {
            isReadOnly: true,
            lineStarts: [0, 4],
            content: "abc\nd",
          },
        ],
        contentNodes: [
          SENTINEL_CONTENT,
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
        contentRoot: 1,

        previouslyInsertedContentNodeIndex: null,
        previouslyInsertedContentNodeOffset: null,
      };
      const expectedPage: PageContent = {
        structureNodes: [SENTINEL_STRUCTURE],
        structureRoot: SENTINEL_INDEX,
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
        contentNodes: [
          SENTINEL_CONTENT,
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
        contentRoot: 1,
        previouslyInsertedContentNodeIndex: 2,
        previouslyInsertedContentNodeOffset: 0,
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
        structureNodes: [SENTINEL_STRUCTURE],
        structureRoot: SENTINEL_INDEX,
        buffers: [
          {
            isReadOnly: false,
            lineStarts: [0, 4],
            content: "abc\ndefgh",
          },
        ],
        contentNodes: [
          SENTINEL_CONTENT,
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
        contentRoot: 1,
        newlineFormat: NEWLINE.LF,
        previouslyInsertedContentNodeIndex: 3,
        previouslyInsertedContentNodeOffset: 7,
      };
      const expectedPage: PageContent = {
        structureNodes: [SENTINEL_STRUCTURE],
        structureRoot: SENTINEL_INDEX,
        buffers: [
          {
            isReadOnly: false,
            lineStarts: [0, 4, 12],
            content: "abc\ndefghij\nkl",
          },
        ],
        contentNodes: [
          SENTINEL_CONTENT,
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
        contentRoot: 1,
        newlineFormat: NEWLINE.LF,
        previouslyInsertedContentNodeIndex: 5,
        previouslyInsertedContentNodeOffset: 5,
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
        structureNodes: [SENTINEL_STRUCTURE],
        structureRoot: SENTINEL_INDEX,
        buffers: [
          {
            isReadOnly: false,
            lineStarts: [0, 4],
            content: "abc\ndefgh",
          },
        ],
        contentNodes: [
          SENTINEL_CONTENT,
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
        contentRoot: 1,
        newlineFormat: NEWLINE.LF,
        previouslyInsertedContentNodeIndex: 3,
        previouslyInsertedContentNodeOffset: 7,
      };
      const expectedPage: PageContent = {
        structureNodes: [SENTINEL_STRUCTURE],
        structureRoot: SENTINEL_INDEX,
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
        contentNodes: [
          SENTINEL_CONTENT,
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
        previouslyInsertedContentNodeIndex: 5,
        previouslyInsertedContentNodeOffset: 8,
        contentRoot: 1,
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
        structureNodes: [SENTINEL_STRUCTURE],
        structureRoot: SENTINEL_INDEX,
        buffers: [
          {
            isReadOnly: true,
            lineStarts: [0, 4],
            content: "abc\ndefgh",
          },
        ],
        contentNodes: [
          SENTINEL_CONTENT,
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
        contentRoot: 1,
        newlineFormat: NEWLINE.LF,

        previouslyInsertedContentNodeIndex: null,
        previouslyInsertedContentNodeOffset: null,
      };
      const expectedPage: PageContent = {
        structureNodes: [SENTINEL_STRUCTURE],
        structureRoot: SENTINEL_INDEX,
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
        contentNodes: [
          SENTINEL_CONTENT,
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
        previouslyInsertedContentNodeIndex: 3,
        previouslyInsertedContentNodeOffset: 1,
        newlineFormat: NEWLINE.LF,
        contentRoot: 3,
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
          structureNodes: [SENTINEL_STRUCTURE],
          structureRoot: SENTINEL_INDEX,
          buffers: [],
          contentRoot: 1,
          newlineFormat: NEWLINE.LF,

          previouslyInsertedContentNodeIndex: null,
          previouslyInsertedContentNodeOffset: null,
          contentNodes: [
            SENTINEL_CONTENT,
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
          structureNodes: [SENTINEL_STRUCTURE],
          structureRoot: SENTINEL_INDEX,
          buffers: [],
          contentRoot: 2,
          newlineFormat: NEWLINE.LF,

          previouslyInsertedContentNodeIndex: null,
          previouslyInsertedContentNodeOffset: null,
          contentNodes: [
            SENTINEL_CONTENT,
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
        fixInsert(page as PageContentMutable, 4);
        expect(page).toStrictEqual(expectedPage);
      });

      test("Scenario 2: Left right case", () => {
        const page: PageContent = {
          structureNodes: [SENTINEL_STRUCTURE],
          structureRoot: SENTINEL_INDEX,
          buffers: [],

          previouslyInsertedContentNodeIndex: null,
          previouslyInsertedContentNodeOffset: null,
          newlineFormat: NEWLINE.LF,
          contentRoot: 1,
          contentNodes: [
            SENTINEL_CONTENT,
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
          structureNodes: [SENTINEL_STRUCTURE],
          structureRoot: SENTINEL_INDEX,
          buffers: [],

          previouslyInsertedContentNodeIndex: null,
          previouslyInsertedContentNodeOffset: null,
          newlineFormat: NEWLINE.LF,
          contentRoot: 5,
          contentNodes: [
            SENTINEL_CONTENT,
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
        fixInsert(page as PageContentMutable, 5);
        expect(page).toStrictEqual(expectedPage);
      });

      test("Scenario 3: Right right case", () => {
        const page: PageContent = {
          structureNodes: [SENTINEL_STRUCTURE],
          structureRoot: SENTINEL_INDEX,
          buffers: [],

          previouslyInsertedContentNodeIndex: null,
          previouslyInsertedContentNodeOffset: null,
          newlineFormat: NEWLINE.LF,
          contentRoot: 1,
          contentNodes: [
            SENTINEL_CONTENT,
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
          structureNodes: [SENTINEL_STRUCTURE],
          structureRoot: SENTINEL_INDEX,
          buffers: [],

          previouslyInsertedContentNodeIndex: null,
          previouslyInsertedContentNodeOffset: null,
          newlineFormat: NEWLINE.LF,
          contentRoot: 3,
          contentNodes: [
            SENTINEL_CONTENT,
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
        fixInsert(page as PageContentMutable, 5);
        expect(page).toStrictEqual(expectedPage);
      });

      test("Scenario 4: Right left case", () => {
        const page: PageContent = {
          structureNodes: [SENTINEL_STRUCTURE],
          structureRoot: SENTINEL_INDEX,
          buffers: [],

          previouslyInsertedContentNodeIndex: null,
          previouslyInsertedContentNodeOffset: null,
          newlineFormat: NEWLINE.LF,
          contentRoot: 1,
          contentNodes: [
            SENTINEL_CONTENT,
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
          structureNodes: [SENTINEL_STRUCTURE],
          structureRoot: SENTINEL_INDEX,
          buffers: [],

          previouslyInsertedContentNodeIndex: null,
          previouslyInsertedContentNodeOffset: null,
          newlineFormat: NEWLINE.LF,
          contentRoot: 4,
          contentNodes: [
            SENTINEL_CONTENT,
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
        fixInsert(page as PageContentMutable, 4);
        expect(page).toStrictEqual(expectedPage);
      });
    });

    describe("red uncle cases", () => {
      test("Right red uncle", () => {
        const page: PageContent = {
          structureNodes: [SENTINEL_STRUCTURE],
          structureRoot: SENTINEL_INDEX,
          buffers: [],
          contentNodes: [
            SENTINEL_CONTENT,
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
          contentRoot: 1,

          previouslyInsertedContentNodeIndex: null,
          previouslyInsertedContentNodeOffset: null,
          newlineFormat: NEWLINE.LF,
        };
        const expectedPage: PageContent = {
          structureNodes: [SENTINEL_STRUCTURE],
          structureRoot: SENTINEL_INDEX,
          buffers: [],
          contentNodes: [
            SENTINEL_CONTENT,
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
          contentRoot: 1,

          previouslyInsertedContentNodeIndex: null,
          previouslyInsertedContentNodeOffset: null,
          newlineFormat: NEWLINE.LF,
        };
        fixInsert(page as PageContentMutable, 4);
        expect(page).toStrictEqual(expectedPage);
      });

      test("Left red uncle", () => {
        const page: PageContent = {
          structureNodes: [SENTINEL_STRUCTURE],
          structureRoot: SENTINEL_INDEX,
          buffers: [],
          contentNodes: [
            SENTINEL_CONTENT,
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
          contentRoot: 1,

          previouslyInsertedContentNodeIndex: null,
          previouslyInsertedContentNodeOffset: null,
          newlineFormat: NEWLINE.LF,
        };
        const expectedPage: PageContent = {
          structureNodes: [SENTINEL_STRUCTURE],
          structureRoot: SENTINEL_INDEX,
          buffers: [],
          contentNodes: [
            SENTINEL_CONTENT,
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
          contentRoot: 1,

          previouslyInsertedContentNodeIndex: null,
          previouslyInsertedContentNodeOffset: null,
          newlineFormat: NEWLINE.LF,
        };
        fixInsert(page as PageContentMutable, 4);
        expect(page).toStrictEqual(expectedPage);
      });
    });

    test("Inserted node is root", () => {
      const getPage = (): PageContentMutable => ({
        structureNodes: [SENTINEL_STRUCTURE],
        structureRoot: SENTINEL_INDEX,
        buffers: [
          {
            isReadOnly: false,
            lineStarts: [0],
            content: "a",
          },
        ],
        newlineFormat: NEWLINE.LF,
        contentNodes: [
          SENTINEL_CONTENT,
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
        contentRoot: 1,
        previouslyInsertedContentNodeIndex: 1,
        previouslyInsertedContentNodeOffset: 0,
      });
      const expectedPage = getPage();
      (expectedPage.contentNodes[1] as ContentNodeMutable).color = Color.Black;
      const page = getPage();
      fixInsert(page, 1);
      expect(page).toStrictEqual(expectedPage);
    });
  });
});
