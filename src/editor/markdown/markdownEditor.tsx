import React, { useEffect } from "react";
import EditorBase, {
  BeforeInputType,
  CONTENT_OFFSET,
  IS_BREAK,
  NODE_INDEX,
  getSelectionSafe,
} from "../editorBase";
import styles from "./markdownEditor.module.css";
import { connect } from "react-redux";
import { PageContent } from "../../page/pageModel";
import { State } from "../../reducer";
import {
  deleteContent,
  insertContent,
  InsertContentAction,
  DeleteContentAction,
  Location,
  DeletionType,
} from "../../page/contentTree/actions";
import { Dispatch } from "redux";
import {
  SplitStructureAction,
  splitStructureNode,
} from "../../page/structureTree/actions";
import { is } from "ts-type-guards";
import { getPrevStartNode } from "../../page/structureTree/tree";
import { SelectionOffset, offsetsAreEqual, getOffsets } from "./selection";
import { getPage } from "./stack";

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
          selectionProps.cursorSelection = {
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
          selectionProps.cursorSelection = {
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

  function deleteContent(
    parentElement: Element,
    startOffsets: SelectionOffset,
    endOffsets: SelectionOffset,
    deletionType?: DeletionType,
  ): void {
    const structureNodeIndex = parentElement.attributes.getNamedItem(
      NODE_INDEX,
    );
    if (structureNodeIndex) {
      const structureNodeIndexValue = Number(structureNodeIndex.value);
      const structureNodeContentOffset = Number(
        parentElement.attributes.getNamedItem(CONTENT_OFFSET)!.value,
      );
      const start: Location = {
        contentOffset: startOffsets.selectionOffset,
        structureNodeContentOffset,
        structureNodeIndex: structureNodeIndexValue,
      };
      const end: Location = {
        contentOffset: endOffsets.selectionOffset,
        structureNodeIndex: structureNodeIndexValue,
      };

      const isBreak = parentElement.attributes.getNamedItem(IS_BREAK);
      if (deletionType === "Backspace") {
        const localDeleteStart =
          start.contentOffset - start.structureNodeContentOffset! - 1;
        const { index: prevNodeIndex, node: prevNode } = getPrevStartNode(
          props.page,
          structureNodeIndexValue,
        );
        if (isBreak && isBreak.value === "true") {
          selectionProps.cursorSelection = {
            nodeIndex: prevNodeIndex,
            selectionOffset: prevNode.length,
          };
        } else if (localDeleteStart < 0) {
          selectionProps.cursorSelection = {
            nodeIndex: props.page.structure.nodes.length,
            selectionOffset: prevNode.length,
          };
        } else {
          selectionProps.cursorSelection = {
            nodeIndex: structureNodeIndexValue,
            selectionOffset: localDeleteStart,
          };
        }
      } else if (deletionType === "Delete") {
        // TODO
      }

      props.deleteContent(
        props.pageId,
        start,
        end,
        offsetsAreEqual(startOffsets, endOffsets) ? deletionType : undefined,
      );
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>): void {
    if (e.key === "Backspace" || e.key === "Delete") {
      e.preventDefault();
      const {
        anchorNode,
        anchorOffset,
        focusNode,
        focusOffset,
      } = getSelectionSafe();
      const startOffsets = getOffsets(anchorNode, anchorOffset);
      const endOffsets = getOffsets(focusNode, focusOffset);

      if (anchorNode.parentElement) {
        deleteContent(
          anchorNode.parentElement,
          startOffsets,
          endOffsets,
          e.key,
        );
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
        selectionProps.cursorSelection = {
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
        selectionProps.cursorSelection = {
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
    } = getSelectionSafe();
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

  const selection = window.getSelection();
  if (selection) {
    selection.empty();
  }
  useEffect(() => {
    if (selectionProps.cursorSelection) {
      const selection = window.getSelection();
      if (selection) {
        selection.empty();
        const range = document.createRange();
        const node = (selectionProps.ref.current as HTMLSpanElement).firstChild;
        if (node) {
          range.setStart(node!, selectionProps.cursorSelection.selectionOffset);
          selection.addRange(range);
        }
      }
    }
  });

  return (
    <div className={styles.editor}>
      <EditorBase
        getPage={getPage}
        page={props.page}
        onBeforeInput={onBeforeInput}
        onKeyDown={onKeyDown}
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
  deleteContent: (
    pageId: string,
    start: Location,
    end: Location,
    deletionType?: DeletionType,
  ) => DeleteContentAction;
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
  deleteContent: (pageId, start, end, deletionType): DeleteContentAction =>
    dispatch(deleteContent(pageId, { end, start }, deletionType)),
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
