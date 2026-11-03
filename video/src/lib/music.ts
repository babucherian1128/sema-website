import {getStaticFiles} from '@remotion/studio';

/** Music is optional: true only when the file exists in public/ (or is a URL). */
export const hasMusic = (src: string) => {
	if (!src) return false;
	if (/^(https?:|data:)/.test(src)) return true;
	return getStaticFiles().some((f) => f.name === src.replace(/^\//, ''));
};
