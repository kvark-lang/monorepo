import { isLittleEndian } from "../endian.ts";
import { asUint } from "../uint.ts";

import { ELFABI, ELFMachine, ELFSection, ELFType } from "./types.ts";

export function elfWrap(
  abi: ELFABI,
  filetype: ELFType,
  machine: ELFMachine,
  sections?: Array<ELFSection>,
  bitness?: 32 | 64,
  endian?: "little" | "big",
) {
  // const nonUintBinary = new Array(binary);
  //
  // const sections = [".shrtrtab", ".text"];
  //
  // if (strings) {
  //   sections.push(".rodata");
  // }
  //
  // const encoder = new TextEncoder();
  //
  // nonUintBinary.concat(
  //   ...sections.map((v) => encoder.encode(v)),
  // );

  sections = sections ?? [];

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

  let phdr = [] as unknown as Uint8Array;

  // combines X and R (execute and read)
  const flags = asUint(5, 32);
  // if 64 bit, put flags, otherwise p_offset value (where to load from)
  const pBytes64 = bitness == 64 ? flags : bittedUint(0);
  // if 32 bit, put flags, otherwise p_align value
  const pBytes32 = bitness == 32 ? flags : bittedUint(0x1000);

  phdr = new Uint8Array(
    [
      // take PT_LOAD by default
      // TODO consider other types
      ...asUint(1, 32),
      // flags here if 64 bit
      // possibly also p_offset
      ...pBytes64,
      // virtual load address
      ...bittedUint(0x08048000),
      // physical load address
      // TODO what if not standard
      ...bittedUint(0x08048000),
      // size
      // TODO why 89, was this set manually?
      ...bittedUint(84),
      // TODO same question
      ...bittedUint(84),
      // flags here if 32 bit
      ...pBytes32,
      ...bittedUint(0x1000),
    ],
  );

  const sh_flags = asUint(4, 32); //???

  shdr = new Uint8Array(
    [
      //TODO sh_name: specify name of section
      //Value = Index into the shdr-string table
      //gives location of a null-terminated string
      

      //sh_addr, section appears in memory image of process
      //32-bit implemented?? 64-bit not 
      ...bittedUint(0x0C)
    ]
  )

  return new Uint8Array([
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
    // IMPORTANT always set to 0 if no sections in file
    ...asUint(0, 16),
    // number of section headers
    ...asUint(sections.length, 16),
    // index of shstrtab in section header (describes section names, is a section by itself)
    // TODO add shstrtab, so it's not zero
    ...asUint(0, 16),
    // end of elf header
    // program header
    ...phdr,
  ]);
}



export function makeSection(name: string) {
}
