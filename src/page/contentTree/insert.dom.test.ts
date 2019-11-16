/* eslint-disable max-len */

import { Color, PageContent, StatePages } from "../pageModel";
import { SENTINEL_STRUCTURE } from "../structureTree/tree";
import { SENTINEL_INDEX, EMPTY_TREE_ROOT } from "../tree/tree";
import { Buffer, ContentNode } from "./contentModel";
import { insertContentDOM } from "./insert.dom";
import { MAX_BUFFER_LENGTH, SENTINEL_CONTENT } from "./tree";
import pageReducer from "../reducer";
import {
  insertContentDOM as InsertContentDOMActionCreator,
  InsertContentDOM,
} from "./actions";
import { TagType } from "../structureTree/structureModel";

Date.now = jest.fn().mockReturnValue(1234567890);

describe("Functions for inserting content into the piece table/red-black tree.", (): void => {
  test("Scenario 1: insert at the end of the previously inserted node", (): void => {
    const getPage = (): PageContent => ({
      buffers: [
        {
          content: "a",
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
        root: 1,
      },
      previouslyInsertedContentNodeIndex: 1,
      previouslyInsertedContentNodeOffset: 0,
      structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
    });
    const expectedPage = getPage();
    (expectedPage.buffers[0] as Buffer).content += "b";
    (expectedPage.content.nodes[1] as ContentNode) = {
      ...(expectedPage.content.nodes[1] as ContentNode),
      end: {
        column: 2,
        line: 0,
      },
      length: 2,
      color: Color.Black,
    };
    const page = getPage();
    const action: InsertContentDOM = {
      content: "b",
      end: {
        nodeIndex: 1,
        nodeLocalOffset: 1,
      },
      localOffset: 1,
      start: {
        nodeIndex: 1,
        nodeLocalOffset: 0,
      },
      structureNodeIndex: 0,
    };
    insertContentDOM(page, action, MAX_BUFFER_LENGTH);
    expect(page).toStrictEqual(expectedPage);
  });

  test("Scenario 2: insert at the end of the previously inserted node", (): void => {
    const getPage = (): PageContent => ({
      buffers: [
        {
          content: "abc\nd",
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
        root: 1,
      },

      previouslyInsertedContentNodeIndex: 1,
      previouslyInsertedContentNodeOffset: 0,
      structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
    });
    const expectedPage = getPage();
    expectedPage.buffers.push({
      content: "ef",
      isReadOnly: false,
      lineStarts: [0],
    });
    ((expectedPage.content.nodes[1] as ContentNode) as ContentNode).right = 2;
    expectedPage.content.nodes.push({
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
    expectedPage.previouslyInsertedContentNodeOffset = 2;
    const page = getPage();
    const action: InsertContentDOM = {
      content: "ef",
      end: {
        nodeIndex: 1,
        nodeLocalOffset: 5,
      },
      localOffset: 5,
      start: {
        nodeIndex: 1,
        nodeLocalOffset: 0,
      },
      structureNodeIndex: 0,
    };
    const maxBufferLength = 5;
    insertContentDOM(page, action, maxBufferLength);
    expect(page).toStrictEqual(expectedPage);
  });

  test("Scenario 3: insert at the end of a node (test 1)", (): void => {
    const getPage = (): PageContent => ({
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
      content: {
        nodes: [
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
        root: 1,
      },
      previouslyInsertedContentNodeIndex: null,
      previouslyInsertedContentNodeOffset: null,
      structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
    });
    const page = getPage();
    const expectedPage = getPage();
    ((expectedPage.buffers[1] as Buffer) as Buffer).content += "ij\nk";
    (expectedPage.buffers[1] as Buffer).lineStarts.push(7);
    (expectedPage.content.nodes[1] as ContentNode).leftCharCount = 6;
    (expectedPage.content.nodes[1] as ContentNode).leftLineFeedCount = 1;
    expectedPage.content.nodes.push({
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
    (expectedPage.content.nodes[2] as ContentNode).right = 4;
    (expectedPage.content.nodes[2] as ContentNode).color = Color.Black;
    (expectedPage.content.nodes[3] as ContentNode).color = Color.Black;
    expectedPage.previouslyInsertedContentNodeIndex = 4;
    expectedPage.previouslyInsertedContentNodeOffset = 4;
    const action: InsertContentDOM = {
      content: "ij\nk",
      end: {
        nodeIndex: 2,
        nodeLocalOffset: 2,
      },
      localOffset: 2,
      start: {
        nodeIndex: 2,
        nodeLocalOffset: 0,
      },
      structureNodeIndex: 0,
    };
    const maxBufferLength = 8;
    insertContentDOM(page, action, maxBufferLength);
    expect(page).toStrictEqual(expectedPage);
  });

  test("Scenario 3: insert at the end of a node (test 2)", (): void => {
    const getPage = (): PageContent => ({
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
      content: {
        nodes: [
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
        root: 1,
      },
      previouslyInsertedContentNodeIndex: null,
      previouslyInsertedContentNodeOffset: null,
      structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
    });
    const page = getPage();
    const expectedPage = getPage();
    (expectedPage.buffers[1] as Buffer).content += "ij\nk";
    (expectedPage.buffers[1] as Buffer).lineStarts.push(7);
    expectedPage.content.nodes.push({
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
    (expectedPage.content.nodes[2] as ContentNode).right = 4;
    (expectedPage.content.nodes[2] as ContentNode).color = Color.Black;
    (expectedPage.content.nodes[3] as ContentNode).color = Color.Black;
    expectedPage.previouslyInsertedContentNodeIndex = 4;
    expectedPage.previouslyInsertedContentNodeOffset = 4;
    const action: InsertContentDOM = {
      content: "ij\nk",
      end: {
        nodeIndex: 2,
        nodeLocalOffset: 2,
      },
      localOffset: 2,
      start: {
        nodeIndex: 2,
        nodeLocalOffset: 0,
      },
      structureNodeIndex: 0,
    };
    const maxBufferLength = 8;
    insertContentDOM(page, action, maxBufferLength);
    expect(page).toStrictEqual(expectedPage);
  });

  test("Scenario 4: insert at the end of a node (test 1)", (): void => {
    const getPage = (): PageContent => ({
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
      content: {
        nodes: [
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
        root: 1,
      },
      previouslyInsertedContentNodeIndex: 2,
      previouslyInsertedContentNodeOffset: 2,
      structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
    });
    const page = getPage();
    const expectedPage = getPage();
    expectedPage.buffers.push({
      content: "ij\nkl",
      isReadOnly: false,
      lineStarts: [0, 3],
    });
    expectedPage.content.nodes.push({
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
    (expectedPage.content.nodes[1] as ContentNode).leftCharCount = 7;
    (expectedPage.content.nodes[1] as ContentNode).leftLineFeedCount = 1;
    (expectedPage.content.nodes[2] as ContentNode).right = 4;
    (expectedPage.content.nodes[2] as ContentNode).color = Color.Black;
    (expectedPage.content.nodes[3] as ContentNode).color = Color.Black;
    expectedPage.previouslyInsertedContentNodeIndex = 4;
    expectedPage.previouslyInsertedContentNodeOffset = 5;
    const action: InsertContentDOM = {
      content: "ij\nkl",
      end: {
        nodeIndex: 2,
        nodeLocalOffset: 2,
      },
      localOffset: 2,
      start: {
        nodeIndex: 2,
        nodeLocalOffset: 0,
      },
      structureNodeIndex: 0,
    };
    const maxBufferLength = 8;
    insertContentDOM(page, action, maxBufferLength);
    expect(page).toStrictEqual(expectedPage);
  });

  test("Scenario 4: insert at the end of a node (test 2)", (): void => {
    const getPage = (): PageContent => ({
      buffers: [
        {
          content: "abc\nd",
          isReadOnly: true,
          lineStarts: [0, 4],
        },
      ],
      content: {
        nodes: [
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
        root: 1,
      },

      previouslyInsertedContentNodeIndex: null,
      previouslyInsertedContentNodeOffset: null,
      structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
    });
    const expectedPage = getPage();
    expectedPage.buffers.push({
      content: "ef",
      isReadOnly: false,
      lineStarts: [0],
    });
    expectedPage.content.nodes.push({
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
    (expectedPage.content.nodes[1] as ContentNode).right = 2;
    const page = getPage();
    const action: InsertContentDOM = {
      content: "ef",
      end: {
        nodeIndex: 1,
        nodeLocalOffset: 5,
      },
      localOffset: 5,
      start: {
        nodeIndex: 1,
        nodeLocalOffset: 0,
      },
      structureNodeIndex: 0,
    };
    expectedPage.previouslyInsertedContentNodeIndex = 2;
    expectedPage.previouslyInsertedContentNodeOffset = 2;
    const maxBufferLength = 8;
    insertContentDOM(page, action, maxBufferLength);
    expect(page).toStrictEqual(expectedPage);
  });

  test("Scenario 5: insert at the start of the content", (): void => {
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
      content: {
        nodes: [
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
        root: 1,
      },
      previouslyInsertedContentNodeIndex: null,
      previouslyInsertedContentNodeOffset: null,
      structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
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
      content: {
        nodes: [
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
        root: 2,
      },
      previouslyInsertedContentNodeIndex: 3,
      previouslyInsertedContentNodeOffset: 5,
      structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
    };
    const action: InsertContentDOM = {
      content: "gh\nij",
      end: {
        nodeIndex: 2,
        nodeLocalOffset: 2,
      },
      localOffset: 0,
      start: {
        nodeIndex: 2,
        nodeLocalOffset: 0,
      },
      structureNodeIndex: 0,
    };
    const maxBufferLength = 8;
    insertContentDOM(page as PageContent, action, maxBufferLength);
    expect(page).toStrictEqual(expectedPage);
  });

  test("Scenario 6: insert at the start of the content (test 1)", (): void => {
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
        root: 1,
      },
      previouslyInsertedContentNodeIndex: 2,
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
        {
          content: "gh\nij",
          isReadOnly: false,
          lineStarts: [0, 3],
        },
      ],
      content: {
        nodes: [
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
        root: 2,
      },
      previouslyInsertedContentNodeIndex: 3,
      previouslyInsertedContentNodeOffset: 5,
      structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
    };
    const action: InsertContentDOM = {
      content: "gh\nij",
      end: {
        nodeIndex: 2,
        nodeLocalOffset: 2,
      },
      localOffset: 0,
      start: {
        nodeIndex: 2,
        nodeLocalOffset: 0,
      },
      structureNodeIndex: 0,
    };
    const maxBufferLength = 8;
    insertContentDOM(page, action, maxBufferLength);
    expect(page).toStrictEqual(expectedPage);
  });

  test("Scenario 6: insert at the start of the content (test 2)", (): void => {
    const page: PageContent = {
      buffers: [
        {
          content: "abc\nd",
          isReadOnly: true,
          lineStarts: [0, 4],
        },
      ],
      content: {
        nodes: [
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
        root: 1,
      },
      previouslyInsertedContentNodeIndex: null,
      previouslyInsertedContentNodeOffset: null,
      structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
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
      content: {
        nodes: [
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
        root: 1,
      },
      previouslyInsertedContentNodeIndex: 2,
      previouslyInsertedContentNodeOffset: 2,
      structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
    };
    const action: InsertContentDOM = {
      content: "ef",
      end: {
        nodeIndex: 1,
        nodeLocalOffset: 5,
      },
      localOffset: 0,
      start: {
        nodeIndex: 1,
        nodeLocalOffset: 0,
      },
      structureNodeIndex: 0,
    };
    const maxBufferLength = 8;
    insertContentDOM(page, action, maxBufferLength);
    expect(page).toStrictEqual(expectedPage);
  });

  // TODO: Check if Scenario 6, test 3 is still relevant
  // ! Scenario 6, test 3 has disappeared somewhere. Must have happened when
  // ! experimenting with the old React editors. The commit it relates to
  // ! can be found here: 421d0f341b459edd90e4ba6b3eef2f590f8e7765

  test("Scenario 7: insert inside a node's content", (): void => {
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
        root: 1,
      },
      previouslyInsertedContentNodeIndex: 3,
      previouslyInsertedContentNodeOffset: 7,
      structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
    };
    const expectedPage: PageContent = {
      buffers: [
        {
          content: "abc\ndefghij\nkl",
          isReadOnly: false,
          lineStarts: [0, 4, 12],
        },
      ],
      content: {
        nodes: [
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
        root: 1,
      },
      previouslyInsertedContentNodeIndex: 5,
      previouslyInsertedContentNodeOffset: 5,
      structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
    };
    const action: InsertContentDOM = {
      content: "ij\nkl",
      end: {
        nodeIndex: 1,
        nodeLocalOffset: 5,
      },
      localOffset: 3,
      start: {
        nodeIndex: 1,
        nodeLocalOffset: 0,
      },
      structureNodeIndex: 0,
    };
    const maxBufferLength = 16;
    insertContentDOM(page, action, maxBufferLength);
    expect(page).toStrictEqual(expectedPage);
  });

  // TODO: Check if Scenario 7, test 2 is still relevant
  // ! Scenario 7, test 2 has disappeared somewhere. Must have happened when
  // ! experimenting with the old React editors. The commit it relates to
  // ! is completely gone.

  test("Scenario 8: insert inside a node's content (test 1)", (): void => {
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
        root: 1,
      },
      previouslyInsertedContentNodeIndex: 3,
      previouslyInsertedContentNodeOffset: 7,
      structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
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
        root: 1,
      },
      previouslyInsertedContentNodeIndex: 5,
      previouslyInsertedContentNodeOffset: 8,
      structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
    };
    const action: InsertContentDOM = {
      content: "ij\nkl\nmn",
      end: {
        nodeIndex: 3,
        nodeLocalOffset: 2,
      },
      localOffset: 1,
      start: {
        nodeIndex: 3,
        nodeLocalOffset: 0,
      },
      structureNodeIndex: 0,
    };
    const maxBufferLength = 16;
    insertContentDOM(page, action, maxBufferLength);
    expect(page).toStrictEqual(expectedPage);
  });

  test("Scenario 8: insert inside a node's content (test 2", (): void => {
    const page: PageContent = {
      buffers: [
        {
          content: "abc\ndefgh",
          isReadOnly: true,
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
          isReadOnly: true,
          lineStarts: [0, 4],
        },
        {
          content: "ef",
          isReadOnly: false,
          lineStarts: [0],
        },
      ],
      content: {
        nodes: [
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
        root: 3,
      },
      previouslyInsertedContentNodeIndex: 3,
      previouslyInsertedContentNodeOffset: 2,
      structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
    };
    const action: InsertContentDOM = {
      content: "ef",
      end: {
        nodeIndex: 1,
        nodeLocalOffset: 5,
      },
      localOffset: 1,
      start: {
        nodeIndex: 1,
        nodeLocalOffset: 0,
      },
      structureNodeIndex: 0,
    };
    const maxBufferLength = 8;
    insertContentDOM(page, action, maxBufferLength);
    expect(page).toStrictEqual(expectedPage);
  });

  test("Scenario 9: insert a node into an empty tree.", (): void => {
    const state: StatePages = {
      pageId: {
        buffers: [],
        content: { nodes: [SENTINEL_CONTENT], root: EMPTY_TREE_ROOT },
        previouslyInsertedContentNodeIndex: null,
        previouslyInsertedContentNodeOffset: null,
        structure: { nodes: [SENTINEL_STRUCTURE], root: EMPTY_TREE_ROOT },
      },
    };

    const expectedState: StatePages = {
      pageId: {
        buffers: [
          {
            content: "Hello\nWorld",
            isReadOnly: false,
            lineStarts: [0, 6],
          },
        ],
        content: {
          nodes: [
            SENTINEL_CONTENT,
            {
              bufferIndex: 0,
              color: Color.Black,
              end: { column: 5, line: 1 },
              left: SENTINEL_INDEX,
              leftCharCount: 0,
              leftLineFeedCount: 0,
              length: 11,
              lineFeedCount: 1,
              parent: SENTINEL_INDEX,
              right: SENTINEL_INDEX,
              start: { column: 0, line: 0 },
            },
          ],
          root: 1,
        },
        previouslyInsertedContentNodeIndex: 1,
        previouslyInsertedContentNodeOffset: 11,
        structure: {
          nodes: [
            SENTINEL_STRUCTURE,
            {
              color: Color.Black,
              id: "local:p:{1234567890}",
              left: SENTINEL_INDEX,
              leftSubTreeLength: 0,
              length: 11,
              parent: SENTINEL_INDEX,
              right: 2,
              tag: "p",
              tagType: TagType.StartTag,
            },
            {
              color: Color.Red,
              id: "local:p:{1234567890}",
              left: SENTINEL_INDEX,
              leftSubTreeLength: 0,
              length: 11,
              parent: 1,
              right: SENTINEL_INDEX,
              tag: "p",
              tagType: TagType.EndTag,
            },
          ],
          root: 1,
        },
      },
    };

    const resultState = pageReducer(
      state,
      InsertContentDOMActionCreator("pageId", "Hello\nWorld", {
        end: {
          nodeIndex: 0,
          nodeLocalOffset: 0,
        },
        localOffset: 0,
        start: {
          nodeIndex: 0,
          nodeLocalOffset: 0,
        },
        structureNodeIndex: 0,
      }),
    );
    expect(resultState).toStrictEqual(expectedState);
  });

  test("Ensures that the parent structure node's length gets increased", (): void => {
    const page: PageContent = {
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
      content: {
        nodes: [
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
        root: 1,
      },
      previouslyInsertedContentNodeIndex: 3,
      previouslyInsertedContentNodeOffset: 5,
      structure: {
        nodes: [
          SENTINEL_STRUCTURE,
          {
            color: Color.Red,
            id: "first",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 9,
            parent: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
            tag: "p",
            tagType: TagType.StartTag,
          },
          {
            color: Color.Black,
            id: "first",
            left: 1,
            leftSubTreeLength: 1,
            length: 0,
            parent: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
            tag: "p",
            tagType: TagType.StartTag,
          },
        ],
        root: 2,
      },
    };
    const expectedPage: PageContent = {
      buffers: [
        {
          content: "abc\nd",
          isReadOnly: true,
          lineStarts: [0, 4],
        },
        {
          content: "efghij\nk",
          isReadOnly: false,
          lineStarts: [0, 7],
        },
      ],
      content: {
        nodes: [
          SENTINEL_CONTENT,
          {
            bufferIndex: 0,
            color: Color.Black,
            end: {
              column: 1,
              line: 1,
            },
            left: 2,
            leftCharCount: 6,
            leftLineFeedCount: 1,
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
            color: Color.Black,
            end: { column: 2, line: 0 },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 2,
            lineFeedCount: 0,
            parent: 1,
            right: 4,
            start: { column: 0, line: 0 },
          },
          {
            bufferIndex: 1,
            color: Color.Black,
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
          {
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
          },
        ],
        root: 1,
      },
      previouslyInsertedContentNodeIndex: 4,
      previouslyInsertedContentNodeOffset: 4,
      structure: {
        nodes: [
          SENTINEL_STRUCTURE,
          {
            color: Color.Red,
            id: "first",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 13,
            parent: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
            tag: "p",
            tagType: TagType.StartTag,
          },
          {
            color: Color.Black,
            id: "first",
            left: 1,
            leftSubTreeLength: 1,
            length: 0,
            parent: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
            tag: "p",
            tagType: TagType.StartTag,
          },
        ],
        root: 2,
      },
    };
    const action: InsertContentDOM = {
      content: "ij\nk",
      end: {
        nodeIndex: 2,
        nodeLocalOffset: 2,
      },
      localOffset: 2,
      start: {
        nodeIndex: 2,
        nodeLocalOffset: 0,
      },
      structureNodeIndex: 1,
    };
    const maxBufferLength = 8;
    insertContentDOM(page, action, maxBufferLength);
    expect(page).toStrictEqual(expectedPage);
  });
});
