A tiny HTML5 lexer 
==================

A tiny standard compliant HTML5 lexer/ chunker. 
Its small size should make it ideal for client side usage. 

The chunker preserves all input characters, so it is suitable for building 
a syntax highlighter or html editor on top of it as well, if you like. 

It is lazy/ on demand, so it does not unnecessarily buffer chunks. 

I would love for someone to build a tiny template language with it. 
Feel free to contact me with any questions. 


Api
---

Simply, one top level function `chunks` that returns an iterator.

```javascript
let tinyhtml = require ('tiny-html-lexer')
let stream = tinyhtml.chunks ('<span>Hello, world</span>')
for (let chunk of stream)
  console.log (chunk)
```

Alternatively, without `for .. of`
(should work just fine in ES5 environments):

```javascript
let stream = tinyhtml.chunks ('<span>Hello, world</span>') .next ()
while (!stream.done) {
  console.log (stream.value)
  stream.next ()
}
```

Each call to `next ()` mutates and returns the iterator object itself, 
rather than the usual separate `{ value, done }` objects. It seems superfluous 
to create new wrapper objects for each chunk, so I went with this instead. 

Tokens are tuples (arrays) `[type, chunk]` where type is one of

- `"attribute-name"`
- `"attribute-equals"`
- `"attribute-value-start"`
- `"attribute-value-data"`
- `"attribute-value-end"`
- `"comment-start"`
- `"comment-start-bogus"`
- `"comment-data"`
- `"comment-end"`
- `"comment-end-bogus"`
- `"startTag-start"`
- `"endTag-start"`
- `"tag-end"`
- `"tag-end-autoclose"`
- `"charRef-decimal"`
- `"charRef-hex"`
- `"charRef-named"`
- `"unescaped"`
- `"space"`
- `"data"`
- `"rcdata"`
- `"rawtext"`
- `"plaintext"`


Limitations
-----------

- Doctype tokens are preserved, but are parsed as bogus comments
rather than as doctype tokens. 

- CData (only used in svg/ foreign content) is likewise parsed as 
bogus comments. 
 

Some implementation details
---------------------------

The idea is that the lexical grammar can be very compactly expressed by
a state machine that has transitions labeled with regular expressions
rather than individual characters. 

I am using regular expressions without capture groups for the transitions. 
For each state, the outgoing transitions are then wrapped in parentheses to 
create a capture group and then are all joined together as alternates in
a single regular expression per state. When this regular expression is 
executed, one can then check which transition was taken by checking which
index in the result of regex.exec is present. 


License
-----------

MIT. 

Enjoy!
