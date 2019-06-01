import React from "react";
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

function onBeforeInput(e: BeforeInputType): void {
  const selection = getEditorSelection();
  console.log(selection);
}

export function MarkdownEditorComponent(
  props: MarkdownEditorStateProps & MarkdownEditorDispatchProps,
): JSX.Element {
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
