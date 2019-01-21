import { Color, PageContentMutable } from "../pageModel";
import { SENTINEL_STRUCTURE } from "../structureTree/tree";
import { SENTINEL_INDEX } from "../tree";
import { ContentNode, ContentNodeMutable, NEWLINE } from "./contentModel";
import {
  calculateCharCount,
  calculateLineFeedCount,
  findNodeAtOffset,
  recomputeTreeMetadata,
  SENTINEL_CONTENT,
} from "./tree";

export const getPage = (): PageContentMutable => ({
  structureNodes: [SENTINEL_STRUCTURE],
  structureRoot: SENTINEL_INDEX,
  buffers: [],
  ...getFinalTree(),
  newlineFormat: NEWLINE.LF,

  previouslyInsertedContentNodeIndex: null,
  previouslyInsertedContentNodeOffset: null,
});

export const getFinalTree = (): {
  contentNodes: ContentNode[];
  contentRoot: number;
} => ({
  contentNodes: [
    SENTINEL_CONTENT,
    {
      // 1
      bufferIndex: 1,
      start: { line: 0, column: 0 },
      end: { line: 2, column: 6 },
      leftCharCount: 0,
      leftLineFeedCount: 0,
      length: 31,
      lineFeedCount: 2,
      color: Color.Black,
      parent: 2,
      left: SENTINEL_INDEX,
      right: SENTINEL_INDEX,
    },
    {
      // 2
      bufferIndex: 0,
      start: { line: 0, column: 1 },
      end: { line: 0, column: 12 },
      leftCharCount: 31,
      leftLineFeedCount: 2,
      length: 11,
      lineFeedCount: 0,
      color: Color.Black,
      parent: SENTINEL_INDEX,
      left: 1,
      right: 6,
    },
    {
      // 3
      bufferIndex: 0,
      start: { line: 0, column: 55 },
      end: { line: 0, column: 65 },
      leftCharCount: 0,
      leftLineFeedCount: 0,
      length: 10,
      lineFeedCount: 0,
      color: Color.Black,
      parent: 4,
      left: SENTINEL_INDEX,
      right: SENTINEL_INDEX,
    },
    {
      // 4
      bufferIndex: 0,
      start: { line: 0, column: 12 },
      end: { line: 0, column: 14 },
      leftCharCount: 10,
      leftLineFeedCount: 0,
      length: 2,
      lineFeedCount: 0,
      color: Color.Black,
      parent: 6,
      left: 3,
      right: 5,
    },
    {
      // 5
      bufferIndex: 0,
      start: { line: 0, column: 66 },
      end: { line: 0, column: 76 },
      leftCharCount: 0,
      leftLineFeedCount: 0,
      length: 10,
      lineFeedCount: 0,
      color: Color.Black,
      parent: 4,
      left: SENTINEL_INDEX,
      right: SENTINEL_INDEX,
    },
    {
      // 6
      bufferIndex: 1,
      start: { line: 2, column: 6 },
      end: { line: 2, column: 22 },
      leftCharCount: 22,
      leftLineFeedCount: 0,
      length: 16,
      lineFeedCount: 0,
      color: Color.Black,
      parent: 2,
      left: 4,
      right: 7,
    },
    {
      // 7
      bufferIndex: 0,
      start: { line: 0, column: 14 },
      end: { line: 0, column: 55 },
      leftCharCount: 0,
      leftLineFeedCount: 0,
      length: 41,
      lineFeedCount: 0,
      color: Color.Black,
      parent: 6,
      left: SENTINEL_INDEX,
      right: SENTINEL_INDEX,
    },
  ],
  contentRoot: 2,
});

