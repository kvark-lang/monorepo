export function asUint(number: number | bigint, bitness: 16 | 32 | 64) {
	const buffer = new ArrayBuffer(bitness! / 8);
	switch (bitness!) {
		case 64:
			new DataView(buffer).setBigUint64(0, number as bigint, true);
			break;
		default:
			new DataView(buffer)[`setUint${bitness}`](0, number as number, true);
			break;
	}

	return Array.from(new Uint8Array(buffer));
}
