import { Color, PageContentMutable } from "../pageModel";
import { SENTINEL_STRUCTURE } from "../structureTree/tree";
import { SENTINEL_INDEX } from "./tree";
import { ContentNode } from "../contentTree/contentModel";
import { leftRotate, rightRotate } from "./rotate";
import { SENTINEL_CONTENT } from "../contentTree/tree";
import { StructureNode, TagType } from "../structureTree/structureModel";

describe("Functions for performing rotations on the piece table/red-black tree.", () => {
  describe("Content nodes", () => {
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
        content: { nodes, root: 2 },
        
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
        content: { nodes, root: 4 },
        
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
        content: { nodes, root: 5 },
        
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
        content: { nodes, root: 5 },
        
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
      },
      
      previouslyInsertedContentNodeIndex: 1,
      previouslyInsertedContentNodeOffset: 0,
      structure: { nodes: [SENTINEL_STRUCTURE], root: SENTINEL_INDEX },
    });
    describe("left rotate", () => {
      test("One node case", () => {
        const pieceTable = constructOneNodePieceTable();
        leftRotate(pieceTable.content, 1);
        expect(pieceTable).toStrictEqual(constructOneNodePieceTable());
      });

      test("Simple case", () => {
        const pieceTable = constructSimplePieceTableBeforeLeftRotate();
        leftRotate(pieceTable.content, 2);
        expect(pieceTable).toStrictEqual(
          constructSimplePieceTableAfterLeftRotate(),
        );
      });

      test("Complex case", () => {
        const pieceTable = constructComplexPieceTableBeforeLeftRotate();
        leftRotate(pieceTable.content, 7);
        expect(pieceTable).toStrictEqual(
          constructComplexPieceTableAfterLeftRotate(),
        );
      });
    });

    describe("right rotate", () => {
      test("One node case", () => {
        const pieceTable = constructOneNodePieceTable();
        rightRotate(pieceTable.content, 1);
        expect(pieceTable).toStrictEqual(constructOneNodePieceTable());
      });

      test("Simple case", () => {
        const pieceTable = constructSimplePieceTableBeforeRightRotate();
        rightRotate(pieceTable.content, 4);
        expect(pieceTable).toStrictEqual(
          constructSimplePieceTableAfterRightRotate(),
        );
      });

      test("Complex case", () => {
        const pieceTable = constructComplexPieceTableBeforeRightRotate();
        rightRotate(pieceTable.content, 11);
        expect(pieceTable).toStrictEqual(
          constructComplexPieceTableAfterRightRotate(),
        );
      });
    });
  });

  describe("Structure nodes", () => {
    const constructComplexPieceTableBeforeLeftRotate = (): PageContentMutable => {
      const nodes: StructureNode[] = [
        SENTINEL_STRUCTURE,
        {
          // 1
          color: Color.Black,
          id: "",
          left: SENTINEL_INDEX,
          leftSubTreeLength: 0,
          length: 0,
          parent: 2,
          right: SENTINEL_INDEX,
          tag: "span",
          tagType: TagType.StartEndTag,
        },
        {
          // 2
          color: Color.Black,
          id: "",
          left: 1,
          leftSubTreeLength: 1,
          length: 0,
          parent: 3,
          right: SENTINEL_INDEX,
          tag: "span",
          tagType: TagType.StartEndTag,
        },
        {
          // 3
          color: Color.Black,
          id: "",
          left: 2,
          leftSubTreeLength: 2,
          length: 0,
          parent: 5,
          right: 4,
          tag: "span",
          tagType: TagType.StartEndTag,
        },
        {
          // 4
          color: Color.Black,
          id: "",
          left: SENTINEL_INDEX,
          leftSubTreeLength: 0,
          length: 0,
          parent: 3,
          right: SENTINEL_INDEX,
          tag: "span",
          tagType: TagType.StartEndTag,
        },
        {
          // 5
          color: Color.Black,
          id: "",
          left: 3,
          leftSubTreeLength: 4,
          length: 0,
          parent: SENTINEL_INDEX,
          right: 7,
          tag: "span",
          tagType: TagType.StartEndTag,
        },
        {
          // 6
          color: Color.Black,
          id: "",
          left: SENTINEL_INDEX,
          leftSubTreeLength: 0,
          length: 0,
          parent: 7,
          right: SENTINEL_INDEX,
          tag: "span",
          tagType: TagType.StartEndTag,
        },
        {
          // 7
          color: Color.Black,
          id: "",
          left: 6,
          leftSubTreeLength: 1,
          length: 0,
          parent: 5,
          right: 11,
          tag: "span",
          tagType: TagType.StartEndTag,
        },
        {
          // 8
          color: Color.Black,
          id: "",
          left: SENTINEL_INDEX,
          leftSubTreeLength: 0,
          length: 0,
          parent: 9,
          right: SENTINEL_INDEX,
          tag: "span",
          tagType: TagType.StartEndTag,
        },
        {
          // 9
          color: Color.Black,
          id: "",
          left: 8,
          leftSubTreeLength: 1,
          length: 0,
          parent: 11,
          right: 10,
          tag: "span",
          tagType: TagType.StartEndTag,
        },
        {
          // 10
          color: Color.Black,
          id: "",
          left: SENTINEL_INDEX,
          leftSubTreeLength: 0,
          length: 0,
          parent: 9,
          right: SENTINEL_INDEX,
          tag: "span",
          tagType: TagType.StartEndTag,
        },
        {
          // 11
          color: Color.Black,
          id: "",
          left: 9,
          leftSubTreeLength: 3,
          length: 0,
          parent: 7,
          right: 12,
          tag: "span",
          tagType: TagType.StartEndTag,
        },
        {
          // 12
          color: Color.Black,
          id: "",
          left: SENTINEL_INDEX,
          leftSubTreeLength: 0,
          length: 0,
          parent: 11,
          right: 14,
          tag: "span",
          tagType: TagType.StartEndTag,
        },
        {
          // 13
          color: Color.Black,
          id: "",
          left: SENTINEL_INDEX,
          leftSubTreeLength: 0,
          length: 0,
          parent: 14,
          right: SENTINEL_INDEX,
          tag: "span",
          tagType: TagType.StartEndTag,
        },
        {
          // 14
          color: Color.Black,
          id: "",
          left: 13,
          leftSubTreeLength: 1,
          length: 0,
          parent: 12,
          right: SENTINEL_INDEX,
          tag: "span",
          tagType: TagType.StartEndTag,
        },
      ];
      const pieceTable: PageContentMutable = {
        buffers: [],
        content: { nodes: [SENTINEL_CONTENT], root: SENTINEL_INDEX },
        
        previouslyInsertedContentNodeIndex: null,
        previouslyInsertedContentNodeOffset: null,
        structure: { nodes, root: 5 },
      };
      return pieceTable;
    };
    const constructComplexPieceTableAfterRightRotate = constructComplexPieceTableBeforeLeftRotate;

    const constructComplexPieceTableAfterLeftRotate = (): PageContentMutable => {
      const nodes: StructureNode[] = [
        SENTINEL_STRUCTURE,
        {
          // 1
          color: Color.Black,
          id: "",
          left: SENTINEL_INDEX,
          leftSubTreeLength: 0,
          length: 0,
          parent: 2,
          right: SENTINEL_INDEX,
          tag: "span",
          tagType: TagType.StartEndTag,
        },
        {
          // 2
          color: Color.Black,
          id: "",
          left: 1,
          leftSubTreeLength: 1,
          length: 0,
          parent: 3,
          right: SENTINEL_INDEX,
          tag: "span",
          tagType: TagType.StartEndTag,
        },
        {
          // 3
          color: Color.Black,
          id: "",
          left: 2,
          leftSubTreeLength: 2,
          length: 0,
          parent: 5,
          right: 4,
          tag: "span",
          tagType: TagType.StartEndTag,
        },
        {
          // 4
          color: Color.Black,
          id: "",
          left: SENTINEL_INDEX,
          leftSubTreeLength: 0,
          length: 0,
          parent: 3,
          right: SENTINEL_INDEX,
          tag: "span",
          tagType: TagType.StartEndTag,
        },
        {
          // 5
          color: Color.Black,
          id: "",
          left: 3,
          leftSubTreeLength: 4,
          length: 0,
          parent: SENTINEL_INDEX,
          right: 11,
          tag: "span",
          tagType: TagType.StartEndTag,
        },
        {
          // 6
          color: Color.Black,
          id: "",
          left: SENTINEL_INDEX,
          leftSubTreeLength: 0,
          length: 0,
          parent: 7,
          right: SENTINEL_INDEX,
          tag: "span",
          tagType: TagType.StartEndTag,
        },
        {
          // 7
          color: Color.Black,
          id: "",
          left: 6,
          leftSubTreeLength: 1,
          length: 0,
          parent: 11,
          right: 9,
          tag: "span",
          tagType: TagType.StartEndTag,
        },
        {
          // 8
          color: Color.Black,
          id: "",
          left: SENTINEL_INDEX,
          leftSubTreeLength: 0,
          length: 0,
          parent: 9,
          right: SENTINEL_INDEX,
          tag: "span",
          tagType: TagType.StartEndTag,
        },
        {
          // 9
          color: Color.Black,
          id: "",
          left: 8,
          leftSubTreeLength: 1,
          length: 0,
          parent: 7,
          right: 10,
          tag: "span",
          tagType: TagType.StartEndTag,
        },
        {
          // 10
          color: Color.Black,
          id: "",
          left: SENTINEL_INDEX,
          leftSubTreeLength: 0,
          length: 0,
          parent: 9,
          right: SENTINEL_INDEX,
          tag: "span",
          tagType: TagType.StartEndTag,
        },
        {
          // 11
          color: Color.Black,
          id: "",
          left: 7,
          leftSubTreeLength: 5,
          length: 0,
          parent: 5,
          right: 12,
          tag: "span",
          tagType: TagType.StartEndTag,
        },
        {
          // 12
          color: Color.Black,
          id: "",
          left: SENTINEL_INDEX,
          leftSubTreeLength: 0,
          length: 0,
          parent: 11,
          right: 14,
          tag: "span",
          tagType: TagType.StartEndTag,
        },
        {
          // 13
          color: Color.Black,
          id: "",
          left: SENTINEL_INDEX,
          leftSubTreeLength: 0,
          length: 0,
          parent: 14,
          right: SENTINEL_INDEX,
          tag: "span",
          tagType: TagType.StartEndTag,
        },
        {
          // 14
          color: Color.Black,
          id: "",
          left: 13,
          leftSubTreeLength: 1,
          length: 0,
          parent: 12,
          right: SENTINEL_INDEX,
          tag: "span",
          tagType: TagType.StartEndTag,
        },
      ];
      const pieceTable: PageContentMutable = {
        buffers: [],
        content: { nodes: [SENTINEL_CONTENT], root: SENTINEL_INDEX },
        
        previouslyInsertedContentNodeIndex: null,
        previouslyInsertedContentNodeOffset: null,
        structure: { nodes, root: 5 },
      };
      return pieceTable;
    };
    const constructComplexPieceTableBeforeRightRotate = constructComplexPieceTableAfterLeftRotate;

    test("Structure left rotate complex case", () => {
      const pieceTable = constructComplexPieceTableBeforeLeftRotate();
      leftRotate(pieceTable.structure, 7);
      expect(pieceTable).toStrictEqual(
        constructComplexPieceTableAfterLeftRotate(),
      );
    });

    test("Structure right rotate complex case", () => {
      const pieceTable = constructComplexPieceTableBeforeRightRotate();
      rightRotate(pieceTable.structure, 11);
      expect(pieceTable).toStrictEqual(
        constructComplexPieceTableAfterRightRotate(),
      );
    });
  });
});
