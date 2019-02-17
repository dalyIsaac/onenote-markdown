/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/camelcase */
import { test_06_html } from "../parser/parser.test";
import parse from "../parser/parser";
import {
  PageContent,
  Color,
  PageContentMutable,
  StatePages,
} from "../pageModel";
import { SENTINEL_CONTENT } from "../contentTree/tree";
import { SENTINEL_INDEX } from "../tree/tree";
import { SENTINEL_STRUCTURE } from "./tree";
import { TagType } from "./structureModel";
import { SplitStructureAction, SPLIT_STRUCTURE_NODE } from "./actions";
import { splitStructureNode } from "./split";
import pageReducer from "../reducer";
import { splitStructureNode as splitStructureNodeActionCreator } from "./actions";

Date.now = jest.fn();
(Date.now as jest.Mock).mockReturnValue(1234567890);

const expectedPage_1_2_1 = (): PageContent => ({
  buffers: [
    {
      content:
        "**Bold** text which has _italics_ and {text-decoration:underline}underlines{text-decoration:underline}{!cite} Citation",
      isReadOnly: true,
      lineStarts: [0],
    },
  ],
  charset: "utf-8",
  content: {
    nodes: [
      SENTINEL_CONTENT,
      {
        bufferIndex: 0,
        color: Color.Black,
        end: { column: 118, line: 0 },
        left: SENTINEL_INDEX,
        leftCharCount: 0,
        leftLineFeedCount: 0,
        length: 118,
        lineFeedCount: 0,
        parent: SENTINEL_INDEX,
        right: SENTINEL_INDEX,
        start: { column: 0, line: 0 },
      },
    ],
    root: 1,
  },
  created: "2018-09-03T14:08:00.0000000",
  dataAbsoluteEnabled: true,
  defaultStyle: {
    fontFamily: "Calibri",
    fontSize: "11pt",
  },
  language: "en-NZ",
  previouslyInsertedContentNodeIndex: 1,
  previouslyInsertedContentNodeOffset: 0,
  structure: {
    nodes: [
      SENTINEL_STRUCTURE,
      {
        // 1
        color: Color.Black,
        id: "p:{6cb59116-8e61-03a9-39ef-edf64004790d}{62}",
        left: SENTINEL_INDEX,
        leftSubTreeLength: 0,
        length: 102,
        parent: 2,
        right: SENTINEL_INDEX,
        style: {
          marginBottom: "0pt",
          marginTop: "0pt",
        },
        tag: "p",
        tagType: TagType.StartTag,
      },
      {
        // 2
        color: Color.Black,
        id: "p:{6cb59116-8e61-03a9-39ef-edf64004790d}{62}",
        left: 1,
        leftSubTreeLength: 1,
        length: 0,
        parent: SENTINEL_INDEX,
        right: 4,
        tag: "p",
        tagType: TagType.EndTag,
      },
      {
        // 3
        color: Color.Black,
        id: "cite:{28216e73-1f0a-05fd-25c5-a04844147e70}{16}",
        left: SENTINEL_INDEX,
        leftSubTreeLength: 0,
        length: 16,
        parent: 4,
        right: SENTINEL_INDEX,
        style: {
          color: "#595959",
          fontSize: "9pt",
          marginBottom: "0pt",
          marginTop: "0pt",
        },
        tag: "cite",
        tagType: TagType.StartTag,
      },
      {
        // 4
        color: Color.Red,
        id: "cite:{28216e73-1f0a-05fd-25c5-a04844147e70}{16}",
        left: 3,
        leftSubTreeLength: 1,
        length: 0,
        parent: 2,
        right: 5,
        tag: "cite",
        tagType: TagType.EndTag,
      },
      {
        // 5
        color: Color.Black,
        id: "{!localGeneratedId}1234567890",
        left: SENTINEL_INDEX,
        leftSubTreeLength: 0,
        length: 0,
        parent: 4,
        right: 6,
        style: {
          marginBottom: "0pt",
          marginTop: "0pt",
        },
        tag: "p",
        tagType: TagType.StartTag,
      },
      {
        // 6
        color: Color.Red,
        id: "{!localGeneratedId}1234567890",
        left: SENTINEL_INDEX,
        leftSubTreeLength: 0,
        length: 0,
        parent: 5,
        right: SENTINEL_INDEX,
        tag: "p",
        tagType: TagType.EndTag,
      },
    ],
    root: 2,
  },
  title: "This is the title",
});

