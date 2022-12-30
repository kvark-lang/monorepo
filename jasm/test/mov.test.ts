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

const testMovRR = await Deno.readFile(".build/mov.rr.bin");

Deno.test({
	// testing varying mov instructions, 32 bit
	name: "test jasm - mov reg reg",
	fn: async (t) => {
		// create factory to emit linux binaries in 32 bit mode
		const { mov } = factory();

		// set up byte splitter to process consequent instructions
		const bytes = splitBytes(testMovRR);

		// run first test as defined in mov.asm
		await t.step({
			name: "mov eax, eax",
			fn: () => {
				// real bytes from nasm run
				const realValue = [...bytes.next().value];
				// assert that jasm emitted the same thing
				assertEquals(mov("eax", "eax"), realValue);
			},
		});

		await t.step({
			name: "mov eax, ebx",
			fn: () => {
				const realValue = [...bytes.next().value];
				assertEquals(mov("eax", "ebx"), realValue);
			},
		});

		await t.step({
			name: "mov ecx, edx",
			fn: () => {
				const realValue = [...bytes.next().value];
				assertEquals(mov("ecx", "edx"), realValue);
			},
		});
	},
});

const testMovRI = await Deno.readFile(".build/mov.ri.bin");

// same as above, but different section of the asm file
Deno.test({
	// testing varying mov instructions, 32 bit
	name: "test jasm - mov reg imm",
	fn: async (t) => {
		const { mov } = factory();

		const bytes = splitBytes(testMovRI, 5);

		await t.step({
			name: "mov ebx, 1",
			fn: () => {
				const realValue = [...bytes.next().value];
				assertEquals(mov("ebx", 1), realValue);
			},
		});

		await t.step({
			name: "mov eax, -2",
			fn: () => {
				const realValue = [...bytes.next().value];
				assertEquals(mov("eax", -2), realValue);
			},
		});

		await t.step({
			name: "mov ecx, 200",
			fn: () => {
				const realValue = [...bytes.next().value];
				assertEquals(mov("ecx", 200), realValue);
			},
		});
	},
});
