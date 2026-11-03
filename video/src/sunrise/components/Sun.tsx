import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {alpha, clamp} from '../../lib/utils';
import {useSunriseLayout, type SunriseLayout} from '../layout';
import {SR} from '../timeline';
import type {SunrisePalette} from '../schema';

/** Where the sun is at a given absolute frame. Shared by Sky, water reflection and logo. */
export const sunPosition = (frame: number, l: SunriseLayout, fps = 30) => {
	const y = interpolate(frame, SR.sunRise, [l.horizon + l.logoR * 0.35, l.cy], {
		...clamp,
		easing: Easing.out(Easing.cubic),
	});
	const grow = spring({frame: frame - SR.sunGrow, fps, config: {damping: 14, stiffness: 90}});
	const r = l.logoR * (0.55 + 0.45 * grow);
	return {x: l.cx, y, r, grow};
};

/**
 * The one sun shared by both homes. Rises behind the backwaters, keeps climbing
 * through the wipe, then grows and throws slowly turning rays just before it becomes the logo.
 * Mounted for the full timeline (0–300); drawn behind the landscapes.
 */
export const Sun: React.FC<{colors: SunrisePalette}> = ({colors}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const layout = useSunriseLayout();
	const {x, y, r} = sunPosition(frame, layout, fps);
	const {logoR, u} = layout;

	const rays = spring({frame: frame - SR.rays, fps, config: {damping: 16, stiffness: 70}});
	const rot = frame * 0.18;
	const N = 28;
	const size = logoR * 4;

	return (
		<AbsoluteFill>
			<svg
				width={size}
				height={size}
				viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`}
				style={{position: 'absolute', left: x - size / 2, top: y - size / 2, overflow: 'visible'}}
			>
				<defs>
					<radialGradient id="sr-disc">
						<stop offset="0%" stopColor="#FFFBEA" />
						<stop offset="55%" stopColor={colors.sun} />
						<stop offset="100%" stopColor={colors.accent} />
					</radialGradient>
				</defs>

				{/* sunburst rays (long/short alternating) */}
				<g transform={`rotate(${rot}) scale(${rays})`} opacity={0.85 * rays}>
					{new Array(N).fill(0).map((_, i) => {
						const long = i % 2 === 0;
						const r0 = logoR * 1.12;
						const r1 = logoR * (long ? 1.75 : 1.45);
						const half = (Math.PI / N) * (long ? 0.42 : 0.3);
						const a = (i / N) * Math.PI * 2;
						const p = (ang: number, rad: number) =>
							`${(Math.cos(ang) * rad).toFixed(1)},${(Math.sin(ang) * rad).toFixed(1)}`;
						return (
							<path
								key={i}
								d={`M${p(a - half, r0)} L${p(a, r1)} L${p(a + half, r0)} Z`}
								fill={long ? alpha(colors.sun, 0.75) : alpha(colors.accent, 0.5)}
							/>
						);
					})}
				</g>

				{/* soft corona */}
				<circle r={r * 1.35} fill={alpha(colors.sun, 0.25)} />
				<circle r={r * 1.15} fill={alpha('#FFFBEA', 0.25)} />
				{/* disc */}
				<circle r={r} fill="url(#sr-disc)" />
				<circle r={r + 5 * u * rays} fill="none" stroke={alpha('#FFFBEA', 0.7 * rays)} strokeWidth={2 * u} />
			</svg>
		</AbsoluteFill>
	);
};
