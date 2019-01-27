import { Node, NodeMutable } from "../pageModel";

export interface KeyValueStr {
  [key: string]: string;
}

export enum TagType {
  StartTag = "StartTag",
  EndTag = "EndTag",
  StartEndTag = "StartEndTag",
}

export function isStructureNode(node: Node): node is StructureNode {
  return (node as StructureNode).leftSubTreeLength !== undefined;
}

export interface StructureNode extends Node {
  readonly tag: string;
  readonly tagType: TagType;
  readonly id: string;
  readonly leftSubTreeLength: number;
  readonly length: number;
  readonly styles?: KeyValueStr;
  readonly attributes?: KeyValueStr;
}

export interface StructureNodeMutable extends NodeMutable {
  tag: string;
  tagType: TagType;
  id: string;
  leftSubTreeLength: number;
  length: number;
  styles?: KeyValueStr;
  attributes?: KeyValueStr;
}

export interface StructureRedBlackTree {
  nodes: StructureNode[];
  root: number;
}
