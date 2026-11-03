import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, useCurrentFrame, useVideoConfig} from 'remotion';
import {getStaticFiles} from '@remotion/studio';
import {Background} from './components/Background';
import {ConnectionNetwork} from './components/ConnectionNetwork';
import {FallingPetals} from './components/FallingPetals';
import {GoldLine} from './components/GoldLine';
import {KasavuFrame} from './components/KasavuFrame';
import {LogoReveal} from './components/LogoReveal';
import {Particles} from './components/Particles';
import {Pookalam} from './components/Pookalam';
import {Skyline} from './components/Skyline';
import {Tagline} from './components/Tagline';
import {TitleText} from './components/TitleText';
import {clamp, resolveAsset} from './lib/utils';
import type {SemaIntroProps} from './schema';
import {DURATION, T} from './timeline';
import './fonts';

/** Music is optional: only mounted when the file exists in public/ (or is a URL). */
const hasMusic = (src: string) => {
	if (!src) return false;
	if (/^(https?:|data:)/.test(src)) return true;
	return getStaticFiles().some((f) => f.name === src.replace(/^\//, ''));
};

export const SemaIntro: React.FC<SemaIntroProps> = ({title, tagline, logoSrc, musicSrc, colors}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// 9–10s: whole frame fades to indigo on the last 10 frames
	const fadeToIndigo = interpolate(frame, T.fadeOut, [0, 1], clamp);

	return (
		<AbsoluteFill style={{backgroundColor: colors.background, overflow: 'hidden'}}>
			{/* 0–10s (0–300): indigo base + nilavilakku glow, swells with the logo and breathes at 9s */}
			<Sequence name="Background" durationInFrames={DURATION}>
				<Background colors={colors} />
			</Sequence>

			{/* 0–10s (0–300): seeded gold dust drifting upward */}
			<Sequence name="Particles" durationInFrames={DURATION}>
				<Particles colors={colors} />
			</Sequence>

			{/* 0–3s (0–90): kasavu gold line draws across the centre (6–40), fades as the mandala blooms */}
			<Sequence name="Gold line" from={T.intro} durationInFrames={90}>
				<GoldLine colors={colors} />
			</Sequence>

			{/* 1.5–10s (45–300): pookalam blooms (45–105), then contracts into a petal crown (105+) */}
			<Sequence name="Pookalam" from={T.pookalam}>
				<Pookalam colors={colors} />
			</Sequence>

			{/* 5.2–10s (186–300): light points + gold threads form a community network */}
			<Sequence name="Connection network" from={T.network}>
				<ConnectionNetwork colors={colors} />
			</Sequence>

			{/* 3.5–10s (105–300): gold ring (105–137), logo spring (112+), shimmer (140–166), breath (270–296) */}
			<Sequence name="Logo reveal" from={T.contract}>
				<LogoReveal colors={colors} logoSrc={logoSrc} />
			</Sequence>

			{/* 5.5–10s (165–300): association name, letter by letter, + kasavu divider */}
			<Sequence name="Title" from={T.title}>
				<TitleText colors={colors} title={title} />
			</Sequence>

			{/* 6.4–10s (192–300): tagline word by word, blur → sharp; "Connecting" shimmers gold */}
			<Sequence name="Tagline" from={T.tagline}>
				<Tagline colors={colors} tagline={tagline} />
			</Sequence>

			{/* 7.5–10s (225–300): palms rise (225–240) and morph into the Edmonton skyline (242+) */}
			<Sequence name="Skyline" from={T.palms}>
				<Skyline colors={colors} />
			</Sequence>

			{/* 7.6–10s (228–300): colourful petals drift down */}
			<Sequence name="Falling petals" from={T.petals}>
				<FallingPetals colors={colors} />
			</Sequence>

			{/* 7.5–10s (225–300): kasavu border draws around the frame (225–255), corner lotuses (247+) */}
			<Sequence name="Kasavu frame" from={T.frame}>
				<KasavuFrame colors={colors} />
			</Sequence>

			{/* 9.67–10s (290–300): fade to indigo */}
			<AbsoluteFill style={{backgroundColor: colors.background, opacity: fadeToIndigo}} />

			{/* Optional music: fade in over 0.5s, out over the last 1s */}
			{hasMusic(musicSrc) ? (
				<Audio
					src={resolveAsset(musicSrc)}
					volume={(f) =>
						interpolate(f, [0, 0.5 * fps, DURATION - fps, DURATION], [0, 1, 1, 0], clamp)
					}
				/>
			) : null}
		</AbsoluteFill>
	);
};
