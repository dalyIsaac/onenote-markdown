import React from "react";
import { PageContent } from "../../page/pageModel";
import { connect } from "react-redux";
import { State } from "../../reducer";
import "./htmlEditorComponent";

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
      HTML Editor React Component
      <html-editor></html-editor>
    </div>
  );
}

const mapStateToProps = (state: State): HtmlEditorProps => ({
  page: state.pages[state.selectedPage],
  pageId: state.selectedPage,
});

export default connect(mapStateToProps)(HtmlEditorComponent);
