import { store } from "../..";
import { inorderTreeTraversal } from "../../page/tree/tree";
import {
  StructureNode,
  TagType,
} from "../../page/structureTree/structureModel";
import { PageContent } from "../../page/pageModel";
import {
  createElement,
  STRUCTURE_NODE_INDEX,
  StackItem,
  getLastStartItem,
  LastStartNode,
} from "../render";
import { getContentBetweenOffsets } from "../../page/contentTree/tree";

/* eslint-disable @typescript-eslint/no-namespace */

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "markdown-editor": {};
    }
  }
}

export class MarkdownEditorComponent extends HTMLElement {
  private pageId: string;

  public constructor() {
    super();
    const parent = document.createElement("div");
    parent.setAttribute("contenteditable", "true");
    parent.setAttribute(
      "style",
      `border-right: solid rgb(127, 127, 127) 1px;
       padding: 4px;
       white-space: pre-wrap;
       height: 100%;
    `,
    );

    const state = store.getState();
    this.pageId = state.selectedPage;
    const page = state.pages[this.pageId];

    for (const item of this.render(page)) {
      parent.appendChild(item);
    }

    const shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(parent);
  }

  private render(page: PageContent): Element[] {
    let stack: StackItem[] = [];
    let contentOffset = 0;
    for (const { index, node } of inorderTreeTraversal(page.structure)) {
      switch (node.tagType) {
        case TagType.StartTag: {
          stack.push({ contentOffset, index, node });
          contentOffset += node.length;
          break;
        }
        case TagType.EndTag: {
          stack = this.updateStack(page, stack);
          break;
        }
        case TagType.StartEndTag: {
          this.addStartEndTag(stack, node, index);
          break;
        }
        default: {
          break;
        }
      }
    }
    return stack as Element[];
  }

  /**
   * Adds an element for a `StartEnd` tag.
   */
  private addStartEndTag(
    stack: StackItem[],
    node: StructureNode,
    index: number,
  ): void {
    switch (node.tag) {
      case "br": {
        stack.push(createElement("br", { [STRUCTURE_NODE_INDEX]: index }));
        break;
      }
      default:
        break;
    }
  }

  /**
   * Returns the updated stack. The last `StackItem` which has a
   * `tagType === TagType.StartTag` is compiled, with all the elements on the
   * stack after the last start tag being children.
   */
  private updateStack(page: PageContent, stack: StackItem[]): StackItem[] {
    const lastStartStackItem = getLastStartItem(stack);
    if (lastStartStackItem) {
      return this.updateItem(page, stack, lastStartStackItem);
    } else {
      throw new Error(
        "There's a mismatch between the number of start and end tags",
      );
    }
  }

  /**
   * Updates the stack by compiling the last `StackItem` which has a
   * `tagType === TagType.StartTag` is compiled, with all the elements on the
   * stack after the last start tag being children.
   * @param stack The stack of `StackItem`s.
   * @param lastStartNode The last `StackItem`, which has
   * `tagType === TagType.StartTag`.
   */
  private updateItem(
    page: PageContent,
    stack: StackItem[],
    { contentOffset, index, node, stackIndex }: LastStartNode,
  ): StackItem[] {
    const newStack = stack.slice(0, stackIndex);
    let children: Element[] | string;
    if (stackIndex === stack.length - 1) {
      const startOffset = contentOffset;
      const endOffset = contentOffset + node.length;
      children = getContentBetweenOffsets(page, startOffset, endOffset);
    } else {
      children = stack.slice(stackIndex) as Element[];
    }
    const element = createElement(
      "p",
      {
        ...node.attributes,
        [STRUCTURE_NODE_INDEX]: index,
        style: `margin: 0; padding: 0;`,
      },
      children,
    );
    newStack.push(element);
    return newStack;
  }
}

customElements.define("markdown-editor", MarkdownEditorComponent);
