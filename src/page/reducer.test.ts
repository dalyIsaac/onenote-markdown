import { OnenotePage } from "@microsoft/microsoft-graph-types";
import { IStoreReceivedPageAction, STORE_RECEIVED_PAGE } from "./actions";
import { IBufferCursor, IPageContent } from "./model";
import pageReducer, { createNewPage } from "./reducer";

const LF_CONTENT = `<html lang="en-NZ">
    <head>
        <title>Hello world </title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="created" content="2018-09-03T14:08:00.0000000" />
    </head>
    <body data-absolute-enabled="true" style="font-family:Calibri;font-size:11pt">
        <div style="position:absolute;left:48px;top:115px;width:720px">
            <h1 style="font-size:16pt;color:#1e4e79;margin-top:0pt;margin-bottom:0pt">Hello world</h1>
            <br />
        </div>
    </body>
</html>
`;

const CRLF_CONTENT = `<html lang="en-NZ">\r
    <head>\r
        <title>Hello world </title>\r
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\r
        <meta name="created" content="2018-09-03T14:08:00.0000000" />\r
    </head>\r
    <body data-absolute-enabled="true" style="font-family:Calibri;font-size:11pt">\r
        <div style="position:absolute;left:48px;top:115px;width:720px">\r
            <h1 style="font-size:16pt;color:#1e4e79;margin-top:0pt;margin-bottom:0pt">Hello world</h1>\r
            <br />\r
        </div>\r
    </body>\r
</html>\r
`;

describe("page/reducer", () => {
  describe("STORE_RECEIVED_PAGE", () => {
    const CRLF = "\r\n";
    const LF = "\n";

    /**
     * Constructor for a OnenotePage.
     * @param content OnenotePage HTML content.
     */
    const variables = (
      content: string,
    ): { page: OnenotePage; storedPage: IPageContent } => {
      const page: OnenotePage = {
        content,
        id: "fakeId",
      };
      const storedPage = createNewPage(page);
      return { page, storedPage };
    };

    /**
     * Gets the expected locations of the line starts.
     * @param content OnenotePage HTML content.
     * @param newline The newline (EOF) format.
     */
    const getExpectedLineStarts = (
      content: string,
      newline: string,
    ): number[] => {
      const length = newline.length;
      const lines = content.split(newline);
      const expectedLineStarts: number[] = [0];
      for (let i = 0, stop = false; i < lines.length && !stop; i++) {
        const value =
          lines[i].length +
          expectedLineStarts[expectedLineStarts.length - 1] +
          length;
        if (value < content.length) {
          expectedLineStarts.push(value);
        } else {
          stop = true;
        }
      }
      return expectedLineStarts;
    };

    /**
     * Common test for the contents of the buffers.
     * @param content OnenotePage HTML content.
     * @param newline The newline (EOF) format.
     */
    const buffersTest = (content: string, newline: string) => {
      const { storedPage } = variables(content);

      const expectedLineStarts = getExpectedLineStarts(content, newline);

      expect(storedPage.buffers.length).toBe(1);
      expect(storedPage.buffers[0].isReadOnly).toBe(true);
      expect(storedPage.buffers[0].lineStarts).toEqual(expectedLineStarts);
      expect(storedPage.buffers[0].value).toBe(content);
    };

    /**
     * Common test for the contents of the nodes.
     * @param content OnenotePage HTML content.
     * @param newline The newline (EOF) format.
     */
    const nodesTest = (content: string, newline: string) => {
      const { storedPage } = variables(content);
      const expectedStart: IBufferCursor = { column: 0, line: 0 };
      const lines = content.split(newline);
      const rowIndex = lines.length - 2;
      const lastRow = lines[rowIndex]; // the last "line" is empty - thus the last row is lines.length - 2
      const expectedColumn: IBufferCursor = {
        column: lastRow.length + newline.length,
        line: rowIndex,
      };

      const node = storedPage.nodes[0];
      expect(node.start).toEqual(expectedStart);
      expect(node.end).toEqual(expectedColumn);
      expect(node.bufferIndex).toBe(0);
      expect(node.leftCharCount).toBe(0);
      expect(node.leftLFCount).toBe(0);
      expect(node.parent).toBe(-1);
      expect(node.left).toBe(-1);
      expect(node.right).toBe(-1);
    };

    /**
     * Common test for the root of the piece table.
     * @param root The index of the stored page's root.
     */
    const rootTest = (content: string) => {
      const { storedPage } = variables(content);
      expect(storedPage.root).toBe(0);
    };

    /**
     * Common test for the newline (EOL) format for that page.
     * @param expectedFormatString A string which represents the newline (EOL) format.
     * @param receivedFormat The received format.
     */
    const newlineTest = (content: string, expectedFormatString: string) => {
      const { storedPage } = variables(content);
      const expectedFormatCharValues: number[] = [];
      for (let i = 0; i < expectedFormatString.length; i++) {
        expectedFormatCharValues.push(expectedFormatString.charCodeAt(i));
      }

      expect(storedPage.newlineFormat).toEqual(expectedFormatCharValues);
    };

    describe("LF content", () => {
      test("Page reducer", () => {
        const { page } = variables(LF_CONTENT);
        const action: IStoreReceivedPageAction = {
          receivedPage: page,
          type: STORE_RECEIVED_PAGE,
        };
        const state = pageReducer({}, action);
      });

      test("Buffers", () => {
        buffersTest(LF_CONTENT, LF);
      });

      test("Nodes", () => {
        nodesTest(LF_CONTENT, LF);
      });

      test("Root", () => {
        rootTest(LF_CONTENT);
      });

      test("Newline format", () => {
        newlineTest(LF_CONTENT, LF);
      });
    });

    describe("CRLF content", () => {
      test("Page reducer", () => {
        const { page } = variables(CRLF_CONTENT);
        const action: IStoreReceivedPageAction = {
          receivedPage: page,
          type: STORE_RECEIVED_PAGE,
        };
        const state = pageReducer({}, action);
      });

      test("Buffers", () => {
        buffersTest(CRLF_CONTENT, CRLF);
      });

      test("Nodes", () => {
        nodesTest(CRLF_CONTENT, CRLF);
      });

      test("Root", () => {
        rootTest(CRLF_CONTENT);
      });

      test("Newline format", () => {
        newlineTest(CRLF_CONTENT, CRLF);
      });
    });
  });
});
