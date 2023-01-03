import { elfWrap } from "../santa/mod.ts";
import { ELFABI, ELFMachine, ELFType } from "../santa/types.ts";
import { factory } from "../jasm/mod.ts";

const elf = elfWrap(ELFABI.NONE, ELFType.EXECUTABLE, ELFMachine.M386);

const { mov, int } = factory();

const binary = new Uint8Array(
  [
    ...elf,
    ...mov("eax", 1),
    ...mov("ebx", 0),
    ...int(0x80)
  ],
);

Deno.writeFile(".build/deno.bin", binary);
