import { Color, PageContentMutable } from "../pageModel";
import { SENTINEL_INDEX } from "../tree";
import { Buffer, ContentNode, ContentNodeMutable } from "./contentModel";
import { leftRotate, rightRotate } from "./rotate";
import {
  findNodeAtOffset,
  getLineStarts,
  getNodeContent,
  NodePositionOffset,
  recomputeTreeMetadata,
} from "./tree";

/**
 * The desired content and offset for an insertion operation.
 */
export interface ContentInsert {
  readonly content: string;
  readonly offset: number;
}

/**
 * Modifies the metadata of nodes to "insert" a node. **The node should already exist inside `page.nodes`.**
 * @param page The page/piece table.
 * @param newNode Reference to the newly created node. The node already exists inside `page.nodes`.
 * @param offset The offset of the new node.
 */
export function insertNode(
  page: PageContentMutable,
  newNode: ContentNodeMutable,
  offset: number,
): void {
  page.contentNodes.push(newNode);
  let prevIndex = SENTINEL_INDEX;

  let currentIndex = page.contentRoot;
  let currentNode = page.contentNodes[currentIndex];

  let nodeStartOffset = 0;
  const nodeIndex = page.contentNodes.length - 1; // the index of the new node

  while (currentIndex !== SENTINEL_INDEX) {
    prevIndex = currentIndex;
    if (offset <= nodeStartOffset + currentNode.leftCharCount) {
      // left
      prevIndex = currentIndex;
      currentIndex = currentNode.left;
      if (currentIndex === SENTINEL_INDEX) {
        page.contentNodes[prevIndex] = {
          ...page.contentNodes[prevIndex],
          left: nodeIndex,
        };
        newNode.parent = prevIndex; // can mutate the node since it's new
        return;
      }
      currentNode = page.contentNodes[currentIndex];
    } else if (
      offset >=
      nodeStartOffset + currentNode.leftCharCount + currentNode.length
    ) {
      // right
      nodeStartOffset += currentNode.leftCharCount + currentNode.length;
      prevIndex = currentIndex;
      currentIndex = currentNode.right;
      if (currentIndex === SENTINEL_INDEX) {
        page.contentNodes[prevIndex] = {
          ...page.contentNodes[prevIndex],
          right: nodeIndex,
        };
        newNode.parent = prevIndex; // can mutate the node since it's new
        return;
      }
      currentNode = page.contentNodes[currentIndex];
    } else {
      // middle
      throw RangeError(
        "Looking for the place to insert a node should never result in looking in the middle of another node.",
      );
    }
  }
  throw RangeError(
    "The currentIndex has reached a SENTINEL node before locating a suitable insertion location.",
  );
}

/**
 * Creates a new node, and creates a new buffer to contain the new content.
 * @param content The content to insert into the page.
 * @param page The page to insert the content into.
 */
function createNodeCreateBuffer(
  content: ContentInsert,
  page: PageContentMutable,
): void {
  const newBuffer: Buffer = {
    content: content.content,
    isReadOnly: false,
    lineStarts: getLineStarts(content.content, page.newlineFormat),
  };
  const newNode: ContentNode = {
    bufferIndex: page.buffers.length,
    color: Color.Red,
    end: {
      column:
        newBuffer.content.length -
        newBuffer.lineStarts[newBuffer.lineStarts.length - 1],
      line: newBuffer.lineStarts.length - 1,
    },
    left: SENTINEL_INDEX,
    leftCharCount: 0,
    leftLineFeedCount: 0,
    length: content.content.length,
    lineFeedCount: newBuffer.lineStarts.length - 1,
    parent: SENTINEL_INDEX,
    right: SENTINEL_INDEX,
    start: { column: 0, line: 0 },
  };
  page.previouslyInsertedContentNodeIndex = page.contentNodes.length;
  page.previouslyInsertedContentNodeOffset = content.offset;
  page.buffers.push(newBuffer);
  insertNode(page, newNode, content.offset);
}

/**
 * Creates a new node, and appends the content to an existing buffer.
 * @param content The content to insert into the page.
 * @param page The page to insert the content into.
 */
