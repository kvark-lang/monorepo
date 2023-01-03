import { assertEquals } from "https://deno.land/std@0.154.0/testing/asserts.ts";
import nearley from "npm:nearley";
import grammar from "../.build/parser.ts";

Deno.test({
  name: "test parsing of data types",
  fn: async (t) => {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

    await t.step({
      name: "test octet",
      fn: () => {
        parser.feed("octet i8 = 10;");
        parser.feed("word  i16 = 10;");
        parser.feed("dword  i32 = 10;");
        console.log(parser.results);
      },
    });
  },
});

// parser.feed("word i16 = 10;");
// parser.feed("dword i32 = 10;");
// parser.feed("qword i64 = 10;");
// parser.feed("oword i128 = 10;"
