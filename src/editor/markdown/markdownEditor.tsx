import React from "react";
import EditorBase from "../editorBase";
import styles from "./markdownEditor.module.css";
import { connect } from "react-redux";
import { PageContent } from "../../page/pageModel";
import { State } from "../../reducer";
import {
  StructureNode,
  TagType,
  isStructureNode,
} from "../../page/structureTree/structureModel";
import { inorderTreeTraversal } from "../../page/tree/tree";
import { getContentBetweenOffsets } from "../../page/contentTree/tree";

interface MarkdownEditorProps {
  page: PageContent;
  pageId: string;
}

interface StackItem {
  node: StructureNode;
  contentOffset: number;
}

type LastStackItem = StackItem & { stackIndex: number };

type Stack = Array<StackItem | JSX.Element>;

function getLastStartItem(stack: Stack): LastStackItem | null {
  for (let stackIndex = stack.length - 1; stackIndex >= 0; stackIndex--) {
    const { node, contentOffset } = stack[stackIndex] as StackItem;
    if (isStructureNode(node) && node.tagType === TagType.StartTag) {
      return { contentOffset, node, stackIndex };
    }
  }
  return null;
}

function updateItem(
  page: PageContent,
  stack: Stack,
  { contentOffset, node, stackIndex }: LastStackItem,
): Stack {
  const newStack = stack.slice(0, stackIndex);
  let children: Stack | string;
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
      contentOffset,
    },
    children,
  );
  newStack.push(element);
  return newStack;
}

function updateStack(page: PageContent, stack: Stack): Stack {
  const lastStartStackItem = getLastStartItem(stack);
  if (lastStartStackItem) {
    return updateItem(page, stack, lastStartStackItem);
  } else {
    throw new Error(
      "There's a mismatch between the number of start and end tags",
    );
  }
}

function getPage(page: PageContent): JSX.Element[] {
  let stack: Stack = [];
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

function MarkdownEditorComponent(props: MarkdownEditorProps): JSX.Element {
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
