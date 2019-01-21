import { getPage } from "./contentTree/tree.test";
import { nextNode, prevNode } from "./tree";

describe("Common tree operations", () => {
  test("nextNode", () => {
    const page = getPage();

    expect(nextNode(getPage().nodes, 1)).toStrictEqual({
      node: page.nodes[2],
      index: 2,
    });
    expect(nextNode(getPage().nodes, 2)).toStrictEqual({
      node: page.nodes[3],
      index: 3,
    });
    expect(nextNode(getPage().nodes, 3)).toStrictEqual({
      node: page.nodes[4],
      index: 4,
    });
    expect(nextNode(getPage().nodes, 4)).toStrictEqual({
      node: page.nodes[5],
      index: 5,
    });
    expect(nextNode(getPage().nodes, 5)).toStrictEqual({
      node: page.nodes[6],
      index: 6,
    });
    expect(nextNode(getPage().nodes, 6)).toStrictEqual({
      node: page.nodes[7],
      index: 7,
    });
    expect(nextNode(getPage().nodes, 7)).toStrictEqual({
      node: page.nodes[0],
      index: 0,
    });
  });

  test("prevNode", () => {
    const page = getPage();

    expect(prevNode(getPage().nodes, 7)).toStrictEqual({
      node: page.nodes[6],
      index: 6,
    });
    expect(prevNode(getPage().nodes, 6)).toStrictEqual({
      node: page.nodes[5],
      index: 5,
    });
    expect(prevNode(getPage().nodes, 5)).toStrictEqual({
      node: page.nodes[4],
      index: 4,
    });
    expect(prevNode(getPage().nodes, 4)).toStrictEqual({
      node: page.nodes[3],
      index: 3,
    });
    expect(prevNode(getPage().nodes, 3)).toStrictEqual({
      node: page.nodes[2],
      index: 2,
    });
    expect(prevNode(getPage().nodes, 2)).toStrictEqual({
      node: page.nodes[1],
      index: 1,
    });
    expect(prevNode(getPage().nodes, 1)).toStrictEqual({
      node: page.nodes[0],
      index: 0,
    });
  });
});
