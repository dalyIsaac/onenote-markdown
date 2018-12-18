import { Buffer, Color, Node, NodeMutable, PageContentMutable } from "../model";
import { leftRotate, rightRotate } from "./rotate";
import {
  findNodeAtOffset,
  getLineStarts,
  getNodeContent,
  NodePositionOffset,
  recomputeTreeMetadata,
  SENTINEL_INDEX,
} from "./tree";

/**
 * The desired content and offset for an insertion operation.
 */
export interface ContentInsert {
  readonly content: string;
  readonly offset: number;
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
): PageContentMutable {
  let previouslyInsertedNode: Node | undefined;

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
    insertAtEndPreviouslyInsertedNode(content, page, maxBufferLength);
  } else {
    const nodePosition = findNodeAtOffset(
      content.offset,
      page.nodes,
      page.root,
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
    fixInsert(page, page.nodes.length - 1);
  }
  return page;
}

/**
 * Restores the properties of a red-black tree after the insertion of a node.
 * @param page The page/piece table.
 * @param x The index of the node in the `node` array, which is the basis for fixing the tree.
 */
export function fixInsert(page: PageContentMutable, x: number): void {
  recomputeTreeMetadata(page, x);
  page.nodes[x] = { ...page.nodes[x] };

  if (x === page.root) {
    (page.nodes[x] as NodeMutable).color = Color.Black;
    return;
  }

  while (
    page.nodes[x].parent !== SENTINEL_INDEX &&
    page.nodes[page.nodes[x].parent].parent !== SENTINEL_INDEX &&
    x !== page.root &&
    page.nodes[page.nodes[x].parent].color === Color.Red
  ) {
    if (
      page.nodes[x].parent ===
      page.nodes[page.nodes[page.nodes[x].parent].parent].left
    ) {
      const y = page.nodes[page.nodes[page.nodes[x].parent].parent].right;
      page.nodes[y] = { ...page.nodes[y] };

      if (page.nodes[y].color === Color.Red) {
        page.nodes[page.nodes[x].parent] = {
          ...page.nodes[page.nodes[x].parent],
          color: Color.Black,
        };
        (page.nodes[y] as NodeMutable).color = Color.Black;
        page.nodes[page.nodes[page.nodes[x].parent].parent] = {
          ...page.nodes[page.nodes[page.nodes[x].parent].parent],
          color: Color.Red,
        };
        x = page.nodes[page.nodes[x].parent].parent;
        page.nodes[x] = { ...page.nodes[x] };
      } else {
        if (x === page.nodes[page.nodes[x].parent].right) {
          x = page.nodes[x].parent;
          page.nodes[x] = { ...page.nodes[x] };
          page = leftRotate(page, x);
        }
        page.nodes[page.nodes[x].parent] = {
          ...page.nodes[page.nodes[x].parent],
          color: Color.Black,
        };
        page.nodes[page.nodes[page.nodes[x].parent].parent] = {
          ...page.nodes[page.nodes[page.nodes[x].parent].parent],
          color: Color.Red,
        };
        page = rightRotate(page, page.nodes[page.nodes[x].parent].parent);
      }
    } else {
      const y = page.nodes[page.nodes[page.nodes[x].parent].parent].left;
      page.nodes[y] = {
        ...page.nodes[y],
      };
      if (page.nodes[y].color === Color.Red) {
        page.nodes[page.nodes[x].parent] = {
          ...page.nodes[page.nodes[x].parent],
          color: Color.Black,
        };
        (page.nodes[y] as NodeMutable).color = Color.Black;
        page.nodes[page.nodes[page.nodes[x].parent].parent] = {
          ...page.nodes[page.nodes[page.nodes[x].parent].parent],
          color: Color.Red,
        };
        x = page.nodes[page.nodes[x].parent].parent;
        page.nodes[x] = { ...page.nodes[x] };
      } else {
        if (
          page.nodes[x] === page.nodes[page.nodes[page.nodes[x].parent].left]
        ) {
          x = page.nodes[x].parent;
          page.nodes[x] = { ...page.nodes[x] };
          page = rightRotate(page, x);
        }
        page.nodes[page.nodes[x].parent] = {
          ...page.nodes[page.nodes[x].parent],
          color: Color.Black,
        };
        page.nodes[page.nodes[page.nodes[x].parent].parent] = {
          ...page.nodes[page.nodes[page.nodes[x].parent].parent],
          color: Color.Red,
        };
        page = leftRotate(page, page.nodes[page.nodes[x].parent].parent);
      }
    }
  }
  page.nodes[page.root] = {
    ...page.nodes[page.root],
    color: Color.Black,
  };
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
      isReadOnly: oldBuffer.isReadOnly,
      content: newContent,
      lineStarts: getLineStarts(newContent, page.newlineFormat),
    };

    const node: NodeMutable = {
      ...page.nodes[page.nodes.length - 1],
      end: {
        line: buffer.lineStarts.length - 1,
        column:
          buffer.content.length -
          buffer.lineStarts[buffer.lineStarts.length - 1],
      },
      lineFeedCount: buffer.lineStarts.length - 1,
    };
    node.length += content.content.length;

    page.buffers[page.buffers.length - 1] = buffer;
    page.nodes[page.nodes.length - 1] = node;
  } else {
    // scenario 2: cannot fit inside the previous buffer
    // creates a new node
    // creates a new buffer
    createNodeCreateBuffer(content, page);
  }
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

  const firstPartNode: Node = {
    ...oldNode,
    end: {
      line: firstPartLineStarts.length - 1 + oldNode.start.line,
      column:
        firstPartContent.length -
        firstPartLineStarts[firstPartLineStarts.length - 1] +
        oldNode.start.column,
    },
    length: firstPartContent.length,
    lineFeedCount: firstPartLineStarts.length - 1,
  };

  page.nodes[nodePosition.nodeIndex] = firstPartNode;

  const secondPartNode: Node = {
    bufferIndex: oldNode.bufferIndex,
    start: firstPartNode.end,
    end: oldNode.end,
    leftCharCount: 0,
    leftLineFeedCount: 0,
    length: oldNode.length - firstPartNode.length,
    lineFeedCount: oldNode.lineFeedCount - firstPartNode.lineFeedCount,
    color: Color.Red,
    parent: SENTINEL_INDEX,
    left: SENTINEL_INDEX,
    right: SENTINEL_INDEX,
  };

  insertNode(page, secondPartNode, content.offset);
  fixInsert(page, page.nodes.length - 1);
  insertAtNodeExtremity(content, page, maxBufferLength);
  page.previouslyInsertedNodeIndex = page.nodes.length - 1;
  page.previouslyInsertedNodeOffset = content.offset;
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
    isReadOnly: oldBuffer.isReadOnly,
    content: newContent,
    lineStarts: getLineStarts(newContent, page.newlineFormat),
  };
  const newNode: Node = {
    bufferIndex: page.buffers.length - 1,
    start: {
      line: oldBuffer.lineStarts.length - 1,
      column:
        oldBuffer.content.length -
        oldBuffer.lineStarts[oldBuffer.lineStarts.length - 1],
    },
    end: {
      line: updatedBuffer.lineStarts.length - 1,
      column:
        updatedBuffer.content.length -
        updatedBuffer.lineStarts[updatedBuffer.lineStarts.length - 1],
    },
    leftCharCount: 0,
    leftLineFeedCount: 0,
    length: content.content.length,
    lineFeedCount:
      updatedBuffer.lineStarts.length - oldBuffer.lineStarts.length,
    color: Color.Red,
    parent: SENTINEL_INDEX,
    left: SENTINEL_INDEX,
    right: SENTINEL_INDEX,
  };

  page.buffers[page.buffers.length - 1] = updatedBuffer;
  page.previouslyInsertedNodeIndex = page.nodes.length;
  page.previouslyInsertedNodeOffset = content.offset;
  insertNode(page, newNode, content.offset);
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
    isReadOnly: false,
    lineStarts: getLineStarts(content.content, page.newlineFormat),
    content: content.content,
  };
  const newNode: Node = {
    bufferIndex: page.buffers.length,
    start: { line: 0, column: 0 },
    end: {
      line: newBuffer.lineStarts.length - 1,
      column:
        newBuffer.content.length -
        newBuffer.lineStarts[newBuffer.lineStarts.length - 1],
    },
    leftCharCount: 0,
    leftLineFeedCount: 0,
    length: content.content.length,
    lineFeedCount: newBuffer.lineStarts.length - 1,
    color: Color.Red,
    parent: SENTINEL_INDEX,
    left: SENTINEL_INDEX,
    right: SENTINEL_INDEX,
  };
  page.previouslyInsertedNodeIndex = page.nodes.length;
  page.previouslyInsertedNodeOffset = content.offset;
  page.buffers.push(newBuffer);
  insertNode(page, newNode, content.offset);
}

