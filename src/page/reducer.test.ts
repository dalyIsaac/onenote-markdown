import { OnenotePage } from "@microsoft/microsoft-graph-types";
import { IStoreReceivedPageAction, STORE_RECEIVED_PAGE } from "./actions";
import {
  Color,
  IBuffer,
  IBufferCursor,
  IPageContent,
  IStatePages,
} from "./model";
import { INode } from "./node";
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
        if (value <= content.length) {
          expectedLineStarts.push(value);
        } else {
          stop = true;
        }
      }
      return expectedLineStarts;
    };

    /**
     * Fully constructs the expected page's piece table after receiving a new page.
     * @param id The id of the page to store.
     * @param content OnenotePage HTML content.
     * @param newline The newline (EOF) format.
     */
    const constructExpectedNewPageState = (
      id: string,
      content: string,
      newline: string,
    ): IStatePages => {
      const expectedState: IStatePages = {};
      expectedState[id] = {
        buffers: [constructExpectedNewPageBuffer(content, newline)],
        newlineFormat: constructExpectedNewPageNewlineFormat(content, newline),
        nodes: [constructExpectedNewPageNode(content, newline)],
        root: constructExpectedNewPageRoot(),
      };
      return expectedState;
    };

    /**
     * Constructs the expected buffer for the piece table after receiving a new page.
     * @param content OnenotePage HTML content.
     * @param newline The newline (EOF) format.
     */
    const constructExpectedNewPageBuffer = (
      content: string,
      newline: string,
    ): IBuffer => ({
      isReadOnly: true,
      lineStarts: getExpectedLineStarts(content, newline),
      value: content,
    });

    const pageReducerTest = (content: string, newline: string) => {
      const { page } = variables(content);
      const action: IStoreReceivedPageAction = {
        receivedPage: page,
        type: STORE_RECEIVED_PAGE,
      };
      const state = pageReducer({}, action);
      const expectedState = constructExpectedNewPageState(
        page.id as string,
        content,
        newline,
      );
      expect(state).toEqual(expectedState);
    };

    /**
     * Common test for the contents of the buffers.
     * @param content OnenotePage HTML content.
     * @param newline The newline (EOF) format.
     */
    const buffersTest = (content: string, newline: string) => {
      const { storedPage } = variables(content);
      const expectedBuffer = constructExpectedNewPageBuffer(content, newline);
      expect(storedPage.buffers.length).toBe(1);
      expect(storedPage.buffers[0]).toEqual(expectedBuffer);
    };

    /**
     * Constructs the expected new node for the piece table after receiving a new page.
     * @param content OnenotePage HTML content.
     * @param newline The newline (EOF) format.
     */
    const constructExpectedNewPageNode = (
      content: string,
      newline: string,
    ): INode => {
      const start: IBufferCursor = { column: 0, line: 0 };
      const lines = content.split(newline);
      const rowIndex = lines.length - 1;
      const lastRow = lines[rowIndex];
      const end: IBufferCursor = {
        column: lastRow.length,
        line: rowIndex,
      };

      return {
        bufferIndex: 0,
        start,
        end,
        leftCharCount: 0,
        leftLineFeedCount: 0,
        length: content.length,
        lineFeedCount: lines.length,
        color: Color.Black,
        parent: -1,
        left: -1,
        right: -1,
      };
    };

    /**
     * Common test for the contents of the nodes.
     * @param content OnenotePage HTML content.
     * @param newline The newline (EOF) format.
     */
    const nodesTest = (content: string, newline: string) => {
      const { storedPage } = variables(content);
      const expectedNode = constructExpectedNewPageNode(content, newline);
      const node = storedPage.nodes[0];
      expect(node).toEqual(expectedNode);
    };

    /**
     * Constructs the expected root for the piece table after receiving a new page.
     */
    const constructExpectedNewPageRoot = (): number => 0;

    /**
     * Common test for the root of the piece table.
     * @param root The index of the stored page's root.
     */
    const rootTest = (content: string) => {
      const { storedPage } = variables(content);
      const expectedRoot = constructExpectedNewPageRoot();
      expect(storedPage.root).toBe(expectedRoot);
    };

    /**
     * Constructs the expected newline format array for the piece table after receiving a new page.
     * @param content OnenotePage HTML content.
     * @param newline The newline (EOF) format.
     */
    const constructExpectedNewPageNewlineFormat = (
      content: string,
      newline: string,
    ): number[] => {
      const expectedFormatCharValues: number[] = [];
      for (let i = 0; i < newline.length; i++) {
        expectedFormatCharValues.push(newline.charCodeAt(i));
      }
      return expectedFormatCharValues;
    };

    /**
     * Common test for the newline (EOL) format for that page.
     * @param content OnenotePage HTML content.
     * @param newline The newline (EOF) format.
     */
    const newlineTest = (content: string, newline: string) => {
      const { storedPage } = variables(content);
      const expectedFormatCharValues = constructExpectedNewPageNewlineFormat(
        content,
        newline,
      );
      expect(storedPage.newlineFormat).toEqual(expectedFormatCharValues);
    };

    describe("LF content", () => {
      test("Page reducer", () => {
        pageReducerTest(LF_CONTENT, LF);
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
        pageReducerTest(CRLF_CONTENT, CRLF);
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
