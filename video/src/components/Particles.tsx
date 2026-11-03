import React, {useMemo} from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame} from 'remotion';
import {useLayout} from '../lib/layout';
import {alpha, clamp} from '../lib/utils';
import type {Palette} from '../schema';

const COUNT = 90;

/**
 * Gold dust drifting upward. Seeded with remotion's random() so every
 * render (and every parallel render chunk) is identical.
 */
export const Particles: React.FC<{colors: Palette}> = ({colors}) => {
	const frame = useCurrentFrame();
	const {width, height, u} = useLayout();

	const dust = useMemo(
		() =>
			new Array(COUNT).fill(0).map((_, i) => ({
				x: random(`dust-x-${i}`) * width,
				y: random(`dust-y-${i}`) * height,
				speed: (0.5 + random(`dust-s-${i}`) * 1.6) * u,
				size: (1.2 + random(`dust-r-${i}`) ** 2 * 4) * u,
				sway: (6 + random(`dust-w-${i}`) * 18) * u,
				phase: random(`dust-p-${i}`) * Math.PI * 2,
				warm: random(`dust-c-${i}`) > 0.7,
			})),
		[width, height, u],
	);

	const masterOpacity = interpolate(frame, [0, 25], [0, 1], clamp);
	const span = height + 40 * u;

	return (
		<AbsoluteFill style={{opacity: masterOpacity}}>
			{dust.map((p, i) => {
				const y = ((((p.y - frame * p.speed) % span) + span) % span) - 20 * u;
				const x = p.x + Math.sin(frame / 28 + p.phase) * p.sway;
				const twinkle = 0.45 + 0.55 * Math.abs(Math.sin(frame / 14 + p.phase));
				// fade out near the top so dust dissolves rather than pops
				const edge = interpolate(y, [0, height * 0.18], [0, 1], clamp);
				const c = p.warm ? colors.marigold : colors.gold;
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: x,
							top: y,
							width: p.size,
							height: p.size,
							borderRadius: '50%',
							backgroundColor: c,
							opacity: twinkle * edge,
							boxShadow: `0 0 ${p.size * 3}px ${alpha(c, 0.8)}`,
						}}
					/>
				);
			})}
		</AbsoluteFill>
	);
};
