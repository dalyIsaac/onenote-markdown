import { Color, NEWLINE, Node, PageContent } from "../model";
import { SENTINEL_INDEX } from "../reducer";
import {
  calculateCharCount,
  calculateLineFeedCount,
  findNodeAtOffset,
  recomputeTreeMetadata,
} from "./tree";

describe("page/tree/tree", () => {
  const getFinalTree = (): { nodes: Node[]; root: number } => ({
    nodes: [
      {
        bufferIndex: 1,
        start: { line: 0, column: 0 },
        end: { line: 2, column: 6 },
        leftCharCount: 0,
        leftLineFeedCount: 0,
        length: 31,
        lineFeedCount: 2,
        color: Color.Black,
        parent: 1,
        left: SENTINEL_INDEX,
        right: SENTINEL_INDEX,
      },
      {
        bufferIndex: 0,
        start: { line: 0, column: 1 },
        end: { line: 0, column: 12 },
        leftCharCount: 31,
        leftLineFeedCount: 2,
        length: 11,
        lineFeedCount: 0,
        color: Color.Black,
        parent: SENTINEL_INDEX,
        left: 0,
        right: 5,
      },
      {
        bufferIndex: 0,
        start: { line: 0, column: 55 },
        end: { line: 0, column: 65 },
        leftCharCount: 0,
        leftLineFeedCount: 0,
        length: 10,
        lineFeedCount: 0,
        color: Color.Black,
        parent: 3,
        left: SENTINEL_INDEX,
        right: SENTINEL_INDEX,
      },
      {
        bufferIndex: 0,
        start: { line: 0, column: 12 },
        end: { line: 0, column: 14 },
        leftCharCount: 10,
        leftLineFeedCount: 0,
        length: 2,
        lineFeedCount: 0,
        color: Color.Black,
        parent: 5,
        left: 2,
        right: 4,
      },
      {
        bufferIndex: 0,
        start: { line: 0, column: 66 },
        end: { line: 0, column: 76 },
        leftCharCount: 0,
        leftLineFeedCount: 0,
        length: 10,
        lineFeedCount: 0,
        color: Color.Red,
        parent: 3,
        left: SENTINEL_INDEX,
        right: SENTINEL_INDEX,
      },
      {
        bufferIndex: 1,
        start: { line: 2, column: 6 },
        end: { line: 2, column: 22 },
        leftCharCount: 22,
        leftLineFeedCount: 0,
        length: 16,
        lineFeedCount: 0,
        color: Color.Black,
        parent: 1,
        left: 3,
        right: 6,
      },
      {
        bufferIndex: 0,
        start: { line: 0, column: 14 },
        end: { line: 0, column: 55 },
        leftCharCount: 0,
        leftLineFeedCount: 0,
        length: 41,
        lineFeedCount: 0,
        color: Color.Black,
        parent: 5,
        left: SENTINEL_INDEX,
        right: SENTINEL_INDEX,
      },
    ],
    root: 1,
  });

  test("findNodeAtOffset", () => {
    const { nodes, root } = getFinalTree();

    expect(findNodeAtOffset(-1, nodes, root)).toEqual({
      node: nodes[0],
      nodeIndex: 0,
      remainder: 0,
      nodeStartOffset: 0,
    });

    expect(findNodeAtOffset(0, nodes, root)).toEqual({
      node: nodes[0],
      nodeIndex: 0,
      remainder: 0,
      nodeStartOffset: 0,
    });

    expect(findNodeAtOffset(30, nodes, root)).toEqual({
      node: nodes[0],
      nodeIndex: 0,
      remainder: 30,
      nodeStartOffset: 0,
    });

    expect(findNodeAtOffset(31, nodes, root)).toEqual({
      node: nodes[1],
      nodeIndex: 1,
      remainder: 0,
      nodeStartOffset: 31,
    });

    expect(findNodeAtOffset(32, nodes, root)).toEqual({
      node: nodes[1],
      nodeIndex: 1,
      remainder: 1,
      nodeStartOffset: 31,
    });

    expect(findNodeAtOffset(41, nodes, root)).toEqual({
      node: nodes[1],
      nodeIndex: 1,
      remainder: 10,
      nodeStartOffset: 31,
    });

    expect(findNodeAtOffset(42, nodes, root)).toEqual({
      node: nodes[2],
      nodeIndex: 2,
      remainder: 0,
      nodeStartOffset: 42,
    });

    expect(findNodeAtOffset(51, nodes, root)).toEqual({
      node: nodes[2],
      nodeIndex: 2,
      remainder: 9,
      nodeStartOffset: 42,
    });

    expect(findNodeAtOffset(52, nodes, root)).toEqual({
      node: nodes[3],
      nodeIndex: 3,
      remainder: 0,
      nodeStartOffset: 52,
    });

    expect(findNodeAtOffset(53, nodes, root)).toEqual({
      node: nodes[3],
      nodeIndex: 3,
      remainder: 1,
      nodeStartOffset: 52,
    });

    expect(findNodeAtOffset(54, nodes, root)).toEqual({
      node: nodes[4],
      nodeIndex: 4,
      remainder: 0,
      nodeStartOffset: 54,
    });

    expect(findNodeAtOffset(63, nodes, root)).toEqual({
      node: nodes[4],
      nodeIndex: 4,
      remainder: 9,
      nodeStartOffset: 54,
    });

    expect(findNodeAtOffset(64, nodes, root)).toEqual({
      node: nodes[5],
      nodeIndex: 5,
      remainder: 0,
      nodeStartOffset: 64,
    });

    expect(findNodeAtOffset(79, nodes, root)).toEqual({
      node: nodes[5],
      nodeIndex: 5,
      remainder: 15,
      nodeStartOffset: 64,
    });

    expect(findNodeAtOffset(80, nodes, root)).toEqual({
      node: nodes[6],
      nodeIndex: 6,
      remainder: 0,
      nodeStartOffset: 80,
    });

    expect(findNodeAtOffset(120, nodes, root)).toEqual({
      node: nodes[6],
      nodeIndex: 6,
      remainder: 40,
      nodeStartOffset: 80,
    });

    expect(findNodeAtOffset(121, nodes, root)).toEqual({
      node: nodes[6],
      nodeIndex: 6,
      remainder: 41,
      nodeStartOffset: 121,
    });
  });

  const getPage = (): PageContent => ({
    buffers: [],
    nodes: [
      {
        bufferIndex: 1,
        start: { line: 0, column: 0 },
        end: { line: 2, column: 6 },
        leftCharCount: 0,
        leftLineFeedCount: 0,
        length: 31,
        lineFeedCount: 2,
        color: Color.Black,
        parent: 1,
        left: SENTINEL_INDEX,
        right: SENTINEL_INDEX,
      },
      {
        bufferIndex: 0,
        start: { line: 0, column: 1 },
        end: { line: 0, column: 12 },
        leftCharCount: 31,
        leftLineFeedCount: 2,
        length: 11,
        lineFeedCount: 0,
        color: Color.Black,
        parent: SENTINEL_INDEX,
        left: 0,
        right: 5,
      },
      {
        bufferIndex: 0,
        start: { line: 0, column: 55 },
        end: { line: 0, column: 65 },
        leftCharCount: 0,
        leftLineFeedCount: 0,
        length: 10,
        lineFeedCount: 0,
        color: Color.Black,
        parent: 3,
        left: SENTINEL_INDEX,
        right: SENTINEL_INDEX,
      },
      {
        bufferIndex: 0,
        start: { line: 0, column: 12 },
        end: { line: 0, column: 14 },
        leftCharCount: 10,
        leftLineFeedCount: 0,
        length: 2,
        lineFeedCount: 0,
        color: Color.Black,
        parent: 5,
        left: 2,
        right: 4,
      },
      {
        bufferIndex: 0,
        start: { line: 0, column: 66 },
        end: { line: 0, column: 76 },
        leftCharCount: 0,
        leftLineFeedCount: 0,
        length: 10,
        lineFeedCount: 0,
        color: Color.Red,
        parent: 3,
        left: SENTINEL_INDEX,
        right: SENTINEL_INDEX,
      },
      {
        bufferIndex: 1,
        start: { line: 2, column: 6 },
        end: { line: 2, column: 22 },
        leftCharCount: 22,
        leftLineFeedCount: 0,
        length: 16,
        lineFeedCount: 0,
        color: Color.Black,
        parent: 1,
        left: 3,
        right: 6,
      },
      {
        bufferIndex: 0,
        start: { line: 0, column: 14 },
        end: { line: 0, column: 55 },
        leftCharCount: 0,
        leftLineFeedCount: 0,
        length: 41,
        lineFeedCount: 0,
        color: Color.Black,
        parent: 5,
        left: SENTINEL_INDEX,
        right: SENTINEL_INDEX,
      },
    ],
    root: 1,
    newlineFormat: NEWLINE.LF,
    previouslyInsertedNodeIndex: null,
    previouslyInsertedNodeOffset: null,
  });

  test("Calculate line feed count", () => {
    const page = getPage();
    expect(calculateLineFeedCount(page, page.root)).toBe(2);
  });

  test("Calculate character count", () => {
    const page = getPage();
    expect(calculateCharCount(page, page.root)).toBe(121);
  });

  test("Recompute tree metadata: add a node to the end", () => {
    const page = getPage(); // hypothetically added the last node
    expect(recomputeTreeMetadata(page, 6)).toEqual(getPage());
  });

  test("Recompute tree metadata: add a node in the middle", () => {
    const page = getPage();
    page.nodes[5].leftCharCount = 12;
    page.nodes[4].lineFeedCount = 5;
    const expectedPage = getPage();
    expectedPage.nodes[5].leftLineFeedCount += 5;
    expectedPage.nodes[4].lineFeedCount += 5;

    const receivedPage = recomputeTreeMetadata(page, 4);
    expect(receivedPage).toEqual(expectedPage);
  });
});
