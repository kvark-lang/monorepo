import { isLittleEndian } from "../endian.ts";
import { asUint } from "../uint.ts";

import { ELFABI, ELFMachine, ELFType } from "./types.ts";

export function elfWrap(
  abi: ELFABI,
  filetype: ELFType,
  machine: ELFMachine,
  sections: Array<any>,
  bitness?: 32 | 64,
  endian?: "little" | "big",
) {
  const magic = [0x7f, 0x45, 0x4c, 0x46];
  bitness = bitness ?? 32;

  const bittedUint = (n: number) => asUint(n, bitness!);

  if (!endian) {
    endian = isLittleEndian == true ? "little" : "big";
  }

  const elfEndian = {
    "little": 1,
    "big": 2,
  }[endian];

  const entrypoint = filetype == ELFType.EXECUTABLE ? 0x08048000 : 0;
  const ehdrsz = bitness == 64 ? 64 : 52;
  const phdrsz = bitness == 64 ? 56 : 32;
  const shdrsz = bitness == 64 ? 64 : 40;

  let shoff = 0;

  if (sections.length) {
    shoff = ehdrsz + phdrsz;
  }
  
  let phdr = [] as Uint8Array;
  
  phdr = new Uint8Array(
    [
      ...asUint(1, 32),
      ...st64,
      // TODO make real entrypoints
      ...bittedUint(0x08048000),
      ...bittedUint(0x08048000),
      ...bittedUint(89),
      ...bittedUint(89),
      ...st32,
      ...bittedUint(0x1000),
    ],
  );

  return [
    // magic numbers which read "ELF" in hex
    ...magic,
    // bitness flag, either 1 or 2
    bitness / 32,
    // defined endianness, either big or little, hybrid not supported by ELF spec
    elfEndian,
    // ELF spec version, always 1, will be seen a few more times in the sections
    1,
    // ELF ABI (we have an enum with those)
    abi,
    // ELF ABI version (may be 0, afaik)
    0,
    // padding bytes, no meaning
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    // end of 16 bit starter
    // type of file - .o, .so or exexcutable
    ...asUint(filetype, 16),
    // type of machine/cpu architecture
    ...asUint(machine, 16),
    // ELF spec version - can only be 1, once again
    ...asUint(1, 32),
    // here things become messy - different number of bits depending on bitness
    // entrypoint (for executables)
    ...bittedUint(
      entrypoint
        ? entrypoint + ehdrsz + phdrsz + (shdrsz * sections.length)
        : 0,
    ),
    // offset of program header from start of file, in our case, the size of the elf header (program header is right after it)
    ...bittedUint(ehdrsz),
    // offset of section header (if no sections - 0, otherwise elf header size + program header size, since it comes right after them)
    ...bittedUint(shoff),
    // CPU flags
    // TODO figure out what those do
    ...asUint(0, 32),
    // elf header size, it's predictable based on bitness
    ...asUint(ehdrsz, 16),
    // program header size, also predictable on bitness
    ...asUint(phdrsz, 16),
    // number of program headers
    // TODO can there even be more than one?
          ...asUint(1, 16),
    // section header size, predictable
        ...asUint(shdrsz, 16),
    // number of section headers
    ...asUint(sections.length, 16),
    // index of shstrtab in section header (describes section names, is a section by itself)
    // TODO add shstrtab, so it's not zero
      ...asUint(0, 16),
  ];
}

export function makeSection() {
}

export function elfFactory(
  options: {
    bitness: 32 | 64;
    abi: {
      code: number;
      version: number;
    };
    type: number;
    machine: number;
    executable: boolean;
  },
  binary: Uint8Array,
  strings?: Array<string>,
) {
  const flags = asUint(5, 32);

  const bittedUint = (n: number) => asUint(n, options.bitness);
  const st64 = options.bitness == 64 ? flags : bittedUint(0);

  const st32 = options.bitness == 32 ? flags : bittedUint(0x1000);

  // TODO make entrypoint modifiable
  const entry = 0x8000000;
  const nonUintBinary = new Array(binary);

  const sections = [".shrtrtab", ".text"];

  if (strings) {
    sections.push(".rodata");
  }

  const encoder = new TextEncoder();

  nonUintBinary.concat(
    ...sections.map((v) => encoder.encode(v)),
  );

  const ehdrsz = options.bitness == 64 ? 64 : 52;
  const phdrsz = options.bitness == 64 ? 56 : 32;
  const shdrsz = options.bitness == 64 ? 64 : 40;

  const phdr = new Uint8Array(
    [
      ...asUint(options.executable ? 1 : 2, 32),
      ...st64,
      // TODO make real entrypoints
      ...bittedUint(0x08048000),
      ...bittedUint(0x08048000),
      ...bittedUint(89),
      ...bittedUint(89),
      ...st32,
      ...bittedUint(0x1000),
    ],
  );

  const elf = new Uint8Array(
    [
      0x7f,
      0x45,
      0x4c,
      0x46, // ELF magic signature
      options.bitness / 32, // 1 or 2 - 32 or 64
      isLittleEndian ? 1 : 2, // 1 or 2 - little or big endian
      1, // ELF version - always 1,
      options.abi.code, // ABI code, from const ABI
      options.abi.version, // ABI version
      0,
      0,
      0,
      0,
      0,
      0,
      0, // padding bits
      ...asUint(options.type, 16), // ELF file type
      ...asUint(options.machine, 16), // ELF machine type,
      ...asUint(1, 32), // ELF version, again
      ...bittedUint(0x08048000 + 84),
      ...bittedUint(ehdrsz),
      ...bittedUint(0),
      ...asUint(0, 32),
      ...asUint(ehdrsz, 16),
      ...asUint(phdrsz, 16),
      ...asUint(1, 16),
      ...asUint(shdrsz, 16),
      ...asUint(0, 16),
      ...asUint(0, 16),
      ...phdr,
      ...binary,
    ],
  );

  return elf;
}
