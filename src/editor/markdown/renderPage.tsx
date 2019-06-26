import React from "react";
import {
  Stack,
  LastStartNode,
  getLastStartItem,
  CONTENT_OFFSET,
  STRUCTURE_NODE_INDEX,
} from "../editorBase";
import { PageContent } from "../../page/pageModel";
import {
  StructureNode,
  TagType,
} from "../../page/structureTree/structureModel";
import { inorderTreeTraversal } from "../../page/tree/tree";
import { getContentBetweenOffsets } from "../../page/contentTree/tree";
import { cursor } from "./markdownEditor";

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
  structureNodeIndex: number;
}

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
  {
    contentOffset,
    structureNodeIndex: index,
    node,
    stackIndex,
  }: LastStartNode<StackItem>,
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
  const element = React.createElement(
    "p",
    {
      ...node.attributes,
      [CONTENT_OFFSET]: contentOffset,
      [STRUCTURE_NODE_INDEX]: index,
      key: node.id,
      ref: cursor.createRef(node, contentOffset),
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
      const props = {
        [STRUCTURE_NODE_INDEX]: nodeIndex,
        contentoffset: contentOffset,
        isbreak: "true",
        key: node.id,
        ref: cursor.createRef(node, contentOffset),
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
        stack.push({ contentOffset, node, structureNodeIndex: index });
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
      default:
        break;
    }
  }
  return stack as JSX.Element[];
}
