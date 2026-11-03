import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {useLayout} from '../lib/layout';
import {alpha, clamp} from '../lib/utils';
import {T} from '../timeline';
import type {Palette} from '../schema';

/** Thin kasavu gold line that draws outward from the centre (frames 6–40). */
export const GoldLine: React.FC<{colors: Palette}> = ({colors}) => {
	const frame = useCurrentFrame();
	const {width, cy, u} = useLayout();

	const draw = interpolate(frame, T.goldLineDraw, [0, 1], {
		...clamp,
		easing: Easing.inOut(Easing.cubic),
	});
	const fade = interpolate(frame, T.goldLineFade, [1, 0], clamp);
	const w = draw * width * 0.7;
	const h = 2 * u;

	return (
		<AbsoluteFill style={{opacity: fade}}>
			<div
				style={{
					position: 'absolute',
					left: (width - w) / 2,
					top: cy - h / 2,
					width: w,
					height: h,
					background: `linear-gradient(90deg, transparent, ${colors.gold} 25%, #FFF3C4 50%, ${colors.gold} 75%, transparent)`,
					boxShadow: `0 0 ${14 * u}px ${alpha(colors.gold, 0.7)}`,
				}}
			/>
			{/* a second hair-thin line underneath, like the double kasavu stripe */}
			<div
				style={{
					position: 'absolute',
					left: (width - w * 0.8) / 2,
					top: cy + 7 * u,
					width: w * 0.8,
					height: 1 * u,
					background: `linear-gradient(90deg, transparent, ${alpha(colors.gold, 0.7)} 50%, transparent)`,
				}}
			/>
			{/* bright spark at the centre */}
			<div
				style={{
					position: 'absolute',
					left: width / 2 - 40 * u,
					top: cy - 40 * u,
					width: 80 * u,
					height: 80 * u,
					borderRadius: '50%',
					background: `radial-gradient(circle, ${alpha('#FFF3C4', 0.9 * draw)} 0%, ${alpha(colors.gold, 0.25 * draw)} 30%, transparent 70%)`,
				}}
			/>
		</AbsoluteFill>
	);
};
