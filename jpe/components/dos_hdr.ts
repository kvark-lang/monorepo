import { asUint } from "../../uint.ts";
//could need the endian,
import { isLittleEndian } from "../../endian.ts";

let doshdr = [] as unknown as Uint8Array;

const magic = 0x5A4D;

function Uint16To8(input: number) {
  const buffer = new ArrayBuffer(2);
  new DataView(buffer).setInt16(0, input, true);

  return new Uint8Array(buffer);
}

const page = new Array<number>(512);

//console.log(Uint16To8(magic));

doshdr = new Uint8Array(
  [
    //Signature
    //Offset 0x00
    ...Uint16To8(magic),

    //Extra Bytes
    //Offset 0x02
    //TODO: Number of Bytes in last page
    //---

    //Pages
    //Offset 0x04

    //Relocation items
    //Offset 0x06

    //Header size
    //Offset 0x08

    //Minimum Alloc
    //Offset 0x0A

    //Maximum Alloc
    //Offset 0x0C

    //Initial Stack Segment
    //Offset 0x0E

    //Initial Stack Pointer
    //Offset 0x10

    //Checksum
    //Offset 0x12

    //Initial Instruction Pointer
    //Offset 0x14

    //Initial Code Segment
    //Offset 0x16

    //Relocation Table
    //Offset 0x18

    //Overlay??
    //Offset 0x1A

    //Overlay Information
    //Offset 0x1C

    //Now Extensions for PE
    //=====================
    //Reserved
    //Offset 0x1C

    //OEM Identifier
    //Offset 0x24, def. by name; typically 0

    //OEM Info
    //Offset 0x26, def. by name; typically 0

    //Reserved
    //Offset 0x28
    ...asUint(0, 20),
    //PE Header Start
    //Starting Address of the PE Header
    //Offset 0x3C
  ],
);

console.log(doshdr);
