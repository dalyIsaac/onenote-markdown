import { Color } from "../pageModel";
import { SENTINEL_INDEX } from "../tree";
import { StructureNode } from "./structureModel";

export const SENTINEL_STRUCTURE: StructureNode = {
  color: Color.Black,
  id: "",
  left: SENTINEL_INDEX,
  leftSubTreeLength: 0,
  parent: SENTINEL_INDEX,
  right: SENTINEL_INDEX,
  tag: "",
};
