import { PageContentMutable } from "../pageModel";
import { KeyValueStr, StructureNodeMutable } from "./structureModel";

export interface UpdateStructureValues {
  length?: number;
  styles?: KeyValueStr;
  attributes?: KeyValueStr;
}

export function updateStructureNode(
  page: PageContentMutable,
  nodeIndex: number,
  props: UpdateStructureValues,
): void {
  const node = page.structure.nodes[nodeIndex];
  const newNode: StructureNodeMutable = { ...node };
  const { length, styles, attributes } = props;
  newNode.styles = styles || newNode.styles;
  newNode.attributes = attributes || newNode.attributes;
  newNode.length = length || newNode.length;
  page.structure.nodes[nodeIndex] = newNode;
}
