import { Color, NEWLINE, NodeType, PageContent } from "../model";
import Parser from "./parser";
import { SENTINEL } from "./tree";

describe("Parser tests", () => {
  test("One line content in page", () => {
    const html = `<html lang="en-NZ">
            <head>
                <title>This is the title</title>
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                <meta name="created" content="2018-09-03T14:08:00.0000000" />
            </head>
            <body data-absolute-enabled="true" style="font-family:Calibri;font-size:11pt">
                <span id="spanId" style="font-size:10pt;color:#ffffff" data-render-src="source">Text between a span. 
Newline.</span>
            </body>
        </html>`;
    const page = new Parser(html).parse();
    expect(page).toEqual({
      buffers: [
        {
          content: `Text between a span. 
Newline.`,
          isReadOnly: true,
          lineStarts: [0, 22],
        },
      ],
      charset: "utf-8",
      created: "2018-09-03T14:08:00.0000000",
      fontFamily: "Calibri",
      fontSize: "11pt",
      language: "en-NZ",
      newlineFormat: NEWLINE.LF,
      nodes: [
        SENTINEL,
        {
          color: Color.Red,
          parent: 2,
          left: 0,
          right: 0,
          length: 0,
          lineFeedCount: 0,
          leftCharCount: 0,
          leftLineFeedCount: 0,
          properties: {
            dataRenderSrc: "source",
          },
          id: "spanId",
          styles: {
            color: "#ffffff",
            fontSize: "10pt",
          },
          tag: "span",
          nodeType: NodeType.StartTag,
        },
        {
          bufferIndex: 0,
          color: Color.Black,
          start: { line: 0, column: 0 },
          end: { line: 1, column: 8 },
          length: 30,
          lineFeedCount: 1,
          leftLineFeedCount: 0,
          leftCharCount: 0,
          parent: 0,
          left: 1,
          right: 3,
          nodeType: NodeType.Content,
        },
        {
          color: Color.Red,
          parent: 2,
          left: 0,
          right: 0,
          length: 0,
          lineFeedCount: 0,
          leftCharCount: 0,
          leftLineFeedCount: 0,
          tag: "span",
          nodeType: NodeType.EndTag,
          id: "spanId",
        },
      ],
      previouslyInsertedNodeIndex: 2,
      previouslyInsertedNodeOffset: 0,
      root: 2,
      title: "This is the title",
    });
  });

  test("Paragraph tags with formatting", () => {
    const html = `<html lang="en-NZ">
                <head>
                    <title>This is the title</title>
                    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                    <meta name="created" content="2018-09-03T14:08:00.0000000" />
                </head>
                <body data-absolute-enabled="true" style="font-family:Calibri;font-size:11pt">
                    <p id="p:{6cb59116-8e61-03a9-39ef-edf64004790d}{62}" style="margin-top:0pt;margin-bottom:0pt"><span style="font-weight:bold">Bold</span> text which has <span style="font-style:italic">italics</span> and <span style="text-decoration:underline">underlines</span></p>
                </body>
            </html>`;
    const page = new Parser(html).parse();
    const expectedPage: PageContent = {
      buffers: [
        {
          content: `Bold text which has italics and underlines`,
          isReadOnly: true,
          lineStarts: [0],
        },
      ],
      charset: "utf-8",
      created: "2018-09-03T14:08:00.0000000",
      fontFamily: "Calibri",
      fontSize: "11pt",
      language: "en-NZ",
      newlineFormat: NEWLINE.LF,
      nodes: [
        SENTINEL,
        {
          // 1
          color: Color.Black,
          id: "p:{6cb59116-8e61-03a9-39ef-edf64004790d}{62}",
          tag: "p",
          styles: {
            marginTop: "0pt",
            marginBottom: "0pt",
          },
          length: 0,
          lineFeedCount: 0,
          leftCharCount: 0,
          leftLineFeedCount: 0,
          nodeType: NodeType.StartTag,
          parent: 2,
          left: 0,
          right: 0,
        },
        {
          // 2
          color: Color.Black,
          tag: "span",
          styles: {
            fontWeight: "bold",
          },
          length: 0,
          lineFeedCount: 0,
          leftCharCount: 0,
          leftLineFeedCount: 0,
          nodeType: NodeType.StartTag,
          parent: 4,
          left: 1,
          right: 3,
        },
        {
          // 3
          color: Color.Black,
          bufferIndex: 0,
          start: { line: 0, column: 0 },
          end: { line: 0, column: 4 },
          length: 4,
          lineFeedCount: 0,
          leftCharCount: 0,
          leftLineFeedCount: 0,
          nodeType: NodeType.Content,
          parent: 2,
          left: 0,
          right: 0,
        },
        {
          // 4
          color: Color.Black,
          tag: "span",
          nodeType: NodeType.EndTag,
          length: 0,
          lineFeedCount: 0,
          leftCharCount: 4,
          leftLineFeedCount: 0,
          parent: 0,
          left: 2,
          right: 8,
        },
        {
          // 5
          color: Color.Black,
          nodeType: NodeType.Content,
          bufferIndex: 0,
          start: { line: 0, column: 4 },
          end: { line: 0, column: 20 },
          length: 16,
          lineFeedCount: 0,
          leftCharCount: 0,
          leftLineFeedCount: 0,
          parent: 6,
          left: 0,
          right: 0,
        },
        {
          // 6
          color: Color.Red,
          nodeType: NodeType.StartTag,
          tag: "span",
          length: 0,
          lineFeedCount: 0,
          leftCharCount: 16,
          leftLineFeedCount: 0,
          styles: {
            fontStyle: "italic",
          },
          parent: 8,
          left: 5,
          right: 7,
        },
        {
          // 7
          bufferIndex: 0,
          color: Color.Black,
          nodeType: NodeType.Content,
          start: { line: 0, column: 20 },
          end: { line: 0, column: 27 },
          length: 7,
          lineFeedCount: 0,
          leftCharCount: 0,
          leftLineFeedCount: 0,
          parent: 6,
          left: 0,
          right: 0,
        },
        {
          // 8
          color: Color.Black,
          nodeType: NodeType.EndTag,
          tag: "span",
          parent: 4,
          left: 6,
          right: 10,
          length: 0,
          lineFeedCount: 0,
          leftCharCount: 23,
          leftLineFeedCount: 0,
        },
        {
          // 9
          color: Color.Black,
          nodeType: NodeType.Content,
          bufferIndex: 0,
          length: 5,
          start: { line: 0, column: 27 },
          end: { line: 0, column: 32 },
          lineFeedCount: 0,
          leftCharCount: 0,
          leftLineFeedCount: 0,
          parent: 10,
          left: 0,
          right: 0,
        },
        {
          // 10
          color: Color.Red,
          nodeType: NodeType.StartTag,
          tag: "span",
          styles: {
            textDecoration: "underline",
          },
          length: 0,
          lineFeedCount: 0,
          leftCharCount: 5,
          leftLineFeedCount: 0,
          parent: 8,
          left: 9,
          right: 12,
        },
        {
          // 11
          nodeType: NodeType.Content,
          color: Color.Red,
          bufferIndex: 0,
          start: { line: 0, column: 32 },
          end: { line: 0, column: 42 },
          length: 10,
          lineFeedCount: 0,
          leftCharCount: 0,
          leftLineFeedCount: 0,
          parent: 12,
          left: 0,
          right: 0,
        },
        {
          // 12
          nodeType: NodeType.EndTag,
          color: Color.Black,
          tag: "span",
          length: 0,
          lineFeedCount: 0,
          leftCharCount: 10,
          leftLineFeedCount: 0,
          parent: 10,
          left: 11,
          right: 13,
        },
        {
          // 13
          nodeType: NodeType.EndTag,
          color: Color.Red,
          tag: "p",
          id: "p:{6cb59116-8e61-03a9-39ef-edf64004790d}{62}",
          length: 0,
          lineFeedCount: 0,
          leftCharCount: 0,
          leftLineFeedCount: 0,
          parent: 12,
          left: 0,
          right: 0,
        },
      ],
      previouslyInsertedNodeIndex: 11,
      previouslyInsertedNodeOffset: 32,
      root: 4,
      title: "This is the title",
    };
    expect(page).toEqual(expectedPage);
  });

  test("Headings", () => {
    const html = `<html lang="en-NZ">
                <head>
                    <title>This is the title</title>
                    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                    <meta name="created" content="2018-09-03T14:08:00.0000000" />
                </head>
                <body data-absolute-enabled="true" style="font-family:Calibri;font-size:11pt">
                  <h1 id="h1:{6cb59116-8e61-03a9-39ef-edf64004790d}{69}" style="font-size:16pt;color:#1e4e79;margin-top:0pt;margin-bottom:0pt">This is <span style="font-weight:bold">heading</span> 1</h1>
                </body>
            </html>`;
    const page = new Parser(html).parse();
    const expectedPage: PageContent = {
      buffers: [
        {
          content: `This is heading 1`,
          isReadOnly: true,
          lineStarts: [0],
        },
      ],
      charset: "utf-8",
      created: "2018-09-03T14:08:00.0000000",
      fontFamily: "Calibri",
      fontSize: "11pt",
      language: "en-NZ",
      newlineFormat: NEWLINE.LF,
      nodes: [
        SENTINEL,
        {
          // 1
          color: Color.Black,
          id: "h1:{6cb59116-8e61-03a9-39ef-edf64004790d}{69}",
          tag: "h1",
          styles: {
            marginTop: "0pt",
            marginBottom: "0pt",
            fontSize: "16pt",
            color: "#1e4e79",
          },
          length: 0,
          lineFeedCount: 0,
          leftCharCount: 0,
          leftLineFeedCount: 0,
          nodeType: NodeType.StartTag,
          parent: 2,
          left: 0,
          right: 0,
        },
        {
          // 2
          color: Color.Black,
          bufferIndex: 0,
          start: { line: 0, column: 0 },
          end: { line: 0, column: 8 },
          length: 8,
          lineFeedCount: 0,
          leftCharCount: 0,
          leftLineFeedCount: 0,
          nodeType: NodeType.Content,
          parent: 0,
          left: 1,
          right: 4,
        },
        {
          // 3
          color: Color.Black,
          tag: "span",
          length: 0,
          lineFeedCount: 0,
          leftCharCount: 0,
          leftLineFeedCount: 0,
          nodeType: NodeType.StartTag,
          styles: {
            fontWeight: "bold",
          },
          parent: 4,
          left: 0,
          right: 0,
        },
        {
          // 4
          color: Color.Red,
          length: 7,
          bufferIndex: 0,
          start: { line: 0, column: 8 },
          end: { line: 0, column: 15 },
          lineFeedCount: 0,
          leftCharCount: 0,
          leftLineFeedCount: 0,
          nodeType: NodeType.Content,
          parent: 2,
          left: 3,
          right: 6,
        },
        {
          // 5
          color: Color.Red,
          tag: "span",
          nodeType: NodeType.EndTag,
          length: 0,
          lineFeedCount: 0,
          leftCharCount: 0,
          leftLineFeedCount: 0,
          parent: 6,
          left: 0,
          right: 0,
        },
        {
          // 6
          color: Color.Black,
          nodeType: NodeType.Content,
          length: 2,
          bufferIndex: 0,
          start: { line: 0, column: 15 },
          end: { line: 0, column: 17 },
          lineFeedCount: 0,
          leftCharCount: 0,
          leftLineFeedCount: 0,
          parent: 4,
          left: 5,
          right: 7,
        },
        {
          // 7
          color: Color.Red,
          tag: "h1",
          nodeType: NodeType.EndTag,
          id: "h1:{6cb59116-8e61-03a9-39ef-edf64004790d}{69}",
          length: 0,
          lineFeedCount: 0,
          leftCharCount: 0,
          leftLineFeedCount: 0,
          parent: 6,
          left: 0,
          right: 0,
        },
      ],
      previouslyInsertedNodeIndex: 6,
      previouslyInsertedNodeOffset: 15,
      root: 2,
      title: "This is the title",
    };
    expect(page).toEqual(expectedPage);
  });

  test("Citation", () => {
    const html = `<html lang="en-NZ">
                <head>
                    <title>This is the title</title>
                    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                    <meta name="created" content="2018-09-03T14:08:00.0000000" />
                </head>
                <body data-absolute-enabled="true" style="font-family:Calibri;font-size:11pt">
                  <cite id="cite:{6cb59116-8e61-03a9-39ef-edf64004790d}{105}" style="font-size:9pt;color:#595959;margin-top:0pt;margin-bottom:0pt">Citation</cite>
                </body>
            </html>`;
    const page = new Parser(html).parse();
    const expectedPage: PageContent = {
      buffers: [
        {
          content: `Citation`,
          isReadOnly: true,
          lineStarts: [0],
        },
      ],
      charset: "utf-8",
      created: "2018-09-03T14:08:00.0000000",
      fontFamily: "Calibri",
      fontSize: "11pt",
      language: "en-NZ",
      newlineFormat: NEWLINE.LF,
      nodes: [
        SENTINEL,
        {
          // 1
          color: Color.Red,
          id: "cite:{6cb59116-8e61-03a9-39ef-edf64004790d}{105}",
          tag: "cite",
          styles: {
            fontSize: "9pt",
            marginTop: "0pt",
            marginBottom: "0pt",
            color: "#595959",
          },
          length: 0,
          lineFeedCount: 0,
          leftCharCount: 0,
          leftLineFeedCount: 0,
          nodeType: NodeType.StartTag,
          parent: 2,
          left: 0,
          right: 0,
        },
        {
          // 2
          color: Color.Black,
          bufferIndex: 0,
          start: { line: 0, column: 0 },
          end: { line: 0, column: 8 },
          length: 8,
          lineFeedCount: 0,
          leftCharCount: 0,
          leftLineFeedCount: 0,
          nodeType: NodeType.Content,
          parent: 0,
          left: 1,
          right: 3,
        },
        {
          // 3
          color: Color.Red,
          id: "cite:{6cb59116-8e61-03a9-39ef-edf64004790d}{105}",
          tag: "cite",
          length: 0,
          lineFeedCount: 0,
          leftCharCount: 0,
          leftLineFeedCount: 0,
          nodeType: NodeType.EndTag,
          parent: 2,
          left: 0,
          right: 0,
        },
      ],
      previouslyInsertedNodeIndex: 2,
      previouslyInsertedNodeOffset: 0,
      root: 2,
      title: "This is the title",
    };
    expect(page).toEqual(expectedPage);
  });
});
