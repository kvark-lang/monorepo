//import nearley from "npm:nearley";
//import "./parser.js";

const nearley = require("nearley");
const grammar = require("./parser.js");
var fs = require('fs');

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

//const text = Deno.readTextFileSync("reference.fug");

parser.feed("# Optional Header-In-File");
parser.feed("# =======================");


console.log(parser.results);