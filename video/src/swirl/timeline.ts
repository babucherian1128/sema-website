/**
 * Particle-swirl logo reveal: master timeline (30 fps, 360 frames = 12 s). Absolute frames.
 */
export const SWIRL_DURATION = 360;

export const SW = {
	// 0–1.3s: ambient gold dust and bokeh, slow push-in
	ambient: 0,
	// 1.3–4s: four comets streak in from the edges and spiral toward the centre
	comets: [38, 140] as const,
	// 2.3–6.5s: light streams fill in behind them and the vortex tightens and speeds up
	streams: 70,
	accelerate: 150,
	// 5.9–6.9s: streams straighten into rays and burst; flash glow 6.5–7.6s (timed to the reference)
	burst: [178, 206] as const,
	flash: [194, 203, 208, 228] as const,
	// 6.67s: logo is born tiny in the eye of the vortex, on top of the flash,
	// and grows smoothly to full size by ~8.1s (as in the reference)
	logo: 200,
	logoGrow: [200, 244] as const,
	// 7.1–9.3s: name, then tagline, resolve letter by letter (blur → sharp, no blinking)
	title: 212,
	tagline: 222,
	letterWindow: 40,
	// 9.3–12s: hold with a very slow push-in
} as const;
