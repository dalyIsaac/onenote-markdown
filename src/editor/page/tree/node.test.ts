import { Color, ContentNode, NodeType, TagNode } from "../model";
import { getStartPage } from "../reducer.test";
import { areTagEnds, getNodeContent } from "./node";

describe("editor/page/tree/node", () => {
  test("getNodeContent", () => {
    const page = getStartPage();
    expect(getNodeContent(page, 1))
      .toEqual(`Do not go gentle into that good night,
Old age should burn and ra`);
    expect(getNodeContent(page, 2)).toEqual("v");
    expect(getNodeContent(page, 3)).toEqual("e at close of ");
    expect(getNodeContent(page, 4)).toEqual("day");
    expect(getNodeContent(page, 5)).toEqual(";\n");
    expect(getNodeContent(page, 6)).toEqual("Ra");
    expect(getNodeContent(page, 7)).toEqual("g");
    expect(getNodeContent(page, 8)).toEqual("e, ra");
    expect(getNodeContent(page, 9)).toEqual("g");
    expect(getNodeContent(page, 10)).toEqual(
      "e against the dying of the light",
    );
    expect(getNodeContent(page, 11)).toEqual(".");
  });

  describe("areTagEnds", () => {
    const contentNode: ContentNode = {
      bufferIndex: 0,
      start: { line: 0, column: 0 },
      end: { line: 0, column: 10 },
      leftCharCount: 10,
      leftLineFeedCount: 12,
      length: 10,
      lineFeedCount: 0,
      color: Color.Red,
      parent: 4,
      left: 2,
      right: 3,
      nodeType: NodeType.Content,
    };

    const startTagNode: TagNode = {
      leftCharCount: 0,
      leftLineFeedCount: 0,
      length: 0,
      lineFeedCount: 0,
      color: Color.Red,
      parent: 4,
      left: 2,
      right: 3,
      nodeType: NodeType.StartTag,
      tag: "p",
      properties: {},
      style: {
        color: "black",
      },
      id: "helloWorld",
    };

    const endTagNode: TagNode = {
      leftCharCount: 0,
      leftLineFeedCount: 0,
      length: 0,
      lineFeedCount: 0,
      color: Color.Red,
      parent: 4,
      left: 2,
      right: 3,
      nodeType: NodeType.EndTag,
      tag: "p",
      id: "helloWorld",
    };

    test("Start is content node", () => {
      expect(areTagEnds(contentNode, endTagNode)).toBe(false);
    });

    test("End is content node", () => {
      expect(areTagEnds(startTagNode, contentNode)).toBe(false);
    });

    test("Different ids", () => {
      expect(areTagEnds({ ...startTagNode, id: "bonjour" }, endTagNode)).toBe(
        false,
      );
    });

    test("Different tags", () => {
      expect(areTagEnds({ ...startTagNode, tag: "sub" }, endTagNode)).toBe(
        false,
      );
    });

    test("Successful test", () => {
      expect(areTagEnds(startTagNode, endTagNode)).toBe(true);
    });
  });
});
