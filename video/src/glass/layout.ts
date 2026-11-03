import {useVideoConfig} from 'remotion';

/** Layout for ultra-wide (2688x768), 16:9 and 9:16, proportioned on the reference. */
export const useGlassLayout = () => {
	const {width, height} = useVideoConfig();
	const vertical = height > width;
	const base = vertical ? width * 0.711 : height; // "reference height" in px
	const u = base / 768;
	const logoR = vertical ? width * 0.27 : base * 0.188;
	const cy = height * (vertical ? 0.37 : 0.37);
	return {
		width,
		height,
		vertical,
		u,
		cx: width / 2,
		cy,
		logoR,
		titleTop: cy + logoR + (vertical ? 90 : 52) * u,
		titleSize: vertical ? 56 * (width / 1080) : base * 0.054,
		taglineSize: vertical ? 34 * (width / 1080) : base * 0.037,
	};
};

/** Hermite smoothstep: 0 below a, 1 above b, smooth in between (zero velocity at both ends). */
export const smoothstep = (a: number, b: number, x: number) => {
	const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
	return t * t * (3 - 2 * t);
};
