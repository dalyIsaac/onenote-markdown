import React from "react";
import EditorBase, {
  Stack,
  getLastStartItem,
  LastStartNode,
} from "../editorBase";
import { PageContent } from "../../page/pageModel";
import {
  TagType,
  StructureNode,
} from "../../page/structureTree/structureModel";
import { getHtmlContentElementsFromPage } from "../../page/compiler/compiler";
import { connect } from "react-redux";
import { State } from "../../reducer";
import { Element, Item, isItem } from "../../page/compiler/customSyntaxPlugin";

interface HtmlEditorProps {
  page: PageContent;
  pageId: string;
}

interface StackItem {
  children: Element[];
  contentOffset: number;
  node: StructureNode;
}

type ChildStackItem = { node: Item } | string;

type ChildStack = Stack<ChildStackItem>;

function updateChildItem(
  stack: ChildStack,
  { stackIndex, node }: LastStartNode<ChildStackItem>,
): ChildStack {
  const newStack = stack.slice(0, stackIndex);
  const children: Stack<ChildStackItem> = stack.slice(stackIndex + 1);
  const props = node.style ? { style: node.style } : null;
  const element = React.createElement(node.tag, props, children);
  newStack.push(element);
  return newStack;
}

function updateChildStack(stack: ChildStack): ChildStack {
  const lastStart = getLastStartItem(stack);
  if (lastStart) {
    return updateChildItem(stack, lastStart);
  } else {
    throw new Error(
      "There's a mismatch between the number of start and end tags",
    );
  }
}

function createChildElements(children: Element[]): JSX.Element[] {
  let stack: ChildStack = [];
  for (const child of children) {
    if (isItem(child)) {
      switch (child.tagType) {
        case TagType.StartTag: {
          stack.push({ node: child });
          break;
        }
        case TagType.EndTag: {
          stack = updateChildStack(stack);
          break;
        }
        case TagType.StartEndTag: {
          break;
        }
      }
    } else {
      stack.push(child);
    }
  }
  return stack as JSX.Element[];
}

function updateItem(
  stack: Stack<StackItem>,
  { children, contentOffset, node, stackIndex }: LastStartNode<StackItem>,
): Stack<StackItem> {
  const newStack = stack.slice(0, stackIndex);
  const childElements: JSX.Element[] = createChildElements(children);
  const element = React.createElement(
    node.tag,
    {
      ...node.attributes,
      contentoffset: contentOffset,
      key: node.id,
      style: node.style,
    },
    childElements,
  );
  newStack.push(element);
  return newStack;
}

function updateStack(stack: Stack<StackItem>): Stack<StackItem> {
  const lastStartStackItem = getLastStartItem(stack);
  if (lastStartStackItem) {
    return updateItem(stack, lastStartStackItem);
  } else {
    throw new Error(
      "There's a mismatch between the number of start and end tags",
    );
  }
}

function getPage(page: PageContent): JSX.Element[] {
  let stack: Stack<StackItem> = [];
  let contentOffset = 0;
  for (const { children, node } of getHtmlContentElementsFromPage(page)) {
    switch (node.tagType) {
      case TagType.StartTag: {
        stack.push({ children, contentOffset, node });
        contentOffset += node.length;
        break;
      }
      case TagType.EndTag: {
        stack = updateStack(stack);
        break;
      }
      case TagType.StartEndTag:
        break;
    }
  }
  return stack as JSX.Element[];
}

export function HtmlEditorComponent(props: HtmlEditorProps): JSX.Element {
  return (
    <div>
      <EditorBase getPage={getPage} page={props.page} />
    </div>
  );
}

const mapStateToProps = (state: State): HtmlEditorProps => ({
  page: state.pages[state.selectedPage],
  pageId: state.selectedPage,
});

export default connect(mapStateToProps)(HtmlEditorComponent);
