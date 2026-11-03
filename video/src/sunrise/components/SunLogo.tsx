import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {alpha, clamp, resolveAsset} from '../../lib/utils';
import {useSunriseLayout} from '../layout';
import {SR} from '../timeline';
import type {SunrisePalette} from '../schema';

/**
 * The sun becomes the SEMA logo.
 * Mounted in <Sequence from={SR.logo}> (frame 166), so frame 0 here = 166.
 *  - 0+:  logo irises open from the sun's centre (circular clip 0 → 100%) while scaling 0.82 → 1
 *  - 4+:  a white flash ring expands outward and fades
 *  - 70+ (abs 236+): gentle float for the rest of the shot
 */
export const SunLogo: React.FC<{colors: SunrisePalette; logoSrc: string}> = ({colors, logoSrc}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {cx, cy, logoR, u} = useSunriseLayout();

	const s = spring({frame, fps, config: {damping: 13, stiffness: 95}});
	const iris = interpolate(s, [0, 1], [0, 72], clamp); // clip radius in %
	const scale = 0.82 + 0.18 * s;
	const float = Math.sin(Math.max(0, frame - 70) / 22) * 4 * u;

	const flash = interpolate(frame, [4, 26], [0, 1], clamp);
	const d = logoR * 2;

	return (
		<AbsoluteFill>
			{/* flash ring */}
			<div
				style={{
					position: 'absolute',
					left: cx - logoR,
					top: cy - logoR,
					width: d,
					height: d,
					borderRadius: '50%',
					border: `${4 * u * (1 - flash)}px solid ${alpha('#FFFFFF', 0.9 * (1 - flash))}`,
					transform: `scale(${1 + flash * 0.9})`,
				}}
			/>
			<div
				style={{
					position: 'absolute',
					left: cx - logoR,
					top: cy - logoR + float,
					width: d,
					height: d,
					transform: `scale(${scale})`,
					clipPath: `circle(${iris}% at 50% 50%)`,
					filter: `drop-shadow(0 ${10 * u}px ${24 * u}px ${alpha(colors.ink, 0.35)})`,
				}}
			>
				<Img src={resolveAsset(logoSrc)} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
			</div>
		</AbsoluteFill>
	);
};
