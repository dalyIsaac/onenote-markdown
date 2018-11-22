import { Color, IPageContent, NEWLINE } from "../model";
import { SENTINEL_INDEX } from "../reducer";
import { IContentInsert, insertContent } from "./insert";

describe("page/tree/insert", () => {
  const getScenarioOneInitialPage = (): IPageContent => ({
    buffers: [
      {
        isReadOnly: false,
        lineStarts: [0],
        content: "a",
      },
    ],
    newlineFormat: NEWLINE.LF,
    nodes: [
      {
        bufferIndex: 0,
        start: {
          line: 0,
          column: 0,
        },
        end: {
          line: 0,
          column: 1,
        },
        leftCharCount: 0,
        leftLineFeedCount: 0,
        length: 1,
        lineFeedCount: 0,
        color: Color.Red,
        parent: SENTINEL_INDEX,
        left: SENTINEL_INDEX,
        right: SENTINEL_INDEX,
      },
    ],
    root: 0,
    previouslyInsertedNodeIndex: 0,
    previouslyInsertedNodeOffset: 0,
  });

  test("Scenario 1: insert at the end of the previously inserted node", () => {
    const expectedPage = getScenarioOneInitialPage();
    expectedPage.buffers[0].content += "b";
    expectedPage.nodes[0] = {
      ...expectedPage.nodes[0],
      end: {
        line: 0,
        column: 2,
      },
      length: 2,
    };

    const page = getScenarioOneInitialPage();
    const content: IContentInsert = {
      content: "b",
      offset: 1,
    };
    const receivedPage = insertContent(content, page);
    expect(receivedPage).toEqual(expectedPage);
  });
});
