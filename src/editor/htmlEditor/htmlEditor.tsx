import React from "react";
import { connect } from "react-redux";
import { State } from "../../reducer";
import { PageContent } from "../page/model";
import styles from "./htmlEditor.module.css";

class HtmlEditorComponent extends React.Component<HtmlEditorProps> {
  constructor(props: HtmlEditorProps) {
    super(props);
  }

  public render(): JSX.Element {
    return <div className={styles.htmlEditor}>HTML Editor</div>;
  }
}

interface HtmlEditorProps {
  page: PageContent;
}

const mapStateToProps = (state: State): HtmlEditorProps => ({
  page: state.pages[state.selectedPage],
});

export default connect(mapStateToProps)(HtmlEditorComponent);
