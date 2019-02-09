import React from "react";
import Header from "./header/header";
import MarkdownEditor from "./editor/markdown/markdownEditor";
import HtmlEditor from "./editor/html/htmlEditor";
import styles from "./App.module.css";

export default function App(): JSX.Element {
  return (
    <div className={styles.wrapper}>
      <Header />
      <MarkdownEditor />
      <HtmlEditor />
    </div>
  );
}
