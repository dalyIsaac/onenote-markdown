/* eslint-disable @typescript-eslint/camelcase */

import MarkdownIt from "markdown-it";
import Token from "markdown-it/lib/token";
import StateCore from "markdown-it/lib/rules_core/state_core";
import { getAttributeName } from "../parser/parser";

const STRING_CHAR_CODE = 0x20;

type CustomSyntaxRule = "color" | "text-decoration";

const rules: Array<[CustomSyntaxRule, RegExp]> = [
  ["color", /\{color:(([a-zA-Z]*)|#([0-9a-fA-F]*))\}/],
  ["text-decoration", /\{text-decoration:underline\}/],
];

function renderer(
  tokens: Token[],
  index: number,
  type: CustomSyntaxRule,
): string {
  const token = tokens[index];
  if (token.nesting === 1) {
    return `<span style="${type}:${token.attrGet(type)}">`;
  } else if (token.nesting === -1) {
    return "</span>";
  } else {
    return "";
  }
}

function colorRenderer(tokens: Token[], index: number): string {
  return renderer(tokens, index, "color");
}

function textDecorationRenderer(tokens: Token[], index: number): string {
  return renderer(tokens, index, "text-decoration");
}

function strong_open(): string {
  return "<span style=\"font-weight:bold\">";
}

function strong_close(): string {
  return "</span>";
}

function em_open(): string {
  return "<span style=\"font-style:italic\">";
}

function paragraph_open(): string {
  return "";
}

const paragraph_close = paragraph_open;

const em_close = strong_close;

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

function customSyntax(state: StateCore, token: Token, pos: number): Token[] {
  let tokens: Token[] = [token];
  let continueChecking = true;
  while (continueChecking) {
    continueChecking = false;
    const currentToken = tokens[tokens.length - 1];
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
          getAttributeName(type, true),
          "span",
          result.canOpen ? 1 : -1,
        );
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
      token.children = inlineTokens;
    }
  });
}

export function customSyntaxPlugin(md: MarkdownIt): void {
  md.renderer.rules.color = colorRenderer;
  md.renderer.rules.textDecoration = textDecorationRenderer;
  md.renderer.rules.strong_open = strong_open;
  md.renderer.rules.strong_close = strong_close;
  md.renderer.rules.em_open = em_open;
  md.renderer.rules.em_close = em_close;
  md.renderer.rules.paragraph_open = paragraph_open;
  md.renderer.rules.paragraph_close = paragraph_close;
  md.core.ruler.push("customSyntaxRule", rule);
}