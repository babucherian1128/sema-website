import React from 'react';
import {AbsoluteFill, interpolate, interpolateColors, useCurrentFrame} from 'remotion';
import {alpha, clamp} from '../../lib/utils';
import {useSunriseLayout} from '../layout';
import {SR} from '../timeline';
import {sunPosition} from './Sun';
import type {SunrisePalette} from '../schema';

/**
 * Sky gradient that shifts from Kerala dawn (plum → coral) to Alberta morning
 * (blue → warm haze) during the wipe, plus a pre-dawn darkness that lifts in 1.7s.
 * Mounted for the full timeline (0–300).
 */
export const Sky: React.FC<{colors: SunrisePalette}> = ({colors}) => {
	const frame = useCurrentFrame();
	const layout = useSunriseLayout();
	const {horizon, height} = layout;
	const sun = sunPosition(frame, layout);

	const top = interpolateColors(frame, SR.skyShift, [colors.dawnTop, colors.dayTop]);
	const bottom = interpolateColors(frame, SR.skyShift, [colors.dawnBottom, colors.dayBottom]);
	const preDawn = interpolate(frame, [0, 50], [0.5, 0], clamp);

	return (
		<AbsoluteFill>
			<AbsoluteFill
				style={{
					background: `linear-gradient(180deg, ${top} 0%, ${bottom} ${(horizon / height) * 100}%, ${bottom} 100%)`,
				}}
			/>
			{/* warm bloom around the sun */}
			<AbsoluteFill
				style={{
					background: `radial-gradient(circle ${sun.r * 6}px at ${sun.x}px ${sun.y}px, ${alpha(colors.sun, 0.55)} 0%, ${alpha(colors.dawnBottom, 0.22)} 40%, transparent 100%)`,
				}}
			/>
			<AbsoluteFill style={{backgroundColor: colors.dawnTop, opacity: preDawn}} />
		</AbsoluteFill>
	);
};