function createNodeAppendToBuffer(
  content: ContentInsert,
  page: PageContentMutable,
): void {
  const oldBuffer = page.buffers[page.buffers.length - 1];
  const newContent = oldBuffer.content + content.content;
  const updatedBuffer: Buffer = {
    content: newContent,
    isReadOnly: oldBuffer.isReadOnly,
    lineStarts: getLineStarts(newContent, page.newlineFormat),
  };
  const newNode: ContentNode = {
    bufferIndex: page.buffers.length - 1,
    color: Color.Red,
    end: {
      column:
        updatedBuffer.content.length -
        updatedBuffer.lineStarts[updatedBuffer.lineStarts.length - 1],
      line: updatedBuffer.lineStarts.length - 1,
    },
    left: SENTINEL_INDEX,
    leftCharCount: 0,
    leftLineFeedCount: 0,
    length: content.content.length,
    lineFeedCount:
      updatedBuffer.lineStarts.length - oldBuffer.lineStarts.length,
    parent: SENTINEL_INDEX,
    right: SENTINEL_INDEX,
    start: {
      column:
        oldBuffer.content.length -
        oldBuffer.lineStarts[oldBuffer.lineStarts.length - 1],
      line: oldBuffer.lineStarts.length - 1,
    },
  };

  page.buffers[page.buffers.length - 1] = updatedBuffer;
  page.previouslyInsertedContentNodeIndex = page.contentNodes.length;
  page.previouslyInsertedContentNodeOffset = content.offset;
  insertNode(page, newNode, content.offset);
}

/**
 * Inserts the given content into a page, by creating a node which is inserted either immediately before or after an
 * existing node.
 * @param content The content to insert into the page.
 * @param page The page to insert the content into.
 * @param maxBufferLength The maximum length of a buffer's content/string.
 */
function insertAtNodeExtremity(
  content: ContentInsert,
  page: PageContentMutable,
  maxBufferLength: number,
): void {
  // check buffer size
  if (
    content.content.length +
      page.buffers[page.buffers.length - 1].content.length <=
      maxBufferLength &&
    page.buffers[page.buffers.length - 1].isReadOnly === false
  ) {
    // scenario 3 and 5: it can fit inside the previous buffer
    // creates a new node
    // appends to the previous buffer
    createNodeAppendToBuffer(content, page);
  } else {
    // scenario 4 and 6: it cannot fit inside the previous buffer
    // creates a new node
    // creates a new buffer
    createNodeCreateBuffer(content, page);
  }
}

/**
 * Restores the properties of a red-black tree after the insertion of a node.
 * @param page The page/piece table.
 * @param x The index of the node in the `node` array, which is the basis for fixing the tree.
 */
