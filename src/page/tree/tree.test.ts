import { getPage } from "../contentTree/tree.test";
import {
  getNextNode,
  getPrevNode,
  recomputeTreeMetadata,
  inorderTreeTraversal,
  NodePosition,
} from "./tree";
import { ContentNode } from "../contentTree/contentModel";
import { getStartPage } from "../reducer.test";
import { getBigTree } from "../structureTree/insert.test";
import { StructureNode } from "../structureTree/structureModel";

describe("Common tree operations", () => {
  test("getNextNode", () => {
    const page = getPage();

    expect(getNextNode(getPage().content.nodes, 1)).toStrictEqual({
      index: 2,
      node: page.content.nodes[2],
    });
    expect(getNextNode(getPage().content.nodes, 2)).toStrictEqual({
      index: 3,
      node: page.content.nodes[3],
    });
    expect(getNextNode(getPage().content.nodes, 3)).toStrictEqual({
      index: 4,
      node: page.content.nodes[4],
    });
    expect(getNextNode(getPage().content.nodes, 4)).toStrictEqual({
      index: 5,
      node: page.content.nodes[5],
    });
    expect(getNextNode(getPage().content.nodes, 5)).toStrictEqual({
      index: 6,
      node: page.content.nodes[6],
    });
    expect(getNextNode(getPage().content.nodes, 6)).toStrictEqual({
      index: 7,
      node: page.content.nodes[7],
    });
    expect(getNextNode(getPage().content.nodes, 7)).toStrictEqual({
      index: 0,
      node: page.content.nodes[0],
    });
  });

  test("getPrevNode", () => {
    const page = getPage();

    expect(getPrevNode(getPage().content.nodes, 7)).toStrictEqual({
      index: 6,
      node: page.content.nodes[6],
    });
    expect(getPrevNode(getPage().content.nodes, 6)).toStrictEqual({
      index: 5,
      node: page.content.nodes[5],
    });
    expect(getPrevNode(getPage().content.nodes, 5)).toStrictEqual({
      index: 4,
      node: page.content.nodes[4],
    });
    expect(getPrevNode(getPage().content.nodes, 4)).toStrictEqual({
      index: 3,
      node: page.content.nodes[3],
    });
    expect(getPrevNode(getPage().content.nodes, 3)).toStrictEqual({
      index: 2,
      node: page.content.nodes[2],
    });
    expect(getPrevNode(getPage().content.nodes, 2)).toStrictEqual({
      index: 1,
      node: page.content.nodes[1],
    });
    expect(getPrevNode(getPage().content.nodes, 1)).toStrictEqual({
      index: 0,
      node: page.content.nodes[0],
    });
  });

  test("Recompute tree metadata: add a node to the end", () => {
    const page = getPage(); // hypothetically added the last node
    recomputeTreeMetadata(page.content, 7);
    expect(page).toStrictEqual(getPage());
  });

  test("Recompute tree metadata: add a node in the middle", () => {
    const page = getPage(); // hypothetically added node 5
    (page.content.nodes[6] as ContentNode).leftCharCount = 12;
    (page.content.nodes[5] as ContentNode).lineFeedCount = 5;
    const expectedPage = getPage();
    (expectedPage.content.nodes[6] as ContentNode).leftLineFeedCount += 5;
    (expectedPage.content.nodes[5] as ContentNode).lineFeedCount += 5;

    recomputeTreeMetadata(page.content, 4);
    expect(page).toStrictEqual(expectedPage);
  });

  describe("inOrderTreeTraversal", () => {
    describe("Content nodes", () => {
      test("Tree which is already in order", () => {
        const page = getPage();
        let i = 1;
        let offset = 0;
        for (const result of inorderTreeTraversal(page.content)) {
          expect(result).toEqual({
            index: i,
            node: page.content.nodes[i],
            offset,
          });
          offset += result.node.length;
          i++;
        }
      });

      test("Big tree which is already in order", () => {
        const page = getStartPage();
        let i = 1;
        let offset = 0;
        for (const result of inorderTreeTraversal(page.content)) {
          expect(result).toEqual({
            index: i,
            node: page.content.nodes[i],
            offset,
          });
          offset += result.node.length;
          i++;
        }
      });

      test("Big tree which has its order adjusted", () => {
        const page = getStartPage();
        (page.content.nodes[7] as ContentNode).parent = 3;
        (page.content.nodes[8] as ContentNode).left = 0;
        (page.content.nodes[3] as ContentNode).right = 7;
        const expectedResult: Array<NodePosition<ContentNode>> = [
          { index: 1, node: page.content.nodes[1] },
          { index: 2, node: page.content.nodes[2] },
          { index: 3, node: page.content.nodes[3] },
          { index: 7, node: page.content.nodes[7] },
          { index: 4, node: page.content.nodes[4] },
          { index: 5, node: page.content.nodes[5] },
          { index: 6, node: page.content.nodes[6] },
          { index: 8, node: page.content.nodes[8] },
          { index: 9, node: page.content.nodes[9] },
          { index: 10, node: page.content.nodes[10] },
          { index: 11, node: page.content.nodes[11] },
        ];

        let i = 0;
        let offset = 0;
        for (const result of inorderTreeTraversal(page.content)) {
          expect(result).toEqual({ ...expectedResult[i], offset });
          offset += result.node.length;
          i++;
        }
      });
    });

    describe("Structure nodes", () => {
      test("Big tree", () => {
        const page = getBigTree();
        const expectedResult: Array<NodePosition<StructureNode>> = [
          { index: 1, node: page.structure.nodes[1] },
          { index: 2, node: page.structure.nodes[2] },
          { index: 3, node: page.structure.nodes[3] },
          { index: 4, node: page.structure.nodes[4] },
          { index: 5, node: page.structure.nodes[5] },
          { index: 6, node: page.structure.nodes[6] },
          { index: 7, node: page.structure.nodes[7] },
          { index: 14, node: page.structure.nodes[14] },
          { index: 8, node: page.structure.nodes[8] },
          { index: 9, node: page.structure.nodes[9] },
          { index: 10, node: page.structure.nodes[10] },
          { index: 11, node: page.structure.nodes[11] },
          { index: 12, node: page.structure.nodes[12] },
          { index: 13, node: page.structure.nodes[13] },
        ];

        let i = 0;
        let offset = 0;
        for (const result of inorderTreeTraversal(page.structure)) {
          expect(result).toEqual({ ...expectedResult[i], offset });
          offset += result.node.length;
          i++;
        }
      });
    });
  });
});
