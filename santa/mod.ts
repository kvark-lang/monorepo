import * as endianness from "../endian.ts";
import { asUint } from "../uint.ts";

import {
	ELFABI,
	ELFConfiguration,
	ELFMachine,
	ELFSection,
	ELFType,
} from "./types.ts";

export function elf(
	config: ELFConfiguration,
	bitness?: 32 | 64,
	isBigEndian?: boolean,
) {
	const entrypoint = 0x08048000;
	const { machine, filetype, abi } = config;
	// Set defaults if .endian and .bitness not present
	if (bitness === undefined) bitness = 32;
	isBigEndian = endianness.isBigEndian;
	// Initialize ELF with constant magic numbers
	const binary = [0x7f, 0x45, 0x4c, 0x46];

	let putProgramTableOffset: (offset: number) => void;
	let putSectionTableOffset: (offset: number) => void;

	let putProgramHeaderCount: (count: number) => void;

	let putSectionHeaderEntrySize: (size: number) => void;
	let putSectionHeaderEntryCount: (count: number) => void;
	let putShstrabIndex: (index: number) => void;

	// ELF header
	{
		// Push bitness value, 1 for 32, 2 for 64
		binary.push(bitness! / 32);

		// Push endianness value, 1 for little, 2 for big
		binary.push(isBigEndian === true ? 2 : 1);

		// ELF version, it is always 1
		binary.push(1);

		// ELF ABI version, there is an enum
		binary.push(abi);

		// ABI subversion, 0 is fine
		binary.push(0);

		// Padding bytes, no meaning
		binary.push(0, 0, 0, 0, 0, 0, 0);

		// ELF filetype
		binary.push(...asUint(config.filetype, 16));

		// ELF machine type
		binary.push(...asUint(config.machine, 16));

		// ELF spec version - can only be 1
		binary.push(...asUint(1, 32));

		// Entrypoint, size varies by bitness
		binary.push(...asUint(entrypoint, bitness));

		// Set program table location to zero (aka, none present)
		binary.push(...asUint(0, bitness));

		// Initialize the function to .splice the program table location in later
		putProgramTableOffset = (value: number) => {
			binary.splice(binary.length, bitness! / 8, ...asUint(value, bitness!));
		};

		// Set section table location to zero (aka, none present)
		binary.push(...asUint(0, bitness));

		// Initialize the function to .splice in section table location
		putSectionTableOffset = (value: number) => {
			binary.splice(binary.length, bitness! / 8, ...asUint(value, bitness!));
		};

		// ELF flags
		binary.push(...asUint(0, 32));

		// ELF header size
		binary.push(...asUint(bitness === 32 ? 52 : 64, 16));

		// Program header size
		binary.push(...asUint(bitness === 32 ? 32 : 56, 16));

		// Set program header count to zero (aka, none present)
		binary.push(...asUint(0, 16));

		// Initialize the function to .splice in program header count
		putProgramHeaderCount = (value: number) => {
			binary.splice(binary.length, bitness! / 8, ...asUint(value, 16));
		};

		// Set section header ENTRY size to zero (aka, none present)
		binary.push(...asUint(0, 16));

		// Initialize the function to .splice in section head ENTRY size
		putSectionHeaderEntrySize = (value: number) => {
			binary.push(...asUint(bitness === 32 ? 40 : 64, 16));
		};

		// Set section header ENTRY count to zero (aka, none present)
		binary.push(...asUint(0, 16));

		// Initialize the function to .splice in section header ENTRY count
		putSectionHeaderEntryCount = (value: number) => {
			binary.splice(binary.length, bitness! / 8, ...asUint(value, 16));
		};

		// Set .shstrab index in self to zero (aka, none present)
		binary.push(...asUint(0, 16));

		// Initialize the function to .splice in the .shstrab index
		putShstrabIndex = (value: number) => {
			binary.splice(binary.length, bitness! / 8, ...asUint(value, 16));
		};
	}
	const returnObject = {
		addProgramHeader: () => {
			return returnObject;
		},
		addSection: () => {
			return returnObject;
		},
		binary,
	};
	return returnObject;
}

// export function elfWrap(
// 	config: ELFConfiguration,
// 	bitness?: 32 | 64,
// 	endian?: "little" | "big",
// ) {
// 	const { machine, filetype, abi } = config;

// 	// const nonUintBinary = new Array(binary);
// 	//
// 	// const sections = [".shrtrtab", ".text"];
// 	//
// 	// if (strings) {
// 	//   sections.push(".rodata");
// 	// }
// 	//
// 	// const encoder = new TextEncoder();
// 	//
// 	// nonUintBinary.concat(
// 	//   ...sections.map((v) => encoder.encode(v)),
// 	// );

