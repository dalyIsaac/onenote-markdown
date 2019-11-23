import { fixInsert, insertAfterNode, insertBeforeNode } from "../tree/insert";
import { Color, PageContent } from "../pageModel";
import { SENTINEL_INDEX, EMPTY_TREE_ROOT } from "../tree/tree";
import { Buffer, ContentNode } from "./contentModel";
import {
  getLineStarts,
  getNodeContent,
  updateContentTreeMetadata,
} from "./tree";
import { InsertContentDOM } from "./actions";
import { insertStructureNode } from "../structureTree/insert";
import { generateNewId } from "../structureTree/tree";
import { TagType } from "../structureTree/structureModel";

/**
 * Creates a new node, and creates a new buffer to contain the new content.
 * @param action The insert action.
 * @param page The page to insert the content into.
 */
function createNodeCreateBuffer(
  action: InsertContentDOM,
  page: PageContent,
): void {
  const newBuffer: Buffer = {
    content: action.content,
    isReadOnly: false,
    lineStarts: getLineStarts(action.content),
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
    length: action.content.length,
    lineFeedCount: newBuffer.lineStarts.length - 1,
    parent: SENTINEL_INDEX,
    right: SENTINEL_INDEX,
    start: { column: 0, line: 0 },
  };
  page.previouslyInsertedContentNodeIndex = page.content.nodes.length;
  page.previouslyInsertedContentNodeOffset = action.content.length;
  page.buffers.push(newBuffer);
  if (action.localOffset === 0) {
    insertBeforeNode(page.content, newNode, action.start.nodeIndex);
  } else {
    insertAfterNode(page.content, newNode, action.end.nodeIndex);
  }
}

/**
 * Creates a new node, and appends the content to an existing buffer.
 * @param action The insert action.
 * @param page The page to insert the content into.
 */
function createNodeAppendToBuffer(
  action: InsertContentDOM,
  page: PageContent,
): void {
  const oldBuffer = page.buffers[page.buffers.length - 1];
  const newContent = oldBuffer.content + action.content;
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
    length: action.content.length,
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
  page.previouslyInsertedContentNodeOffset = newNode.length;
  if (action.localOffset === 0) {
    insertBeforeNode(page.content, newNode, action.start.nodeIndex);
  } else {
    insertAfterNode(page.content, newNode, action.end.nodeIndex);
  }
}

/**
 * Inserts the given content into a page, by creating a node which is inserted
 * either immediately before or after an existing node.
 * @param action The insert action.
 * @param page The page to insert the content into.
 * @param maxBufferLength The maximum length of a buffer's content/string.
 */
function insertAtNodeExtremity(
  action: InsertContentDOM,
  page: PageContent,
  maxBufferLength: number,
): void {
  // check buffer size
  if (
    action.content.length +
      page.buffers[page.buffers.length - 1].content.length <=
      maxBufferLength &&
    page.buffers[page.buffers.length - 1].isReadOnly === false
  ) {
    // scenario 3 and 5: it can fit inside the previous buffer
    // creates a new node
    // appends to the previous buffer
    createNodeAppendToBuffer(action, page);
  } else {
    // scenario 4 and 6: it cannot fit inside the previous buffer
    // creates a new node
    // creates a new buffer
    createNodeCreateBuffer(action, page);
  }
}

/**
 * Inserts the given content into a page, inside a range which is currently
 * encapsulated by an existing node.
 * @param action The insert action.
 * @param page The page to insert the content into.
 * @param maxBufferLength The maximum length of a buffer's content/string.
 */
function insertInsideNode(
  action: InsertContentDOM,
  page: PageContent,
  maxBufferLength: number,
): void {
  const node = page.content.nodes[action.start.nodeIndex];
  const nodeContent = getNodeContent(page, action.start.nodeIndex);
  const firstPartContent = nodeContent.slice(0, action.localOffset);
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
  page.content.nodes[action.start.nodeIndex] = firstPartNode;

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
    action.start.nodeIndex,
    -secondPartNode.length,
    -secondPartNode.lineFeedCount,
  );

  insertAfterNode(page.content, secondPartNode, action.end.nodeIndex);
  fixInsert(page.content, page.content.nodes.length - 1);
  insertAtNodeExtremity(action, page, maxBufferLength);
  page.previouslyInsertedContentNodeIndex = page.content.nodes.length - 1;
  page.previouslyInsertedContentNodeOffset = action.content.length;
}

