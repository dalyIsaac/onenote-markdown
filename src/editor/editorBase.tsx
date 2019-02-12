import React from "react";
import styles from "./editorBase.module.css";
import { PageContent } from "../page/pageModel";
import { TagType, KeyValueStr } from "../page/structureTree/structureModel";

interface EditorBaseProps {
  page?: PageContent;
  getPage?: (page: PageContent) => JSX.Element[];
}

export type Stack<T> = Array<T | JSX.Element>;

export interface BasicNode {
  style?: KeyValueStr;
  tag: string;
  tagType: TagType;
}

export type LastStartNode<T> = T & {
  node: BasicNode;
  stackIndex: number;
};

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
