import { Color, PageContentMutable } from "../pageModel";
import { SENTINEL_STRUCTURE } from "../structureTree/tree";
import { SENTINEL_INDEX } from "../tree";
import { ContentNode, NEWLINE } from "./contentModel";
import { leftRotate, rightRotate } from "./rotate";
import { SENTINEL_CONTENT } from "./tree";

describe("Functions for performing rotations on the piece table/red-black tree.", () => {
  const constructSimplePieceTableBeforeLeftRotate = (): PageContentMutable => {
    const nodes: ContentNode[] = [
      SENTINEL_CONTENT,
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
      structureNodes: [SENTINEL_STRUCTURE], structureRoot: SENTINEL_INDEX, buffers: [],
      newlineFormat: NEWLINE.LF,
      contentNodes: nodes,
      contentRoot: 2,
      previouslyInsertedContentNodeIndex: null,
      previouslyInsertedContentNodeOffset: null,
    };
    return pieceTable;
  };
  const constructSimplePieceTableAfterRightRotate = constructSimplePieceTableBeforeLeftRotate;

  const constructSimplePieceTableAfterLeftRotate = (): PageContentMutable => {
    const nodes: ContentNode[] = [
      SENTINEL_CONTENT,
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
      structureNodes: [SENTINEL_STRUCTURE], structureRoot: SENTINEL_INDEX, buffers: [],
      newlineFormat: NEWLINE.LF,
      contentNodes: nodes,
      contentRoot: 4,
      previouslyInsertedContentNodeIndex: null,
      previouslyInsertedContentNodeOffset: null,
    };
    return pieceTable;
  };
  const constructSimplePieceTableBeforeRightRotate = constructSimplePieceTableAfterLeftRotate;

  const constructComplexPieceTableBeforeLeftRotate = (): PageContentMutable => {
    const nodes: ContentNode[] = [
      SENTINEL_CONTENT,
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
      structureNodes: [SENTINEL_STRUCTURE], structureRoot: SENTINEL_INDEX, buffers: [],
      newlineFormat: NEWLINE.LF,
      contentNodes: nodes,
      contentRoot: 5,
      previouslyInsertedContentNodeIndex: null,
      previouslyInsertedContentNodeOffset: null,
    };
    return pieceTable;
  };
  const constructComplexPieceTableAfterRightRotate = constructComplexPieceTableBeforeLeftRotate;

  const constructComplexPieceTableAfterLeftRotate = (): PageContentMutable => {
    const nodes: ContentNode[] = [
      SENTINEL_CONTENT,
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
      structureNodes: [SENTINEL_STRUCTURE], structureRoot: SENTINEL_INDEX, buffers: [],
      newlineFormat: NEWLINE.LF,
      contentNodes: nodes,
      contentRoot: 5,
      previouslyInsertedContentNodeIndex: null,
      previouslyInsertedContentNodeOffset: null,
    };
    return pieceTable;
  };
  const constructComplexPieceTableBeforeRightRotate = constructComplexPieceTableAfterLeftRotate;

  const constructOneNodePieceTable = (): PageContentMutable => ({
    structureNodes: [SENTINEL_STRUCTURE], structureRoot: SENTINEL_INDEX, buffers: [],
    contentNodes: [
      SENTINEL_CONTENT,
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
    contentRoot: 1,
    newlineFormat: NEWLINE.LF,
    previouslyInsertedContentNodeIndex: 1,
    previouslyInsertedContentNodeOffset: 0,
  });

  describe("left rotate", () => {
    test("One node case", () => {
      const pieceTable = constructOneNodePieceTable();
      leftRotate(pieceTable, 1);
      expect(pieceTable).toStrictEqual(constructOneNodePieceTable());
    });

    test("Simple case", () => {
      const pieceTable = constructSimplePieceTableBeforeLeftRotate();
      leftRotate(pieceTable, 2);
      expect(pieceTable).toStrictEqual(
        constructSimplePieceTableAfterLeftRotate(),
      );
    });

    test("Complex case", () => {
      const pieceTable = constructComplexPieceTableBeforeLeftRotate();
      leftRotate(pieceTable, 7);
      expect(pieceTable).toStrictEqual(
        constructComplexPieceTableAfterLeftRotate(),
      );
    });
  });

  describe("right rotate", () => {
    test("One node case", () => {
      const pieceTable = constructOneNodePieceTable();
      rightRotate(pieceTable, 1);
      expect(pieceTable).toStrictEqual(constructOneNodePieceTable());
    });

    test("Simple case", () => {
      const pieceTable = constructSimplePieceTableBeforeRightRotate();
      rightRotate(pieceTable, 4);
      expect(pieceTable).toStrictEqual(
        constructSimplePieceTableAfterRightRotate(),
      );
    });

    test("Complex case", () => {
      const pieceTable = constructComplexPieceTableBeforeRightRotate();
      rightRotate(pieceTable, 11);
      expect(pieceTable).toStrictEqual(
        constructComplexPieceTableAfterRightRotate(),
      );
    });
  });
});
