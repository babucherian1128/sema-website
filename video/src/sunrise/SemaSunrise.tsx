import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, useCurrentFrame, useVideoConfig} from 'remotion';
import {hasMusic} from '../lib/music';
import {clamp, resolveAsset} from '../lib/utils';
import {DURATION} from '../timeline';
import {KeralaBackwaters} from './components/KeralaBackwaters';
import {Prairie} from './components/Prairie';
import {Sky} from './components/Sky';
import {Sun} from './components/Sun';
import {SunLogo} from './components/SunLogo';
import {TitleCard} from './components/TitleCard';
import type {SunriseProps} from './schema';
import {SR} from './timeline';
import './fonts';

/**
 * "Two Homes, One Sunrise": a 10 s SEMA intro.
 * Scene layers share the absolute timeline (Sky, Sun, KeralaBackwaters, Prairie all
 * start at frame 0 and read SR.* directly); overlay layers (SunLogo, TitleCard) are
 * offset Sequences and use relative frames.
 */
export const SemaSunrise: React.FC<SunriseProps> = ({title, tagline, logoSrc, musicSrc, colors}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const fadeToCream = interpolate(frame, SR.fadeOut, [0, 1], clamp);

	return (
		<AbsoluteFill style={{backgroundColor: colors.dawnTop, overflow: 'hidden'}}>
			{/* 0–10s (0–300): dawn → day sky gradient, pre-dawn darkness lifts over 0–50 */}
			<Sequence name="Sky" durationInFrames={DURATION}>
				<Sky colors={colors} />
			</Sequence>

			{/* 0–10s (0–300): one sun rises over both homes (0–150), grows + rays (156+) */}
			<Sequence name="Sun" durationInFrames={DURATION}>
				<Sun colors={colors} />
			</Sequence>

			{/* 3.7–10s (110–300): Alberta canola prairie, uncovered by the wipe; geese from 196 */}
			<Sequence name="Prairie" durationInFrames={DURATION}>
				{frame >= SR.wipe[0] - 12 ? <Prairie colors={colors} /> : null}
			</Sequence>

			{/* 0–5.8s (0–175): Kerala backwaters, snake boat (26–168), wiped away by the gold seam (122–170) */}
			<Sequence name="Kerala backwaters" durationInFrames={SR.wipe[1] + 5}>
				<KeralaBackwaters colors={colors} />
			</Sequence>

			{/* 5.5–10s (166–300): the sun irises open into the SEMA logo */}
			<Sequence name="Sun → logo" from={SR.logo}>
				<SunLogo colors={colors} logoSrc={logoSrc} />
			</Sequence>

			{/* 6–10s (180–300): frosted card, title (188+), underline (206+), tagline (210+), glint (236–262) */}
			<Sequence name="Title card" from={SR.card}>
				<TitleCard colors={colors} title={title} tagline={tagline} />
			</Sequence>

			{/* 9.67–10s (290–300): fade to cream */}
			<AbsoluteFill style={{backgroundColor: colors.cream, opacity: fadeToCream}} />

			{/* Optional music: fade in over 0.5s, out over the last 1s */}
			{hasMusic(musicSrc) ? (
				<Audio
					src={resolveAsset(musicSrc)}
					volume={(f) => interpolate(f, [0, 0.5 * fps, DURATION - fps, DURATION], [0, 1, 1, 0], clamp)}
				/>
			) : null}
		</AbsoluteFill>
	);
};
