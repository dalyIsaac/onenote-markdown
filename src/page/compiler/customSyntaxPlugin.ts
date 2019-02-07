/* eslint-disable @typescript-eslint/camelcase */

import MarkdownIt from "markdown-it";
import Token from "markdown-it/lib/token";
import StateCore from "markdown-it/lib/rules_core/state_core";

const STRING_CHAR_CODE = 0x20;

type CustomSyntaxRule = "color";

const rules: Array<[CustomSyntaxRule, RegExp]> = [
  ["color", /\{color:(([a-zA-Z]*)|#([0-9a-fA-F]*))\}/],
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

function customSyntax(
  state: StateCore,
  token: Token,
  pos: number,
): Token[] | Token {
  for (const [type, rule] of rules) {
    const matches = rule.exec(token.content);
    if (matches) {
      const match = matches[0];
      const startIndex = matches.index;
      const endIndex = matches.index + match.length;

      const tokenBefore: Token = {
        ...new Token(token.type, token.tag, token.nesting),
        attrs: token.attrs,
        block: token.block,
        children: token.children,
        content: token.content.slice(0, startIndex),
        hidden: token.hidden,
        info: token.info,
        level: token.level,
        map: token.map,
        markup: token.markup,
        meta: token.meta,
        nesting: token.nesting,
        tag: token.tag,
        type: token.type,
      };

      const tokenAfter: Token = {
        ...new Token(token.type, token.tag, token.nesting),
        attrs: token.attrs,
        block: token.block,
        children: token.children,
        content: token.content.slice(endIndex),
        hidden: token.hidden,
        info: token.info,
        level: token.level,
        map: token.map,
        markup: token.markup,
        meta: token.meta,
        nesting: token.nesting,
        tag: token.tag,
        type: token.type,
      };

      const result = scanDelims(state.md, state.src, pos);
      const matchedToken: Token = new Token(
        type,
        "span",
        result.canOpen ? 1 : -1,
      );
      matchedToken.attrPush([type, match.split(":")[1].slice(0, -1)]);

      return [tokenBefore, matchedToken, tokenAfter].reduce(
        (acc, curr) => {
          if (curr.content || (curr.attrs && curr.attrGet(type))) {
            acc.push(curr);
          }
          return acc;
        },
        [] as Token[],
      );
    }
  }
  return token;
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
  md.renderer.rules.strong_open = strong_open;
  md.renderer.rules.strong_close = strong_close;
  md.renderer.rules.em_open = em_open;
  md.renderer.rules.em_close = em_close;
  md.renderer.rules.paragraph_open = paragraph_open;
  md.renderer.rules.paragraph_close = paragraph_close;
  md.core.ruler.push("customSyntaxRule", rule);
}
