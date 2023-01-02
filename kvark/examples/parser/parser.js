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
    {"name": "integers", "symbols": [{"literal":"octet"}, (lexer.has("ws") ? {type: "ws"} : ws), (lexer.has("word") ? {type: "word"} : word), (lexer.has("ws") ? {type: "ws"} : ws), (lexer.has("eq") ? {type: "eq"} : eq), (lexer.has("ws") ? {type: "ws"} : ws), (lexer.has("number") ? {type: "number"} : number), (lexer.has("lineend") ? {type: "lineend"} : lineend)]},
    {"name": "integers", "symbols": [{"literal":"word"}, (lexer.has("ws") ? {type: "ws"} : ws), (lexer.has("word") ? {type: "word"} : word), (lexer.has("ws") ? {type: "ws"} : ws), (lexer.has("eq") ? {type: "eq"} : eq), (lexer.has("ws") ? {type: "ws"} : ws), (lexer.has("number") ? {type: "number"} : number), (lexer.has("lineend") ? {type: "lineend"} : lineend)]},
    {"name": "integers", "symbols": [{"literal":"dword"}, (lexer.has("ws") ? {type: "ws"} : ws), (lexer.has("word") ? {type: "word"} : word), (lexer.has("ws") ? {type: "ws"} : ws), (lexer.has("eq") ? {type: "eq"} : eq), (lexer.has("ws") ? {type: "ws"} : ws), (lexer.has("number") ? {type: "number"} : number), (lexer.has("lineend") ? {type: "lineend"} : lineend)]},
    {"name": "integers", "symbols": [{"literal":"qword"}, (lexer.has("ws") ? {type: "ws"} : ws), (lexer.has("word") ? {type: "word"} : word), (lexer.has("ws") ? {type: "ws"} : ws), (lexer.has("eq") ? {type: "eq"} : eq), (lexer.has("ws") ? {type: "ws"} : ws), (lexer.has("number") ? {type: "number"} : number), (lexer.has("lineend") ? {type: "lineend"} : lineend)]},
    {"name": "integers", "symbols": [{"literal":"oword"}, (lexer.has("ws") ? {type: "ws"} : ws), (lexer.has("word") ? {type: "word"} : word), (lexer.has("ws") ? {type: "ws"} : ws), (lexer.has("eq") ? {type: "eq"} : eq), (lexer.has("ws") ? {type: "ws"} : ws), (lexer.has("number") ? {type: "number"} : number), (lexer.has("lineend") ? {type: "lineend"} : lineend)]}
]
  , ParserStart: "integers"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
