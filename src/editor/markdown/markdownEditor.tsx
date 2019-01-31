import React from "react";
import EditorBase from "../editorBase";
import styles from "./markdownEditor.module.css";

export default class MarkdownEditorComponent extends React.Component {
  public render(): JSX.Element {
    return (
      <div className={styles.editor}>
        <EditorBase />
      </div>
    );
  }
}
