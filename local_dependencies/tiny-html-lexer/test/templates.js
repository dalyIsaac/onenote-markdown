"use strict"

const { tag, end, renderTo } = require ('tagscript')
const log = console.log.bind (console)
module.exports = { head, renderTokens, flush }


function head (cssfile) { return function (contents)  {
  const header = 
    [ tag ('html')
    ,   tag ('head')
    ,     stylesheet (cssfile)
    ,   end ('head')
    ,   tag ('body')
    ,     contents
    ,   end ('body')
    , end ('html') ]
  return header
} }

function stylesheet (href) {
  return tag ('link', { rel:'stylesheet', type:'text/css', href:href })
}

function renderTokens (tokens) {
  const pre = 
    [ tag ('pre') //, samples[a], leaf ('br'), '\n'
    ,   map (token => 
          [ tag ('span', { class:token[0], title:token[0] }), token[1], end('span') ])
        (tokens)
    , end ('pre') ]
  return pre
}


function map (fn) { return function* (obj) {
  for (let a of obj) yield fn (a)
} }


function flush (obj) {
  try {
    renderTo (process.stdout, obj)
    process.exit (205)
  }
  catch (e) {
    log (e)
  }
}
