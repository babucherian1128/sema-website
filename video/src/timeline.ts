/**
 * Master timeline (30 fps, 300 frames = 10 s). All values are absolute frames.
 * Each component is mounted in a <Sequence from={...}> in SemaIntro.tsx, so
 * inside a component useCurrentFrame() is relative to that `from`.
 */
export const FPS = 30;
export const DURATION = 300;

export const T = {
	// 1. 0–1.5s: indigo glow, gold dust, kasavu line draws across centre
	intro: 0,
	goldLineDraw: [6, 40] as const,
	goldLineFade: [55, 90] as const,

	// 2. 1.5–3.5s: pookalam mandala blooms
	pookalam: 45,
	ringStagger: 7,

	// 3. 3.5–5.5s: mandala contracts to gold ring, logo springs in, shimmer
	contract: 105,
	logo: 112,
	logoShimmer: [140, 166] as const,

	// 4. 5.5–7.5s: title letters, tagline words, connection network
	title: 165,
	letterStagger: 0.85,
	tagline: 192,
	wordStagger: 7,
	network: 186,

	// 5. 7.5–9s: kasavu frame, palms → skyline, falling petals
	frame: 225,
	palms: 225,
	skylineMorph: 242,
	petals: 228,

	// 6. 9–10s: settle, breathing glow, fade to indigo
	breathe: [270, 296] as const,
	fadeOut: [290, 299] as const,
} as const;
