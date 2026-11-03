import React from 'react';
import {Composition, Folder} from 'remotion';
import {SemaIntro} from './SemaIntro';
import {defaultSemaIntroProps, semaIntroSchema} from './schema';
import {DURATION, FPS} from './timeline';
import {SemaSunrise} from './sunrise/SemaSunrise';
import {defaultSunriseProps, sunriseSchema} from './sunrise/schema';
import {SemaSwirl} from './swirl/SemaSwirl';
import {defaultSwirlProps, swirlSchema} from './swirl/schema';
import {SWIRL_DURATION} from './swirl/timeline';
import {SemaGlass} from './glass/SemaGlass';
import {defaultGlassProps, glassSchema} from './glass/schema';
import {GLASS_DURATION} from './glass/timeline';

export const RemotionRoot: React.FC = () => {
	return (
		<>
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
			{/* Theme 2: "Two Homes, One Sunrise" — Kerala backwaters → Alberta prairie */}
			<Folder name="SEMA-Sunrise">
				<Composition
					id="SemaSunrise"
					component={SemaSunrise}
					durationInFrames={DURATION}
					fps={FPS}
					width={1920}
					height={1080}
					schema={sunriseSchema}
					defaultProps={defaultSunriseProps}
				/>
				<Composition
					id="SemaSunriseVertical"
					component={SemaSunrise}
					durationInFrames={DURATION}
					fps={FPS}
					width={1080}
					height={1920}
					schema={sunriseSchema}
					defaultProps={defaultSunriseProps}
				/>
			</Folder>
			{/* Theme 3: particle swirl → flash → logo reveal (12 s) */}
			<Folder name="SEMA-Swirl">
				<Composition
					id="SemaSwirl"
					component={SemaSwirl}
					durationInFrames={SWIRL_DURATION}
					fps={FPS}
					width={1920}
					height={1080}
					schema={swirlSchema}
					defaultProps={defaultSwirlProps}
				/>
				<Composition
					id="SemaSwirlVertical"
					component={SemaSwirl}
					durationInFrames={SWIRL_DURATION}
					fps={FPS}
					width={1080}
					height={1920}
					schema={swirlSchema}
					defaultProps={defaultSwirlProps}
				/>
			</Folder>
			{/* Theme 4: 3D glass coin reveal on white (6 s) */}
			<Folder name="SEMA-Glass">
				{/* 2688x768 ultra-wide, same as the reference (LED wall / banner) */}
				<Composition
					id="SemaGlassWide"
					component={SemaGlass}
					durationInFrames={GLASS_DURATION}
					fps={FPS}
					width={2688}
					height={768}
					schema={glassSchema}
					defaultProps={defaultGlassProps}
				/>
				<Composition
					id="SemaGlass"
					component={SemaGlass}
					durationInFrames={GLASS_DURATION}
					fps={FPS}
					width={1920}
					height={1080}
					schema={glassSchema}
					defaultProps={defaultGlassProps}
				/>
				<Composition
					id="SemaGlassVertical"
					component={SemaGlass}
					durationInFrames={GLASS_DURATION}
					fps={FPS}
					width={1080}
					height={1920}
					schema={glassSchema}
					defaultProps={defaultGlassProps}
				/>
			</Folder>
		</>
	);
};
