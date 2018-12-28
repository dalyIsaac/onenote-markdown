import parser from "./parser";

describe("Parser tests", () => {
  test("Initial", () => {
    const html = `<html lang="en-NZ">
            <head>
                <title>Hello world </title>
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                <meta name="created" content="2018-09-03T14:08:00.0000000" />
            </head>
            <body>
                <span style="font-size: 10pt; color: #ffffff" data-render-src="source">Hello world</span>
            </body>
        </html>`;
    parser(html);
    expect(true).toBe(false);
  });
});
