/**
 * Common functions relating to operations on nodes.
 */

import {
  ContentNode,
  NodeType,
  PageContent,
  PageContentMutable,
  TagNode,
} from "../model";
import { getOffsetInBuffer, SENTINEL_INDEX } from "./tree";

/**
 * Gets the contents of a node.
 * @param page The page/piece table.
 * @param nodeIndex The index of the node in `page.nodes`.
 */
export function getNodeContent(
  page: PageContent | PageContentMutable,
  nodeIndex: number,
): string {
  if (nodeIndex === SENTINEL_INDEX) {
    return "";
  }
  const node = page.nodes[nodeIndex] as ContentNode;
  if (node.bufferIndex !== undefined) {
    const buffer = page.buffers[node.bufferIndex];
    const startOffset = getOffsetInBuffer(node.bufferIndex, node.start, page);
    const endOffset = getOffsetInBuffer(node.bufferIndex, node.end, page);
    const currentContent = buffer.content.slice(startOffset, endOffset);
    return currentContent;
  } else {
    return "";
  }
}

/**
 * Compares two tags to check that they're a corresponding pair of start and end tags.
 * @param start The proposed start tag.
 * @param end The proposed end tag.
 */
export function areTagEnds(
  start: ContentNode | TagNode,
  end: ContentNode | TagNode,
): boolean {
  if (
    start.nodeType !== NodeType.StartTag ||
    end.nodeType !== NodeType.EndTag
  ) {
    return false;
  }
  if (
    (start as TagNode).id !== (end as TagNode).id ||
    (start as TagNode).tag !== (end as TagNode).tag
  ) {
    return false;
  }
  return true;
}
