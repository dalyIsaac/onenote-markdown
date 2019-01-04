"use strict"

const log = console.log.bind (console)

// A tiny-lexer based tokenizer for HTML5
// =======================================

// ### The tokens

const tokenTypes = {
  attributeName: 'attribute-name',
  attributeAssign: 'attribute-assign',
  attributeValueStart: 'attribute-value-start',
  attributeValueData : 'attribute-value-data',
  attributeValueEnd: 'attribute-value-end',
  commentStart: 'comment-start',
  commentStartBogus: 'comment-start-bogus',
  commentData: 'comment-data',
  commentEnd: 'comment-end',
  commentEndBogus: 'comment-end-bogus',
  startTagStart: 'startTag-start',
  endTagStart: 'endTag-start',
  tagEnd: 'tag-end',
  tagEndClose: 'tag-end-autoclose',
  charRefDecimal: 'charRef-decimal',
  charRefHex: 'charRef-hex',
  charRefNamed: 'charRef-named',
  unescaped: 'unescaped',
  space: 'space',
  data: 'data',
  rcdata: 'rcdata',
  rawtext: 'rawtext',
  plaintext: 'plaintext'
}


//### The grammar

const STARTTAG_START = '<[a-zA-Z][^>/\t\n\f ]*'
const ENDTAG_START = '</[a-zA-Z][^>/\t\n\f ]*'
const CHARREF_DEC = '&#[0-9]+;?'
const CHARREF_HEX = '&#[xX][0-9A-Fa-f]+;?'
const CHARREF_NAME = '&[A-Za-z][A-Za-z0-9]*;?'
const ATTNAME = '.[^>/\t\n\f =]*' /* '[^>/\t\n\f ][^>/\t\n\f =]*' */
const ATT_UNQUOT = '[^&>\t\n\f ]+'
const DOCTYPE_START = '<![Dd][Oo][Cc][Tt][Yy][Pp][Ee]'

const T = tokenTypes
const grammar = 
{ data: [
  { if: STARTTAG_START,   emit: T.startTagStart,       goto: startTag      },
  { if: ENDTAG_START,     emit: T.endTagStart,         goto:'beforeAtt'    },
//{ if: DOCTYPE_START,    emit: T.doctype_start,       goto:'beforeName'   }, // before doctype name
  { if: '<!--',           emit: T.commentStart,        goto:'commentStart' },
  { if: '<[/!?]',         emit: T.commentStartBogus,   goto:'bogusComment' },
  { if: '[^<&]+',         emit: T.data                                     },
  { if: '<',              emit: T.unescaped                                },
  {                       emit: T.data,                goto: charRefIn     }],

rawtext: [
  { if: ENDTAG_START,     emit: maybeEndTagT,          goto: maybeEndTag   },
  { if: '.[^<]*',         emit: T.rawtext                                  }],

rcdata: [
  { if: ENDTAG_START,     emit: maybeEndTagT,          goto: maybeEndTag   },
  { if: '<',              emit: T.unescaped                                },
  { if: '[^<&]+',         emit: T.rcdata                                   },
  {                       emit: T.rcdata,              goto: charRefIn     }],

plaintext: [
  { if:'.+',              emit: T.plaintext                                }],

charRef: [
  { if: CHARREF_DEC,      emit: T.charRefDecimal,      goto: context       },
  { if: CHARREF_HEX,      emit: T.charRefHex,          goto: context       },
  { if: CHARREF_NAME,     emit: T.charRefNamed,        goto: context       },
  { if: '&',              emit: T.unescaped,           goto: context       }],

beforeAtt: [
  { if: '>',              emit: T.tagEnd,              goto: content       },
  { if: '/>',             emit: T.tagEndClose,         goto: content       },
  { if: '[\t\n\f ]+',     emit: T.space,                                   },
  { if: '/+(?!>)',        emit: T.space,                                   }, // TODO, test / check with spec
  { if: ATTNAME,          emit: T.attributeName,       goto:'afterAttName' }],

afterAttName: [
  { if: '>',              emit: T.tagEnd,              goto: content       },
  { if: '/>',             emit: T.tagEndClose,         goto: content       },
  { if: '=[\t\n\f ]*',    emit: T.attributeAssign,     goto:'attValue'     },
  { if: '/+(?!>)',        emit: T.space,               goto:'beforeAtt'    },
  { if: '[\t\n\f ]+',     emit: T.space                                    },
  { if: ATTNAME,          emit: T.attributeName                            }],

attValue: [ // 'equals' has eaten all the space
  { if: '>' ,             emit: T.tagEnd,              goto: content       },
  { if: '"' ,             emit: T.attributeValueStart, goto:'doubleQuoted' },
  { if: "'" ,             emit: T.attributeValueStart, goto:'singleQuoted' },
  {                       emit: T.attributeValueStart, goto:'unquoted'     }],

unquoted: [
  { if: ATT_UNQUOT,       emit: T.attributeValueData                       },
  { if: '(?=[>\t\n\f ])', emit: T.attributeValueEnd,   goto:'beforeAtt'    },
  {                       emit: T.attributeValueData,  goto: charRefIn     }],

doubleQuoted: [
  { if: '[^"&]+',         emit: T.attributeValueData                       },
  { if: '"',              emit: T.attributeValueEnd,   goto:'beforeAtt'    },
  {                       emit: T.attributeValueData,  goto: charRefIn     }],

singleQuoted: [
  { if: "[^'&]+",         emit: T.attributeValueData                       },
  { if: "'",              emit: T.attributeValueEnd,   goto:'beforeAtt'    },
  {                       emit: T.attributeValueData,  goto: charRefIn     }],

bogusComment: [
  { if: '[^>]+',          emit: T.commentData,         goto:'bogusComment' },
  { if: '>',              emit: T.commentEndBogus,     goto: content       }],

commentStart: [
  { if: '-?>',            emit: T.commentEnd,          goto: content       },
  { if: '--!?>',          emit: T.commentEnd,          goto: content       },
  { if: '--!',            emit: T.commentData,         goto:'comment'      },
  { if: '--?',            emit: T.commentData,         goto:'comment'      },
  { if: '[^>-][^-]*',     emit: T.commentData,         goto:'comment'      }],

comment: [
  { if: '--!?>',          emit: T.commentEnd,          goto: content       },
  { if: '--!'  ,          emit: T.commentData                              },
  { if: '--?'  ,          emit: T.commentData                              },
  { if: '[^-]+',          emit: T.commentData                              }]
}


