import React from "react";
import styles from "./htmlEditor.module.css";

export class HtmlEditorComponent extends React.Component {
  public render(): JSX.Element {
    return <div className={styles.htmlEditor}>HTML Editor</div>;
  }
}
