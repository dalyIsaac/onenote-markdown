import { CONTENT_OFFSET, IS_BREAK } from "../editorBase";
import { is } from "ts-type-guards";
import React from "react";

export interface SelectionOffset {
  /**
   * The offset of the start of the node, in terms of the page's content.
   */
  startOffset: number;

  /**
   * The offset of the selection, in terms of the page's content.
   */
  selectionOffset: number;

  /**
   * The offset of the end of the node, in terms of the page's content.
   */
  endOffset: number;
}

type CursorSelection = {
  nodeIndex: number;
  selectionOffset: number;
} | null;

export const selectionProps: {
  cursorSelection: CursorSelection;
  ref: React.RefObject<{}>;
} = {
  cursorSelection: null,
  ref: React.createRef(),
};

/**
 * Updates the current cursor selection with the node index and selection
 * offset.
 * @param nodeIndex
 * @param selectionOffset
 */
export function updateCursorSelection(
  nodeIndex: number,
  selectionOffset: number,
): void {
  selectionProps.cursorSelection = { nodeIndex, selectionOffset };
}

/**
 * Sets to null the cursor selection.
 */
export function wipeCursorSelection(): void {
  selectionProps.cursorSelection = null;
}

/**
 * Returns the start, selection point, and end offsets inside the entire page,
 * given the node and selection offset.
 */
export function getOffsets(
  node: Node | Element,
  selectionOffset: number,
): SelectionOffset {
  let target: Element | null;
  if (is(Element)(node) && node.attributes.length !== 0) {
    // node.attributes.length === 0 when node is <br />
    target = node;
  } else {
    target = node.parentElement;
  }

  if (target) {
    const startOffsetStr = target.attributes.getNamedItem(CONTENT_OFFSET);
    if (!startOffsetStr) {
      throw new Error("Unable to retrieve the contentoffset for the node.");
    }
    const startOffset = Number(startOffsetStr.value);
    if (node.textContent) {
      return {
        endOffset: startOffset + node.textContent.length,
        selectionOffset: startOffset + selectionOffset,
        startOffset,
      };
    } else if (target.attributes.getNamedItem(IS_BREAK)) {
      return {
        endOffset: startOffset,
        selectionOffset: 0,
        startOffset,
      };
    } else {
      throw new Error("The DOM node does not contain text.");
    }
  } else {
    throw new Error("DOM node doesn't have a parent node.");
  }
}

/**
 * Compares two `SelectionOffset` objects to see if they're identical.
 */
export function offsetsAreEqual(
  firstOffset: SelectionOffset,
  secondOffset: SelectionOffset,
): boolean {
  return (
    firstOffset.startOffset === secondOffset.startOffset &&
    firstOffset.selectionOffset === secondOffset.selectionOffset &&
    firstOffset.endOffset === secondOffset.endOffset
  );
}

/**
 * Returns the current selection, given that nothing is null.
 */
export function getSelectionSafe(): {
  anchorNode: Node;
  anchorOffset: number;
  focusNode: Node;
  focusOffset: number;
} {
  const selection = window.getSelection();
  if (selection === null) {
    throw new Error("Selection is null");
  }
  const { anchorNode, anchorOffset, focusNode, focusOffset } = selection;
  if (anchorNode === null) {
    throw new Error("Anchor node is null");
  } else if (focusNode === null) {
    throw new Error("Focus node is null");
  }
  return { anchorNode, anchorOffset, focusNode, focusOffset };
}
