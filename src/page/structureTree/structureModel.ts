import { Node, RedBlackTree } from "../pageModel";
import { Style } from "../../editor/render";

export interface KeyValueStr {
  [key: string]: string;
}

export enum TagType {
  EndTag = "EndTag",
  StartEndTag = "StartEndTag",
  StartTag = "StartTag",
}

export function isStructureNode(node: Node): node is StructureNode {
  return (node as StructureNode).leftSubTreeLength !== undefined;
}

export function isStructureRedBlackTree(
  tree: RedBlackTree<Node>,
): tree is RedBlackTree<StructureNode> {
  return isStructureNode(tree.nodes[0]);
}

export interface StructureNode extends Node {
  attributes?: KeyValueStr;
  id: string;
  leftSubTreeLength: number;
  length: number;
  style?: Style;
  tag: keyof HTMLElementTagNameMap;
  tagType: TagType;
}
