import { IBuffer, INode, IPageContent } from "../model";
import { getLineStarts, MAX_BUFFER_LENGTH } from "./tree";

export interface IContentInsert {
  content: string;
  offset: number;
}

export function insertContent(
  content: IContentInsert,
  page: IPageContent,
): IPageContent {
  let previouslyInsertedNode: INode | undefined;
  let newPage: IPageContent | undefined;
  if (
    page.previouslyInsertedNodeIndex != null &&
    page.previouslyInsertedNodeOffset != null
  ) {
    previouslyInsertedNode = page.nodes[page.previouslyInsertedNodeIndex];
  }

  if (
    previouslyInsertedNode !== undefined &&
    content.offset ===
      page.previouslyInsertedNodeOffset! + previouslyInsertedNode.length
  ) {
    newPage = insertIntoEndPreviouslyInsertedNode(content, page);
  }

  return newPage ? newPage : page;
}

function insertIntoEndPreviouslyInsertedNode(
  content: IContentInsert,
  page: IPageContent,
): IPageContent {
  // check buffer size
  if (
    content.content.length +
      page.buffers[page.buffers.length - 1].content.length <=
    MAX_BUFFER_LENGTH
  ) {
    // scenario 1: can fit inside the previous buffer
    // appends to the previous node
    // appends to the previous buffer
    const buffer: IBuffer = {
      ...page.buffers[page.buffers.length - 1],
    };
    const newContent = buffer.content + content.content;
    buffer.content = newContent;
    buffer.lineStarts = getLineStarts(newContent, page.newlineFormat);

    const node: INode = {
      ...page.nodes[page.nodes.length - 1],
      end: {
        line: buffer.lineStarts.length - 1,
        column:
          buffer.content.length -
          buffer.lineStarts[buffer.lineStarts.length - 1],
      },
    };
    node.length += content.content.length;

    const newPage: IPageContent = {
      ...page,
    };
    newPage.buffers[newPage.buffers.length - 1] = buffer;
    newPage.nodes[newPage.nodes.length - 1] = node;
    return newPage;
  } else {
    // scenario 2: cannot fit inside the previous buffer
    // creates a new node
    // creates a new buffer
  }
}