/**
 * Inserts the given content into a page, at the end of the previously
 * inserted node.
 * @param action The insert action.
 * @param page The page to insert the content into.
 * @param maxBufferLength The maximum length of a buffer's content/string.
 */
function insertAtEndPreviouslyInsertedNode(
  action: InsertContentDOM,
  page: PageContent,
  maxBufferLength: number,
): void {
  // check buffer size
  if (
    action.content.length +
      page.buffers[page.buffers.length - 1].content.length <=
    maxBufferLength
  ) {
    // scenario 1: can fit inside the previous buffer
    // appends to the previous node
    // appends to the previous buffer
    const oldBuffer = page.buffers[page.buffers.length - 1];
    const newContent = oldBuffer.content + action.content;
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
    node.length += action.content.length;
    page.buffers[page.buffers.length - 1] = buffer;
  } else {
    // scenario 2: cannot fit inside the previous buffer
    // creates a new node
    // creates a new buffer
    createNodeCreateBuffer(action, page);
  }
}

// function convertBreakToParagraph(
//   tree: RedBlackTree<StructureNode>,
//   contentOffset: number,
//   structureNodeIndex: number,
// ): void {
//   const startNode = tree.nodes[structureNodeIndex];
//   startNode.style = {
//     marginBottom: "0pt",
//     marginTop: "0pt",
//   };
//   startNode.tag = "p";
//   startNode.tagType = TagType.StartTag;
//   tree.nodes[structureNodeIndex] = startNode;
//   const endNode: StructureNode = {
//     color: Color.Red,
//     id: tree.nodes[structureNodeIndex].id,
//     left: SENTINEL_INDEX,
//     leftSubTreeLength: 0,
//     length: 0,
//     parent: SENTINEL_INDEX,
//     right: SENTINEL_INDEX,
//     tag: "p",
//     tagType: TagType.EndTag,
//   };
//   insertNode(tree, endNode, contentOffset, structureNodeIndex);
//   fixInsert(tree, tree.nodes.length - 1);
// }

/**
 * Inserts the given content into a page.
 * @param action The insert action.
 * @param page The page to insert the content into.
 * @param maxBufferLength The maximum length of a buffer's content/string.
 * @param updateStructureNode If `true` when the
 * `page.content.root === EMPTY_TREE_ROOT`, then inserts structure nodes.
 * Otherwise, if `true`, the length of the corresponding structure is updated.
 * This exists because some callers will alter the structure lengths or insert
 * structure nodesthemselves.
 */
export function insertContentDOM(
  page: PageContent,
  action: InsertContentDOM,
  maxBufferLength: number,
  updateStructureNode = false,
): void {
  if (page.content.root === EMPTY_TREE_ROOT) {
    createNodeCreateBuffer(action, page);
    page.content.root = 1;
    const contentNode = page.content.nodes[1];
    contentNode.color = Color.Black;
    contentNode.left = SENTINEL_INDEX;
    contentNode.parent = SENTINEL_INDEX;
    contentNode.right = SENTINEL_INDEX;
    if (updateStructureNode) {
      insertStructureNode(page, {
        id: generateNewId("p"),
        length: action.content.length,
        offset: 0,
        tag: "p",
        tagType: TagType.StartTag,
      });
      insertStructureNode(page, {
        id: generateNewId("p"),
        insertAfterNode: page.content.root,
        length: action.content.length,
        offset: 0,
        tag: "p",
        tagType: TagType.EndTag,
      });
    }
    return;
  }
  let previouslyInsertedNode: ContentNode | undefined;

  if (
    page.previouslyInsertedContentNodeIndex !== null &&
    page.previouslyInsertedContentNodeOffset !== null &&
    page.previouslyInsertedContentNodeIndex === action.start.nodeIndex
  ) {
    previouslyInsertedNode =
      page.content.nodes[page.previouslyInsertedContentNodeIndex];
  }

  if (
    previouslyInsertedNode !== undefined &&
    action.localOffset === previouslyInsertedNode.length
  ) {
    insertAtEndPreviouslyInsertedNode(action, page, maxBufferLength);
  } else {
    const node = page.content.nodes[action.start.nodeIndex];
    if (action.localOffset > 0 && action.localOffset < node.length) {
      insertInsideNode(action, page, maxBufferLength);
    } else {
      insertAtNodeExtremity(action, page, maxBufferLength);
    }
  }
  if (updateStructureNode && action.structureNodeIndex !== SENTINEL_INDEX) {
    page.structure.nodes[action.structureNodeIndex].length +=
      action.content.length;
  }
  fixInsert(page.content, page.content.nodes.length - 1);
}
