/* eslint-disable max-len */

import { Color, PageContent } from "../pageModel";
import { SENTINEL_STRUCTURE } from "../structureTree/tree";
import { SENTINEL_INDEX } from "../tree/tree";
import { ContentNode } from "./contentModel";
import {
  calculateCharCount,
  calculateLineFeedCount,
  findNodeAtOffset,
  SENTINEL_CONTENT,
  getNodeContent,
  getContentBetweenOffsets,
  getContentBetweenNodeAndOffsets,
} from "./tree";
import { getStartPage } from "../reducer.test";

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

export const getPage = (): PageContent => ({
  buffers: [],
  content: { ...getFinalTree() },
  previouslyInsertedContentNodeIndex: null,
  previouslyInsertedContentNodeOffset: null,
  structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
});

describe("Functions for common tree operations on the piece table/content red-black tree.", (): void => {
  test("findNodeAtOffset", (): void => {
    const { nodes, root } = getFinalTree();

    expect(findNodeAtOffset({ nodes, root }, -1)).toStrictEqual({
      node: SENTINEL_CONTENT,
      nodeIndex: 1,
      nodeStartOffset: 0,
      remainder: 0,
    });

    expect(findNodeAtOffset({ nodes, root }, 0)).toStrictEqual({
      node: nodes[1],
      nodeIndex: 1,
      nodeStartOffset: 0,
      remainder: 0,
    });

    expect(findNodeAtOffset({ nodes, root }, 30)).toStrictEqual({
      node: nodes[1],
      nodeIndex: 1,
      nodeStartOffset: 0,
      remainder: 30,
    });

    expect(findNodeAtOffset({ nodes, root }, 31)).toStrictEqual({
      node: nodes[2],
      nodeIndex: 2,
      nodeStartOffset: 31,
      remainder: 0,
    });

    expect(findNodeAtOffset({ nodes, root }, 32)).toStrictEqual({
      node: nodes[2],
      nodeIndex: 2,
      nodeStartOffset: 31,
      remainder: 1,
    });

    expect(findNodeAtOffset({ nodes, root }, 41)).toStrictEqual({
      node: nodes[2],
      nodeIndex: 2,
      nodeStartOffset: 31,
      remainder: 10,
    });

    expect(findNodeAtOffset({ nodes, root }, 42)).toStrictEqual({
      node: nodes[3],
      nodeIndex: 3,
      nodeStartOffset: 42,
      remainder: 0,
    });

    expect(findNodeAtOffset({ nodes, root }, 51)).toStrictEqual({
      node: nodes[3],
      nodeIndex: 3,
      nodeStartOffset: 42,
      remainder: 9,
    });

    expect(findNodeAtOffset({ nodes, root }, 52)).toStrictEqual({
      node: nodes[4],
      nodeIndex: 4,
      nodeStartOffset: 52,
      remainder: 0,
    });

    expect(findNodeAtOffset({ nodes, root }, 53)).toStrictEqual({
      node: nodes[4],
      nodeIndex: 4,
      nodeStartOffset: 52,
      remainder: 1,
    });

    expect(findNodeAtOffset({ nodes, root }, 54)).toStrictEqual({
      node: nodes[5],
      nodeIndex: 5,
      nodeStartOffset: 54,
      remainder: 0,
    });

    expect(findNodeAtOffset({ nodes, root }, 63)).toStrictEqual({
      node: nodes[5],
      nodeIndex: 5,
      nodeStartOffset: 54,
      remainder: 9,
    });

    expect(findNodeAtOffset({ nodes, root }, 64)).toStrictEqual({
      node: nodes[6],
      nodeIndex: 6,
      nodeStartOffset: 64,
      remainder: 0,
    });

    expect(findNodeAtOffset({ nodes, root }, 79)).toStrictEqual({
      node: nodes[6],
      nodeIndex: 6,
      nodeStartOffset: 64,
      remainder: 15,
    });

    expect(findNodeAtOffset({ nodes, root }, 80)).toStrictEqual({
      node: nodes[7],
      nodeIndex: 7,
      nodeStartOffset: 80,
      remainder: 0,
    });

    expect(findNodeAtOffset({ nodes, root }, 120)).toStrictEqual({
      node: nodes[7],
      nodeIndex: 7,
      nodeStartOffset: 80,
      remainder: 40,
    });

    // out of range
    expect(findNodeAtOffset({ nodes, root }, 121)).toStrictEqual({
      node: nodes[7],
      nodeIndex: 7,
      nodeStartOffset: 80,
      remainder: 41,
    });
  });

  test("Calculate line feed count", (): void => {
    const page = getPage();
    expect(calculateLineFeedCount(page.content, page.content.root)).toBe(2);
  });

  test("Calculate character count", (): void => {
    const page = getPage();
    expect(calculateCharCount(page.content, page.content.root)).toBe(121);
  });

  test("getNodeContent", (): void => {
    const page = getStartPage();

    expect(getNodeContent(page, 1)).toBe(
      "Do not go gentle into that good night,\nOld age should burn and ra",
    );
    expect(getNodeContent(page, 2)).toBe("v");
    expect(getNodeContent(page, 3)).toBe("e at close of ");
    expect(getNodeContent(page, 4)).toBe("day");
    expect(getNodeContent(page, 5)).toBe(";\n");
    expect(getNodeContent(page, 6)).toBe("Ra");
    expect(getNodeContent(page, 7)).toBe("g");
    expect(getNodeContent(page, 8)).toBe("e, ra");
    expect(getNodeContent(page, 9)).toBe("g");
    expect(getNodeContent(page, 10)).toBe("e against the dying of the light");
    expect(getNodeContent(page, 11)).toBe(".");
  });

  describe("getContentBetweenOffset", (): void => {
    const page = getStartPage();

    test("Inside a single node", (): void => {
      expect(getContentBetweenOffsets(page, 3, 50)).toBe(
        "not go gentle into that good night,\nOld age sho",
      );
    });

    test("An entire single node", (): void => {
      expect(getContentBetweenOffsets(page, 0, 65)).toBe(
        "Do not go gentle into that good night,\nOld age should burn and ra",
      );
    });

    test("Across two nodes", (): void => {
      expect(getContentBetweenOffsets(page, 63, 66)).toBe("rav");
      expect(getContentBetweenOffsets(page, 70, 82)).toBe(" close of da");
    });

    test("Across two nodes to the end of the second node", (): void => {
      expect(getContentBetweenOffsets(page, 70, 83)).toBe(" close of day");
    });

    test("Across multiple nodes", (): void => {
      expect(getContentBetweenOffsets(page, 60, 83)).toBe(
        "nd rave at close of day",
      );
    });
  });

  describe("getContentBetweenNodeAndOffsets", (): void => {
    const page = getStartPage();

    test("Inside a single node", (): void => {
      expect(
        getContentBetweenNodeAndOffsets(
          page,
          { nodeIndex: 1, nodeStartOffset: 3 },
          { nodeIndex: 1, nodeStartOffset: 50 },
        ),
      ).toBe("not go gentle into that good night,\nOld age sho");
    });

    test("An entire single node", (): void => {
      expect(
        getContentBetweenNodeAndOffsets(
          page,
          { nodeIndex: 1, nodeStartOffset: 0 },
          { nodeIndex: 1, nodeStartOffset: 65 },
        ),
      ).toBe(
        "Do not go gentle into that good night,\nOld age should burn and ra",
      );
    });

    test("Across two nodes", (): void => {
      expect(
        getContentBetweenNodeAndOffsets(
          page,
          { nodeIndex: 1, nodeStartOffset: 63 },
          { nodeIndex: 2, nodeStartOffset: 1 },
        ),
      ).toBe("rav");
      expect(
        getContentBetweenNodeAndOffsets(
          page,
          { nodeIndex: 3, nodeStartOffset: 4 },
          { nodeIndex: 4, nodeStartOffset: 2 },
        ),
      ).toBe(" close of da");
    });

    test("Across two nodes to the end of the second node", (): void => {
      expect(
        getContentBetweenNodeAndOffsets(
          page,
          { nodeIndex: 3, nodeStartOffset: 4 },
          { nodeIndex: 4, nodeStartOffset: 3 },
        ),
      ).toBe(" close of day");
    });

    test("Across multiple nodes", (): void => {
      expect(
        getContentBetweenNodeAndOffsets(
          page,
          { nodeIndex: 1, nodeStartOffset: 60 },
          { nodeIndex: 4, nodeStartOffset: 3 },
        ),
      ).toBe("nd rave at close of day");
    });
  });
});
