/* eslint-disable @typescript-eslint/camelcase */

import { compile, getMarkdownFromPage } from "./compiler";
import parse from "../parser/parser";
import {
  test_01_html,
  test_03_html,
  test_04_html,
  test_05_html,
  test_06_html,
  test_07_html,
  test_08_html,
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
    for (const { content, node } of getMarkdownFromPage(page)) {
      const compiledContent = compile(content);
      expect(compiledContent).toBe(expectedHtml[i].expectedHtml);
      for (const key in expectedHtml[i].node) {
        const element = expectedHtml[i].node[key as keyof ExpectedNode];
        expect(node[key as keyof StructureNode]).toStrictEqual(element!);
      }
      i += 1;
    }
  }

  test("Test 1.01 HTML", () => {
    const page = parse(test_01_html);
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
    ];
    testbed(page, expected);
  });

  test("Test 1.08 HTML", () => {
    const page = parse(test_08_html);
    const expectedHtml = [
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
    ];
    testbed(page, expectedHtml);
  });
});
