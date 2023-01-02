//import nearley from "npm:nearley";
//import "./parser.js";

const nearley = require("nearley");
const grammar = require("./parser.js");

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

//const text = Deno.readTextFileSync("reference.fug");

parser.feed("octet i8 = 10;");
parser.feed("word i16 = 10;");
parser.feed("dword i32 = 10;");
parser.feed("qword i64 = 10;");
parser.feed("oword i128 = 10;");

console.log(parser.results);