import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {poppins} from '../fonts';
import {balanceLines, useLayout} from '../lib/layout';
import {alpha, clamp} from '../lib/utils';
import {T} from '../timeline';
import type {Palette} from '../schema';

/**
 * Tagline, word by word in white Poppins with a blur-to-sharp reveal.
 * Mounted in <Sequence from={T.tagline}> (frame 192), so frame 0 here = 192.
 * The first word ("Connecting") carries a slowly travelling gold gradient shimmer.
 */
export const Tagline: React.FC<{colors: Palette; tagline: string}> = ({colors, tagline}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {width, titleTop, titleSize, taglineSize, vertical, u} = useLayout();

	const titleLines = vertical ? 2 : 1;
	const top = titleTop + titleLines * titleSize * 1.18 + (vertical ? 52 : 40) * u;
	const lines = balanceLines(tagline, vertical ? 2 : 1);
	let wordIndex = 0;

	// shimmer position travels continuously across the gradient
	const shimmerPos = interpolate(frame, [0, 110], [140, -40]);

	return (
		<AbsoluteFill>
			<div
				style={{
					position: 'absolute',
					top,
					left: 0,
					width,
					textAlign: 'center',
					fontFamily: poppins,
					fontWeight: 300,
					fontSize: taglineSize,
					lineHeight: 1.45,
					letterSpacing: 1.5 * u,
					color: colors.text,
				}}
			>
				{lines.map((words, li) => (
					<div key={li} style={{whiteSpace: 'nowrap'}}>
						{words.map((word, wi) => {
							const i = wordIndex++;
							const s = spring({
								frame: frame - i * T.wordStagger,
								fps,
								config: {damping: 15, stiffness: 90},
							});
							const blur = Math.max(0, (1 - s) * 12 * u);
							const isHero = i === 0;
							return (
								<React.Fragment key={wi}>
									<span
										style={{
											display: 'inline-block',
											opacity: interpolate(s, [0, 0.6], [0, 1], clamp),
											filter: `blur(${blur}px)`,
											transform: `translateY(${(1 - s) * 14 * u}px)`,
											...(isHero
												? {
														fontWeight: 500,
														backgroundImage: `linear-gradient(100deg, ${colors.gold} 0%, ${colors.gold} 35%, #FFF6D6 50%, ${colors.marigold} 60%, ${colors.gold} 75%, ${colors.gold} 100%)`,
														backgroundSize: '250% 100%',
														backgroundPosition: `${shimmerPos}% 50%`,
														WebkitBackgroundClip: 'text',
														backgroundClip: 'text',
														color: 'transparent',
														textShadow: 'none',
													}
												: {
														textShadow: `0 0 ${12 * u}px ${alpha(colors.text, 0.25)}`,
													}),
										}}
									>
										{word}
									</span>
									{wi < words.length - 1 ? ' ' : null}
								</React.Fragment>
							);
						})}
					</div>
				))}
			</div>
		</AbsoluteFill>
	);
};
