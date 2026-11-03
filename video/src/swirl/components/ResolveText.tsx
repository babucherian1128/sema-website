import React from 'react';
import {AbsoluteFill, Easing, interpolate, random, useCurrentFrame} from 'remotion';
import {balanceLines} from '../../lib/layout';
import {clamp} from '../../lib/utils';
import {montserrat} from '../../sunrise/fonts';
import {useSwirlLayout} from '../layout';
import {SW} from '../timeline';
import type {SwirlPalette} from '../schema';

/**
 * Name and tagline in caps under the logo, matching the reference: every letter
 * appears once at its own seeded random moment, blurred, and sharpens into place.
 * Letters never blink. Opacity and blur only ever move one way, so there's no flicker.
 * Mounted in <Sequence from={SW.title}>; the tagline starts SW.tagline - SW.title frames later.
 */
const ResolveLine: React.FC<{text: string; start: number; seed: string; size: number; weight: number}> = ({
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
				const t = frame - (start + random(`${seed}-${i}`) * SW.letterWindow);
				const opacity = interpolate(t, [0, 10], [0, 1], {...clamp, easing: Easing.out(Easing.quad)});
				const blur = interpolate(t, [0, 16], [size * 0.28, 0], {...clamp, easing: Easing.out(Easing.quad)});
				return (
					<span key={i} style={{opacity, filter: blur > 0.05 ? `blur(${blur}px)` : undefined}}>
						{ch}
					</span>
				);
			})}
		</div>
	);
};

export const ResolveText: React.FC<{colors: SwirlPalette; title: string; tagline: string}> = ({
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
					<ResolveLine key={`t${i}`} text={l} start={i * 4} seed={`tt${i}`} size={titleSize} weight={600} />
				))}
				<div style={{height: (vertical ? 14 : 4) * u}} />
				{lines(tagline).map((l, i) => (
					<ResolveLine
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
