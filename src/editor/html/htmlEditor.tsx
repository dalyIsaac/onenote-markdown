import React from "react";
import EditorBase from "../editorBase";
import { PageContent } from "../../page/pageModel";
import { connect } from "react-redux";
import { State } from "../../reducer";
import renderPage from "./renderPage";

/**
 * Props for the `HtmlEditorComponent`
 */
interface HtmlEditorProps {
  page: PageContent;
  pageId: string;
}

export function HtmlEditorComponent(props: HtmlEditorProps): JSX.Element {
  return (
    <div>
      <EditorBase renderPage={renderPage} page={props.page} />
    </div>
  );
}

const mapStateToProps = (state: State): HtmlEditorProps => ({
  page: state.pages[state.selectedPage],
  pageId: state.selectedPage,
});

export default connect(mapStateToProps)(HtmlEditorComponent);
