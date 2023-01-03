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
        // TODO actually assert something
        // URGENT
        // FIXME it seems there are many results? is the grammar ambigious?
        parser.feed("octet i8 = 100");
        parser.feed("word  i16 = 10000");
        parser.feed("dword i32 = 100000");
        parser.feed("qword i64 = 100000");
        parser.feed("oword i128 = 100000");
        assertEquals(parser.results[0], [
          [
            [{ type: "octet", name: "i8", value: 100 }],
            [{ type: "word", name: "i16", value: 10000 }],
            [{ type: "dword", name: "i32", value: 100000 }],
            [{ type: "qword", name: "i64", value: 100000 }],
            [{ type: "oword", name: "i128", value: 100000 }],
          ],
        ]);
      },
    });
  },
});
