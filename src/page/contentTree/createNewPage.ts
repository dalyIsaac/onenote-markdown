import { OnenotePage } from "@microsoft/microsoft-graph-types";
import { Color, PageContent } from "../pageModel";
import { SENTINEL_STRUCTURE } from "../structureTree/tree";
import { SENTINEL_INDEX } from "../tree";
import { Buffer, ContentNode } from "./contentModel";
import { getLineStarts, getNewlineFormat, SENTINEL_CONTENT } from "./tree";

/**
 * Creates a new page, and its associated piece table.
 * @param receivedPage The received page from the Microsoft Graph.
 */
export function createNewPage(receivedPage: OnenotePage): PageContent {
  const newlineFormat = getNewlineFormat(receivedPage.content);
  const buffer: Buffer = {
    content: receivedPage.content,
    isReadOnly: true,
    lineStarts: getLineStarts(receivedPage.content, newlineFormat),
  };
  const finalLine = buffer.lineStarts.length - 1;
  const finalLineInitialCharIndex = buffer.lineStarts[finalLine];
  const finalCharColumn =
    receivedPage.content.length - finalLineInitialCharIndex;
  const node: ContentNode = {
    bufferIndex: 0,
    color: Color.Black,
    end: { column: finalCharColumn, line: finalLine },
    left: SENTINEL_INDEX,
    leftCharCount: 0,
    leftLineFeedCount: 0,
    length: receivedPage.content.length,
    lineFeedCount: buffer.lineStarts.length,
    parent: SENTINEL_INDEX,
    right: SENTINEL_INDEX,
    start: { column: 0, line: 0 },
  };
  return {
    buffers: [buffer],
    contentNodes: [SENTINEL_CONTENT, node],
    contentRoot: 0,
    newlineFormat,
    previouslyInsertedContentNodeIndex: null,
    previouslyInsertedContentNodeOffset: null,
    structureNodes: [SENTINEL_STRUCTURE],
    structureRoot: SENTINEL_INDEX,
  };
}
