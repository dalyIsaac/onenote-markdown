import { Color, INode, IPageContent, NEWLINE } from "../model";
import { SENTINEL_INDEX } from "../reducer";
import { leftRotate, rightRotate } from "./rotate";

describe("page/tree/rotate", () => {
  const constructSimplePieceTableBeforeLeftRotate = (): IPageContent => {
    const nodes: INode[] = [
      {
        bufferIndex: 0,
        start: { column: 0, line: 0 },
        end: { column: 10, line: 2 },
        length: 30,
        lineFeedCount: 2,
        leftLineFeedCount: 0,
        leftCharCount: 0,
        color: Color.Black,
        parent: 1,
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
        left: 0,
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
        parent: 3,
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
        parent: 1,
        left: 2,
        right: 4,
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
        parent: 3,
        left: SENTINEL_INDEX,
        right: SENTINEL_INDEX,
      },
    ];
    const pieceTable: IPageContent = {
      buffers: [],
      newlineFormat: NEWLINE.LF,
      nodes,
      root: 1,
      previouslyInsertedNodeIndex: null,
      previouslyInsertedNodeOffset: null,
    };
    return pieceTable;
  };
  const constructSimplePieceTableAfterRightRotate = constructSimplePieceTableBeforeLeftRotate;

  const constructSimplePieceTableAfterLeftRotate = (): IPageContent => {
    const nodes: INode[] = [
      {
        bufferIndex: 0,
        start: { column: 0, line: 0 },
        end: { column: 10, line: 2 },
        length: 30,
        lineFeedCount: 2,
        leftLineFeedCount: 0,
        leftCharCount: 0,
        color: Color.Black,
        parent: 1,
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
        left: 0,
        right: 2,
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
        parent: 1,
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
        left: 1,
        right: 4,
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
        parent: 3,
        left: SENTINEL_INDEX,
        right: SENTINEL_INDEX,
      },
    ];
    const pieceTable: IPageContent = {
      buffers: [],
      newlineFormat: NEWLINE.LF,
      nodes,
      root: 3,
      previouslyInsertedNodeIndex: null,
      previouslyInsertedNodeOffset: null,
    };
    return pieceTable;
  };
  const constructSimplePieceTableBeforeRightRotate = constructSimplePieceTableAfterLeftRotate;

  const constructComplexPieceTableBeforeLeftRotate = (): IPageContent => {
    const nodes: INode[] = [
      {
        bufferIndex: 0,
        start: { column: 0, line: 0 },
        end: { column: 10, line: 2 },
        length: 30,
        lineFeedCount: 2,
        leftLineFeedCount: 0,
        leftCharCount: 0,
        color: Color.Black,
        parent: 1,
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
        parent: 2,
        left: 0,
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
        parent: 4,
        left: 1,
        right: 3,
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
        parent: 2,
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
        left: 2,
        right: 6,
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
        parent: 6,
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
        parent: 4,
        left: 5,
        right: 10,
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
        parent: 8,
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
        parent: 10,
        left: 7,
        right: 9,
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
        parent: 8,
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
        parent: 6,
        left: 8,
        right: 11,
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
        parent: 10,
        left: SENTINEL_INDEX,
        right: 13,
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
        parent: 13,
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
        parent: 11,
        left: 12,
        right: SENTINEL_INDEX,
      },
    ];
    const pieceTable: IPageContent = {
      buffers: [],
      newlineFormat: NEWLINE.LF,
      nodes,
      root: 4,
      previouslyInsertedNodeIndex: null,
      previouslyInsertedNodeOffset: null,
    };
    return pieceTable;
  };
  const constructComplexPieceTableAfterRightRotate = constructComplexPieceTableBeforeLeftRotate;

  const constructComplexPieceTableAfterLeftRotate = (): IPageContent => {
    const nodes: INode[] = [
      {
        bufferIndex: 0,
        start: { column: 0, line: 0 },
        end: { column: 10, line: 2 },
        length: 30,
        lineFeedCount: 2,
        leftLineFeedCount: 0,
        leftCharCount: 0,
        color: Color.Black,
        parent: 1,
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
        parent: 2,
        left: 0,
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
        parent: 4,
        left: 1,
        right: 3,
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
        parent: 2,
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
        left: 2,
        right: 10,
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
        parent: 6,
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
        parent: 10,
        left: 5,
        right: 8,
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
        parent: 8,
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
        parent: 6,
        left: 7,
        right: 9,
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
        parent: 8,
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
        parent: 4,
        left: 6,
        right: 11,
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
        parent: 10,
        left: SENTINEL_INDEX,
        right: 13,
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
        parent: 13,
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
        parent: 11,
        left: 12,
        right: SENTINEL_INDEX,
      },
    ];
    const pieceTable: IPageContent = {
      buffers: [],
      newlineFormat: NEWLINE.LF,
      nodes,
      root: 4,
      previouslyInsertedNodeIndex: null,
      previouslyInsertedNodeOffset: null,
    };
    return pieceTable;
  };
  const constructComplexPieceTableBeforeRightRotate = constructComplexPieceTableAfterLeftRotate;

  const constructOneNodePieceTable = (): IPageContent => ({
    buffers: [],
    nodes: [
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
    root: 0,
    newlineFormat: NEWLINE.LF,
    previouslyInsertedNodeIndex: 0,
    previouslyInsertedNodeOffset: 0,
  });

  /**
   * Returns the number of different references between the nodes, after a rotation.
   * A rotate function should update no more than four references.
   * @param oldTable The table passed into the rotate function
   * @param newTable The table passed out of the rotate function
   */
  const getDiffCount = (
    oldTable: IPageContent,
    newTable: IPageContent,
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
      const newPieceTable = leftRotate(pieceTable, 0);
      expect(newPieceTable).toEqual(constructOneNodePieceTable());
      expect(getDiffCount(pieceTable, newPieceTable)).toBe(0);
    });

    test("Simple case", () => {
      const pieceTable = constructSimplePieceTableBeforeLeftRotate();
      const newPieceTable = leftRotate(pieceTable, 1);
      expect(newPieceTable).toEqual(constructSimplePieceTableAfterLeftRotate());
      expect(getDiffCount(pieceTable, newPieceTable)).toBeLessThanOrEqual(4);
    });

    test("Complex case", () => {
      const pieceTable = constructComplexPieceTableBeforeLeftRotate();
      const newPieceTable = leftRotate(pieceTable, 6);
      expect(newPieceTable).toEqual(
        constructComplexPieceTableAfterLeftRotate(),
      );
      expect(getDiffCount(pieceTable, newPieceTable)).toBeLessThanOrEqual(4);
    });
  });

  describe("right rotate", () => {
    test("One node case", () => {
      const pieceTable = constructOneNodePieceTable();
      const newPieceTable = rightRotate(pieceTable, 0);
      expect(newPieceTable).toEqual(constructOneNodePieceTable());
      expect(getDiffCount(pieceTable, newPieceTable)).toBe(0);
    });

    test("Simple case", () => {
      const pieceTable = constructSimplePieceTableBeforeRightRotate();
      const newPieceTable = rightRotate(pieceTable, 3);
      expect(newPieceTable).toEqual(
        constructSimplePieceTableAfterRightRotate(),
      );
      expect(getDiffCount(pieceTable, newPieceTable)).toBeLessThanOrEqual(4);
    });

    test("Complex case", () => {
      const pieceTable = constructComplexPieceTableBeforeRightRotate();
      const newPieceTable = rightRotate(pieceTable, 10);
      expect(newPieceTable).toEqual(
        constructComplexPieceTableAfterRightRotate(),
      );
      expect(getDiffCount(pieceTable, newPieceTable)).toBeLessThanOrEqual(4);
    });
  });
});
