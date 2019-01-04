import { DefaultButton } from "office-ui-fabric-react";
import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { ParseHtmlAction, parseHtmlContent } from "../page/actions";
import {
  updateSelectedPage,
  UpdateSelectedPageAction,
} from "../selectedPage/actions";
import styles from "./toolbar.module.css";

const PAGE_ID = "pageId";

class ToolbarComponent extends React.Component<ToolbarProps, ToolbarState> {
  constructor(props: ToolbarProps) {
    super(props);
    this.state = { enabled: true };
    this.loadSample = this.loadSample.bind(this);
  }

  public render(): JSX.Element {
    return (
      <div className={styles.markdownEditor}>
        <DefaultButton
          data-automation-id="test"
          allowDisabledFocus={true}
          disabled={!this.state.enabled}
          text="Load sample OneNote text content"
          onClick={this.loadSample}
        />
      </div>
    );
  }

  private loadSample(): void {
    this.props.loadSampleContent();
    this.props.loadPageId();
    this.setState({ enabled: false });
  }
}

const sampleTextHtml =
  `<html lang="en-NZ">
<head>
    <title>This is the title</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="created" content="2018-09-03T14:08:00.0000000" />
</head>
<body data-absolute-enabled="true" style="font-family:Calibri;font-size:11pt">
    <p id="p:{6cb59116-8e61-03a9-39ef-edf64004790d}{62}" style="margin-top:0pt;margin-bottom:0pt">` +
  `<span style="font-weight:bold">Bold</span> text which has <span style="font-style:italic">italics</span> and ` +
  `<span style="text-decoration:underline">underlines</span></p>
</body>
</html>`;

interface ToolbarProps {
  loadSampleContent: () => ParseHtmlAction;
  loadPageId: () => UpdateSelectedPageAction;
}

interface ToolbarState {
  enabled: boolean;
}

const mapDispatchToProps = (dispatch: Dispatch): ToolbarProps => ({
  loadSampleContent: (): ParseHtmlAction =>
    dispatch(parseHtmlContent(PAGE_ID, sampleTextHtml)),
  loadPageId: () => dispatch(updateSelectedPage(PAGE_ID)),
});

export default connect(
  null,
  mapDispatchToProps,
)(ToolbarComponent);
