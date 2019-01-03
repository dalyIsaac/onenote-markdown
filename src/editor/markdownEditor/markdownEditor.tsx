import React from "react";
import styles from "./markdownEditor.module.css";

export class MarkdownEditorComponent extends React.Component {
  public render(): JSX.Element {
    return <div className={styles.markdownEditor}>Markdown Editor</div>;
  }
}
