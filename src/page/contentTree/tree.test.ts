import { Color, PageContentMutable } from "../pageModel";
import { SENTINEL_STRUCTURE } from "../structureTree/tree";
import { SENTINEL_INDEX } from "../tree/tree";
import { ContentNode, NEWLINE } from "./contentModel";
import {
  calculateCharCount,
  calculateLineFeedCount,
  findNodeAtOffset,
  SENTINEL_CONTENT,
} from "./tree";

export const getFinalTree = (): {
  nodes: ContentNode[];
  root: number;
} => ({
  nodes: [
    SENTINEL_CONTENT,
    {
      // 1
      bufferIndex: 1,
      color: Color.Black,
      end: { column: 6, line: 2 },
      left: SENTINEL_INDEX,
      leftCharCount: 0,
      leftLineFeedCount: 0,
      length: 31,
      lineFeedCount: 2,
      parent: 2,
      right: SENTINEL_INDEX,
      start: { column: 0, line: 0 },
    },
    {
      // 2
      bufferIndex: 0,
      color: Color.Black,
      end: { column: 12, line: 0 },
      left: 1,
      leftCharCount: 31,
      leftLineFeedCount: 2,
      length: 11,
      lineFeedCount: 0,
      parent: SENTINEL_INDEX,
      right: 6,
      start: { column: 1, line: 0 },
    },
    {
      // 3
      bufferIndex: 0,
      color: Color.Black,
      end: { column: 65, line: 0 },
      left: SENTINEL_INDEX,
      leftCharCount: 0,
      leftLineFeedCount: 0,
      length: 10,
      lineFeedCount: 0,
      parent: 4,
      right: SENTINEL_INDEX,
      start: { column: 55, line: 0 },
    },
    {
      // 4
      bufferIndex: 0,
      color: Color.Black,
      end: { column: 14, line: 0 },
      left: 3,
      leftCharCount: 10,
      leftLineFeedCount: 0,
      length: 2,
      lineFeedCount: 0,
      parent: 6,
      right: 5,
      start: { column: 12, line: 0 },
    },
    {
      // 5
      bufferIndex: 0,
      color: Color.Black,
      end: { column: 76, line: 0 },
      left: SENTINEL_INDEX,
      leftCharCount: 0,
      leftLineFeedCount: 0,
      length: 10,
      lineFeedCount: 0,
      parent: 4,
      right: SENTINEL_INDEX,
      start: { column: 66, line: 0 },
    },
    {
      // 6
      bufferIndex: 1,
      color: Color.Black,
      end: { column: 22, line: 2 },
      left: 4,
      leftCharCount: 22,
      leftLineFeedCount: 0,
      length: 16,
      lineFeedCount: 0,
      parent: 2,
      right: 7,
      start: { column: 6, line: 2 },
    },
    {
      // 7
      bufferIndex: 0,
      color: Color.Black,
      end: { column: 55, line: 0 },
      left: SENTINEL_INDEX,
      leftCharCount: 0,
      leftLineFeedCount: 0,
      length: 41,
      lineFeedCount: 0,
      parent: 6,
      right: SENTINEL_INDEX,
      start: { column: 14, line: 0 },
    },
  ],
  root: 2,
});

export const getPage = (): PageContentMutable => ({
  buffers: [],
  content: { ...getFinalTree() },
  newlineFormat: NEWLINE.LF,
  previouslyInsertedContentNodeIndex: null,
  previouslyInsertedContentNodeOffset: null,
  structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
});

describe("Functions for common tree operations on the piece table/red-black tree.", () => {
  test("findNodeAtOffset", () => {
    const { nodes, root } = getFinalTree();

    expect(findNodeAtOffset(-1, nodes, root)).toStrictEqual({
      node: SENTINEL_CONTENT,
      nodeIndex: 1,
      nodeStartOffset: 0,
      remainder: 0,
    });

    expect(findNodeAtOffset(0, nodes, root)).toStrictEqual({
      node: nodes[1],
      nodeIndex: 1,
      nodeStartOffset: 0,
      remainder: 0,
    });

    expect(findNodeAtOffset(30, nodes, root)).toStrictEqual({
      node: nodes[1],
      nodeIndex: 1,
      nodeStartOffset: 0,
      remainder: 30,
    });

    expect(findNodeAtOffset(31, nodes, root)).toStrictEqual({
      node: nodes[2],
      nodeIndex: 2,
      nodeStartOffset: 31,
      remainder: 0,
    });

    expect(findNodeAtOffset(32, nodes, root)).toStrictEqual({
      node: nodes[2],
      nodeIndex: 2,
      nodeStartOffset: 31,
      remainder: 1,
    });

    expect(findNodeAtOffset(41, nodes, root)).toStrictEqual({
      node: nodes[2],
      nodeIndex: 2,
      nodeStartOffset: 31,
      remainder: 10,
    });

    expect(findNodeAtOffset(42, nodes, root)).toStrictEqual({
      node: nodes[3],
      nodeIndex: 3,
      nodeStartOffset: 42,
      remainder: 0,
    });

    expect(findNodeAtOffset(51, nodes, root)).toStrictEqual({
      node: nodes[3],
      nodeIndex: 3,
      nodeStartOffset: 42,
      remainder: 9,
    });

    expect(findNodeAtOffset(52, nodes, root)).toStrictEqual({
      node: nodes[4],
      nodeIndex: 4,
      nodeStartOffset: 52,
      remainder: 0,
    });

    expect(findNodeAtOffset(53, nodes, root)).toStrictEqual({
      node: nodes[4],
      nodeIndex: 4,
      nodeStartOffset: 52,
      remainder: 1,
    });

    expect(findNodeAtOffset(54, nodes, root)).toStrictEqual({
      node: nodes[5],
      nodeIndex: 5,
      nodeStartOffset: 54,
      remainder: 0,
    });

    expect(findNodeAtOffset(63, nodes, root)).toStrictEqual({
      node: nodes[5],
      nodeIndex: 5,
      nodeStartOffset: 54,
      remainder: 9,
    });

    expect(findNodeAtOffset(64, nodes, root)).toStrictEqual({
      node: nodes[6],
      nodeIndex: 6,
      nodeStartOffset: 64,
      remainder: 0,
    });

    expect(findNodeAtOffset(79, nodes, root)).toStrictEqual({
      node: nodes[6],
      nodeIndex: 6,
      nodeStartOffset: 64,
      remainder: 15,
    });

    expect(findNodeAtOffset(80, nodes, root)).toStrictEqual({
      node: nodes[7],
      nodeIndex: 7,
      nodeStartOffset: 80,
      remainder: 0,
    });

    expect(findNodeAtOffset(120, nodes, root)).toStrictEqual({
      node: nodes[7],
      nodeIndex: 7,
      nodeStartOffset: 80,
      remainder: 40,
    });

    // out of range
    expect(findNodeAtOffset(121, nodes, root)).toStrictEqual({
      node: nodes[7],
      nodeIndex: 7,
      nodeStartOffset: 80,
      remainder: 41,
    });
  });

  test("Calculate line feed count", () => {
    const page = getPage();
    expect(calculateLineFeedCount(page.content, page.content.root)).toBe(2);
  });

  test("Calculate character count", () => {
    const page = getPage();
    expect(calculateCharCount(page.content, page.content.root)).toBe(121);
  });
});
