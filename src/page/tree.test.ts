import { nextNode, prevNode } from "./tree";
import { getPage } from "./internalTree/tree.test";

describe("Common tree operations", () => {
  test("nextNode", () => {
    const page = getPage();

    expect(nextNode(getPage(), 1)).toStrictEqual({
      node: page.nodes[2],
      index: 2,
    });
    expect(nextNode(getPage(), 2)).toStrictEqual({
      node: page.nodes[3],
      index: 3,
    });
    expect(nextNode(getPage(), 3)).toStrictEqual({
      node: page.nodes[4],
      index: 4,
    });
    expect(nextNode(getPage(), 4)).toStrictEqual({
      node: page.nodes[5],
      index: 5,
    });
    expect(nextNode(getPage(), 5)).toStrictEqual({
      node: page.nodes[6],
      index: 6,
    });
    expect(nextNode(getPage(), 6)).toStrictEqual({
      node: page.nodes[7],
      index: 7,
    });
    expect(nextNode(getPage(), 7)).toStrictEqual({
      node: page.nodes[0],
      index: 0,
    });
  });

  test("prevNode", () => {
    const page = getPage();

    expect(prevNode(getPage(), 7)).toStrictEqual({
      node: page.nodes[6],
      index: 6,
    });
    expect(prevNode(getPage(), 6)).toStrictEqual({
      node: page.nodes[5],
      index: 5,
    });
    expect(prevNode(getPage(), 5)).toStrictEqual({
      node: page.nodes[4],
      index: 4,
    });
    expect(prevNode(getPage(), 4)).toStrictEqual({
      node: page.nodes[3],
      index: 3,
    });
    expect(prevNode(getPage(), 3)).toStrictEqual({
      node: page.nodes[2],
      index: 2,
    });
    expect(prevNode(getPage(), 2)).toStrictEqual({
      node: page.nodes[1],
      index: 1,
    });
    expect(prevNode(getPage(), 1)).toStrictEqual({
      node: page.nodes[0],
      index: 0,
    });
  });
});
