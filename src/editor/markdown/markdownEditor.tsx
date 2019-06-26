import React, { useEffect } from "react";
import EditorBase, { BeforeInputType } from "../editorBase";
import styles from "./markdownEditor.module.css";
import { connect } from "react-redux";
import { PageContent } from "../../page/pageModel";
import { State } from "../../reducer";
import {
  insertContent,
  InsertContentAction,
} from "../../page/contentTree/actions";
import { Dispatch } from "redux";
import {
  SplitStructureAction,
  splitStructureNode,
} from "../../page/structureTree/actions";
import renderPage from "./renderPage";
import getEditorSelection from "./selection";
import { Cursor } from "../cursor";

export const cursor = new Cursor();

export function MarkdownEditorComponent(
  props: MarkdownEditorStateProps & MarkdownEditorDispatchProps,
): JSX.Element {
  function updateSelection(): void {
    if (cursor.start !== null && cursor.start.ref !== null) {
      const selection = window.getSelection();
      if (selection) {
        selection.empty();
        const range = document.createRange();
        const start = cursor.getStartFirstChild();
        if (start) {
          range.setStart(start.node, start.localOffset);

          const end = cursor.getEndFirstChild();
          if (end) {
            range.setEnd(end.node, end.localOffset);
          }
          selection.addRange(range);
        }
      }
    }
  }

  useEffect((): void => {
    updateSelection();
  });

  function onBeforeInput(e: BeforeInputType): void {
    e.preventDefault();
    const selection = getEditorSelection();
    if (selection === null) {
      return;
    }

    const content = e.data;
    const { start, end } = selection;

    if (content === "\n") {
      // TODO: split
    } else {
      const globalOffset = start.nodeOffset + start.localOffset;
      props.insertContent(
        props.pageId,
        content,
        globalOffset,
        start.structureNodeIndex,
        start.nodeOffset,
      );
      cursor.setStartOffset(globalOffset + 1);
      updateSelection();
    }
  }

  return (
    <div className={styles.editor}>
      <EditorBase
        renderPage={renderPage}
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
    globalOffset: number,
    nodeIndex: number,
    nodeOffset: number,
  ) => InsertContentAction;
  splitStructureNode: (
    pageId: string,
    nodeIndex: number,
    nodeOffset: number,
    localOffset: number,
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
    nodeIndex,
    nodeOffset,
  ): InsertContentAction =>
    dispatch(insertContent(pageId, content, offset, nodeIndex, nodeOffset)),
  splitStructureNode: (
    pageId: string,
    nodeIndex: number,
    nodeOffset: number,
    localOffset: number,
  ): SplitStructureAction =>
    dispatch(splitStructureNode(pageId, nodeIndex, nodeOffset, localOffset)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MarkdownEditorComponent);
