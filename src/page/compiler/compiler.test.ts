import { compile } from "./compiler";

describe("Custom markdown syntax", () => {
  test("Bold, italics, and color", () => {
    const content =
      "**Bold1 *italics1*** {color:red}**Bold2 *italics2***{color:red} text after";
    const expectedHtml = `<span style="font-weight:bold">Bold1 <span style="font-style:italic">italics1</span></span> <span style="color:red"><span style="font-weight:bold">Bold2 <span style="font-style:italic">italics2</span></span></span> text after`;
    const html = compile(content);
    expect(html).toBe(expectedHtml);
  });
});
