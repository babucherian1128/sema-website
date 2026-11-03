/**
 * "Two Homes, One Sunrise" — master timeline (30 fps, 300 frames). Absolute frames.
 *
 * 0–4s     Dawn on the Kerala backwaters: sun rises, a chundan vallam (snake boat) races past
 * 4–5.7s   A diagonal gold seam wipes the scene into Alberta's canola prairie; sky turns to day
 * 5.3–6.5s The same sun reaches centre, grows, throws rays and becomes the SEMA logo
 * 6–8s     Frosted card rises: title word by word, tagline tracks in
 * 8–9s     Geese cross the prairie sky, light glints across the card
 * 9–10s    Settle, fade to cream
 */
export const SR = {
	sunRise: [0, 150] as const,
	palms: 6,
	boat: [26, 168] as const,
	birds: 14,
	skyShift: [110, 178] as const,
	wipe: [122, 170] as const,
	rays: 156,
	sunGrow: 158,
	logo: 166,
	card: 180,
	title: 188,
	wordStagger: 5,
	underline: 206,
	tagline: 210,
	geese: 196,
	glint: [236, 262] as const,
	fadeOut: [290, 299] as const,
} as const;
