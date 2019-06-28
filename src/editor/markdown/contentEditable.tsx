import { Component, createRef, createElement, SyntheticEvent } from "react";
import deepEqual from "fast-deep-equal";

export type ContentEditableEvent = React.FormEvent<HTMLParagraphElement> & {
  target: { value: string };
};

export interface ContentEditableProps {
  html: string;
  onChange?: (e: ContentEditableEvent) => void;
  onBlur?: Function;
  onKeyUp?: Function;
  onKeyDown?: Function;
  disabled?: boolean;
  tagName?: string;
  className?: string;
  style?: { [key: string]: string };
}

function normalizeHtml(str: string): string {
  return str && str.replace(/&nbsp;|\u202F|\u00A0/g, " ");
}

function findLastTextNode(node: Node): Node | null {
  if (node.nodeType === Node.TEXT_NODE) return node;
  const children = node.childNodes;
  for (let i = children.length - 1; i >= 0; i--) {
    const textNode = findLastTextNode(children[i]);
    if (textNode !== null) {
      return textNode;
    }
  }
  return null;
}

function replaceCaret(el: HTMLElement): void {
  // Place the caret at the end of the element
  const target = findLastTextNode(el);
  // do not move caret if element was not focused
  const isTargetFocused = document.activeElement === el;
  if (target !== null && target.nodeValue !== null && isTargetFocused) {
    const range = document.createRange();
    const selection = window.getSelection();
    if (selection !== null) {
      range.setStart(target, target.nodeValue.length);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
      if (el instanceof HTMLElement) {
        el.focus();
      }
    }
  }
}

/**
 * A simple component for an html element with editable contents.
 */
export default class ContentEditable extends Component<ContentEditableProps> {
  private lastHtml: string = this.props.html;

  private el = createRef<HTMLElement>();

  public render(): JSX.Element {
    const { tagName, html, ...props } = this.props;

    return createElement(
      tagName || "div",
      {
        ...props,
        ref: this.el,
        onInput: this.emitChange,
        onBlur: this.props.onBlur || this.emitChange,
        onKeyUp: this.props.onKeyUp || this.emitChange,
        onKeyDown: this.props.onKeyDown || this.emitChange,
        contentEditable: !this.props.disabled,
      },
      html,
    );
  }

  public shouldComponentUpdate(nextProps: ContentEditableProps): boolean {
    const { props } = this;
    const el = this.el.current;

    // We do not need to rerender if the change of props simply reflects the
    // user's edits.
    // Rerendering in this case would make the cursor/caret jump.

    // Rerender if there is no element yet... (somehow?)
    if (!el) return true;

    // ...or if html really changed... (programmatically, not by user edit)
    if (normalizeHtml(nextProps.html) !== normalizeHtml(el.innerHTML)) {
      return true;
    }

    // Handle additional properties
    return (
      props.disabled !== nextProps.disabled ||
      props.tagName !== nextProps.tagName ||
      props.className !== nextProps.className ||
      !deepEqual(props.style, nextProps.style)
    );
  }

  public componentDidUpdate(): void {
    const el = this.el.current;
    if (!el) {
      return;
    }

    // Perhaps React (whose VDOM gets outdated because we often prevent
    // rerendering) did not update the DOM. So we update it manually now.
    if (this.props.html !== el.innerHTML) {
      el.innerHTML = this.lastHtml = this.props.html;
    }
    replaceCaret(el);
  }

  private emitChange = (
    originalEvent: SyntheticEvent<HTMLParagraphElement>,
  ): void => {
    const el = this.el.current;
    if (!el) {
      return;
    }

    const html = el.innerHTML;
    if (this.props.onChange && html !== this.lastHtml) {
      this.props.onChange({
        ...originalEvent,
        target: { ...originalEvent.target, value: html },
      });
      this.lastHtml = html;
    }
  };
}
