import { insertNode, fixInsert } from "../tree/insert";
import { Color, PageContent, RedBlackTree } from "../pageModel";
import {
  SENTINEL_INDEX,
  EMPTY_TREE_ROOT,
  NodePosition,
  prevNode,
} from "../tree/tree";
import { Buffer, ContentNode } from "./contentModel";
import {
  findNodeAtOffset,
  getLineStarts,
  getNodeContent,
  NodePositionOffset,
  updateContentTreeMetadata,
  getContentBetweenOffsets,
} from "./tree";
import { TagType, StructureNode } from "../structureTree/structureModel";
import { hasStartTag } from "../compiler/parser";
import { updateNodePairTag } from "../structureTree/tree";

/**
 * The desired content and offset for an insertion operation.
 */
export interface ContentInsert {
  content: string;
  offset: number;
}

/**
 * Creates a new node, and creates a new buffer to contain the new content.
 * @param content The content to insert into the page.
 * @param page The page to insert the content into.
 * @param indexToInsertAfter The index of the node to insert the new node after.
 */
function createNodeCreateBuffer(
  content: ContentInsert,
  page: PageContent,
  indexToInsertAfter?: number,
): void {
  const newBuffer: Buffer = {
    content: content.content,
    isReadOnly: false,
    lineStarts: getLineStarts(content.content),
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
  page.previouslyInsertedContentNodeIndex = page.content.nodes.length;
  page.previouslyInsertedContentNodeOffset = content.offset;
  page.buffers.push(newBuffer);
  insertNode(page.content, newNode, content.offset, indexToInsertAfter);
}

/**
 * Creates a new node, and appends the content to an existing buffer.
 * @param content The content to insert into the page.
 * @param page The page to insert the content into.
 * @param indexToInsertAfter The index of the node to insert the new node after.
 */
function createNodeAppendToBuffer(
  content: ContentInsert,
  page: PageContent,
  indexToInsertAfter?: number,
): void {
  const oldBuffer = page.buffers[page.buffers.length - 1];
  const newContent = oldBuffer.content + content.content;
  const updatedBuffer: Buffer = {
    content: newContent,
    isReadOnly: oldBuffer.isReadOnly,
    lineStarts: getLineStarts(newContent),
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
  page.previouslyInsertedContentNodeIndex = page.content.nodes.length;
  page.previouslyInsertedContentNodeOffset = content.offset;
  insertNode(page.content, newNode, content.offset, indexToInsertAfter);
}

/**
 * Inserts the given content into a page, by creating a node which is inserted
 * either immediately before or after an existing node.
 * @param content The content to insert into the page.
 * @param page The page to insert the content into.
 * @param maxBufferLength The maximum length of a buffer's content/string.
 */
function insertAtNodeExtremity(
  content: ContentInsert,
  page: PageContent,
  maxBufferLength: number,
  nodePosition?: NodePosition<ContentNode>,
): void {
  let indexToInsertAfter: number | undefined;
  if (nodePosition) {
    indexToInsertAfter = prevNode(page.content.nodes, nodePosition.index).index;
    if (indexToInsertAfter === 0) {
      indexToInsertAfter = undefined;
    }
  }
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
 * Inserts the given content into a page, inside a range which is currently
 * encapsulated by an existing node.
 * @param content The content to insert into the page.
 * @param page The page to insert the content into.
 * @param maxBufferLength The maximum length of a buffer's content/string.
 * @param nodePosition Information about the node which contains the offset
 * which the content is to be inserted at.
 */
function insertInsideNode(
  content: ContentInsert,
  page: PageContent,
  maxBufferLength: number,
  { node, nodeIndex, remainder }: NodePositionOffset,
): void {
  const nodeContent = getNodeContent(page, nodeIndex);
  const firstPartContent = nodeContent.slice(0, remainder);
  const firstPartLineStarts = getLineStarts(firstPartContent);

  const firstPartNode: ContentNode = {
    ...node,
    end: {
      column:
        firstPartContent.length -
        firstPartLineStarts[firstPartLineStarts.length - 1] +
        node.start.column,
      line: firstPartLineStarts.length - 1 + node.start.line,
    },
    length: firstPartContent.length,
    lineFeedCount: firstPartLineStarts.length - 1,
  };
  page.content.nodes[nodeIndex] = firstPartNode;

  const secondPartNode: ContentNode = {
    bufferIndex: node.bufferIndex,
    color: Color.Red,
    end: node.end,
    left: SENTINEL_INDEX,
    leftCharCount: 0,
    leftLineFeedCount: 0,
    length: node.length - firstPartNode.length,
    lineFeedCount: node.lineFeedCount - firstPartNode.lineFeedCount,
    parent: SENTINEL_INDEX,
    right: SENTINEL_INDEX,
    start: firstPartNode.end,
  };
  // Remove the length of the second part node from the parent's leftCharCount,
  // and similiarly with line feed
  updateContentTreeMetadata(
    page.content,
    nodeIndex,
    -secondPartNode.length,
    -secondPartNode.lineFeedCount,
  );

  insertNode(page.content, secondPartNode, content.offset);
  fixInsert(page.content, page.content.nodes.length - 1);
  insertAtNodeExtremity(content, page, maxBufferLength);
  page.previouslyInsertedContentNodeIndex = page.content.nodes.length - 1;
  page.previouslyInsertedContentNodeOffset = content.offset;
}

/**
 * Inserts the given content into a page, at the end of the previously
 * inserted node.
 * @param content The content to insert into the page.
 * @param page The page to insert the content into.
 * @param maxBufferLength The maximum length of a buffer's content/string.
 */
function insertAtEndPreviouslyInsertedNode(
  content: ContentInsert,
  page: PageContent,
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
      lineStarts: getLineStarts(newContent),
    };
    const node = page.content.nodes[page.content.nodes.length - 1];
    node.end = {
      column:
        buffer.content.length - buffer.lineStarts[buffer.lineStarts.length - 1],
      line: buffer.lineStarts.length - 1,
    };
    node.lineFeedCount = buffer.lineStarts.length - 1;
    node.length += content.content.length;
    page.buffers[page.buffers.length - 1] = buffer;
  } else {
    // scenario 2: cannot fit inside the previous buffer
    // creates a new node
    // creates a new buffer
    createNodeCreateBuffer(content, page);
  }
}

function convertBreakToParagraph(
  tree: RedBlackTree<StructureNode>,
  contentOffset: number,
  structureNodeIndex: number,
): void {
  const startNode = tree.nodes[structureNodeIndex];
  startNode.style = {
    marginBottom: "0pt",
    marginTop: "0pt",
  };
  startNode.tag = "p";
  startNode.tagType = TagType.StartTag;
  tree.nodes[structureNodeIndex] = startNode;
  const endNode: StructureNode = {
    color: Color.Red,
    id: tree.nodes[structureNodeIndex].id,
    left: SENTINEL_INDEX,
    leftSubTreeLength: 0,
    length: 0,
    parent: SENTINEL_INDEX,
    right: SENTINEL_INDEX,
    tag: "p",
    tagType: TagType.EndTag,
  };
  insertNode(tree, endNode, contentOffset, structureNodeIndex);
  fixInsert(tree, tree.nodes.length - 1);
}

/**
 * Inserts the given content into a page.
 * @param content The content to insert into the page.
 * @param page The page to insert the content into.
 * @param structureNodeIndex The index of the structure node in the
 * `structure.nodes` array.
 * @param maxBufferLength The maximum length of a buffer's content/string.
 * @param structureNodeOffset The starting offset of the structure node.
 */
export function insertContent(
  page: PageContent,
  content: ContentInsert,
  structureNodeIndex: number,
  maxBufferLength: number,
  structureNodeOffset?: number,
): void {
  const structureNode = page.structure.nodes[structureNodeIndex];
  if (structureNode.tag === "br") {
    convertBreakToParagraph(page.structure, content.offset, structureNodeIndex);
  }
  if (page.content.root === EMPTY_TREE_ROOT) {
    createNodeCreateBuffer(content, page);
    return;
  }
  let previouslyInsertedNode: ContentNode | undefined;

  if (
    page.previouslyInsertedContentNodeIndex !== null &&
    page.previouslyInsertedContentNodeOffset !== null
  ) {
    previouslyInsertedNode =
      page.content.nodes[page.previouslyInsertedContentNodeIndex];
  }

  if (
    previouslyInsertedNode !== undefined &&
    content.offset ===
      page.previouslyInsertedContentNodeOffset! + previouslyInsertedNode.length
  ) {
    insertAtEndPreviouslyInsertedNode(content, page, maxBufferLength);
  } else {
    const nodePosition = findNodeAtOffset(page.content, content.offset);
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
    fixInsert(page.content, page.content.nodes.length - 1);
  }
  if (structureNodeIndex !== SENTINEL_INDEX) {
    structureNode.length += content.content.length;
  }
  if (structureNodeOffset) {
    const hasStart = hasStartTag(
      getContentBetweenOffsets(
        page,
        structureNodeOffset,
        structureNodeOffset + structureNode.length,
      ),
    );
    if (hasStart) {
      updateNodePairTag(page, structureNodeIndex, hasStart.tag);
    }
  }
}
