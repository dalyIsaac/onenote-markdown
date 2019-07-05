/* eslint-disable @typescript-eslint/camelcase */

import Token from "markdown-it/lib/token";
import { TagType } from "../structureTree/structureModel";
import { Attributes } from "./parser";
import { getCompiler } from "./compiler";
import { Style } from "../../editor/render";
import { paramCase } from "change-case";

/**
 * Type guard for `TagItem`.
 */
export function isTagItem(val: CompilerElement): val is TagItem {
  if (
    (val as TagItem).tag !== undefined &&
    (val as TagItem).tagType !== undefined
  ) {
    return true;
  }
  return false;
}

/**
 * Definition of tags inside the tag items inside the `elements` array.
 */
export interface TagItem {
  tag: keyof HTMLElementTagNameMap;
  tagType: TagType;
  style?: Style;
}

/**
 * Definition of items elements inside the `elements` array.
 */
export type CompilerElement = TagItem | string;

/**
 * When `getJSX` is set to true, then `elements` is populated with items for
 * use in `HtmlEditorComponent`.
 */
let elements: CompilerElement[] = [];

/**
 * Set to true when `getElements` is called, so that `elements` is populated
 * with items for use in `HtmlEditorComponent`.
 */
let getJSX = false;

/**
 * Renderer for the custom markdown syntax.
 * @param tokens Array of tokens.
 * @param index The index of the token with the custom markdown syntax.
 * @param type The calling attribute.
 */
function renderer(tokens: Token[], index: number, type: Attributes): string {
  const token = tokens[index];
  if (getJSX) {
    const tag = tokens[index].tag as keyof HTMLElementTagNameMap;
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
      return `<span style="${paramCase(type)}:${token.attrGet(type)}">`;
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

function inlineTagsRenderer(tokens: Token[], index: number): string {
  const token = tokens[index];
  const tagType = token.nesting === 1 ? TagType.StartTag : TagType.EndTag;
  if (getJSX) {
    elements.push({
      tag: token.tag as keyof HTMLElementTagNameMap,
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

export function unfinishedEnd(tokens: Token[], index: number): string {
  return inlineTagsRenderer(tokens, index);
}

export function supRenderer(tokens: Token[], index: number): string {
  return inlineTagsRenderer(tokens, index);
}

export function subRenderer(tokens: Token[], index: number): string {
  return inlineTagsRenderer(tokens, index);
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
    return `<span style="${paramCase(attribute)}:${value}">`;
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
    return getCompiler().utils.escapeHtml(content);
  }
}

/**
 * Gets all the elements from the OneNote page given content.
 */
export function getElements(content: string): CompilerElement[] {
  getJSX = true;
  getCompiler().render(content);
  const outElements = elements; // reassigning for the garbage collector
  elements = [];
  getJSX = false;
  return outElements;
}