const expectedPage_1_2_2 = (): PageContent => ({
  buffers: [
    {
      content:
        "**Bold** text which has _italics_ and {text-decoration:underline}underlines{text-decoration:underline}{!cite} Citation",
      isReadOnly: true,
      lineStarts: [0],
    },
  ],
  charset: "utf-8",
  content: {
    nodes: [
      SENTINEL_CONTENT,
      {
        bufferIndex: 0,
        color: Color.Black,
        end: { column: 118, line: 0 },
        left: SENTINEL_INDEX,
        leftCharCount: 0,
        leftLineFeedCount: 0,
        length: 118,
        lineFeedCount: 0,
        parent: SENTINEL_INDEX,
        right: SENTINEL_INDEX,
        start: { column: 0, line: 0 },
      },
    ],
    root: 1,
  },
  created: "2018-09-03T14:08:00.0000000",
  dataAbsoluteEnabled: true,
  defaultStyle: {
    fontFamily: "Calibri",
    fontSize: "11pt",
  },
  language: "en-NZ",
  previouslyInsertedContentNodeIndex: 1,
  previouslyInsertedContentNodeOffset: 0,
  structure: {
    nodes: [
      SENTINEL_STRUCTURE,
      {
        // 1
        color: Color.Black,
        id: "p:{6cb59116-8e61-03a9-39ef-edf64004790d}{62}",
        left: SENTINEL_INDEX,
        leftSubTreeLength: 0,
        length: 102,
        parent: 2,
        right: SENTINEL_INDEX,
        style: {
          marginBottom: "0pt",
          marginTop: "0pt",
        },
        tag: "p",
        tagType: TagType.StartTag,
      },
      {
        // 2
        color: Color.Black,
        id: "p:{6cb59116-8e61-03a9-39ef-edf64004790d}{62}",
        left: 1,
        leftSubTreeLength: 1,
        length: 0,
        parent: SENTINEL_INDEX,
        right: 3,
        tag: "p",
        tagType: TagType.EndTag,
      },
      {
        // 3
        color: Color.Red,
        id: "cite:{28216e73-1f0a-05fd-25c5-a04844147e70}{16}",
        left: 5,
        leftSubTreeLength: 2,
        length: 16,
        parent: 2,
        right: 4,
        style: {
          color: "#595959",
          fontSize: "9pt",
          marginBottom: "0pt",
          marginTop: "0pt",
        },
        tag: "cite",
        tagType: TagType.StartTag,
      },
      {
        // 4
        color: Color.Black,
        id: "cite:{28216e73-1f0a-05fd-25c5-a04844147e70}{16}",
        left: SENTINEL_INDEX,
        leftSubTreeLength: 0,
        length: 0,
        parent: 3,
        right: SENTINEL_INDEX,
        tag: "cite",
        tagType: TagType.EndTag,
      },
      {
        // 5
        color: Color.Black,
        id: "{!localGeneratedId}1234567890",
        left: SENTINEL_INDEX,
        leftSubTreeLength: 0,
        length: 0,
        parent: 3,
        right: 6,
        style: {
          marginBottom: "0pt",
          marginTop: "0pt",
        },
        tag: "p",
        tagType: TagType.StartTag,
      },
      {
        // 6
        color: Color.Red,
        id: "{!localGeneratedId}1234567890",
        left: SENTINEL_INDEX,
        leftSubTreeLength: 0,
        length: 0,
        parent: 5,
        right: SENTINEL_INDEX,
        tag: "p",
        tagType: TagType.EndTag,
      },
    ],
    root: 2,
  },
  title: "This is the title",
});

