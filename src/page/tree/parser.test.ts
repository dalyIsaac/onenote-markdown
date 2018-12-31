import { Color, NEWLINE, NodeType } from "../model";
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
});
