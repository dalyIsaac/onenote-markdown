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
        color: Color.Black,
        end: { column: 10, line: 2 },
        left: SENTINEL_INDEX,
        leftCharCount: 0,
        leftLineFeedCount: 0,
        length: 30,
        lineFeedCount: 2,
        parent: 2,
        right: SENTINEL_INDEX,
        start: { column: 0, line: 0 },
      },
      {
        bufferIndex: 1,
        color: Color.Black,
        end: { column: 10, line: 2 },
        left: 1,
        leftCharCount: 30,
        leftLineFeedCount: 2,
        length: 30,
        lineFeedCount: 2,
        parent: SENTINEL_INDEX,
        right: 4,
        start: { column: 0, line: 0 },
      },
      {
        bufferIndex: 2,
        color: Color.Black,
        end: { column: 5, line: 1 },
        left: SENTINEL_INDEX,
        leftCharCount: 0,
        leftLineFeedCount: 0,
        length: 30,
        lineFeedCount: 1,
        parent: 4,
        right: SENTINEL_INDEX,
        start: { column: 0, line: 0 },
      },
      {
        bufferIndex: 3,
        color: Color.Black,
        end: { column: 5, line: 1 },
        left: 3,
        leftCharCount: 30,
        leftLineFeedCount: 1,
        length: 30,
        lineFeedCount: 1,
        parent: 2,
        right: 5,
        start: { column: 0, line: 0 },
      },
      {
        bufferIndex: 4,
        color: Color.Red,
        end: { column: 5, line: 1 },
        left: SENTINEL_INDEX,
        leftCharCount: 0,
        leftLineFeedCount: 0,
        length: 30,
        lineFeedCount: 1,
        parent: 4,
        right: SENTINEL_INDEX,
        start: { column: 0, line: 0 },
      },
    ];
    const pieceTable: PageContentMutable = {
      buffers: [],
      content: { nodes, root: 2 },newlineFormat: NEWLINE.LF,
      previouslyInsertedContentNodeIndex: null,
      previouslyInsertedContentNodeOffset: null,
      structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
    };
    return pieceTable;
  };
  const constructSimplePieceTableAfterRightRotate = constructSimplePieceTableBeforeLeftRotate;

  const constructSimplePieceTableAfterLeftRotate = (): PageContentMutable => {
    const nodes: ContentNode[] = [
      SENTINEL_CONTENT,
      {
        bufferIndex: 0,
        color: Color.Black,
        end: { column: 10, line: 2 },
        left: SENTINEL_INDEX,
        leftCharCount: 0,
        leftLineFeedCount: 0,
        length: 30,
        lineFeedCount: 2,
        parent: 2,
        right: SENTINEL_INDEX,
        start: { column: 0, line: 0 },
      },
      {
        bufferIndex: 1,
        color: Color.Black,
        end: { column: 10, line: 2 },
        left: 1,
        leftCharCount: 30,
        leftLineFeedCount: 2,
        length: 30,
        lineFeedCount: 2,
        parent: 4,
        right: 3,
        start: { column: 0, line: 0 },
      },
      {
        bufferIndex: 2,
        color: Color.Black,
        end: { column: 5, line: 1 },
        left: SENTINEL_INDEX,
        leftCharCount: 0,
        leftLineFeedCount: 0,
        length: 30,
        lineFeedCount: 1,
        parent: 2,
        right: SENTINEL_INDEX,
        start: { column: 0, line: 0 },
      },
      {
        bufferIndex: 3,
        color: Color.Black,
        end: { column: 5, line: 1 },
        left: 2,
        leftCharCount: 90,
        leftLineFeedCount: 5,
        length: 30,
        lineFeedCount: 1,
        parent: SENTINEL_INDEX,
        right: 5,
        start: { column: 0, line: 0 },
      },
      {
        bufferIndex: 4,
        color: Color.Red,
        end: { column: 5, line: 1 },
        left: SENTINEL_INDEX,
        leftCharCount: 0,
        leftLineFeedCount: 0,
        length: 30,
        lineFeedCount: 1,
        parent: 4,
        right: SENTINEL_INDEX,
        start: { column: 0, line: 0 },
      },
    ];
    const pieceTable: PageContentMutable = {
      buffers: [],
      content: { nodes, root: 4 },newlineFormat: NEWLINE.LF,
      previouslyInsertedContentNodeIndex: null,
      previouslyInsertedContentNodeOffset: null,
      structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
    };
    return pieceTable;
  };
  const constructSimplePieceTableBeforeRightRotate = constructSimplePieceTableAfterLeftRotate;

  const constructComplexPieceTableBeforeLeftRotate = (): PageContentMutable => {
    const nodes: ContentNode[] = [
      SENTINEL_CONTENT,
      {
        bufferIndex: 0,
        color: Color.Black,
        end: { column: 10, line: 2 },
        left: SENTINEL_INDEX,
        leftCharCount: 0,
        leftLineFeedCount: 0,
        length: 30,
        lineFeedCount: 2,
        parent: 2,
        right: SENTINEL_INDEX,
        start: { column: 0, line: 0 },
      },
      {
        bufferIndex: 1,
        color: Color.Black,
        end: { column: 10, line: 2 },
        left: 1,
        leftCharCount: 30,
        leftLineFeedCount: 2,
        length: 30,
        lineFeedCount: 2,
        parent: 3,
        right: SENTINEL_INDEX,
        start: { column: 0, line: 0 },
      },
      {
        bufferIndex: 2,
        color: Color.Black,
        end: { column: 10, line: 2 },
        left: 2,
        leftCharCount: 60,
        leftLineFeedCount: 4,
        length: 30,
        lineFeedCount: 2,
        parent: 5,
        right: 4,
        start: { column: 0, line: 0 },
      },
      {
        bufferIndex: 3,
        color: Color.Black,
        end: { column: 10, line: 2 },
        left: SENTINEL_INDEX,
        leftCharCount: 0,
        leftLineFeedCount: 0,
        length: 30,
        lineFeedCount: 2,
        parent: 3,
        right: SENTINEL_INDEX,
        start: { column: 0, line: 0 },
      },
      {
        bufferIndex: 4,
        color: Color.Black,
        end: { column: 10, line: 2 },
        left: 3,
        leftCharCount: 120,
        leftLineFeedCount: 8,
        length: 30,
        lineFeedCount: 2,
        parent: SENTINEL_INDEX,
        right: 7,
        start: { column: 0, line: 0 },
      },
      {
        bufferIndex: 5,
        color: Color.Black,
        end: { column: 10, line: 2 },
        left: SENTINEL_INDEX,
        leftCharCount: 0,
        leftLineFeedCount: 0,
        length: 30,
        lineFeedCount: 2,
        parent: 7,
        right: SENTINEL_INDEX,
        start: { column: 0, line: 0 },
      },
      {
        bufferIndex: 6,
        color: Color.Black,
        end: { column: 10, line: 2 },
        left: 6,
        leftCharCount: 30,
        leftLineFeedCount: 2,
        length: 30,
        lineFeedCount: 2,
        parent: 5,
        right: 11,
        start: { column: 0, line: 0 },
      },
      {
        bufferIndex: 7,
        color: Color.Black,
        end: { column: 10, line: 2 },
        left: SENTINEL_INDEX,
        leftCharCount: 0,
        leftLineFeedCount: 0,
        length: 30,
        lineFeedCount: 2,
        parent: 9,
        right: SENTINEL_INDEX,
        start: { column: 0, line: 0 },
      },
      {
        bufferIndex: 8,
        color: Color.Black,
        end: { column: 10, line: 2 },
        left: 8,
        leftCharCount: 30,
        leftLineFeedCount: 2,
        length: 30,
        lineFeedCount: 2,
        parent: 11,
        right: 10,
        start: { column: 0, line: 0 },
      },
      {
        bufferIndex: 9,
        color: Color.Black,
        end: { column: 10, line: 2 },
        left: SENTINEL_INDEX,
        leftCharCount: 0,
        leftLineFeedCount: 0,
        length: 30,
        lineFeedCount: 2,
        parent: 9,
        right: SENTINEL_INDEX,
        start: { column: 0, line: 0 },
      },
      {
        bufferIndex: 10,
        color: Color.Black,
        end: { column: 10, line: 2 },
        left: 9,
        leftCharCount: 90,
        leftLineFeedCount: 6,
        length: 30,
        lineFeedCount: 2,
        parent: 7,
        right: 12,
        start: { column: 0, line: 0 },
      },
      {
        bufferIndex: 11,
        color: Color.Black,
        end: { column: 10, line: 2 },
        left: SENTINEL_INDEX,
        leftCharCount: 0,
        leftLineFeedCount: 0,
        length: 30,
        lineFeedCount: 2,
        parent: 11,
        right: 14,
        start: { column: 0, line: 0 },
      },
      {
        bufferIndex: 12,
        color: Color.Black,
        end: { column: 10, line: 2 },
        left: SENTINEL_INDEX,
        leftCharCount: 0,
        leftLineFeedCount: 0,
        length: 30,
        lineFeedCount: 2,
        parent: 14,
        right: SENTINEL_INDEX,
        start: { column: 0, line: 0 },
      },
      {
        bufferIndex: 13,
        color: Color.Black,
        end: { column: 10, line: 2 },
        left: 13,
        leftCharCount: 30,
        leftLineFeedCount: 2,
        length: 30,
        lineFeedCount: 2,
        parent: 12,
        right: SENTINEL_INDEX,
        start: { column: 0, line: 0 },
      },
    ];
    const pieceTable: PageContentMutable = {
      buffers: [],
      content: { nodes, root: 5 },newlineFormat: NEWLINE.LF,
      previouslyInsertedContentNodeIndex: null,
      previouslyInsertedContentNodeOffset: null,
      structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
    };
    return pieceTable;
  };
  const constructComplexPieceTableAfterRightRotate = constructComplexPieceTableBeforeLeftRotate;

  const constructComplexPieceTableAfterLeftRotate = (): PageContentMutable => {
    const nodes: ContentNode[] = [
      SENTINEL_CONTENT,
      {
        bufferIndex: 0,
        color: Color.Black,
        end: { column: 10, line: 2 },
        left: SENTINEL_INDEX,
        leftCharCount: 0,
        leftLineFeedCount: 0,
        length: 30,
        lineFeedCount: 2,
        parent: 2,
        right: SENTINEL_INDEX,
        start: { column: 0, line: 0 },
      },
      {
        bufferIndex: 1,
        color: Color.Black,
        end: { column: 10, line: 2 },
        left: 1,
        leftCharCount: 30,
        leftLineFeedCount: 2,
        length: 30,
        lineFeedCount: 2,
        parent: 3,
        right: SENTINEL_INDEX,
        start: { column: 0, line: 0 },
      },
      {
        bufferIndex: 2,
        color: Color.Black,
        end: { column: 10, line: 2 },
        left: 2,
        leftCharCount: 60,
        leftLineFeedCount: 4,
        length: 30,
        lineFeedCount: 2,
        parent: 5,
        right: 4,
        start: { column: 0, line: 0 },
      },
      {
        bufferIndex: 3,
        color: Color.Black,
        end: { column: 10, line: 2 },
        left: SENTINEL_INDEX,
        leftCharCount: 0,
        leftLineFeedCount: 0,
        length: 30,
        lineFeedCount: 2,
        parent: 3,
        right: SENTINEL_INDEX,
        start: { column: 0, line: 0 },
      },
      {
        bufferIndex: 4,
        color: Color.Black,
        end: { column: 10, line: 2 },
        left: 3,
        leftCharCount: 120,
        leftLineFeedCount: 8,
        length: 30,
        lineFeedCount: 2,
        parent: SENTINEL_INDEX,
        right: 11,
        start: { column: 0, line: 0 },
      },
      {
        bufferIndex: 5,
        color: Color.Black,
        end: { column: 10, line: 2 },
        left: SENTINEL_INDEX,
        leftCharCount: 0,
        leftLineFeedCount: 0,
        length: 30,
        lineFeedCount: 2,
        parent: 7,
        right: SENTINEL_INDEX,
        start: { column: 0, line: 0 },
      },
      {
        bufferIndex: 6,
        color: Color.Black,
        end: { column: 10, line: 2 },
        left: 6,
        leftCharCount: 30,
        leftLineFeedCount: 2,
        length: 30,
        lineFeedCount: 2,
        parent: 11,
        right: 9,
        start: { column: 0, line: 0 },
      },
      {
        bufferIndex: 7,
        color: Color.Black,
        end: { column: 10, line: 2 },
        left: SENTINEL_INDEX,
        leftCharCount: 0,
        leftLineFeedCount: 0,
        length: 30,
        lineFeedCount: 2,
        parent: 9,
        right: SENTINEL_INDEX,
        start: { column: 0, line: 0 },
      },
      {
        bufferIndex: 8,
        color: Color.Black,
        end: { column: 10, line: 2 },
        left: 8,
        leftCharCount: 30,
        leftLineFeedCount: 2,
        length: 30,
        lineFeedCount: 2,
        parent: 7,
        right: 10,
        start: { column: 0, line: 0 },
      },
      {
        bufferIndex: 9,
        color: Color.Black,
        end: { column: 10, line: 2 },
        left: SENTINEL_INDEX,
        leftCharCount: 0,
        leftLineFeedCount: 0,
        length: 30,
        lineFeedCount: 2,
        parent: 9,
        right: SENTINEL_INDEX,
        start: { column: 0, line: 0 },
      },
      {
        bufferIndex: 10,
        color: Color.Black,
        end: { column: 10, line: 2 },
        left: 7,
        leftCharCount: 150,
        leftLineFeedCount: 10,
        length: 30,
        lineFeedCount: 2,
        parent: 5,
        right: 12,
        start: { column: 0, line: 0 },
      },
      {
        bufferIndex: 11,
        color: Color.Black,
        end: { column: 10, line: 2 },
        left: SENTINEL_INDEX,
        leftCharCount: 0,
        leftLineFeedCount: 0,
        length: 30,
        lineFeedCount: 2,
        parent: 11,
        right: 14,
        start: { column: 0, line: 0 },
      },
      {
        bufferIndex: 12,
        color: Color.Black,
        end: { column: 10, line: 2 },
        left: SENTINEL_INDEX,
        leftCharCount: 0,
        leftLineFeedCount: 0,
        length: 30,
        lineFeedCount: 2,
        parent: 14,
        right: SENTINEL_INDEX,
        start: { column: 0, line: 0 },
      },
      {
        bufferIndex: 13,
        color: Color.Black,
        end: { column: 10, line: 2 },
        left: 13,
        leftCharCount: 30,
        leftLineFeedCount: 2,
        length: 30,
        lineFeedCount: 2,
        parent: 12,
        right: SENTINEL_INDEX,
        start: { column: 0, line: 0 },
      },
    ];
    const pieceTable: PageContentMutable = {
      buffers: [],
      content: { nodes, root: 5 },newlineFormat: NEWLINE.LF,
      previouslyInsertedContentNodeIndex: null,
      previouslyInsertedContentNodeOffset: null,
      structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
    };
    return pieceTable;
  };
  const constructComplexPieceTableBeforeRightRotate = constructComplexPieceTableAfterLeftRotate;

  const constructOneNodePieceTable = (): PageContentMutable => ({
    buffers: [],
    content: {
      nodes: [
        SENTINEL_CONTENT,
        {
          bufferIndex: 0,
          color: Color.Black,
          end: { column: 0, line: 0 },
          left: SENTINEL_INDEX,
          leftCharCount: 0,
          leftLineFeedCount: 0,
          length: 0,
          lineFeedCount: 0,
          parent: SENTINEL_INDEX,
          right: SENTINEL_INDEX,
          start: { column: 0, line: 0 },
        },
      ],
      root: 1,
    },newlineFormat: NEWLINE.LF,
    previouslyInsertedContentNodeIndex: 1,
    previouslyInsertedContentNodeOffset: 0,
    structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
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
