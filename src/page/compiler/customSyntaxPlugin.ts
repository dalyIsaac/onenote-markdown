/* eslint-disable @typescript-eslint/camelcase */

import MarkdownIt from "markdown-it";
import Token from "markdown-it/lib/token";
import StateCore from "markdown-it/lib/rules_core/state_core";
import { KeyValueStr, TagType } from "../structureTree/structureModel";

const STRING_CHAR_CODE = 0x20;

type Attributes = "color" | "textDecoration" | "backgroundColor";

const tagRule = /{![a-zA-Z][a-zA-Z0-9]*\} /;

const rules: Array<[Attributes, RegExp]> = [
  ["color", /\{color:(([a-zA-Z]*)|#([0-9a-fA-F]*))\}/],
  [
    "textDecoration",
    /\{text-decoration:((underline( line-through){0,1})|(line-through( underline){0,1}))\}/,
  ],
  ["backgroundColor", /\{background-color:(([a-zA-Z]*)|#([0-9a-fA-F]*))\}/],
];

export interface Item {
  tag: string;
  tagType: TagType;
  style?: KeyValueStr;
}

export function isItem(val: Element): val is Item {
  if ((val as Item).tag) {
    return true;
  }
  return false;
}

export type Element = JSX.Element | Item | string;

let getJSX = false;
let elements: Element[] = [];

/**
 * Converts the value from camelCase to kebab-case.
 */
function camelToKebab(val: string): string {
  return val.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

// #region Renderers
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

function colorRenderer(tokens: Token[], index: number): string {
  return renderer(tokens, index, "color");
}

function textDecorationRenderer(tokens: Token[], index: number): string {
  return renderer(tokens, index, "textDecoration");
}

function backgroundColorRenderer(tokens: Token[], index: number): string {
  return renderer(tokens, index, "backgroundColor");
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

function strong_open(): string {
  return builtInRendererOverrides("fontWeight", "bold");
}

function strong_close(): string {
  if (getJSX) {
    elements.push({
      tag: "span",
      tagType: TagType.EndTag,
    });
    return "";
  }
  return "</span>";
}

function em_open(): string {
  return builtInRendererOverrides("fontStyle", "italic");
}

function paragraph_open(): string {
  return "";
}

const paragraph_close = paragraph_open;

const heading_open = paragraph_open;

const heading_close = paragraph_close;

const em_close = strong_close;

function text(tokens: Token[], index: number): string {
  const content = tokens[index].content;
  if (getJSX) {
    elements.push(content);
    return "";
  } else {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return markdownCompiler.utils.escapeHtml(content);
  }
}
// #endregion

/**
 * Scans delimiters based, and indicates whether the token can be an open and/or closing tag.
 * Based on https://github.com/markdown-it/markdown-it/blob/1ad3aec2041cd2defa7e299543cc1e42184b680d/lib/rules_inline/state_inline.js#L69
 * @param md The `MarkdownIt` instance.
 * @param src The markdown source/content.
 * @param start The index of the starting location to scan.
 */
function scanDelims(
  md: MarkdownIt,
  src: string,
  start: number,
): { canOpen: boolean; canClose: boolean; length: number } {
  let pos = start;
  const max = src.length;

  let leftFlanking = true;
  let rightFlanking = true;
  // treat beginning of the line as a whitespace
  const lastChar = start > 0 ? src.charCodeAt(start - 1) : STRING_CHAR_CODE;

  while (pos < max && src[pos] !== "}") {
    pos++;
  }
  pos++;

  const count = pos - start;

  // treat end of the line as a whitespace
  const nextChar = pos < max ? src.charCodeAt(pos) : STRING_CHAR_CODE;

  const isLastPunctChar =
    md.utils.isMdAsciiPunct(lastChar) ||
    md.utils.isPunctChar(String.fromCharCode(lastChar));
  const isNextPunctChar =
    md.utils.isMdAsciiPunct(nextChar) ||
    md.utils.isPunctChar(String.fromCharCode(nextChar));

  const isLastWhiteSpace = md.utils.isWhiteSpace(lastChar);
  const isNextWhiteSpace = md.utils.isWhiteSpace(nextChar);

  if (isNextWhiteSpace) {
    leftFlanking = false;
  } else if (isNextPunctChar) {
    if (!(isLastWhiteSpace || isLastPunctChar)) {
      leftFlanking = false;
    }
  }

  if (isLastWhiteSpace) {
    rightFlanking = false;
  } else if (isLastPunctChar) {
    if (!(isNextWhiteSpace || isNextPunctChar)) {
      rightFlanking = false;
    }
  }

  return {
    canClose: rightFlanking,
    canOpen: leftFlanking,
    length: count,
  };
}

/**
 * Contains a stack of the string of the delimiting tokens - i.e. the strings of the markdown tokens.
 */
let delimStack: string[] = [];

const equivalentValues = [
  new Set([
    "{text-decoration:underline line-through}",
    "{text-decoration:line-through underline}",
  ]),
];

function compareDelimStackItems(val1: string, val2: string): boolean {
  if (val1 === val2) {
    return true;
  } else {
    for (const valueSet of equivalentValues) {
      if (valueSet.has(val1) && valueSet.has(val2)) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Plugin for `markdown-it` with the custom syntax.
 * @param state The state of the compiler.
 * @param token The current token.
 * @param pos The position of the position to start the scan inside the content.
 */
function customSyntax(state: StateCore, token: Token, pos: number): Token[] {
  let tokens: Token[] = [token];
  let continueChecking = true;
  while (continueChecking) {
    continueChecking = false;
    const currentToken = tokens[tokens.length - 1];
    const tagMatch = tagRule.exec(currentToken.content);
    if (tagMatch) {
      // assumes that the tag is at the start of the content
      currentToken.content = currentToken.content.slice(
        tagMatch.index + tagMatch[0].length,
      );
    }
    for (const [type, rule] of rules) {
      const matches = rule.exec(currentToken.content);
      if (matches) {
        continueChecking = true;
        const match = matches[0];
        const startIndex = matches.index;
        const endIndex = matches.index + match.length;

        const tokenBefore: Token = {
          ...new Token(
            currentToken.type,
            currentToken.tag,
            currentToken.nesting,
          ),
          attrs: currentToken.attrs,
          block: currentToken.block,
          children: currentToken.children,
          content: currentToken.content.slice(0, startIndex),
          hidden: currentToken.hidden,
          info: currentToken.info,
          level: currentToken.level,
          map: currentToken.map,
          markup: currentToken.markup,
          meta: currentToken.meta,
          nesting: currentToken.nesting,
          tag: currentToken.tag,
          type: currentToken.type,
        };

        const tokenAfter: Token = {
          ...new Token(
            currentToken.type,
            currentToken.tag,
            currentToken.nesting,
          ),
          attrs: currentToken.attrs,
          block: currentToken.block,
          children: currentToken.children,
          content: currentToken.content.slice(endIndex),
          hidden: currentToken.hidden,
          info: currentToken.info,
          level: currentToken.level,
          map: currentToken.map,
          markup: currentToken.markup,
          meta: currentToken.meta,
          nesting: currentToken.nesting,
          tag: currentToken.tag,
          type: currentToken.type,
        };

        const result = scanDelims(state.md, state.src, pos);
        const matchedToken: Token = new Token(
          type,
          "span",
          result.canClose ? -1 : 1,
        );

        if (
          result.canClose &&
          delimStack[delimStack.length - 1] &&
          compareDelimStackItems(delimStack[delimStack.length - 1], match)
        ) {
          delimStack.pop();
          matchedToken.nesting = -1;
        } else {
          result.canClose = false;
          if (result.canOpen) {
            delimStack.push(match);
            matchedToken.nesting = 1;
          } else {
            matchedToken.nesting = 0;
          }
        }
        matchedToken.attrPush([type, match.split(":")[1].slice(0, -1)]);

        tokens.pop();
        tokens = tokens.concat(
          [tokenBefore, matchedToken, tokenAfter].reduce(
            (acc, curr) => {
              if (curr.content || (curr.attrs && curr.attrGet(type))) {
                acc.push(curr);
              }
              return acc;
            },
            [] as Token[],
          ),
        );
        pos += tokenAfter.content.length;
      }
    }
  }
  return tokens;
}

/**
 * The `markdown-it` rule for the custom syntax.
 * @param state The state of the compiler.
 */
function rule(state: StateCore): void {
  state.tokens.forEach((token) => {
    if (token.type === "inline") {
      let inlineTokens: Token[] = [];
      let pos = 0;
      token.children.forEach((currentToken) => {
        inlineTokens = inlineTokens.concat(
          customSyntax(state, currentToken, pos),
        );
        pos += currentToken.content.length || currentToken.markup.length;
      });
      delimStack.forEach(() => {
        const newToken = new Token("unfinishedEnd", "span", -1);
        newToken.children = [];
        inlineTokens.push(newToken);
      });
      delimStack = [];
      token.children = inlineTokens;
    }
  });
}

function customSyntaxPlugin(md: MarkdownIt): void {
  md.renderer.rules.color = colorRenderer;
  md.renderer.rules.textDecoration = textDecorationRenderer;
  md.renderer.rules.backgroundColor = backgroundColorRenderer;
  md.renderer.rules.strong_open = strong_open;
  md.renderer.rules.strong_close = strong_close;
  md.renderer.rules.em_open = em_open;
  md.renderer.rules.em_close = em_close;
  md.renderer.rules.paragraph_open = paragraph_open;
  md.renderer.rules.paragraph_close = paragraph_close;
  md.renderer.rules.heading_open = heading_open;
  md.renderer.rules.heading_close = heading_close;
  md.renderer.rules.text = text;
  md.core.ruler.push("customSyntaxRule", rule);
}

export const markdownCompiler = new MarkdownIt("commonmark").use(
  customSyntaxPlugin,
);

export function getElements(content: string): Element[] {
  getJSX = true;
  markdownCompiler.render(content);
  const outElements = elements; // reassigning for the garbage collector
  elements = [];
  getJSX = false;
  return outElements;
}
