import { PageContent } from "../pageModel";
import { KeyValueStr } from "./structureModel";

export interface UpdateStructureValues {
  length?: number;
  style?: KeyValueStr;
  attributes?: KeyValueStr;
}

export function updateStructureNode(
  page: PageContent,
  nodeIndex: number,
  props: UpdateStructureValues,
): void {
  const node = page.structure.nodes[nodeIndex];
  const { length, style, attributes } = props;
  node.style = style || node.style;
  node.attributes = attributes || node.attributes;
  node.length = length || node.length;
  page.structure.nodes[nodeIndex] = node;
}
