import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {clamp, resolveAsset} from '../../lib/utils';
import {smoothstep, useGlassLayout} from '../layout';
import {GT} from '../timeline';
import type {GlassPalette} from '../schema';

/**
 * Camera state for a frame, fitted to the reference: the coin starts huge and close
 * (about 6x final size at 0.9s, overflowing the frame at 1.7s), steeply tilted, then
 * pulls back and tilts up to face the viewer by about 3s. Every curve is smooth and
 * monotonic (exponential falloff and smoothsteps), so there are no stops or kinks.
 */
export const discCamera = (frame: number, height: number) => {
	const f = frame;
	// size fitted to the reference at 0.9s / 1.7s / 2.1s / 2.5s / 3.0s ≈ 6x / 3.7x / 2.5x / 1.4x / 1x
	const scale =
		1 + 5.3 * Math.pow(1 - smoothstep(20, 98, f), 1.6) + 0.02 * smoothstep(GT.hold, 180, f);
	const tilt = 78 * (1 - smoothstep(30, 78, f));
	const ty = -0.6 * height * (1 - smoothstep(GT.camera[0], 40, f));
	const rotZ = -6 * (1 - smoothstep(20, 80, f));
	return {scale, tilt, ty, rotZ};
};

/** Coin outline: starts as a wobbling blob, firms into a perfect circle. */
const outlinePath = (r: number, wobble: number, frame: number) => {
	const n = 120;
	let d = '';
	for (let i = 0; i <= n; i++) {
		const th = (i / n) * Math.PI * 2;
		const rr =
			r * (1 + wobble * (0.6 * Math.sin(3 * th + frame * 0.06) + 0.4 * Math.sin(5 * th - 1.3 + frame * 0.04)));
		d += `${i === 0 ? 'M' : 'L'}${(rr * Math.cos(th)).toFixed(2)},${(rr * Math.sin(th)).toFixed(2)}`;
	}
	return `${d}Z`;
};

/** A vertical liquid band with wavy edges, spanning the face. */
const bandPath = (R: number, x0: number, w: number, amp: number, phase: number) => {
	const n = 40;
	const left: string[] = [];
	const right: string[] = [];
	for (let i = 0; i <= n; i++) {
		const y = -1.3 * R + (2.6 * R * i) / n;
		const k = y / R;
		const lx = x0 + amp * R * Math.sin(k * 2.2 + phase);
		const rx = lx + w * R + amp * 0.7 * R * Math.sin(k * 2.9 + phase + 1.1);
		left.push(`${lx.toFixed(1)},${y.toFixed(1)}`);
		right.unshift(`${rx.toFixed(1)},${y.toFixed(1)}`);
	}
	return `M${left.join(' L')} L${right.join(' L')} Z`;
};

const SLICES = 44;

/**
 * The 3D glass coin, built from CSS 3D layers: a face (logo, liquid, glass rim) plus
 * stacked slices behind it for thickness. Transforms are a pure function of the frame.
 * Mounted for the full timeline (0–180).
 *  - 10–32:  coin swings in from above, very close, tilted ~78°; blob edge firms into a circle
 *  - 10–110: grey and white liquid bands flow across the face; a white gloss band crosses last
 *  - 36–60:  logo fades in under the liquid
 *  - 10–96:  camera pulls back while the coin tilts up to face the viewer and settles
 */
