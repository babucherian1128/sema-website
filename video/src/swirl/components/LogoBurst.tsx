import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, useCurrentFrame} from 'remotion';
import {alpha, clamp, resolveAsset} from '../../lib/utils';
import {useSwirlLayout} from '../layout';
import {SW} from '../timeline';
import type {SwirlPalette} from '../schema';

/**
 * Flash + logo, matching the reference: the logo is born tiny in the eye of the
 * vortex, sits ON TOP of the flash (never hidden by it), and grows smoothly toward
 * the camera with a decelerating ease and no overshoot.
 * Mounted in <Sequence from={SW.burst[0]}> (frame 178); uses abs = frame + 178 for readability.
 *  - abs 194–228: flash glow builds behind the logo, holds briefly, clears
 *  - abs 200–204: logo fades in at 7% scale in the vortex centre
 *  - abs 200–244: logo grows 7% → 100% (ease-out cubic)
 *  - abs 244–360: very slow push-in (100% → 103%)
 */
export const LogoBurst: React.FC<{colors: SwirlPalette; logoSrc: string}> = ({colors, logoSrc}) => {
	const abs = useCurrentFrame() + SW.burst[0];
	const {cx, cy, logoR, width, height, u} = useSwirlLayout();

	const flash = interpolate(abs, SW.flash, [0, 0.92, 0.92, 0], {
		...clamp,
		easing: Easing.inOut(Easing.sin),
	});
	const grow = interpolate(abs, SW.logoGrow, [0.07, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	const push = interpolate(abs, [SW.logoGrow[1], 360], [0, 0.03], clamp);
	const opacity = interpolate(abs, [SW.logoGrow[0], SW.logoGrow[0] + 4], [0, 1], clamp);
	const d = logoR * 2;
	const big = Math.max(width, height);

	return (
		<AbsoluteFill>
			{/* flash: a bright bloom behind the logo */}
			<AbsoluteFill
				style={{
					opacity: flash,
					background: `radial-gradient(circle ${big * 0.9}px at ${cx}px ${cy}px, #FFFFFF 0%, #FFFCEB 30%, ${alpha('#FFF3B8', 0.9)} 70%, ${alpha(colors.glow, 0.75)} 100%)`,
				}}
			/>

			{/* logo, always above the flash */}
			<div
				style={{
					position: 'absolute',
					left: cx - logoR,
					top: cy - logoR,
					width: d,
					height: d,
					opacity,
					transform: `scale(${grow + push})`,
					filter: `drop-shadow(0 ${10 * u}px ${26 * u}px rgba(30,20,0,0.4))`,
				}}
			>
				<Img src={resolveAsset(logoSrc)} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
			</div>
		</AbsoluteFill>
	);
};
