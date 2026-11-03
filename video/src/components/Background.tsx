import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {useLayout} from '../lib/layout';
import {alpha, clamp} from '../lib/utils';
import {T} from '../timeline';
import type {Palette} from '../schema';

/**
 * Indigo base + warm nilavilakku-style radial glow centred on the logo.
 * Mounted for the full 0–300 timeline; the glow swells when the logo
 * lands and breathes once at the end.
 */
export const Background: React.FC<{colors: Palette}> = ({colors}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {cx, cy, logoR, width, height} = useLayout();

	const glowIn = spring({frame, fps, config: {damping: 200}, durationInFrames: 40});
	const logoBoost = spring({frame: frame - T.logo, fps, config: {damping: 18}});
	const breathe = interpolate(frame, T.breathe, [0, Math.PI], clamp);
	const intensity = glowIn * (0.55 + 0.3 * logoBoost) + 0.15 * Math.sin(breathe);

	const glowR = Math.max(width, height) * 0.55;

	return (
		<AbsoluteFill style={{backgroundColor: colors.background}}>
			{/* warm lamp glow */}
			<AbsoluteFill
				style={{
					background: `radial-gradient(circle ${glowR}px at ${cx}px ${cy}px,
						${alpha(colors.marigold, 0.26 * intensity)} 0%,
						${alpha(colors.gold, 0.12 * intensity)} ${logoR * 1.2}px,
						${alpha(colors.teal, 0.07 * intensity)} ${glowR * 0.55}px,
						transparent 100%)`,
				}}
			/>
			{/* cool prairie-night tint from the top */}
			<AbsoluteFill
				style={{
					background: `linear-gradient(180deg, ${alpha(colors.teal, 0.06)} 0%, transparent 40%)`,
				}}
			/>
			{/* vignette */}
			<AbsoluteFill
				style={{
					background: `radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(2,4,18,0.65) 100%)`,
				}}
			/>
		</AbsoluteFill>
	);
};
