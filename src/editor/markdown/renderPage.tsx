import React from "react";
import {
  Stack,
  LastStartNode,
  getLastStartItem,
  CONTENT_OFFSET,
  NODE_INDEX,
} from "../editorBase";
import { PageContent } from "../../page/pageModel";
import {
  StructureNode,
  TagType,
} from "../../page/structureTree/structureModel";
import { inorderTreeTraversal } from "../../page/tree/tree";
import { getContentBetweenOffsets } from "../../page/contentTree/tree";

/**
 * Definition for items which reside on the stack of elements to be rendered.
 */
interface StackItem {
  node: StructureNode;
  /**
   * The offset of the start of the content for the `StructureNode`.
   */
  contentOffset: number;
  /**
   * The index of the `node` inside the array `structure.nodes`.
   */
  index: number;
}

const cursorSelection: {
  nodeIndex: number;
  selectionOffset: number;
} | null = null;

const selectionRef = React.createRef();

/**
 * Updates the stack by compiling the last `StackItem` which has a
 * `tagType === TagType.StartTag` is compiled, with all the elements on the
 * stack after the last start tag being children.
 * @param stack The stack of `StackItem`s.
 * @param lastStartNode The last `StackItem`, which has
 * `tagType === TagType.StartTag`.
 */
function updateItem(
  page: PageContent,
  stack: Stack<StackItem>,
  { contentOffset, index, node, stackIndex }: LastStartNode<StackItem>,
): Stack<StackItem> {
  const newStack = stack.slice(0, stackIndex);
  let children: Stack<StackItem> | string;
  if (stackIndex === stack.length - 1) {
    const startOffset = contentOffset;
    const endOffset = contentOffset + node.length;
    children = getContentBetweenOffsets(page, startOffset, endOffset);
  } else {
    children = stack.slice(stackIndex);
  }
  const ref =
    cursorSelection && cursorSelection.nodeIndex === index
      ? selectionRef
      : null;
  const element = React.createElement(
    "p",
    {
      ...node.attributes,
      [CONTENT_OFFSET]: contentOffset,
      [NODE_INDEX]: index,
      key: node.id,
      ref,
    },
    children,
  );
  newStack.push(element);
  return newStack;
}

/**
 * Returns the updated stack. The last `StackItem` which has a
 * `tagType === TagType.StartTag` is compiled, with all the elements on the
 * stack after the last start tag being children.
 */
function updateStack(
  page: PageContent,
  stack: Stack<StackItem>,
): Stack<StackItem> {
  const lastStartStackItem = getLastStartItem(stack);
  if (lastStartStackItem) {
    return updateItem(page, stack, lastStartStackItem);
  } else {
    throw new Error(
      "There's a mismatch between the number of start and end tags",
    );
  }
}

/**
 * Adds a React element for a `StartEnd` tag.
 */
function addStartEndTag<T>(
  stack: Stack<T>,
  node: StructureNode,
  nodeIndex: number,
  contentOffset: number,
): void {
  switch (node.tag) {
    case "br": {
      const ref =
        cursorSelection && cursorSelection.nodeIndex === nodeIndex
          ? selectionRef
          : null;
      const props = {
        [NODE_INDEX]: nodeIndex,
        contentoffset: contentOffset,
        isbreak: "true",
        key: node.id,
        ref,
      };
      stack.push(React.createElement("p", props, <br />));
      break;
    }
    default:
      break;
  }
}

/**
 * Returns a `JSX.Element[]` of the OneNote page.
 * @param page The page to render.
 */
export default function renderPage(page: PageContent): JSX.Element[] {
  let stack: Stack<StackItem> = [];
  let contentOffset = 0;
  for (const { index, node } of inorderTreeTraversal(page.structure)) {
    switch (node.tagType) {
      case TagType.StartTag: {
        stack.push({ contentOffset, index, node });
        contentOffset += node.length;
        break;
      }
      case TagType.EndTag: {
        stack = updateStack(page, stack);
        break;
      }
      case TagType.StartEndTag: {
        addStartEndTag(stack, node, index, contentOffset);
        break;
      }
    }
  }
  return stack as JSX.Element[];
}