export function fixInsert(page: PageContentMutable, x: number): void {
  recomputeTreeMetadata(page, x);
  page.contentNodes[x] = { ...page.contentNodes[x] };

  if (x === page.contentRoot) {
    (page.contentNodes[x] as ContentNodeMutable).color = Color.Black;
    return;
  }

  while (
    page.contentNodes[x].parent !== SENTINEL_INDEX &&
    page.contentNodes[page.contentNodes[x].parent].parent !== SENTINEL_INDEX &&
    x !== page.contentRoot &&
    page.contentNodes[page.contentNodes[x].parent].color === Color.Red
  ) {
    if (
      page.contentNodes[x].parent ===
      page.contentNodes[page.contentNodes[page.contentNodes[x].parent].parent]
        .left
    ) {
      const y =
        page.contentNodes[page.contentNodes[page.contentNodes[x].parent].parent]
          .right;
      page.contentNodes[y] = { ...page.contentNodes[y] };

      if (page.contentNodes[y].color === Color.Red) {
        page.contentNodes[page.contentNodes[x].parent] = {
          ...page.contentNodes[page.contentNodes[x].parent],
          color: Color.Black,
        };
        (page.contentNodes[y] as ContentNodeMutable).color = Color.Black;
        page.contentNodes[
          page.contentNodes[page.contentNodes[x].parent].parent
        ] = {
          ...page.contentNodes[
            page.contentNodes[page.contentNodes[x].parent].parent
          ],
          color: Color.Red,
        };
        x = page.contentNodes[page.contentNodes[x].parent].parent;
        page.contentNodes[x] = { ...page.contentNodes[x] };
      } else {
        if (x === page.contentNodes[page.contentNodes[x].parent].right) {
          x = page.contentNodes[x].parent;
          page.contentNodes[x] = { ...page.contentNodes[x] };
          leftRotate(page, x);
        }
        page.contentNodes[page.contentNodes[x].parent] = {
          ...page.contentNodes[page.contentNodes[x].parent],
          color: Color.Black,
        };
        page.contentNodes[
          page.contentNodes[page.contentNodes[x].parent].parent
        ] = {
          ...page.contentNodes[
            page.contentNodes[page.contentNodes[x].parent].parent
          ],
          color: Color.Red,
        };
        rightRotate(
          page,
          page.contentNodes[page.contentNodes[x].parent].parent,
        );
      }
    } else {
      const y =
        page.contentNodes[page.contentNodes[page.contentNodes[x].parent].parent]
          .left;
      page.contentNodes[y] = {
        ...page.contentNodes[y],
      };
      if (page.contentNodes[y].color === Color.Red) {
        page.contentNodes[page.contentNodes[x].parent] = {
          ...page.contentNodes[page.contentNodes[x].parent],
          color: Color.Black,
        };
        (page.contentNodes[y] as ContentNodeMutable).color = Color.Black;
        page.contentNodes[
          page.contentNodes[page.contentNodes[x].parent].parent
        ] = {
          ...page.contentNodes[
            page.contentNodes[page.contentNodes[x].parent].parent
          ],
          color: Color.Red,
        };
        x = page.contentNodes[page.contentNodes[x].parent].parent;
        page.contentNodes[x] = { ...page.contentNodes[x] };
      } else {
        if (
          page.contentNodes[x] ===
          page.contentNodes[page.contentNodes[page.contentNodes[x].parent].left]
        ) {
          x = page.contentNodes[x].parent;
          page.contentNodes[x] = { ...page.contentNodes[x] };
          rightRotate(page, x);
        }
        page.contentNodes[page.contentNodes[x].parent] = {
          ...page.contentNodes[page.contentNodes[x].parent],
          color: Color.Black,
        };
        page.contentNodes[
          page.contentNodes[page.contentNodes[x].parent].parent
        ] = {
          ...page.contentNodes[
            page.contentNodes[page.contentNodes[x].parent].parent
          ],
          color: Color.Red,
        };
        leftRotate(page, page.contentNodes[page.contentNodes[x].parent].parent);
      }
    }
  }
  page.contentNodes[page.contentRoot] = {
    ...page.contentNodes[page.contentRoot],
    color: Color.Black,
  };
}

/**
 * Inserts the given content into a page, inside a range which is currently encapsulated by an existing node.
 * @param content The content to insert into the page.
 * @param page The page to insert the content into.
 * @param maxBufferLength The maximum length of a buffer's content/string.
 * @param nodePosition Information about the node which contains the offset which the content is to be inserted at.
 */