describe("Functions for common tree operations on the piece table/red-black tree.", () => {
  test("findNodeAtOffset", () => {
    const { contentNodes: nodes, contentRoot: root } = getFinalTree();

    expect(findNodeAtOffset(-1, nodes, root)).toStrictEqual({
      node: SENTINEL_CONTENT,
      nodeIndex: 1,
      remainder: 0,
      nodeStartOffset: 0,
    });

    expect(findNodeAtOffset(0, nodes, root)).toStrictEqual({
      node: nodes[1],
      nodeIndex: 1,
      remainder: 0,
      nodeStartOffset: 0,
    });

    expect(findNodeAtOffset(30, nodes, root)).toStrictEqual({
      node: nodes[1],
      nodeIndex: 1,
      remainder: 30,
      nodeStartOffset: 0,
    });

    expect(findNodeAtOffset(31, nodes, root)).toStrictEqual({
      node: nodes[2],
      nodeIndex: 2,
      remainder: 0,
      nodeStartOffset: 31,
    });

    expect(findNodeAtOffset(32, nodes, root)).toStrictEqual({
      node: nodes[2],
      nodeIndex: 2,
      remainder: 1,
      nodeStartOffset: 31,
    });

    expect(findNodeAtOffset(41, nodes, root)).toStrictEqual({
      node: nodes[2],
      nodeIndex: 2,
      remainder: 10,
      nodeStartOffset: 31,
    });

    expect(findNodeAtOffset(42, nodes, root)).toStrictEqual({
      node: nodes[3],
      nodeIndex: 3,
      remainder: 0,
      nodeStartOffset: 42,
    });

    expect(findNodeAtOffset(51, nodes, root)).toStrictEqual({
      node: nodes[3],
      nodeIndex: 3,
      remainder: 9,
      nodeStartOffset: 42,
    });

    expect(findNodeAtOffset(52, nodes, root)).toStrictEqual({
      node: nodes[4],
      nodeIndex: 4,
      remainder: 0,
      nodeStartOffset: 52,
    });

    expect(findNodeAtOffset(53, nodes, root)).toStrictEqual({
      node: nodes[4],
      nodeIndex: 4,
      remainder: 1,
      nodeStartOffset: 52,
    });

    expect(findNodeAtOffset(54, nodes, root)).toStrictEqual({
      node: nodes[5],
      nodeIndex: 5,
      remainder: 0,
      nodeStartOffset: 54,
    });

    expect(findNodeAtOffset(63, nodes, root)).toStrictEqual({
      node: nodes[5],
      nodeIndex: 5,
      remainder: 9,
      nodeStartOffset: 54,
    });

    expect(findNodeAtOffset(64, nodes, root)).toStrictEqual({
      node: nodes[6],
      nodeIndex: 6,
      remainder: 0,
      nodeStartOffset: 64,
    });

    expect(findNodeAtOffset(79, nodes, root)).toStrictEqual({
      node: nodes[6],
      nodeIndex: 6,
      remainder: 15,
      nodeStartOffset: 64,
    });

    expect(findNodeAtOffset(80, nodes, root)).toStrictEqual({
      node: nodes[7],
      nodeIndex: 7,
      remainder: 0,
      nodeStartOffset: 80,
    });

    expect(findNodeAtOffset(120, nodes, root)).toStrictEqual({
      node: nodes[7],
      nodeIndex: 7,
      remainder: 40,
      nodeStartOffset: 80,
    });

    // out of range
    expect(findNodeAtOffset(121, nodes, root)).toStrictEqual({
      node: nodes[7],
      nodeIndex: 7,
      remainder: 41,
      nodeStartOffset: 80,
    });
  });

  test("Calculate line feed count", () => {
    const page = getPage();
    expect(calculateLineFeedCount(page, page.contentRoot)).toBe(2);
  });

  test("Calculate character count", () => {
    const page = getPage();
    expect(calculateCharCount(page, page.contentRoot)).toBe(121);
  });

  test("Recompute tree metadata: add a node to the end", () => {
    const page = getPage(); // hypothetically added the last node
    recomputeTreeMetadata(page, 7);
    expect(page).toStrictEqual(getPage());
  });

  test("Recompute tree metadata: add a node in the middle", () => {
    const page = getPage(); // hypothetically added node 5
    (page.contentNodes[6] as ContentNodeMutable).leftCharCount = 12;
    (page.contentNodes[5] as ContentNodeMutable).lineFeedCount = 5;
    const expectedPage = getPage();
    (expectedPage.contentNodes[6] as ContentNodeMutable).leftLineFeedCount += 5;
    (expectedPage.contentNodes[5] as ContentNodeMutable).lineFeedCount += 5;

    recomputeTreeMetadata(page, 4);
    expect(page).toStrictEqual(expectedPage);
  });
});
