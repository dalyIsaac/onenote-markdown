import { getPage } from "./contentTree/tree.test";
import { nextNode, prevNode } from "./tree";

describe("Common tree operations", () => {
  test("nextNode", () => {
    const page = getPage();

    expect(nextNode(getPage().contentNodes, 1)).toStrictEqual({
      node: page.contentNodes[2],
      index: 2,
    });
    expect(nextNode(getPage().contentNodes, 2)).toStrictEqual({
      node: page.contentNodes[3],
      index: 3,
    });
    expect(nextNode(getPage().contentNodes, 3)).toStrictEqual({
      node: page.contentNodes[4],
      index: 4,
    });
    expect(nextNode(getPage().contentNodes, 4)).toStrictEqual({
      node: page.contentNodes[5],
      index: 5,
    });
    expect(nextNode(getPage().contentNodes, 5)).toStrictEqual({
      node: page.contentNodes[6],
      index: 6,
    });
    expect(nextNode(getPage().contentNodes, 6)).toStrictEqual({
      node: page.contentNodes[7],
      index: 7,
    });
    expect(nextNode(getPage().contentNodes, 7)).toStrictEqual({
      node: page.contentNodes[0],
      index: 0,
    });
  });

  test("prevNode", () => {
    const page = getPage();

    expect(prevNode(getPage().contentNodes, 7)).toStrictEqual({
      node: page.contentNodes[6],
      index: 6,
    });
    expect(prevNode(getPage().contentNodes, 6)).toStrictEqual({
      node: page.contentNodes[5],
      index: 5,
    });
    expect(prevNode(getPage().contentNodes, 5)).toStrictEqual({
      node: page.contentNodes[4],
      index: 4,
    });
    expect(prevNode(getPage().contentNodes, 4)).toStrictEqual({
      node: page.contentNodes[3],
      index: 3,
    });
    expect(prevNode(getPage().contentNodes, 3)).toStrictEqual({
      node: page.contentNodes[2],
      index: 2,
    });
    expect(prevNode(getPage().contentNodes, 2)).toStrictEqual({
      node: page.contentNodes[1],
      index: 1,
    });
    expect(prevNode(getPage().contentNodes, 1)).toStrictEqual({
      node: page.contentNodes[0],
      index: 0,
    });
  });
});
