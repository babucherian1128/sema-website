import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {useLayout} from '../lib/layout';
import {alpha, clamp, petalPath} from '../lib/utils';
import type {Palette} from '../schema';

/**
 * Kasavu-saree style gold border: a bold outer line, a fine inner line and a
 * band of tiny gold diamonds between them.
 * Mounted in <Sequence from={T.frame}> (frame 225), so frame 0 here = 225.
 *  - 0–30:  both halves draw from top-centre down to bottom-centre
 *  - 18+:   diamonds in the band light up as the line passes them
 *  - 22+:   lotus corner ornaments spring in
 */
export const KasavuFrame: React.FC<{colors: Palette}> = ({colors}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {width: W, height: H, frameInset, u} = useLayout();

	const draw = interpolate(frame, [0, 30], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});

	const o = frameInset; // outer line
	const i = frameInset + 14 * u; // inner line
	const half = (inset: number, dir: 1 | -1) => {
		const xEdge = dir === 1 ? W - inset : inset;
		return `M${W / 2},${inset} L${xEdge},${inset} L${xEdge},${H - inset} L${W / 2},${H - inset}`;
	};

	// diamonds along the band, positioned by distance from top-centre along each half
	const band = (o + i) / 2;
	const halfLen = W / 2 - band + (H - 2 * band) + (W / 2 - band);
	const spacing = 26 * u;
	const n = Math.floor(halfLen / spacing);
	const pointAt = (d: number, dir: 1 | -1) => {
		const top = W / 2 - band;
		const side = H - 2 * band;
		if (d < top) return {x: W / 2 + dir * d, y: band};
		if (d < top + side) return {x: W / 2 + dir * top, y: band + (d - top)};
		return {x: W / 2 + dir * (top - (d - top - side)), y: H - band};
	};

	const corners = [
		// rotations point the fan diagonally inward from each corner
		{x: o, y: o, r: 315},
		{x: W - o, y: o, r: 45},
		{x: W - o, y: H - o, r: 135},
		{x: o, y: H - o, r: 225},
	];
	const cs = spring({frame: frame - 22, fps, config: {damping: 13, stiffness: 120}});

	return (
		<AbsoluteFill>
			<svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
				<g
					fill="none"
					stroke={colors.gold}
					style={{filter: `drop-shadow(0 0 ${4 * u}px ${alpha(colors.gold, 0.8)})`}}
				>
					{([1, -1] as const).map((dir) => (
						<React.Fragment key={dir}>
							<path
								d={half(o, dir)}
								strokeWidth={3.5 * u}
								pathLength={1}
								strokeDasharray="1 1"
								strokeDashoffset={1 - draw}
							/>
							<path
								d={half(i, dir)}
								strokeWidth={1.2 * u}
								stroke={alpha(colors.gold, 0.75)}
								pathLength={1}
								strokeDasharray="1 1"
								strokeDashoffset={1 - draw}
							/>
						</React.Fragment>
					))}
				</g>

				{([1, -1] as const).map((dir) =>
					new Array(n).fill(0).map((_, k) => {
						const d = (k + 0.5) * spacing;
						const reached = d / halfLen;
						const on = interpolate(draw, [reached, reached + 0.08], [0, 1], clamp);
						if (on <= 0) return null;
						const {x, y} = pointAt(d, dir);
						const r = 3 * u * on;
						return (
							<path
								key={`${dir}-${k}`}
								d={`M${x},${y - r} L${x + r},${y} L${x},${y + r} L${x - r},${y} Z`}
								fill={k % 2 ? colors.gold : alpha(colors.marigold, 0.9)}
							/>
						);
					}),
				)}

				{/* lotus corner ornaments */}
				{corners.map((c, k) => (
					<g
						key={k}
						transform={`translate(${c.x} ${c.y}) rotate(${c.r}) scale(${Math.max(0, cs)})`}
					>
						{[-50, -25, 0, 25, 50].map((a, j) => (
							<path
								key={j}
								d={petalPath((j === 2 ? 34 : 26) * u, (j === 2 ? 9 : 7) * u)}
								transform={`rotate(${a + 180})`}
								fill={j === 2 ? colors.magenta : j % 2 ? colors.gold : alpha(colors.magenta, 0.75)}
							/>
						))}
						<circle r={5 * u} fill="#FFF3C4" />
					</g>
				))}
			</svg>
		</AbsoluteFill>
	);
};
