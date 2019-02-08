/* eslint-disable @typescript-eslint/camelcase */

import { compile, getMarkdownFromPage } from "./compiler";
import parse from "../parser/parser";
import {
  test_01_html,
  test_03_html,
  test_04_html,
  test_05_html,
} from "../parser/parser.test";
import { PageContent } from "../pageModel";

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

  function testbed(page: PageContent, expectedHtml: string[]): void {
    let i = 0;
    for (const content of getMarkdownFromPage(page)) {
      const compiledContent = compile(content);
      expect(compiledContent).toBe(expectedHtml[i]);
      i += 1;
    }
  }

  test("Test 1.01 HTML", () => {
    const page = parse(test_01_html);
    const expectedHtml = [
      `<span style="font-weight:bold">Bold</span> text which has <span style="font-style:italic">italics</span> and <span style="text-decoration:underline">underlines</span>`,
    ];
    testbed(page, expectedHtml);
  });

  test("Test 1.03 HTML", () => {
    const page = parse(test_03_html);
    const expectedHtml = [
      `<span style="font-weight:bold">Bold</span>` +
        ` text which has ` +
        `<span style="font-style:italic">italics</span>` +
        ` and ` +
        `<span style="text-decoration:underline">underlines</span>`,
    ];
    testbed(page, expectedHtml);
  });

  test("Test 1.04 HTML", () => {
    const page = parse(test_04_html);
    const expectedHtml = [
      `<span style="font-weight:bold">` +
        `<span style="font-style:italic">` +
        `<span style="text-decoration:underline">` +
        `Bold and underlined and italics.` +
        `</span>` +
        `</span>` +
        `</span>`,
    ];
    testbed(page, expectedHtml);
  });

  test("Test 1.05 HTML", () => {
    const page = parse(test_05_html);
    const expectedHtml = [
      `<span style="font-weight:bold">&quot;this is bold and in quotes&quot;</span>`,
    ];
    testbed(page, expectedHtml);
  });
});
