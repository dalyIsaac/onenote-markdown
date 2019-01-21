import { SENTINEL_INDEX } from "../contentTree/tree";
import { Color } from "../pageModel";
import { StructureNode } from "./structureModel";

export const SENTINEL_STRUCTURE: StructureNode = {
  color: Color.Black,
  parent: SENTINEL_INDEX,
  left: SENTINEL_INDEX,
  right: SENTINEL_INDEX,
  tag: "",
  id: "",
  leftSubTreeLength: 0,
};
