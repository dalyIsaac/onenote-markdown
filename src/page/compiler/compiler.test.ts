import { compile } from "./compiler";

describe("Custom markdown syntax", () => {
  test("Bold, italics, and color", () => {
    const content =
      "**Bold1 *italics1*** {color:red}**Bold2 *italics2***{color:red} text after";
    const expectedHtml = `<p><strong>Bold1 <em>italics1</em></strong> <span style="color:red"><strong>Bold2 <em>italics2</em></strong></span> text after</p>`;
    const html = compile(content);
    expect(html).toBe(expectedHtml);
  });
});
