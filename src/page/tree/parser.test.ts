import { NEWLINE, Color } from "../model";
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
                <span style="font-size:10pt;color:#ffffff" data-render-src="source">Text between a span. 
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
          bufferIndex: 0,
          color: Color.Black,
          start: { line: 0, column: 0 },
          end: { line: 1, column: 8 },
          leftCharCount: 0,
          leftLineFeedCount: 0,
          length: 30,
          lineFeedCount: 1,
          parent: 0,
          left: 0,
          right: 2,
          properties: {
            dataRenderSrc: "source",
          },
          styles: {
            color: "#ffffff",
            fontSize: "10pt",
          },
          tag: "span",
        },
        {
          parent: 1,
          left: 0,
          right: 0,
          tag: "span",
        },
      ],
      previouslyInsertedNodeIndex: 1,
      previouslyInsertedNodeOffset: 0,
      root: 1,
      title: "This is the title",
    });
  });
});
