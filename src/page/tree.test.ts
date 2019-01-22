import { getPage } from "./contentTree/tree.test";
import { nextNode, prevNode } from "./tree";

describe("Common tree operations", () => {
  test("nextNode", () => {
    const page = getPage();

    expect(nextNode(getPage().contentNodes, 1)).toStrictEqual({
      index: 2,
      node: page.contentNodes[2],
    });
    expect(nextNode(getPage().contentNodes, 2)).toStrictEqual({
      index: 3,
      node: page.contentNodes[3],
    });
    expect(nextNode(getPage().contentNodes, 3)).toStrictEqual({
      index: 4,
      node: page.contentNodes[4],
    });
    expect(nextNode(getPage().contentNodes, 4)).toStrictEqual({
      index: 5,
      node: page.contentNodes[5],
    });
    expect(nextNode(getPage().contentNodes, 5)).toStrictEqual({
      index: 6,
      node: page.contentNodes[6],
    });
    expect(nextNode(getPage().contentNodes, 6)).toStrictEqual({
      index: 7,
      node: page.contentNodes[7],
    });
    expect(nextNode(getPage().contentNodes, 7)).toStrictEqual({
      index: 0,
      node: page.contentNodes[0],
    });
  });

  test("prevNode", () => {
    const page = getPage();

    expect(prevNode(getPage().contentNodes, 7)).toStrictEqual({
      index: 6,
      node: page.contentNodes[6],
    });
    expect(prevNode(getPage().contentNodes, 6)).toStrictEqual({
      index: 5,
      node: page.contentNodes[5],
    });
    expect(prevNode(getPage().contentNodes, 5)).toStrictEqual({
      index: 4,
      node: page.contentNodes[4],
    });
    expect(prevNode(getPage().contentNodes, 4)).toStrictEqual({
      index: 3,
      node: page.contentNodes[3],
    });
    expect(prevNode(getPage().contentNodes, 3)).toStrictEqual({
      index: 2,
      node: page.contentNodes[2],
    });
    expect(prevNode(getPage().contentNodes, 2)).toStrictEqual({
      index: 1,
      node: page.contentNodes[1],
    });
    expect(prevNode(getPage().contentNodes, 1)).toStrictEqual({
      index: 0,
      node: page.contentNodes[0],
    });
  });
});
