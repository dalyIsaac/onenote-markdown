import { StructureNode, TagType } from "../page/structureTree/structureModel";
import { NodePosition } from "../page/tree/tree";
import { TagItem } from "../page/compiler/renderers";

export interface StackItemBase extends NodePosition<StructureNode> {
  contentOffset: number;
  node: StructureNode;
}

export type StackItem<T extends StackItemBase = StackItemBase> = T | Element;

export const STRUCTURE_NODE_INDEX = "STRUCTURE_NODE_INDEX";

export type Style = Partial<{ [key in keyof CSSStyleDeclaration]: string }>;

export interface Props {
  [key: string]: string | number | boolean | undefined;
}

export function createElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  style?: Style,
  props?: Props,
  children?: Element | string | Array<Element | Text>,
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tagName);
  if (style) {
    for (const key in style) {
      const value = style[key];
      if (style.hasOwnProperty(key) && value !== undefined) {
        el.style.setProperty(key, value);
      }
    }
  }

  if (props) {
    for (const key in props) {
      const value = props[key];
      if (props.hasOwnProperty(key) && value !== undefined) {
        el.setAttribute(key, String(value));
      }
    }
  }

  if (children) {
    if (Array.isArray(children)) {
      for (const child of children) {
        el.appendChild(child);
      }
    } else if (typeof children === "string") {
      el.innerText = children;
    } else {
      el.appendChild(children);
    }
  }
  return el;
}

/**
 * The type returned by the function `getLastStartItem`.
 */
export interface LastStartNode<K extends TagItem = TagItem> {
  stackIndex: number;
  node: K;
}

interface StackStartItemBase<K extends TagItem = TagItem> {
  node: K;
}

/**
 * Gets the last item on the stack where the `TagType` is `TagType.StartTag`.
 */
export function getLastStartItem<
  T extends StackStartItemBase<K>,
  K extends TagItem = TagItem
>(stack: Array<T | string | Element | Text>): LastStartNode<K> & T | null {
  for (let stackIndex = stack.length - 1; stackIndex >= 0; stackIndex--) {
    const result = stack[stackIndex] as T;
    if (result.node && result.node.tagType === TagType.StartTag) {
      return { stackIndex, ...result };
    }
  }
  return null;
}
