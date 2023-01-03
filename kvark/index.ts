import { factory } from "../jasm/mod.ts";

const { mov } = factory();

const binary = new Uint8Array(
  [
    ...mov("ebx", 1),
  ],
);

Deno.writeFile(".build/deno.bin", binary);
