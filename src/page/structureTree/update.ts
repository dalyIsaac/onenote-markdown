import { PageContentMutable } from "../pageModel";
import { KeyValueStr, StructureNodeMutable } from "./structureModel";

export interface UpdateStructureValues {
  length?: number;
  style?: KeyValueStr;
  attributes?: KeyValueStr;
}

export function updateStructureNode(
  page: PageContentMutable,
  nodeIndex: number,
  props: UpdateStructureValues,
): void {
  const node = page.structure.nodes[nodeIndex];
  const newNode: StructureNodeMutable = { ...node };
  const { length, style, attributes } = props;
  newNode.style = style || newNode.style;
  newNode.attributes = attributes || newNode.attributes;
  newNode.length = length || newNode.length;
  page.structure.nodes[nodeIndex] = newNode;
}
