import {
  Color,
  NEWLINE,
  Node,
  NodeMutable,
  PageContentMutable,
} from "../model";
import {
  calculateCharCount,
  calculateLineFeedCount,
  findNodeAtOffset,
  nextNode,
  prevNode,
  recomputeTreeMetadata,
  SENTINEL,
  SENTINEL_INDEX,
} from "./tree";

describe("page/tree/tree", () => {
  const getFinalTree = (): { nodes: Node[]; root: number } => ({
    nodes: [
      SENTINEL,
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
    root: 2,
  });

  test("findNodeAtOffset", () => {
    const { nodes, root } = getFinalTree();

    expect(findNodeAtOffset(-1, nodes, root)).toStrictEqual({
      node: SENTINEL,
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

  const getPage = (): PageContentMutable => ({
    buffers: [],
    ...getFinalTree(),
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
    recomputeTreeMetadata(page, 7);
    expect(page).toStrictEqual(getPage());
  });

  test("Recompute tree metadata: add a node in the middle", () => {
    const page = getPage(); // hypothetically added node 5
    (page.nodes[6] as NodeMutable).leftCharCount = 12;
    (page.nodes[5] as NodeMutable).lineFeedCount = 5;
    const expectedPage = getPage();
    (expectedPage.nodes[6] as NodeMutable).leftLineFeedCount += 5;
    (expectedPage.nodes[5] as NodeMutable).lineFeedCount += 5;

    recomputeTreeMetadata(page, 4);
    expect(page).toStrictEqual(expectedPage);
  });

  test("nextNode", () => {
    const page = getPage();

    expect(nextNode(getPage(), 1)).toStrictEqual({
      node: page.nodes[2],
      index: 2,
    });
    expect(nextNode(getPage(), 2)).toStrictEqual({
      node: page.nodes[3],
      index: 3,
    });
    expect(nextNode(getPage(), 3)).toStrictEqual({
      node: page.nodes[4],
      index: 4,
    });
    expect(nextNode(getPage(), 4)).toStrictEqual({
      node: page.nodes[5],
      index: 5,
    });
    expect(nextNode(getPage(), 5)).toStrictEqual({
      node: page.nodes[6],
      index: 6,
    });
    expect(nextNode(getPage(), 6)).toStrictEqual({
      node: page.nodes[7],
      index: 7,
    });
    expect(nextNode(getPage(), 7)).toStrictEqual({
      node: page.nodes[0],
      index: 0,
    });
  });

  test("prevNode", () => {
    const page = getPage();

    expect(prevNode(getPage(), 7)).toStrictEqual({
      node: page.nodes[6],
      index: 6,
    });
    expect(prevNode(getPage(), 6)).toStrictEqual({
      node: page.nodes[5],
      index: 5,
    });
    expect(prevNode(getPage(), 5)).toStrictEqual({
      node: page.nodes[4],
      index: 4,
    });
    expect(prevNode(getPage(), 4)).toStrictEqual({
      node: page.nodes[3],
      index: 3,
    });
    expect(prevNode(getPage(), 3)).toStrictEqual({
      node: page.nodes[2],
      index: 2,
    });
    expect(prevNode(getPage(), 2)).toStrictEqual({
      node: page.nodes[1],
      index: 1,
    });
    expect(prevNode(getPage(), 1)).toStrictEqual({
      node: page.nodes[0],
      index: 0,
    });
  });
});
