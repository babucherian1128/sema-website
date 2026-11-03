import {z} from 'zod';
import {zColor} from '@remotion/zod-types';

/** Props for the "Two Homes, One Sunrise" intro. Editable in Remotion Studio. */
export const sunriseSchema = z.object({
	title: z.string().describe('Association name, revealed word by word'),
	tagline: z.string().describe('Tagline, tracks in from wide letter spacing. First word is highlighted.'),
	logoSrc: z.string().describe('Logo in public/ (PNG or SVG) or an https:// URL'),
	musicSrc: z.string().describe('Optional music in public/. Missing file = silent render.'),
	colors: z.object({
		dawnTop: zColor(),
		dawnBottom: zColor(),
		dayTop: zColor(),
		dayBottom: zColor(),
		sun: zColor(),
		water: zColor(),
		canola: zColor(),
		field: zColor(),
		ink: zColor(),
		accent: zColor(),
		cream: zColor(),
	}),
});

export type SunriseProps = z.infer<typeof sunriseSchema>;
export type SunrisePalette = SunriseProps['colors'];

export const defaultSunriseProps: SunriseProps = {
	title: 'South Edmonton Malayalee Association',
	tagline: 'Connecting Malayalees of South Edmonton',
	logoSrc: 'sema-logo.png',
	musicSrc: 'intro-music.mp3',
	colors: {
		dawnTop: '#2B1846', // pre-dawn plum
		dawnBottom: '#FF8C61', // Kerala dawn coral
		dayTop: '#4FA9E8', // big Alberta sky
		dayBottom: '#FFE2B0', // warm morning haze
		sun: '#FFC53D', // sun gold
		water: '#0E5E66', // backwater teal
		canola: '#F2C315', // canola yellow
		field: '#6E9B3A', // prairie green
		ink: '#2A1640', // title ink
		accent: '#E4572E', // vermilion (muthukuda umbrellas)
		cream: '#FFF6E8', // end card
	},
};
