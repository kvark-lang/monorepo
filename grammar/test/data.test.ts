import { assertEquals } from "https://deno.land/std@0.154.0/testing/asserts.ts";
import nearley from "npm:nearley";
import grammar from "../.build/parser.ts";

Deno.test({
  name: "test parsing of integertypes",
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
        const results = parser.results[0][0]
        console.log(results)
        assertEquals(results, [
          [[{ type: "octet", name: "i8", value: 100 }]],
          [[{ type: "word", name: "i16", value: 10000 }]],
          [[{ type: "dword", name: "i32", value: 100000 }]],
          [[{ type: "qword", name: "i64", value: 100000 }]],
          [[{ type: "oword", name: "i128", value: 100000 }]],
        ]);
      },
    });
  },
});

Deno.test({
  name: "test parsing of floattypes",
  fn: async (t) => {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

    await t.step({
      name: "test half",
      fn: () => {
        // TODO actually assert something
        // URGENT
        // FIXME it seems there are many results? is the grammar ambigious?
        parser.feed("half    h = 10.1");
        parser.feed("float   f = 100.10");
        parser.feed("double  d = 1.10000");
        parser.feed("extp    e = 1000.10");
        parser.feed("quad    q = 10.1000");
        const results = parser.results[0][0]
        console.log(results)
        assertEquals(results, [
          [[{ type: "half", name: "h", value: 10.1 }]],
          [[{ type: "float", name: "f", value: 100.10 }]],
          [[{ type: "double", name: "d", value: 1.10000 }]],
          [[{ type: "extp", name: "e", value: 1000.10 }]],
          [[{ type: "quad", name: "q", value: 10.1000 }]],
        ]);
      },
    });
  },
});

Deno.test({
  name: "test parsing of binarytypes",
  fn: async (t) => {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

    await t.step({
      name: "test bits",
      fn: () => {
        // TODO actually assert something
        // URGENT
        // FIXME it seems there are many results? is the grammar ambigious?
        parser.feed("byte  by = 10");
        parser.feed("bit   bi = 10100101");
        const results = parser.results[0][0]
        console.log(results)
        assertEquals(results, [
          [[{ type: "byte", name: "by", value: 10 }]],
          [[{ type: "bit", name: "bi", value: 10100101}]],
        ]);
      },
    });
  },
});

Deno.test({
  name: "test parsing of binarytypes",
  fn: async (t) => {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

    await t.step({
      name: "test bits",
      fn: () => {
        // TODO actually assert something
        // URGENT
        // FIXME it seems there are many results? is the grammar ambigious?
        parser.feed("bool  b = true");
        parser.feed("bool  b = false");
        const results = parser.results[0][0]
        console.log(results)
        assertEquals(results, [
          [[{ type: "bool", name: "b", value: true }]],
          [[{ type: "bool", name: "b", value: false}]],
        ]);
      },
    });
  },
});
