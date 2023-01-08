import { assertEquals } from "https://deno.land/std@0.154.0/testing/asserts.ts";
import { asUint } from "./uint.ts";

Deno.test({
	// test asUint
	name: "test asUint - 32 bits",
	fn: async (t) => {
		await t.step({
			name: "asUint 1000",
			fn: () => {
				assertEquals(asUint(1000, 32), [232, 3, 0, 0]);
			},
		});
		await t.step({
			name: "asUint -1",
			fn: () => {
				assertEquals(asUint(-1, 32), [255, 255, 255, 255]);
			},
		});
		await t.step({
			name: "asUint 1",
			fn: () => {
				assertEquals(asUint(1, 32), [1, 0, 0, 0]);
			},
		});
	},
});
