import { Node, NodeMutable } from "../pageModel";

export interface KeyValueStr {
  [key: string]: string;
}

export function isStructureNode(node: Node): node is StructureNode {
  return (node as StructureNode).leftSubTreeLength !== undefined;
}

export interface StructureNode extends Node {
  readonly tag: string;
  readonly id: string;
  readonly leftSubTreeLength: number;
  readonly styles?: KeyValueStr;
}

export interface StructureNodeMutable extends NodeMutable {
  tag: string;
  id: string;
  leftSubTreeLength: number;
  styles?: KeyValueStr;
}
