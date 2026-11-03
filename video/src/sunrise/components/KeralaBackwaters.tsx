import React, {useMemo} from 'react';
import {
	AbsoluteFill,
	interpolate,
	interpolateColors,
	random,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {palmPath} from '../../components/Skyline';
import {alpha, clamp} from '../../lib/utils';
import {birdPath, hillPath, useSunriseLayout, wipeSeam} from '../layout';
import {SR} from '../timeline';
import {SnakeBoat} from './SnakeBoat';
import {sunPosition} from './Sun';
import type {SunrisePalette} from '../schema';

/**
 * Home #1 — dawn on the Kerala backwaters.
 * Mounted for 0–175 (it is wiped away by 170). Uses the absolute frame.
 *  - 0–40:    Western Ghats hills and the water fade up; sun reflection shimmers
 *  - 6+:      coconut palms lean in from both edges (spring)
 *  - 14–120:  a flock of birds crosses the dawn sky
 *  - 26–168:  chundan vallam races left → right with its reflection
 *  - 122–170: clipped away by the diagonal gold seam (prairie revealed underneath)
 */
export const KeralaBackwaters: React.FC<{colors: SunrisePalette}> = ({colors}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const layout = useSunriseLayout();
	const {width: W, height: H, horizon, u, vertical} = layout;
	const sun = sunPosition(frame, layout, fps);
	const seam = wipeSeam(frame, W, H);

	const skyBottom = interpolateColors(frame, SR.skyShift, [colors.dawnBottom, colors.dayBottom]);
	const hillsIn = interpolate(frame, [0, 35], [0, 1], clamp);

	const sparkles = useMemo(
		() =>
			new Array(46).fill(0).map((_, i) => ({
				x: random(`ws-x-${i}`) * W,
				y: horizon + 8 * u + random(`ws-y-${i}`) ** 1.6 * (H - horizon),
				w: (14 + random(`ws-w-${i}`) * 40) * u,
				p: random(`ws-p-${i}`) * Math.PI * 2,
			})),
		[W, H, horizon, u],
	);

	// boat
	const boatScale = (vertical ? 0.95 : 1.05) * u;
	const boatX = interpolate(frame, SR.boat, [-0.25 * W - 340 * boatScale, W + 360 * boatScale]);
	const boatY = horizon + (H - horizon) * (vertical ? 0.3 : 0.4);

	// palms
	const palmL = spring({frame: frame - SR.palms, fps, config: {damping: 15, stiffness: 70}});
	const palmR = spring({frame: frame - SR.palms - 6, fps, config: {damping: 15, stiffness: 70}});
	const palmH = (vertical ? 760 : 620) * u;
	const palmFill = '#1E0F24';

	const clip = `M${seam.top},0 L${W + 10},0 L${W + 10},${H} L${seam.bottom},${H} Z`;

	return (
		<AbsoluteFill>
			<svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
				<defs>
					<clipPath id="kerala-clip">
						<path d={clip} />
					</clipPath>
					<linearGradient id="kw-water" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" style={{stopColor: `color-mix(in srgb, ${skyBottom} 55%, ${colors.water})`}} />
						<stop offset="35%" style={{stopColor: colors.water}} />
						<stop offset="100%" style={{stopColor: `color-mix(in srgb, ${colors.water} 60%, #000)`}} />
					</linearGradient>
				</defs>

				<g clipPath="url(#kerala-clip)">
					{/* Western Ghats, two hazy layers */}
					<g opacity={hillsIn}>
						<path
							d={hillPath(W, horizon - 70 * u, 45 * u, horizon + 2, 1.3, 1.2)}
							style={{fill: `color-mix(in srgb, ${colors.dawnTop} 45%, ${skyBottom})`}}
							opacity={0.75}
						/>
						<path
							d={hillPath(W, horizon - 28 * u, 26 * u, horizon + 2, 4.1, 2)}
							style={{fill: `color-mix(in srgb, ${colors.dawnTop} 70%, ${skyBottom})`}}
						/>
						{/* tiny distant palm line on the far bank */}
						{new Array(Math.floor(W / (38 * u))).fill(0).map((_, i) => {
							const x = i * 38 * u + random(`fb-${i}`) * 20 * u;
							const h = (20 + random(`fbh-${i}`) * 22) * u;
							return (
								<path
									key={i}
									d={palmPath(h, (random(`fbl-${i}`) - 0.5) * 10 * u, u * 0.35)}
									transform={`translate(${x} ${horizon})`}
									style={{fill: `color-mix(in srgb, ${colors.dawnTop} 85%, #000)`}}
								/>
							);
						})}
					</g>

					{/* water */}
					<rect x={0} y={horizon} width={W} height={H - horizon} fill="url(#kw-water)" />

					{/* sun reflection column */}
					{new Array(16).fill(0).map((_, i) => {
						const y = horizon + 5 * u + i * (10 + i * 2.2) * u;
						const w = (50 + i * 16) * u * (0.55 + 0.45 * Math.sin(frame * 0.14 + i * 1.3));
						return (
							<rect
								key={`sr${i}`}
								x={sun.x - w / 2}
								y={y}
								width={w}
								height={(2.5 + i * 0.25) * u}
								rx={1.5 * u}
								fill={colors.sun}
								opacity={(0.85 - i * 0.045) * hillsIn}
							/>
						);
					})}

					{/* ambient sparkles */}
					{sparkles.map((s, i) => (
						<rect
							key={`sp${i}`}
							x={s.x + Math.sin(frame / 30 + s.p) * 10 * u}
							y={s.y}
							width={s.w}
							height={1.6 * u}
							fill="#FFFFFF"
							opacity={0.12 + 0.18 * Math.abs(Math.sin(frame / 12 + s.p))}
						/>
					))}

					{/* boat reflection, then boat */}
					<g transform={`translate(${boatX} ${boatY + 6 * u}) scale(1 -0.6)`} opacity={0.22} style={{filter: `blur(${1.5 * u}px)`}}>
						<SnakeBoat frame={frame} colors={colors} scale={boatScale} />
					</g>
					<g transform={`translate(${boatX} ${boatY})`}>
						<SnakeBoat frame={frame} colors={colors} scale={boatScale} />
					</g>

					{/* birds */}
					{new Array(6).fill(0).map((_, i) => {
						const t = frame - SR.birds - i * 3;
						if (t < 0) return null;
						const x = -60 * u + t * (7 + (i % 3)) * u + (i % 2) * 40 * u;
						const y = H * 0.24 + i * 22 * u - t * 1.1 * u - (i % 2) * 30 * u;
						const flap = Math.sin(t * 0.45 + i);
						return (
							<path
								key={`b${i}`}
								d={birdPath((10 + (i % 3) * 3) * u, flap)}
								transform={`translate(${x} ${y})`}
								fill="none"
								stroke={palmFill}
								strokeWidth={2.6 * u}
								strokeLinecap="round"
							/>
						);
					})}

					{/* foreground palms leaning over the water */}
					<g transform={`translate(${-40 * u - (1 - palmL) * 300 * u} ${H + 10 * u}) rotate(${-4 + (1 - palmL) * -10})`}>
						<path d={palmPath(palmH, 260 * u, u * 2.6)} fill={palmFill} />
					</g>
					<g transform={`translate(${W + 50 * u + (1 - palmR) * 300 * u} ${H + 10 * u}) rotate(${4 + (1 - palmR) * 10})`}>
						<path d={palmPath(palmH * 0.85, -220 * u, u * 2.4)} fill={palmFill} />
					</g>
				</g>

				{/* the gold seam between the two homes */}
				{seam.active ? (
					<line
						x1={seam.top}
						y1={-10}
						x2={seam.bottom}
						y2={H + 10}
						stroke={colors.sun}
						strokeWidth={5 * u}
						style={{filter: `drop-shadow(0 0 ${14 * u}px ${colors.sun})`}}
					/>
				) : null}
			</svg>
		</AbsoluteFill>
	);
};
