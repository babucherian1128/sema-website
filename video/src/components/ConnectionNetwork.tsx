import React, {useMemo} from 'react';
import {
	AbsoluteFill,
	Easing,
	interpolate,
	random,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {useLayout} from '../lib/layout';
import {alpha, clamp} from '../lib/utils';
import type {Palette} from '../schema';

/**
 * Community network: small light points around the logo joined by glowing
 * gold threads. The lower sector is left open so the text stays clean.
 * Mounted in <Sequence from={T.network}> (frame 186), so frame 0 here = 186.
 *  - points pop in staggered (2 frames apart)
 *  - threads draw between neighbours, plus a few longer chords, over ~40 frames
 */
export const ConnectionNetwork: React.FC<{colors: Palette}> = ({colors}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {width, height, cx, cy, logoR, vertical, u} = useLayout();

	const points = useMemo(() => {
		const rx = logoR * (vertical ? 1.8 : 2.55);
		const ry = logoR * (vertical ? 1.55 : 1.3);
		const pts: {x: number; y: number}[] = [];
		const N = 15;
		// sweep from lower-left, over the top, to lower-right (skip the bottom sector)
		const start = (140 * Math.PI) / 180;
		const end = (400 * Math.PI) / 180;
		for (let i = 0; i < N; i++) {
			const a = start + ((end - start) * i) / (N - 1) + (random(`na-${i}`) - 0.5) * 0.12;
			const k = 0.88 + random(`nr-${i}`) * 0.24;
			pts.push({x: cx + Math.cos(a) * rx * k, y: cy + Math.sin(a) * ry * k});
		}
		return pts;
	}, [cx, cy, logoR, vertical]);

	const edges = useMemo(() => {
		const e: [number, number][] = [];
		for (let i = 0; i < points.length - 1; i++) e.push([i, i + 1]);
		for (let i = 0; i < points.length - 3; i += 3) e.push([i, i + 2]);
		for (let i = 1; i < points.length - 3; i += 4) e.push([i, i + 3]);
		return e;
	}, [points]);

	const fade = interpolate(frame, [0, 10], [0, 1], clamp);

	return (
		<AbsoluteFill style={{opacity: fade}}>
			<svg
				width={width}
				height={height}
				style={{position: 'absolute', inset: 0, filter: `drop-shadow(0 0 ${5 * u}px ${alpha(colors.gold, 0.9)})`}}
			>
				{edges.map(([a, b], i) => {
					const start = 6 + Math.min(a, b) * 2 + (i % 3) * 3;
					const p = interpolate(frame, [start, start + 16], [0, 1], {
						...clamp,
						easing: Easing.inOut(Easing.cubic),
					});
					const long = Math.abs(a - b) > 1;
					return (
						<line
							key={i}
							x1={points[a].x}
							y1={points[a].y}
							x2={points[b].x}
							y2={points[b].y}
							stroke={long ? alpha(colors.gold, 0.45) : colors.gold}
							strokeWidth={(long ? 0.9 : 1.4) * u}
							pathLength={1}
							strokeDasharray="1 1"
							strokeDashoffset={1 - p}
						/>
					);
				})}
				{points.map((pt, i) => {
					const s = spring({frame: frame - i * 2, fps, config: {damping: 12, stiffness: 160}});
					const twinkle = 0.75 + 0.25 * Math.sin(frame / 6 + i * 1.7);
					return (
						<g key={i} transform={`translate(${pt.x} ${pt.y}) scale(${Math.max(0, s)})`}>
							<circle r={9 * u} fill={alpha(colors.marigold, 0.25 * twinkle)} />
							<circle r={3.2 * u} fill="#FFF3C4" opacity={twinkle} />
						</g>
					);
				})}
			</svg>
		</AbsoluteFill>
	);
};
