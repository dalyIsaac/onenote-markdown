import MarkdownIt from "markdown-it";
import Token from "markdown-it/lib/token";
import StateCore from "markdown-it/lib/rules_core/state_core";

function renderer(tokens: Token[], index: number): string {
  const token = tokens[index];
  if (token.nesting === 1) {
    return `<span style="color:${token.attrGet("color")}">`;
  } else if (token.nesting === -1) {
    return "</span>";
  } else {
    return "";
  }
}

const STRING_CHAR_CODE = 0x20;

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

const colorMatcher = /\{color:(([a-zA-Z]*)|#([0-9a-fA-F]*))\}/;

function customSyntax(
  state: StateCore,
  token: Token,
  pos: number,
): Token[] | Token {
  const matches = colorMatcher.exec(token.content);
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
    const colorToken: Token = new Token(
      "color",
      "span",
      result.canOpen ? 1 : -1,
    );
    colorToken.attrPush(["color", match.split(":")[1].slice(0, -1)]);

    return [tokenBefore, colorToken, tokenAfter].reduce(
      (acc, curr) => {
        if (curr.content || (curr.attrs && curr.attrGet("color"))) {
          acc.push(curr);
        }
        return acc;
      },
      [] as Token[],
    );
  } else {
    return token;
  }
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
  md.renderer.rules.color = renderer;
  md.core.ruler.push("color", rule);
}
