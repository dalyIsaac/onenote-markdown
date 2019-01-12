import { configure, mount, ReactWrapper } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { NodeType } from "../page/model";
import Parser from "../page/tree/parser";
import { HtmlEditorComponent, HtmlEditorProps } from "./htmlEditor";

configure({ adapter: new Adapter() });

function setUp(
  html: string,
): {
  props: HtmlEditorProps;
  wrapper: ReactWrapper<HtmlEditorProps>;
} {
  const page = new Parser(html).parse();
  const props: HtmlEditorProps = { page };
  const wrapper = mount(<HtmlEditorComponent {...props} />);
  return { props, wrapper };
}

describe("Component: `htmlEditorComponent`.", () => {
  test("It should render itself.", () => {
    const html = `<html lang="en-NZ">
    <head>
      <title>This is the title</title>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="created" content="2018-09-03T14:08:00.0000000" />
    </head>
    <body data-absolute-enabled="true" style="font-family:Calibri;font-size:11pt">
      <h1 id="h1">Hello world</h1>
    </body>
  </html>`;
    const { wrapper } = setUp(html);
    const editor = wrapper.find("div").first();
    expect(editor.hasClass("htmlEditor")).toBe(true);
    expect(editor.prop("contentEditable")).toBe(true);
  });

  test("Bold text which has italics and underlines", () => {
    const html =
      `<html lang="en-NZ">
    <head>
      <title>This is the title</title>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="created" content="2018-09-03T14:08:00.0000000" />
    </head>
    <body data-absolute-enabled="true" style="font-family:Calibri;font-size:11pt">
      <p id="p:{6cb59116-8e61-03a9-39ef-edf64004790d}{62}" style="margin-top:0pt;margin-bottom:0pt">` +
      `<span style="font-weight:bold">Bold</span> text which has<span style="font-style:italic">italics</span>` +
      ` and<span style="text-decoration:underline">underlines</span>
      </p>
    </body>
  </html>`;
    const { wrapper } = setUp(html);

    const p = wrapper.find("p");
    expect(p.key()).toBe("p:{6cb59116-8e61-03a9-39ef-edf64004790d}{62}");
    expect(p.props().style).toEqual({ marginTop: "0pt", marginBottom: "0pt" });

    const boldStartTag = p.childAt(0);
    expect(boldStartTag.type()).toBe("span");
    expect(boldStartTag.props().style).toEqual({ fontWeight: "bold" });
    expect(boldStartTag.props().editornodetype).toEqual(NodeType.StartTag);
    const boldContentTag = boldStartTag.childAt(0);
    expect(boldContentTag.type()).toEqual("span");
    expect(boldContentTag.props().editornodetype).toEqual(NodeType.Content);
    expect(boldContentTag.props().children).toEqual("Bold");

    const textWhichHasTag = p.childAt(1);
    expect(textWhichHasTag.type()).toEqual("span");
    expect(textWhichHasTag.props().editornodetype).toBe(NodeType.Content);
    expect(textWhichHasTag.props().children).toEqual(" text which has");

    const italicTag = p.childAt(2);
    expect(italicTag.type()).toBe("span");
    expect(italicTag.props().editornodetype).toEqual(NodeType.StartTag);
    expect(italicTag.props().style).toEqual({ fontStyle: "italic" });
    const italicContentTag = italicTag.childAt(0);
    expect(italicContentTag.props().editornodetype).toBe(NodeType.Content);
    expect(italicContentTag.props().children).toEqual("italics");

    const andTag = p.childAt(3);
    expect(andTag.type()).toBe("span");
    expect(andTag.props().editornodetype).toBe(NodeType.Content);
    expect(andTag.props().children).toBe(" and");

    const underlineTag = p.childAt(4);
    expect(underlineTag.type()).toBe("span");
    expect(underlineTag.props().editornodetype).toBe(NodeType.StartTag);
    expect(underlineTag.props().style).toEqual({ textDecoration: "underline" });
    const underlineContentTag = underlineTag.childAt(0);
    expect(underlineContentTag.type()).toBe("span");
    expect(underlineContentTag.props().children).toEqual("underlines");
  });

  test("Bold and underlined and italics.", () => {
    const html =
      `<html lang="en-NZ">
  <head>
    <title>This is the title</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="created" content="2018-09-03T14:08:00.0000000" />
  </head>
  <body data-absolute-enabled="true" style="font-family:Calibri;font-size:11pt">
    <p
      id="p:{a977e62e-3126-8e0d-1368-bcf55df0a6de}{15}"
      style="margin-top:0pt;margin-bottom:0pt"
    >` +
      `<span
        style="font-weight:bold;font-style:italic;text-decoration:underline"
        >Bold and underlined and italics.` +
      `</span>
    </p>
  </body>
</html>`;
    const { wrapper } = setUp(html);

    const p = wrapper.find("p");
    expect(p.key()).toBe("p:{a977e62e-3126-8e0d-1368-bcf55df0a6de}{15}");
    expect(p.props().style).toEqual({ marginTop: "0pt", marginBottom: "0pt" });

    const spanStartTag = p.childAt(0);
    expect(spanStartTag.type()).toBe("span");
    expect(spanStartTag.props().style).toEqual({
      fontWeight: "bold",
      fontStyle: "italic",
      textDecoration: "underline",
    });
    expect(spanStartTag.props().editornodetype).toBe(NodeType.StartTag);

    const spanContentTag = spanStartTag.childAt(0);
    expect(spanContentTag.type()).toBe("span");
    expect(spanContentTag.props().editornodetype).toBe(NodeType.Content);
    expect(spanContentTag.props().children).toBe(
      "Bold and underlined and italics.",
    );
  });

  test("Quotes charref", () => {
    const html =
      `<html lang="en-NZ">
  <head>
    <title>This is the title</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="created" content="2018-09-03T14:08:00.0000000" />
  </head>
  <body data-absolute-enabled="true" style="font-family:Calibri;font-size:11pt">` +
      `<p
    id="p:{044b9964-f242-02d2-3bb2-4b6e0d569c68}{11}"
    style="margin-top:0pt;margin-bottom:0pt"
    >` +
      `Nothing but ` +
      `<span style="font-weight:bold">&quot;this is bold and in quotes&quot;</span>` +
      `</p>` +
      `</body>
</html>`;
    const { wrapper } = setUp(html);

    const p = wrapper.find("p");
    expect(p.key()).toBe("p:{044b9964-f242-02d2-3bb2-4b6e0d569c68}{11}");
    expect(p.props().style).toEqual({ marginTop: "0pt", marginBottom: "0pt" });

    const nothingButContentTag = p.childAt(0);
    expect(nothingButContentTag.type()).toBe("span");
    expect(nothingButContentTag.props().editornodetype).toBe(NodeType.Content);
    expect(nothingButContentTag.props().children).toBe("Nothing but ");

    const quoteStartTag = p.childAt(1);
    expect(quoteStartTag.type()).toBe("span");
    expect(quoteStartTag.props().editornodetype).toBe(NodeType.StartTag);
    expect(quoteStartTag.props().style).toEqual({ fontWeight: "bold" });

    const firstQuoteContentTag = quoteStartTag.childAt(0);
    expect(firstQuoteContentTag.type()).toBe("span");
    expect(firstQuoteContentTag.props().editornodetype).toBe(NodeType.Content);
    expect(firstQuoteContentTag.props().children).toBe('"');

    const contentTag = quoteStartTag.childAt(1);
    expect(contentTag.type()).toBe("span");
    expect(contentTag.props().editornodetype).toBe(NodeType.Content);
    expect(contentTag.props().children).toBe("this is bold and in quotes");

    const secondQuoteContentTag = quoteStartTag.childAt(2);
    expect(secondQuoteContentTag.type()).toBe("span");
    expect(secondQuoteContentTag.props().editornodetype).toBe(NodeType.Content);
    expect(secondQuoteContentTag.props().children).toBe('"');
  });

  test("`cite` tags", () => {
    const html =
      `<html lang="en-NZ">
<head>
  <title>This is the title</title>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="created" content="2018-09-03T14:08:00.0000000" />
</head>
<body data-absolute-enabled="true" style="font-family:Calibri;font-size:11pt">` +
      `<cite
    id="cite:{28216e73-1f0a-05fd-25c5-a04844147e70}{16}"
    style="font-size:9pt;color:#595959;margin-top:0pt;margin-bottom:0pt"
    >Citation</cite>` +
      `</body>
</html>`;
    const { wrapper } = setUp(html);

    const cite = wrapper.find("cite");
    expect(cite.key()).toBe("cite:{28216e73-1f0a-05fd-25c5-a04844147e70}{16}");
    expect(cite.props().style).toEqual({
      fontSize: "9pt",
      color: "#595959",
      marginTop: "0pt",
      marginBottom: "0pt",
    });
    expect((cite.props() as { [key: string]: string }).editornodetype).toBe(
      NodeType.StartTag,
    );

    const citeContent = cite.childAt(0);
    expect(citeContent.type()).toBe("span");
    expect(citeContent.props().editornodetype).toBe(NodeType.Content);
    expect(citeContent.props().children).toBe("Citation");
  });

  test("Superscript", () => {
    const html =
      `<html lang="en-NZ">
<head>
  <title>This is the title</title>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="created" content="2018-09-03T14:08:00.0000000" />
</head>
<body data-absolute-enabled="true" style="font-family:Calibri;font-size:11pt">` +
      `<p
      id="p:{28216e73-1f0a-05fd-25c5-a04844147e70}{29}"
      style="margin-top:0pt;margin-bottom:0pt"
      >Superscript x<sup>2</sup></p>` +
      `</body>
</html>`;
    const { wrapper } = setUp(html);

    const p = wrapper.find("p");
    expect(p.key()).toBe("p:{28216e73-1f0a-05fd-25c5-a04844147e70}{29}");
    expect(p.props().style).toEqual({
      marginTop: "0pt",
      marginBottom: "0pt",
    });
    expect((p.props() as { [key: string]: string }).editornodetype).toBe(
      NodeType.StartTag,
    );

    const superscriptContentTag = p.childAt(0);
    expect(superscriptContentTag.type()).toBe("span");
    expect(superscriptContentTag.props().editornodetype).toBe(NodeType.Content);
    expect(superscriptContentTag.props().children).toBe("Superscript x");

    const supStartTag = p.childAt(1);
    expect(supStartTag.type()).toBe("sup");
    expect(supStartTag.props().editornodetype).toBe(NodeType.StartTag);
    const supContentTag = supStartTag.childAt(0);
    expect(supContentTag.type()).toBe("span");
    expect(supContentTag.props().editornodetype).toBe(NodeType.Content);
    expect(supContentTag.props().children).toBe("2");
  });

  test("Subscript", () => {
    const html =
      `<html lang="en-NZ">
<head>
  <title>This is the title</title>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="created" content="2018-09-03T14:08:00.0000000" />
</head>
<body data-absolute-enabled="true" style="font-family:Calibri;font-size:11pt">` +
      `<p
      id="p:{28216e73-1f0a-05fd-25c5-a04844147e70}{32}"
      style="margin-top:0pt;margin-bottom:0pt"
    >Subscript x<sub>2</sub></p>` +
      `</body>
</html>`;
    const { wrapper } = setUp(html);

    const p = wrapper.find("p");
    expect(p.key()).toBe("p:{28216e73-1f0a-05fd-25c5-a04844147e70}{32}");
    expect(p.props().style).toEqual({
      marginTop: "0pt",
      marginBottom: "0pt",
    });
    expect((p.props() as { [key: string]: string }).editornodetype).toBe(
      NodeType.StartTag,
    );

    const superscriptContentTag = p.childAt(0);
    expect(superscriptContentTag.type()).toBe("span");
    expect(superscriptContentTag.props().editornodetype).toBe(NodeType.Content);
    expect(superscriptContentTag.props().children).toBe("Subscript x");

    const subStartTag = p.childAt(1);
    expect(subStartTag.type()).toBe("sub");
    expect(subStartTag.props().editornodetype).toBe(NodeType.StartTag);
    const supContentTag = subStartTag.childAt(0);
    expect(supContentTag.type()).toBe("span");
    expect(supContentTag.props().editornodetype).toBe(NodeType.Content);
    expect(supContentTag.props().children).toBe("2");
  });
});
