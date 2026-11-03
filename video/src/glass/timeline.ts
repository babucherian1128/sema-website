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
	// keyframes refined by measuring our render against the reference with the same
	// bounding-box method and correcting the size, height and tilt differences
	frames: [6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57, 60, 63, 66, 69, 72, 75, 78, 81, 84, 87, 90, 93, 96],
	scale: [0.3, 0.82, 1.25, 1.85, 2.13, 2.31, 2.46, 2.67, 2.95, 3.09, 3.14, 3.13, 3.12, 3.07, 3.02, 2.74, 2.5, 2.21, 1.91, 1.64, 1.47, 1.36, 1.31, 1.25, 1.215, 1.16, 1.12, 1.09, 1.05, 1.02, 1.0],
	tilt: [80, 80, 80, 79.5, 76, 72, 66.5, 65.5, 63.5, 63.5, 63.5, 62, 60, 56, 52, 48.5, 42, 35, 25, 15, 9, 5, 3, 2, 1, 0, 0, 0, 0, 0, 0],
	dy: [-0.568, -0.611, -0.595, -0.532, -0.383, -0.208, 0.016, 0.332, 0.412, 0.326, 0.284, 0.262, 0.282, 0.275, 0.293, 0.331, 0.317, 0.249, 0.205, 0.149, 0.102, 0.065, 0.047, 0.028, 0.019, 0.009, 0.0, 0.0, 0.0, 0.0, 0.0],
	dx: [0.652, 0.745, 0.576, 0.504, 0.239, 0.054, 0.036, 0.116, 0.239, 0.296, 0.298, 0.214, 0.158, 0.102, 0.084, 0.084, 0.093, 0.084, 0.065, 0.056, 0.037, 0.037, 0.037, 0.037, 0.028, 0.028, 0.019, 0.019, 0.0, 0.0, 0.0],
} as const;
