/* eslint-disable @typescript-eslint/camelcase */
import parse from "./parser";
import { PageContent, Color } from "../pageModel";
import { SENTINEL_CONTENT } from "../contentTree/tree";
import { SENTINEL_STRUCTURE } from "../structureTree/tree";
import { EMPTY_TREE_ROOT, SENTINEL_INDEX } from "../tree/tree";
import { TagType } from "../structureTree/structureModel";
import reducer, { State } from "../../reducer";
import { STORE_PAGE, StorePageAction } from "../tree/actions";

export const test_01_html =
  `<html lang="en-NZ">` +
  `<head>` +
  `<title>This is the title</title>` +
  `<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />` +
  `<meta name="created" content="2018-09-03T14:08:00.0000000" />` +
  `</head>` +
  `<body data-absolute-enabled="true" style="font-family:Calibri;font-size:11pt">` +
  `<p id="p:{6cb59116-8e61-03a9-39ef-edf64004790d}{62}" style="margin-top:0pt;margin-bottom:0pt">` +
  `<span style="font-weight:bold">Bold</span> text which has <span style="font-style:italic">italics</span> and ` +
  `<span style="text-decoration:underline">underlines</span></p>` +
  `</body>` +
  `</html>`;

export const test_02_html =
  `<html lang="en-NZ">` +
  `<head>` +
  `<title>This is the title</title>` +
  `<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />` +
  `<meta name="created" content="2018-09-03T14:08:00.0000000" />` +
  `</head>` +
  `</html>`;

export const test_03_html =
  `<html lang="en-NZ">` +
  `<head>` +
  `<title>This is the title</title>` +
  `<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />` +
  `<meta name="created" content="2018-09-03T14:08:00.0000000" />` +
  `</head>` +
  `<body data-absolute-enabled="true" style="font-family:Calibri;font-size:11pt">` +
  `<p id="p:{6cb59116-8e61-03a9-39ef-edf64004790d}{62}" style="margin-top:0pt;margin-bottom:0pt">` +
  `<span style="font-weight:bold">Bold</span> text which has <span style="font-style:italic">italics</span> and ` +
  `<span style="text-decoration:underline">underlines</span></p>` +
  `</body>` +
  `</html>`;

export const test_04_html =
  `<html lang="en-NZ">` +
  `<head>` +
  `<title>This is the title</title>` +
  `<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />` +
  `<meta name="created" content="2018-09-03T14:08:00.0000000" />` +
  `</head>` +
  `<body data-absolute-enabled="true" style="font-family:Calibri;font-size:11pt">` +
  `<p id="p:{a977e62e-3126-8e0d-1368-bcf55df0a6de}{15}" style="margin-top:0pt;margin-bottom:0pt">` +
  `<span style="font-weight:bold;font-style:italic;text-decoration:underline">` +
  `Bold and underlined and italics.` +
  `</span>` +
  `</p>` +
  `</body>` +
  `</html>`;

export const test_05_html =
  `<html lang="en-NZ">` +
  `<head>` +
  `<title>This is the title</title>` +
  `<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />` +
  `<meta name="created" content="2018-09-03T14:08:00.0000000" />` +
  `</head>` +
  `<body data-absolute-enabled="true" style="font-family:Calibri;font-size:11pt">` +
  `<p id="p:{6cb59116-8e61-03a9-39ef-edf64004790d}{130}" style="margin-top:0pt;margin-bottom:0pt">` +
  `<span style="font-weight:bold">&quot;this is bold and in quotes&quot;</span>` +
  `</p>` +
  `</body>` +
  `</html>`;

export const test_06_html =
  `<html lang="en-NZ">` +
  `<head>` +
  `<title>This is the title</title>` +
  `<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />` +
  `<meta name="created" content="2018-09-03T14:08:00.0000000" />` +
  `</head>` +
  `<body data-absolute-enabled="true" style="font-family:Calibri;font-size:11pt">` +
  `<p id="p:{6cb59116-8e61-03a9-39ef-edf64004790d}{62}" style="margin-top:0pt;margin-bottom:0pt"><span style="font-weight:bold">Bold</span> text which has <span style="font-style:italic">italics</span> and <span style="text-decoration:underline">underlines</span></p>` +
  `<cite id="cite:{28216e73-1f0a-05fd-25c5-a04844147e70}{16}" style="font-size:9pt;color:#595959;margin-top:0pt;margin-bottom:0pt">Citation</cite>` +
  `</body>` +
  `</html>`;

