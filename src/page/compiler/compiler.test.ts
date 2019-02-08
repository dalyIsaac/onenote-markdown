/* eslint-disable @typescript-eslint/camelcase */

import { compile, getMarkdownFromPage } from "./compiler";
import parse from "../parser/parser";
import { test_01_html } from "../parser/parser.test";

describe("Get markdown from page", () => {
  test("Test 1.01 HTML", () => {
    const page = parse(test_01_html);
    const expectedMarkdown = [
      "**Bold** text which has _italics_ and {text-decoration:underline}underlines{text-decoration:underline}",
      "",
    ];
    let i = 0;
    for (const content of getMarkdownFromPage(page)) {
      expect(content).toBe(expectedMarkdown[i]);
      i += 1;
    }
  });
});

describe("Custom markdown syntax", () => {
  test("Bold, italics, and color", () => {
    const content =
      "**Bold1 *italics1*** {color:red}**Bold2 *italics2***{color:red} text after";
    const expectedHtml = `<span style="font-weight:bold">Bold1 <span style="font-style:italic">italics1</span></span> <span style="color:red"><span style="font-weight:bold">Bold2 <span style="font-style:italic">italics2</span></span></span> text after`;
    const html = compile(content);
    expect(html).toBe(expectedHtml);
  });

  test("Test 1.01 HTML", () => {
    const page = parse(test_01_html);
    const expectedHtml = [
      `<span style="font-weight:bold">Bold</span> text which has <span style="font-style:italic">italics</span> and <span style="text-decoration:underline">underlines</span>`,
      "",
    ];
    let i = 0;
    for (const content of getMarkdownFromPage(page)) {
      const compiledContent = compile(content);
      expect(compiledContent).toBe(expectedHtml[i]);
      i += 1;
    }
  });
});
