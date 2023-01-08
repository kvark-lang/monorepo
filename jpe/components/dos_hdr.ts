import { asUint } from "../../uint.ts";
//could need the endian,
import { isLittleEndian } from "../../endian.ts";

const magic = 0x5A4D;

function Uint16To8(input: number) {
  const buffer = new ArrayBuffer(2);
  new DataView(buffer).setInt16(0, input, true);

  return new Uint8Array(buffer);
}

const doshdr : number[] = [...asUint(magic, 16)];

let _ExtraBytesOffset: (offset: number) => void;
let _PagesOffset: (offset: number) => void;
let _RelocItemsOffset: (offset: number) => void;

let _HdrOffset: () => void;

let _MinAlloc: (value: number) => void;
let _MaxAlloc: (value: number) => void;

let _InitialSS: (address: number) => void;
let _InitialSP: (value: number) => void;

let _Checksum: (sum: number) => void;

let _InitialIP: (value: number) => void;
let _InitialCS: (address: number) => void;

let _AbsRelocTblOffset: (offset: number) => void;
let _OverlayOffset: (offset: number) => void;
let _OverlayOffsetInfo: (offset: number) => void;

{
  //Extra Bytes
  //Offset 0x02
  _ExtraBytesOffset = (offset: number) => {
    doshdr.splice(doshdr.length, 2, ...asUint(offset, 16))
  };

  //Pages
  //Offset 0x04
  _PagesOffset = (offset: number) => {
    doshdr.splice(doshdr.length, 2, ...asUint(offset, 16))
  };

  //Relocation items
  //Offset 0x06
  _RelocItemsOffset = (offset: number) => {
    doshdr.splice(doshdr.length, 2, ...asUint(offset, 16))
  };

  //Header size
  //Offset 0x08
  //The number of paragraphs taken up by the header
  //The loader uses it to know where exe starts
  //my proposal: Including our own metadata, then put the
  //then put the reloc table here
  _HdrOffset = () => {
    doshdr.splice(doshdr.length, 2, ...asUint(doshdr.length, 16))
  };

  //Minimum Alloc
  //Offset 0x0A
  _MinAlloc = (value: number) => {
    doshdr.splice(doshdr.length, 2, ...asUint(value, 16))
  };

  //Maximum Alloc
  //Offset 0x0C
  _MaxAlloc = (value: number) => {
    doshdr.splice(doshdr.length, 2, ...asUint(value, 16))
  };

  //Initial Stack Segment
  //Offset 0x0E
  _InitialSS = (value: number) => {
    doshdr.splice(doshdr.length, 2, ...asUint(value, 16))
  };

  //Initial Stack Pointer
  //Offset 0x10
  _InitialSP = (value: number) => {
    doshdr.splice(doshdr.length, 2, ...asUint(value, 16))
  };

  //Checksum
  //Offset 0x12
  _Checksum = (value: number) => {
    doshdr.splice(doshdr.length, 2, ...asUint(value, 16))
  };

  //Initial Instruction Pointer
  //Offset 0x14
  _InitialIP = (value: number) => {
    doshdr.splice(doshdr.length, 2, ...asUint(value, 16))
  };

  //Initial Code Segment
  //Offset 0x16
  _InitialCS = (value: number) => {
    doshdr.splice(doshdr.length, 2, ...asUint(value, 16))
  };

  //Relocation Table
  //Offset 0x18
  _AbsRelocTblOffset = (value: number) => {
    doshdr.splice(doshdr.length, 2, ...asUint(value, 16))
  };

  //Overlay??
  //Offset 0x1A
  _OverlayOffset = (value: number) => {
    doshdr.splice(doshdr.length, 2, ...asUint(value, 16))
  };

  //Overlay Information
  //Offset 0x1C
  _OverlayOffsetInfo = (value: number) => {
    doshdr.splice(doshdr.length, 2, ...asUint(value, 16))
  };

  //Now Extensions for PE
  //=====================
  //Reserved
  //Offset 0x1C
  
  //OEM Identifier
  //Offset 0x24, def. by name; typically 0
  doshdr.push(...asUint(0,16));
  //OEM Info
  //Offset 0x26, def. by name; typically 0
  doshdr.push(...asUint(0,16));
  //Reserved
  //Offset 0x28
  doshdr.push(...asUint(0,16));
  doshdr.push(...asUint(0,16));
  doshdr.push(...asUint(0,16));
  doshdr.push(...asUint(0,16));
  doshdr.push(...asUint(0,16));
  doshdr.push(...asUint(0,16));
  doshdr.push(...asUint(0,16));
  doshdr.push(...asUint(0,16));
  doshdr.push(...asUint(0,16));
  doshdr.push(...asUint(0,16));
  
  //PE Header Start
  //Starting Address of the PE Header
  //Offset 0x3C
}



const page = new Array<number>(512);

//console.log(Uint16To8(magic));

console.log(doshdr);

let denobin = new Uint8Array(doshdr);
Deno.writeFileSync("bin/deno.doshdr.bin", denobin), {create: true, append: false};