export const test_07_html =
  `<html lang="en-NZ">` +
  `<head>` +
  `<title>This is the title</title>` +
  `<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />` +
  `<meta name="created" content="2018-09-03T14:08:00.0000000" />` +
  `</head>` +
  `<body data-absolute-enabled="true" style="font-family:Calibri;font-size:11pt">` +
  `<p id="p:{28216e73-1f0a-05fd-25c5-a04844147e70}{23}" style="margin-top:0pt;margin-bottom:0pt"><span style="background-color:yellow">Highlighted</span></p>` +
  `</body>` +
  `</html>`;

export const test_08_html =
  `<html lang="en-NZ">` +
  `<head>` +
  `<title>This is the title</title>` +
  `<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />` +
  `<meta name="created" content="2018-09-03T14:08:00.0000000" />` +
  `</head>` +
  `<body data-absolute-enabled="true" style="font-family:Calibri;font-size:11pt">` +
  `<p id="p:{28216e73-1f0a-05fd-25c5-a04844147e70}{26}" style="margin-top:0pt;margin-bottom:0pt"><span style="color:red">Red text</span></p>` +
  `</body>` +
  `</html>`;

export const test_09_html =
  `<html lang="en-NZ">` +
  `<head>` +
  `<title>This is the title</title>` +
  `<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />` +
  `<meta name="created" content="2018-09-03T14:08:00.0000000" />` +
  `</head>` +
  `<body data-absolute-enabled="true" style="font-family:Calibri;font-size:11pt">` +
  `<h1 id="h1:{6cb59116-8e61-03a9-39ef-edf64004790d}{69}" style="font-size:16pt;color:#1e4e79;margin-top:0pt;margin-bottom:0pt">This is <span style="font-weight:bold">heading</span> 1</h1>` +
  `</body>` +
  `</html>`;

export const test_10_html =
  `<html lang="en-NZ">` +
  `<head>` +
  `<title>This is the title</title>` +
  `<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />` +
  `<meta name="created" content="2018-09-03T14:08:00.0000000" />` +
  `</head>` +
  `<body data-absolute-enabled="true" style="font-family:Calibri;font-size:11pt">` +
  `<h2 id="h2:{6cb59116-8e61-03a9-39ef-edf64004790d}{74}" style="font-size:14pt;color:#2e75b5;margin-top:0pt;margin-bottom:0pt">This is <span style="text-decoration:underline">heading</span> 2</h2>` +
  `</body>` +
  `</html>`;

export const test_11_html =
  `<html lang="en-NZ">` +
  `<head>` +
  `<title>This is the title</title>` +
  `<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />` +
  `<meta name="created" content="2018-09-03T14:08:00.0000000" />` +
  `</head>` +
  `<body data-absolute-enabled="true" style="font-family:Calibri;font-size:11pt">` +
  `<h3 id="h3:{6cb59116-8e61-03a9-39ef-edf64004790d}{79}" style="font-size:12pt;color:#377bac;margin-top:0pt;margin-bottom:0pt">This is <span style="text-decoration:line-through">heading</span> 3</h3>` +
  `</body>` +
  `</html>`;

export const test_12_html =
  `<html lang="en-NZ">` +
  `<head>` +
  `<title>This is the title</title>` +
  `<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />` +
  `<meta name="created" content="2018-09-03T14:08:00.0000000" />` +
  `</head>` +
  `<body data-absolute-enabled="true" style="font-family:Calibri;font-size:11pt">` +
  `<h4 id="h4:{6cb59116-8e61-03a9-39ef-edf64004790d}{84}" style="font-size:12pt;color:#377bac;font-style:italic;margin-top:0pt;margin-bottom:0pt">This is heading 4</h4>` +
  `</body>` +
  `</html>`;

