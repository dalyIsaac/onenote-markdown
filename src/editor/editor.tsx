import React from "react";
import { HtmlEditorComponent } from "./htmlEditor/htmlEditor";
import { MarkdownEditorComponent } from "./markdownEditor/markdownEditor";

export class EditorComponent extends React.Component {
  public render(): JSX.Element {
    return (
      <div>
        <MarkdownEditorComponent />
        <HtmlEditorComponent />
      </div>
    );
  }
}
