// Token builder
// =============

// Takes a stream of chunks and builds 'tokens' in the sense of the whatWG specification. 
// Tokens then, are starttags, endtages, and text nodes. 
// Doctype tokens aren't supported yet, also, scriptData isn't in the sense that preceding <!-- isn't handled. 

function StartTag (name) {
  this.name = name
  this.attributes = []
  this.selfClosing = false
}

function EndTag (name) {
  this.name = name
  this.selfClosing = false
  this.attributes = []
}

function Attribute (name) {
  this.name = name
  this.value
}

function Comment () {
  this.data = ''
}


function* tokens (chunkStream) {
  let token, attr
  for (var chunk of chunkStream)
    switch (chunk [0]) {
      const value = chunk [1]

      case T_att_name:
        token.attributes.push (attr = new Attribute (value))
      break

      case T_att_value_start:
        attr.value = ''
      break

      case T_att_value_data:
        attr.value += value
      break

      case T_att_value_end:
        attr = null
      break

      case T_startTag_start:
        token = new StartTag (value.substr (1))
      break

      case T_endTag_start:
        token = new EndTag (value.substr (2))
      break

      case T_comment_start:
      case T_comment_start_bogus:
        token = new Comment ()
      break

      case T_comment_data:
        token.data += value
      break

      case T_tag_end:
      case T_comment_end:
      case T_comment_end_bogus:
        yield token
      break

      case T_tag_end_close:
        token.selfClosing = true
        yield token
      break

      case T_charRef_decimal:
        const codepoint = parseInt (value.substr (2), 10)
        // todo
      break

      case T_charRef_hex:
        const codepoint = parseInt (value.substr (3), 16)
        // todo
      break

      case T_charRef_named:
      break

      case T_unescaped:
      case T_data:
      case T_rcdata:
      case T_rawtext:
      case T_plaintext:
        yield value
      break
    }
}