const expectedPage_1_3_1 = (): PageContent => ({
  buffers: [
    {
      content:
        "**Bold** text which has _italics_ and {text-decoration:underline}underlines{text-decoration:underline}{!cite} Citation",
      isReadOnly: true,
      lineStarts: [0],
    },
  ],
  charset: "utf-8",
  content: {
    nodes: [
      SENTINEL_CONTENT,
      {
        bufferIndex: 0,
        color: Color.Black,
        end: { column: 118, line: 0 },
        left: SENTINEL_INDEX,
        leftCharCount: 0,
        leftLineFeedCount: 0,
        length: 118,
        lineFeedCount: 0,
        parent: SENTINEL_INDEX,
        right: SENTINEL_INDEX,
        start: { column: 0, line: 0 },
      },
    ],
    root: 1,
  },
  created: "2018-09-03T14:08:00.0000000",
  dataAbsoluteEnabled: true,
  defaultStyle: {
    fontFamily: "Calibri",
    fontSize: "11pt",
  },
  language: "en-NZ",
  previouslyInsertedContentNodeIndex: 1,
  previouslyInsertedContentNodeOffset: 0,
  structure: {
    nodes: [
      SENTINEL_STRUCTURE,
      {
        // 1
        color: Color.Black,
        id: "p:{6cb59116-8e61-03a9-39ef-edf64004790d}{62}",
        left: SENTINEL_INDEX,
        leftSubTreeLength: 0,
        length: 102,
        parent: 2,
        right: SENTINEL_INDEX,
        style: {
          marginBottom: "0pt",
          marginTop: "0pt",
        },
        tag: "p",
        tagType: TagType.StartTag,
      },
      {
        // 2
        color: Color.Black,
        id: "p:{6cb59116-8e61-03a9-39ef-edf64004790d}{62}",
        left: 1,
        leftSubTreeLength: 1,
        length: 0,
        parent: SENTINEL_INDEX,
        right: 4,
        tag: "p",
        tagType: TagType.EndTag,
      },
      {
        // 3
        color: Color.Black,
        id: "cite:{28216e73-1f0a-05fd-25c5-a04844147e70}{16}",
        left: SENTINEL_INDEX,
        leftSubTreeLength: 0,
        length: 16,
        parent: 4,
        right: SENTINEL_INDEX,
        style: {
          color: "#595959",
          fontSize: "9pt",
          marginBottom: "0pt",
          marginTop: "0pt",
        },
        tag: "cite",
        tagType: TagType.StartTag,
      },
      {
        // 4
        color: Color.Red,
        id: "cite:{28216e73-1f0a-05fd-25c5-a04844147e70}{16}",
        left: 3,
        leftSubTreeLength: 1,
        length: 0,
        parent: 2,
        right: 5,
        tag: "cite",
        tagType: TagType.EndTag,
      },
      {
        // 5
        color: Color.Black,
        id: "{!localGeneratedId}1234567890",
        left: SENTINEL_INDEX,
        leftSubTreeLength: 0,
        length: 0,
        parent: 4,
        right: SENTINEL_INDEX,
        tag: "br",
        tagType: TagType.StartEndTag,
      },
      {
        // 6
        color: Color.Black,
        id: "{!localGeneratedId}1234567890",
        left: SENTINEL_INDEX,
        leftSubTreeLength: 0,
        length: 0,
        parent: SENTINEL_INDEX,
        right: SENTINEL_INDEX,
        tag: "p",
        tagType: TagType.EndTag,
      },
    ],
    root: 2,
  },
  title: "This is the title",
});

