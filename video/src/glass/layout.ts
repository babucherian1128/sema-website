import {useVideoConfig} from 'remotion';

/**
 * Layout measured from the reference (2688x768): final coin diameter 50.3% of the
 * height, centred at 39.2%; title cap-line centred at 73.7%, tagline at 82.3%.
 * For other landscape sizes the same block is scaled by `base` and centred vertically.
 */
export const useGlassLayout = () => {
	const {width, height} = useVideoConfig();
	const vertical = height > width;

	if (!vertical) {
		const base = Math.min(height, width / 2.5);
		const Y = (frac: number) => (height - 0.703 * base) / 2 + (frac - 0.141) * base;
		const logoR = 0.244 * base;
		return {
			width,
			height,
			vertical,
			u: base / 768,
			cx: width / 2,
			cy: Y(0.392),
			logoR,
			titleSize: 0.074 * base,
			taglineSize: 0.06 * base,
			titleTop: Y(0.737) - 0.037 * base,
			taglineTop: Y(0.823) - 0.03 * base,
			titleLineHeight: 1,
		};
	}

	const k = width / 1080;
	const logoR = 300 * k;
	const cy = height * 0.38;
	const titleSize = 66 * k;
	const titleTop = cy + logoR * 1.03 + 90 * k;
	return {
		width,
		height,
		vertical,
		u: k * 1.4,
		cx: width / 2,
		cy,
		logoR,
		titleSize,
		taglineSize: 44 * k,
		titleTop,
		taglineTop: titleTop + 2 * titleSize * 1.15 + 34 * k,
		titleLineHeight: 1.15,
	};
};

/** Hermite smoothstep: 0 below a, 1 above b, smooth in between. */
export const smoothstep = (a: number, b: number, x: number) => {
	const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
	return t * t * (3 - 2 * t);
};

/**
 * Monotone cubic (PCHIP / Fritsch–Carlson) interpolation through keyframes.
 * Passes exactly through every point, is smooth (C1) and never overshoots
 * between points, so measured motion curves play back without kinks or wobble.
 * Clamps outside the key range.
 */
export const pchip = (xs: readonly number[], ys: readonly number[], x: number) => {
	const n = xs.length;
	if (x <= xs[0]) return ys[0];
	if (x >= xs[n - 1]) return ys[n - 1];
	const h: number[] = [];
	const d: number[] = [];
	for (let i = 0; i < n - 1; i++) {
		h.push(xs[i + 1] - xs[i]);
		d.push((ys[i + 1] - ys[i]) / h[i]);
	}
	const m: number[] = new Array(n).fill(0);
	m[0] = d[0];
	m[n - 1] = d[n - 2];
	for (let i = 1; i < n - 1; i++) {
		if (d[i - 1] * d[i] <= 0) m[i] = 0;
		else {
			const w1 = 2 * h[i] + h[i - 1];
			const w2 = h[i] + 2 * h[i - 1];
			m[i] = (w1 + w2) / (w1 / d[i - 1] + w2 / d[i]);
		}
	}
	let i = 0;
	while (x > xs[i + 1]) i++;
	const t = (x - xs[i]) / h[i];
	const t2 = t * t;
	const t3 = t2 * t;
	return (
		(2 * t3 - 3 * t2 + 1) * ys[i] +
		(t3 - 2 * t2 + t) * h[i] * m[i] +
		(-2 * t3 + 3 * t2) * ys[i + 1] +
		(t3 - t2) * h[i] * m[i + 1]
	);
};
