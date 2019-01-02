let tinyhtml = require ('../lib')

let stream = tinyhtml.chunks ('<span>Hello, world</span>') .next ()

while (!stream.done) {
  console.log (stream.value)
  stream.next ()
}
