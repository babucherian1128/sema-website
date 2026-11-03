import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {balanceLines} from '../../lib/layout';
import {clamp} from '../../lib/utils';
import {montserratGlass} from '../fonts';
import {useGlassLayout} from '../layout';
import {GT} from '../timeline';
import type {GlassPalette} from '../schema';

/**
 * Title in dark extra-bold caps and the tagline in grey, each sharpening in from
 * large and blurred, as in the reference. Mounted for the full timeline; uses the
 * absolute frame.
 *  - 68–92:  title scales 1.6 → 1, blur → sharp, slides in from slightly left
 *  - 76–100: tagline scales 1.35 → 1, blur → sharp
 */
export const TitleBlock: React.FC<{colors: GlassPalette; title: string; tagline: string}> = ({
	colors,
	title,
	tagline,
}) => {
	const frame = useCurrentFrame();
	const {width, titleTop, titleSize, taglineSize, vertical, u} = useGlassLayout();
	const ease = {...clamp, easing: Easing.out(Easing.cubic)};

	const pt = interpolate(frame, GT.title, [0, 1], ease);
	const pg = interpolate(frame, GT.tagline, [0, 1], ease);
	const lines = (t: string) => balanceLines(t.toUpperCase(), vertical ? 2 : 1).map((l) => l.join(' '));

	return (
		<AbsoluteFill>
			<div
				style={{
					position: 'absolute',
					top: titleTop,
					left: 0,
					width,
					textAlign: 'center',
					fontFamily: montserratGlass,
				}}
			>
				<div
					style={{
						fontWeight: 800,
						fontSize: titleSize,
						lineHeight: 1.15,
						letterSpacing: '0.01em',
						color: colors.title,
						opacity: interpolate(pt, [0, 0.5], [0, 1], clamp),
						filter: pt < 0.999 ? `blur(${(1 - pt) * 16 * u}px)` : undefined,
						transform: `translateX(${(1 - pt) * -width * 0.04}px) scale(${1 + (1 - pt) * 0.6})`,
						transformOrigin: '50% 0%',
					}}
				>
					{lines(title).map((l, i) => (
						<div key={i} style={{whiteSpace: 'nowrap'}}>{l}</div>
					))}
				</div>
				<div
					style={{
						marginTop: (vertical ? 16 : 6) * u,
						fontWeight: 400,
						fontSize: taglineSize,
						lineHeight: 1.3,
						letterSpacing: '0.04em',
						color: colors.tagline,
						opacity: interpolate(pg, [0, 0.6], [0, 1], clamp),
						filter: pg < 0.999 ? `blur(${(1 - pg) * 12 * u}px)` : undefined,
						transform: `translateX(${(1 - pg) * -width * 0.03}px) scale(${1 + (1 - pg) * 0.35})`,
						transformOrigin: '50% 0%',
					}}
				>
					{lines(tagline).map((l, i) => (
						<div key={i} style={{whiteSpace: 'nowrap'}}>{l}</div>
					))}
				</div>
			</div>
		</AbsoluteFill>
	);
};
