import { getPage } from "../contentTree/tree.test";
import { nextNode, prevNode, recomputeContentTreeMetadata } from "./tree";
import { ContentNodeMutable } from "../contentTree/contentModel";

describe("Common tree operations", () => {
  test("nextNode", () => {
    const page = getPage();

    expect(nextNode(getPage().content.nodes, 1)).toStrictEqual({
      index: 2,
      node: page.content.nodes[2],
    });
    expect(nextNode(getPage().content.nodes, 2)).toStrictEqual({
      index: 3,
      node: page.content.nodes[3],
    });
    expect(nextNode(getPage().content.nodes, 3)).toStrictEqual({
      index: 4,
      node: page.content.nodes[4],
    });
    expect(nextNode(getPage().content.nodes, 4)).toStrictEqual({
      index: 5,
      node: page.content.nodes[5],
    });
    expect(nextNode(getPage().content.nodes, 5)).toStrictEqual({
      index: 6,
      node: page.content.nodes[6],
    });
    expect(nextNode(getPage().content.nodes, 6)).toStrictEqual({
      index: 7,
      node: page.content.nodes[7],
    });
    expect(nextNode(getPage().content.nodes, 7)).toStrictEqual({
      index: 0,
      node: page.content.nodes[0],
    });
  });

  test("prevNode", () => {
    const page = getPage();

    expect(prevNode(getPage().content.nodes, 7)).toStrictEqual({
      index: 6,
      node: page.content.nodes[6],
    });
    expect(prevNode(getPage().content.nodes, 6)).toStrictEqual({
      index: 5,
      node: page.content.nodes[5],
    });
    expect(prevNode(getPage().content.nodes, 5)).toStrictEqual({
      index: 4,
      node: page.content.nodes[4],
    });
    expect(prevNode(getPage().content.nodes, 4)).toStrictEqual({
      index: 3,
      node: page.content.nodes[3],
    });
    expect(prevNode(getPage().content.nodes, 3)).toStrictEqual({
      index: 2,
      node: page.content.nodes[2],
    });
    expect(prevNode(getPage().content.nodes, 2)).toStrictEqual({
      index: 1,
      node: page.content.nodes[1],
    });
    expect(prevNode(getPage().content.nodes, 1)).toStrictEqual({
      index: 0,
      node: page.content.nodes[0],
    });
  });

  test("Recompute tree metadata: add a node to the end", () => {
    const page = getPage(); // hypothetically added the last node
    recomputeContentTreeMetadata(page.content, 7);
    expect(page).toStrictEqual(getPage());
  });

  test("Recompute tree metadata: add a node in the middle", () => {
    const page = getPage(); // hypothetically added node 5
    (page.content.nodes[6] as ContentNodeMutable).leftCharCount = 12;
    (page.content.nodes[5] as ContentNodeMutable).lineFeedCount = 5;
    const expectedPage = getPage();
    (expectedPage.content
      .nodes[6] as ContentNodeMutable).leftLineFeedCount += 5;
    (expectedPage.content.nodes[5] as ContentNodeMutable).lineFeedCount += 5;

    recomputeContentTreeMetadata(page.content, 4);
    expect(page).toStrictEqual(expectedPage);
  });
});
