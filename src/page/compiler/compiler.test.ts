/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/camelcase */

import { compile, getHtmlContentFromPage } from "./compiler";
import parse from "../parser/parser";
import {
  test_01_html,
  test_03_html,
  test_04_html,
  test_05_html,
  test_06_html,
  test_07_html,
  test_08_html,
  test_09_html,
  test_10_html,
  test_11_html,
  test_12_html,
  test_13_html,
  test_14_html,
  test_15_html,
  test_16_html,
  test_17_html,
} from "../parser/parser.test";
import { PageContent } from "../pageModel";
import { Node } from "../pageModel";
import { StructureNode, TagType } from "../structureTree/structureModel";

type Without<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

describe("Custom markdown syntax", () => {
  test("Bold, italics, and color", () => {
    const content =
      "**Bold1 *italics1*** {color:red}**Bold2 *italics2***{color:red} text after";
    const expectedHtml =
      `<span style="font-weight:bold">` +
      `Bold1 ` +
      `<span style="font-style:italic">` +
      `italics1` +
      `</span>` +
      `</span>` +
      ` ` +
      `<span style="color:red">` +
      `<span style="font-weight:bold">` +
      `Bold2` +
      ` ` +
      `<span style="font-style:italic">` +
      `italics2` +
      `</span>` +
      `</span>` +
      `</span>` +
      ` text after`;
    const html = compile(content);
    expect(html).toBe(expectedHtml);
  });

  type ExpectedNode = Without<StructureNode, keyof Node>;
  interface Expected {
    node: ExpectedNode;
    expectedHtml: string;
  }

  function testbed(page: PageContent, expectedHtml: Expected[]): void {
    let i = 0;
    for (const { content, node } of getHtmlContentFromPage(page)) {
      expect(content).toBe(expectedHtml[i].expectedHtml);
      for (const key in expectedHtml[i].node) {
        const element = expectedHtml[i].node[key as keyof ExpectedNode];
        expect(node[key as keyof StructureNode]).toStrictEqual(element!);
      }
      i += 1;
    }
  }

  test("Test 1.01 HTML", () => {
    const page = parse(test_01_html);
    const expected = [
      {
        expectedHtml: `<span style="font-weight:bold">Bold</span> text which has <span style="font-style:italic">italics</span> and <span style="text-decoration:underline">underlines</span>`,
        node: {
          id: "p:{6cb59116-8e61-03a9-39ef-edf64004790d}{62}",
          leftSubTreeLength: 0,
          length: 102,
          style: {
            marginBottom: "0pt",
            marginTop: "0pt",
          },
          tag: "p",
          tagType: TagType.StartTag,
        },
      },
      {
        expectedHtml: "",
        node: {
          id: "p:{6cb59116-8e61-03a9-39ef-edf64004790d}{62}",
          leftSubTreeLength: 0,
          length: 0,
          tag: "p",
          tagType: TagType.EndTag,
        },
      },
    ];
    testbed(page, expected);
  });

  test("Test 1.03 HTML", () => {
    const page = parse(test_03_html);
    const expected = [
      {
        expectedHtml:
          `<span style="font-weight:bold">Bold</span>` +
          ` text which has ` +
          `<span style="font-style:italic">italics</span>` +
          ` and ` +
          `<span style="text-decoration:underline">underlines</span>`,
        node: {
          id: "p:{6cb59116-8e61-03a9-39ef-edf64004790d}{62}",
          leftSubTreeLength: 0,
          length: 102,
          style: {
            marginBottom: "0pt",
            marginTop: "0pt",
          },
          tag: "p",
          tagType: TagType.StartTag,
        },
      },
      {
        expectedHtml: "",
        node: {
          id: "p:{6cb59116-8e61-03a9-39ef-edf64004790d}{62}",
          leftSubTreeLength: 0,
          length: 0,
          tag: "p",
          tagType: TagType.EndTag,
        },
      },
    ];
    testbed(page, expected);
  });

  test("Test 1.04 HTML", () => {
    const page = parse(test_04_html);
    const expected = [
      {
        expectedHtml:
          `<span style="font-weight:bold">` +
          `<span style="font-style:italic">` +
          `<span style="text-decoration:underline">` +
          `Bold and underlined and italics.` +
          `</span>` +
          `</span>` +
          `</span>`,
        node: {
          id: "p:{a977e62e-3126-8e0d-1368-bcf55df0a6de}{15}",
          leftSubTreeLength: 0,
          length: 92,
          style: {
            marginBottom: "0pt",
            marginTop: "0pt",
          },
          tag: "p",
          tagType: TagType.StartTag,
        },
      },
      {
        expectedHtml: "",
        node: {
          id: "p:{a977e62e-3126-8e0d-1368-bcf55df0a6de}{15}",
          leftSubTreeLength: 0,
          length: 0,
          tag: "p",
          tagType: TagType.EndTag,
        },
      },
    ];
    testbed(page, expected);
  });

  test("Test 1.05 HTML", () => {
    const page = parse(test_05_html);
    const expected = [
      {
        expectedHtml: `<span style="font-weight:bold">&quot;this is bold and in quotes&quot;</span>`,
        node: {
          id: "p:{6cb59116-8e61-03a9-39ef-edf64004790d}{130}",
          leftSubTreeLength: 0,
          length: 32,
          style: {
            marginBottom: "0pt",
            marginTop: "0pt",
          },
          tag: "p",
          tagType: TagType.StartTag,
        },
      },
      {
        expectedHtml: "",
        node: {
          id: "p:{6cb59116-8e61-03a9-39ef-edf64004790d}{130}",
          leftSubTreeLength: 0,
          length: 0,
          tag: "p",
          tagType: TagType.EndTag,
        },
      },
    ];
    testbed(page, expected);
  });

  test("Test 1.06 HTML", () => {
    const page = parse(test_06_html);
    const expected: Expected[] = [
      {
        expectedHtml: `<span style="font-weight:bold">Bold</span> text which has <span style="font-style:italic">italics</span> and <span style="text-decoration:underline">underlines</span>`,
        node: {
          id: "p:{6cb59116-8e61-03a9-39ef-edf64004790d}{62}",
          leftSubTreeLength: 0,
          length: 102,
          style: {
            marginBottom: "0pt",
            marginTop: "0pt",
          },
          tag: "p",
          tagType: TagType.StartTag,
        },
      },
      {
        expectedHtml: "",
        node: {
          id: "p:{6cb59116-8e61-03a9-39ef-edf64004790d}{62}",
          leftSubTreeLength: 1,
          length: 0,

          tag: "p",
          tagType: TagType.EndTag,
        },
      },
      {
        expectedHtml: "Citation",
        node: {
          id: "cite:{28216e73-1f0a-05fd-25c5-a04844147e70}{16}",
          leftSubTreeLength: 0,
          length: 16,
          style: {
            color: "#595959",
            fontSize: "9pt",
            marginBottom: "0pt",
            marginTop: "0pt",
          },
          tag: "cite",
          tagType: TagType.StartTag,
        },
      },
      {
        expectedHtml: "",
        node: {
          id: "cite:{28216e73-1f0a-05fd-25c5-a04844147e70}{16}",
          leftSubTreeLength: 0,
          length: 0,
          tag: "cite",
          tagType: TagType.EndTag,
        },
      },
    ];
    testbed(page, expected);
  });

  test("Test 1.07 HTML", () => {
    const page = parse(test_07_html);
    const expected = [
      {
        expectedHtml: `<span style="background-color:yellow">Highlighted</span>`,
        node: {
          id: "p:{28216e73-1f0a-05fd-25c5-a04844147e70}{23}",
          leftSubTreeLength: 0,
          length: 61,
          style: {
            marginBottom: "0pt",
            marginTop: "0pt",
          },
          tag: "p",
          tagType: TagType.StartTag,
        },
      },
      {
        expectedHtml: "",
        node: {
          id: "p:{28216e73-1f0a-05fd-25c5-a04844147e70}{23}",
          leftSubTreeLength: 0,
          length: 0,
          tag: "p",
          tagType: TagType.EndTag,
        },
      },
    ];
    testbed(page, expected);
  });

  test("Test 1.08 HTML", () => {
    const page = parse(test_08_html);
    const expected = [
      {
        expectedHtml: `<span style="color:red">Red text</span>`,
        node: {
          id: "p:{28216e73-1f0a-05fd-25c5-a04844147e70}{26}",
          leftSubTreeLength: 0,
          length: 30,
          style: {
            marginBottom: "0pt",
            marginTop: "0pt",
          },
          tag: "p",
          tagType: TagType.StartTag,
        },
      },
      {
        expectedHtml: "",
        node: {
          id: "p:{28216e73-1f0a-05fd-25c5-a04844147e70}{26}",
          leftSubTreeLength: 0,
          length: 0,
          tag: "p",
          tagType: TagType.EndTag,
        },
      },
    ];
    testbed(page, expected);
  });

  test("Test 1.09 HTML", () => {
    const page = parse(test_09_html);
    const expected = [
      {
        expectedHtml: `This is <span style="font-weight:bold">heading</span> 1`,
        node: {
          id: "h1:{6cb59116-8e61-03a9-39ef-edf64004790d}{69}",
          leftSubTreeLength: 0,
          length: 23,
          style: {
            color: "#1e4e79",
            fontSize: "16pt",
            marginBottom: "0pt",
            marginTop: "0pt",
          },
          tag: "h1",
          tagType: TagType.StartTag,
        },
      },
      {
        expectedHtml: "",
        node: {
          id: "h1:{6cb59116-8e61-03a9-39ef-edf64004790d}{69}",
          leftSubTreeLength: 0,
          length: 0,
          tag: "h1",
          tagType: TagType.EndTag,
        },
      },
    ];
    testbed(page, expected);
  });

  test("Test 1.10 HTML", () => {
    const page = parse(test_10_html);
    const expected = [
      {
        expectedHtml: `This is <span style="text-decoration:underline">heading</span> 2`,
        node: {
          id: "h2:{6cb59116-8e61-03a9-39ef-edf64004790d}{74}",
          leftSubTreeLength: 0,
          length: 74,
          style: {
            color: "#2e75b5",
            fontSize: "14pt",
            marginBottom: "0pt",
            marginTop: "0pt",
          },
          tag: "h2",
          tagType: TagType.StartTag,
        },
      },
      {
        expectedHtml: "",
        node: {
          id: "h2:{6cb59116-8e61-03a9-39ef-edf64004790d}{74}",
          leftSubTreeLength: 0,
          length: 0,
          tag: "h2",
          tagType: TagType.EndTag,
        },
      },
    ];
    testbed(page, expected);
  });

  test("Test 1.11 HTML", () => {
    const page = parse(test_11_html);
    const expected = [
      {
        expectedHtml: `This is <span style="text-decoration:line-through">heading</span> 3`,
        node: {
          id: "h3:{6cb59116-8e61-03a9-39ef-edf64004790d}{79}",
          leftSubTreeLength: 0,
          length: 81,
          style: {
            color: "#377bac",
            fontSize: "12pt",
            marginBottom: "0pt",
            marginTop: "0pt",
          },
          tag: "h3",
          tagType: TagType.StartTag,
        },
      },
      {
        expectedHtml: "",
        node: {
          id: "h3:{6cb59116-8e61-03a9-39ef-edf64004790d}{79}",
          leftSubTreeLength: 0,
          length: 0,
          tag: "h3",
          tagType: TagType.EndTag,
        },
      },
    ];
    testbed(page, expected);
  });

  test("Test 1.12 HTML", () => {
    const page = parse(test_12_html);
    const expected = [
      {
        expectedHtml: `This is heading 4`,
        node: {
          id: "h4:{6cb59116-8e61-03a9-39ef-edf64004790d}{84}",
          leftSubTreeLength: 0,
          length: 22,
          style: {
            color: "#377bac",
            fontSize: "12pt",
            fontStyle: "italic",
            marginBottom: "0pt",
            marginTop: "0pt",
          },
          tag: "h4",
          tagType: TagType.StartTag,
        },
      },
      {
        expectedHtml: "",
        node: {
          id: "h4:{6cb59116-8e61-03a9-39ef-edf64004790d}{84}",
          leftSubTreeLength: 0,
          length: 0,
          tag: "h4",
          tagType: TagType.EndTag,
        },
      },
    ];
    testbed(page, expected);
  });

  test("Test 1.13 HTML", () => {
    const page = parse(test_13_html);
    const expected = [
      {
        expectedHtml: `This is <span style="font-weight:bold"><span style="font-style:italic"><span style="text-decoration:line-through">heading</span></span></span> 5`,
        node: {
          id: "h5:{6cb59116-8e61-03a9-39ef-edf64004790d}{89}",
          leftSubTreeLength: 0,
          length: 89,
          style: {
            color: "#2e75b5",
            marginBottom: "0pt",
            marginTop: "0pt",
          },
          tag: "h5",
          tagType: TagType.StartTag,
        },
      },
      {
        expectedHtml: "",
        node: {
          id: "h5:{6cb59116-8e61-03a9-39ef-edf64004790d}{89}",
          leftSubTreeLength: 0,
          length: 0,
          tag: "h5",
          tagType: TagType.EndTag,
        },
      },
    ];
    testbed(page, expected);
  });

  test("Test 1.14 HTML", () => {
    const page = parse(test_14_html);
    const expected = [
      {
        expectedHtml: `This is heading 6`,
        node: {
          id: "h6:{6cb59116-8e61-03a9-39ef-edf64004790d}{94}",
          leftSubTreeLength: 0,
          length: 24,
          style: {
            color: "#2e75b5",
            fontStyle: "italic",
            marginBottom: "0pt",
            marginTop: "0pt",
          },
          tag: "h6",
          tagType: TagType.StartTag,
        },
      },
      {
        expectedHtml: "",
        node: {
          id: "h6:{6cb59116-8e61-03a9-39ef-edf64004790d}{94}",
          leftSubTreeLength: 0,
          length: 0,
          tag: "h6",
          tagType: TagType.EndTag,
        },
      },
    ];
    testbed(page, expected);
  });

  test("Test 1.15 HTML", () => {
    const page = parse(test_15_html);
    const expected = [
      {
        expectedHtml: `Superscript x<sup>2</sup>`,
        node: {
          id: "p:{28216e73-1f0a-05fd-25c5-a04844147e70}{29}",
          leftSubTreeLength: 0,
          length: 26,
          style: {
            marginBottom: "0pt",
            marginTop: "0pt",
          },
          tag: "p",
          tagType: TagType.StartTag,
        },
      },
      {
        expectedHtml: "",
        node: {
          id: "p:{28216e73-1f0a-05fd-25c5-a04844147e70}{29}",
          leftSubTreeLength: 0,
          length: 0,
          tag: "p",
          tagType: TagType.EndTag,
        },
      },
    ];
    testbed(page, expected);
  });

  test("Test 1.16 HTML", () => {
    const page = parse(test_16_html);
    const expected = [
      {
        expectedHtml: `Subscript x<sub>2</sub>`,
        node: {
          id: "p:{28216e73-1f0a-05fd-25c5-a04844147e70}{32}",
          leftSubTreeLength: 0,
          length: 24,
          style: {
            marginBottom: "0pt",
            marginTop: "0pt",
          },
          tag: "p",
          tagType: TagType.StartTag,
        },
      },
      {
        expectedHtml: "",
        node: {
          id: "p:{28216e73-1f0a-05fd-25c5-a04844147e70}{32}",
          leftSubTreeLength: 0,
          length: 0,
          tag: "p",
          tagType: TagType.EndTag,
        },
      },
    ];
    testbed(page, expected);
  });

  test("Test 1.17 HTML", () => {
    const page = parse(test_17_html);
    const expected = [
      {
        expectedHtml: `<span style="text-decoration:line-through underline">Underlined and crossed out</span>`,
        node: {
          attributes: {
            dataid: "p:{60c45a4d-c9e5-01bd-2ce3-6937733a7742}{11}",
          },
          id: "p:{28216e73-1f0a-05fd-25c5-a04844147e70}{38}",
          leftSubTreeLength: 0,
          length: 107,
          tag: "p",
          tagType: TagType.StartTag,
        },
      },
      {
        expectedHtml: "",
        node: {
          id: "p:{28216e73-1f0a-05fd-25c5-a04844147e70}{38}",
          leftSubTreeLength: 0,
          length: 0,
          tag: "p",
          tagType: TagType.EndTag,
        },
      },
    ];
    testbed(page, expected);
  });

  test("Underlined and crossed out edge case 1", () => {
    const md =
      "{text-decoration:underline line-through}Hello, world!{text-decoration:underline line-through}";
    const expectedHtml = `<span style="text-decoration:underline line-through">Hello, world!</span>`;
    const html = compile(md);
    expect(html).toBe(expectedHtml);
  });

  test("Underlined and crossed out edge case 2", () => {
    const md =
      "{text-decoration:underline line-through}Hello, world!{text-decoration:line-through underline}";
    const expectedHtml = `<span style="text-decoration:underline line-through">Hello, world!</span>`;
    const html = compile(md);
    expect(html).toBe(expectedHtml);
  });

  test("Autoclosing unterminated tags", () => {
    const md = "{color:red}Hello{color:green}Hello";
    const expectedHtml = `<span style="color:red">Hello<span style="color:green">Hello</span></span>`;
    const html = compile(md, true);
    expect(html).toBe(expectedHtml);
  });

  test("Not autoclosing unterminated tags", () => {
    const md = "{color:red}Hello{color:green}Hello";
    const html = compile(md);
    expect(html).toBe(md);
  });

  test("Checks that start and end tags with different cases can end eachother", () => {
    const md = "{color:red}Red{color:Red} text{color:red}";
    const expectedHtml = `<span style="color:red">Red</span> text{color:red}`;
    const html = compile(md);
    expect(html).toBe(expectedHtml);
  });

  test("Checks that the order of the custom syntax tags is respected", () => {
    const md = "{background-color:yellow}High{background-color:yellow}lighted{background-color:yellow}";
    const expectedHtml = `<span style="background-color:yellow">High</span>lighted{background-color:yellow}`;
    const html = compile(md);
    expect(html).toBe(expectedHtml);
  });
});
