import { Color, IPageContent, NEWLINE } from "./model";
import { INode } from "./node";
import { leftRotate, rightRotate } from "./treeRotate";

describe("page/reducer", () => {
  const constructSimplePieceTableBeforeLeftRotate = (): IPageContent => {
    const simpleNodesBeforeLeftRotate: INode[] = [
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
        left: -1,
        right: -1,
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
        parent: -1,
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
        left: -1,
        right: -1,
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
        left: -1,
        right: -1,
      },
    ];
    const simplePieceTableBeforeLeftRotate: IPageContent = {
      buffers: [],
      newlineFormat: NEWLINE.LF,
      nodes: simpleNodesBeforeLeftRotate,
      root: 1,
    };
    return simplePieceTableBeforeLeftRotate;
  };
  const constructSimplePieceTableAfterRightRotate = constructSimplePieceTableBeforeLeftRotate;

  const constructSimplePieceTableAfterLeftRotate = (): IPageContent => {
    const simpleNodesAfterLeftRotate: INode[] = [
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
        left: -1,
        right: -1,
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
        left: -1,
        right: -1,
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
        parent: -1,
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
        left: -1,
        right: -1,
      },
    ];
    const simplePieceTableAfterLeftRotate: IPageContent = {
      buffers: [],
      newlineFormat: NEWLINE.LF,
      nodes: simpleNodesAfterLeftRotate,
      root: 3,
    };
    return simplePieceTableAfterLeftRotate;
  };
  const constructSimplePieceTableBeforeRightRotate = constructSimplePieceTableAfterLeftRotate;

  describe("left rotate", () => {
    test("Simple case", () => {
      const pieceTable = constructSimplePieceTableBeforeLeftRotate();
      leftRotate(pieceTable, 1);
      expect(pieceTable).toEqual(constructSimplePieceTableAfterLeftRotate());
    });
  });

  describe("right rotate", () => {
    test("Simple case", () => {
      const pieceTable = constructSimplePieceTableBeforeRightRotate();
      rightRotate(pieceTable, 3);
      expect(pieceTable).toEqual(constructSimplePieceTableAfterRightRotate());
    });
  });
});
