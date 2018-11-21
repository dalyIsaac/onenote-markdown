import { Color, IPageContent } from "../model";
import { SENTINEL_INDEX } from "../reducer";
import { createNewPage } from "./createNewPage";
import { IContentInsert, insertContent } from "./insert";

describe("page/tree/insert", () => {
  const constructOriginalPage = (): IPageContent => {
    const onenotePage = {
      id: "test1",
      content:
        "Do not go gentle into that good night,\nOld age should burn and rave at close of day;",
    };
    return createNewPage(onenotePage);
  };

  /**
   * Adds content to the end of the original content.
   */
  const constructAddition1 = (): IPageContent => {
    const page = constructOriginalPage();
    page.buffers.push({
      isReadOnly: false,
      lineStarts: [0, 1],
      content: "\nRage, rage against the dying of the light.",
    });
    page.nodes.push({
      bufferIndex: 1,
      start: { line: 0, column: 0 },
      end: { line: 1, column: 42 },
      leftCharCount: 0,
      leftLineFeedCount: 0,
      lineFeedCount: 1,
      length: 43,
      color: Color.Red,
      parent: 0,
      left: SENTINEL_INDEX,
      right: SENTINEL_INDEX,
    });
    page.nodes[0].right = 1;
    return page;
  };

  /**
   * Adds content to the end of the original + added content.
   */
  const constructAddition2 = (): IPageContent => {
    const page = constructAddition1();
    const buffer = page.buffers.pop()!;
    buffer.content += "\n\nThough wise men by their end know dark is right,";
    buffer.lineStarts = [...buffer.lineStarts, 44, 45];
    page.buffers.push(buffer);
    const node = page.nodes.pop()!;
    page.nodes.push({
      ...node,
      end: { line: 3, column: 48 },
      length: 93,
    });
    return page;
  };

  /**
   * Adds content to the start of the original content.
   */
  const constructAddition3 = (): IPageContent => {
    const page = constructAddition2();
    let buffer = page.buffers.pop()!;
    buffer = {
      isReadOnly: false,
      lineStarts: buffer.lineStarts.concat(
        [53, 54].map((x: number) => x + buffer.content.length),
      ),
      content:
        buffer.content +
        "Do not go gentle into that good night - Dylan Thomas\n\n",
    };
    page.buffers.push(buffer);
    const node = {
      bufferIndex: 1,
      start: { line: 3, column: 48 },
      end: { line: 5, column: 1 },
      leftCharCount: 0,
      leftLineFeedCount: 0,
      length: 54,
      lineFeedCount: 2,
      color: Color.Red,
      parent: 0,
      left: SENTINEL_INDEX,
      right: SENTINEL_INDEX,
    };
    page.nodes.push(node);
    page.nodes[0].left = 2;
    page.nodes[0].leftCharCount = node.length;
    page.nodes[0].leftLineFeedCount = node.lineFeedCount;
    return page;
  };

  test("1. Insert content at the end of the original content (poem L3)", () => {
    const expectedPage = constructAddition1();
    const page = constructOriginalPage();
    const insertedContent: IContentInsert = {
      content: "\nRage, rage against the dying of the light.",
      offset: 84,
    };
    const acquiredPage = insertContent(insertedContent, page);
    expect(acquiredPage).toEqual(expectedPage);
  });

  test("2. Insert content at the end of the content (poem L4)", () => {
    const expectedPage = constructAddition2();
    const page = constructAddition1();
    const insertedContent: IContentInsert = {
      content: "\n\nThough wise men by their end know dark is right,",
      offset: 127,
    };
    const acquiredPage = insertContent(insertedContent, page);
    expect(acquiredPage).toEqual(expectedPage);
  });

  test("3. Insert content at the start of the original content (title and author)", () => {
    const expectedPage = constructAddition3();
    const page = constructAddition2();
    const insertedContent: IContentInsert = {
      content: "Do not go gentle into that good night - Dylan Thomas\n\n",
      offset: 0,
    };
    const acquiredPage = insertContent(insertedContent, page);
    expect(acquiredPage).toEqual(expectedPage);
  });

  // test("4. Insert content at the end of the title (year published)", () => {
  // });

  // test("5. Insert corrected text (poem L4: 'by their end' => 'at their end')", () => {
  //   // do stuff
  // });
});
