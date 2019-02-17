import { PageContentMutable, Color } from "../pageModel";
import { SplitStructureAction } from "./actions";
import { findEndTag, generateNewId } from "./tree";
import { StructureNodeMutable, TagType } from "./structureModel";
import { SENTINEL_INDEX } from "../tree/tree";
import { insertNode, fixInsert } from "../tree/insert";

export function splitStructureNode(
  page: PageContentMutable,
  {
    nodeIndex: startNodeIndex,
    localContentOffset,
    nodeContentOffset,
  }: SplitStructureAction,
): void {
  const startNode: StructureNodeMutable = {
    ...page.structure.nodes[startNodeIndex],
  };
  const endTag = findEndTag(page.structure, startNode.id, startNodeIndex);
  if (endTag === null) {
    throw new RangeError(
      `Could not find the expected node whose id is ${startNode.id}`,
    );
  }
  const { index: endIndex } = endTag;

  const secondStartNode: StructureNodeMutable = {
    color: Color.Red,
    id: generateNewId(),
    left: SENTINEL_INDEX,
    leftSubTreeLength: 0,
    length: startNode.length - localContentOffset,
    parent: SENTINEL_INDEX,
    right: SENTINEL_INDEX,
    style: { marginBottom: "0pt", marginTop: "0pt" },
    tag: "p",
    tagType: TagType.StartTag,
  };
  const secondEndNode: StructureNodeMutable = {
    color: Color.Red,
    id: secondStartNode.id,
    left: SENTINEL_INDEX,
    leftSubTreeLength: 0,
    length: 0,
    parent: SENTINEL_INDEX,
    right: SENTINEL_INDEX,
    tag: "p",
    tagType: TagType.EndTag,
  };

  startNode.length = localContentOffset;

  // TODO: check if secondStartNode has a length of 0, then handle appropriately
  page.structure.nodes[startNodeIndex] = startNode;

  insertNode(
    page.structure,
    secondStartNode,
    nodeContentOffset + localContentOffset,
    endIndex,
  );
  fixInsert(page.structure, page.structure.nodes.length - 1);
  insertNode(
    page.structure,
    secondEndNode,
    nodeContentOffset + localContentOffset,
    page.structure.nodes.length - 1,
  );
  fixInsert(page.structure, page.structure.nodes.length - 1);
}
