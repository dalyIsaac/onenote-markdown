import React from "react";
import { connect } from "react-redux";
import { Key } from "ts-key-enum";
import { State } from "../../reducer";
import { ContentNode, NodeType, PageContent, TagNode } from "../page/model";
import { areTagEnds, getNodeContent } from "../page/tree/node";
import { inorderTreeTraversal } from "../page/tree/tree";
import styles from "./htmlEditor.module.css";

interface SelectionPoint {
  /**
   * The DOM element which is involved in the selection.
   */
  node: Element;

  /**
   * The offset of the selection inside the DOM/React element.
   */
  offset?: number;
}

interface Selection {
  start: SelectionPoint;
  end?: SelectionPoint;
}

interface RenderStackItem {
  node: ContentNode | TagNode;
  index: number;
}

interface HtmlEditorProps {
  page: PageContent;
}

class HtmlEditorComponent extends React.Component<HtmlEditorProps> {
  private static readonly arrowKeys = new Set([
    Key.ArrowDown,
    Key.ArrowUp,
    Key.ArrowLeft,
    Key.ArrowRight,
  ]);
  private static readonly tags = new Set([
    NodeType.StartTag,
    NodeType.EndTag,
    NodeType.StartEndTag,
  ]);

  private selection: Selection | null = null;

  public render(): JSX.Element {
    let stack: Array<RenderStackItem | JSX.Element> = [];
    if (this.props.page) {
      for (const { node, index } of inorderTreeTraversal(this.props.page)) {
        if (node.nodeType === NodeType.EndTag) {
          const lastStartNode = this.getLastStartNode(stack);
          if (lastStartNode && areTagEnds(lastStartNode.node, node)) {
            // get all the elements after the index, and put them inside the new React element.
            const elements: Array<string | JSX.Element> = [];
            stack.slice(lastStartNode.index + 1).forEach((x) => {
              if (
                (x as RenderStackItem).node &&
                (x as RenderStackItem).node.nodeType === NodeType.Content
              ) {
                elements.push(
                  React.createElement(
                    "span",
                    {
                      editornodetype: NodeType.Content,
                      onPointerDown: this.pointerDown,
                      onPointerUp: this.pointerUp,
                    },
                    getNodeContent(
                      this.props.page,
                      (x as RenderStackItem).index,
                    ),
                  ),
                );
              } else {
                elements.push(x as JSX.Element);
              }
            });
            const newElement = React.createElement(
              lastStartNode.node.tag,
              {
                ...lastStartNode.node.properties,
                style: lastStartNode.node.style,
                key: lastStartNode.node.id,
                onPointerDown: this.pointerDown,
                onPointerUp: this.pointerUp,
                editornodetype: NodeType.EndTag,
              },
              ...elements,
            );
            stack = stack.slice(0, lastStartNode.index);
            stack.push(newElement);
          } else {
            // TODO: there's been some sort of error (mismatch in the stack).
          }
        } else {
          stack.push({ node, index });
        }
      }
    }
    return (
      <div
        className={styles.htmlEditor}
        contentEditable={true}
        suppressContentEditableWarning={true}
        onKeyDown={this.onKeyUp}
      >
        {this.props.page ? stack : "HTML editor"}
      </div>
    );
  }

  private onKeyUp = (e: React.KeyboardEvent): void => {
    console.log("Key up");
    if (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) {
      console.log("\tShortcut");
      if (HtmlEditorComponent.arrowKeys.has(e.key as Key)) {
        console.log("\t\tArrow (selection)");
        this.updateSelection(e);
      }
    } else if (HtmlEditorComponent.arrowKeys.has(e.key as Key)) {
      console.log(`\tArrow key movement: ${e.key}`);
    } else {
      e.preventDefault();
    }
  };

  private updateSelection = (e: React.KeyboardEvent): void => {
    console.log("Update selection");
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    this.selection = {
      start: {
        node: range.startContainer as Element,
        offset: range.startOffset,
      },
      end: {
        node: range.endContainer as Element,
        offset: range.endOffset,
      },
    };
    console.log(this.selection);
  };

  private getLastStartNode = (
    stack: Array<RenderStackItem | JSX.Element>,
  ): { node: TagNode; index: number } | undefined => {
    for (let i = stack.length - 1; i >= 0; i--) {
      const node = (stack[i] as RenderStackItem).node;
      if (
        node &&
        (node as TagNode).nodeType !== undefined &&
        (node as TagNode).nodeType === NodeType.StartTag
      ) {
        return { node: node as TagNode, index: i };
      }
    }
    return undefined;
  };

  private pointerDown = (e: React.PointerEvent<HTMLSpanElement>): void => {
    console.log("Pointer down");
    const attr = e.currentTarget.attributes.getNamedItem(
      "editornodetype",
    ) as Attr;
    if (attr !== null) {
      if (attr.value === NodeType.Content) {
        this.selection = { start: { node: e.currentTarget } };
      } else if (HtmlEditorComponent.tags.has(attr.value as NodeType)) {
        // do nothing
      }
    }
    console.log(this.selection);
  };

  private pointerUp = (e: React.PointerEvent<HTMLSpanElement>): void => {
    console.log("Pointer up");
    const attr = e.currentTarget.attributes.getNamedItem(
      "editornodetype",
    ) as Attr;
    const selection = window.getSelection();
    if (selection.rangeCount > 1) {
      selection.collapseToStart();
    }
    if (attr !== null && this.selection !== null) {
      if (attr.value === NodeType.Content) {
        const range = selection.getRangeAt(0);
        if (selection.anchorNode === selection.focusNode && this.selection) {
          this.selection.start.offset = range.startOffset;
          this.selection.end = {
            node: e.currentTarget,
            offset: range.endOffset,
          };
        } else {
          this.selection.start.offset = range.startOffset;
          this.selection.end = {
            node: e.currentTarget,
            offset: range.endOffset,
          };
        }
      } else if (HtmlEditorComponent.tags.has(attr.value as NodeType)) {
        // do nothing
      }
    } else {
      this.selection = null;
      console.log("Selection is nullified");
    }
    console.log(this.selection);
  };
}

const mapStateToProps = (state: State): HtmlEditorProps => ({
  page: state.pages[state.selectedPage],
});

export default connect(mapStateToProps)(HtmlEditorComponent);
