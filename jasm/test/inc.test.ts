import { assertEquals } from "https://deno.land/std@0.154.0/testing/asserts.ts";
import { factory } from "../mod.ts";

// as to varying length instructions - this function is for unit tests
// we only have the same type of instructions in every .asm file, thus the same length
export function* splitBytes(
  bytes: Uint8Array,
  step?: number,
) {
  // step in bytes, default 2
  step = step ?? 2;
  // get next <step> bytes
  for (let l = step; l <= bytes.length; l += step) {
    yield bytes.subarray(l - step, l);
  }
  // if EOF, return empty and quit
  return new Uint8Array([]);
}

const testInc = await Deno.readFile(".build/inc.na.bin");

Deno.test({
  // testing varying mov instructions, 32 bit
  name: "test jasm - inc/dec",
  fn: async (t) => {
    // create factory to emit linux binaries in 32 bit mode
    const { inc, dec } = factory();

    // set up byte splitter to process consequent instructions
    const bytes = splitBytes(testInc, 1);

    await t.step({
      name: "inc eax",
      fn: () => {
        // real bytes from nasm run
        const realValue = [...bytes.next().value];
        // assert that jasm emitted the same thing
        assertEquals(inc("eax"), realValue);
      },
    });

    await t.step({
      name: "dec ebx",
      fn: () => {
        const realValue = [...bytes.next().value];
        assertEquals(dec("ebx"), realValue);
      },
    });
  },
});
