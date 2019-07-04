import React from "react";
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
import "./markdownEditorComponent";

export function MarkdownEditorComponent(
  props: MarkdownEditorStateProps & MarkdownEditorDispatchProps,
): JSX.Element {
  return (
    <div className={styles.editor}>
      Markdown Editor React Component
      <markdown-editor></markdown-editor>
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