function insertInsideNode(
  content: ContentInsert,
  page: PageContentMutable,
  maxBufferLength: number,
  nodePosition: NodePositionOffset,
): void {
  const oldNode = nodePosition.node;
  const nodeContent = getNodeContent(nodePosition.nodeIndex, page);
  const firstPartContent = nodeContent.slice(0, nodePosition.remainder);
  const firstPartLineStarts = getLineStarts(
    firstPartContent,
    page.newlineFormat,
  );

  const firstPartNode: ContentNode = {
    ...oldNode,
    end: {
      column:
        firstPartContent.length -
        firstPartLineStarts[firstPartLineStarts.length - 1] +
        oldNode.start.column,
      line: firstPartLineStarts.length - 1 + oldNode.start.line,
    },
    length: firstPartContent.length,
    lineFeedCount: firstPartLineStarts.length - 1,
  };

  page.contentNodes[nodePosition.nodeIndex] = firstPartNode;

  const secondPartNode: ContentNode = {
    bufferIndex: oldNode.bufferIndex,
    color: Color.Red,
    end: oldNode.end,
    left: SENTINEL_INDEX,
    leftCharCount: 0,
    leftLineFeedCount: 0,
    length: oldNode.length - firstPartNode.length,
    lineFeedCount: oldNode.lineFeedCount - firstPartNode.lineFeedCount,
    parent: SENTINEL_INDEX,
    right: SENTINEL_INDEX,
    start: firstPartNode.end,
  };

  insertNode(page, secondPartNode, content.offset);
  fixInsert(page, page.contentNodes.length - 1);
  insertAtNodeExtremity(content, page, maxBufferLength);
  page.previouslyInsertedContentNodeIndex = page.contentNodes.length - 1;
  page.previouslyInsertedContentNodeOffset = content.offset;
}

/**
 * Inserts the given content into a page, at the end of the previously inserted node.
 * @param content The content to insert into the page.
 * @param page The page to insert the content into.
 * @param maxBufferLength The maximum length of a buffer's content/string.
 */
function insertAtEndPreviouslyInsertedNode(
  content: ContentInsert,
  page: PageContentMutable,
  maxBufferLength: number,
): void {
  // check buffer size
  if (
    content.content.length +
      page.buffers[page.buffers.length - 1].content.length <=
    maxBufferLength
  ) {
    // scenario 1: can fit inside the previous buffer
    // appends to the previous node
    // appends to the previous buffer
    const oldBuffer = page.buffers[page.buffers.length - 1];
    const newContent = oldBuffer.content + content.content;
    const buffer: Buffer = {
      content: newContent,
      isReadOnly: oldBuffer.isReadOnly,
      lineStarts: getLineStarts(newContent, page.newlineFormat),
    };

    const node: ContentNodeMutable = {
      ...page.contentNodes[page.contentNodes.length - 1],
      end: {
        column:
          buffer.content.length -
          buffer.lineStarts[buffer.lineStarts.length - 1],
        line: buffer.lineStarts.length - 1,
      },
      lineFeedCount: buffer.lineStarts.length - 1,
    };
    node.length += content.content.length;

    page.buffers[page.buffers.length - 1] = buffer;
    page.contentNodes[page.contentNodes.length - 1] = node;
  } else {
    // scenario 2: cannot fit inside the previous buffer
    // creates a new node
    // creates a new buffer
    createNodeCreateBuffer(content, page);
  }
}

/**
 * Inserts the given content into a page.
 * @param content The content to insert into the page.
 * @param page The page to insert the content into.
 * @param maxBufferLength The maximum length of a buffer's content/string.
 */
export function insertContent(
  page: PageContentMutable,
  content: ContentInsert,
  maxBufferLength: number,
): void {
  let previouslyInsertedNode: ContentNode | undefined;

  if (
    page.previouslyInsertedContentNodeIndex != null &&
    page.previouslyInsertedContentNodeOffset != null
  ) {
    previouslyInsertedNode =
      page.contentNodes[page.previouslyInsertedContentNodeIndex];
  }

  if (
    previouslyInsertedNode !== undefined &&
    content.offset ===
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      page.previouslyInsertedContentNodeOffset! + previouslyInsertedNode.length
  ) {
    insertAtEndPreviouslyInsertedNode(content, page, maxBufferLength);
  } else {
    const nodePosition = findNodeAtOffset(
      content.offset,
      page.contentNodes,
      page.contentRoot,
    );
    if (
      nodePosition.nodeStartOffset < content.offset &&
      content.offset < nodePosition.nodeStartOffset + nodePosition.node.length
    ) {
      insertInsideNode(content, page, maxBufferLength, nodePosition);
    } else {
      insertAtNodeExtremity(content, page, maxBufferLength);
    }
  }

  if (page) {
    fixInsert(page, page.contentNodes.length - 1);
  }
}
