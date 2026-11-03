import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {balanceLines} from '../../lib/layout';
import {alpha, clamp} from '../../lib/utils';
import {dmSerif, montserrat} from '../fonts';
import {useSunriseLayout} from '../layout';
import {SR} from '../timeline';
import type {SunrisePalette} from '../schema';

/**
 * Frosted-glass title card over the prairie.
 * Mounted in <Sequence from={SR.card}> (frame 180), so frame 0 here = 180.
 *  - 0+     card springs up and fades in
 *  - 8+     (abs 188) title words rise through a mask, 5 frames apart
 *  - 26+    (abs 206) vermilion-to-gold brush underline sweeps out
 *  - 30+    (abs 210) tagline tracks in from very wide letter spacing; first word highlighted
 *  - 56–82  (abs 236–262) light glint sweeps across the card
 */
export const TitleCard: React.FC<{colors: SunrisePalette; title: string; tagline: string}> = ({
	colors,
	title,
	tagline,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {width, cardTop, cardWidth, titleSize, taglineSize, vertical, u} = useSunriseLayout();

	const rel = (abs: number) => abs - SR.card;
	const card = spring({frame, fps, config: {damping: 16, stiffness: 110}});
	const titleLines = balanceLines(title, vertical ? 2 : 1);
	const tagLines = balanceLines(tagline.toUpperCase(), vertical ? 2 : 1);

	const underline = interpolate(frame, [rel(SR.underline), rel(SR.underline) + 22], [0, 1], {
		...clamp,
		easing: Easing.out(Easing.cubic),
	});
	const track = spring({frame: frame - rel(SR.tagline), fps, config: {damping: 20, stiffness: 60}});
	const glint = interpolate(frame, [rel(SR.glint[0]), rel(SR.glint[1])], [-0.4, 1.4], {
		...clamp,
		easing: Easing.inOut(Easing.quad),
	});

	let wordIndex = 0;
	const pad = (vertical ? 46 : 38) * u;

	return (
		<AbsoluteFill>
			<div
				style={{
					position: 'absolute',
					top: cardTop,
					left: (width - cardWidth) / 2,
					width: cardWidth,
					padding: `${pad}px ${pad * 0.8}px ${pad * 1.05}px`,
					boxSizing: 'border-box',
					borderRadius: 30 * u,
					backgroundColor: alpha(colors.cream, 0.74),
					backdropFilter: `blur(${16 * u}px) saturate(1.2)`,
					border: `${1.5 * u}px solid ${alpha('#FFFFFF', 0.75)}`,
					boxShadow: `0 ${18 * u}px ${50 * u}px ${alpha(colors.ink, 0.22)}`,
					opacity: interpolate(card, [0, 0.4], [0, 1], clamp),
					transform: `translateY(${(1 - card) * 60 * u}px)`,
					textAlign: 'center',
					overflow: 'hidden',
				}}
			>
				{/* title: each word rises through its own mask */}
				<div
					style={{
						fontFamily: dmSerif,
						fontSize: titleSize,
						lineHeight: 1.12,
						color: colors.ink,
					}}
				>
					{titleLines.map((words, li) => (
						<div key={li} style={{whiteSpace: 'nowrap'}}>
							{words.map((w, wi) => {
								const i = wordIndex++;
								const s = spring({
									frame: frame - rel(SR.title) - i * SR.wordStagger,
									fps,
									config: {damping: 15, stiffness: 120},
								});
								return (
									<span
										key={wi}
										style={{
											display: 'inline-block',
											overflow: 'hidden',
											verticalAlign: 'bottom',
											padding: `0 ${0.12 * titleSize}px ${0.08 * titleSize}px`,
										}}
									>
										<span style={{display: 'inline-block', transform: `translateY(${(1 - s) * 115}%)`}}>{w}</span>
									</span>
								);
							})}
						</div>
					))}
				</div>

				{/* brush underline */}
				<div
					style={{
						margin: `${14 * u}px auto ${18 * u}px`,
						width: `${underline * (vertical ? 62 : 46)}%`,
						height: 6 * u,
						borderRadius: 6 * u,
						background: `linear-gradient(90deg, ${colors.accent}, ${colors.sun})`,
					}}
				/>

				{/* tagline: letter-spacing tracks in */}
				<div
					style={{
						fontFamily: montserrat,
						fontWeight: 600,
						fontSize: taglineSize,
						lineHeight: 1.6,
						color: colors.water,
						letterSpacing: `${0.2 + (1 - track) * 0.25}em`,
						opacity: interpolate(track, [0, 0.5], [0, 1], clamp),
						whiteSpace: 'nowrap',
					}}
				>
					{tagLines.map((words, li) => (
						<div key={li}>
							{words.map((w, wi) => (
								<span key={wi} style={li === 0 && wi === 0 ? {color: colors.accent} : undefined}>
									{w}
									{wi < words.length - 1 ? ' ' : ''}
								</span>
							))}
						</div>
					))}
				</div>

				{/* glint */}
				<div
					style={{
						position: 'absolute',
						top: '-30%',
						left: `${glint * 100}%`,
						width: '18%',
						height: '160%',
						transform: 'rotate(20deg)',
						background: `linear-gradient(90deg, transparent, ${alpha('#FFFFFF', 0.65)}, transparent)`,
						pointerEvents: 'none',
					}}
				/>
			</div>
		</AbsoluteFill>
	);
};
