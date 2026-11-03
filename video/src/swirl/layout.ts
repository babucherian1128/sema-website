import {useVideoConfig} from 'remotion';

/** Layout for 16:9 and 9:16; the vortex centre is the logo centre. */
export const useSwirlLayout = () => {
	const {width, height} = useVideoConfig();
	const vertical = height > width;
	const u = Math.min(width, height) / 1080;
	const cx = width / 2;
	const cy = height * (vertical ? 0.4 : 0.41);
	// ~half the frame height in 16:9, as in the reference
	const logoR = (vertical ? 360 : 268) * u;
	return {
		width,
		height,
		vertical,
		u,
		cx,
		cy,
		logoR,
		textTop: cy + logoR + (vertical ? 70 : 34) * u,
		titleSize: (vertical ? 50 : 38) * u,
		taglineSize: (vertical ? 31 : 24) * u,
		// distance from centre to the farthest corner, so spirals start off-screen
		rMax: Math.hypot(Math.max(cx, width - cx), Math.max(cy, height - cy)) * 1.08,
	};
};

/** "#rgb" / "#rrggbb" → [r, g, b]. Falls back to warm white for other formats. */
export const hexToRgb = (hex: string): [number, number, number] => {
	const m = hex.trim().replace('#', '');
	const full = m.length === 3 ? m.split('').map((c) => c + c).join('') : m;
	if (!/^[0-9a-fA-F]{6}/.test(full)) return [255, 240, 200];
	return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16)) as [number, number, number];
};
