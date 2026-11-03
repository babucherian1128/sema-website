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
	// 6.3–7.5s: streams straighten into rays, burst, white flash
	burst: [190, 224] as const,
	flash: [205, 220, 230, 252] as const,
	// 7.3s+: logo emerges from the flash, anamorphic streak
	logo: 218,
	// 8.3–9.5s: name + tagline flicker in, letters in random order
	title: 248,
	tagline: 262,
	letterWindow: 30,
	// 10s: light sweep across the logo, then hold
	sweep: [300, 328] as const,
} as const;
