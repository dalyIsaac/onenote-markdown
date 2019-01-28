import Parser from "./parser";
import { PageContent } from "./pageModel";
import { SENTINEL_CONTENT } from "./contentTree/tree";
import { SENTINEL_STRUCTURE } from "./structureTree/tree";
import { EMPTY_TREE_ROOT } from "./tree/tree";

describe("Parser tests", () => {
  test("Ensures that the parser can correctly parse the HTML head data.", () => {
    const html =
      `<html lang="en-NZ">` +
      `<head>` +
      `<title>This is the title</title>` +
      `<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />` +
      `<meta name="created" content="2018-09-03T14:08:00.0000000" />` +
      `</head>` +
      `</html>`;
    const page = Parser.parse(html);
    const expectedPage: PageContent = {
      buffers: [],
      charset: "utf-8",
      content: { nodes: [SENTINEL_CONTENT], root: EMPTY_TREE_ROOT },
      created: "2018-09-03T14:08:00.0000000",
      language: "en-NZ",
      previouslyInsertedContentNodeIndex: null,
      previouslyInsertedContentNodeOffset: null,
      structure: { nodes: [SENTINEL_STRUCTURE], root: EMPTY_TREE_ROOT },
      title: "This is the title",
    };
    expect(page).toStrictEqual(expectedPage);
  });
});
