export function asUint(number: number, bitness: 16 | 32 | 64) {
	let r1 = 0;
	let r2 = 0;
	let r4 = 0;
	let r3 = 0;
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
