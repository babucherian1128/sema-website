import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {playfair} from '../fonts';
import {balanceLines, useLayout} from '../lib/layout';
import {alpha, clamp} from '../lib/utils';
import {T} from '../timeline';
import type {Palette} from '../schema';

/**
 * "South Edmonton Malayalee Association", letter by letter in gold Playfair Display.
 * Mounted in <Sequence from={T.title}> (frame 165), so frame 0 here = 165.
 * One line in 16:9, two balanced lines in 9:16. A small kasavu divider draws beneath.
 */
export const TitleText: React.FC<{colors: Palette; title: string}> = ({colors, title}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {width, titleTop, titleSize, vertical, textMaxWidth, u} = useLayout();

	const lines = balanceLines(title, vertical ? 2 : 1).map((l) => l.join(' '));
	let charIndex = 0;
	const totalChars = title.replace(/\s+/g, '').length;
	const lineHeight = titleSize * 1.18;

	// divider draws once most letters are in
	const dividerStart = totalChars * T.letterStagger * 0.6;
	const divider = interpolate(frame, [dividerStart, dividerStart + 20], [0, 1], {
		...clamp,
		easing: Easing.out(Easing.cubic),
	});
	const dividerW = Math.min(textMaxWidth, 520 * u) * divider;

	return (
		<AbsoluteFill>
			<div
				style={{
					position: 'absolute',
					top: titleTop,
					left: 0,
					width,
					textAlign: 'center',
					fontFamily: playfair,
					fontWeight: 700,
					fontSize: titleSize,
					lineHeight: `${lineHeight}px`,
					letterSpacing: 0.5 * u,
					color: colors.gold,
					textShadow: `0 0 ${18 * u}px ${alpha(colors.gold, 0.45)}, 0 ${2 * u}px ${4 * u}px rgba(0,0,0,0.5)`,
				}}
			>
				{lines.map((line, li) => (
					<div key={li} style={{whiteSpace: 'nowrap'}}>
						{line.split('').map((ch, ci) => {
							if (ch === ' ') return <span key={ci}>&nbsp;</span>;
							const i = charIndex++;
							const s = spring({
								frame: frame - i * T.letterStagger,
								fps,
								config: {damping: 14, stiffness: 150},
							});
							return (
								<span
									key={ci}
									style={{
										display: 'inline-block',
										opacity: interpolate(s, [0, 0.5], [0, 1], clamp),
										transform: `translateY(${(1 - s) * 26 * u}px) scale(${0.85 + 0.15 * s})`,
									}}
								>
									{ch}
								</span>
							);
						})}
					</div>
				))}
			</div>

			{/* kasavu divider: two gold lines with a diamond */}
			<div
				style={{
					position: 'absolute',
					top: titleTop + lines.length * lineHeight + 10 * u,
					left: (width - dividerW) / 2,
					width: dividerW,
					height: 6 * u,
				}}
			>
				<div
					style={{
						position: 'absolute',
						top: 0,
						width: '100%',
						height: 2 * u,
						background: `linear-gradient(90deg, transparent, ${colors.gold} 30%, ${colors.gold} 70%, transparent)`,
					}}
				/>
				<div
					style={{
						position: 'absolute',
						top: 5 * u,
						left: '20%',
						width: '60%',
						height: 1 * u,
						background: `linear-gradient(90deg, transparent, ${alpha(colors.gold, 0.7)}, transparent)`,
					}}
				/>
				<div
					style={{
						position: 'absolute',
						left: '50%',
						top: -4 * u,
						width: 10 * u,
						height: 10 * u,
						marginLeft: -5 * u,
						backgroundColor: colors.marigold,
						transform: `rotate(45deg) scale(${divider})`,
						boxShadow: `0 0 ${10 * u}px ${colors.marigold}`,
					}}
				/>
			</div>
		</AbsoluteFill>
	);
};
