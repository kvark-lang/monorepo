import { elf } from "../mod.ts";
import { ELFABI, ELFMachine, ELFType, ELFConfiguration } from "../types.ts";

const executable = elf({
	abi: ELFABI.NONE,
	filetype: ELFType.EXECUTABLE,
	machine: ELFMachine.M386,
});

console.log(executable);

Deno.writeFile("deno.bin", new Uint8Array(executable.binary));