export const test_13_html =
  `<html lang="en-NZ">` +
  `<head>` +
  `<title>This is the title</title>` +
  `<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />` +
  `<meta name="created" content="2018-09-03T14:08:00.0000000" />` +
  `</head>` +
  `<body data-absolute-enabled="true" style="font-family:Calibri;font-size:11pt">` +
  `<h5 id="h5:{6cb59116-8e61-03a9-39ef-edf64004790d}{89}" style="color:#2e75b5;margin-top:0pt;margin-bottom:0pt">This is <span style="font-weight:bold;font-style:italic;text-decoration:line-through">heading</span> 5</h5>` +
  `</body>` +
  `</html>`;

export const test_14_html =
  `<html lang="en-NZ">` +
  `<head>` +
  `<title>This is the title</title>` +
  `<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />` +
  `<meta name="created" content="2018-09-03T14:08:00.0000000" />` +
  `</head>` +
  `<body data-absolute-enabled="true" style="font-family:Calibri;font-size:11pt">` +
  `<h6 id="h6:{6cb59116-8e61-03a9-39ef-edf64004790d}{94}" style="color:#2e75b5;font-style:italic;margin-top:0pt;margin-bottom:0pt">This is heading 6</h6>` +
  `</body>` +
  `</html>`;

export const test_15_html =
  `<html lang="en-NZ">` +
  `<head>` +
  `<title>This is the title</title>` +
  `<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />` +
  `<meta name="created" content="2018-09-03T14:08:00.0000000" />` +
  `</head>` +
  `<body data-absolute-enabled="true" style="font-family:Calibri;font-size:11pt">` +
  `<p id="p:{28216e73-1f0a-05fd-25c5-a04844147e70}{29}" style="margin-top:0pt;margin-bottom:0pt">Superscript x<sup>2</sup></p>` +
  `</body>` +
  `</html>`;

export const test_16_html =
  `<html lang="en-NZ">` +
  `<head>` +
  `<title>This is the title</title>` +
  `<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />` +
  `<meta name="created" content="2018-09-03T14:08:00.0000000" />` +
  `</head>` +
  `<body data-absolute-enabled="true" style="font-family:Calibri;font-size:11pt">` +
  `<p id="p:{28216e73-1f0a-05fd-25c5-a04844147e70}{32}" style="margin-top:0pt;margin-bottom:0pt">Subscript x<sub>2</sub></p>` +
  `</body>` +
  `</html>`;

export const test_17_html =
  `<html lang="en-NZ">` +
  `<head>` +
  `<title>This is the title</title>` +
  `<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />` +
  `<meta name="created" content="2018-09-03T14:08:00.0000000" />` +
  `</head>` +
  `<body data-absolute-enabled="true" style="font-family:Calibri;font-size:11pt">` +
  `<p id="p:{28216e73-1f0a-05fd-25c5-a04844147e70}{38}" data-id="p:{60c45a4d-c9e5-01bd-2ce3-6937733a7742}{11}"` +
  `style="margin-top:0pt;margin-bottom:0pt"> <span style="text-decoration:line-through underline">` +
  `Underlined and crossed out` +
  `</span >` +
  `</p>` +
  `</body>` +
  `</html>`;

