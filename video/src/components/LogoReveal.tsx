import React from 'react';
import {
	AbsoluteFill,
	Easing,
	Img,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {useLayout} from '../lib/layout';
import {alpha, clamp, resolveAsset} from '../lib/utils';
import {T} from '../timeline';
import type {Palette} from '../schema';

/**
 * Gold ring + SEMA logo.
 * Mounted in <Sequence from={T.contract}> (frame 105), so frame 0 here = 105.
 *  - abs 105–135: glowing gold ring draws around the contracted pookalam
 *  - abs 112+:    logo springs 0.6 → ~1.05 → 1 (damping 12 overshoot), halo pulses
 *  - abs 140–166: diagonal light sweep across the logo (masked to the logo's own alpha)
 *  - abs 270–296: glow breathes once
 */
export const LogoReveal: React.FC<{colors: Palette; logoSrc: string}> = ({colors, logoSrc}) => {
	const f = useCurrentFrame();
	const frame = f + T.contract; // absolute frame, for readability against the timeline
	const {fps} = useVideoConfig();
	const {cx, cy, logoR, u} = useLayout();
	const src = resolveAsset(logoSrc);

	// gold ring
	const ringDraw = interpolate(frame, [T.contract + 2, T.contract + 32], [0, 1], {
		...clamp,
		easing: Easing.out(Easing.cubic),
	});
	const ringR = logoR + 12 * u;

	// logo spring: damping 12 / stiffness 120 overshoots ~12%, so 0.6 + 0.4*s peaks ≈ 1.05
	const s = spring({frame: frame - T.logo, fps, config: {damping: 12, stiffness: 120}});
	const scale = 0.6 + 0.4 * s;
	const opacity = interpolate(s, [0, 0.55], [0, 1], clamp);

	// halo pulse right after landing, then a single breath at the end
	const pulse = interpolate(frame, [T.logo + 6, T.logo + 20, T.logo + 48], [0, 1, 0.35], clamp);
	const breath = Math.sin(interpolate(frame, T.breathe, [0, Math.PI], clamp));
	const halo = pulse + 0.45 * breath;

	// shimmer sweep
	const sweep = interpolate(frame, T.logoShimmer, [-1.2, 1.2], {
		...clamp,
		easing: Easing.inOut(Easing.quad),
	});
	const sweepOn = frame >= T.logoShimmer[0] && frame <= T.logoShimmer[1];

	const d = logoR * 2;
	const haloSize = d * 1.9;

	return (
		<AbsoluteFill>
			{/* halo */}
			<div
				style={{
					position: 'absolute',
					left: cx - haloSize / 2,
					top: cy - haloSize / 2,
					width: haloSize,
					height: haloSize,
					borderRadius: '50%',
					background: `radial-gradient(circle, ${alpha(colors.marigold, 0.55 * halo)} 30%, ${alpha(colors.gold, 0.18 * halo)} 50%, transparent 70%)`,
					transform: `scale(${0.9 + 0.12 * halo})`,
				}}
			/>

			{/* glowing kasavu ring (double line) */}
			<svg
				width={ringR * 2 + 60 * u}
				height={ringR * 2 + 60 * u}
				viewBox={`${-ringR - 30 * u} ${-ringR - 30 * u} ${ringR * 2 + 60 * u} ${ringR * 2 + 60 * u}`}
				style={{
					position: 'absolute',
					left: cx - ringR - 30 * u,
					top: cy - ringR - 30 * u,
					overflow: 'visible',
					filter: `drop-shadow(0 0 ${8 * u}px ${alpha(colors.gold, 0.9)})`,
				}}
			>
				<circle
					r={ringR}
					fill="none"
					stroke={colors.gold}
					strokeWidth={3.5 * u}
					pathLength={1}
					strokeDasharray="1 1"
					strokeDashoffset={1 - ringDraw}
					transform="rotate(-90)"
				/>
				<circle
					r={ringR + 9 * u}
					fill="none"
					stroke={alpha(colors.gold, 0.6)}
					strokeWidth={1.2 * u}
					pathLength={1}
					strokeDasharray="1 1"
					strokeDashoffset={1 - ringDraw}
					transform="rotate(90) scale(1 -1)"
				/>
			</svg>

			{/* logo + shimmer */}
			<div
				style={{
					position: 'absolute',
					left: cx - logoR,
					top: cy - logoR,
					width: d,
					height: d,
					transform: `scale(${scale})`,
					opacity,
				}}
			>
				<Img src={src} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
				{sweepOn ? (
					<div
						style={{
							position: 'absolute',
							inset: 0,
							WebkitMaskImage: `url("${src}")`,
							WebkitMaskSize: 'contain',
							WebkitMaskRepeat: 'no-repeat',
							WebkitMaskPosition: 'center',
							maskImage: `url("${src}")`,
							maskSize: 'contain',
							maskRepeat: 'no-repeat',
							maskPosition: 'center',
							overflow: 'hidden',
						}}
					>
						<div
							style={{
								position: 'absolute',
								top: '-50%',
								left: `${sweep * 100}%`,
								width: '45%',
								height: '200%',
								transform: 'rotate(25deg)',
								background:
									'linear-gradient(90deg, transparent, rgba(255,246,214,0.15) 30%, rgba(255,250,230,0.7) 50%, rgba(255,246,214,0.15) 70%, transparent)',
								mixBlendMode: 'screen',
							}}
						/>
					</div>
				) : null}
			</div>
		</AbsoluteFill>
	);
};
