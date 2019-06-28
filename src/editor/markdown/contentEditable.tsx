import {
  Component,
  createRef,
  createElement,
  SyntheticEvent,
  useEffect,
  useRef,
} from "react";
import deepEqual from "fast-deep-equal";
import React from "react";

export type ContentEditableEvent = React.FormEvent<HTMLParagraphElement> & {
  target: { value: string };
};

export interface ContentEditableProps {
  html: string;
  onChange?: Function;
  // onChange?: (e: ContentEditableEvent) => void;
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

export default function(): React.MemoExoticComponent<
(props: ContentEditableProps) => JSX.Element
> {
  let lastHtml = "";

  function ContentEditableComponent(props: ContentEditableProps): JSX.Element {
    const el = React.createRef<HTMLElement>();

    // emitChange
    function emitChange(): void {
      if (!el || !el.current) {
        return;
      }

      const html = el.current.innerHTML;
      if (props.onChange && html !== lastHtml) {
        props.onChange({
          target: { value: html },
        });
        lastHtml = html;
      }
    }

    // componentDidUpdate
    useEffect((): void => {
      if (!el || !el.current) {
        return;
      }

      if (props.html !== el.current.innerText) {
        el.current.innerText = lastHtml = props.html;
      }
      replaceCaret(el.current);
    });

    const { tagName, html, ...otherProps } = props;

    return createElement(
      tagName || "div",
      {
        ...otherProps,
        ref: el,
        onInput: emitChange,
        onBlur: props.onBlur || emitChange,
        onKeyUp: props.onKeyUp || emitChange,
        onKeyDown: props.onKeyDown || emitChange,
        contentEditable: !props.disabled,
      },
      html,
    );
  }

  function areEqual(
    prevProps: ContentEditableProps,
    nextProps: ContentEditableProps,
  ): boolean {
    // if html really changed... (programmatically, not by user edit)
    if (normalizeHtml(nextProps.html) !== normalizeHtml(lastHtml)) {
      return false;
    }

    // Handle additional properties
    return (
      prevProps.disabled === nextProps.disabled &&
      prevProps.tagName === nextProps.tagName &&
      prevProps.className === nextProps.className &&
      deepEqual(prevProps.style, nextProps.style)
    );
  }

  return React.memo(ContentEditableComponent, areEqual);
}
