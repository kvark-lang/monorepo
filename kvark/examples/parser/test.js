// import nearley from "npm:nearley";
// import "./parser.js";

const nearley = require("nearley");
const grammar = require("./parser.js");

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

//const text = Deno.readTextFileSync("reference.fug");

//parser.feed(text);
//parser.feed("# nudelsuppe in meinem Arsch");
parser.feed("declare type = executable");
parser.feed("declare by = \"Valentin Romanovich Popov\"");
console.log(parser.results);