const expectedPage_1_3_2 = (): PageContent => ({
  buffers: [
    {
      content:
        "**Bold** text which has _italics_ and {text-decoration:underline}underlines{text-decoration:underline}{!cite} Citation",
      isReadOnly: true,
      lineStarts: [0],
    },
  ],
  charset: "utf-8",
  content: {
    nodes: [
      SENTINEL_CONTENT,
      {
        bufferIndex: 0,
        color: Color.Black,
        end: { column: 118, line: 0 },
        left: SENTINEL_INDEX,
        leftCharCount: 0,
        leftLineFeedCount: 0,
        length: 118,
        lineFeedCount: 0,
        parent: SENTINEL_INDEX,
        right: SENTINEL_INDEX,
        start: { column: 0, line: 0 },
      },
    ],
    root: 1,
  },
  created: "2018-09-03T14:08:00.0000000",
  dataAbsoluteEnabled: true,
  defaultStyle: {
    fontFamily: "Calibri",
    fontSize: "11pt",
  },
  language: "en-NZ",
  previouslyInsertedContentNodeIndex: 1,
  previouslyInsertedContentNodeOffset: 0,
  structure: {
    nodes: [
      SENTINEL_STRUCTURE,
      {
        // 1
        color: Color.Black,
        id: "p:{6cb59116-8e61-03a9-39ef-edf64004790d}{62}",
        left: SENTINEL_INDEX,
        leftSubTreeLength: 0,
        length: 102,
        parent: 2,
        right: SENTINEL_INDEX,
        style: {
          marginBottom: "0pt",
          marginTop: "0pt",
        },
        tag: "p",
        tagType: TagType.StartTag,
      },
      {
        // 2
        color: Color.Black,
        id: "p:{6cb59116-8e61-03a9-39ef-edf64004790d}{62}",
        left: 1,
        leftSubTreeLength: 1,
        length: 0,
        parent: SENTINEL_INDEX,
        right: 3,
        tag: "p",
        tagType: TagType.EndTag,
      },
      {
        // 3
        color: Color.Red,
        id: "cite:{28216e73-1f0a-05fd-25c5-a04844147e70}{16}",
        left: 5,
        leftSubTreeLength: 1,
        length: 16,
        parent: 2,
        right: 4,
        style: {
          color: "#595959",
          fontSize: "9pt",
          marginBottom: "0pt",
          marginTop: "0pt",
        },
        tag: "cite",
        tagType: TagType.StartTag,
      },
      {
        // 4
        color: Color.Black,
        id: "cite:{28216e73-1f0a-05fd-25c5-a04844147e70}{16}",
        left: SENTINEL_INDEX,
        leftSubTreeLength: 0,
        length: 0,
        parent: 3,
        right: SENTINEL_INDEX,
        tag: "cite",
        tagType: TagType.EndTag,
      },
      {
        // 5
        color: Color.Black,
        id: "{!localGeneratedId}1234567890",
        left: SENTINEL_INDEX,
        leftSubTreeLength: 0,
        length: 0,
        parent: 3,
        right: SENTINEL_INDEX,
        tag: "br",
        tagType: TagType.StartEndTag,
      },
      {
        // 6
        color: Color.Black,
        id: "{!localGeneratedId}1234567890",
        left: SENTINEL_INDEX,
        leftSubTreeLength: 0,
        length: 0,
        parent: SENTINEL_INDEX,
        right: SENTINEL_INDEX,
        tag: "p",
        tagType: TagType.EndTag,
      },
    ],
    root: 2,
  },
  title: "This is the title",
});

