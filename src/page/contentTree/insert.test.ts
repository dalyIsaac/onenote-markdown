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
        buffers: [
          {
            content: "a",
            isReadOnly: false,
            lineStarts: [0],
          },
        ],
        contentNodes: [
          SENTINEL_CONTENT,
          {
            bufferIndex: 0,
            color: Color.Black,
            end: {
              column: 1,
              line: 0,
            },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 1,
            lineFeedCount: 0,
            parent: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
            start: {
              column: 0,
              line: 0,
            },
          },
        ],
        contentRoot: 1,
        newlineFormat: NEWLINE.LF,
        previouslyInsertedContentNodeIndex: 1,
        previouslyInsertedContentNodeOffset: 0,
        structureNodes: [SENTINEL_STRUCTURE],
        structureRoot: SENTINEL_INDEX,
      });
      const expectedPage = getPage();
      (expectedPage.buffers[0] as BufferMutable).content += "b";
      (expectedPage.contentNodes[1] as ContentNodeMutable) = {
        ...(expectedPage.contentNodes[1] as ContentNodeMutable),
        end: {
          column: 2,
          line: 0,
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
        buffers: [
          {
            content: "abc\nd",
            isReadOnly: false,
            lineStarts: [0, 4],
          },
        ],
        contentNodes: [
          SENTINEL_CONTENT,
          {
            bufferIndex: 0,
            color: Color.Black,
            end: {
              column: 1,
              line: 1,
            },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 5,
            lineFeedCount: 1,
            parent: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
            start: {
              column: 0,
              line: 0,
            },
          },
        ],
        contentRoot: 1,
        newlineFormat: NEWLINE.LF,
        previouslyInsertedContentNodeIndex: 1,
        previouslyInsertedContentNodeOffset: 0,
        structureNodes: [SENTINEL_STRUCTURE],
        structureRoot: SENTINEL_INDEX,
      });
      const expectedPage = getPage();
      expectedPage.buffers.push({
        content: "ef",
        isReadOnly: false,
        lineStarts: [0],
      });
      ((expectedPage
        .contentNodes[1] as ContentNodeMutable) as ContentNodeMutable).right = 2;
      expectedPage.contentNodes.push({
        bufferIndex: 1,
        color: Color.Red,
        end: {
          column: 2,
          line: 0,
        },
        left: SENTINEL_INDEX,
        leftCharCount: 0,
        leftLineFeedCount: 0,
        length: 2,
        lineFeedCount: 0,
        parent: 1,
        right: SENTINEL_INDEX,
        start: {
          column: 0,
          line: 0,
        },
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
        buffers: [
          {
            content: "abc\nd",
            isReadOnly: true,
            lineStarts: [0, 4],
          },
          {
            content: "efgh",
            isReadOnly: false,
            lineStarts: [0],
          },
        ],
        contentNodes: [
          SENTINEL_CONTENT,
          {
            bufferIndex: 0,
            color: Color.Black,
            end: {
              column: 1,
              line: 1,
            },
            left: 2,
            leftCharCount: 2,
            leftLineFeedCount: 0,
            length: 5,
            lineFeedCount: 1,
            parent: SENTINEL_INDEX,
            right: 3,
            start: {
              column: 0,
              line: 0,
            },
          },
          {
            bufferIndex: 1,
            color: Color.Red,
            end: { column: 2, line: 0 },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 2,
            lineFeedCount: 0,
            parent: 1,
            right: SENTINEL_INDEX,
            start: { column: 0, line: 0 },
          },
          {
            bufferIndex: 1,
            color: Color.Red,
            end: { column: 4, line: 0 },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 2,
            lineFeedCount: 1,
            parent: 1,
            right: SENTINEL_INDEX,
            start: { column: 2, line: 0 },
          },
        ],
        contentRoot: 1,
        newlineFormat: NEWLINE.LF,
        previouslyInsertedContentNodeIndex: 3,
        previouslyInsertedContentNodeOffset: 5,
        structureNodes: [SENTINEL_STRUCTURE],
        structureRoot: SENTINEL_INDEX,
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
        color: Color.Red,
        end: { column: 1, line: 1 },
        left: SENTINEL_INDEX,
        leftCharCount: 0,
        leftLineFeedCount: 0,
        length: 4,
        lineFeedCount: 1,
        parent: 2,
        right: SENTINEL_INDEX,
        start: { column: 4, line: 0 },
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
        buffers: [
          {
            content: "abc\nd",
            isReadOnly: true,
            lineStarts: [0, 4],
          },
          {
            content: "efgh",
            isReadOnly: false,
            lineStarts: [0],
          },
        ],
        contentNodes: [
          SENTINEL_CONTENT,
          {
            bufferIndex: 0,
            color: Color.Black,
            end: {
              column: 1,
              line: 1,
            },
            left: 3,
            leftCharCount: 2,
            leftLineFeedCount: 0,
            length: 5,
            lineFeedCount: 1,
            parent: SENTINEL_INDEX,
            right: 2,
            start: {
              column: 0,
              line: 0,
            },
          },
          {
            bufferIndex: 1,
            color: Color.Red,
            end: { column: 2, line: 0 },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 2,
            lineFeedCount: 0,
            parent: 1,
            right: SENTINEL_INDEX,
            start: { column: 0, line: 0 },
          },
          {
            bufferIndex: 1,
            color: Color.Red,
            end: { column: 4, line: 0 },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 2,
            lineFeedCount: 0,
            parent: 1,
            right: SENTINEL_INDEX,
            start: { column: 2, line: 0 },
          },
        ],
        contentRoot: 1,
        newlineFormat: NEWLINE.LF,
        previouslyInsertedContentNodeIndex: 2,
        previouslyInsertedContentNodeOffset: 0,
        structureNodes: [SENTINEL_STRUCTURE],
        structureRoot: SENTINEL_INDEX,
      });
      const page = getPage();
      const expectedPage = getPage();
      (expectedPage.buffers[1] as BufferMutable).content += "ij\nk";
      (expectedPage.buffers[1] as BufferMutable).lineStarts.push(7);
      expectedPage.contentNodes.push({
        bufferIndex: 1,
        color: Color.Red,
        end: { column: 1, line: 1 },
        left: SENTINEL_INDEX,
        leftCharCount: 0,
        leftLineFeedCount: 0,
        length: 4,
        lineFeedCount: 1,
        parent: 2,
        right: SENTINEL_INDEX,
        start: { column: 4, line: 0 },
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
        buffers: [
          {
            content: "abc\nd",
            isReadOnly: true,
            lineStarts: [0, 4],
          },
          {
            content: "efgh",
            isReadOnly: false,
            lineStarts: [0],
          },
        ],
        contentNodes: [
          SENTINEL_CONTENT,
          {
            bufferIndex: 0,
            color: Color.Black,
            end: {
              column: 1,
              line: 1,
            },
            left: 2,
            leftCharCount: 2,
            leftLineFeedCount: 0,
            length: 5,
            lineFeedCount: 1,
            parent: SENTINEL_INDEX,
            right: 3,
            start: {
              column: 0,
              line: 0,
            },
          },
          {
            bufferIndex: 1,
            color: Color.Red,
            end: { column: 2, line: 0 },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 2,
            lineFeedCount: 0,
            parent: 1,
            right: SENTINEL_INDEX,
            start: { column: 0, line: 0 },
          },
          {
            bufferIndex: 1,
            color: Color.Red,
            end: { column: 4, line: 0 },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 2,
            lineFeedCount: 0,
            parent: 1,
            right: SENTINEL_INDEX,
            start: { column: 2, line: 0 },
          },
        ],
        contentRoot: 1,
        newlineFormat: NEWLINE.LF,
        previouslyInsertedContentNodeIndex: 3,
        previouslyInsertedContentNodeOffset: 7,
        structureNodes: [SENTINEL_STRUCTURE],
        structureRoot: SENTINEL_INDEX,
      });
      const page = getPage();
      const expectedPage = getPage();
      expectedPage.buffers.push({
        content: "ij\nkl",
        isReadOnly: false,
        lineStarts: [0, 3],
      });
      expectedPage.contentNodes.push({
        bufferIndex: 2,
        color: Color.Red,
        end: { column: 2, line: 1 },
        left: SENTINEL_INDEX,
        leftCharCount: 0,
        leftLineFeedCount: 0,
        length: 5,
        lineFeedCount: 1,
        parent: 2,
        right: SENTINEL_INDEX,
        start: { column: 0, line: 0 },
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
        buffers: [
          {
            content: "abc\nd",
            isReadOnly: true,
            lineStarts: [0, 4],
          },
        ],
        contentNodes: [
          SENTINEL_CONTENT,
          {
            bufferIndex: 0,
            color: Color.Black,
            end: {
              column: 1,
              line: 1,
            },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 5,
            lineFeedCount: 1,
            parent: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
            start: {
              column: 0,
              line: 0,
            },
          },
        ],
        contentRoot: 1,
        newlineFormat: NEWLINE.LF,
        previouslyInsertedContentNodeIndex: 1,
        previouslyInsertedContentNodeOffset: 5,
        structureNodes: [SENTINEL_STRUCTURE],
        structureRoot: SENTINEL_INDEX,
      });
      const expectedPage = getPage();
      expectedPage.buffers.push({
        content: "ef",
        isReadOnly: false,
        lineStarts: [0],
      });
      expectedPage.contentNodes.push({
        bufferIndex: 1,
        color: Color.Red,
        end: { column: 2, line: 0 },
        left: SENTINEL_INDEX,
        leftCharCount: 0,
        leftLineFeedCount: 0,
        length: 2,
        lineFeedCount: 0,
        parent: 1,
        right: SENTINEL_INDEX,
        start: { column: 0, line: 0 },
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
        buffers: [
          {
            content: "abc\nd",
            isReadOnly: true,
            lineStarts: [0, 4],
          },
          {
            content: "ef",
            isReadOnly: false,
            lineStarts: [0],
          },
        ],
        contentNodes: [
          SENTINEL_CONTENT,
          {
            bufferIndex: 0,
            color: Color.Black,
            end: {
              column: 1,
              line: 1,
            },
            left: 2,
            leftCharCount: 2,
            leftLineFeedCount: 0,
            length: 5,
            lineFeedCount: 1,
            parent: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
            start: {
              column: 0,
              line: 0,
            },
          },
          {
            bufferIndex: 1,
            color: Color.Red,
            end: { column: 2, line: 0 },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 2,
            lineFeedCount: 0,
            parent: 1,
            right: SENTINEL_INDEX,
            start: { column: 0, line: 0 },
          },
        ],
        contentRoot: 1,
        newlineFormat: NEWLINE.LF,
        previouslyInsertedContentNodeIndex: 2,
        previouslyInsertedContentNodeOffset: 0,
        structureNodes: [SENTINEL_STRUCTURE],
        structureRoot: SENTINEL_INDEX,
      };
      const expectedPage: PageContent = {
        buffers: [
          {
            content: "abc\nd",
            isReadOnly: true,
            lineStarts: [0, 4],
          },
          {
            content: "efgh\nij",
            isReadOnly: false,
            lineStarts: [0, 5],
          },
        ],
        contentNodes: [
          SENTINEL_CONTENT,
          {
            bufferIndex: 0,
            color: Color.Red,
            end: {
              column: 1,
              line: 1,
            },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 5,
            lineFeedCount: 1,
            parent: 2,
            right: SENTINEL_INDEX,
            start: {
              column: 0,
              line: 0,
            },
          },
          {
            bufferIndex: 1,
            color: Color.Black,
            end: { column: 2, line: 0 },
            left: 3,
            leftCharCount: 5,
            leftLineFeedCount: 1,
            length: 2,
            lineFeedCount: 0,
            parent: SENTINEL_INDEX,
            right: 1,
            start: { column: 0, line: 0 },
          },
          {
            bufferIndex: 1,
            color: Color.Red,
            end: { column: 2, line: 1 },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 5,
            lineFeedCount: 1,
            parent: 2,
            right: SENTINEL_INDEX,
            start: { column: 2, line: 0 },
          },
        ],
        contentRoot: 2,
        newlineFormat: NEWLINE.LF,
        previouslyInsertedContentNodeIndex: 3,
        previouslyInsertedContentNodeOffset: 0,
        structureNodes: [SENTINEL_STRUCTURE],
        structureRoot: SENTINEL_INDEX,
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
            content: "abc\ndef",
            isReadOnly: false,
            lineStarts: [0, 4],
          },
        ],
        contentNodes: [
          SENTINEL_CONTENT,
          {
            bufferIndex: 0,
            color: Color.Black,
            end: {
              column: 1,
              line: 1,
            },
            left: 2,
            leftCharCount: 2,
            leftLineFeedCount: 0,
            length: 5,
            lineFeedCount: 1,
            parent: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
            start: {
              column: 0,
              line: 0,
            },
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
        contentRoot: 1,
        newlineFormat: NEWLINE.LF,
        previouslyInsertedContentNodeIndex: 2,
        previouslyInsertedContentNodeOffset: 0,
        structureNodes: [SENTINEL_STRUCTURE],
        structureRoot: SENTINEL_INDEX,
      };
      const expectedPage: PageContent = {
        buffers: [
          {
            content: "abc\ndef",
            isReadOnly: false,
            lineStarts: [0, 4],
          },
          {
            content: "gh\nij",
            isReadOnly: false,
            lineStarts: [0, 3],
          },
        ],
        contentNodes: [
          SENTINEL_CONTENT,
          {
            bufferIndex: 0,
            color: Color.Red,
            end: {
              column: 1,
              line: 1,
            },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 5,
            lineFeedCount: 1,
            parent: 2,
            right: SENTINEL_INDEX,
            start: {
              column: 0,
              line: 0,
            },
          },
          {
            bufferIndex: 0,
            color: Color.Black,
            end: { column: 3, line: 1 },
            left: 3,
            leftCharCount: 5,
            leftLineFeedCount: 1,
            length: 2,
            lineFeedCount: 0,
            parent: SENTINEL_INDEX,
            right: 1,
            start: { column: 1, line: 1 },
          },
          {
            bufferIndex: 1,
            color: Color.Red,
            end: { column: 2, line: 1 },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 5,
            lineFeedCount: 1,
            parent: 2,
            right: SENTINEL_INDEX,
            start: { column: 0, line: 0 },
          },
        ],
        contentRoot: 2,
        newlineFormat: NEWLINE.LF,
        previouslyInsertedContentNodeIndex: 3,
        previouslyInsertedContentNodeOffset: 0,
        structureNodes: [SENTINEL_STRUCTURE],
        structureRoot: SENTINEL_INDEX,
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
            content: "abc\nd",
            isReadOnly: true,
            lineStarts: [0, 4],
          },
        ],
        contentNodes: [
          SENTINEL_CONTENT,
          {
            bufferIndex: 0,
            color: Color.Black,
            end: {
              column: 1,
              line: 1,
            },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 5,
            lineFeedCount: 1,
            parent: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
            start: {
              column: 0,
              line: 0,
            },
          },
        ],
        contentRoot: 1,
        newlineFormat: NEWLINE.LF,
        previouslyInsertedContentNodeIndex: null,
        previouslyInsertedContentNodeOffset: null,

        structureNodes: [SENTINEL_STRUCTURE],
        structureRoot: SENTINEL_INDEX,
      };
      const expectedPage: PageContent = {
        buffers: [
          {
            content: "abc\nd",
            isReadOnly: true,
            lineStarts: [0, 4],
          },
          {
            content: "ef",
            isReadOnly: false,
            lineStarts: [0],
          },
        ],
        contentNodes: [
          SENTINEL_CONTENT,
          {
            bufferIndex: 0,
            color: Color.Black,
            end: {
              column: 1,
              line: 1,
            },
            left: 2,
            leftCharCount: 2,
            leftLineFeedCount: 0,
            length: 5,
            lineFeedCount: 1,
            parent: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
            start: {
              column: 0,
              line: 0,
            },
          },
          {
            bufferIndex: 1,
            color: Color.Red,
            end: { column: 2, line: 0 },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 2,
            lineFeedCount: 0,
            parent: 1,
            right: SENTINEL_INDEX,
            start: { column: 0, line: 0 },
          },
        ],
        contentRoot: 1,
        newlineFormat: NEWLINE.LF,
        previouslyInsertedContentNodeIndex: 2,
        previouslyInsertedContentNodeOffset: 0,
        structureNodes: [SENTINEL_STRUCTURE],
        structureRoot: SENTINEL_INDEX,
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
            content: "abc\ndefgh",
            isReadOnly: false,
            lineStarts: [0, 4],
          },
        ],
        contentNodes: [
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
            end: { column: 5, line: 1 },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 2,
            lineFeedCount: 0,
            parent: 1,
            right: SENTINEL_INDEX,
            start: { column: 3, line: 1 },
          },
        ],
        contentRoot: 1,
        newlineFormat: NEWLINE.LF,
        previouslyInsertedContentNodeIndex: 3,
        previouslyInsertedContentNodeOffset: 7,
        structureNodes: [SENTINEL_STRUCTURE],
        structureRoot: SENTINEL_INDEX,
      };
      const expectedPage: PageContent = {
        buffers: [
          {
            content: "abc\ndefghij\nkl",
            isReadOnly: false,
            lineStarts: [0, 4, 12],
          },
        ],
        contentNodes: [
          SENTINEL_CONTENT,
          {
            bufferIndex: 0,
            color: Color.Black,
            end: { column: 3, line: 0 },
            left: 2,
            leftCharCount: 2,
            leftLineFeedCount: 0,
            length: 3,
            lineFeedCount: 0,
            parent: SENTINEL_INDEX,
            right: 4,
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
            parent: 1,
            right: SENTINEL_INDEX,
            start: { column: 1, line: 1 },
          },
          {
            bufferIndex: 0,
            color: Color.Red,
            end: { column: 5, line: 1 },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 2,
            lineFeedCount: 0,
            parent: 4,
            right: SENTINEL_INDEX,
            start: { column: 3, line: 1 },
          },
          {
            bufferIndex: 0,
            color: Color.Black,
            end: { column: 1, line: 1 },
            left: 5,
            leftCharCount: 5,
            leftLineFeedCount: 1,
            length: 2,
            lineFeedCount: 1,
            parent: 1,
            right: 3,
            start: { column: 3, line: 0 },
          },
          {
            bufferIndex: 0,
            color: Color.Red,
            end: { column: 2, line: 2 },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 5,
            lineFeedCount: 1,
            parent: 4,
            right: SENTINEL_INDEX,
            start: { column: 5, line: 1 },
          },
        ],
        contentRoot: 1,
        newlineFormat: NEWLINE.LF,
        previouslyInsertedContentNodeIndex: 5,
        previouslyInsertedContentNodeOffset: 5,
        structureNodes: [SENTINEL_STRUCTURE],
        structureRoot: SENTINEL_INDEX,
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
            content: "abc\ndefgh",
            isReadOnly: false,
            lineStarts: [0, 4],
          },
        ],
        contentNodes: [
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
            end: { column: 5, line: 1 },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 2,
            lineFeedCount: 0,
            parent: 1,
            right: SENTINEL_INDEX,
            start: { column: 3, line: 1 },
          },
        ],
        contentRoot: 1,
        newlineFormat: NEWLINE.LF,
        previouslyInsertedContentNodeIndex: 3,
        previouslyInsertedContentNodeOffset: 7,
        structureNodes: [SENTINEL_STRUCTURE],
        structureRoot: SENTINEL_INDEX,
      };
      const expectedPage: PageContent = {
        buffers: [
          {
            content: "abc\ndefgh",
            isReadOnly: false,
            lineStarts: [0, 4],
          },
          {
            content: "ij\nkl\nmn",
            isReadOnly: false,
            lineStarts: [0, 3, 6],
          },
        ],
        contentNodes: [
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
            right: 5,
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
            parent: 1,
            right: SENTINEL_INDEX,
            start: { column: 1, line: 1 },
          },
          {
            bufferIndex: 0,
            color: Color.Red,
            end: { column: 4, line: 1 },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 1,
            lineFeedCount: 0,
            parent: 5,
            right: SENTINEL_INDEX,
            start: { column: 3, line: 1 },
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
            parent: 5,
            right: SENTINEL_INDEX,
            start: { column: 4, line: 1 },
          },
          {
            bufferIndex: 1,
            color: Color.Black,
            end: { column: 2, line: 2 },
            left: 3,
            leftCharCount: 1,
            leftLineFeedCount: 0,
            length: 8,
            lineFeedCount: 2,
            parent: 1,
            right: 4,
            start: { column: 0, line: 0 },
          },
        ],
        contentRoot: 1,
        newlineFormat: NEWLINE.LF,
        previouslyInsertedContentNodeIndex: 5,
        previouslyInsertedContentNodeOffset: 8,
        structureNodes: [SENTINEL_STRUCTURE],
        structureRoot: SENTINEL_INDEX,
      };
      const content: ContentInsert = {
        content: "ij\nkl\nmn",
        offset: 8,
      };
      const maxBufferLength = 16;
      insertContent(page as PageContentMutable, content, maxBufferLength);
      expect(page).toStrictEqual(expectedPage);
    });

    test("Scenario 8: insert inside a node's content (test 2", () => {
      const page: PageContent = {
        buffers: [
          {
            content: "abc\ndefgh",
            isReadOnly: true,
            lineStarts: [0, 4],
          },
        ],
        contentNodes: [
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
        ],
        contentRoot: 1,
        newlineFormat: NEWLINE.LF,
        previouslyInsertedContentNodeIndex: null,
        previouslyInsertedContentNodeOffset: null,

        structureNodes: [SENTINEL_STRUCTURE],
        structureRoot: SENTINEL_INDEX,
      };
      const expectedPage: PageContent = {
        buffers: [
          {
            content: "abc\ndefgh",
            isReadOnly: true,
            lineStarts: [0, 4],
          },
          {
            content: "ef",
            isReadOnly: false,
            lineStarts: [0],
          },
        ],
        contentNodes: [
          SENTINEL_CONTENT,
          {
            bufferIndex: 0,
            color: Color.Red,
            end: { column: 1, line: 0 },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 1,
            lineFeedCount: 0,
            parent: 3,
            right: SENTINEL_INDEX,
            start: { column: 0, line: 0 },
          },
          {
            bufferIndex: 0,
            color: Color.Red,
            end: { column: 1, line: 1 },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 4,
            lineFeedCount: 1,
            parent: 3,
            right: SENTINEL_INDEX,
            start: { column: 1, line: 0 },
          },
          {
            bufferIndex: 1,
            color: Color.Black,
            end: { column: 2, line: 0 },
            left: 1,
            leftCharCount: 1,
            leftLineFeedCount: 0,
            length: 2,
            lineFeedCount: 0,
            parent: SENTINEL_INDEX,
            right: 2,
            start: { column: 0, line: 0 },
          },
        ],
        contentRoot: 3,
        newlineFormat: NEWLINE.LF,
        previouslyInsertedContentNodeIndex: 3,
        previouslyInsertedContentNodeOffset: 1,
        structureNodes: [SENTINEL_STRUCTURE],
        structureRoot: SENTINEL_INDEX,
      };
      const content: ContentInsert = {
        content: "ef",
        offset: 1,
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
          contentNodes: [
            SENTINEL_CONTENT,
            {
              // g
              bufferIndex: 0,
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
              right: 3,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // p,
              bufferIndex: 1,
              color: Color.Red,
              end: {
                column: 0,
                line: 0,
              },
              left: 4,
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              parent: 1,
              right: 5,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // u
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
              parent: 1,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // x
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
              // T3
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
              parent: 2,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
          ],
          contentRoot: 1,
          newlineFormat: NEWLINE.LF,
          previouslyInsertedContentNodeIndex: null,

          previouslyInsertedContentNodeOffset: null,
          structureNodes: [SENTINEL_STRUCTURE],
          structureRoot: SENTINEL_INDEX,
        };
        const expectedPage: PageContent = {
          buffers: [],
          contentNodes: [
            SENTINEL_CONTENT,
            {
              // g
              bufferIndex: 0,
              color: Color.Red,
              end: {
                column: 0,
                line: 0,
              },
              left: 5,
              leftCharCount: 10,
              leftLineFeedCount: 2,
              length: 10,
              lineFeedCount: 2,
              parent: 2,
              right: 3,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // p
              bufferIndex: 1,
              color: Color.Black,
              end: {
                column: 0,
                line: 0,
              },
              left: 4,
              leftCharCount: 10,
              leftLineFeedCount: 2,
              length: 10,
              lineFeedCount: 2,
              parent: SENTINEL_INDEX,
              right: 1,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // u
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
              parent: 1,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // x
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
              // T3
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
              parent: 1,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
          ],
          contentRoot: 2,
          newlineFormat: NEWLINE.LF,
          previouslyInsertedContentNodeIndex: null,

          previouslyInsertedContentNodeOffset: null,
          structureNodes: [SENTINEL_STRUCTURE],
          structureRoot: SENTINEL_INDEX,
        };
        fixInsert(page as PageContentMutable, 4);
        expect(page).toStrictEqual(expectedPage);
      });

      test("Scenario 2: Left right case", () => {
        const page: PageContent = {
          buffers: [],
          contentNodes: [
            SENTINEL_CONTENT,
            {
              // g
              bufferIndex: 0,
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
              right: 3,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // p
              bufferIndex: 1,
              color: Color.Red,
              end: {
                column: 0,
                line: 0,
              },
              left: 4,
              leftCharCount: 10,
              leftLineFeedCount: 2,
              length: 10,
              lineFeedCount: 2,
              parent: 1,
              right: 5,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // u
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
              parent: 1,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // T1
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
              // x
              bufferIndex: 4,
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
          contentRoot: 1,

          newlineFormat: NEWLINE.LF,
          previouslyInsertedContentNodeIndex: null,
          previouslyInsertedContentNodeOffset: null,
          structureNodes: [SENTINEL_STRUCTURE],
          structureRoot: SENTINEL_INDEX,
        };
        const expectedPage: PageContent = {
          buffers: [],
          contentNodes: [
            SENTINEL_CONTENT,
            {
              // g
              bufferIndex: 0,
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
              parent: 5,
              right: 3,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // p
              bufferIndex: 1,
              color: Color.Red,
              end: {
                column: 0,
                line: 0,
              },
              left: 4,
              leftCharCount: 10,
              leftLineFeedCount: 2,
              length: 10,
              lineFeedCount: 2,
              parent: 5,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // u
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
              parent: 1,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // T1
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
              // x
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
              right: 1,
              start: {
                column: 0,
                line: 0,
              },
            },
          ],
          contentRoot: 5,

          newlineFormat: NEWLINE.LF,
          previouslyInsertedContentNodeIndex: null,
          previouslyInsertedContentNodeOffset: null,
          structureNodes: [SENTINEL_STRUCTURE],
          structureRoot: SENTINEL_INDEX,
        };
        fixInsert(page as PageContentMutable, 5);
        expect(page).toStrictEqual(expectedPage);
      });

      test("Scenario 3: Right right case", () => {
        const page: PageContent = {
          buffers: [],
          contentNodes: [
            SENTINEL_CONTENT,
            {
              // g
              bufferIndex: 0,
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
              right: 3,
              start: {
                column: 0,
                line: 0,
              },
            },
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
              parent: 1,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // p
              bufferIndex: 2,
              color: Color.Red,
              end: {
                column: 0,
                line: 0,
              },
              left: 4,
              leftCharCount: 10,
              leftLineFeedCount: 2,
              length: 10,
              lineFeedCount: 2,
              parent: 1,
              right: 5,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // T3
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
              parent: 3,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // x
              bufferIndex: 4,
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
              parent: 3,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
          ],
          contentRoot: 1,

          newlineFormat: NEWLINE.LF,
          previouslyInsertedContentNodeIndex: null,
          previouslyInsertedContentNodeOffset: null,
          structureNodes: [SENTINEL_STRUCTURE],
          structureRoot: SENTINEL_INDEX,
        };
        const expectedPage: PageContent = {
          buffers: [],
          contentNodes: [
            SENTINEL_CONTENT,
            {
              // g
              bufferIndex: 0,
              color: Color.Red,
              end: {
                column: 0,
                line: 0,
              },
              left: 2,
              leftCharCount: 10,
              leftLineFeedCount: 2,
              length: 10,
              lineFeedCount: 2,
              parent: 3,
              right: 4,
              start: {
                column: 0,
                line: 0,
              },
            },
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
              parent: 1,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // p
              bufferIndex: 2,
              color: Color.Black,
              end: {
                column: 0,
                line: 0,
              },
              left: 1,
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
              // T3
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
              parent: 1,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // x
              bufferIndex: 4,
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
              parent: 3,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
          ],
          contentRoot: 3,

          newlineFormat: NEWLINE.LF,
          previouslyInsertedContentNodeIndex: null,
          previouslyInsertedContentNodeOffset: null,
          structureNodes: [SENTINEL_STRUCTURE],
          structureRoot: SENTINEL_INDEX,
        };
        fixInsert(page as PageContentMutable, 5);
        expect(page).toStrictEqual(expectedPage);
      });

      test("Scenario 4: Right left case", () => {
        const page: PageContent = {
          buffers: [],
          contentNodes: [
            SENTINEL_CONTENT,
            {
              // g
              bufferIndex: 0,
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
              right: 3,
              start: {
                column: 0,
                line: 0,
              },
            },
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
              parent: 1,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // p
              bufferIndex: 2,
              color: Color.Red,
              end: {
                column: 0,
                line: 0,
              },
              left: 4,
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 10,
              lineFeedCount: 2,
              parent: 1,
              right: 5,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // x
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
              parent: 3,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // T5
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
          contentRoot: 1,

          newlineFormat: NEWLINE.LF,
          previouslyInsertedContentNodeIndex: null,
          previouslyInsertedContentNodeOffset: null,
          structureNodes: [SENTINEL_STRUCTURE],
          structureRoot: SENTINEL_INDEX,
        };
        const expectedPage: PageContent = {
          buffers: [],
          contentNodes: [
            SENTINEL_CONTENT,
            {
              // g
              bufferIndex: 0,
              color: Color.Red,
              end: {
                column: 0,
                line: 0,
              },
              left: 2,
              leftCharCount: 10,
              leftLineFeedCount: 2,
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
              parent: 1,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // p
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
              parent: 4,
              right: 5,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // x
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
              right: 3,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // T5
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
          contentRoot: 4,

          newlineFormat: NEWLINE.LF,
          previouslyInsertedContentNodeIndex: null,
          previouslyInsertedContentNodeOffset: null,
          structureNodes: [SENTINEL_STRUCTURE],
          structureRoot: SENTINEL_INDEX,
        };
        fixInsert(page as PageContentMutable, 4);
        expect(page).toStrictEqual(expectedPage);
      });
    });

    describe("red uncle cases", () => {
      test("Right red uncle", () => {
        const page: PageContent = {
          buffers: [],
          contentNodes: [
            SENTINEL_CONTENT,
            {
              // g
              bufferIndex: 0,
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
              right: 3,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // p
              bufferIndex: 1,
              color: Color.Red,
              end: {
                column: 0,
                line: 0,
              },
              left: 4,
              leftCharCount: 10,
              leftLineFeedCount: 2,
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
              // u
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
              // x
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
          contentRoot: 1,
          newlineFormat: NEWLINE.LF,
          previouslyInsertedContentNodeIndex: null,

          previouslyInsertedContentNodeOffset: null,
          structureNodes: [SENTINEL_STRUCTURE],
          structureRoot: SENTINEL_INDEX,
        };
        const expectedPage: PageContent = {
          buffers: [],
          contentNodes: [
            SENTINEL_CONTENT,
            {
              // g
              bufferIndex: 0,
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
              right: 3,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // p
              bufferIndex: 1,
              color: Color.Black,
              end: {
                column: 0,
                line: 0,
              },
              left: 4,
              leftCharCount: 10,
              leftLineFeedCount: 2,
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
              // u
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
              parent: 1,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // x
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
          contentRoot: 1,
          newlineFormat: NEWLINE.LF,
          previouslyInsertedContentNodeIndex: null,

          previouslyInsertedContentNodeOffset: null,
          structureNodes: [SENTINEL_STRUCTURE],
          structureRoot: SENTINEL_INDEX,
        };
        fixInsert(page as PageContentMutable, 4);
        expect(page).toStrictEqual(expectedPage);
      });

      test("Left red uncle", () => {
        const page: PageContent = {
          buffers: [],
          contentNodes: [
            SENTINEL_CONTENT,
            {
              // g
              bufferIndex: 0,
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
              right: 3,
              start: {
                column: 0,
                line: 0,
              },
            },
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
              parent: 1,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // p
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
              right: 4,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // x
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
              parent: 3,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
          ],
          contentRoot: 1,
          newlineFormat: NEWLINE.LF,
          previouslyInsertedContentNodeIndex: null,

          previouslyInsertedContentNodeOffset: null,
          structureNodes: [SENTINEL_STRUCTURE],
          structureRoot: SENTINEL_INDEX,
        };
        const expectedPage: PageContent = {
          buffers: [],
          contentNodes: [
            SENTINEL_CONTENT,
            {
              // g
              bufferIndex: 0,
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
              right: 3,
              start: {
                column: 0,
                line: 0,
              },
            },
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
              parent: 1,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // p
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
              parent: 1,
              right: 4,
              start: {
                column: 0,
                line: 0,
              },
            },
            {
              // x
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
              parent: 3,
              right: SENTINEL_INDEX,
              start: {
                column: 0,
                line: 0,
              },
            },
          ],
          contentRoot: 1,
          newlineFormat: NEWLINE.LF,
          previouslyInsertedContentNodeIndex: null,

          previouslyInsertedContentNodeOffset: null,
          structureNodes: [SENTINEL_STRUCTURE],
          structureRoot: SENTINEL_INDEX,
        };
        fixInsert(page as PageContentMutable, 4);
        expect(page).toStrictEqual(expectedPage);
      });
    });

    test("Inserted node is root", () => {
      const getPage = (): PageContentMutable => ({
        buffers: [
          {
            content: "a",
            isReadOnly: false,
            lineStarts: [0],
          },
        ],
        contentNodes: [
          SENTINEL_CONTENT,
          {
            bufferIndex: 0,
            color: Color.Red,
            end: {
              column: 1,
              line: 0,
            },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 1,
            lineFeedCount: 0,
            parent: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
            start: {
              column: 0,
              line: 0,
            },
          },
        ],
        contentRoot: 1,
        newlineFormat: NEWLINE.LF,
        previouslyInsertedContentNodeIndex: 1,
        previouslyInsertedContentNodeOffset: 0,
        structureNodes: [SENTINEL_STRUCTURE],
        structureRoot: SENTINEL_INDEX,
      });
      const expectedPage = getPage();
      (expectedPage.contentNodes[1] as ContentNodeMutable).color = Color.Black;
      const page = getPage();
      fixInsert(page, 1);
      expect(page).toStrictEqual(expectedPage);
    });
  });
});
