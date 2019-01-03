import React, { Component } from "react";
import "./App.css";
import { EditorComponent } from "./editor/editor";

class App extends Component {
  public render(): JSX.Element {
    return <EditorComponent />;
  }
}

export default App;
