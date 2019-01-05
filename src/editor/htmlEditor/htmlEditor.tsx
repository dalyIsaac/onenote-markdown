import React from "react";
import { connect } from "react-redux";
import { State } from "../../reducer";
import { ContentNode, NodeType, PageContent, TagNode } from "../page/model";
import { areTagEnds, getNodeContent } from "../page/tree/node";
import { inorderTreeTraversal, SENTINEL } from "../page/tree/tree";
import styles from "./htmlEditor.module.css";

class HtmlEditorComponent extends React.Component<HtmlEditorProps> {
  constructor(props: HtmlEditorProps) {
    super(props);
  }

  public render(): JSX.Element {
    let stack: Array<StackItem | JSX.Element> = [];
    if (this.props.page) {
      for (const { node, index } of inorderTreeTraversal(this.props.page)) {
        // TODO: use index in getLastStartNode for the search
        if (node.nodeType === NodeType.EndTag) {
          const lastStartNode = this.getLastStartNode(stack);
          if (lastStartNode && areTagEnds(lastStartNode.node, node)) {
            // get all the elements after the index, and put them inside the new React element.
            const elements: Array<string | JSX.Element> = [];
            stack.slice(lastStartNode.index + 1).forEach((x) => {
              if (
                (x as StackItem).node &&
                (x as StackItem).node.nodeType === NodeType.Content
              ) {
                elements.push(
                  getNodeContent(this.props.page, (x as StackItem).index),
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
              },
              ...elements,
            );
            stack = stack.slice(0, lastStartNode.index);
            stack.push(newElement);
          }
        } else {
          stack.push({ node, index });
        }
      }
    }
    return (
      <div className={styles.htmlEditor}>
        {this.props.page ? stack : "HTML editor"}
      </div>
    );
  }

  private getLastStartNode(
    stack: Array<StackItem | JSX.Element>,
  ): { node: TagNode; index: number } | undefined {
    for (let i = stack.length - 1; i >= 0; i--) {
      const node = (stack[i] as StackItem).node;
      if (
        node &&
        (node as TagNode).nodeType !== undefined &&
        (node as TagNode).nodeType === NodeType.StartTag
      ) {
        return { node: node as TagNode, index: i };
      }
    }
    return undefined;
  }
}

interface StackItem {
  node: ContentNode | TagNode;
  index: number;
}

interface HtmlEditorProps {
  page: PageContent;
}

const mapStateToProps = (state: State): HtmlEditorProps => ({
  page: state.pages[state.selectedPage],
});

export default connect(mapStateToProps)(HtmlEditorComponent);
