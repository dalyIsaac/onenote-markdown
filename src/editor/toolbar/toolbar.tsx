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
  <body data-absolute-enabled="true" style="font-family:Calibri;font-size:11pt">` +
  `      <p
  id="p:{6cb59116-8e61-03a9-39ef-edf64004790d}{62}"
  style="margin-top:0pt;margin-bottom:0pt"
>
  <span style="font-weight:bold">Bold</span> text which has
  <span style="font-style:italic">italics</span> and
  <span style="text-decoration:underline">underlines</span>
</p>
<p
  id="p:{a977e62e-3126-8e0d-1368-bcf55df0a6de}{15}"
  style="margin-top:0pt;margin-bottom:0pt"
>
  <span
    style="font-weight:bold;font-style:italic;text-decoration:underline"
    >Bold and underlined and italics.
  </span>
</p>
<p
  id="p:{ee695e3a-1d4a-0a68-043f-8be19ed60633}{11}"
  style="margin-top:0pt;margin-bottom:0pt"
>
  <span style="font-weight:bold;text-decoration:underline"
    >No italics but bold and underlined</span
  >
</p>
<p
  id="p:{044b9964-f242-02d2-3bb2-4b6e0d569c68}{11}"
  style="margin-top:0pt;margin-bottom:0pt"
>
  Nothing but
  <span style="font-weight:bold"
    >&quot;this is bold and in quotes&quot;</span
  >
</p>
<cite
  id="cite:{28216e73-1f0a-05fd-25c5-a04844147e70}{16}"
  style="font-size:9pt;color:#595959;margin-top:0pt;margin-bottom:0pt"
  >Citation</cite
>
<p
  id="p:{28216e73-1f0a-05fd-25c5-a04844147e70}{19}"
  style="color:#595959;font-style:italic;margin-top:0pt;margin-bottom:0pt"
>
  Quote
</p>
<p
  id="p:{28216e73-1f0a-05fd-25c5-a04844147e70}{21}"
  style="margin-top:0pt;margin-bottom:0pt"
>
  Normal
</p>
<p
  id="p:{28216e73-1f0a-05fd-25c5-a04844147e70}{23}"
  style="margin-top:0pt;margin-bottom:0pt"
>
  <span style="background-color:yellow">Highlighted</span>
</p>
<p
  id="p:{28216e73-1f0a-05fd-25c5-a04844147e70}{26}"
  style="margin-top:0pt;margin-bottom:0pt"
>
  <span style="color:red">Red text</span>
</p>
<p
  id="p:{28216e73-1f0a-05fd-25c5-a04844147e70}{29}"
  style="margin-top:0pt;margin-bottom:0pt"
>
  Superscript x<sup>2</sup>
</p>
<p
  id="p:{28216e73-1f0a-05fd-25c5-a04844147e70}{32}"
  style="margin-top:0pt;margin-bottom:0pt"
>
  Subscript x<sub>2</sub>
</p>
<p
  id="p:{28216e73-1f0a-05fd-25c5-a04844147e70}{35}"
  style="margin-top:0pt;margin-bottom:0pt"
>
  <span style="text-decoration:line-through">Crossed out</span>
</p>
<p
  id="p:{28216e73-1f0a-05fd-25c5-a04844147e70}{38}"
  data-id="p:{60c45a4d-c9e5-01bd-2ce3-6937733a7742}{11}"
  style="margin-top:0pt;margin-bottom:0pt"
>
  <span style="text-decoration:line-through"
    >Underlined and crossed out</span
  >
</p>
` +
  `  </body>
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
