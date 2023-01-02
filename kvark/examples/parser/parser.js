// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const moo = require("moo");

const lexer = moo.compile({
    hash: /#/,
    ws:     /[ \t]+/,
    number: /[0-9]+/,
    word: { match: /\w+/},
    dq: /"/,
    eq: /=/,
    lineend: /;/
});
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "comment", "symbols": [(lexer.has("hash") ? {type: "hash"} : hash), (lexer.has("ws") ? {type: "ws"} : ws), (lexer.has("word") ? {type: "word"} : word)]},
    {"name": "comment", "symbols": [(lexer.has("hash") ? {type: "hash"} : hash), (lexer.has("ws") ? {type: "ws"} : ws), (lexer.has("word") ? {type: "word"} : word), (lexer.has("ws") ? {type: "ws"} : ws), (lexer.has("word") ? {type: "word"} : word)]},
    {"name": "comment", "symbols": [(lexer.has("hash") ? {type: "hash"} : hash), (lexer.has("ws") ? {type: "ws"} : ws), (lexer.has("word") ? {type: "word"} : word), (lexer.has("ws") ? {type: "ws"} : ws), (lexer.has("word") ? {type: "word"} : word), (lexer.has("ws") ? {type: "ws"} : ws), (lexer.has("word") ? {type: "word"} : word)]},
    {"name": "comment", "symbols": [(lexer.has("hash") ? {type: "hash"} : hash), (lexer.has("ws") ? {type: "ws"} : ws), (lexer.has("word") ? {type: "word"} : word), (lexer.has("ws") ? {type: "ws"} : ws), (lexer.has("word") ? {type: "word"} : word), (lexer.has("ws") ? {type: "ws"} : ws), (lexer.has("word") ? {type: "word"} : word), (lexer.has("ws") ? {type: "ws"} : ws), (lexer.has("word") ? {type: "word"} : word)]},
    {"name": "declare", "symbols": [{"literal":"declare"}, (lexer.has("ws") ? {type: "ws"} : ws), (lexer.has("word") ? {type: "word"} : word), (lexer.has("ws") ? {type: "ws"} : ws), (lexer.has("eq") ? {type: "eq"} : eq), (lexer.has("ws") ? {type: "ws"} : ws), (lexer.has("dq") ? {type: "dq"} : dq), (lexer.has("word") ? {type: "word"} : word), (lexer.has("dq") ? {type: "dq"} : dq)]},
    {"name": "declare", "symbols": [{"literal":"declare"}, (lexer.has("ws") ? {type: "ws"} : ws), (lexer.has("word") ? {type: "word"} : word), (lexer.has("ws") ? {type: "ws"} : ws), (lexer.has("eq") ? {type: "eq"} : eq), (lexer.has("ws") ? {type: "ws"} : ws), (lexer.has("word") ? {type: "word"} : word)]}
]
  , ParserStart: "comment"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
