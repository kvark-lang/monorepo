const buffer = new ArrayBuffer(2);
new DataView(buffer).setInt16(0, 256, true);

export const isLittleEndian = new Int16Array(buffer)[0] === 256;
export const isBigEndian = !isLittleEndian;