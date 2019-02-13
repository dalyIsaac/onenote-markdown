import MarkdownIt from "markdown-it";
import Token from "markdown-it/lib/token";
import StateCore from "markdown-it/lib/rules_core/state_core";

const STRING_CHAR_CODE = 0x20;

/**
 * Style attribute names
 */
export enum Attributes {
  backgroundColor = "backgroundColor",
  color = "color",
  textDecoration = "textDecoration",
}

/**
 * Name of inline tags.
 */
enum InlineTags {
  sub = "sub",
  sup = "sup",
}

/**
 * Regex rule for detecting inline tags.
 */
const tagRule = /{![a-zA-Z][a-zA-Z0-9]*\} /;

/**
 * Array of tuples of rule names and regex.
 */
const rules: Array<[Attributes | InlineTags, RegExp]> = [
  [Attributes.color, /\{color:(([a-zA-Z]*)|#([0-9a-fA-F]*))\}/],
  [
    Attributes.textDecoration,
    // eslint-disable-next-line max-len
    /\{text-decoration:((underline( line-through){0,1})|(line-through( underline){0,1}))\}/,
  ],
  [
    Attributes.backgroundColor,
    /\{background-color:(([a-zA-Z]*)|#([0-9a-fA-F]*))\}/,
  ],
  [InlineTags.sup, /{!sup}/],
  [InlineTags.sub, /{!sub}/],
];

/**
 * Scans delimiters based, and indicates whether the token can be an open
 * and/or closing tag.
` * Based on https://github.com/markdown-it/markdown-it/blob/1ad3aec2041cd2defa7e299543cc1e42184b680d/lib/rules_inline/state_inline.js#L69
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
 * Contains a stack of the string of the delimiting tokens - i.e. the strings
 * of the markdown tokens.
 */
let delimStack: string[] = [];

/**
 * An array of sets which contain equivalent strings inside the markdown.
 */
const equivalentValues = [
  new Set([
    "{text-decoration:underline line-through}",
    "{text-decoration:line-through underline}",
  ]),
];

/**
 * Compares the two values to see if they're identical strings, or if they have
 * equivalent values, as specified in `equivalentValues`.
 */
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
 * Handles a match for the custom markdown syntax.
 * @param state markdown-it's state.
 * @param ruleName The name of the rule.
 * @param matches The regex match.
 * @param currentToken The current token being processed.
 * @param pos The position of inside `state.src`.
 * @param tokens Array of the current tokens.
 */
function handleMatch(
  state: StateCore,
  ruleName: Attributes | InlineTags,
  matches: RegExpExecArray,
  currentToken: Token,
  pos: number,
  tokens: Token[],
): { pos: number; tokens: Token[] } {
  const match = matches[0];
  const startIndex = matches.index;
  const endIndex = matches.index + match.length;
  const tokenBefore: Token = {
    ...new Token(currentToken.type, currentToken.tag, currentToken.nesting),
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
    ...new Token(currentToken.type, currentToken.tag, currentToken.nesting),
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
    ruleName,
    ruleName in InlineTags ? ruleName : "span",
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
  if (!(ruleName in InlineTags)) {
    matchedToken.attrPush([ruleName, match.split(":")[1].slice(0, -1)]);
  }
  tokens.pop();
  tokens = tokens.concat(
    [tokenBefore, matchedToken, tokenAfter].reduce(
      (acc, curr) => {
        if (
          curr.content ||
          (curr.attrs && curr.attrGet(ruleName)) ||
          curr.type in InlineTags
        ) {
          acc.push(curr);
        }
        return acc;
      },
      [] as Token[],
    ),
  );
  pos += tokenAfter.content.length;
  return { pos, tokens };
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
    for (const [ruleName, rule] of rules) {
      const matches = rule.exec(currentToken.content);
      if (matches) {
        continueChecking = true;
        ({ pos, tokens } = handleMatch(
          state,
          ruleName,
          matches,
          currentToken,
          pos,
          tokens,
        ));
      }
    }
  }
  return tokens;
}

/**
 * The `markdown-it` rule for the custom syntax.
 * @param state The state of the compiler.
 */
export function rule(state: StateCore): void {
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
