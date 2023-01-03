import {elfWrap} from "../mod.ts"
import {ELFABI, ELFMachine, ELFType} from "../types.ts"

const binary = elfWrap(ELFABI.NONE, ELFType.EXECUTABLE, ELFMachine.M386)

Deno.writeFileSync("deno.bin", binary)