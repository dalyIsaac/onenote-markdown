import React from "react";
import styles from "./editorBase.module.css";
import { PageContent } from "../page/pageModel";
import { TagType, KeyValueStr } from "../page/structureTree/structureModel";

/**
 * Type of the received event object for `onBeforeInput`.
 */
export type BeforeInputType = React.FormEvent<HTMLDivElement> & {
  data: string;
};

/**
 * Props for the `EditorBaseComponent`.
 */
interface EditorBaseProps {
  page?: PageContent;
  getPage?: (page: PageContent) => JSX.Element[];
  onBeforeInput?: (e: BeforeInputType) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}

/**
 * The stack which is used for storing items during the process of compiling
 * the markdown/`PageContent` into `JSX.Element[]`.
 */
export type Stack<T> = Array<T | JSX.Element>;

/**
 * The basic properties that the stack needs to have in order
 * to use the `getLastStartItem` function.
 */
export interface BasicNode {
  style?: KeyValueStr;
  tag: string;
  tagType: TagType;
}

/**
 * The type returned by the function `getLastStartItem`.
 */
export type LastStartNode<T> = T & {
  node: BasicNode;
  stackIndex: number;
};

export const CONTENT_OFFSET = "contentoffset";
export const IS_BREAK = "isbreak";
export const NODE_INDEX = "nodeindex";

function getAttribute(element: Element, name: string): string | null {
  const item = element.attributes.getNamedItem(name);
  if (item === null) {
    return null;
  }
  return item.value;
}

function getNumberAttribute(element: Element, name: string): number | null {
  const strValue = getAttribute(element, name);
  if (strValue === null) {
    return null;
  }

  const value = Number(strValue);
  if (isFinite(value)) {
    return value;
  }
  return null;
}

function getBooleanAttribute(element: Element, name: string): boolean | null {
  const strValue = getAttribute(element, name);
  if (strValue === null) {
    return null;
  }

  if (strValue === "true") {
    return true;
  } else if (strValue === "false") {
    return false;
  }
  return null;
}

/**
 * Gets the value for the structure node index, for the given element.
 * @param element
 */
export function getStructureNodeIndex(element: Element): number | null {
  return getNumberAttribute(element, NODE_INDEX);
}

/**
 * Gets the value for the content offset, for the given element.
 * @param element
 */
export function getContentOffset(element: Element): number | null {
  return getNumberAttribute(element, CONTENT_OFFSET);
}

/**
 * Gets the value for the is break attribute, for the given element.
 * @param element
 */
export function getIsBreak(element: Element): boolean | null {
  return getBooleanAttribute(element, IS_BREAK);
}

/**
 * Gets the last item on the stack where the `TagType` is `TagType.StartTag`.
 */
export function getLastStartItem<T extends { node: BasicNode }>(
  stack: Stack<T | string>,
): LastStartNode<T> | null {
  for (let stackIndex = stack.length - 1; stackIndex >= 0; stackIndex--) {
    const result = stack[stackIndex] as T;
    if (result.node && result.node.tagType === TagType.StartTag) {
      return { node: result.node, stackIndex, ...result };
    }
  }
  return null;
}

export default function EditorBaseComponent(
  props: EditorBaseProps,
): JSX.Element {
  if (props.page && props.getPage) {
    const editable = props.onBeforeInput ? true : false;
    return (
      <div
        className={styles.editor}
        contentEditable={editable}
        suppressContentEditableWarning={editable}
        onBeforeInput={props.onBeforeInput}
        onKeyDown={props.onKeyDown}
      >
        {props.getPage(props.page)}
      </div>
    );
  }
  return <div className={styles.editor}>{"Editor"}</div>;
}
