import { x86 } from "./arches/x86.ts";
import {
  JasmFactory,
  JasmFactoryOptions,
  JasmInstruction,
  JasmIr,
  JasmOutputWithAddressGaps,
} from "./types.ts";

export function factory(
  _options?: JasmFactoryOptions,
): JasmFactory {
  // TODO make it work with WASM too
  return x86;
}

export type {
  JasmFactory,
  JasmFactoryOptions,
  JasmInstruction,
  JasmIr,
  JasmOutputWithAddressGaps,
};
