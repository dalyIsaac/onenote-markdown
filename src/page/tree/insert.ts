// import { IBuffer, IPageContent } from "../model";
// import { findNodeAtOffset } from "./tree";

// export interface IContentInsert {
//   content: string;
//   offset: number;
// }

// export function insertContent(
//   content: IContentInsert,
//   pieceTable: IPageContent,
// ): IPageContent {
//   const nodes = [...pieceTable.nodes];
//   const position = findNodeAtOffset(content.offset, nodes, pieceTable.root);
//   if (position.nodeIndex === Infinity) {
//     const newBuffer: IBuffer = {
//       isReadOnly: false,
//       lineStarts: getLineStarts,
//     };
//     const newNode: INode = {};
//   }
// }
