import React from 'react';
import {Composition, Folder} from 'remotion';
import {SemaIntro} from './SemaIntro';
import {defaultSemaIntroProps, semaIntroSchema} from './schema';
import {DURATION, FPS} from './timeline';

export const RemotionRoot: React.FC = () => {
	return (
		<Folder name="SEMA">
			{/* 16:9 — website hero, YouTube, Facebook */}
			<Composition
				id="SemaIntro"
				component={SemaIntro}
				durationInFrames={DURATION}
				fps={FPS}
				width={1920}
				height={1080}
				schema={semaIntroSchema}
				defaultProps={defaultSemaIntroProps}
			/>
			{/* 9:16 — Instagram Reels / Stories, TikTok, WhatsApp status. Same timeline, responsive layout. */}
			<Composition
				id="SemaIntroVertical"
				component={SemaIntro}
				durationInFrames={DURATION}
				fps={FPS}
				width={1080}
				height={1920}
				schema={semaIntroSchema}
				defaultProps={defaultSemaIntroProps}
			/>
		</Folder>
	);
};
