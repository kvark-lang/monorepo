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

const testAddRR = await Deno.readFile(".build/add.rr.bin");

Deno.test({
  name: "test jasm - add reg reg",
  fn: async (t) => {
    // create factory to emit linux binaries in 32 bit mode
    const { add } = factory();

    // set up byte splitter to process consequent instructions
    const bytes = splitBytes(testAddRR);

    // run first test as defined in mov.asm
    await t.step({
      name: "add eax, eax",
      fn: () => {
        // real bytes from nasm run
        const realValue = [...bytes.next().value];
        // assert that jasm emitted the same thing
        assertEquals(add("eax", "eax"), realValue);
      },
    });

    await t.step({
      name: "add eax, ebx",
      fn: () => {
        const realValue = [...bytes.next().value];
        assertEquals(add("eax", "ebx"), realValue);
      },
    });

    await t.step({
      name: "add ecx, edx",
      fn: () => {
        const realValue = [...bytes.next().value];
        assertEquals(add("ecx", "edx"), realValue);
      },
    });
  },
});

const testAddRI = await Deno.readFile(".build/add.ri.bin");

// same as above, but different section of the asm file
Deno.test({
  name: "test jasm - add reg imm",
  fn: async (t) => {
    const { add } = factory();

    const bytes = splitBytes(testAddRI, 3);

    await t.step({
      name: "add eax, 1",
      fn: () => {
        const realValue = [...bytes.next().value];
        assertEquals(add("eax", 1), realValue);
      },
    });

    await t.step({
      name: "add ebx, 0",
      fn: () => {
        const realValue = [...bytes.next().value];
        assertEquals(add("ebx", 0), realValue);
      },
    });
  },
});

const testBigAddRI = await Deno.readFile(
  ".build/add.bri.bin",
);

// same as above, but different section of the asm file
Deno.test({
  name: "test jasm - add reg big-imm",
  fn: async (t) => {
    const { add } = factory();

    const bytes = splitBytes(testBigAddRI, 6);

    await t.step({
      name: "add ebx, 1000",
      fn: () => {
        const realValue = [...bytes.next().value];
        assertEquals(add("ebx", 1000), realValue);
      },
    });
  },
});
