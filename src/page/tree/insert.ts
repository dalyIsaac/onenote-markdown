import { CharValues, Color, IBuffer, INode, IPageContent } from "../model";
import { SENTINEL_INDEX } from "../reducer";
import {
  findNodeAtOffset,
  getLineStarts,
  INodePosition,
  MAX_BUFFER_LENGTH,
} from "./tree";

export interface IContentInsert {
  content: string;
  offset: number;
}

/**
 * Inserts new content into the piece table.
 * @param newContent Tbe content to insert, and the desired offset.
 * @param pieceTable The piece table for the OneNote page.
 */
export function insertContent(
  newContent: IContentInsert,
  pieceTable: IPageContent,
): IPageContent {
  let buffers = [...pieceTable.buffers];
  let nodes = [...pieceTable.nodes];
  let newPieceTable = { ...pieceTable };
  const { content, offset } = newContent;

  const position = findNodeAtOffset(offset, nodes, pieceTable.root);

  // insert at the end of a piece
  if (position.remainder === position.node.length) {
    ({ buffers, nodes } = insertContentAtEnd(
      position,
      content,
      buffers,
      nodes,
      pieceTable.newlineFormat,
    ));
  }

  newPieceTable = {
    ...newPieceTable,
    buffers,
    nodes,
  };
  // TODO: insert at the start of a piece
  // TODO: insert inside a piece

  // TODO: fix insert function
  return newPieceTable;
}

/**
 *
 * @param position The positional information about the offset to insert at.
 * @param content The new content to insert.
 * @param buffers Array of the buffers for the piece table.
 * @param nodes The nodes of the piece table.
 * @param newlineFormat The newline format.
 */
function insertContentAtEnd(
  position: INodePosition,
  content: string,
  buffers: IBuffer[],
  nodes: INode[],
  newlineFormat: CharValues[],
): { buffers: IBuffer[]; nodes: INode[] } {
  const buffer = buffers[position.node.bufferIndex];
  if (
    buffer.content.length + content.length <= MAX_BUFFER_LENGTH &&
    buffer.isReadOnly === false
  ) {
    const newContent = buffer.content + content;
    // extend the buffer and node
    const newBuffer: IBuffer = {
      ...buffer,
      content: newContent,
      lineStarts: getLineStarts(newContent, newlineFormat),
    };
    buffers[position.node.bufferIndex] = newBuffer;
    nodes[position.nodeIndex] = {
      ...position.node,
      end: {
        line: newBuffer.lineStarts.length - 1,
        column:
          newBuffer.content.length -
          newBuffer.lineStarts[newBuffer.lineStarts.length - 1],
      },
      length: newContent.length,
    };
  } else {
    // create a new buffer and node
    const newBuffer: IBuffer = {
      isReadOnly: false,
      lineStarts: getLineStarts(content, newlineFormat),
      content,
    };
    buffers.push(newBuffer);

    const parentNode: INode = {
      ...position.node,
      right: nodes.length,
    };
    nodes[position.nodeIndex] = parentNode;

    const newNode: INode = {
      bufferIndex: buffers.length - 1,
      start: { line: 0, column: 0 },
      end: {
        line: newBuffer.lineStarts.length - 1,
        column:
          newBuffer.content.length -
          newBuffer.lineStarts[newBuffer.lineStarts.length - 1],
      },
      leftCharCount: 0,
      leftLineFeedCount: 0,
      length: newBuffer.content.length,
      lineFeedCount: newBuffer.lineStarts.length - 1,
      color: Color.Red,
      parent: position.nodeIndex,
      left: SENTINEL_INDEX,
      right: SENTINEL_INDEX,
    };
    nodes.push(newNode);
  }
  return {
    buffers,
    nodes,
  };
}
