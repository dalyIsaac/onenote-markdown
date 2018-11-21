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
 * @param contentToInsert The content to insert, and the desired offset.
 * @param page The piece table for the OneNote page.
 */
export function insertContent(
  contentToInsert: IContentInsert,
  page: IPageContent,
): IPageContent {
  let newPieceTable = { ...page };

  const position = findNodeAtOffset(
    contentToInsert.offset,
    page.nodes,
    page.root,
  );

  if (position.remainder === position.node.length) {
    // insert at the end of a piece
    newPieceTable = insertContentAtEnd(position, contentToInsert, page);
  } else if (position.remainder === 0) {
    // insert at the start of a piece
    newPieceTable = insertContentAtStart(position, contentToInsert, page);
  }

  // TODO: insert at the start of a piece
  // TODO: insert inside a piece

  // TODO: fix insert function
  return newPieceTable;
}

/**
 * Inserts new content at the end of a piece.
 * @param position The positional information about the offset to insert at.
 * @param contentToInsert The new content to insert.
 * @param page The old piece table for the page.
 */
function insertContentAtEnd(
  position: INodePosition,
  contentToInsert: IContentInsert,
  page: IPageContent,
): IPageContent {
  const buffer = page.buffers[position.node.bufferIndex];
  if (
    buffer.content.length + contentToInsert.content.length <=
      MAX_BUFFER_LENGTH &&
    buffer.isReadOnly === false
  ) {
    const nodes = [...page.nodes];
    const buffers = [...page.buffers];
    const newContent = buffer.content + contentToInsert.content;
    // extend the buffer and node
    const newBuffer: IBuffer = {
      ...buffer,
      content: newContent,
      lineStarts: getLineStarts(newContent, page.newlineFormat),
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
    return {
      ...page,
      buffers,
      nodes,
    };
  } else {
    // create a new buffer and node
    return createNewBufferNewNode(position, contentToInsert, page);
  }
}

/**
 * Inserts new content at the start of a piece.
 * @param position The positional information about the offset to insert at.
 * @param contentToInsert The new content to insert.
 * @param page The old piece table for the page.
 */
function insertContentAtStart(
  position: INodePosition,
  contentToInsert: IContentInsert,
  page: IPageContent,
): IPageContent {
  // check if it can be inserted at the end of a prior node
  const previousPosition = findNodeAtOffset(
    contentToInsert.offset - 1,
    page.nodes,
    page.root,
  );
  if (previousPosition.node !== position.node) {
    // the content can be inserted at the end of the prior node
    return insertContentAtEnd(previousPosition, contentToInsert, page);
  } else {
    // the content cannot be inserted at the end of the prior node, thus insert a new node
    const nodes = [...page.nodes];
    const buffers = [...page.buffers];
    const buffer = buffers[buffers.length - 1];
    if (
      buffer.content.length + contentToInsert.content.length <=
      MAX_BUFFER_LENGTH
    ) {
      // extend the buffer and create a new node
      const newContent = buffer.content + contentToInsert.content;
      const newBuffer: IBuffer = {
        ...buffer,
        content: newContent,
        lineStarts: getLineStarts(newContent, page.newlineFormat),
      };
      buffers[buffers.length - 1] = newBuffer;
      const newNode: INode = {
        bufferIndex: buffers.length - 1,
        start: {
          line: buffer.lineStarts.length - 1,
          column:
            buffer.content.length -
            buffer.lineStarts[buffer.lineStarts.length - 1],
        },
        end: {
          line: newBuffer.lineStarts.length - 1,
          column:
            newBuffer.content.length -
            newBuffer.lineStarts[newBuffer.lineStarts.length - 1] +
            1,
        },
        leftCharCount: 0,
        leftLineFeedCount: 0,
        length: contentToInsert.content.length,
        lineFeedCount: newBuffer.lineStarts.length - buffer.lineStarts.length,
        color: Color.Red,
        parent: position.nodeIndex,
        left: SENTINEL_INDEX,
        right: SENTINEL_INDEX,
      };
      nodes.push(newNode);
      nodes[position.nodeIndex].left = nodes.length - 1;
      return {
        ...page,
        buffers,
        nodes,
      };
    } else {
      // create a new buffer and a new node
      return createNewBufferNewNode(previousPosition, contentToInsert, page);
    }
  }
}

/**
 * Creates a new buffer and a new node to the right of the node specified in `position`.
 * @param position The positional information about the offset to insert at.
 * @param contentToInsert The new content to insert.
 * @param page The old piece table for the page.
 */
function createNewBufferNewNode(
  position: INodePosition,
  contentToInsert: IContentInsert,
  page: IPageContent,
): IPageContent {
  const nodes = [...page.nodes];
  const buffers = [...page.buffers];
  const newBuffer: IBuffer = {
    isReadOnly: false,
    lineStarts: getLineStarts(contentToInsert.content, page.newlineFormat),
    content: contentToInsert.content,
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
  return {
    ...page,
    buffers,
    nodes,
  };
}
