"use strict"

const log = console.log.bind (console)

// A tiny-lexer based tokenizer for HTML5
// =======================================

// ### The tokens

const tokens = {
  T_att_name: 'attribute-name'
  , T_att_equals: 'attribute-equals'
  , T_att_value_start: 'attribute-value-start'
  , T_att_value_data: 'attribute-value-data'
  , T_att_value_end: 'attribute-value-end'
  , T_comment_start: 'comment-start'
  , T_comment_start_bogus: 'comment-start-bogus'
  , T_comment_data: 'comment-data'
  , T_comment_end: 'comment-end'
  , T_comment_end_bogus: 'comment-end-bogus'
  , T_startTag_start: 'startTag-start'
  , T_endTag_start: 'endTag-start'
  , T_tag_end: 'tag-end'
  , T_tag_end_close: 'tag-end-autoclose'
  , T_charRef_decimal: 'charRef-decimal'
  , T_charRef_hex: 'charRef-hex'
  , T_charRef_named: 'charRef-named'
  , T_unescaped: 'unescaped'
  , T_space: 'space'
  , T_data: 'data'
  , T_rcdata: 'rcdata'
  , T_rawtext: 'rawtext'
  , T_plaintext: 'plaintext'
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


const grammar = 
{ data: [
  { if: STARTTAG_START,   emit: tokens.T_startTag_start,     goto: startTag      },
  { if: ENDTAG_START,     emit: tokens.T_endTag_start,       goto:'beforeAtt'    },
//{ if: DOCTYPE_START,    emit: tokens.T_doctype_start,      goto:'beforeName'   }, // before doctype name
  { if: '<!--',           emit: tokens.T_comment_start,      goto:'commentStart' },
  { if: '<[/!?]',         emit: tokens.T_comment_start_bogus,goto:'bogusComment' },
  { if: '[^<&]+',         emit: tokens.T_data                                    },
  { if: '<',              emit: tokens.T_unescaped                               },
  {                       emit: tokens.T_data,               goto: charRefIn     }],

rawtext: [
  { if: ENDTAG_START,     emit: maybeEndTagT,         goto: maybeEndTag   },
  { if: '.[^<]*',         emit: tokens.T_rawtext                                 }],

rcdata: [
  { if: ENDTAG_START,     emit: maybeEndTagT,         goto: maybeEndTag   },
  { if: '<',              emit: tokens.T_unescaped                               },
  { if: '[^<&]+',         emit: tokens.T_rcdata                                  },
  {                       emit: tokens.T_rcdata,             goto: charRefIn     }],

plaintext: [
  { if:'.+',              emit: tokens.T_plaintext                               }],

charRef: [
  { if: CHARREF_DEC,      emit: tokens.T_charRef_decimal,    goto: context       },
  { if: CHARREF_HEX,      emit: tokens.T_charRef_hex,        goto: context       },
  { if: CHARREF_NAME,     emit: tokens.T_charRef_named,      goto: context       },
  { if: '&',              emit: tokens.T_unescaped,          goto: context       }],

beforeAtt: [
  { if: '>',              emit: tokens.T_tag_end,            goto: content       },
  { if: '/>',             emit: tokens.T_tag_end_close,      goto: content       },
  { if: '[\t\n\f ]+',     emit: tokens.T_space,                                  },
  { if: '/+(?!>)',        emit: tokens.T_space,                                  }, // TODO, test / check with spec
  { if: ATTNAME,          emit: tokens.T_att_name,           goto:'afterAttName' }],

afterAttName: [
  { if: '>',              emit: tokens.T_tag_end,            goto: content       },
  { if: '/>',             emit: tokens.T_tag_end_close,      goto: content       },
  { if: '=[\t\n\f ]*',    emit: tokens.T_att_equals,         goto:'attValue'     },
  { if: '/+(?!>)',        emit: tokens.T_space,              goto:'beforeAtt'    },
  { if: '[\t\n\f ]+',     emit: tokens.T_space                                   },
  { if: ATTNAME,          emit: tokens.T_att_name                                }],

attValue: [ // 'equals' has eaten all the space
  { if: '>' ,             emit: tokens.T_tag_end,            goto: content       },
  { if: '"' ,             emit: tokens.T_att_value_start,    goto:'doubleQuoted' },
  { if: "'" ,             emit: tokens.T_att_value_start,    goto:'singleQuoted' },
  {                       emit: tokens.T_att_value_start,    goto:'unquoted'     }],

unquoted: [
  { if: ATT_UNQUOT,       emit: tokens.T_att_value_data                          },
  { if: '(?=[>\t\n\f ])', emit: tokens.T_att_value_end,      goto:'beforeAtt'    },
  {                       emit: tokens.T_att_value_data,     goto: charRefIn     }],

doubleQuoted: [
  { if: '[^"&]+',         emit: tokens.T_att_value_data                          },
  { if: '"',              emit: tokens.T_att_value_end,      goto:'beforeAtt'    },
  {                       emit: tokens.T_att_value_data,     goto: charRefIn     }],

singleQuoted: [
  { if: "[^'&]+",         emit: tokens.T_att_value_data                          },
  { if: "'",              emit: tokens.T_att_value_end,      goto:'beforeAtt'    },
  {                       emit: tokens.T_att_value_data,     goto: charRefIn     }],

bogusComment: [
  { if: '[^>]+',          emit: tokens.T_comment_data,       goto:'bogusComment' },
  { if: '>',              emit: tokens.T_comment_end_bogus,  goto: content       }],

commentStart: [
  { if: '-?>',            emit: tokens.T_comment_end,        goto: content       },
  { if: '--!?>',          emit: tokens.T_comment_end,        goto: content       },
  { if: '--!',            emit: tokens.T_comment_data,       goto:'comment'      },
  { if: '--?',            emit: tokens.T_comment_data,       goto:'comment'      },
  { if: '[^>-][^-]*',     emit: tokens.T_comment_data,       goto:'comment'      }],

comment: [
  { if: '--!?>',          emit: tokens.T_comment_end,        goto: content       },
  { if: '--!'  ,          emit: tokens.T_comment_data                            },
  { if: '--?'  ,          emit: tokens.T_comment_data                            },
  { if: '[^-]+',          emit: tokens.T_comment_data                            }]
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

function CustomState () {
  this.content = 'data' // one of { data, rcdata, rawtext, unquoted, doubleQuoted, singleQuoted }
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
    return tokens.T_endTag_start }
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
    self [Symbol.iterator] = function () { return self }
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

const chunker = new TinyLexer (grammar, 'data', CustomState)

function tokenize (input) {
  return chunker.tokenize (input)
}


// Exports
module.exports.tokenize = tokenize
module.exports.tokens = tokens
