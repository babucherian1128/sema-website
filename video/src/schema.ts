import {z} from 'zod';
import {zColor} from '@remotion/zod-types';

/**
 * Props for both SemaIntro compositions. Every field is editable live in
 * Remotion Studio's props panel (colours get a colour picker via zColor).
 */
export const semaIntroSchema = z.object({
	title: z.string().describe('Full association name, revealed letter by letter'),
	tagline: z.string().describe('Tagline, revealed word by word. First word gets the gold shimmer.'),
	logoSrc: z
		.string()
		.describe('Logo file in public/ (PNG or SVG), or an absolute https:// URL'),
	musicSrc: z
		.string()
		.describe('Music file in public/. Leave empty, or omit the file, to render silently.'),
	colors: z.object({
		background: zColor(),
		gold: zColor(),
		green: zColor(),
		teal: zColor(),
		marigold: zColor(),
		magenta: zColor(),
		text: zColor(),
	}),
});

export type SemaIntroProps = z.infer<typeof semaIntroSchema>;
export type Palette = SemaIntroProps['colors'];

export const defaultSemaIntroProps: SemaIntroProps = {
	title: 'South Edmonton Malayalee Association',
	tagline: 'Connecting Malayalees of South Edmonton',
	logoSrc: 'sema-logo.png',
	musicSrc: 'intro-music.mp3',
	colors: {
		background: '#0B1033', // deep midnight indigo
		gold: '#D4AF37', // kasavu gold
		green: '#1E8E3E', // Kerala green
		teal: '#0FA3B1', // peacock teal
		marigold: '#FFB300', // marigold
		magenta: '#E0457B', // lotus magenta
		text: '#FFFFFF',
	},
};
