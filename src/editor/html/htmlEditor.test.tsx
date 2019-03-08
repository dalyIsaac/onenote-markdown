/* eslint-disable max-len */
import React from "react";
import { configure, mount, ReactWrapper } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import parse from "../../page/parser/parser";
import { HtmlEditorComponent } from "./htmlEditor";
import { KeyValueStr } from "../../page/structureTree/structureModel";
import isStringLodash from "lodash.isstring";
import EditorBaseComponent from "../editorBase";

jest.mock("seedrandom", () => ({
  alea: () => jest.fn().mockReturnValue(1234567890),
}));

configure({ adapter: new Adapter() });

function isString(s: ChildType | string): s is string {
  return isStringLodash(s);
}

interface ChildType {
  children: Array<ChildType | string>;
  style?: KeyValueStr;
  tag: string;
}

type EditorChild = { key: string } & ChildType;

describe("HTML output", () => {
  test("Basic text", () => {
    const sampleTextHtml =
      `<html lang="en-NZ">` +
      `<head>` +
      `<title>This is the title</title>` +
      `<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />` +
      `<meta name="created" content="2018-09-03T14:08:00.0000000" />` +
      `</head>` +
      `<body data-absolute-enabled="true" style="font-family:Calibri;font-size:11pt">` +
      `<p id="p:{6cb59116-8e61-03a9-39ef-edf64004790d}{62}" style="margin-top:0pt;margin-bottom:0pt">` +
      `<span style="font-weight:bold">Bold</span> text which has ` +
      `<span style="font-style:italic">italics</span> and ` +
      `<span style="text-decoration:underline">underlines</span>` +
      `</p>` +
      `<p id="p:{a977e62e-3126-8e0d-1368-bcf55df0a6de}{15}" style="margin-top:0pt;margin-bottom:0pt">` +
      `<span style="font-weight:bold;font-style:italic;text-decoration:underline">Bold and underlined and italics.` +
      `</span>` +
      `</p>` +
      `<p id="p:{ee695e3a-1d4a-0a68-043f-8be19ed60633}{11}" style="margin-top:0pt;margin-bottom:0pt">` +
      `<span style="font-weight:bold;text-decoration:underline">No italics but bold and underlined</span>` +
      `</p>` +
      `<p id="p:{044b9964-f242-02d2-3bb2-4b6e0d569c68}{11}" style="margin-top:0pt;margin-bottom:0pt">` +
      `Nothing but ` +
      `<span style="font-weight:bold">&quot;this is bold and in quotes&quot;</span>` +
      `</p>` +
      `<cite id="cite:{28216e73-1f0a-05fd-25c5-a04844147e70}{16}" ` +
      `style="font-size:9pt;color:#595959;margin-top:0pt;margin-bottom:0pt">` +
      `Citation` +
      `</cite>` +
      `<p id="p:{28216e73-1f0a-05fd-25c5-a04844147e70}{19}" ` +
      `style="color:#595959;font-style:italic;margin-top:0pt;margin-bottom:0pt">` +
      `Quote` +
      `</p>` +
      `<p id="p:{28216e73-1f0a-05fd-25c5-a04844147e70}{21}" style="margin-top:0pt;margin-bottom:0pt">Normal</p>` +
      `<p id="p:{28216e73-1f0a-05fd-25c5-a04844147e70}{23}" style="margin-top:0pt;margin-bottom:0pt">` +
      `<span style="background-color:yellow">Highlighted</span>` +
      `</p>` +
      `<p id="p:{28216e73-1f0a-05fd-25c5-a04844147e70}{26}" style="margin-top:0pt;margin-bottom:0pt">` +
      `<span style="color:red">Red text</span>` +
      `</p>` +
      `<p id="p:{28216e73-1f0a-05fd-25c5-a04844147e70}{29}" style="margin-top:0pt;margin-bottom:0pt">` +
      `Superscript x<sup>2</sup>` +
      `</p>` +
      `<p id="p:{28216e73-1f0a-05fd-25c5-a04844147e70}{32}" style="margin-top:0pt;margin-bottom:0pt">` +
      `Subscript x<sub>2</sub>` +
      `</p>` +
      `<p id="p:{28216e73-1f0a-05fd-25c5-a04844147e70}{35}" style="margin-top:0pt;margin-bottom:0pt">` +
      `<span style="text-decoration:line-through">Crossed out</span>` +
      `</p>` +
      `<p id="p:{28216e73-1f0a-05fd-25c5-a04844147e70}{38}" data-id="p:{60c45a4d-c9e5-01bd-2ce3-6937733a7742}{11} "` +
      `style="margin-top:0pt;margin-bottom:0pt"> <span style="text-decoration:line-through underline">` +
      `Underlined and crossed out` +
      `</span >` +
      `</p>` +
      `</body>` +
      `</html>`;

    const page = parse(sampleTextHtml);
    const wrapper = mount(
      <HtmlEditorComponent page={page} pageId={"pageId"} />,
    );

    const editor = wrapper.find(EditorBaseComponent).childAt(0);
    const expectedChildren: EditorChild[] = [
      {
        children: [
          {
            children: ["Bold"],
            style: {
              fontWeight: "bold",
            },
            tag: "span",
          },
          " text which has ",
          {
            children: ["italics"],
            style: {
              fontStyle: "italic",
            },
            tag: "span",
          },
          " and ",
          {
            children: ["underlines"],
            style: {
              textDecoration: "underline",
            },
            tag: "span",
          },
        ],
        key: "p:{6cb59116-8e61-03a9-39ef-edf64004790d}{62}",
        style: {
          marginBottom: "0pt",
          marginTop: "0pt",
        },
        tag: "p",
      },
      {
        children: [
          {
            children: [
              {
                children: [
                  {
                    children: ["Bold and underlined and italics."],
                    style: { textDecoration: "underline" },
                    tag: "span",
                  },
                ],
                style: { fontStyle: "italic" },
                tag: "span",
              },
            ],
            style: { fontWeight: "bold" },
            tag: "span",
          },
        ],
        key: "p:{a977e62e-3126-8e0d-1368-bcf55df0a6de}{15}",
        style: {
          marginBottom: "0pt",
          marginTop: "0pt",
        },
        tag: "p",
      },
      {
        children: [
          {
            children: [
              {
                children: ["No italics but bold and underlined"],
                style: { textDecoration: "underline" },
                tag: "span",
              },
            ],
            style: { fontWeight: "bold" },
            tag: "span",
          },
        ],
        key: "p:{ee695e3a-1d4a-0a68-043f-8be19ed60633}{11}",
        style: { marginBottom: "0pt", marginTop: "0pt" },
        tag: "p",
      },
      {
        children: [
          "Nothing but ",
          {
            children: [`"this is bold and in quotes"`],
            style: { fontWeight: "bold" },
            tag: "span",
          },
        ],
        key: "p:{044b9964-f242-02d2-3bb2-4b6e0d569c68}{11}",
        style: { marginBottom: "0pt", marginTop: "0pt" },
        tag: "p",
      },
      {
        children: ["Citation"],
        key: "cite:{28216e73-1f0a-05fd-25c5-a04844147e70}{16}",
        style: {
          color: "#595959",
          fontSize: "9pt",
          marginBottom: "0pt",
          marginTop: "0pt",
        },
        tag: "cite",
      },
      {
        children: [],
        key: "{!localGeneratedId}1234567890",
        tag: "br",
      },
      {
        children: ["Quote"],
        key: "p:{28216e73-1f0a-05fd-25c5-a04844147e70}{19}",
        style: {
          color: "#595959",
          fontStyle: "italic",
          marginBottom: "0pt",
          marginTop: "0pt",
        },
        tag: "p",
      },
      {
        children: ["Normal"],
        key: "p:{28216e73-1f0a-05fd-25c5-a04844147e70}{21}",
        style: { marginBottom: "0pt", marginTop: "0pt" },
        tag: "p",
      },
      {
        children: [
          {
            children: ["Highlighted"],
            style: { backgroundColor: "yellow" },
            tag: "span",
          },
        ],
        key: "p:{28216e73-1f0a-05fd-25c5-a04844147e70}{23}",
        style: { marginBottom: "0pt", marginTop: "0pt" },
        tag: "p",
      },
      {
        children: [
          {
            children: ["Red text"],
            style: { color: "red" },
            tag: "span",
          },
        ],
        key: "p:{28216e73-1f0a-05fd-25c5-a04844147e70}{26}",
        style: { marginBottom: "0pt", marginTop: "0pt" },
        tag: "p",
      },
      {
        children: [
          "Superscript x",
          {
            children: ["2"],
            tag: "sup",
          },
        ],
        key: "p:{28216e73-1f0a-05fd-25c5-a04844147e70}{29}",
        style: { marginBottom: "0pt", marginTop: "0pt" },
        tag: "p",
      },
      {
        children: [
          "Subscript x",
          {
            children: ["2"],
            tag: "sub",
          },
        ],
        key: "p:{28216e73-1f0a-05fd-25c5-a04844147e70}{32}",
        style: { marginBottom: "0pt", marginTop: "0pt" },
        tag: "p",
      },
      {
        children: [
          {
            children: ["Crossed out"],
            style: { textDecoration: "line-through" },
            tag: "span",
          },
        ],
        key: "p:{28216e73-1f0a-05fd-25c5-a04844147e70}{35}",
        style: { marginBottom: "0pt", marginTop: "0pt" },
        tag: "p",
      },
      {
        children: [
          {
            children: ["Underlined and crossed out"],
            style: { textDecoration: "line-through underline" },
            tag: "span",
          },
        ],
        key: "p:{28216e73-1f0a-05fd-25c5-a04844147e70}{38}",
        tag: "p",
      },
    ];

    function childTest(
      wrapper: ReactWrapper | string,
      expectedChild: ChildType | string,
    ): void {
      if (isString(expectedChild)) {
        if (isString(wrapper as string)) {
          expect(wrapper).toEqual(expectedChild);
        } else {
          expect((wrapper as ReactWrapper).text()).toEqual(expectedChild);
        }
      } else {
        expect(((wrapper as ReactWrapper).props() as ChildType).style).toEqual(
          expectedChild.style,
        );
        expect((wrapper as ReactWrapper).name()).toEqual(expectedChild.tag);
        expectedChild.children.forEach((x, i) => {
          const child = (wrapper as ReactWrapper).childAt(0);
          if (child.length === 0) {
            childTest(wrapper, x as ChildType);
          } else {
            childTest((wrapper as ReactWrapper).childAt(i), x as ChildType);
          }
        });
      }
    }

    expectedChildren.forEach((child, currentIndex) => {
      const wrapper = editor.childAt(currentIndex);
      const props = wrapper.props() as EditorChild;

      expect(wrapper.key()).toStrictEqual(child.key);
      expect(wrapper.name()).toStrictEqual(child.tag);
      expect(props.style).toEqual(child.style);

      let fixNumber = 0;
      child.children.forEach((current, index) => {
        if (isString(wrapper.props().children[index])) {
          childTest(wrapper.props().children[index], current);
          fixNumber++;
        } else {
          childTest(wrapper.childAt(index - fixNumber), current);
        }
      });
    });
  });
});
