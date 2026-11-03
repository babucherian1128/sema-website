import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, useVideoConfig} from 'remotion';
import {hasMusic} from '../lib/music';
import {clamp, resolveAsset} from '../lib/utils';
import '../sunrise/fonts';
import {Backdrop} from './components/Backdrop';
import {ResolveText} from './components/ResolveText';
import {LogoBurst} from './components/LogoBurst';
import {SwirlCanvas} from './components/SwirlCanvas';
import type {SwirlProps} from './schema';
import {SW, SWIRL_DURATION} from './timeline';

/** Particle-swirl logo reveal for SEMA, 12 s. */
export const SemaSwirl: React.FC<SwirlProps> = ({title, tagline, logoSrc, musicSrc, colors}) => {
	const {fps} = useVideoConfig();
	return (
		<AbsoluteFill style={{backgroundColor: colors.bgEdge, overflow: 'hidden'}}>
			{/* 0–12s (0–360): gold backdrop, vignette, slow push-in; light leak after 7.3s */}
			<Sequence name="Backdrop" durationInFrames={SWIRL_DURATION}>
				<Backdrop colors={colors} />
			</Sequence>

			{/* 0–12s (0–360): dust + bokeh throughout; comets 38–120; streams from 70;
			    vortex accelerates from 150; burst into rays 178–206; vortex gone by ~216 */}
			<Sequence name="Particle swirl" durationInFrames={SWIRL_DURATION}>
				<SwirlCanvas colors={colors} />
			</Sequence>

			{/* 0–12s: dark olive vignette over the swirl, as in a lens */}
			<AbsoluteFill
				style={{
					background: `radial-gradient(ellipse 75% 75% at 50% 45%, transparent 45%, color-mix(in srgb, ${colors.bgEdge} 75%, transparent) 100%)`,
				}}
			/>

			{/* 5.9–12s (178–360): flash glow 194–228 behind the logo; logo born tiny at 200,
			    grows to full size by 244 (ease-out, no overshoot), then slow push-in */}
			<Sequence name="Flash + logo" from={SW.burst[0]}>
				<LogoBurst colors={colors} logoSrc={logoSrc} />
			</Sequence>

			{/* 7.1–12s (212–360): name, then tagline (222); letters resolve blur → sharp in random order */}
			<Sequence name="Resolve text" from={SW.title}>
				<ResolveText colors={colors} title={title} tagline={tagline} />
			</Sequence>

			{/* Optional music: fade in over 0.5s, out over the last 1s */}
			{hasMusic(musicSrc) ? (
				<Audio
					src={resolveAsset(musicSrc)}
					volume={(f) =>
						interpolate(f, [0, 0.5 * fps, SWIRL_DURATION - fps, SWIRL_DURATION], [0, 1, 1, 0], clamp)
					}
				/>
			) : null}
		</AbsoluteFill>
	);
};