// Additional state management, to
//  supplement the grammar/ state machine. 

const content_map = 
  { style: 'rawtext'
  , script: 'rawtext'
  , xmp: 'rawtext'
  , iframe: 'rawtext'
  , noembed: 'rawtext'
  , noframes: 'rawtext'
  , textarea: 'rcdata'
  , title: 'rcdata'
  , plaintext: 'plaintext'
  //, noscript: 'rawtext' // if scripting is enabled in a UA
  }

function PrivateState () {
  this.content = 'data' // one of { data, rcdata, rawtext, unquoted, doubleQuoted, singleQuoted }
  this.context = 'data' // likewise
  this.tagName // the last seen 'startTag-start' name 
}

function startTag (_, chunk) {
  let tagName = chunk.substr (1)
  this.tagName = tagName
  this.content = tagName in content_map ? content_map[tagName] : 'data'
  return 'beforeAtt'      
}

function content () {
  return this.content
}

function context () {
  return this.context
}

function maybeEndTagT (_, chunk) {
  if (chunk.substr (2) === this.tagName) {
    this.content = 'data'
    return T.endTagStart
  }
  else return this.content // TODO careful, this is a token type, not a state!
}

function maybeEndTag (symbol, chunk) {
  if (chunk.substr (2) === this.tagName) {
    this.content = 'data'
    return 'beforeAtt'
  }
  else return symbol
}

function charRefIn (symbol, chunk) {
  this.context = symbol
  return 'charRef'
}


// The compiler and runtime
// ------------------------

function State (table, name) {
  this.regex = new RegExp ('(' + table.map (fst) .join (')|(') + ')', 'g')
  this.edges = table.map ( fn )
  function fn (row) {
    if (row instanceof Array)
    return { goto:row.length > 2 ? row[2] : name, emit: row[1] }
    else return { goto:'goto' in row ? row.goto : name, emit: 'emit' in row ? row.emit : null }
    //return { emit:row.emit goto:row.goto }
  }
}

function compile (grammar) {
  const compiled = {}
  for (let state_name in grammar)
    compiled [state_name] = new State (grammar [state_name], state_name)
  return compiled
}

function fst (row) {
  if (row instanceof Array) return row[0]
  else return ('if' in row) ? row ['if'] : '.{0}'
}


// The Lexer runtime
// -----------------

if (typeof Symbol === 'undefined')
  Symbol = { iterator:'@@iterator' }

function TinyLexer (grammar, start, CustomState) {
  const states = compile (grammar)
  this.tokenize = tokenize

  function tokenize (input) {
    const custom = new CustomState ()
    let symbol = start
      , state = states [symbol]
      , position = 0

    const self = { value: null, done: false, next: next, state: custom }
    self [Symbol.iterator] = function () { return self } // TODO: decide on API
    return self

    function next () {
      const regex = state.regex
      regex.lastIndex = position
      const match = regex.exec (input)

      if (position === input.length && regex.lastIndex === 0) {
        self.value = null
        self.done = true
        return self
      }

      if (match == null)
        throw new SyntaxError ('Lexer: invalid input before: '+input.substr (position, 12))

      position = custom.position = regex.lastIndex

      let i = 1; while (match [i] == null) i++
      const edge = state.edges [i-1]

      self.value = typeof edge.emit === 'function'
        ? [edge.emit.call (custom, symbol, match[i]), match [i]]
        : [edge.emit, match [i]]

      symbol = typeof edge.goto === 'function'
        ? edge.goto.call (custom, symbol, match [i])
        : edge.goto

      state = states [symbol]
      if (state == null) 
        throw new Error ('Lexer: no such symbol: '+symbol)
  
      return self
    }
  }
}


// The compiler
// ------------

function compile (grammar) {
  const compiled = {}
  for (let state_name in grammar)
    compiled [state_name] = new State (grammar [state_name], state_name)
  return compiled
}

function State (table, name) {
  this.name = name
  this.regex = new RegExp ('(' + table.map (fst) .join (')|(') + ')', 'gy')
  this.edges = table.map ( fn )

  function fn (row) {
    return {
      goto: 'goto' in row ? row.goto : name, 
      emit: 'emit' in row ? row.emit : null
    }
  }
}

function fst (row) {
  return ('if' in row) ? row ['if'] : '.{0}'
}


//

const chunker = new TinyLexer (grammar, 'data', PrivateState)

function tokenize (input) {
  return chunker.tokenize (input)
}


// Exports
module.exports.tokenize = tokenize
module.exports.tokenTypes = tokenTypes
