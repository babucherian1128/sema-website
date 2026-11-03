import {z} from 'zod';
import {zColor} from '@remotion/zod-types';

/** Props for the 3D glass-coin logo reveal. Editable in Remotion Studio. */
export const glassSchema = z.object({
	title: z.string(),
	tagline: z.string(),
	logoSrc: z.string().describe('Round logo in public/ (PNG or SVG) or an https:// URL'),
	musicSrc: z.string().describe('Optional music in public/. Missing file = silent render.'),
	colors: z.object({
		background: zColor(),
		discBase: zColor().describe('Coin face colour before the logo fades in'),
		liquidMid: zColor(),
		liquidLight: zColor(),
		edge: zColor().describe('Coin thickness (body)'),
		title: zColor(),
		tagline: zColor(),
	}),
});

export type GlassProps = z.infer<typeof glassSchema>;
export type GlassPalette = GlassProps['colors'];

export const defaultGlassProps: GlassProps = {
	title: 'South Edmonton Malayalee Association',
	tagline: 'Connecting Malayalees of South Edmonton',
	logoSrc: 'sema-logo.png',
	musicSrc: 'intro-music.mp3',
	colors: {
		background: '#FFFFFF',
		discBase: '#6E6E6E',
		liquidMid: '#9C9C9C',
		liquidLight: '#CBCBCB',
		edge: '#3E3E3E',
		title: '#2A2A2E',
		tagline: '#55565C',
	},
};
