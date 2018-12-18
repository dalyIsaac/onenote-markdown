import { Color, NEWLINE, Node, PageContentMutable } from "../model";
import { leftRotate, rightRotate } from "./rotate";
import { SENTINEL, SENTINEL_INDEX } from "./tree";

describe("page/tree/rotate", () => {
  const constructSimplePieceTableBeforeLeftRotate = (): PageContentMutable => {
    const nodes: Node[] = [
      SENTINEL,
      {
        bufferIndex: 0,
        start: { column: 0, line: 0 },
        end: { column: 10, line: 2 },
        length: 30,
        lineFeedCount: 2,
        leftLineFeedCount: 0,
        leftCharCount: 0,
        color: Color.Black,
        parent: 2,
        left: SENTINEL_INDEX,
        right: SENTINEL_INDEX,
      },
      {
        bufferIndex: 1,
        start: { column: 0, line: 0 },
        end: { column: 10, line: 2 },
        length: 30,
        lineFeedCount: 2,
        leftLineFeedCount: 2,
        leftCharCount: 30,
        color: Color.Black,
        parent: SENTINEL_INDEX,
        left: 1,
        right: 4,
      },
      {
        bufferIndex: 2,
        start: { column: 0, line: 0 },
        end: { column: 5, line: 1 },
        length: 30,
        lineFeedCount: 1,
        leftLineFeedCount: 0,
        leftCharCount: 0,
        color: Color.Black,
        parent: 4,
        left: SENTINEL_INDEX,
        right: SENTINEL_INDEX,
      },
      {
        bufferIndex: 3,
        start: { column: 0, line: 0 },
        end: { column: 5, line: 1 },
        length: 30,
        lineFeedCount: 1,
        leftLineFeedCount: 1,
        leftCharCount: 30,
        color: Color.Black,
        parent: 2,
        left: 3,
        right: 5,
      },
      {
        bufferIndex: 4,
        start: { column: 0, line: 0 },
        end: { column: 5, line: 1 },
        length: 30,
        lineFeedCount: 1,
        leftLineFeedCount: 0,
        leftCharCount: 0,
        color: Color.Red,
        parent: 4,
        left: SENTINEL_INDEX,
        right: SENTINEL_INDEX,
      },
    ];
    const pieceTable: PageContentMutable = {
      buffers: [],
      newlineFormat: NEWLINE.LF,
      nodes,
      root: 2,
      previouslyInsertedNodeIndex: null,
      previouslyInsertedNodeOffset: null,
    };
    return pieceTable;
  };
  const constructSimplePieceTableAfterRightRotate = constructSimplePieceTableBeforeLeftRotate;

  const constructSimplePieceTableAfterLeftRotate = (): PageContentMutable => {
    const nodes: Node[] = [
      SENTINEL,
      {
        bufferIndex: 0,
        start: { column: 0, line: 0 },
        end: { column: 10, line: 2 },
        length: 30,
        lineFeedCount: 2,
        leftLineFeedCount: 0,
        leftCharCount: 0,
        color: Color.Black,
        parent: 2,
        left: SENTINEL_INDEX,
        right: SENTINEL_INDEX,
      },
      {
        bufferIndex: 1,
        start: { column: 0, line: 0 },
        end: { column: 10, line: 2 },
        length: 30,
        lineFeedCount: 2,
        leftLineFeedCount: 2,
        leftCharCount: 30,
        color: Color.Black,
        parent: 4,
        left: 1,
        right: 3,
      },
      {
        bufferIndex: 2,
        start: { column: 0, line: 0 },
        end: { column: 5, line: 1 },
        length: 30,
        lineFeedCount: 1,
        leftLineFeedCount: 0,
        leftCharCount: 0,
        color: Color.Black,
        parent: 2,
        left: SENTINEL_INDEX,
        right: SENTINEL_INDEX,
      },
      {
        bufferIndex: 3,
        start: { column: 0, line: 0 },
        end: { column: 5, line: 1 },
        length: 30,
        lineFeedCount: 1,
        leftLineFeedCount: 5,
        leftCharCount: 90,
        color: Color.Black,
        parent: SENTINEL_INDEX,
        left: 2,
        right: 5,
      },
      {
        bufferIndex: 4,
        start: { column: 0, line: 0 },
        end: { column: 5, line: 1 },
        length: 30,
        lineFeedCount: 1,
        leftLineFeedCount: 0,
        leftCharCount: 0,
        color: Color.Red,
        parent: 4,
        left: SENTINEL_INDEX,
        right: SENTINEL_INDEX,
      },
    ];
    const pieceTable: PageContentMutable = {
      buffers: [],
      newlineFormat: NEWLINE.LF,
      nodes,
      root: 4,
      previouslyInsertedNodeIndex: null,
      previouslyInsertedNodeOffset: null,
    };
    return pieceTable;
  };
  const constructSimplePieceTableBeforeRightRotate = constructSimplePieceTableAfterLeftRotate;

  const constructComplexPieceTableBeforeLeftRotate = (): PageContentMutable => {
    const nodes: Node[] = [
      SENTINEL,
      {
        bufferIndex: 0,
        start: { column: 0, line: 0 },
        end: { column: 10, line: 2 },
        length: 30,
        lineFeedCount: 2,
        leftLineFeedCount: 0,
        leftCharCount: 0,
        color: Color.Black,
        parent: 2,
        left: SENTINEL_INDEX,
        right: SENTINEL_INDEX,
      },
      {
        bufferIndex: 1,
        start: { column: 0, line: 0 },
        end: { column: 10, line: 2 },
        length: 30,
        lineFeedCount: 2,
        leftLineFeedCount: 2,
        leftCharCount: 30,
        color: Color.Black,
        parent: 3,
        left: 1,
        right: SENTINEL_INDEX,
      },
      {
        bufferIndex: 2,
        start: { column: 0, line: 0 },
        end: { column: 10, line: 2 },
        length: 30,
        lineFeedCount: 2,
        leftLineFeedCount: 4,
        leftCharCount: 60,
        color: Color.Black,
        parent: 5,
        left: 2,
        right: 4,
      },
      {
        bufferIndex: 3,
        start: { column: 0, line: 0 },
        end: { column: 10, line: 2 },
        length: 30,
        lineFeedCount: 2,
        leftLineFeedCount: 0,
        leftCharCount: 0,
        color: Color.Black,
        parent: 3,
        left: SENTINEL_INDEX,
        right: SENTINEL_INDEX,
      },
      {
        bufferIndex: 4,
        start: { column: 0, line: 0 },
        end: { column: 10, line: 2 },
        length: 30,
        lineFeedCount: 2,
        leftLineFeedCount: 8,
        leftCharCount: 120,
        color: Color.Black,
        parent: SENTINEL_INDEX,
        left: 3,
        right: 7,
      },
      {
        bufferIndex: 5,
        start: { column: 0, line: 0 },
        end: { column: 10, line: 2 },
        length: 30,
        lineFeedCount: 2,
        leftLineFeedCount: 0,
        leftCharCount: 0,
        color: Color.Black,
        parent: 7,
        left: SENTINEL_INDEX,
        right: SENTINEL_INDEX,
      },
      {
        bufferIndex: 6,
        start: { column: 0, line: 0 },
        end: { column: 10, line: 2 },
        length: 30,
        lineFeedCount: 2,
        leftLineFeedCount: 2,
        leftCharCount: 30,
        color: Color.Black,
        parent: 5,
        left: 6,
        right: 11,
      },
      {
        bufferIndex: 7,
        start: { column: 0, line: 0 },
        end: { column: 10, line: 2 },
        length: 30,
        lineFeedCount: 2,
        leftLineFeedCount: 0,
        leftCharCount: 0,
        color: Color.Black,
        parent: 9,
        left: SENTINEL_INDEX,
        right: SENTINEL_INDEX,
      },
      {
        bufferIndex: 8,
        start: { column: 0, line: 0 },
        end: { column: 10, line: 2 },
        length: 30,
        lineFeedCount: 2,
        leftLineFeedCount: 2,
        leftCharCount: 30,
        color: Color.Black,
        parent: 11,
        left: 8,
        right: 10,
      },
      {
        bufferIndex: 9,
        start: { column: 0, line: 0 },
        end: { column: 10, line: 2 },
        length: 30,
        lineFeedCount: 2,
        leftLineFeedCount: 0,
        leftCharCount: 0,
        color: Color.Black,
        parent: 9,
        left: SENTINEL_INDEX,
        right: SENTINEL_INDEX,
      },
      {
        bufferIndex: 10,
        start: { column: 0, line: 0 },
        end: { column: 10, line: 2 },
        length: 30,
        lineFeedCount: 2,
        leftLineFeedCount: 6,
        leftCharCount: 90,
        color: Color.Black,
        parent: 7,
        left: 9,
        right: 12,
      },
      {
        bufferIndex: 11,
        start: { column: 0, line: 0 },
        end: { column: 10, line: 2 },
        length: 30,
        lineFeedCount: 2,
        leftLineFeedCount: 0,
        leftCharCount: 0,
        color: Color.Black,
        parent: 11,
        left: SENTINEL_INDEX,
        right: 14,
      },
      {
        bufferIndex: 12,
        start: { column: 0, line: 0 },
        end: { column: 10, line: 2 },
        length: 30,
        lineFeedCount: 2,
        leftLineFeedCount: 0,
        leftCharCount: 0,
        color: Color.Black,
        parent: 14,
        left: SENTINEL_INDEX,
        right: SENTINEL_INDEX,
      },
      {
        bufferIndex: 13,
        start: { column: 0, line: 0 },
        end: { column: 10, line: 2 },
        length: 30,
        lineFeedCount: 2,
        leftLineFeedCount: 2,
        leftCharCount: 30,
        color: Color.Black,
        parent: 12,
        left: 13,
        right: SENTINEL_INDEX,
      },
    ];
    const pieceTable: PageContentMutable = {
      buffers: [],
      newlineFormat: NEWLINE.LF,
      nodes,
      root: 5,
      previouslyInsertedNodeIndex: null,
      previouslyInsertedNodeOffset: null,
    };
    return pieceTable;
  };
  const constructComplexPieceTableAfterRightRotate = constructComplexPieceTableBeforeLeftRotate;

  const constructComplexPieceTableAfterLeftRotate = (): PageContentMutable => {
    const nodes: Node[] = [
      SENTINEL,
      {
        bufferIndex: 0,
        start: { column: 0, line: 0 },
        end: { column: 10, line: 2 },
        length: 30,
        lineFeedCount: 2,
        leftLineFeedCount: 0,
        leftCharCount: 0,
        color: Color.Black,
        parent: 2,
        left: SENTINEL_INDEX,
        right: SENTINEL_INDEX,
      },
      {
        bufferIndex: 1,
        start: { column: 0, line: 0 },
        end: { column: 10, line: 2 },
        length: 30,
        lineFeedCount: 2,
        leftLineFeedCount: 2,
        leftCharCount: 30,
        color: Color.Black,
        parent: 3,
        left: 1,
        right: SENTINEL_INDEX,
      },
      {
        bufferIndex: 2,
        start: { column: 0, line: 0 },
        end: { column: 10, line: 2 },
        length: 30,
        lineFeedCount: 2,
        leftLineFeedCount: 4,
        leftCharCount: 60,
        color: Color.Black,
        parent: 5,
        left: 2,
        right: 4,
      },
      {
        bufferIndex: 3,
        start: { column: 0, line: 0 },
        end: { column: 10, line: 2 },
        length: 30,
        lineFeedCount: 2,
        leftLineFeedCount: 0,
        leftCharCount: 0,
        color: Color.Black,
        parent: 3,
        left: SENTINEL_INDEX,
        right: SENTINEL_INDEX,
      },
      {
        bufferIndex: 4,
        start: { column: 0, line: 0 },
        end: { column: 10, line: 2 },
        length: 30,
        lineFeedCount: 2,
        leftLineFeedCount: 8,
        leftCharCount: 120,
        color: Color.Black,
        parent: SENTINEL_INDEX,
        left: 3,
        right: 11,
      },
      {
        bufferIndex: 5,
        start: { column: 0, line: 0 },
        end: { column: 10, line: 2 },
        length: 30,
        lineFeedCount: 2,
        leftLineFeedCount: 0,
        leftCharCount: 0,
        color: Color.Black,
        parent: 7,
        left: SENTINEL_INDEX,
        right: SENTINEL_INDEX,
      },
      {
        bufferIndex: 6,
        start: { column: 0, line: 0 },
        end: { column: 10, line: 2 },
        length: 30,
        lineFeedCount: 2,
        leftLineFeedCount: 2,
        leftCharCount: 30,
        color: Color.Black,
        parent: 11,
        left: 6,
        right: 9,
      },
      {
        bufferIndex: 7,
        start: { column: 0, line: 0 },
        end: { column: 10, line: 2 },
        length: 30,
        lineFeedCount: 2,
        leftLineFeedCount: 0,
        leftCharCount: 0,
        color: Color.Black,
        parent: 9,
        left: SENTINEL_INDEX,
        right: SENTINEL_INDEX,
      },
      {
        bufferIndex: 8,
        start: { column: 0, line: 0 },
        end: { column: 10, line: 2 },
        length: 30,
        lineFeedCount: 2,
        leftLineFeedCount: 2,
        leftCharCount: 30,
        color: Color.Black,
        parent: 7,
        left: 8,
        right: 10,
      },
      {
        bufferIndex: 9,
        start: { column: 0, line: 0 },
        end: { column: 10, line: 2 },
        length: 30,
        lineFeedCount: 2,
        leftLineFeedCount: 0,
        leftCharCount: 0,
        color: Color.Black,
        parent: 9,
        left: SENTINEL_INDEX,
        right: SENTINEL_INDEX,
      },
      {
        bufferIndex: 10,
        start: { column: 0, line: 0 },
        end: { column: 10, line: 2 },
        length: 30,
        lineFeedCount: 2,
        leftLineFeedCount: 10,
        leftCharCount: 150,
        color: Color.Black,
        parent: 5,
        left: 7,
        right: 12,
      },
      {
        bufferIndex: 11,
        start: { column: 0, line: 0 },
        end: { column: 10, line: 2 },
        length: 30,
        lineFeedCount: 2,
        leftLineFeedCount: 0,
        leftCharCount: 0,
        color: Color.Black,
        parent: 11,
        left: SENTINEL_INDEX,
        right: 14,
      },
      {
        bufferIndex: 12,
        start: { column: 0, line: 0 },
        end: { column: 10, line: 2 },
        length: 30,
        lineFeedCount: 2,
        leftLineFeedCount: 0,
        leftCharCount: 0,
        color: Color.Black,
        parent: 14,
        left: SENTINEL_INDEX,
        right: SENTINEL_INDEX,
      },
      {
        bufferIndex: 13,
        start: { column: 0, line: 0 },
        end: { column: 10, line: 2 },
        length: 30,
        lineFeedCount: 2,
        leftLineFeedCount: 2,
        leftCharCount: 30,
        color: Color.Black,
        parent: 12,
        left: 13,
        right: SENTINEL_INDEX,
      },
    ];
    const pieceTable: PageContentMutable = {
      buffers: [],
      newlineFormat: NEWLINE.LF,
      nodes,
      root: 5,
      previouslyInsertedNodeIndex: null,
      previouslyInsertedNodeOffset: null,
    };
    return pieceTable;
  };
  const constructComplexPieceTableBeforeRightRotate = constructComplexPieceTableAfterLeftRotate;

  const constructOneNodePieceTable = (): PageContentMutable => ({
    buffers: [],
    nodes: [
      SENTINEL,
      {
        bufferIndex: 0,
        start: { column: 0, line: 0 },
        end: { column: 0, line: 0 },
        length: 0,
        lineFeedCount: 0,
        leftCharCount: 0,
        leftLineFeedCount: 0,
        color: Color.Black,
        parent: SENTINEL_INDEX,
        left: SENTINEL_INDEX,
        right: SENTINEL_INDEX,
      },
    ],
    root: 1,
    newlineFormat: NEWLINE.LF,
    previouslyInsertedNodeIndex: 1,
    previouslyInsertedNodeOffset: 0,
  });

  /**
   * Returns the number of different references between the nodes, after a rotation.
   * A rotate function should update no more than four references.
   * @param oldTable The table passed into the rotate function
   * @param newTable The table passed out of the rotate function
   */
  const getDiffCount = (
    oldTable: PageContentMutable,
    newTable: PageContentMutable,
  ): number => {
    const diff = [];
    for (let i = 0; i < oldTable.nodes.length; i++) {
      const element = oldTable.nodes[i];
      diff.push(element === newTable.nodes[i]);
    }
    const diffCount = diff.reduce((acc, curr) => {
      if (curr === false) {
        acc += 1;
      }
      return acc;
    }, 0);
    return diffCount;
  };

  describe("left rotate", () => {
    test("One node case", () => {
      const pieceTable = constructOneNodePieceTable();
      const newPieceTable = leftRotate(pieceTable, 1);
      expect(newPieceTable).toStrictEqual(constructOneNodePieceTable());
      expect(getDiffCount(pieceTable, newPieceTable)).toBe(0);
    });

    test("Simple case", () => {
      const pieceTable = constructSimplePieceTableBeforeLeftRotate();
      const newPieceTable = leftRotate(pieceTable, 2);
      expect(newPieceTable).toStrictEqual(
        constructSimplePieceTableAfterLeftRotate(),
      );
      expect(getDiffCount(pieceTable, newPieceTable)).toBeLessThanOrEqual(4);
    });

    test("Complex case", () => {
      const pieceTable = constructComplexPieceTableBeforeLeftRotate();
      const newPieceTable = leftRotate(pieceTable, 7);
      expect(newPieceTable).toStrictEqual(
        constructComplexPieceTableAfterLeftRotate(),
      );
      expect(getDiffCount(pieceTable, newPieceTable)).toBeLessThanOrEqual(4);
    });
  });

  describe("right rotate", () => {
    test("One node case", () => {
      const pieceTable = constructOneNodePieceTable();
      const newPieceTable = rightRotate(pieceTable, 1);
      expect(newPieceTable).toStrictEqual(constructOneNodePieceTable());
      expect(getDiffCount(pieceTable, newPieceTable)).toBe(0);
    });

    test("Simple case", () => {
      const pieceTable = constructSimplePieceTableBeforeRightRotate();
      const newPieceTable = rightRotate(pieceTable, 4);
      expect(newPieceTable).toStrictEqual(
        constructSimplePieceTableAfterRightRotate(),
      );
      expect(getDiffCount(pieceTable, newPieceTable)).toBeLessThanOrEqual(4);
    });

    test("Complex case", () => {
      const pieceTable = constructComplexPieceTableBeforeRightRotate();
      const newPieceTable = rightRotate(pieceTable, 11);
      expect(newPieceTable).toStrictEqual(
        constructComplexPieceTableAfterRightRotate(),
      );
      expect(getDiffCount(pieceTable, newPieceTable)).toBeLessThanOrEqual(4);
    });
  });
});
