import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {clamp} from '../../lib/utils';
import {smoothstep, useGlassLayout} from '../layout';
import {GT} from '../timeline';
import {discCamera} from './GlassDisc';

/**
 * Soft contact shadow plus the long diagonal shadow toward the lower right that the
 * reference coin casts on the white floor. Follows the coin's camera move.
 * Mounted for the full timeline (0–180), drawn beneath the coin.
 */
export const DiscShadow: React.FC = () => {
	const frame = useCurrentFrame();
	const {cx, cy, logoR: R, height, u} = useGlassLayout();
	const cam = discCamera(frame, height);
	const on = interpolate(frame, [GT.discIn[0] + 4, GT.discIn[1]], [0, 1], clamp);
	// a tilted coin casts a longer, flatter shadow
	const flat = 1 - 0.55 * smoothstep(0, 78, cam.tilt);
	const s = cam.scale;
	const x = cx;
	const y = cy + cam.ty;

	return (
		<AbsoluteFill style={{opacity: on}}>
			{/* long diagonal shadow */}
			<div
				style={{
					position: 'absolute',
					left: x,
					top: y - R * s * 0.45 * flat,
					width: R * s * 2.6,
					height: R * s * 0.9 * flat,
					transformOrigin: '0% 50%',
					transform: 'rotate(34deg)',
					borderRadius: '50%',
					background: 'linear-gradient(90deg, rgba(0,0,0,0.22), rgba(0,0,0,0.08) 55%, transparent)',
					filter: `blur(${22 * u}px)`,
				}}
			/>
			{/* contact shadow */}
			<div
				style={{
					position: 'absolute',
					left: x - R * s * 1.05,
					top: y - R * s * 0.95 * flat + R * s * 0.12,
					width: R * s * 2.1,
					height: R * s * 2 * flat,
					borderRadius: '50%',
					background: 'radial-gradient(ellipse, rgba(0,0,0,0.28) 35%, rgba(0,0,0,0) 70%)',
					filter: `blur(${12 * u}px)`,
				}}
			/>
		</AbsoluteFill>
	);
};
