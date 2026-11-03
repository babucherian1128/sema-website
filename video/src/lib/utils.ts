import {staticFile} from 'remotion';

/** Any CSS colour (hex, rgb, hsl…) at the given alpha, via color-mix. */
export const alpha = (color: string, a: number) =>
	`color-mix(in srgb, ${color} ${Math.round(Math.max(0, Math.min(1, a)) * 100)}%, transparent)`;

/** Resolve a prop path: URLs and root paths pass through, else public/ via staticFile(). */
export const resolveAsset = (src: string) =>
	/^(https?:|data:|\/)/.test(src) ? src : staticFile(src);

/**
 * Teardrop petal pointing up (towards -y) from the origin.
 * len = length, w = half-width at the widest point.
 */
export const petalPath = (len: number, w: number) =>
	`M0,0 C${w},${-len * 0.28} ${w * 0.7},${-len * 0.82} 0,${-len} ` +
	`C${-w * 0.7},${-len * 0.82} ${-w},${-len * 0.28} 0,0 Z`;

export const clamp = {
	extrapolateLeft: 'clamp',
	extrapolateRight: 'clamp',
} as const;
