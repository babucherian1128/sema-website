import {z} from 'zod';
import {zColor} from '@remotion/zod-types';

/** Props for the particle-swirl logo reveal. Editable in Remotion Studio. */
export const swirlSchema = z.object({
	title: z.string().describe('Shown in caps under the logo, letters flicker in at random'),
	tagline: z.string(),
	logoSrc: z.string().describe('Logo in public/ (PNG or SVG) or an https:// URL'),
	musicSrc: z.string().describe('Optional music in public/. Missing file = silent render.'),
	colors: z.object({
		bgCenter: zColor(),
		bgEdge: zColor(),
		glow: zColor().describe('Light streams and comets (use a #hex colour)'),
		ember: zColor().describe('Dashed ember streams (use a #hex colour)'),
		text: zColor(),
	}),
});

export type SwirlProps = z.infer<typeof swirlSchema>;
export type SwirlPalette = SwirlProps['colors'];

export const defaultSwirlProps: SwirlProps = {
	title: 'South Edmonton Malayalee Association',
	tagline: 'Connecting Malayalees of South Edmonton',
	logoSrc: 'sema-logo.png',
	musicSrc: 'intro-music.mp3',
	colors: {
		bgCenter: '#CDB532', // luminous gold
		bgEdge: '#2E2505', // deep olive-black corners
		glow: '#FFE36A',
		ember: '#FFA526',
		text: '#FFFFFF',
	},
};
