import { StructureNode, TagType } from "../page/structureTree/structureModel";
import { NodePosition } from "../page/tree/tree";
import { TagItem } from "../page/compiler/renderers";

export interface StackItemBase extends NodePosition<StructureNode> {
  contentOffset: number;
  node: StructureNode;
}

export type StackItem<T extends StackItemBase = StackItemBase> = T | Element;

export const STRUCTURE_NODE_INDEX = "STRUCTURE_NODE_INDEX";

export function createElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  props?: { [key: string]: string | number },
  children?: Element | Element[] | string,
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tagName);
  for (const key in props) {
    if (props.hasOwnProperty(key)) {
      const value = props[key];
      el.setAttribute(key, String(value));
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
>(stack: Array<T | string | Element>): LastStartNode<K> & T | null {
  for (let stackIndex = stack.length - 1; stackIndex >= 0; stackIndex--) {
    const result = stack[stackIndex] as T;
    if (result.node && result.node.tagType === TagType.StartTag) {
      return { stackIndex, ...result };
    }
  }
  return null;
}
