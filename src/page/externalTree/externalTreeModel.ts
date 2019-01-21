import { Node } from "../pageModel";

export interface KeyValueStr {
  [key: string]: string;
}

export interface InternalTreeNode {
  readonly tag: string;
  readonly id: string;
  readonly leftSubtreeLength: number;
  readonly styles?: KeyValueStr;
}

export interface InternalTreeNodeMutable {
  tag: string;
  id: string;
  leftSubtreeLength: number;
  styles?: KeyValueStr;
}
