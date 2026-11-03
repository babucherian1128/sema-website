import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, useVideoConfig} from 'remotion';
import {hasMusic} from '../lib/music';
import {clamp, resolveAsset} from '../lib/utils';
import {DiscShadow} from './components/DiscShadow';
import {GlassDisc} from './components/GlassDisc';
import {TitleBlock} from './components/TitleBlock';
import './fonts';
import type {GlassProps} from './schema';
import {GLASS_DURATION} from './timeline';

/** 3D glass-coin logo reveal on white, 6 s. */
export const SemaGlass: React.FC<GlassProps> = ({title, tagline, logoSrc, musicSrc, colors}) => {
	const {fps} = useVideoConfig();
	return (
		<AbsoluteFill style={{backgroundColor: colors.background, overflow: 'hidden'}}>
			{/* very soft studio falloff at the edges */}
			<AbsoluteFill
				style={{background: 'radial-gradient(ellipse at 50% 40%, transparent 60%, rgba(0,0,0,0.05) 100%)'}}
			/>

			{/* 0.3–6s (10–180): contact + long diagonal shadow, follows the coin */}
			<Sequence name="Shadow" durationInFrames={GLASS_DURATION}>
				<DiscShadow />
			</Sequence>

			{/* 0.3–6s (10–180): coin swings in close and tilted (10–32), liquid flows (10–110),
			    logo fades in (36–60), camera pulls back and coin faces the viewer (10–96) */}
			<Sequence name="Glass coin" durationInFrames={GLASS_DURATION}>
				<GlassDisc colors={colors} logoSrc={logoSrc} />
			</Sequence>

			{/* 2.3–6s (68–180): title sharpens in (68–92), tagline (76–100) */}
			<Sequence name="Title" durationInFrames={GLASS_DURATION}>
				<TitleBlock colors={colors} title={title} tagline={tagline} />
			</Sequence>

			{/* Optional music: fade in over 0.5s, out over the last 1s */}
			{hasMusic(musicSrc) ? (
				<Audio
					src={resolveAsset(musicSrc)}
					volume={(f) =>
						interpolate(f, [0, 0.5 * fps, GLASS_DURATION - fps, GLASS_DURATION], [0, 1, 1, 0], clamp)
					}
				/>
			) : null}
		</AbsoluteFill>
	);
};
