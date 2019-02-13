/* eslint-disable @typescript-eslint/camelcase */

import Token from "markdown-it/lib/token";
import { KeyValueStr, TagType } from "../structureTree/structureModel";
import { Attributes } from "./parser";
import { markdownCompiler } from "./compiler";

/**
 * Type guard for `TagItem`.
 */
export function isTagItem(val: Element): val is TagItem {
  if ((val as TagItem).tag) {
    return true;
  }
  return false;
}

/**
 * Definition of tags inside the tag items inside the `elements` array.
 */
export interface TagItem {
  tag: string;
  tagType: TagType;
  style?: KeyValueStr;
}

/**
 * Definition of items elements inside the `elements` array.
 */
export type Element = TagItem | string;

/**
 * When `getJSX` is set to true, then `elements` is populated with items for
 * use in `HtmlEditorComponent`.
 */
let elements: Element[] = [];

/**
 * Set to true when `getElements` is called, so that `elements` is populated
 * with items for use in `HtmlEditorComponent`.
 */
let getJSX = false;

/**
 * Converts the value from camelCase to kebab-case.
 */
function camelToKebab(val: string): string {
  return val.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

/**
 * Renderer for the custom markdown syntax.
 * @param tokens Array of tokens.
 * @param index The index of the token with the custom markdown syntax.
 * @param type The calling attribute.
 */
function renderer(tokens: Token[], index: number, type: Attributes): string {
  const token = tokens[index];
  if (getJSX) {
    const tag = tokens[index].tag;
    if (token.nesting === 1) {
      elements.push({
        style: {
          [type]: token.attrGet(type) || "",
        },
        tag,
        tagType: TagType.StartTag,
      });
      return "";
    } else if (token.nesting === -1) {
      elements.push({
        tag,
        tagType: TagType.EndTag,
      });
      return "";
    } else {
      elements.push({
        style: {
          [type]: token.attrGet(type) || "",
        },
        tag,
        tagType: TagType.EndTag,
      });
      return "";
    }
  } else {
    if (token.nesting === 1) {
      return `<span style="${camelToKebab(type)}:${token.attrGet(type)}">`;
    } else if (token.nesting === -1) {
      return "</span>";
    } else {
      return "";
    }
  }
}

export function colorRenderer(tokens: Token[], index: number): string {
  return renderer(tokens, index, Attributes.color);
}

export function textDecorationRenderer(tokens: Token[], index: number): string {
  return renderer(tokens, index, Attributes.textDecoration);
}

export function backgroundColorRenderer(
  tokens: Token[],
  index: number,
): string {
  return renderer(tokens, index, Attributes.backgroundColor);
}

function InlineTagsRenderer(tokens: Token[], index: number): string {
  const token = tokens[index];
  const tagType = token.nesting === 1 ? TagType.StartTag : TagType.EndTag;
  if (getJSX) {
    elements.push({
      tag: token.tag,
      tagType,
    });
    return "";
  } else {
    if (tagType === TagType.StartTag) {
      return `<${token.tag}>`;
    } else {
      return `</${token.tag}>`;
    }
  }
}

export function supRenderer(tokens: Token[], index: number): string {
  return InlineTagsRenderer(tokens, index);
}

export function subRenderer(tokens: Token[], index: number): string {
  return InlineTagsRenderer(tokens, index);
}

/**
 * Returns the custom HTML tags.
 * @param attribute Attribute in camel case.
 * @param value Attribute value
 */
function builtInRendererOverrides(attribute: string, value: string): string {
  if (getJSX) {
    elements.push({
      style: {
        [attribute]: value,
      },
      tag: "span",
      tagType: TagType.StartTag,
    });
    return "";
  } else {
    return `<span style="${camelToKebab(attribute)}:${value}">`;
  }
}

export function strong_open(): string {
  return builtInRendererOverrides("fontWeight", "bold");
}

export function strong_close(): string {
  if (getJSX) {
    elements.push({
      tag: "span",
      tagType: TagType.EndTag,
    });
    return "";
  }
  return "</span>";
}

export function em_open(): string {
  return builtInRendererOverrides("fontStyle", "italic");
}

export function paragraph_open(): string {
  return "";
}

export const paragraph_close = paragraph_open;

export const heading_open = paragraph_open;

export const heading_close = paragraph_close;

export const em_close = strong_close;

export function text(tokens: Token[], index: number): string {
  const content = tokens[index].content;
  if (getJSX) {
    if (content) {
      elements.push(content);
    }
    return "";
  } else {
    return markdownCompiler.utils.escapeHtml(content);
  }
}

/**
 * Gets all the elements from the OneNote page given content.
 */
export function getElements(content: string): Element[] {
  getJSX = true;
  markdownCompiler.render(content);
  const outElements = elements; // reassigning for the garbage collector
  elements = [];
  getJSX = false;
  return outElements;
}
