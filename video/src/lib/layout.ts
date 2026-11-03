import {useVideoConfig} from 'remotion';

/**
 * Responsive layout shared by every component. The same timeline drives a
 * 16:9 (1920x1080) and a 9:16 (1080x1920) composition; only positions and
 * sizes change.
 */
export type Layout = ReturnType<typeof useLayout>;

export const useLayout = () => {
	const {width, height} = useVideoConfig();
	const vertical = height > width;
	// 1 unit = 1px at 1080 on the short side, so both formats share sizes.
	const u = Math.min(width, height) / 1080;

	const logoR = (vertical ? 250 : 172) * u;
	const cx = width / 2;
	const cy = vertical ? height * 0.39 : height * 0.36;

	return {
		width,
		height,
		vertical,
		u,
		cx,
		cy,
		logoR,
		// pookalam outer radius when fully bloomed
		mandalaR: logoR * 1.48,
		titleTop: cy + logoR + (vertical ? 120 : 62) * u,
		titleSize: (vertical ? 66 : 60) * u,
		taglineSize: (vertical ? 44 : 36) * u,
		textMaxWidth: width - (vertical ? 140 : 300) * u,
		frameInset: (vertical ? 40 : 34) * u,
		skylineHeight: (vertical ? 330 : 250) * u,
	};
};

/**
 * Split words into `lines` lines of roughly equal character length.
 * Used in the vertical format so long text wraps on a deliberate break.
 */
export const balanceLines = (text: string, lines: number): string[][] => {
	const words = text.trim().split(/\s+/);
	if (lines <= 1 || words.length < 2) return [words];
	const target = text.length / lines;
	const out: string[][] = [[]];
	let len = 0;
	for (const w of words) {
		const cur = out[out.length - 1];
		if (cur.length > 0 && len + w.length / 2 > target && out.length < lines) {
			out.push([w]);
			len = w.length + 1;
		} else {
			cur.push(w);
			len += w.length + 1;
		}
	}
	return out;
};
