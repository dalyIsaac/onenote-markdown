import React from "react";
import styles from "./toolbar.module.css";

export class ToolbarComponent extends React.Component {
  public render(): JSX.Element {
    return <div className={styles.toolbar}>Toolbar</div>;
  }
}
