import { OnenotePage } from "@microsoft/microsoft-graph-types";
import { IAction } from "../common";
import { IStoreReceivedPageAction, STORE_RECEIVED_PAGE } from "./actions";
import {
  CharValues,
  Color,
  IBuffer,
  IBufferCursor,
  INode,
  IPageContent,
  IStatePages,
  NEWLINE,
} from "./model";

export const SENTINEL_INDEX = -1;
export const SENTINEL: INode = {
  bufferIndex: -1,
  start: { column: -1, line: -1 },
  end: { column: -1, line: -1 },
  leftCharCount: -1,
  leftLineFeedCount: -1,
  length: -1,
  lineFeedCount: -1,
  color: Color.Black,
  parent: SENTINEL_INDEX,
  left: SENTINEL_INDEX,
  right: SENTINEL_INDEX,
};

/**
 * Reducer for the slice of the state referring to the storage of a page.
 * @param state
 * @param action
 */
export default function pageReducer(state: IStatePages = {}, action: IAction) {
  switch (action.type) {
    case STORE_RECEIVED_PAGE:
      const receivedPage = (action as IStoreReceivedPageAction).receivedPage;
      const newPage = createNewPage(receivedPage);
      state[receivedPage.id as string] = newPage;
      return state;
    default:
      return state;
  }
}

/**
 * Creates a new page, and its associated piece table.
 * @param receivedPage The received page from the Microsoft Graph.
 */
export function createNewPage(receivedPage: OnenotePage): IPageContent {
  const newlineFormat = getNewline(receivedPage.content);
  const originalBuffer: IBuffer = {
    isReadOnly: true,
    lineStarts: getLineStarts(receivedPage.content, newlineFormat),
    value: receivedPage.content,
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
  };
}

/**
 * Creates the start and end buffer cursors.
 * @param startColumn The column of the start buffer.
 * @param startLine The line of the start buffer.
 * @param endColumn The column of the end buffer.
 * @param endLine The line of the end buffer.
 */
function createNewBufferCursors(
  startColumn: number,
  startLine: number,
  endColumn: number,
  endLine: number,
): { end: IBufferCursor; start: IBufferCursor } {
  return {
    start: {
      column: startColumn,
      line: startLine,
    },
    // tslint:disable-next-line:object-literal-sort-keys
    end: {
      column: endColumn,
      line: endLine,
    },
  };
}

/**
 * Checks the first 100 characters of a OneNote page to find what newline format is used. If it can't determine what
 * format is used within the first 100 lines, it assumes that LF is used.
 * @param content The HTML content of a OneNote page.
 */
function getNewline(content: string): CharValues[] {
  for (let i = 0; i < 100; i++) {
    if (content.charCodeAt(i) === CharValues.LF) {
      return NEWLINE.LF;
    } else if (content.charCodeAt(i) === CharValues.CR) {
      if (
        i + 1 < content.length &&
        content.charCodeAt(i + 1) === CharValues.LF
      ) {
        return NEWLINE.CRLF;
      }
    }
  }
  return NEWLINE.LF;
}

/**
 * Gets an array of the indices of the line starts.
 * @param content The HTML content of a OneNote page.
 * @param newline The newline format for the OneNote page, as determined by the getNewline function.
 */
function getLineStarts(content: string, newline: CharValues[]): number[] {
  const lineStarts: number[] = [0];

  for (let i = 0; i + newline.length - 1 <= content.length; i++) {
    let match = true;
    for (let j = 0; j < newline.length && match; j++) {
      if (content.charCodeAt(i + j) !== newline[j]) {
        match = false;
      } else if (j === newline.length - 1) {
        lineStarts.push(i + newline.length);
      }
    }
  }

  return lineStarts;
}
