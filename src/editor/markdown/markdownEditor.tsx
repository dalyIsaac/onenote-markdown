import React from "react";
import EditorBase, {
  Stack,
  LastStartNode,
  getLastStartItem,
} from "../editorBase";
import styles from "./markdownEditor.module.css";
import { connect } from "react-redux";
import { PageContent } from "../../page/pageModel";
import { State } from "../../reducer";
import {
  StructureNode,
  TagType,
} from "../../page/structureTree/structureModel";
import { inorderTreeTraversal } from "../../page/tree/tree";
import { getContentBetweenOffsets } from "../../page/contentTree/tree";

/**
 * Props for the `MarkdownEditorComponent`
 */
interface MarkdownEditorProps {
  page: PageContent;
  pageId: string;
}

/**
 * Definition for items which reside on the stack of elements to be rendered.
 */
interface StackItem {
  node: StructureNode;

  /**
   * The offset of the start of the content for the `StructureNode`.
   */
  contentOffset: number;
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
  { contentOffset, node, stackIndex }: LastStartNode<StackItem>,
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
      contentoffset: contentOffset,
      key: node.id,
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
 * Returns a `JSX.Element[]` of the OneNote page.
 * @param page The page to render.
 */
function getPage(page: PageContent): JSX.Element[] {
  let stack: Stack<StackItem> = [];
  let contentOffset = 0;
  for (const { node } of inorderTreeTraversal(page.structure)) {
    switch (node.tagType) {
      case TagType.StartTag: {
        stack.push({ contentOffset, node });
        contentOffset += node.length;
        break;
      }
      case TagType.EndTag: {
        stack = updateStack(page, stack);
        break;
      }
      case TagType.StartEndTag:
        break;
    }
  }
  return stack as JSX.Element[];
}

export function MarkdownEditorComponent(
  props: MarkdownEditorProps,
): JSX.Element {
  return (
    <div className={styles.editor}>
      <EditorBase getPage={getPage} page={props.page} />
    </div>
  );
}

const mapStateToProps = (state: State): MarkdownEditorProps => ({
  page: state.pages[state.selectedPage],
  pageId: state.selectedPage,
});

export default connect(mapStateToProps)(MarkdownEditorComponent);
