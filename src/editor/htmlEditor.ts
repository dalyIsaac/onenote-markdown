/* eslint-disable @typescript-eslint/no-namespace */

import { PageContent } from "../page/pageModel";
import {
  StackItem,
  createElement,
  getLastStartItem,
  LastStartNode,
  StackItemBase,
} from "./render";
import { getHtmlContentElementsFromPage } from "../page/compiler/compiler";
import { TagType, StructureNode } from "../page/structureTree/structureModel";
import {
  isTagItem,
  CompilerElement,
  TagItem,
} from "../page/compiler/renderers";
import { store } from "..";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "html-editor": {};
    }
  }
}

interface HTMLStackItem extends StackItemBase {
  children: CompilerElement[];
}

interface ChildStackItem {
  node: TagItem;
}

export class HtmlEditorComponent extends HTMLElement {
  public constructor() {
    super();
    const parent = document.createElement("div");

    const state = store.getState();
    const page = state.pages[state.selectedPage];

    for (const item of this.render(page)) {
      parent.appendChild(item);
    }

    const shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(parent);
  }

  private render(page: PageContent): Element[] {
    let stack: Array<StackItem<HTMLStackItem>> = [];
    let contentOffset = 0;
    for (const { children, node, index } of getHtmlContentElementsFromPage(
      page,
    )) {
      switch (node.tagType) {
        case TagType.StartTag: {
          stack.push({ children, contentOffset, index, node });
          contentOffset += node.length;
          break;
        }
        case TagType.EndTag: {
          stack = this.updateStack(stack);
          if (node.tag === "cite") {
            stack.push(
              createElement("br", undefined, {
                contentoffset: contentOffset,
                ignoreinsync: "true",
                isbreak: "true",
              }),
            );
          }
          break;
        }
        case TagType.StartEndTag: {
          this.addStartEndTag(stack, node, contentOffset);
          break;
        }
        default:
          break;
      }
    }
    return stack as Element[];
  }

  /**
   * Adds a element for a `StartEnd` tag.
   */
  private addStartEndTag(
    stack: StackItem[],
    node: StructureNode,
    contentOffset: number,
  ): void {
    switch (node.tag) {
      case "br": {
        const props = {
          contentoffset: contentOffset,
          isbreak: "true",
          key: node.id,
        };
        stack.push(createElement("br", props));
        break;
      }
      default:
        break;
    }
  }

  /**
   * Returns the updated stack. The last `StructureStackItem` which has a
   * `tagType === TagType.StartTag` is compiled, with all the elements on the
   * stack after the last start tag being children.
   */
  private updateStack(
    stack: Array<StackItem<HTMLStackItem>>,
  ): Array<StackItem<HTMLStackItem>> {
    const lastStartStackItem = getLastStartItem(stack as HTMLStackItem[]);
    if (lastStartStackItem) {
      return this.updateItem(stack, lastStartStackItem);
    } else {
      throw new Error(
        "There's a mismatch between the number of start and end tags",
      );
    }
  }

  /**
   * Updates the stack by compiling the last `StructureStackItem` which has a
   * `tagType === TagType.StartTag` is compiled, with all the elements on the
   * stack after the last start tag being children.
   * @param stack The stack of `StructureStackItem`s.
   * @param lastStartNode The last `StructureStackItem`, which has
   * `tagType === TagType.StartTag`.
   */
  private updateItem(
    stack: Array<StackItem<HTMLStackItem>>,
    {
      children,
      contentOffset,
      node,
      stackIndex,
    }: LastStartNode & HTMLStackItem,
  ): Array<StackItem<HTMLStackItem>> {
    const newStack = stack.slice(0, stackIndex);
    const childElements = this.createChildElements(children);
    const element = createElement(
      node.tag,
      { margin: "0", padding: "0", ...node.style },
      {
        ...node.attributes,
        contentoffset: contentOffset,
        key: node.id,
      },
      childElements as Array<Element | Text>,
    );
    newStack.push(element);
    return newStack;
  }

  /**
   * Compiles the markdown children of a `StructureNode` into an array of
   * `Element`s, for rendering.
   * @param children Array of the text children (the markdown)
   * of a `StructureNode`. Children are either an object representing
   * a tag (like `<span>`), or a string representing text.
   */
  private createChildElements(
    children: CompilerElement[],
  ): Array<Element | string> {
    let stack: Array<ChildStackItem | Text | string | Element> = [];
    for (const child of children) {
      if (isTagItem(child)) {
        switch (child.tagType) {
          case TagType.StartTag: {
            stack.push({ node: child });
            break;
          }
          case TagType.EndTag: {
            stack = this.updateChildStack(stack);
            break;
          }
          case TagType.StartEndTag: {
            break;
          }
          default:
            break;
        }
      } else {
        stack.push(document.createTextNode(child));
      }
    }
    return stack as Array<Element | string>;
  }

  /**
   * Updates the stack by compiling the last `ChildStackItem` which has a
   * `tagType === TagType.StartTag` is compiled, with all the elements on the
   * stack after the last start tag being children.
   * @param stack The stack of `ChildStackItem`s.
   */
  private updateChildStack(
    stack: Array<ChildStackItem | Element | Text | string>,
  ): Array<ChildStackItem | Element | Text | string> {
    const lastStart = getLastStartItem(stack);
    if (lastStart) {
      return this.updateChildItem(stack, lastStart);
    } else {
      throw new Error(
        "There's a mismatch between the number of start and end tags",
      );
    }
  }

  /**
   * Updates the stack by compiling the last `StructureStackItem` which has a
   * `tagType === TagType.StartTag` is compiled, with all the elements on the
   * stack after the last start tag being children.
   * @param stack The stack of `StructureStackItem`s.
   * @param lastStartNode The last `ChildStackItem`, which has
   * `tagType === TagType.StartTag`.
   */
  private updateChildItem(
    stack: Array<ChildStackItem | Element | Text | string>,
    { stackIndex, node }: LastStartNode,
  ): Array<ChildStackItem | Element | Text | string> {
    const newStack = stack.slice(0, stackIndex);
    const children = stack.slice(stackIndex + 1) as Element[];
    const element = createElement(node.tag, node.style, undefined, children);
    newStack.push(element);
    return newStack;
  }
}

customElements.define("html-editor", HtmlEditorComponent);