// 	const magic = [0x7f, 0x45, 0x4c, 0x46];
// 	bitness = bitness ?? 32;

// 	const bittedUint = (n: number) => asUint(n, bitness!);

// 	if (!endian) {
// 		endian = "little";
// 	}

// 	const elfEndian = {
// 		little: 1,
// 		big: 2,
// 	}[endian];

// 	const entrypoint = filetype === ELFType.EXECUTABLE ? 0x08048000 : 0;
// 	const ehdrsz = bitness === 64 ? 64 : 52;
// 	const phdrsz = bitness === 64 ? 56 : 32;
// 	const shdrsz = bitness === 64 ? 64 : 40;

// 	let shoff = 0;

// 	let phdr = [] as unknown as Uint8Array;

// 	// combines X and R (execute and read)
// 	const flags = asUint(5, 32);
// 	// if 64 bit, put flags, otherwise p_offset value (where to load from)
// 	const pBytes64 = bitness === 64 ? flags : bittedUint(0);
// 	// if 32 bit, put flags, otherwise p_align value
// 	const pBytes32 = bitness === 32 ? flags : bittedUint(0x1000);

// 	phdr = new Uint8Array([
// 		// take PT_LOAD by default
// 		// TODO consider other types
// 		...asUint(1, 32),
// 		// flags here if 64 bit
// 		// possibly also p_offset
// 		...pBytes64,
// 		// virtual load address
// 		...bittedUint(0x08048000),
// 		// physical load address
// 		// TODO what if not standard
// 		...bittedUint(0x08048000),
// 		// size
// 		// TODO why 89, was this set manually?
// 		...bittedUint(84),
// 		// TODO same question
// 		...bittedUint(84),
// 		// flags here if 32 bit
// 		...pBytes32,
// 		...bittedUint(0x1000),
// 	]);

// 	const encoded = new TextEncoder().encode(".shstrtab");

// 	const shdr = new Uint8Array([
// 		// section header
// 		...asUint(0, 32),
// 		...asUint(3, 32),
// 		...asUint(0, 32),
// 		...asUint(0, 32),
// 		...asUint(84 + 40, 32),
// 		...asUint(encoded.length + 1, 32),
// 		...asUint(0, 32),
// 		...asUint(0, 32),
// 		...asUint(0x1000, 32),
// 		...asUint(0, 32),
// 		...encoded,
// 		0,
// 	]);

// 	return new Uint8Array([
// 		// magic numbers which read "ELF" in hex
// 		...magic,
// 		// bitness flag, either 1 or 2
// 		bitness / 32,
// 		// defined endianness, either big or little, hybrid not supported by ELF spec
// 		elfEndian,
// 		// ELF spec version, always 1, will be seen a few more times in the sections
// 		1,
// 		// ELF ABI (we have an enum with those)
// 		abi,
// 		// ELF ABI version (may be 0, afaik)
// 		0,
// 		// padding bytes, no meaning
// 		0,
// 		0,
// 		0,
// 		0,
// 		0,
// 		0,
// 		0,
// 		// end of 16 bit starter
// 		// type of file - .o, .so or exexcutable
// 		...asUint(filetype, 16),
// 		// type of machine/cpu architecture
// 		...asUint(machine, 16),
// 		// ELF spec version - can only be 1, once again
// 		...asUint(1, 32),
// 		// here things become messy - different number of bits depending on bitness
// 		// entrypoint (for executables)
// 		...bittedUint(entrypoint ? entrypoint + ehdrsz + phdrsz + shdrsz * 1 : 0),
// 		// offset of program header from start of file, in our case, the size of the elf header (program header is right after it)
// 		...bittedUint(ehdrsz),
// 		// offset of section header (if no sections - 0, otherwise elf header size + program header size, since it comes right after them)
// 		...bittedUint(84 ?? shoff),
// 		// CPU flags
// 		// TODO figure out what those do
// 		...asUint(0, 32),
// 		// elf header size, it's predictable based on bitness
// 		...asUint(ehdrsz, 16),
// 		// program header size, also predictable on bitness
// 		...asUint(phdrsz, 16),
// 		// number of program headers
// 		// TODO can there even be more than one?
// 		...asUint(1, 16),
// 		// section header size, predictable
// 		// IMPORTANT always set to 0 if no sections in file
// 		...asUint(shdrsz, 16),
// 		// number of section headers
// 		...asUint(1, 16),
// 		// index of shstrtab in section header (describes section names, is a section by itself)
// 		// TODO add shstrtab, so it's not zero
// 		...asUint(0, 16),
// 		// end of elf header
// 		// program header
// 		...phdr,
// 		...shdr,
// 	]);
// }
