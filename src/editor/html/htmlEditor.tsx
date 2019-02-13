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
import {
  Element,
  TagItem,
  isTagItem,
} from "../../page/compiler/customSyntaxPlugin";
import { alea } from "seedrandom";
import stringify from "safe-stable-stringify";

/**
 * Props for the `HtmlEditorComponent`
 */
interface HtmlEditorProps {
  page: PageContent;
  pageId: string;
}

/**
 * Definition for items which reside on the stack of `StructureNode`s to render.
 */
interface StructureStackItem {
  /**
   * Children of this `StructureStackItem`.
   */
  children: Element[];

  /**
   * The offset of the start of the content of this `StructureStackItem`, and
   * the `StructureNode` which it holds.
   */
  contentOffset: number;

  /**
   * The actual `StructureNode`.
   */
  node: StructureNode;
}

/**
 * Definition for items which reside on the stack of children for a
 * `StructureNode`.
 */
type ChildStackItem = { node: TagItem } | string;

/**
 * Definition of the key value pairs of key generators and their associated
 * seed.
 */
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
 * @param keyGens Object/dictionary of keys, and their associated keys/seeds.
 */
function getKey(
  node: BasicNode | (TagItem & BasicNode),
  existingNumbers: Set<number>,
  keyGens: KeyGenerators,
): number {
  const propString = stringify(node);
  if (!(propString in keyGens)) {
    keyGens[propString] = alea(propString);
  }
  return getUniqueKey(keyGens[propString], existingNumbers);
}

/**
 * Updates the stack by compiling the last `StructureStackItem` which has a
 * `tagType === TagType.StartTag` is compiled, with all the elements on the
 * stack after the last start tag being children.
 * @param stack The stack of `StructureStackItem`s.
 * @param lastStartNode The last `ChildStackItem`, which has
 * `tagType === TagType.StartTag`.
 * @param existingNumbers A set containing numbers which already exist inside
 * the array as prior keys.
 * @param keyGens Object/dictionary of keys, and their associated keys/seeds.
 */
function updateChildItem(
  stack: Stack<ChildStackItem>,
  { stackIndex, node }: LastStartNode<ChildStackItem>,
  existingNumbers: Set<number>,
  keyGens: KeyGenerators,
): Stack<ChildStackItem> {
  const newStack = stack.slice(0, stackIndex);
  const children: Stack<ChildStackItem> = stack.slice(stackIndex + 1);
  const key = getKey(node, existingNumbers, keyGens);
  const props = node.style ? { key, style: node.style } : { key };
  const element = React.createElement(node.tag, props, children);
  newStack.push(element);
  return newStack;
}

/**
 * Updates the stack by compiling the last `ChildStackItem` which has a
 * `tagType === TagType.StartTag` is compiled, with all the elements on the
 * stack after the last start tag being children.
 * @param stack The stack of `ChildStackItem`s.
 * @param existingNumbers A set containing numbers which already exist inside
 * the array as prior keys.
 * @param keyGens Object/dictionary of keys, and their associated keys/seeds.
 */
function updateChildStack(
  stack: Stack<ChildStackItem>,
  randomNumbers: Set<number>,
  keyGens: KeyGenerators,
): Stack<ChildStackItem> {
  const lastStart = getLastStartItem(stack);
  if (lastStart) {
    return updateChildItem(stack, lastStart, randomNumbers, keyGens);
  } else {
    throw new Error(
      "There's a mismatch between the number of start and end tags",
    );
  }
}

/**
 * Compiles the markdown children of a `StructureNode` into an array of
 * `JSX.Element`s, for rendering.
 * @param children Array of the text children (the markdown)
 * of a `StructureNode`. Children are either an object representing
 * a tag (like `<span>`), or a string representing text.
 */
function createChildElements(children: Element[]): JSX.Element[] {
  let stack: Stack<ChildStackItem> = [];
  const randomNumbers: Set<number> = new Set();
  const keyGens: KeyGenerators = {};
  for (const child of children) {
    if (isTagItem(child)) {
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

/**
 * Updates the stack by compiling the last `StructureStackItem` which has a
 * `tagType === TagType.StartTag` is compiled, with all the elements on the
 * stack after the last start tag being children.
 * @param stack The stack of `StructureStackItem`s.
 * @param lastStartNode The last `StructureStackItem`, which has
 * `tagType === TagType.StartTag`.
 */
function updateItem(
  stack: Stack<StructureStackItem>,
  {
    children,
    contentOffset,
    node,
    stackIndex,
  }: LastStartNode<StructureStackItem>,
): Stack<StructureStackItem> {
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

/**
 * Returns the updated stack. The last `StructureStackItem` which has a
 * `tagType === TagType.StartTag` is compiled, with all the elements on the
 * stack after the last start tag being children.
 */
function updateStack(
  stack: Stack<StructureStackItem>,
): Stack<StructureStackItem> {
  const lastStartStackItem = getLastStartItem(stack);
  if (lastStartStackItem) {
    return updateItem(stack, lastStartStackItem);
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
  let stack: Stack<StructureStackItem> = [];
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
