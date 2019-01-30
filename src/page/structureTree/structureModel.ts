import { Node, NodeMutable } from "../pageModel";

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

export interface StructureNode extends Node {
  readonly attributes?: KeyValueStr;
  readonly id: string;
  readonly leftSubTreeLength: number;
  readonly length: number;
  readonly style?: KeyValueStr;
  readonly tag: string;
  readonly tagType: TagType;
}

export interface StructureNodeMutable extends NodeMutable {
  attributes?: KeyValueStr;
  id: string;
  leftSubTreeLength: number;
  length: number;
  style?: KeyValueStr;
  tag: string;
  tagType: TagType;
}

export interface StructureRedBlackTree {
  nodes: StructureNode[];
  root: number;
}
