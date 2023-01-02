@{%
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
%}

@lexer lexer

comment -> %hash %ws %word
        |  %hash %ws %word %ws %word
        |  %hash %ws %word %ws %word %ws %word
        |  %hash %ws %word %ws %word %ws %word %ws %word

declare -> "declare" %ws %word %ws %eq %ws %dq %word %dq
        |  "declare" %ws %word %ws %eq %ws %word