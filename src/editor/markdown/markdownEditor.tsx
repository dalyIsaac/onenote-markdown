import React, { useEffect } from "react";
import EditorBase, {
  Stack,
  LastStartNode,
  getLastStartItem,
  BeforeInputType,
  CONTENT_OFFSET,
  IS_BREAK,
  NODE_INDEX,
} from "../editorBase";
import styles from "./markdownEditor.module.css";
import { connect } from "react-redux";
import { PageContent } from "../../page/pageModel";
import { State } from "../../reducer";
import {
  StructureNode,
  TagType,
} from "../../page/structureTree/structureModel";
import { inorderTreeTraversal } from "../../page/tree/tree";
import { getContentBetweenOffsets } from "../../page/contentTree/tree";
import {
  insertContent,
  InsertContentAction,
} from "../../page/contentTree/actions";
import { Dispatch } from "redux";
import {
  SplitStructureAction,
  splitStructureNode,
} from "../../page/structureTree/actions";
import { is } from "ts-type-guards";

/**
 * Definition for items which reside on the stack of elements to be rendered.
 */
interface StackItem {
  node: StructureNode;

  /**
   * The offset of the start of the content for the `StructureNode`.
   */
  contentOffset: number;

  /**
   * The index of the `node` inside the array `structure.nodes`.
   */
  index: number;
}

let cursorSelection: {
  nodeIndex: number;
  selectionOffset: number;
} | null = null;
const selectionRef = React.createRef();

/**
 * Updates the stack by compiling the last `StackItem` which has a
 * `tagType === TagType.StartTag` is compiled, with all the elements on the
 * stack after the last start tag being children.
 * @param stack The stack of `StackItem`s.
 * @param lastStartNode The last `StackItem`, which has
 * `tagType === TagType.StartTag`.
 */
function updateItem(
  page: PageContent,
  stack: Stack<StackItem>,
  { contentOffset, index, node, stackIndex }: LastStartNode<StackItem>,
): Stack<StackItem> {
  const newStack = stack.slice(0, stackIndex);
  let children: Stack<StackItem> | string;
  if (stackIndex === stack.length - 1) {
    const startOffset = contentOffset;
    const endOffset = contentOffset + node.length;
    children = getContentBetweenOffsets(page, startOffset, endOffset);
  } else {
    children = stack.slice(stackIndex);
  }
  const ref =
    cursorSelection && cursorSelection.nodeIndex === index
      ? selectionRef
      : null;
  const element = React.createElement(
    "p",
    {
      ...node.attributes,
      [CONTENT_OFFSET]: contentOffset,
      [NODE_INDEX]: index,
      key: node.id,
      ref,
    },
    children,
  );
  newStack.push(element);
  return newStack;
}

/**
 * Returns the updated stack. The last `StackItem` which has a
 * `tagType === TagType.StartTag` is compiled, with all the elements on the
 * stack after the last start tag being children.
 */
function updateStack(
  page: PageContent,
  stack: Stack<StackItem>,
): Stack<StackItem> {
  const lastStartStackItem = getLastStartItem(stack);
  if (lastStartStackItem) {
    return updateItem(page, stack, lastStartStackItem);
  } else {
    throw new Error(
      "There's a mismatch between the number of start and end tags",
    );
  }
}

/**
 * Adds a React element for a `StartEnd` tag.
 */
function addStartEndTag<T>(
  stack: Stack<T>,
  node: StructureNode,
  nodeIndex: number,
  contentOffset: number,
): void {
  switch (node.tag) {
    case "br": {
      const ref =
        cursorSelection && cursorSelection.nodeIndex === nodeIndex
          ? selectionRef
          : null;
      const props = {
        [NODE_INDEX]: nodeIndex,
        contentoffset: contentOffset,
        isbreak: "true",
        key: node.id,
        ref,
      };
      stack.push(React.createElement("p", props, <br />));
      break;
    }
    default:
      break;
  }
}

/**
 * Returns a `JSX.Element[]` of the OneNote page.
 * @param page The page to render.
 */
function getPage(page: PageContent): JSX.Element[] {
  let stack: Stack<StackItem> = [];
  let contentOffset = 0;
  for (const { index, node } of inorderTreeTraversal(page.structure)) {
    switch (node.tagType) {
      case TagType.StartTag: {
        stack.push({ contentOffset, index, node });
        contentOffset += node.length;
        break;
      }
      case TagType.EndTag: {
        stack = updateStack(page, stack);
        break;
      }
      case TagType.StartEndTag: {
        addStartEndTag(stack, node, index, contentOffset);
        break;
      }
    }
  }
  return stack as JSX.Element[];
}

