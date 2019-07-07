import {
  STRUCTURE_NODE_INDEX,
  CONTENT_NODE_START_INDEX,
  CONTENT_NODE_START_OFFSET,
  CONTENT_NODE_END_OFFSET,
  CONTENT_NODE_END_INDEX,
} from "./render";
import { ContentBoundary } from "../page/contentTree/tree";

/**
 * Describes a `StructureNode` in relation to its `RedBlackTree`, and its
 * constituent `ContentNode`s.
 */
interface StructureNodeProperties {
  structureNodeIndex: number;
  start: ContentBoundary;
  end: ContentBoundary;
}

/**
 * Describes a boundary for selection within the context of a `StructureNode`.
 */
export interface SelectionBoundary extends StructureNodeProperties {
  localOffset: number;
}

/**
 * Describes the current editor selection.
 */
export interface EditorSelection {
  anchor: SelectionBoundary;
  focus: SelectionBoundary;
}

function isElement(item: Node | Element): item is Element {
  return (item as Element).attributes !== undefined;
}

function getIntegerAttribute(name: string, map: NamedNodeMap): number {
  const attr = map.getNamedItem(name);
  if (attr === null) {
    throw new TypeError(`Could not find attribute "${name}"`);
  }
  return parseInt(attr.value);
}

const getStructureNodeProperties = (
  map: NamedNodeMap,
): StructureNodeProperties => ({
  end: {
    nodeIndex: getIntegerAttribute(CONTENT_NODE_END_INDEX, map),
    nodeLocalOffset: getIntegerAttribute(CONTENT_NODE_END_OFFSET, map),
  },
  start: {
    nodeIndex: getIntegerAttribute(CONTENT_NODE_START_INDEX, map),
    nodeLocalOffset: getIntegerAttribute(CONTENT_NODE_START_OFFSET, map),
  },
  structureNodeIndex: getIntegerAttribute(STRUCTURE_NODE_INDEX, map),
});

function getNodeAttributes(
  node: Node | Element | null,
): StructureNodeProperties {
  if (node === null) {
    throw new TypeError("The given node was null");
  } else if (isElement(node)) {
    return getStructureNodeProperties(node.attributes);
  }

  if (node.parentElement === null) {
    throw new TypeError("The given node did not have a parent element");
  } else {
    return getStructureNodeProperties(node.parentElement.attributes);
  }
}

export default function getEditorSelection(
  shadow: ShadowRoot,
): EditorSelection | null {
  const selection = shadow.getSelection();
  if (selection === null) {
    return null;
  }

  const { anchorNode, anchorOffset, focusNode, focusOffset } = selection;

  try {
    const anchorAttr = getNodeAttributes(anchorNode);
    const focusAttr = getNodeAttributes(focusNode);

    return {
      anchor: {
        ...anchorAttr,
        localOffset: anchorOffset,
      },
      focus: {
        ...focusAttr,
        localOffset: focusOffset,
      },
    };
  } catch (error) {
    return null;
  }
}