describe("Tests for splitting `StructureNode`s.", () => {
  test("1.1.1 Split the final `StructureNode`.", () => {
    const page = parse(test_06_html);
    const expectedPage: PageContent = {
      buffers: [
        {
          content:
            "**Bold** text which has _italics_ and {text-decoration:underline}underlines{text-decoration:underline}{!cite} Citation",
          isReadOnly: true,
          lineStarts: [0],
        },
      ],
      charset: "utf-8",
      content: {
        nodes: [
          SENTINEL_CONTENT,
          {
            bufferIndex: 0,
            color: Color.Black,
            end: { column: 118, line: 0 },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 118,
            lineFeedCount: 0,
            parent: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
            start: { column: 0, line: 0 },
          },
        ],
        root: 1,
      },
      created: "2018-09-03T14:08:00.0000000",
      dataAbsoluteEnabled: true,
      defaultStyle: {
        fontFamily: "Calibri",
        fontSize: "11pt",
      },
      language: "en-NZ",
      previouslyInsertedContentNodeIndex: 1,
      previouslyInsertedContentNodeOffset: 0,
      structure: {
        nodes: [
          SENTINEL_STRUCTURE,
          {
            // 1
            color: Color.Black,
            id: "p:{6cb59116-8e61-03a9-39ef-edf64004790d}{62}",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 102,
            parent: 2,
            right: SENTINEL_INDEX,
            style: {
              marginBottom: "0pt",
              marginTop: "0pt",
            },
            tag: "p",
            tagType: TagType.StartTag,
          },
          {
            // 2
            color: Color.Black,
            id: "p:{6cb59116-8e61-03a9-39ef-edf64004790d}{62}",
            left: 1,
            leftSubTreeLength: 1,
            length: 0,
            parent: SENTINEL_INDEX,
            right: 4,
            tag: "p",
            tagType: TagType.EndTag,
          },
          {
            // 3
            color: Color.Black,
            id: "cite:{28216e73-1f0a-05fd-25c5-a04844147e70}{16}",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 13,
            parent: 4,
            right: SENTINEL_INDEX,
            style: {
              color: "#595959",
              fontSize: "9pt",
              marginBottom: "0pt",
              marginTop: "0pt",
            },
            tag: "cite",
            tagType: TagType.StartTag,
          },
          {
            // 4
            color: Color.Red,
            id: "cite:{28216e73-1f0a-05fd-25c5-a04844147e70}{16}",
            left: 3,
            leftSubTreeLength: 1,
            length: 0,
            parent: 2,
            right: 5,
            tag: "cite",
            tagType: TagType.EndTag,
          },
          {
            // 5
            color: Color.Black,
            id: "{!localGeneratedId}1234567890",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 3,
            parent: 4,
            right: 6,
            style: {
              marginBottom: "0pt",
              marginTop: "0pt",
            },
            tag: "p",
            tagType: TagType.StartTag,
          },
          {
            // 6
            color: Color.Red,
            id: "{!localGeneratedId}1234567890",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 0,
            parent: 5,
            right: SENTINEL_INDEX,
            tag: "p",
            tagType: TagType.EndTag,
          },
        ],
        root: 2,
      },
      title: "This is the title",
    };
    const action: SplitStructureAction = {
      localContentOffset: 13,
      nodeContentOffset: 115,
      nodeIndex: 3,
      pageId: "",
      type: SPLIT_STRUCTURE_NODE,
    };
    splitStructureNode(page as PageContentMutable, action);
    expect(page).toStrictEqual(expectedPage);
  });

  test("1.1.2 Split the first `StructureNode`.", () => {
    const page = parse(test_06_html);
    const expectedPage: PageContent = {
      buffers: [
        {
          content:
            "**Bold** text which has _italics_ and {text-decoration:underline}underlines{text-decoration:underline}{!cite} Citation",
          isReadOnly: true,
          lineStarts: [0],
        },
      ],
      charset: "utf-8",
      content: {
        nodes: [
          SENTINEL_CONTENT,
          {
            bufferIndex: 0,
            color: Color.Black,
            end: { column: 118, line: 0 },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 118,
            lineFeedCount: 0,
            parent: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
            start: { column: 0, line: 0 },
          },
        ],
        root: 1,
      },
      created: "2018-09-03T14:08:00.0000000",
      dataAbsoluteEnabled: true,
      defaultStyle: {
        fontFamily: "Calibri",
        fontSize: "11pt",
      },
      language: "en-NZ",
      previouslyInsertedContentNodeIndex: 1,
      previouslyInsertedContentNodeOffset: 0,
      structure: {
        nodes: [
          SENTINEL_STRUCTURE,
          {
            // 1
            color: Color.Black,
            id: "p:{6cb59116-8e61-03a9-39ef-edf64004790d}{62}",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 19,
            parent: 2,
            right: SENTINEL_INDEX,
            style: {
              marginBottom: "0pt",
              marginTop: "0pt",
            },
            tag: "p",
            tagType: TagType.StartTag,
          },
          {
            // 2
            color: Color.Black,
            id: "p:{6cb59116-8e61-03a9-39ef-edf64004790d}{62}",
            left: 1,
            leftSubTreeLength: 1,
            length: 0,
            parent: SENTINEL_INDEX,
            right: 3,
            tag: "p",
            tagType: TagType.EndTag,
          },
          {
            // 3
            color: Color.Red,
            id: "cite:{28216e73-1f0a-05fd-25c5-a04844147e70}{16}",
            left: 5,
            leftSubTreeLength: 2,
            length: 16,
            parent: 2,
            right: 4,
            style: {
              color: "#595959",
              fontSize: "9pt",
              marginBottom: "0pt",
              marginTop: "0pt",
            },
            tag: "cite",
            tagType: TagType.StartTag,
          },
          {
            // 4
            color: Color.Black,
            id: "cite:{28216e73-1f0a-05fd-25c5-a04844147e70}{16}",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 0,
            parent: 3,
            right: SENTINEL_INDEX,
            tag: "cite",
            tagType: TagType.EndTag,
          },
          {
            // 5
            color: Color.Black,
            id: "{!localGeneratedId}1234567890",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 83,
            parent: 3,
            right: 6,
            style: {
              marginBottom: "0pt",
              marginTop: "0pt",
            },
            tag: "p",
            tagType: TagType.StartTag,
          },
          {
            // 6
            color: Color.Red,
            id: "{!localGeneratedId}1234567890",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 0,
            parent: 5,
            right: SENTINEL_INDEX,
            tag: "p",
            tagType: TagType.EndTag,
          },
        ],
        root: 2,
      },
      title: "This is the title",
    };
    const action: SplitStructureAction = {
      localContentOffset: 19,
      nodeContentOffset: 19,
      nodeIndex: 1,
      pageId: "",
      type: SPLIT_STRUCTURE_NODE,
    };
    splitStructureNode(page as PageContentMutable, action);
    expect(page).toStrictEqual(expectedPage);
  });

  test("1.2.1 Create a new `StructureNode` after the final `StructureNode`.", () => {
    const page = parse(test_06_html);
    const action: SplitStructureAction = {
      localContentOffset: 16,
      nodeContentOffset: 115,
      nodeIndex: 3,
      pageId: "",
      type: SPLIT_STRUCTURE_NODE,
    };
    splitStructureNode(page as PageContentMutable, action);
    expect(page).toStrictEqual(expectedPage_1_2_1());
  });

  test("1.2.2 Create a new `StructureNode` after the first `StructureNode`.", () => {
    const page = parse(test_06_html);
    const action: SplitStructureAction = {
      localContentOffset: 102,
      nodeContentOffset: 0,
      nodeIndex: 1,
      pageId: "",
      type: SPLIT_STRUCTURE_NODE,
    };
    splitStructureNode(page as PageContentMutable, action);
    expect(page).toStrictEqual(expectedPage_1_2_2());
  });

  test("1.3.1 Converts the empty `StructureNode` into a `<br />` tag, and removes the paired end tag.", () => {
    const page = expectedPage_1_2_1();
    const action: SplitStructureAction = {
      localContentOffset: 0,
      nodeContentOffset: 118,
      nodeIndex: 5,
      pageId: "",
      type: SPLIT_STRUCTURE_NODE,
    };
    splitStructureNode(page as PageContentMutable, action);
    expect(page).toStrictEqual(expectedPage_1_3_1());
  });

  test("1.3.2 Converts the empty `StructureNode` into a `<br />` tag, and removes the paired end tag.", () => {
    const page = expectedPage_1_2_2();
    const action: SplitStructureAction = {
      localContentOffset: 0,
      nodeContentOffset: 102,
      nodeIndex: 5,
      pageId: "",
      type: SPLIT_STRUCTURE_NODE,
    };
    splitStructureNode(page as PageContentMutable, action);
    expect(page).toStrictEqual(expectedPage_1_3_2());
  });

  test("1.4.1 Inserts an empty `<br />` tag after the existing `<br />` tag", () => {
    const page = expectedPage_1_3_1();
    const expectedPage: PageContent = {
      buffers: [
        {
          content:
            "**Bold** text which has _italics_ and {text-decoration:underline}underlines{text-decoration:underline}{!cite} Citation",
          isReadOnly: true,
          lineStarts: [0],
        },
      ],
      charset: "utf-8",
      content: {
        nodes: [
          SENTINEL_CONTENT,
          {
            bufferIndex: 0,
            color: Color.Black,
            end: { column: 118, line: 0 },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 118,
            lineFeedCount: 0,
            parent: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
            start: { column: 0, line: 0 },
          },
        ],
        root: 1,
      },
      created: "2018-09-03T14:08:00.0000000",
      dataAbsoluteEnabled: true,
      defaultStyle: {
        fontFamily: "Calibri",
        fontSize: "11pt",
      },
      language: "en-NZ",
      previouslyInsertedContentNodeIndex: 1,
      previouslyInsertedContentNodeOffset: 0,
      structure: {
        nodes: [
          SENTINEL_STRUCTURE,
          {
            // 1
            color: Color.Black,
            id: "p:{6cb59116-8e61-03a9-39ef-edf64004790d}{62}",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 102,
            parent: 2,
            right: SENTINEL_INDEX,
            style: {
              marginBottom: "0pt",
              marginTop: "0pt",
            },
            tag: "p",
            tagType: TagType.StartTag,
          },
          {
            // 2
            color: Color.Black,
            id: "p:{6cb59116-8e61-03a9-39ef-edf64004790d}{62}",
            left: 1,
            leftSubTreeLength: 1,
            length: 0,
            parent: SENTINEL_INDEX,
            right: 4,
            tag: "p",
            tagType: TagType.EndTag,
          },
          {
            // 3
            color: Color.Black,
            id: "cite:{28216e73-1f0a-05fd-25c5-a04844147e70}{16}",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 16,
            parent: 4,
            right: SENTINEL_INDEX,
            style: {
              color: "#595959",
              fontSize: "9pt",
              marginBottom: "0pt",
              marginTop: "0pt",
            },
            tag: "cite",
            tagType: TagType.StartTag,
          },
          {
            // 4
            color: Color.Red,
            id: "cite:{28216e73-1f0a-05fd-25c5-a04844147e70}{16}",
            left: 3,
            leftSubTreeLength: 1,
            length: 0,
            parent: 2,
            right: 5,
            tag: "cite",
            tagType: TagType.EndTag,
          },
          {
            // 5
            color: Color.Black,
            id: "{!localGeneratedId}1234567890",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 0,
            parent: 4,
            right: 7,
            tag: "br",
            tagType: TagType.StartEndTag,
          },
          {
            // 6
            color: Color.Black,
            id: "{!localGeneratedId}1234567890",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 0,
            parent: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
            tag: "p",
            tagType: TagType.EndTag,
          },
          {
            // 7
            color: Color.Red,
            id: "{!localGeneratedId}1234567890",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 0,
            parent: 5,
            right: SENTINEL_INDEX,
            tag: "br",
            tagType: TagType.StartEndTag,
          },
        ],
        root: 2,
      },
      title: "This is the title",
    };
    const action: SplitStructureAction = {
      localContentOffset: 0,
      nodeContentOffset: 118,
      nodeIndex: 5,
      pageId: "",
      type: SPLIT_STRUCTURE_NODE,
    };
    splitStructureNode(page as PageContentMutable, action);
    expect(page).toStrictEqual(expectedPage);
  });

  test("1.4.2 Inserts an empty `<br />` tag after the existing `<br />` tag", () => {
    const page = expectedPage_1_3_2();
    const expectedPage: PageContent = {
      buffers: [
        {
          content:
            "**Bold** text which has _italics_ and {text-decoration:underline}underlines{text-decoration:underline}{!cite} Citation",
          isReadOnly: true,
          lineStarts: [0],
        },
      ],
      charset: "utf-8",
      content: {
        nodes: [
          SENTINEL_CONTENT,
          {
            bufferIndex: 0,
            color: Color.Black,
            end: { column: 118, line: 0 },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 118,
            lineFeedCount: 0,
            parent: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
            start: { column: 0, line: 0 },
          },
        ],
        root: 1,
      },
      created: "2018-09-03T14:08:00.0000000",
      dataAbsoluteEnabled: true,
      defaultStyle: {
        fontFamily: "Calibri",
        fontSize: "11pt",
      },
      language: "en-NZ",
      previouslyInsertedContentNodeIndex: 1,
      previouslyInsertedContentNodeOffset: 0,
      structure: {
        nodes: [
          SENTINEL_STRUCTURE,
          {
            // 1
            color: Color.Black,
            id: "p:{6cb59116-8e61-03a9-39ef-edf64004790d}{62}",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 102,
            parent: 2,
            right: SENTINEL_INDEX,
            style: {
              marginBottom: "0pt",
              marginTop: "0pt",
            },
            tag: "p",
            tagType: TagType.StartTag,
          },
          {
            // 2
            color: Color.Black,
            id: "p:{6cb59116-8e61-03a9-39ef-edf64004790d}{62}",
            left: 1,
            leftSubTreeLength: 1,
            length: 0,
            parent: SENTINEL_INDEX,
            right: 3,
            tag: "p",
            tagType: TagType.EndTag,
          },
          {
            // 3
            color: Color.Red,
            id: "cite:{28216e73-1f0a-05fd-25c5-a04844147e70}{16}",
            left: 5,
            leftSubTreeLength: 1,
            length: 16,
            parent: 2,
            right: 4,
            style: {
              color: "#595959",
              fontSize: "9pt",
              marginBottom: "0pt",
              marginTop: "0pt",
            },
            tag: "cite",
            tagType: TagType.StartTag,
          },
          {
            // 4
            color: Color.Black,
            id: "cite:{28216e73-1f0a-05fd-25c5-a04844147e70}{16}",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 0,
            parent: 3,
            right: SENTINEL_INDEX,
            tag: "cite",
            tagType: TagType.EndTag,
          },
          {
            // 5
            color: Color.Black,
            id: "{!localGeneratedId}1234567890",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 0,
            parent: 3,
            right: 7,
            tag: "br",
            tagType: TagType.StartEndTag,
          },
          {
            // 6
            color: Color.Black,
            id: "{!localGeneratedId}1234567890",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 0,
            parent: SENTINEL_INDEX,
            right: SENTINEL_INDEX,
            tag: "p",
            tagType: TagType.EndTag,
          },
          {
            // 7
            color: Color.Red,
            id: "{!localGeneratedId}1234567890",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 0,
            parent: 5,
            right: SENTINEL_INDEX,
            tag: "br",
            tagType: TagType.StartEndTag,
          },
        ],
        root: 2,
      },
      title: "This is the title",
    };
    const action: SplitStructureAction = {
      localContentOffset: 0,
      nodeContentOffset: 102,
      nodeIndex: 5,
      pageId: "",
      type: SPLIT_STRUCTURE_NODE,
    };
    splitStructureNode(page as PageContentMutable, action);
    expect(page).toStrictEqual(expectedPage);
  });

  test("1.5 Reducer test", () => {
    const state: StatePages = {
      pageId: parse(test_06_html),
    };
    const action = splitStructureNodeActionCreator("pageId", 3, 115, 16);
    const newState = pageReducer(state, action);
    expect(newState).toStrictEqual({
      pageId: expectedPage_1_2_1(),
    });
  });
});
