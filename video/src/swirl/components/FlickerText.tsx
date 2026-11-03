import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame} from 'remotion';
import {balanceLines} from '../../lib/layout';
import {clamp} from '../../lib/utils';
import {montserrat} from '../../sunrise/fonts';
import {useSwirlLayout} from '../layout';
import {SW} from '../timeline';
import type {SwirlPalette} from '../schema';

/**
 * Name and tagline in caps under the logo. Each letter switches on at its own
 * seeded random moment inside a 1 s window, flickering and de-blurring for a
 * few frames, so the words assemble out of scattered letters.
 * Mounted in <Sequence from={SW.title}> (frame 248); the tagline starts 14 frames later.
 */
const FlickerLine: React.FC<{text: string; start: number; seed: string; size: number; weight: number}> = ({
	text,
	start,
	seed,
	size,
	weight,
}) => {
	const frame = useCurrentFrame();
	return (
		<div style={{fontSize: size, fontWeight: weight, whiteSpace: 'nowrap'}}>
			{text.split('').map((ch, i) => {
				if (ch === ' ') return <span key={i}> </span>;
				const at = start + random(`${seed}-${i}`) * SW.letterWindow;
				const t = frame - at;
				let opacity = 0;
				let blur = 0;
				if (t >= 0) {
					const settling = t < 7;
					const flicker = settling && random(`${seed}-${i}-f${frame}`) < 0.35 ? 0.25 : 1;
					opacity = interpolate(t, [0, 7], [0.4, 1], clamp) * flicker;
					blur = Math.max(0, 7 - t) * 0.9 * (size / 40);
				}
				return (
					<span key={i} style={{opacity, filter: blur > 0 ? `blur(${blur}px)` : undefined}}>
						{ch}
					</span>
				);
			})}
		</div>
	);
};

export const FlickerText: React.FC<{colors: SwirlPalette; title: string; tagline: string}> = ({
	colors,
	title,
	tagline,
}) => {
	const {width, textTop, titleSize, taglineSize, vertical, u} = useSwirlLayout();
	const lines = (t: string) => balanceLines(t.toUpperCase(), vertical ? 2 : 1).map((l) => l.join(' '));

	return (
		<AbsoluteFill>
			<div
				style={{
					position: 'absolute',
					top: textTop,
					left: 0,
					width,
					textAlign: 'center',
					fontFamily: montserrat,
					color: colors.text,
					letterSpacing: '0.07em',
					lineHeight: 1.3,
					textShadow: `0 ${2 * u}px ${10 * u}px rgba(40,28,0,0.55)`,
				}}
			>
				{lines(title).map((l, i) => (
					<FlickerLine key={`t${i}`} text={l} start={i * 4} seed={`tt${i}`} size={titleSize} weight={600} />
				))}
				<div style={{height: (vertical ? 14 : 6) * u}} />
				{lines(tagline).map((l, i) => (
					<FlickerLine
						key={`g${i}`}
						text={l}
						start={SW.tagline - SW.title + i * 4}
						seed={`tg${i}`}
						size={taglineSize}
						weight={500}
					/>
				))}
			</div>
		</AbsoluteFill>
	);
};
