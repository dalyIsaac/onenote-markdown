import parse from "./parser";
import { PageContent, Color } from "./pageModel";
import { SENTINEL_CONTENT } from "./contentTree/tree";
import { SENTINEL_STRUCTURE } from "./structureTree/tree";
import { EMPTY_TREE_ROOT, SENTINEL_INDEX } from "./tree/tree";
import { TagType } from "./structureTree/structureModel";

describe("Parser tests", () => {
  test("Ensures that the parser can correctly parse the HTML head data.", () => {
    const html =
      `<html lang="en-NZ">` +
      `<head>` +
      `<title>This is the title</title>` +
      `<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />` +
      `<meta name="created" content="2018-09-03T14:08:00.0000000" />` +
      `</head>` +
      `</html>`;
    const page = parse(html);
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

  test("Tests that paragraph tags can be handled.", () => {
    const html =
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
    const page = parse(html);
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

  test("Multiple styles inside a single tag.", () => {
    const html =
      `<html lang="en-NZ">` +
      `<head>` +
      `<title>This is the title</title>` +
      `<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />` +
      `<meta name="created" content="2018-09-03T14:08:00.0000000" />` +
      `</head>` +
      `<body data-absolute-enabled="true" style="font-family:Calibri;font-size:11pt">` +
      `<p id="p:{a977e62e-3126-8e0d-1368-bcf55df0a6de}{15}" style="margin-top:0pt;margin-bottom:0pt">` +
      `<span style="font-weight:bold;font-style:italic;text-decoration:underline">` +
      `Bold and underlined and italics. ` +
      `</span>` +
      `</p>` +
      `</body>` +
      `</html>`;
    const page = parse(html);
    const expectedPage: PageContent = {
      buffers: [
        {
          content:
            "**_{text-decoration:underline}Bold and underlined and italics. {text-decoration:underline}_**",
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
            end: { column: 93, line: 0 },
            left: SENTINEL_INDEX,
            leftCharCount: 0,
            leftLineFeedCount: 0,
            length: 93,
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
            length: 93,
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

  test("Paragraph with quotes.", () => {
    const html =
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
    const page = parse(html);
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
});
