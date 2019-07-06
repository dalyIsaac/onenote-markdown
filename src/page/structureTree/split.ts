import { PageContent, Color } from "../pageModel";
import { SplitStructureAction } from "./actions";
import { findEndNode, generateNewId } from "./tree";
import { TagType, StructureNode } from "./structureModel";
import { SENTINEL_INDEX } from "../tree/tree";
import { insertNode, fixInsert } from "../tree/insert";
import { Omit } from "react-redux";

function splitPopulatedNode(
  page: PageContent,
  startNode: StructureNode,
  localContentOffset: number,
  nodeContentOffset: number,
  endIndex: number,
): void {
  const secondStartNode: StructureNode = {
    color: Color.Red,
    id: generateNewId("p"),
    left: SENTINEL_INDEX,
    leftSubTreeLength: 0,
    length: startNode.length - localContentOffset,
    parent: SENTINEL_INDEX,
    right: SENTINEL_INDEX,
    style: { marginBottom: "0pt", marginTop: "0pt" },
    tag: "p",
    tagType: TagType.StartTag,
  };
  const secondEndNode: StructureNode = {
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

function insertNewBreak(
  page: PageContent,
  nodeContentOffset: number,
  previousBreakIndex: number,
): void {
  const newNode: StructureNode = {
    color: Color.Red,
    id: generateNewId("p"),
    left: SENTINEL_INDEX,
    leftSubTreeLength: 0,
    length: 0,
    parent: SENTINEL_INDEX,
    right: SENTINEL_INDEX,
    tag: "br",
    tagType: TagType.StartEndTag,
  };
  insertNode(page.structure, newNode, nodeContentOffset, previousBreakIndex);
  fixInsert(page.structure, page.structure.nodes.length - 1);
}

/**
 * Splits a `StructureNode` if the node is populated, or inserts a `<br />` tag.
 */
export function splitStructureNode(
  page: PageContent,
  { nodeIndex, localOffset, nodeOffset }: Omit<SplitStructureAction, "pageId">,
): void {
  const startNode: StructureNode = page.structure.nodes[nodeIndex];

  if (startNode.tag === "br" && startNode.tagType === TagType.StartEndTag) {
    insertNewBreak(page, nodeOffset, nodeIndex);
    return;
  }

  const endTag = findEndNode(page.structure, startNode.id, nodeIndex);
  if (endTag === null) {
    throw new RangeError(
      `Could not find the expected node whose id is ${startNode.id}`,
    );
  }
  const { index: endIndex } = endTag;

  if (startNode.length === localOffset) {
    insertNewBreak(page, nodeOffset, endIndex);
  } else {
    page.structure.nodes[nodeIndex] = startNode;
    splitPopulatedNode(page, startNode, localOffset, nodeOffset, endIndex);
  }
}
