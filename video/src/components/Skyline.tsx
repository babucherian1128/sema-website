import React, {useMemo} from 'react';
import {AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {useLayout} from '../lib/layout';
import {alpha, clamp} from '../lib/utils';
import {T} from '../timeline';
import type {Palette} from '../schema';

/* ---------- silhouette geometry (origin = base centre, up = -y) ---------- */

export const palmPath = (h: number, lean: number, u: number) => {
	const tx = lean;
	const ty = -h;
	const b = 6 * u;
	const t = 2.6 * u;
	let d =
		`M${-b},0 Q${lean * 0.35 - b * 0.6},${-h * 0.55} ${tx - t},${ty} ` +
		`L${tx + t},${ty} Q${lean * 0.35 + b * 0.6},${-h * 0.55} ${b},0 Z`;
	const fronds = [-172, -148, -122, -96, -70, -44, -16, 8];
	for (const deg of fronds) {
		const a = (deg * Math.PI) / 180;
		const L = h * (0.42 + 0.06 * Math.cos(a * 3));
		const dx = Math.cos(a);
		const dy = Math.sin(a);
		const droop = L * 0.42 * Math.abs(dx);
		const tipX = tx + dx * L;
		const tipY = ty + dy * L + droop;
		const mx = tx + dx * L * 0.55;
		const my = ty + dy * L * 0.55 - L * 0.12;
		// unit normal for leaf width
		const nx = -dy;
		const ny = dx;
		const w = L * 0.14;
		d +=
			` M${tx},${ty} Q${mx + nx * w},${my + ny * w} ${tipX},${tipY}` +
			` Q${mx - nx * w * 0.4},${my - ny * w * 0.4} ${tx},${ty} Z`;
	}
	return d;
};

type Building = {
	fx: number; // 0..1 across the skyline span
	kind: 'pyramid' | 'dome' | 'tower' | 'stantec' | 'epcor' | 'bridge';
	w: number;
	h: number;
};

// Edmonton silhouette: Muttart Conservatory pyramids, the Legislature dome,
// downtown towers (Stantec Tower tallest, EPCOR Tower) and the High Level Bridge.
const BUILDINGS: Building[] = [
	{fx: 0.02, kind: 'pyramid', w: 70, h: 58},
	{fx: 0.08, kind: 'pyramid', w: 104, h: 88},
	{fx: 0.145, kind: 'pyramid', w: 82, h: 70},
	{fx: 0.2, kind: 'pyramid', w: 58, h: 48},
	{fx: 0.31, kind: 'dome', w: 190, h: 150},
	{fx: 0.425, kind: 'tower', w: 44, h: 118},
	{fx: 0.47, kind: 'tower', w: 54, h: 168},
	{fx: 0.515, kind: 'tower', w: 46, h: 140},
	{fx: 0.565, kind: 'stantec', w: 58, h: 255},
	{fx: 0.618, kind: 'epcor', w: 62, h: 205},
	{fx: 0.665, kind: 'tower', w: 46, h: 150},
	{fx: 0.705, kind: 'tower', w: 40, h: 112},
	{fx: 0.745, kind: 'tower', w: 52, h: 132},
	{fx: 0.9, kind: 'bridge', w: 280, h: 62},
];

const buildingPath = (b: Building, s: number, hs: number) => {
	const w = b.w * s;
	const h = b.h * hs;
	const x = -w / 2;
	switch (b.kind) {
		case 'pyramid':
			return `M${x},0 L0,${-h} L${-x},0 Z`;
		case 'dome': {
			// wide base, portico block, drum, dome, lantern
			const r = 30 * s;
			return (
				`M${x},0 L${x},${-h * 0.27} L${-w * 0.24},${-h * 0.27} L${-w * 0.24},${-h * 0.45} ` +
				`L${-w * 0.16},${-h * 0.45} L${-w * 0.16},${-h * 0.6} ` +
				`L${-r},${-h * 0.6} A${r},${r * 1.05} 0 0 1 ${r},${-h * 0.6} ` +
				`L${w * 0.16},${-h * 0.6} L${w * 0.16},${-h * 0.45} L${w * 0.24},${-h * 0.45} ` +
				`L${w * 0.24},${-h * 0.27} L${-x},${-h * 0.27} L${-x},0 Z ` +
				`M${-3 * s},${-h * 0.6 - r * 1.0} L${-3 * s},${-h} L${3 * s},${-h} L${3 * s},${-h * 0.6 - r * 1.0} Z`
			);
		}
		case 'stantec':
			// tall tower with an angled crown and slim spire
			return (
				`M${x},0 L${x},${-h * 0.86} L${-x},${-h * 0.95} L${-x},0 Z ` +
				`M${w * 0.18},${-h * 0.93} L${w * 0.24},${-h} L${w * 0.3},${-h * 0.935} Z`
			);
		case 'epcor':
			return (
				`M${x},0 L${x},${-h * 0.82} L${x + w * 0.15},${-h * 0.82} L${x + w * 0.15},${-h * 0.9} ` +
				`L${-x - w * 0.15},${-h * 0.9} L${-x - w * 0.15},${-h * 0.82} L${-x},${-h * 0.82} L${-x},0 Z ` +
				`M${-1.5 * s},${-h * 0.9} L0,${-h} L${1.5 * s},${-h * 0.9} Z`
			);
		case 'bridge': {
			// deck on a row of steel truss piers
			const deckTop = -h;
			const deck = 9 * hs;
			let d = `M${x},${deckTop} L${-x},${deckTop} L${-x},${deckTop + deck} L${x},${deckTop + deck} Z`;
			const piers = 7;
			for (let i = 0; i < piers; i++) {
				const px = x + (w * (i + 0.5)) / piers;
				const pw = 10 * s;
				d += ` M${px - pw},${deckTop + deck} L${px - pw * 0.4},0 L${px + pw * 0.4},0 L${px + pw},${deckTop + deck} Z`;
			}
			return d;
		}
		default: {
			const step = b.h > 150 ? h * 0.06 : 0;
			return (
				`M${x},0 L${x},${-h + step} L${x + w * 0.2},${-h + step} L${x + w * 0.2},${-h} ` +
				`L${-x - w * 0.2},${-h} L${-x - w * 0.2},${-h + step} L${-x},${-h + step} L${-x},0 Z`
			);
		}
	}
};

/**
 * Coconut palms that rise from the bottom edge and morph into Edmonton's skyline.
 * Mounted in <Sequence from={T.palms}> (frame 225), so frame 0 here = 225.
 *  - 0–15  (abs 225–240): palm row springs up, staggered from the edges inward
 *  - 17+   (abs 242+):    centre palms sink and fade while buildings grow in their place,
 *                         rippling outward from the centre; edge palms stay to frame the city
 *  - 30+:  a few windows light up
 */
export const Skyline: React.FC<{colors: Palette}> = ({colors}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {width, skylineHeight, vertical, u} = useLayout();

	const svgH = skylineHeight + 40 * u;
	const base = svgH;
	const span = vertical ? [0.1, 0.9] : [0.17, 0.83];
	const spanPx = (span[1] - span[0]) * width;
	const ws = Math.min(1, Math.max(0.6, spanPx / 1150)) * u;
	const hs = (vertical ? 1.2 : 0.95) * u;
	const morphAt = T.skylineMorph - T.palms;

	const palms = useMemo(() => {
		const edge = vertical ? [0.04, 0.96] : [0.035, 0.085, 0.915, 0.965];
		const centre = vertical
			? [0.22, 0.36, 0.5, 0.64, 0.78]
			: [0.2, 0.28, 0.36, 0.44, 0.52, 0.6, 0.68, 0.76];
		return [
			...edge.map((fx) => ({fx, keep: true})),
			...centre.map((fx) => ({fx, keep: false})),
		].map((p, i) => ({
			...p,
			h: (p.keep ? 190 : 150) * hs * (0.85 + random(`palm-h-${i}`) * 0.3),
			lean: (random(`palm-l-${i}`) - 0.5) * 60 * u + (p.fx < 0.5 ? 12 : -12) * u,
			distFromCentre: Math.abs(p.fx - 0.5),
		}));
	}, [vertical, hs, u]);

	const sil = `color-mix(in srgb, ${colors.background} 70%, #000)`;
	const silTop = `color-mix(in srgb, ${colors.background} 62%, ${colors.teal})`;
	const palmFill = `color-mix(in srgb, ${colors.green} 30%, #050a14)`;

	return (
		<AbsoluteFill>
			<svg
				width={width}
				height={svgH}
				style={{position: 'absolute', left: 0, bottom: 0, overflow: 'visible'}}
			>
				<defs>
					<linearGradient id="sky-sil" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" style={{stopColor: silTop}} />
						<stop offset="100%" style={{stopColor: sil}} />
					</linearGradient>
					<linearGradient id="sky-ground" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" style={{stopColor: alpha(colors.background, 0)}} />
						<stop offset="100%" style={{stopColor: '#03050f'}} />
					</linearGradient>
				</defs>

				{/* buildings (soft gold rim glow) */}
				{BUILDINGS.map((b, i) => {
					const dist = Math.abs(b.fx - 0.5);
					const g = spring({
						frame: frame - morphAt - 3 - dist * 26,
						fps,
						config: {damping: 14, stiffness: 110},
					});
					if (g <= 0.001) return null;
					const x = (span[0] + b.fx * (span[1] - span[0])) * width;
					const lit = interpolate(frame, [morphAt + 14 + dist * 26, morphAt + 26 + dist * 26], [0, 1], clamp);
					const isTower = b.kind === 'tower' || b.kind === 'stantec' || b.kind === 'epcor';
					const bw = b.w * ws;
					const bh = b.h * hs;
					return (
						<g key={i} transform={`translate(${x} ${base}) scale(1 ${g})`}>
							<path
								d={buildingPath(b, ws, hs)}
								fill="url(#sky-sil)"
								stroke={alpha(colors.gold, 0.85)}
								strokeWidth={1.6 * u}
								strokeLinejoin="round"
							/>
							{isTower
								? new Array(Math.floor(bh / (16 * u))).fill(0).flatMap((_, r) =>
										new Array(Math.max(1, Math.floor(bw / (12 * u)))).fill(0).map((__, c) => {
											if (random(`win-${i}-${r}-${c}`) < 0.7) return null;
											const cols = Math.max(1, Math.floor(bw / (12 * u)));
											const wx = -bw / 2 + ((c + 0.5) * bw) / cols - 2 * u;
											const wy = -bh * 0.78 + r * 16 * u;
											if (wy > -10 * u) return null;
											return (
												<rect
													key={`${r}-${c}`}
													x={wx}
													y={wy}
													width={4 * u}
													height={6 * u}
													fill={colors.marigold}
													opacity={0.85 * lit}
												/>
											);
										}),
									)
								: null}
						</g>
					);
				})}

				{/* palms */}
				{palms.map((p, i) => {
					const rise = spring({
						frame: frame - (0.5 - p.distFromCentre) * 22,
						fps,
						config: {damping: 13, stiffness: 100},
					});
					const morph = p.keep
						? 0
						: spring({
								frame: frame - morphAt - p.distFromCentre * 26,
								fps,
								config: {damping: 15, stiffness: 100},
							});
					if (morph > 0.995) return null;
					const x = p.fx * width;
					const y = base + (1 - rise) * p.h * 1.3 + morph * p.h * 0.5;
					return (
						<g
							key={i}
							transform={`translate(${x} ${y}) scale(${1 - morph * 0.3} ${1 - morph * 0.7})`}
							opacity={1 - morph}
						>
							<path d={palmPath(p.h, p.lean, u)} fill={palmFill} stroke={alpha(colors.green, 0.5)} strokeWidth={0.8 * u} />
						</g>
					);
				})}

				{/* ground band */}
				<rect
					x={0}
					y={base - 22 * u}
					width={width}
					height={22 * u}
					fill="url(#sky-ground)"
					opacity={interpolate(frame, [0, 12], [0, 1], clamp)}
				/>
			</svg>
		</AbsoluteFill>
	);
};
