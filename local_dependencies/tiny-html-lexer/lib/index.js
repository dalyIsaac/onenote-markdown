const lexer = require('./tiny-lexer')
module.exports = { chunks:lexer.tokenize, tokens: lexer.tokens }
