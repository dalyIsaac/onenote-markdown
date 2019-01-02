declare module "tiny-html-lexer" {
  type ContentType = "data"| "rcdata"| "rawtext"| "unquoted" | "doubleQuoted"| "singleQuoted"
  class CustomState {
    content: ContentType;
    tagName: string;
  }

  interface TokenizeResult {
    value: [string, string];
    done: boolean;
    next: () => TokenizeResult;
    state: CustomState;
    [Symbol.iterator]: () => TokenizeResult;
  }
  export function chunks(input: string): TokenizeResult;

  export const tokens: {
    T_att_name: string;
    T_att_equals: string;
    T_att_value_start: string;
    T_att_value_data: string;
    T_att_value_end: string;
    T_comment_start: string;
    T_comment_start_bogus: string;
    T_comment_data: string;
    T_comment_end: string;
    T_comment_end_bogus: string;
    T_startTag_start: string;
    T_endTag_start: string;
    T_tag_end: string;
    T_tag_end_close: string;
    T_charRef_decimal: string;
    T_charRef_hex: string;
    T_charRef_named: string;
    T_unescaped: string;
    T_space: string;
    T_data: string;
    T_rcdata: string;
    T_rawtext: string;
    T_plaintext: string;
  };
}