export const GlassDisc: React.FC<{colors: GlassPalette; logoSrc: string}> = ({colors, logoSrc}) => {
	const frame = useCurrentFrame();
	const {cx, cy, logoR: R, height} = useGlassLayout();
	const cam = discCamera(frame, height);

	const grow = 0.3 + 0.7 * smoothstep(GT.discIn[0], GT.discIn[1], frame);
	const wobble = 0.17 * (1 - smoothstep(20, 48, frame));
	const outline = outlinePath(R * grow, wobble, frame);
	const visible = interpolate(frame, [GT.discIn[0], GT.discIn[0] + 4], [0, 1], clamp);

	const logoIn = interpolate(frame, GT.logoIn, [0, 1], {...clamp, easing: Easing.inOut(Easing.sin)});
	const t = frame - GT.liquid[0];
	const bands = [
		// mid grey and light grey bands: carry the "liquid" look, fade as the logo arrives
		{color: colors.liquidMid, x: -1.1 + t * 0.011, w: 0.55, amp: 0.16, ph: 0.4, o: 1 - smoothstep(48, 74, frame)},
		{color: colors.liquidLight, x: -0.25 + t * 0.009, w: 0.38, amp: 0.2, ph: 2.1, o: 1 - smoothstep(50, 78, frame)},
		{color: '#F4F4F4', x: 0.35 + t * 0.016, w: 0.3, amp: 0.14, ph: 4.0, o: 1 - smoothstep(46, 70, frame)},
		// white gloss band that sweeps across last, as in the reference
		{color: '#FFFFFF', x: -1.75 + t * 0.03, w: 0.42, amp: 0.18, ph: 1.3, o: 1 - smoothstep(94, 110, frame)},
	];

	const box = R * 2.8;
	const depth = R * 0.14;
	const svgLayer = (children: React.ReactNode, z: number, key: string) => (
		<svg
			key={key}
			width={box}
			height={box}
			viewBox={`${-box / 2} ${-box / 2} ${box} ${box}`}
			style={{position: 'absolute', left: -box / 2, top: -box / 2, transform: `translateZ(${z}px)`, overflow: 'visible'}}
		>
			{children}
		</svg>
	);

	return (
		<AbsoluteFill style={{perspective: R * 16, perspectiveOrigin: `${cx}px ${cy}px`, opacity: visible}}>
			<div
				style={{
					position: 'absolute',
					left: cx,
					top: cy,
					width: 0,
					height: 0,
					transformStyle: 'preserve-3d',
					transform: `translateY(${cam.ty}px) scale3d(${cam.scale}, ${cam.scale}, ${cam.scale}) rotateX(${cam.tilt}deg) rotateZ(${cam.rotZ}deg)`,
				}}
			>
				{/* thickness: slices behind the face, glassy-light near the face, dark body below */}
				{new Array(SLICES).fill(0).map((_, i) => {
					const k = (i + 1) / SLICES;
					const shade = k < 0.25 ? '#D6D6D6' : colors.edge;
					return svgLayer(<path d={outline} fill={shade} />, -k * depth, `s${i}`);
				})}

				{/* face */}
				{svgLayer(
					<>
						<defs>
							<clipPath id="glass-face">
								<path d={outline} />
							</clipPath>
							<linearGradient id="glass-rim" x1="0" y1="0" x2="1" y2="1">
								<stop offset="0%" stopColor="#FFFFFF" />
								<stop offset="45%" stopColor="#A9A9A9" />
								<stop offset="70%" stopColor="#F2F2F2" />
								<stop offset="100%" stopColor="#8E8E8E" />
							</linearGradient>
							<radialGradient id="glass-dome" cx="0.32" cy="0.25" r="0.75">
								<stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.35} />
								<stop offset="60%" stopColor="#FFFFFF" stopOpacity={0.05} />
								<stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
							</radialGradient>
						</defs>
						<g clipPath="url(#glass-face)">
							<rect x={-box / 2} y={-box / 2} width={box} height={box} fill={colors.discBase} />
							<image
								href={resolveAsset(logoSrc)}
								x={-R}
								y={-R}
								width={R * 2}
								height={R * 2}
								opacity={logoIn}
								preserveAspectRatio="xMidYMid meet"
							/>
							{bands.map((b, i) =>
								b.o > 0.001 ? (
									<path
										key={i}
										d={bandPath(R, b.x * R, b.w, b.amp, b.ph + frame * 0.05)}
										fill={b.color}
										opacity={b.o * (i === 3 ? 0.92 : 1)}
									/>
								) : null,
							)}
							{/* glass dome highlight */}
							<rect x={-box / 2} y={-box / 2} width={box} height={box} fill="url(#glass-dome)" />
						</g>
						{/* glass rim */}
						<path d={outline} fill="none" stroke="url(#glass-rim)" strokeWidth={R * 0.06} />
						<path d={outline} fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth={R * 0.008} transform={`scale(${1 - 0.03})`} />
					</>,
					0,
					'face',
				)}
			</div>
		</AbsoluteFill>
	);
};
