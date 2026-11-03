import React, {useMemo} from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame} from 'remotion';
import {alpha, clamp} from '../../lib/utils';
import {birdPath, hillPath, useSunriseLayout, wipeSeam} from '../layout';
import {SR} from '../timeline';
import type {SunrisePalette} from '../schema';

/**
 * Home #2: Alberta canola prairie under a big morning sky.
 * Mounted from frame 110 (just before the wipe uncovers it) to the end. Uses the absolute frame.
 *  - rolling bands of green and canola yellow, with crop rows running to the horizon
 *  - a classic red prairie grain elevator, and Edmonton's skyline small on the horizon
 *  - soft clouds drifting; from 196, a V of Canada geese crosses the sky
 */
export const Prairie: React.FC<{colors: SunrisePalette}> = ({colors}) => {
	const frame = useCurrentFrame();
	const {width: W, height: H, horizon, u, vertical, cx} = useSunriseLayout();

	const near = horizon + (H - horizon) * 0.32;
	const nearPath = hillPath(W, near, 26 * u, H, 2.2, 0.8);

	const flowers = useMemo(
		() =>
			new Array(70).fill(0).map((_, i) => ({
				x: random(`cf-x-${i}`) * W,
				y: near + 30 * u + random(`cf-y-${i}`) ** 0.8 * (H - near),
				r: (2 + random(`cf-r-${i}`) * 4) * u,
				p: random(`cf-p-${i}`) * Math.PI * 2,
			})),
		[W, H, near, u],
	);

	// Edmonton on the horizon (small, hazy)
	const city = useMemo(() => {
		const base = vertical ? 0.6 : 0.83;
		const spec = [
			[0, 26, 40], [0.012, 18, 58], [0.024, 22, 46], [0.036, 16, 84], [0.046, 20, 70],
			[0.058, 24, 52], [0.07, 18, 38], [0.08, 30, 22],
		];
		return spec.map(([fx, w, h]) => ({x: (base + fx * (vertical ? 1.8 : 1)) * W, w: w * u, h: h * u}));
	}, [W, u, vertical]);

	const elevX = W * (vertical ? 0.2 : 0.1);
	// only the part left of the gold seam is visible (Kerala keeps the rest until the wipe ends)
	const seam = wipeSeam(frame, W, H);
	const clip = `M-10,-10 L${seam.top},-10 L${seam.bottom},${H + 10} L-10,${H + 10} Z`;
	const elevBase = horizon + 8 * u;

	return (
		<AbsoluteFill>
			<svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
				<defs>
					<linearGradient id="pr-canola" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stopColor={colors.canola} />
						<stop offset="100%" style={{stopColor: `color-mix(in srgb, ${colors.canola} 70%, ${colors.accent})`}} />
					</linearGradient>
					<clipPath id="pr-seam">
						<path d={clip} />
					</clipPath>
					<clipPath id="pr-near">
						<path d={nearPath} />
					</clipPath>
				</defs>
				<g clipPath="url(#pr-seam)">

				{/* clouds */}
				{[0, 1, 2].map((i) => {
					const x = ((random(`cl-x-${i}`) * W + frame * (0.4 + i * 0.2) * u) % (W + 400 * u)) - 200 * u;
					const y = H * (0.1 + i * 0.07);
					const s = (0.8 + random(`cl-s-${i}`) * 0.6) * u;
					return (
						<g key={i} transform={`translate(${x} ${y}) scale(${s})`} opacity={0.75} style={{filter: `blur(${6 * u}px)`}}>
							<ellipse cx={0} cy={0} rx={130} ry={26} fill="#FFFFFF" />
							<ellipse cx={-40} cy={-16} rx={60} ry={28} fill="#FFFFFF" />
							<ellipse cx={45} cy={-12} rx={70} ry={24} fill="#FFFFFF" />
						</g>
					);
				})}

				{/* Edmonton skyline on the horizon */}
				{city.map((b, i) => (
					<rect key={i} x={b.x} y={horizon - b.h} width={b.w} height={b.h + 4} fill={alpha('#5A6B8C', 0.55)} />
				))}

				{/* far field band */}
				<path d={hillPath(W, horizon + 4 * u, 6 * u, H, 0.4, 1.5)} fill={colors.field} />
				{/* grain elevator */}
				<g transform={`translate(${elevX} ${elevBase})`}>
					<path
						d={`M${-22 * u},0 L${-22 * u},${-92 * u} L0,${-112 * u} L${22 * u},${-92 * u} L${22 * u},0 Z`}
						fill="#B23A2A"
					/>
					<path d={`M${8 * u},0 L${8 * u},${-100 * u} L${22 * u},${-92 * u} L${22 * u},0 Z`} fill="#8A2A1F" />
					<rect x={-9 * u} y={-136 * u} width={18 * u} height={30 * u} fill="#B23A2A" />
					<path d={`M${-12 * u},${-136 * u} L0,${-148 * u} L${12 * u},${-136 * u} Z`} fill="#6E1F18" />
					<rect x={22 * u} y={-40 * u} width={36 * u} height={40 * u} fill="#9C3324" />
					<rect x={-15 * u} y={-80 * u} width={30 * u} height={5 * u} fill={alpha('#FFFFFF', 0.85)} />
				</g>
				{/* mid canola band */}
				<path d={hillPath(W, horizon + 22 * u, 12 * u, H, 3.3, 1.1)} fill="url(#pr-canola)" />
				{/* mid green band */}
				<path d={hillPath(W, horizon + (H - horizon) * 0.17, 18 * u, H, 5.1, 0.9)} fill={colors.field} />

				{/* near canola field with crop rows converging on the horizon */}
				<path d={nearPath} fill="url(#pr-canola)" />
				<g clipPath="url(#pr-near)">
					{new Array(31).fill(0).map((_, i) => {
						const bx = ((i - 15) / 15) * W * 1.6 + cx;
						return (
							<line
								key={i}
								x1={cx}
								y1={horizon}
								x2={bx}
								y2={H}
								stroke={alpha(colors.field, 0.35)}
								strokeWidth={3 * u}
							/>
						);
					})}
					{flowers.map((f, i) => (
						<circle
							key={i}
							cx={f.x + Math.sin(frame / 18 + f.p) * 4 * u}
							cy={f.y}
							r={f.r}
							fill="#FFF3A6"
							opacity={0.55 + 0.35 * Math.sin(frame / 10 + f.p)}
						/>
					))}
				</g>

				{/* Canada geese in a V */}
				{new Array(9).fill(0).map((_, i) => {
					const t = frame - SR.geese;
					if (t < 0) return null;
					const rank = Math.ceil(i / 2);
					const side = i === 0 ? 0 : i % 2 ? -1 : 1;
					const x = W + 80 * u - t * 6 * u + rank * 34 * u;
					const y = H * (vertical ? 0.13 : 0.17) + side * rank * 22 * u + Math.sin(t / 20) * 6 * u;
					const flap = Math.sin(t * 0.32 + rank * 0.8);
					const fade = interpolate(t, [0, 10], [0, 1], clamp);
					return (
						<path
							key={i}
							d={birdPath(13 * u, flap)}
							transform={`translate(${x} ${y})`}
							fill="none"
							stroke="#2B2B3A"
							strokeWidth={2.6 * u}
							strokeLinecap="round"
							opacity={fade}
						/>
					);
				})}
				</g>
			</svg>
		</AbsoluteFill>
	);
};
