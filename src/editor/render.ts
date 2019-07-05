import { StructureNode, TagType } from "../page/structureTree/structureModel";
import { NodePosition } from "../page/tree/tree";

interface StartTagStackItem extends NodePosition<StructureNode> {
  contentOffset: number;
}

export type StackItem = StartTagStackItem | Element;

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
export interface LastStartNode extends NodePosition<StructureNode> {
  stackIndex: number;
  contentOffset: number;
}

/**
 * Gets the last item on the stack where the `TagType` is `TagType.StartTag`.
 */
export function getLastStartItem(stack: StackItem[]): LastStartNode | null {
  for (let stackIndex = stack.length - 1; stackIndex >= 0; stackIndex--) {
    const result = stack[stackIndex];
    if (
      !(result instanceof Element) &&
      result.node &&
      result.node.tagType === TagType.StartTag
    ) {
      return { stackIndex, ...result };
    }
  }
  return null;
}
