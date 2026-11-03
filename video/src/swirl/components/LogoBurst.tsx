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
import {alpha, clamp, resolveAsset} from '../../lib/utils';
import {useSwirlLayout} from '../layout';
import {SW} from '../timeline';
import type {SwirlPalette} from '../schema';

/**
 * White flash, then the logo emerging from it.
 * Mounted in <Sequence from={SW.burst[0]}> (frame 190); uses abs = frame + 190 for readability.
 *  - abs 205–252: flash builds, holds and clears (radial white)
 *  - abs 218+:    logo settles 1.3 → 1 (spring, damping 20) underneath the flash
 *  - abs 222–275: anamorphic light streak across the logo
 *  - abs 300–328: diagonal light sweep, masked to the logo's own shape
 *  - to 360:      slow push-in, warm halo breathing
 */
export const LogoBurst: React.FC<{colors: SwirlPalette; logoSrc: string}> = ({colors, logoSrc}) => {
	const abs = useCurrentFrame() + SW.burst[0];
	const {fps} = useVideoConfig();
	const {cx, cy, logoR, width, height, u} = useSwirlLayout();
	const src = resolveAsset(logoSrc);

	const flash = interpolate(abs, SW.flash, [0, 1, 1, 0], clamp);
	const s = spring({frame: abs - SW.logo, fps, config: {damping: 20, stiffness: 80}});
	const push = interpolate(abs, [SW.logo, 360], [0, 0.035], clamp);
	const scale = 1.3 - 0.3 * s + push;
	const logoOpacity = abs >= SW.logo ? 1 : 0;

	const streak = interpolate(abs, [222, 234, 275], [0, 1, 0], clamp);
	const halo = interpolate(abs, [228, 250], [0, 1], clamp) * (0.75 + 0.25 * Math.sin(abs / 18));
	const sweep = interpolate(abs, SW.sweep, [-1.2, 1.2], {...clamp, easing: Easing.inOut(Easing.quad)});
	const sweepOn = abs >= SW.sweep[0] && abs <= SW.sweep[1];
	const d = logoR * 2;
	const big = Math.max(width, height);

	return (
		<AbsoluteFill>
			{/* warm halo */}
			<div
				style={{
					position: 'absolute',
					left: cx - logoR * 1.8,
					top: cy - logoR * 1.8,
					width: logoR * 3.6,
					height: logoR * 3.6,
					borderRadius: '50%',
					opacity: halo,
					background: `radial-gradient(circle, ${alpha('#FFF6C8', 0.55)} 25%, ${alpha(colors.glow, 0.18)} 45%, transparent 68%)`,
				}}
			/>

			{/* logo */}
			<div
				style={{
					position: 'absolute',
					left: cx - logoR,
					top: cy - logoR,
					width: d,
					height: d,
					opacity: logoOpacity,
					transform: `scale(${scale})`,
					filter: `drop-shadow(0 ${12 * u}px ${30 * u}px rgba(30,20,0,0.45))`,
				}}
			>
				<Img src={src} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
				{sweepOn ? (
					<div
						style={{
							position: 'absolute',
							inset: 0,
							overflow: 'hidden',
							WebkitMaskImage: `url("${src}")`,
							WebkitMaskSize: 'contain',
							WebkitMaskRepeat: 'no-repeat',
							maskImage: `url("${src}")`,
							maskSize: 'contain',
							maskRepeat: 'no-repeat',
						}}
					>
						<div
							style={{
								position: 'absolute',
								top: '-50%',
								left: `${sweep * 100}%`,
								width: '40%',
								height: '200%',
								transform: 'rotate(25deg)',
								background:
									'linear-gradient(90deg, transparent, rgba(255,250,225,0.18) 30%, rgba(255,252,235,0.75) 50%, rgba(255,250,225,0.18) 70%, transparent)',
								mixBlendMode: 'screen',
							}}
						/>
					</div>
				) : null}
			</div>

			{/* anamorphic streak */}
			<div
				style={{
					position: 'absolute',
					left: 0,
					top: cy - 3 * u,
					width,
					height: 6 * u,
					opacity: streak,
					transform: `scaleX(${0.4 + 0.6 * streak})`,
					background: `linear-gradient(90deg, transparent, ${alpha(colors.glow, 0.6)} 25%, #FFFFFF 50%, ${alpha(colors.glow, 0.6)} 75%, transparent)`,
					boxShadow: `0 0 ${30 * u}px ${alpha('#FFFFFF', 0.8)}`,
					mixBlendMode: 'screen',
				}}
			/>

			{/* flash */}
			<AbsoluteFill
				style={{
					opacity: flash,
					background: `radial-gradient(circle ${big}px at ${cx}px ${cy}px, #FFFFFF 0%, #FFFDF0 35%, ${alpha('#FFF5C0', 0.92)} 100%)`,
				}}
			/>
		</AbsoluteFill>
	);
};
