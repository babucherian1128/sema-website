import {Easing, interpolate, useVideoConfig} from 'remotion';
import {SR} from './timeline';

/** Responsive layout for the Sunrise theme (16:9 and 9:16 share one timeline). */
export const useSunriseLayout = () => {
	const {width, height} = useVideoConfig();
	const vertical = height > width;
	const u = Math.min(width, height) / 1080;
	const logoR = (vertical ? 215 : 150) * u;
	const cy = height * (vertical ? 0.29 : 0.31);
	const horizon = height * (vertical ? 0.58 : 0.6);
	return {
		width,
		height,
		vertical,
		u,
		cx: width / 2,
		cy,
		logoR,
		horizon,
		// vertical: card sits down in the field so the horizon shows between logo and card
		cardTop: vertical ? horizon + (height - horizon) * 0.3 : cy + logoR + 44 * u,
		cardWidth: vertical ? width - 120 * u : 1180 * u,
		titleSize: (vertical ? 72 : 60) * u,
		taglineSize: (vertical ? 30 : 25) * u,
	};
};

export type SunriseLayout = ReturnType<typeof useSunriseLayout>;

/**
 * Diagonal wipe from Kerala → prairie. Returns the seam's x at the top and bottom
 * of the frame; everything left of the seam is prairie, right of it is Kerala.
 */
export const wipeSeam = (frame: number, width: number, height: number) => {
	const slant = height * 0.22;
	const s = interpolate(frame, SR.wipe, [-slant, width + slant], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.inOut(Easing.cubic),
	});
	return {top: s + slant, bottom: s - slant, active: frame > SR.wipe[0] && frame < SR.wipe[1] + 4};
};

/** Rolling-hill path: a wavy top edge at baseY, filled down to `bottom`. */
export const hillPath = (
	width: number,
	baseY: number,
	amp: number,
	bottom: number,
	seed: number,
	freq = 1,
) => {
	const steps = 48;
	let d = `M0,${bottom} L0,${baseY}`;
	for (let i = 0; i <= steps; i++) {
		const x = (width * i) / steps;
		const t = (i / steps) * Math.PI * 2 * freq;
		const y =
			baseY -
			amp * (0.55 * Math.sin(t * 1.3 + seed) + 0.3 * Math.sin(t * 2.7 + seed * 2.1) + 0.15 * Math.sin(t * 5.1 + seed * 0.7));
		d += ` L${x.toFixed(1)},${y.toFixed(1)}`;
	}
	return `${d} L${width},${bottom} Z`;
};

/** A gull/goose in flight: two curved wings, flap in [-1, 1]. */
export const birdPath = (span: number, flap: number) =>
	`M${-span},${flap * span * 0.25} Q${-span * 0.45},${-flap * span * 0.55} 0,0 ` +
	`Q${span * 0.45},${-flap * span * 0.55} ${span},${flap * span * 0.25}`;
