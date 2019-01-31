import React from "react";
import styles from "./header.module.css";

export default class HeaderComponent extends React.Component {
  public render(): JSX.Element {
    return (
      <div className={styles.header}>
        <p>Header</p>
      </div>
    );
  }
}
