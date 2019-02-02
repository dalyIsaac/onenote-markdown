import React, { Component } from "react";
import Header from "./header/header";
import MarkdownEditor from "./editor/markdown/markdownEditor";
import HtmlEditor from "./editor/html/htmlEditor";
import styles from "./App.module.css";

class App extends Component {
  public render(): JSX.Element {
    return (
      <div className={styles.wrapper}>
        <Header />
        <MarkdownEditor />
        <HtmlEditor />
      </div>
    );
  }
}

export default App;
