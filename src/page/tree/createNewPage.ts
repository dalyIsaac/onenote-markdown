import { OnenotePage } from "@microsoft/microsoft-graph-types";
import { Color, IBuffer, INode, IPageContent } from "../model";
import { SENTINEL_INDEX } from "../reducer";
import { createNewBufferCursors, getLineStarts, getNewline } from "./tree";

/**
 * Creates a new page, and its associated piece table.
 * @param receivedPage The received page from the Microsoft Graph.
 */
export function createNewPage(receivedPage: OnenotePage): IPageContent {
  const newlineFormat = getNewline(receivedPage.content);
  const originalBuffer: IBuffer = {
    isReadOnly: true,
    lineStarts: getLineStarts(receivedPage.content, newlineFormat),
    content: receivedPage.content,
  };
  const finalLine = originalBuffer.lineStarts.length - 1;
  const finalLineInitialCharIndex = originalBuffer.lineStarts[finalLine];
  const finalCharColumn =
    receivedPage.content.length - finalLineInitialCharIndex;
  const { start, end } = createNewBufferCursors(
    0,
    0,
    finalCharColumn,
    finalLine,
  );
  const node: INode = {
    bufferIndex: 0,
    start,
    end,
    leftCharCount: 0,
    leftLineFeedCount: 0,
    length: receivedPage.content.length,
    lineFeedCount: originalBuffer.lineStarts.length,
    color: Color.Black,
    parent: SENTINEL_INDEX,
    left: SENTINEL_INDEX,
    right: SENTINEL_INDEX,
  };
  return {
    buffers: [originalBuffer],
    newlineFormat,
    nodes: [node],
    root: 0,
    previouslyInsertedNodeIndex: null,
    previouslyInsertedNodeOffset: null,
  };
}