interface SelectionOffset {
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

/**
 * Returns the start, selection point, and end offsets inside the entire page,
 * given the node and selection offset.
 */
function getOffsets(
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
function offsetsAreEqual(
  firstOffset: SelectionOffset,
  secondOffset: SelectionOffset,
): boolean {
  return (
    firstOffset.startOffset === secondOffset.startOffset &&
    firstOffset.selectionOffset === secondOffset.selectionOffset &&
    firstOffset.endOffset === secondOffset.endOffset
  );
}

function isBreak(
  element: Element,
): { result: boolean; element: Element | null } {
  let currentElement: Element | null;
  if (element.attributes.length === 0) {
    currentElement = element.parentElement;
  } else {
    currentElement = element;
  }

  if (currentElement) {
    const breakAttr = currentElement.attributes.getNamedItem(IS_BREAK);
    if (breakAttr && breakAttr.value === true.toString()) {
      return { element: currentElement, result: true };
    }
  }
  return { element: currentElement, result: false };
}

export function MarkdownEditorComponent(
  props: MarkdownEditorStateProps & MarkdownEditorDispatchProps,
): JSX.Element {
  function insertContent(
    parentElement: Element | null,
    anchorOffset: number,
    content: string,
    startOffsets: SelectionOffset,
  ): void {
    if (parentElement) {
      const structureNodeIndex = parentElement.attributes.getNamedItem(
        NODE_INDEX,
      );
      const contentOffset = parentElement.attributes.getNamedItem(
        CONTENT_OFFSET,
      );
      if (structureNodeIndex && contentOffset) {
        const structureNodeIndexValue = Number(structureNodeIndex.value);
        const contentOffsetValue = Number(contentOffset.value);
        if (content === "\n") {
          cursorSelection = {
            nodeIndex: props.page.structure.nodes.length,
            selectionOffset: 0,
          };
          props.splitStructureNode(
            props.pageId,
            structureNodeIndexValue,
            startOffsets.selectionOffset,
            anchorOffset,
          );
        } else {
          cursorSelection = {
            nodeIndex: structureNodeIndexValue,
            selectionOffset: anchorOffset + content.length,
          };
          props.insertContent(
            props.pageId,
            content,
            startOffsets.selectionOffset,
            structureNodeIndexValue,
            contentOffsetValue,
          );
        }
      }
    }
  }

  function inputOnBreak(element: Element, content: string): void {
    const structureNodeIndex = element.attributes.getNamedItem(NODE_INDEX);
    const contentOffset = element.attributes.getNamedItem(CONTENT_OFFSET);
    if (structureNodeIndex && contentOffset) {
      const structureNodeIndexValue = Number(structureNodeIndex.value);
      const contentOffsetValue = Number(contentOffset.value);
      if (content === "\n") {
        cursorSelection = {
          nodeIndex: props.page.structure.nodes.length,
          selectionOffset: 0,
        };
        props.splitStructureNode(
          props.pageId,
          structureNodeIndexValue,
          contentOffsetValue,
          0,
        );
      } else {
        cursorSelection = {
          nodeIndex: structureNodeIndexValue,
          selectionOffset: content.length,
        };
        props.insertContent(
          props.pageId,
          content,
          contentOffsetValue,
          structureNodeIndexValue,
          contentOffsetValue,
        );
      }
    }
  }

  function onBeforeInput(e: BeforeInputType): void {
    e.preventDefault();
    const {
      anchorNode,
      anchorOffset,
      focusNode,
      focusOffset,
    } = window.getSelection();
    const startOffsets = getOffsets(anchorNode, anchorOffset);
    const endOffsets = getOffsets(focusNode, focusOffset);

    if (offsetsAreEqual(startOffsets, endOffsets)) {
      if (is(Element)(anchorNode)) {
        const { result, element } = isBreak(anchorNode);
        if (result && element) {
          inputOnBreak(element, e.data);
        }
      } else {
        insertContent(
          anchorNode.parentElement,
          anchorOffset,
          e.data,
          startOffsets,
        );
      }
    }
  }

  window.getSelection().empty();
  useEffect(() => {
    if (cursorSelection) {
      const selection = window.getSelection();
      selection.empty();
      const range = document.createRange();
      const node = (selectionRef.current as HTMLSpanElement).firstChild;
      range.setStart(node!, cursorSelection.selectionOffset);
      selection.addRange(range);
    }
  });

  return (
    <div className={styles.editor}>
      <EditorBase
        getPage={getPage}
        page={props.page}
        onBeforeInput={onBeforeInput}
      />
    </div>
  );
}

/**
 * Props for the `MarkdownEditorComponent`
 */
interface MarkdownEditorStateProps {
  pageId: string;
  page: PageContent;
}

interface MarkdownEditorDispatchProps {
  insertContent: (
    pageId: string,
    content: string,
    offset: number,
    structureNodeIndex: number,
    structureNodeOffset: number,
  ) => InsertContentAction;
  splitStructureNode: (
    pageId: string,
    nodeIndex: number,
    nodeContentOffset: number,
    localContentOffset: number,
  ) => SplitStructureAction;
}

const mapStateToProps = (state: State): MarkdownEditorStateProps => ({
  page: state.pages[state.selectedPage],
  pageId: state.selectedPage,
});

const mapDispatchToProps = (
  dispatch: Dispatch,
): MarkdownEditorDispatchProps => ({
  insertContent: (
    pageId,
    content,
    offset,
    structureNodeIndex,
    structureNodeOffset,
  ): InsertContentAction =>
    dispatch(
      insertContent(
        pageId,
        content,
        offset,
        structureNodeIndex,
        structureNodeOffset,
      ),
    ),
  splitStructureNode: (
    pageId: string,
    nodeIndex: number,
    nodeContentOffset: number,
    localContentOffset: number,
  ): SplitStructureAction =>
    dispatch(
      splitStructureNode(
        pageId,
        nodeIndex,
        nodeContentOffset,
        localContentOffset,
      ),
    ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MarkdownEditorComponent);
