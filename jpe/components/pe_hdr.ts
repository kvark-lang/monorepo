import { asUint } from "../../uint.ts";
let pe_hdr = [] as unknown as Uint8Array;

function Uint16To8(input: number, byteness: number) {
  const buffer = new ArrayBuffer(byteness);
  new DataView(buffer).setInt16(0, input, true);

  return new Uint8Array(buffer);
}

const magic = 0x00004550;

pe_hdr = new Uint8Array(
  [
    //PE Magic Number
    ...Uint16To8(magic, 4),
  ],
);

console.log(pe_hdr);
