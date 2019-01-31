import React from "react";
import EditorBase from "../editorBase";
import styles from "./markdownEditor.module.css";
import { connect } from "react-redux";
import { PageContent } from "../../page/pageModel";
import { State } from "../../reducer";

interface MarkdownEditorProps {
  page: PageContent;
  pageId: string;
}

class MarkdownEditorComponent extends React.Component<MarkdownEditorProps> {
  public render(): JSX.Element {
    return (
      <div className={styles.editor}>
        <EditorBase />
      </div>
    );
  }
}

const mapStateToProps = (state: State): MarkdownEditorProps => ({
  page: state.pages[state.selectedPage],
  pageId: state.selectedPage,
});

export default connect(mapStateToProps)(MarkdownEditorComponent);
