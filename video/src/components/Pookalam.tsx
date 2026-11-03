import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {useLayout} from '../lib/layout';
import {alpha, clamp, petalPath} from '../lib/utils';
import {T} from '../timeline';
import type {Palette} from '../schema';

type Ring = {
	inner: number; // fraction of mandala radius
	outer: number;
	count: number;
	color: keyof Palette;
	accent: keyof Palette;
	speed: number; // deg per frame, sign = direction
};

const RINGS: Ring[] = [
	{inner: 0.1, outer: 0.3, count: 8, color: 'marigold', accent: 'gold', speed: 0.5},
	{inner: 0.26, outer: 0.48, count: 12, color: 'magenta', accent: 'marigold', speed: -0.4},
	{inner: 0.44, outer: 0.66, count: 16, color: 'teal', accent: 'gold', speed: 0.32},
	{inner: 0.62, outer: 0.84, count: 20, color: 'green', accent: 'marigold', speed: -0.26},
	{inner: 0.8, outer: 1.0, count: 28, color: 'marigold', accent: 'magenta', speed: 0.2},
];

/**
 * Onam pookalam (flower-carpet mandala).
 * Mounted in <Sequence from={T.pookalam}> (frame 45), so frame 0 here = 45.
 *  - 0–60   (abs 45–105): rings bloom outward, staggered, rotating in alternating directions
 *  - 60+    (abs 105+):   whole mandala contracts behind the logo into a gold petal crown
 */
export const Pookalam: React.FC<{colors: Palette}> = ({colors}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {cx, cy, mandalaR, logoR, u} = useLayout();

	const contractAt = T.contract - T.pookalam;
	const contract = spring({
		frame: frame - contractAt,
		fps,
		config: {damping: 15, stiffness: 80},
	});
	// outer ring ends just outside the gold logo ring, so petal tips form a crown
	const contractedScale = (logoR * 1.2) / mandalaR;
	const groupScale = interpolate(contract, [0, 1], [1, contractedScale]);
	const petalOpacity = interpolate(contract, [0, 1], [1, 0.5]);

	const size = mandalaR * 2.2;

	return (
		<AbsoluteFill>
			<svg
				width={size}
				height={size}
				viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`}
				style={{
					position: 'absolute',
					left: cx - size / 2,
					top: cy - size / 2,
					overflow: 'visible',
				}}
			>
				<defs>
					<radialGradient id="pk-core">
						<stop offset="0%" stopColor="#FFF3C4" />
						<stop offset="60%" stopColor={colors.gold} />
						<stop offset="100%" stopColor={colors.marigold} />
					</radialGradient>
				</defs>
				<g transform={`scale(${groupScale})`} opacity={petalOpacity}>
					{/* outer rings first so inner rings overlap them */}
					{[...RINGS].reverse().map((ring) => {
						const i = RINGS.indexOf(ring);
						const s = spring({
							frame: frame - i * T.ringStagger,
							fps,
							config: {damping: 12, stiffness: 110, mass: 0.9},
						});
						const dir = Math.sign(ring.speed);
						// spin-in flourish while blooming, then slow continuous rotation
						const rot = frame * ring.speed - dir * 40 * (1 - s);
						const r0 = ring.inner * mandalaR;
						const len = (ring.outer - ring.inner) * mandalaR;
						const step = 360 / ring.count;
						const w = Math.min(len * 0.42, ((Math.PI * 2 * (r0 + len * 0.3)) / ring.count) * 0.55);
						return (
							<g
								key={i}
								transform={`rotate(${rot}) scale(${Math.max(0, s)})`}
								opacity={interpolate(s, [0, 0.4], [0, 1], clamp)}
							>
								<circle r={r0} fill="none" stroke={colors.gold} strokeWidth={1.5 * u} opacity={0.8} />
								{new Array(ring.count).fill(0).map((_, k) => (
									<g key={k} transform={`rotate(${k * step}) translate(0 ${-r0})`}>
										<path d={petalPath(len, w)} fill={colors[ring.color]} />
										<path
											d={petalPath(len * 0.55, w * 0.42)}
											transform={`translate(0 ${-len * 0.12})`}
											fill={alpha(colors[ring.accent], 0.85)}
										/>
									</g>
								))}
								{/* gold beads between petals */}
								{new Array(ring.count).fill(0).map((_, k) => (
									<circle
										key={`b${k}`}
										cx={0}
										cy={-(r0 + len * 0.18)}
										r={2.2 * u}
										fill="#FFF3C4"
										transform={`rotate(${(k + 0.5) * step})`}
									/>
								))}
							</g>
						);
					})}
					{/* golden centre */}
					<circle
						r={mandalaR * 0.11 * spring({frame, fps, config: {damping: 12}})}
						fill="url(#pk-core)"
					/>
				</g>
			</svg>
		</AbsoluteFill>
	);
};
