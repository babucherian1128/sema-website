import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {clamp} from '../../lib/utils';
import {smoothstep, useGlassLayout} from '../layout';
import {GT} from '../timeline';
import {discCamera} from './GlassDisc';

/**
 * Soft contact shadow plus the long soft shadow the reference coin casts on the white
 * floor (down-left while it is close and tilted, swinging down-right as it settles).
 * Mounted for the full timeline (0–180), drawn beneath the coin.
 */
export const DiscShadow: React.FC = () => {
	const frame = useCurrentFrame();
	const {cx, cy, logoR: R, u} = useGlassLayout();
	const cam = discCamera(frame, R);
	const on = interpolate(frame, [GT.appear[0], GT.appear[1] + 6], [0, 1], clamp);
	// a tilted coin casts a longer, flatter shadow
	const flat = 1 - 0.55 * smoothstep(0, 80, cam.tilt);
	const s = cam.scale;
	const x = cx + cam.tx;
	const y = cy + cam.ty;
	// as in the reference, the long shadow trails down-left early on, then swings down-right
	const angle = 150 - 115 * smoothstep(30, 62, frame);

	return (
		<AbsoluteFill style={{opacity: on}}>
			{/* long shadow */}
			<div
				style={{
					position: 'absolute',
					left: x,
					top: y - R * s * 0.45 * flat,
					width: R * s * 2.4,
					height: R * s * 0.9 * flat,
					transformOrigin: '0% 50%',
					transform: `rotate(${angle}deg)`,
					borderRadius: '50%',
					background: 'linear-gradient(90deg, rgba(0,0,0,0.2), rgba(0,0,0,0.07) 55%, transparent)',
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
					background: 'radial-gradient(ellipse, rgba(0,0,0,0.26) 35%, rgba(0,0,0,0) 70%)',
					filter: `blur(${12 * u}px)`,
				}}
			/>
		</AbsoluteFill>
	);
};