describe("Parser tests", () => {
  test("1.01 Tests that the reducer works for parsing content.", () => {
    const action: StorePageAction = {
      content: test_01_html,
      pageId: "pageId",
      type: STORE_PAGE,
    };
    const state = reducer({ pages: {}, selectedPage: "" }, action);
    const expectedState: State = {
      pages: {
        pageId: {
          buffers: [
            {
              content:
                "**Bold** text which has _italics_ and {text-decoration:underline}underlines{text-decoration:underline}",
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
                end: { column: 102, line: 0 },
                left: SENTINEL_INDEX,
                leftCharCount: 0,
                leftLineFeedCount: 0,
                length: 102,
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
                color: Color.Black,
                id: "p:{6cb59116-8e61-03a9-39ef-edf64004790d}{62}",
                left: SENTINEL_INDEX,
                leftSubTreeLength: 0,
                length: 102,
                parent: SENTINEL_INDEX,
                right: 2,
                style: {
                  marginBottom: "0pt",
                  marginTop: "0pt",
                },
                tag: "p",
                tagType: TagType.StartTag,
              },
              {
                color: Color.Red,
                id: "p:{6cb59116-8e61-03a9-39ef-edf64004790d}{62}",
                left: SENTINEL_INDEX,
                leftSubTreeLength: 0,
                length: 0,
                parent: 1,
                right: SENTINEL_INDEX,
                tag: "p",
                tagType: TagType.EndTag,
              },
            ],
            root: 1,
          },
          title: "This is the title",
        },
      },
      selectedPage: "",
    };
    expect(state).toStrictEqual(expectedState);
  });

  test("1.02 Ensures that the parser can correctly parse the HTML head data.", () => {
    const page = parse(test_02_html);
    const expectedPage: PageContent = {
      buffers: [],
      charset: "utf-8",
      content: { nodes: [SENTINEL_CONTENT], root: EMPTY_TREE_ROOT },
      created: "2018-09-03T14:08:00.0000000",
      language: "en-NZ",
      previouslyInsertedContentNodeIndex: null,
      previouslyInsertedContentNodeOffset: null,
      structure: { nodes: [SENTINEL_STRUCTURE], root: EMPTY_TREE_ROOT },
      title: "This is the title",
    };
    expect(page).toStrictEqual(expectedPage);
  });

  test("1.03 Tests paragraph tags can be handled, with bold, italics, and underline styling.", () => {
    const page = parse(test_03_html);
    const expectedPage: PageContent = {
      buffers: [
        {
          content:
            "**Bold** text which has _italics_ and {text-decoration:underline}underlines{text-decoration:underline}",
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
            end: { column: 102, line: 0 },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 102,
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
            color: Color.Black,
            id: "p:{6cb59116-8e61-03a9-39ef-edf64004790d}{62}",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 102,
            parent: SENTINEL_INDEX,
            right: 2,
            style: {
              marginBottom: "0pt",
              marginTop: "0pt",
            },
            tag: "p",
            tagType: TagType.StartTag,
          },
          {
            color: Color.Red,
            id: "p:{6cb59116-8e61-03a9-39ef-edf64004790d}{62}",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 0,
            parent: 1,
            right: SENTINEL_INDEX,
            tag: "p",
            tagType: TagType.EndTag,
          },
        ],
        root: 1,
      },
      title: "This is the title",
    };
    expect(page).toStrictEqual(expectedPage);
  });

  test("1.04 Multiple styles inside a single tag.", () => {
    const page = parse(test_04_html);
    const expectedPage: PageContent = {
      buffers: [
        {
          content:
            "**_{text-decoration:underline}Bold and underlined and italics.{text-decoration:underline}_**",
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
            end: { column: 92, line: 0 },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 92,
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
            color: Color.Black,
            id: "p:{a977e62e-3126-8e0d-1368-bcf55df0a6de}{15}",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 92,
            parent: SENTINEL_INDEX,
            right: 2,
            style: {
              marginBottom: "0pt",
              marginTop: "0pt",
            },
            tag: "p",
            tagType: TagType.StartTag,
          },
          {
            color: Color.Red,
            id: "p:{a977e62e-3126-8e0d-1368-bcf55df0a6de}{15}",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 0,
            parent: 1,
            right: SENTINEL_INDEX,
            tag: "p",
            tagType: TagType.EndTag,
          },
        ],
        root: 1,
      },
      title: "This is the title",
    };
    expect(page).toStrictEqual(expectedPage);
  });

  test("1.05 Paragraph with quotes.", () => {
    const page = parse(test_05_html);
    const expectedPage: PageContent = {
      buffers: [
        {
          content: '**"this is bold and in quotes"**',
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
            end: { column: 32, line: 0 },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 32,
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
            color: Color.Black,
            id: "p:{6cb59116-8e61-03a9-39ef-edf64004790d}{130}",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 32,
            parent: SENTINEL_INDEX,
            right: 2,
            style: {
              marginBottom: "0pt",
              marginTop: "0pt",
            },
            tag: "p",
            tagType: TagType.StartTag,
          },
          {
            color: Color.Red,
            id: "p:{6cb59116-8e61-03a9-39ef-edf64004790d}{130}",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 0,
            parent: 1,
            right: SENTINEL_INDEX,
            tag: "p",
            tagType: TagType.EndTag,
          },
        ],
        root: 1,
      },
      title: "This is the title",
    };
    expect(page).toStrictEqual(expectedPage);
  });

  test("1.06 Multiple text tags.", () => {
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
            color: Color.Black,
            id: "cite:{28216e73-1f0a-05fd-25c5-a04844147e70}{16}",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
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
            color: Color.Red,
            id: "cite:{28216e73-1f0a-05fd-25c5-a04844147e70}{16}",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 0,
            parent: 3,
            right: SENTINEL_INDEX,
            tag: "cite",
            tagType: TagType.EndTag,
          },
        ],
        root: 2,
      },
      title: "This is the title",
    };
    expect(page).toStrictEqual(expectedPage);
  });

  test("1.07 Highlighted text.", () => {
    const page = parse(test_07_html);
    const expectedPage: PageContent = {
      buffers: [
        {
          content:
            "{background-color:yellow}Highlighted{background-color:yellow}",
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
            end: { column: 61, line: 0 },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 61,
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
            color: Color.Black,
            id: "p:{28216e73-1f0a-05fd-25c5-a04844147e70}{23}",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 61,
            parent: SENTINEL_INDEX,
            right: 2,
            style: {
              marginBottom: "0pt",
              marginTop: "0pt",
            },
            tag: "p",
            tagType: TagType.StartTag,
          },
          {
            color: Color.Red,
            id: "p:{28216e73-1f0a-05fd-25c5-a04844147e70}{23}",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 0,
            parent: 1,
            right: SENTINEL_INDEX,
            tag: "p",
            tagType: TagType.EndTag,
          },
        ],
        root: 1,
      },
      title: "This is the title",
    };
    expect(page).toStrictEqual(expectedPage);
  });

  test("1.08 Colored text.", () => {
    const page = parse(test_08_html);
    const expectedPage: PageContent = {
      buffers: [
        {
          content: "{color:red}Red text{color:red}",
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
            end: { column: 30, line: 0 },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 30,
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
            color: Color.Black,
            id: "p:{28216e73-1f0a-05fd-25c5-a04844147e70}{26}",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 30,
            parent: SENTINEL_INDEX,
            right: 2,
            style: {
              marginBottom: "0pt",
              marginTop: "0pt",
            },
            tag: "p",
            tagType: TagType.StartTag,
          },
          {
            color: Color.Red,
            id: "p:{28216e73-1f0a-05fd-25c5-a04844147e70}{26}",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 0,
            parent: 1,
            right: SENTINEL_INDEX,
            tag: "p",
            tagType: TagType.EndTag,
          },
        ],
        root: 1,
      },
      title: "This is the title",
    };
    expect(page).toStrictEqual(expectedPage);
  });

  test("1.09 h1", () => {
    const page = parse(test_09_html);
    const expectedPage: PageContent = {
      buffers: [
        {
          content: "# This is **heading** 1",
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
            end: { column: 23, line: 0 },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 23,
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
            color: Color.Black,
            id: "h1:{6cb59116-8e61-03a9-39ef-edf64004790d}{69}",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 23,
            parent: SENTINEL_INDEX,
            right: 2,
            style: {
              color: "#1e4e79",
              fontSize: "16pt",
              marginBottom: "0pt",
              marginTop: "0pt",
            },
            tag: "h1",
            tagType: TagType.StartTag,
          },
          {
            color: Color.Red,
            id: "h1:{6cb59116-8e61-03a9-39ef-edf64004790d}{69}",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 0,
            parent: 1,
            right: SENTINEL_INDEX,
            tag: "h1",
            tagType: TagType.EndTag,
          },
        ],
        root: 1,
      },
      title: "This is the title",
    };
    expect(page).toStrictEqual(expectedPage);
  });

  test("1.10 h2", () => {
    const page = parse(test_10_html);
    const expectedPage: PageContent = {
      buffers: [
        {
          content:
            "## This is {text-decoration:underline}heading{text-decoration:underline} 2",
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
            end: { column: 74, line: 0 },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 74,
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
            color: Color.Black,
            id: "h2:{6cb59116-8e61-03a9-39ef-edf64004790d}{74}",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 74,
            parent: SENTINEL_INDEX,
            right: 2,
            style: {
              color: "#2e75b5",
              fontSize: "14pt",
              marginBottom: "0pt",
              marginTop: "0pt",
            },
            tag: "h2",
            tagType: TagType.StartTag,
          },
          {
            color: Color.Red,
            id: "h2:{6cb59116-8e61-03a9-39ef-edf64004790d}{74}",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 0,
            parent: 1,
            right: SENTINEL_INDEX,
            tag: "h2",
            tagType: TagType.EndTag,
          },
        ],
        root: 1,
      },
      title: "This is the title",
    };
    expect(page).toStrictEqual(expectedPage);
  });

  test("1.11 h3", () => {
    const page = parse(test_11_html);
    const expectedPage: PageContent = {
      buffers: [
        {
          content:
            "### This is {text-decoration:line-through}heading{text-decoration:line-through} 3",
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
            end: { column: 81, line: 0 },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 81,
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
            color: Color.Black,
            id: "h3:{6cb59116-8e61-03a9-39ef-edf64004790d}{79}",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 81,
            parent: SENTINEL_INDEX,
            right: 2,
            style: {
              color: "#377bac",
              fontSize: "12pt",
              marginBottom: "0pt",
              marginTop: "0pt",
            },
            tag: "h3",
            tagType: TagType.StartTag,
          },
          {
            color: Color.Red,
            id: "h3:{6cb59116-8e61-03a9-39ef-edf64004790d}{79}",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 0,
            parent: 1,
            right: SENTINEL_INDEX,
            tag: "h3",
            tagType: TagType.EndTag,
          },
        ],
        root: 1,
      },
      title: "This is the title",
    };
    expect(page).toStrictEqual(expectedPage);
  });

  test("1.12 h4", () => {
    const page = parse(test_12_html);
    const expectedPage: PageContent = {
      buffers: [
        {
          content: "#### This is heading 4",
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
            end: { column: 22, line: 0 },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 22,
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
            color: Color.Black,
            id: "h4:{6cb59116-8e61-03a9-39ef-edf64004790d}{84}",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 22,
            parent: SENTINEL_INDEX,
            right: 2,
            style: {
              color: "#377bac",
              fontSize: "12pt",
              fontStyle: "italic",
              marginBottom: "0pt",
              marginTop: "0pt",
            },
            tag: "h4",
            tagType: TagType.StartTag,
          },
          {
            color: Color.Red,
            id: "h4:{6cb59116-8e61-03a9-39ef-edf64004790d}{84}",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 0,
            parent: 1,
            right: SENTINEL_INDEX,
            tag: "h4",
            tagType: TagType.EndTag,
          },
        ],
        root: 1,
      },
      title: "This is the title",
    };
    expect(page).toStrictEqual(expectedPage);
  });

  test("1.13 h5", () => {
    const page = parse(test_13_html);
    const expectedPage: PageContent = {
      buffers: [
        {
          content:
            "##### This is **_{text-decoration:line-through}heading{text-decoration:line-through}_** 5",
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
            end: { column: 89, line: 0 },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 89,
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
            color: Color.Black,
            id: "h5:{6cb59116-8e61-03a9-39ef-edf64004790d}{89}",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 89,
            parent: SENTINEL_INDEX,
            right: 2,
            style: {
              color: "#2e75b5",
              marginBottom: "0pt",
              marginTop: "0pt",
            },
            tag: "h5",
            tagType: TagType.StartTag,
          },
          {
            color: Color.Red,
            id: "h5:{6cb59116-8e61-03a9-39ef-edf64004790d}{89}",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 0,
            parent: 1,
            right: SENTINEL_INDEX,
            tag: "h5",
            tagType: TagType.EndTag,
          },
        ],
        root: 1,
      },
      title: "This is the title",
    };
    expect(page).toStrictEqual(expectedPage);
  });

  test("1.14 h6", () => {
    const page = parse(test_14_html);
    const expectedPage: PageContent = {
      buffers: [
        {
          content: "###### This is heading 6",
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
            end: { column: 24, line: 0 },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 24,
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
            color: Color.Black,
            id: "h6:{6cb59116-8e61-03a9-39ef-edf64004790d}{94}",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 24,
            parent: SENTINEL_INDEX,
            right: 2,
            style: {
              color: "#2e75b5",
              fontStyle: "italic",
              marginBottom: "0pt",
              marginTop: "0pt",
            },
            tag: "h6",
            tagType: TagType.StartTag,
          },
          {
            color: Color.Red,
            id: "h6:{6cb59116-8e61-03a9-39ef-edf64004790d}{94}",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 0,
            parent: 1,
            right: SENTINEL_INDEX,
            tag: "h6",
            tagType: TagType.EndTag,
          },
        ],
        root: 1,
      },
      title: "This is the title",
    };
    expect(page).toStrictEqual(expectedPage);
  });

  test("1.15 Superscript", () => {
    const page = parse(test_15_html);
    const expectedPage: PageContent = {
      buffers: [
        {
          content: "Superscript x{!sup}2{!sup}",
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
            end: { column: 26, line: 0 },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 26,
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
            color: Color.Black,
            id: "p:{28216e73-1f0a-05fd-25c5-a04844147e70}{29}",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 26,
            parent: SENTINEL_INDEX,
            right: 2,
            style: {
              marginBottom: "0pt",
              marginTop: "0pt",
            },
            tag: "p",
            tagType: TagType.StartTag,
          },
          {
            color: Color.Red,
            id: "p:{28216e73-1f0a-05fd-25c5-a04844147e70}{29}",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 0,
            parent: 1,
            right: SENTINEL_INDEX,
            tag: "p",
            tagType: TagType.EndTag,
          },
        ],
        root: 1,
      },
      title: "This is the title",
    };
    expect(page).toStrictEqual(expectedPage);
  });

  test("1.16 Subscript", () => {
    const page = parse(test_16_html);
    const expectedPage: PageContent = {
      buffers: [
        {
          content: "Subscript x{!sub}2{!sub}",
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
            end: { column: 24, line: 0 },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 24,
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
            color: Color.Black,
            id: "p:{28216e73-1f0a-05fd-25c5-a04844147e70}{32}",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 24,
            parent: SENTINEL_INDEX,
            right: 2,
            style: {
              marginBottom: "0pt",
              marginTop: "0pt",
            },
            tag: "p",
            tagType: TagType.StartTag,
          },
          {
            color: Color.Red,
            id: "p:{28216e73-1f0a-05fd-25c5-a04844147e70}{32}",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 0,
            parent: 1,
            right: SENTINEL_INDEX,
            tag: "p",
            tagType: TagType.EndTag,
          },
        ],
        root: 1,
      },
      title: "This is the title",
    };
    expect(page).toStrictEqual(expectedPage);
  });

  test("1.17 Line through and underline", () => {
    const page = parse(test_17_html);
    const expectedPage: PageContent = {
      buffers: [
        {
          content:
            " {text-decoration:line-through underline}Underlined and crossed out{text-decoration:line-through underline}",
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
            end: { column: 107, line: 0 },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 107,
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
            attributes: {
              dataid: "p:{60c45a4d-c9e5-01bd-2ce3-6937733a7742}{11}",
            },
            color: Color.Black,
            id: "p:{28216e73-1f0a-05fd-25c5-a04844147e70}{38}",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 107,
            parent: SENTINEL_INDEX,
            right: 2,
            tag: "p",
            tagType: TagType.StartTag,
          },
          {
            color: Color.Red,
            id: "p:{28216e73-1f0a-05fd-25c5-a04844147e70}{38}",
            left: SENTINEL_INDEX,
            leftSubTreeLength: 0,
            length: 0,
            parent: 1,
            right: SENTINEL_INDEX,
            tag: "p",
            tagType: TagType.EndTag,
          },
        ],
        root: 1,
      },
      title: "This is the title",
    };
    expect(page).toStrictEqual(expectedPage);
  });
});