/**
 * Modifies the metadata of nodes to "insert" a node. **The node should already exist inside `page.nodes`.**
 * @param page The page/piece table.
 * @param newNode Reference to the newly created node. The node already exists inside `page.nodes`.
 * @param offset The offset of the new node.
 */
export function insertNode(
  page: PageContentMutable,
  newNode: NodeMutable,
  offset: number,
): void {
  page.nodes.push(newNode);
  let prevIndex = SENTINEL_INDEX;

  let currentIndex = page.root;
  let currentNode = page.nodes[currentIndex];

  let nodeStartOffset = 0;
  const nodeIndex = page.nodes.length - 1; // the index of the new node

  while (currentIndex !== SENTINEL_INDEX) {
    prevIndex = currentIndex;
    if (offset <= nodeStartOffset + currentNode.leftCharCount) {
      // left
      prevIndex = currentIndex;
      currentIndex = currentNode.left;
      if (currentIndex === SENTINEL_INDEX) {
        page.nodes[prevIndex] = {
          ...page.nodes[prevIndex],
          left: nodeIndex,
        };
        newNode.parent = prevIndex; // can mutate the node since it's new
        return;
      }
      currentNode = page.nodes[currentIndex];
    } else if (
      offset >=
      nodeStartOffset + currentNode.leftCharCount + currentNode.length
    ) {
      // right
      nodeStartOffset += currentNode.leftCharCount + currentNode.length;
      prevIndex = currentIndex;
      currentIndex = currentNode.right;
      if (currentIndex === SENTINEL_INDEX) {
        page.nodes[prevIndex] = {
          ...page.nodes[prevIndex],
          right: nodeIndex,
        };
        newNode.parent = prevIndex; // can mutate the node since it's new
        return;
      }
      currentNode = page.nodes[currentIndex];
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
