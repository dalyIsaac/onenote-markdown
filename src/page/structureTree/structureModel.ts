import { Node, NodeMutable } from "../pageModel";

export interface KeyValueStr {
  [key: string]: string;
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
