import React from "react";
import styles from "./editorBase.module.css";
import { PageContent } from "../page/pageModel";

interface EditorBaseProps {
  page?: PageContent;
  getPage?: (page: PageContent) => JSX.Element[];
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
