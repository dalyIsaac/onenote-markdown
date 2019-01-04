const lexer = require('./tiny-lexer')
module.exports = { chunks:lexer.tokenize, tokenTypes: lexer.tokenTypes }
