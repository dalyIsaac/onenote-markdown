import React from "react";
import styles from "./editorBase.module.css";
import { PageContent } from "../page/pageModel";
import { TagType, KeyValueStr } from "../page/structureTree/structureModel";

/**
 * Props for the `EditorBaseComponent`.
 */
interface EditorBaseProps {
  page?: PageContent;
  getPage?: (page: PageContent) => JSX.Element[];
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
    props.getPage(props.page);
  }
  return (
    <div className={styles.editor}>
      {props.page && props.getPage ? props.getPage(props.page) : "Editor"}
    </div>
  );
}
