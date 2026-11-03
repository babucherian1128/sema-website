import React from 'react';
import {alpha} from '../../lib/utils';
import type {SunrisePalette} from '../schema';

/**
 * Chundan vallam (Kerala snake boat), drawn facing right, origin at the waterline centre.
 * Long low hull with the tall curved stern on the left, a crew of rowers stroking
 * in unison, and three muthukuda (ornamental umbrellas) like the ones in the SEMA logo.
 * Pure function of `frame` so it can be reused for the reflection.
 */
export const SnakeBoat: React.FC<{frame: number; colors: SunrisePalette; scale: number}> = ({
	frame,
	colors,
	scale,
}) => {
	const hull = '#2A1220';
	// rowing cycle: ~1.1 strokes per second, every oar in sync
	const stroke = Math.sin(frame * 0.24);
	const rowers = 24;

	return (
		<g transform={`scale(${scale})`}>
			{/* wake behind the stern */}
			{[0, 1, 2].map((k) => (
				<path
					key={`w${k}`}
					d={`M${-330 - k * 60},${6 + k * 4} Q${-300 - k * 50},${2} ${-270},${4}`}
					stroke={alpha('#FFFFFF', 0.45 - k * 0.12)}
					strokeWidth={2}
					fill="none"
				/>
			))}

			{/* oars (behind the hull) */}
			{new Array(rowers).fill(0).map((_, i) => {
				const x = -215 + i * 19.5;
				const tipX = x - 6 - stroke * 16;
				const tipY = 24 + Math.max(0, -stroke) * 6;
				return (
					<g key={`o${i}`}>
						<line x1={x} y1={-16} x2={tipX} y2={tipY} stroke={hull} strokeWidth={2} />
						<ellipse cx={tipX} cy={tipY} rx={2.6} ry={5} fill={hull} transform={`rotate(${-20 - stroke * 15} ${tipX} ${tipY})`} />
						{stroke < -0.6 ? (
							<circle cx={tipX - 4} cy={tipY - 2} r={2.2 + (-stroke - 0.6) * 4} fill={alpha('#FFFFFF', 0.7)} />
						) : null}
					</g>
				);
			})}

			{/* hull: tall curved stern on the left, long low bow to the right */}
			<path
				d="M-318,-128 C-322,-96 -300,-28 -246,-12 L262,-9 Q300,-10 330,-20 L318,-3 Q40,10 -250,6 C-306,2 -334,-80 -326,-130 Z"
				fill={hull}
			/>
			{/* gold gunwale trim */}
			<path
				d="M-318,-128 C-322,-96 -300,-28 -246,-12 L262,-9 Q300,-10 330,-20"
				fill="none"
				stroke={colors.sun}
				strokeWidth={2.4}
			/>
			{/* stern ornament + pennant */}
			<circle cx={-322} cy={-131} r={5} fill={colors.sun} />
			<path d="M-322,-134 L-322,-168 L-296,-160 L-322,-152" fill={colors.accent} stroke={hull} strokeWidth={1.5} />

			{/* rowers, bobbing with the stroke */}
			{new Array(rowers).fill(0).map((_, i) => {
				const x = -215 + i * 19.5;
				const lean = stroke * 3;
				return (
					<g key={`r${i}`} transform={`translate(${x + lean} ${-12 - Math.abs(stroke) * 1.5})`}>
						<rect x={-4} y={-15} width={8} height={14} rx={3} fill={hull} />
						<circle cx={0} cy={-19} r={4.3} fill={hull} />
						<rect x={-4.5} y={-21} width={9} height={2} fill={alpha('#FFFFFF', 0.85)} />
					</g>
				);
			})}

			{/* muthukuda umbrellas */}
			{[-70, 10, 90].map((ux, k) => (
				<g key={`u${k}`} transform={`translate(${ux} 0)`}>
					<line x1={0} y1={-14} x2={0} y2={-66} stroke={hull} strokeWidth={2.4} />
					<path d="M-26,-62 Q0,-92 26,-62 Z" fill={k === 1 ? colors.sun : colors.accent} stroke={colors.sun} strokeWidth={1.4} />
					{[-20, -10, 0, 10, 20].map((tx) => (
						<line key={tx} x1={tx} y1={-62} x2={tx} y2={-55} stroke={colors.sun} strokeWidth={1.4} />
					))}
					<circle cx={0} cy={-84} r={3} fill={colors.sun} />
				</g>
			))}
		</g>
	);
};
