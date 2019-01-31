import React from "react";
import styles from "./editorBase.module.css";

export default class EditorBaseComponent extends React.Component {
  public render(): JSX.Element {
    return (
      <div className={styles.editor}>
        <h1>Editor</h1>
      </div>
    );
  }
}
