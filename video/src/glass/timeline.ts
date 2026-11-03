/**
 * 3D glass-coin logo reveal: master timeline (30 fps, 180 frames = 6 s).
 * Camera keyframes are MEASURED from the reference clip (coin bounding box every 3 frames).
 */
export const GLASS_DURATION = 180;

export const GT = {
	// 0.13s: coin appears small and far away near the top
	appear: [4, 8] as const,
	// blob outline firms into a circle by 1.5s
	wobbleEnd: [24, 45] as const,
	// grey/white liquid bands flow across the face; white gloss band exits by ~3.6s
	liquid: [6, 110] as const,
	// 1.2–1.7s: logo fades in on the face
	logoIn: [36, 52] as const,
	// 2.0–2.7s: title sharpens in from large and blurred; tagline just after
	title: [60, 80] as const,
	tagline: [66, 86] as const,
} as const;

/**
 * Camera keyframes (frame → value), measured from the reference:
 *  scale: coin width relative to its final size
 *  tilt:  degrees the face is tipped away from the viewer (from bbox height/width)
 *  dy/dx: coin centre offset from its final position, in units of the final radius
 */
export const CAM = {
	frames: [6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57, 60, 63, 66, 69, 72, 75, 78, 81, 84, 87, 90, 93, 96],
	scale: [0.3, 0.91, 1.41, 2.11, 2.41, 2.58, 2.7, 2.86, 3.04, 3.12, 3.14, 3.13, 3.12, 3.04, 2.9, 2.72, 2.5, 2.19, 1.87, 1.61, 1.43, 1.33, 1.27, 1.21, 1.17, 1.13, 1.09, 1.07, 1.03, 1.01, 1.0],
	tilt: [80, 80, 79, 78, 74, 69, 66, 62, 62, 62, 60, 58, 54, 50, 45, 39, 32, 24, 17, 10, 6, 4, 2, 1, 0, 0, 0, 0, 0, 0, 0],
	dy: [-0.61, -0.59, -0.52, -0.35, -0.12, 0.15, 0.46, 0.66, 0.77, 0.69, 0.58, 0.49, 0.45, 0.39, 0.38, 0.38, 0.34, 0.28, 0.22, 0.16, 0.11, 0.07, 0.05, 0.03, 0.02, 0.01, 0.0, 0.0, 0.0, 0.0, 0.0],
	dx: [0.7, 0.8, 0.69, 0.67, 0.4, 0.23, 0.24, 0.34, 0.4, 0.39, 0.32, 0.23, 0.17, 0.11, 0.09, 0.09, 0.1, 0.09, 0.07, 0.06, 0.04, 0.04, 0.04, 0.04, 0.03, 0.03, 0.02, 0.02, 0.0, 0.0, 0.0],
} as const;
