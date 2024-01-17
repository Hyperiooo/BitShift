export function MUL_UN8(a, b) {
	const ONE_HALF = 0x80;
	const G_SHIFT = 8;
	let t = (a * (b & 0xffff) + ONE_HALF) >>> 0;
	return ((t >> G_SHIFT) + t) >> G_SHIFT;
}
