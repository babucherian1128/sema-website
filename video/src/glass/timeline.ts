/**
 * 3D glass-coin logo reveal: master timeline (30 fps, 180 frames = 6 s), matched to
 * the reference clip. Absolute frames.
 */
export const GLASS_DURATION = 180;

export const GT = {
	// 0.3–1.0s: coin swings in from above, very close and steeply tilted; blob edge firms into a circle
	discIn: [10, 32] as const,
	// 0.3–3.2s: camera move (one eased progress drives scale, tilt and position)
	camera: [10, 96] as const,
	// grey/white liquid bands flow across the face
	liquid: [10, 110] as const,
	// 1.2–2.0s: logo fades in on the coin face under the liquid
	logoIn: [36, 60] as const,
	// 2.3–3.1s: title sharpens in from large and blurred; tagline follows
	title: [68, 92] as const,
	tagline: [76, 100] as const,
	// 3.2–6s: hold with a barely-there push-in
	hold: 96,
} as const;
