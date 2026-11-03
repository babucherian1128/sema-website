import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {alpha, clamp} from '../../lib/utils';
import {useSwirlLayout} from '../layout';
import {SW} from '../timeline';
import type {SwirlPalette} from '../schema';

/**
 * Luminous gold backdrop with heavy olive vignette, a slow push-in, and a soft
 * light leak that drifts across after the flash.
 * Mounted for the full timeline (0–360).
 */
export const Backdrop: React.FC<{colors: SwirlPalette}> = ({colors}) => {
	const frame = useCurrentFrame();
	const {cx, cy, width, height} = useSwirlLayout();
	const push = interpolate(frame, [0, 360], [1.08, 1], clamp);
	const big = Math.max(width, height);

	const leakX = interpolate(frame, [SW.logo, 360], [width * 1.05, width * 0.55], clamp);
	const leak = interpolate(frame, [SW.logo + 5, SW.logo + 35, 330, 360], [0, 0.5, 0.35, 0.2], clamp);

	return (
		<AbsoluteFill style={{backgroundColor: colors.bgEdge}}>
			<AbsoluteFill
				style={{
					transform: `scale(${push})`,
					background: `radial-gradient(circle ${big * 0.85}px at ${cx}px ${cy}px,
						color-mix(in srgb, ${colors.bgCenter} 85%, #fff) 0%,
						${colors.bgCenter} 30%,
						color-mix(in srgb, ${colors.bgCenter} 55%, ${colors.bgEdge}) 62%,
						${colors.bgEdge} 100%)`,
				}}
			/>
			{/* drifting light leak after the reveal */}
			<AbsoluteFill
				style={{
					opacity: leak,
					background: `radial-gradient(ellipse ${big * 0.45}px ${big * 0.6}px at ${leakX}px ${height * 0.35}px, ${alpha('#FFFFFF', 0.55)} 0%, ${alpha('#B9A6FF', 0.18)} 45%, transparent 100%)`,
				}}
			/>
		</AbsoluteFill>
	);
};
