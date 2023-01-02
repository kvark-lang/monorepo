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

#Test Font idk what to say

@lexer lexer

#comment -> %hash %ws %word

#declare -> "declare" %ws %word %ws %eq %ws %dq %word %dq
#        |  "declare" %ws %word %ws %eq %ws %word

integers -> "octet" %ws %word %ws %eq %ws %number %lineend
        | "word" %ws %word %ws %eq %ws %number %lineend
        | "dword" %ws %word %ws %eq %ws %number %lineend
        | "qword" %ws %word %ws %eq %ws %number %lineend
        | "oword" %ws %word %ws %eq %ws %number %lineend