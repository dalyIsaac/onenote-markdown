import React from "react";
import EditorBase, {
  Stack,
  getLastStartItem,
  LastStartNode,
  BasicNode,
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
import { alea } from "seedrandom";
import stringify from "safe-stable-stringify";

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

interface KeyGenerators {
  [key: string]: () => number;
}

/**
 * Generates a unique number given the generator and the set of existing
 * numbers.
 * @param gen The random number generator.
 * @param existingNumbers A set containing numbers which already exist inside
 * the array as prior keys.
 */
function getUniqueKey(gen: () => number, existingNumbers: Set<number>): number {
  let value = gen();
  while (existingNumbers.has(value)) {
    value = gen();
  }
  return value;
}

/**
 * Generates a unique stable key for the child item inside the array.
 *
 * It works by first stringifying the properties of the node. If the generated
 * string already exists `keyGens`, then it retrieves the generator, and
 * passes it to `getUniqueKey`. If the generated string does not already exist,
 * inside `keyGens`, then a new generator is created with the generated string
 * as the seed.
 *
 * @param node The node which is the "seed" for the random number generator.
 * @param existingNumbers A set containing numbers which already exist inside
 * the array as prior keys.
 * @param keyGens Object/dictionary of keys, and their associated keys.
 */
function getKey(
  node: BasicNode | (Item & BasicNode),
  existingNumbers: Set<number>,
  keyGens: KeyGenerators,
): number {
  const propString = stringify(node);
  if (!(propString in keyGens)) {
    keyGens[propString] = alea(propString);
  }
  return getUniqueKey(keyGens[propString], existingNumbers);
}

function updateChildItem(
  stack: ChildStack,
  { stackIndex, node }: LastStartNode<ChildStackItem>,
  existingNumbers: Set<number>,
  keyGens: KeyGenerators,
): ChildStack {
  const newStack = stack.slice(0, stackIndex);
  const children: Stack<ChildStackItem> = stack.slice(stackIndex + 1);
  const key = getKey(node, existingNumbers, keyGens);
  const props = node.style ? { key, style: node.style } : { key };
  const element = React.createElement(node.tag, props, children);
  newStack.push(element);
  return newStack;
}

function updateChildStack(
  stack: ChildStack,
  randomNumbers: Set<number>,
  keyGens: KeyGenerators,
): ChildStack {
  const lastStart = getLastStartItem(stack);
  if (lastStart) {
    return updateChildItem(stack, lastStart, randomNumbers, keyGens);
  } else {
    throw new Error(
      "There's a mismatch between the number of start and end tags",
    );
  }
}

function createChildElements(children: Element[]): JSX.Element[] {
  let stack: ChildStack = [];
  const randomNumbers: Set<number> = new Set();
  const keyGens: KeyGenerators = {};
  for (const child of children) {
    if (isItem(child)) {
      switch (child.tagType) {
        case TagType.StartTag: {
          stack.push({ node: child });
          break;
        }
        case TagType.EndTag: {
          stack = updateChildStack(stack, randomNumbers, keyGens);
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
