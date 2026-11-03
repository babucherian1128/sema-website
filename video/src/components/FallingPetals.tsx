import React, {useMemo} from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame} from 'remotion';
import {useLayout} from '../lib/layout';
import {clamp, petalPath} from '../lib/utils';
import type {Palette} from '../schema';

const COUNT = 14;

/**
 * A few colourful pookalam petals drifting down with a gentle sway.
 * Mounted in <Sequence from={T.petals}> (frame 228), so frame 0 here = 228.
 */
export const FallingPetals: React.FC<{colors: Palette}> = ({colors}) => {
	const frame = useCurrentFrame();
	const {width, u} = useLayout();
	const palette = [colors.marigold, colors.magenta, colors.teal, colors.gold, colors.green];

	const petals = useMemo(
		() =>
			new Array(COUNT).fill(0).map((_, i) => ({
				x: (0.06 + random(`pt-x-${i}`) * 0.88) * width,
				delay: random(`pt-d-${i}`) * 36,
				speed: (2.4 + random(`pt-s-${i}`) * 2.2) * u,
				sway: (20 + random(`pt-w-${i}`) * 30) * u,
				spin: (random(`pt-r-${i}`) - 0.5) * 8,
				size: (14 + random(`pt-z-${i}`) * 12) * u,
				phase: random(`pt-p-${i}`) * Math.PI * 2,
				color: palette[i % palette.length],
			})),
		[width, u, ...palette],
	);

	return (
		<AbsoluteFill>
			<svg width="100%" height="100%" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
				{petals.map((p, i) => {
					const t = frame - p.delay;
					if (t < 0) return null;
					const y = -40 * u + t * p.speed;
					const x = p.x + Math.sin(t / 16 + p.phase) * p.sway;
					const rot = t * p.spin + Math.sin(t / 10 + p.phase) * 25;
					// a fake 3D flutter: squash width with a slow cosine
					const flutter = 0.55 + 0.45 * Math.abs(Math.cos(t / 9 + p.phase));
					const opacity = interpolate(t, [0, 8], [0, 0.95], clamp);
					return (
						<g key={i} transform={`translate(${x} ${y}) rotate(${rot}) scale(${flutter} 1)`} opacity={opacity}>
							<path d={petalPath(p.size, p.size * 0.38)} fill={p.color} />
						</g>
					);
				})}
			</svg>
		</AbsoluteFill>
	);
};
