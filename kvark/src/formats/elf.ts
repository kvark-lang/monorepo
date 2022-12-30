const buffer = new ArrayBuffer(2);
new DataView(buffer).setInt16(0, 256, true);

export const isLittleEndian =
	new Int16Array(buffer)[0] === 256;
export const isBigEndian = !isLittleEndian;
export function asUint(
	number: number,
	bitness: 16 | 32 | 64,
) {
	let r1 = 0;
	let r2 = 0;
	let r3 = 0;
	let r4 = 0;
	switch (bitness) {
		case 16:
			r1 = number;
			r2 = number >> 8;
			return [r1, r2];
		case 32:
			r1 = number;
			r2 = number >> 8;
			r3 = number >> 16;
			r4 = number >> 24;
			return [r1, r2, r3, r4];
		case 64:
			r1 = number;
			r2 = number >> 8;
			r3 = number >> 16;
			r4 = number >> 24;
			return [r1, r2, r3, r4, 0, 0, 0, 0];

		default:
			break;
	}
	return [];
}

export const elfABI = {
	NONE: 0,
	HPUX: 1,
	NETBSD: 2,
	GNU: 3,
	SOLARIS: 6,
	AIX: 7,
	IRIX: 8,
	FREEBSD: 9,
	TRU64: 10,
	MODESTO: 11,
	OPENBSD: 12,
	OPENVMS: 13,
	NSK: 14,
	AROS: 15,
	FENIXOS: 16,
	CLOUDABI: 17,
	OPENVOS: 18,
};

export const elfType = {
	NONE: 0,
	RELOCATABLE: 1,
	EXECUTABLE: 2,
	DYNAMIC: 3,
	CORE: 4,
};

export const elfMachine = {
	NONE: 0x0,
	M32: 0x01,
	SPARC: 0x02,
	M386: 0x03,
	M68K: 0x04,
	M88K: 0x05,
	IAMCU: 0x06,
	M860: 0x07,
	MIPS: 0x08,
	S370: 0x09,
	MIPS_RS3_LE: 0x0A,
	PARISC: 0x0F,
	M960: 0x13,
	PPC: 0x14,
	PPC64: 0x15,
	S390: 0x16,
	SPU: 0x17,
	V800: 0x24,
	FR20: 0x25,
	RH32: 0x26,
	MCORE: 0x27,
	ARM: 0x28,
	OLD_ALPHA: 0x29,
	SH: 0x2A,
	SPARCV9: 0x2B,
	TRICORE: 0x2C,
	ARC: 0x2D,
	H8_300: 0x2E,
	H8_300H: 0x2F,
	H8S: 0x30,
	H8_500: 0x31,
	IA_64: 0x32,
	MIPS_X: 0x33,
	COLDFIRE: 0x34,
	M68HC12: 0x35,
	MMA: 0x36,
	PCP: 0x37,
	NCPU: 0x38,
	NDR1: 0x39,
	STARCORE: 0x3A,
	ME16: 0x3B,
	ST100: 0x3C,
	TINYJ: 0x3D,
	X86_64: 0x3E,
	MCST_ELBRUS: 0xAF,
	TI_C6000: 0x8C,
	AARCH64: 0xB7,
	RISCV: 0xF3,
	BPF: 0xF7,
	M65816: 0x101,
};

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

	const bittedUint = (n: number) =>
		asUint(n, options.bitness);
	const st64 = options.bitness == 64
		? flags
		: bittedUint(0);

	const st32 = options.bitness == 32
		? flags
		: bittedUint(0x1000);

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
