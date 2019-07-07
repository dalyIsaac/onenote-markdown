import React from "react";
import Header from "./header/header";
import styles from "./App.module.css";
import "./editor/markdownEditor";
import "./editor/htmlEditor";

export default function App(): JSX.Element {
  return (
    <div className={styles.wrapper}>
      <Header />
      <markdown-editor />
      <html-editor />
    </div>
  );
}
