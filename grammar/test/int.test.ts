import { assertEquals } from "https://deno.land/std@0.154.0/testing/asserts.ts";
import nearley from "npm:nearley";
import compiledGrammar from "../.build/parser.ts";

const { Parser, Grammar } = nearley

const grammar = Grammar.fromCompiled(compiledGrammar)

console.log(grammar)

Deno.test({
  name: "test parsing of integertypes",
  fn: async (t) => {
    const parser = new Parser(grammar);

    await t.step({
      name: "test octet",
      fn: () => {
        // FIXME it seems there are many results? is the grammar ambigious?
        parser.feed("octet i8 = 100; word  i16 = 10000;");
        //  word  i16 = 10000; dword i32 = 100000; qword i64 = 100000; oword i128 = 100000;
        const results = parser.results
        console.log(results)
      },
    });
  },
});