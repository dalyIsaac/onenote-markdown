declare module 'tiny-html-lexer' {

  type TokenType
    = 'attribute-name'
    | 'attribute-assign'
    | 'attribute-value-start'
    | 'attribute-value-data'
    | 'attribute-value-end'
    | 'comment-start'
    | 'comment-start-bogus'
    | 'comment-data'
    | 'comment-end'
    | 'comment-end-bogus'
    | 'startTag-start'
    | 'endTag-start'
    | 'tag-end'
    | 'tag-end-autoclose'
    | 'charRef-decimal'
    | 'charRef-hex'
    | 'charRef-named'
    | 'unescaped'
    | 'space'
    | 'data'
    | 'rcdata'
    | 'rawtext'
    | 'plaintext'

  type Token = [TokenType, string]

  class TokenStream implements IterableIterator<Token> {
    value: Token | null
    done: boolean
    next: () => IteratorResult<Token>
    [Symbol.iterator]: () => TokenStream
    state: PrivateState
  }

  type ContentType
    = 'data'
    | 'rcdata'
    | 'rawtext'
    | 'unquoted'
    | 'doubleQuoted'
    | 'singleQuoted'

  class PrivateState {
    content: ContentType
    context: ContentType
    tagName: string
    position: number
  }

  export function chunks (input: string): TokenStream

}