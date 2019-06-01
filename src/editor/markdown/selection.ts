import { STRUCTURE_NODE_INDEX } from "../editorBase";

interface StructureNodeProperties {
  contentOffset: number;
  structureNodeIndex: number;
  isBreak: boolean;
}

export interface EditorSelection {
  start: { localOffset: number } | StructureNodeProperties;
  end: { localOffset: number } | StructureNodeProperties;
}

function isElement(item: Node | Element): item is Element {
  return (item as Element).attributes !== undefined;
}

function getContentOffset(map: NamedNodeMap): number | null {
  const attr = map.getNamedItem("contentoffset");
  if (attr === null) {
    return null;
  }
  return parseInt(attr.value);
}

function getStructureNodeIndex(map: NamedNodeMap): number | null {
  const attr = map.getNamedItem(STRUCTURE_NODE_INDEX);
  if (attr === null) {
    return null;
  }
  return parseInt(attr.value);
}

function getIsBreak(map: NamedNodeMap): boolean {
  const attr = map.getNamedItem("isbreak");
  if (attr === null) {
    return false;
  }
  return Boolean(attr.value);
}

function getStructureNodeProperties(
  map: NamedNodeMap,
): StructureNodeProperties | null {
  const contentoffset = getContentOffset(map);
  const structureNodeIndex = getStructureNodeIndex(map);
  const isbreak = getIsBreak(map);

  if (contentoffset === null || structureNodeIndex === null) {
    return null;
  }

  return {
    contentOffset: contentoffset,
    isBreak: isbreak,
    structureNodeIndex: structureNodeIndex,
  };
}

function getAttributes(
  node: Node | Element | null,
): StructureNodeProperties | null {
  if (node === null) {
    return null;
  } else if (isElement(node)) {
    return getStructureNodeProperties(node.attributes);
  } else if (node.parentElement === null) {
    return null;
  } else {
    return getStructureNodeProperties(node.parentElement.attributes);
  }
}

export default function getEditorSelection(): EditorSelection | null {
  const selection = window.getSelection();
  if (selection === null) {
    return null;
  }

  const { anchorNode, anchorOffset, focusNode, focusOffset } = selection;

  const anchorAttr = getAttributes(anchorNode);
  const focusAttr = getAttributes(focusNode);

  if (anchorAttr === null || focusAttr === null) {
    return null;
  }

  const start = {
    ...anchorAttr,
    localOffset: anchorOffset,
  };

  const end = {
    ...focusAttr,
    localOffset: focusOffset,
  };

  return { end, start };
}
