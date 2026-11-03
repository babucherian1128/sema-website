import React, {useLayoutEffect, useMemo, useRef} from 'react';
import {Easing, interpolate, random, useCurrentFrame} from 'remotion';
import {clamp} from '../../lib/utils';
import {hexToRgb, useSwirlLayout} from '../layout';
import {SW} from '../timeline';
import type {SwirlPalette} from '../schema';

const STREAMS = 42;
const PARTICLES_PER_STREAM = 56;
const DUST = 650;
const BOKEH = 26;
const COMET_TRAIL = 70;

/**
 * The particle vortex, drawn on a <canvas> every frame.
 * Every position is a pure function of the frame number plus seeded random()
 * values, with no simulation state carried between frames, so renders are
 * deterministic and can be split across parallel workers.
 * The canvas is composited with mix-blend-mode: screen so the light adds onto
 * the gold backdrop, and draws with 'lighter' so overlapping streams bloom to white.
 * Mounted for the full timeline (0–360).
 */
export const SwirlCanvas: React.FC<{colors: SwirlPalette}> = ({colors}) => {
	const frame = useCurrentFrame();
	const {width: W, height: H, cx, cy, u, rMax} = useSwirlLayout();
	const ref = useRef<HTMLCanvasElement>(null);

	const seeds = useMemo(() => {
		const streams = new Array(STREAMS).fill(0).map((_, i) => ({
			angle: (i / STREAMS) * Math.PI * 2 + (random(`st-a-${i}`) - 0.5) * 0.12,
			twist: 2.4 + random(`st-t-${i}`) * 0.9,
			bright: 0.35 + random(`st-b-${i}`) * 0.65,
			delay: (i % 8) * 6 + random(`st-d-${i}`) * 8,
			ember: i % 5 === 2,
			particles: new Array(PARTICLES_PER_STREAM).fill(0).map((__, j) => ({
				phase: random(`sp-p-${i}-${j}`),
				speed: 0.004 + random(`sp-s-${i}-${j}`) * 0.007,
				off: (random(`sp-o-${i}-${j}`) - 0.5) * 2,
				size: 1 + random(`sp-z-${i}-${j}`) ** 2 * 3.2,
				halo: random(`sp-h-${i}-${j}`) > 0.7,
			})),
		}));
		const dust = new Array(DUST).fill(0).map((_, i) => ({
			x: random(`du-x-${i}`),
			y: random(`du-y-${i}`),
			vx: (random(`du-vx-${i}`) - 0.5) * 0.4,
			vy: 0.1 + random(`du-vy-${i}`) * 0.5,
			s: 1 + random(`du-s-${i}`) ** 3 * 4,
			a: 0.35 + random(`du-a-${i}`) * 0.65,
			p: random(`du-p-${i}`) * Math.PI * 2,
		}));
		const bokeh = new Array(BOKEH).fill(0).map((_, i) => ({
			x: random(`bk-x-${i}`),
			y: random(`bk-y-${i}`),
			r: 10 + random(`bk-r-${i}`) * 44,
			a: 0.08 + random(`bk-a-${i}`) * 0.16,
			v: (random(`bk-v-${i}`) - 0.5) * 0.5,
			p: random(`bk-p-${i}`) * Math.PI * 2,
		}));
		return {streams, dust, bokeh};
	}, []);

	useLayoutEffect(() => {
		const canvas = ref.current;
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		const f = frame;
		const [gr, gg, gb] = hexToRgb(colors.glow);
		const [er, eg, eb] = hexToRgb(colors.ember);
		const glow = (a: number) => `rgba(${gr},${gg},${gb},${Math.max(0, Math.min(1, a))})`;
		const core = (a: number) => `rgba(255,250,228,${Math.max(0, Math.min(1, a))})`;

		ctx.clearRect(0, 0, W, H);
		ctx.globalCompositeOperation = 'lighter';
		ctx.setLineDash([]);
		ctx.lineCap = 'round';

		/* ---------- ambient dust + bokeh (whole timeline) ---------- */
		for (const d of seeds.dust) {
			const x = (((d.x * W + f * d.vx * u + Math.sin(f / 50 + d.p) * 12 * u) % W) + W) % W;
			const y = (((d.y * H - f * d.vy * u) % H) + H) % H;
			const a = d.a * (0.45 + 0.55 * Math.abs(Math.sin(f / 11 + d.p)));
			ctx.fillStyle = core(a * 0.8);
			ctx.fillRect(x, y, d.s * u, d.s * u);
		}
		for (const b of seeds.bokeh) {
			const x = (((b.x * W + f * b.v * u) % W) + W) % W;
			const y = b.y * H + Math.sin(f / 70 + b.p) * 20 * u;
			const r = b.r * u;
			const g = ctx.createRadialGradient(x, y, 0, x, y, r);
			const a = b.a * (0.6 + 0.4 * Math.sin(f / 25 + b.p));
			g.addColorStop(0, core(a));
			g.addColorStop(0.7, core(a * 0.6));
			g.addColorStop(1, core(0));
			ctx.fillStyle = g;
			ctx.beginPath();
			ctx.arc(x, y, r, 0, Math.PI * 2);
			ctx.fill();
		}

		/* ---------- vortex ---------- */
		const swirlAlpha = interpolate(f, [SW.burst[1] - 2, SW.burst[1] + 10], [1, 0], clamp);
		if (swirlAlpha <= 0) return;

		// rotation accelerates after SW.accelerate (integral of a linearly rising speed)
		const after = Math.max(0, f - SW.accelerate);
		const rot = 0.006 * f + 0.00014 * after * after;
		const burst = interpolate(f, SW.burst, [0, 1], {...clamp, easing: Easing.in(Easing.quad)});
		const straighten = 1 - 0.88 * burst;

		const pt = (s: number, angle: number, twist: number): [number, number] => {
			const r = rMax * Math.pow(Math.max(0, 1 - s), 1.15);
			const th = angle + rot + twist * straighten * Math.pow(Math.max(0, s), 0.7);
			return [cx + r * Math.cos(th), cy + r * Math.sin(th)];
		};

		ctx.globalAlpha = swirlAlpha;

		// light streams
		for (let i = 0; i < seeds.streams.length; i++) {
			const st = seeds.streams[i];
			const reveal = interpolate(f, [SW.streams + st.delay, SW.streams + st.delay + 80], [0, 0.985], {
				...clamp,
				easing: Easing.out(Easing.cubic),
			});
			if (reveal <= 0) continue;
			const steps = 52;
			const b = st.bright * (1 + burst * 1.4);
			const tracePath = (dAngle: number, dTwist: number) => {
				ctx.beginPath();
				for (let k = 0; k <= steps; k++) {
					const [x, y] = pt((k / steps) * reveal, st.angle + dAngle, st.twist + dTwist);
					if (k === 0) ctx.moveTo(x, y);
					else ctx.lineTo(x, y);
				}
			};
			if (st.ember) {
				tracePath(0, 0);
				ctx.setLineDash([3 * u, 18 * u]);
				ctx.lineDashOffset = -f * 7 * u;
				ctx.strokeStyle = `rgba(${er},${eg},${eb},${0.95 * b})`;
				ctx.lineWidth = 4.5 * u * (1 + burst * 2);
				ctx.stroke();
				ctx.setLineDash([]);
			} else {
				// a ribbon: soft wide glow plus a few bright strands fanning slightly apart
				tracePath(0, 0);
				ctx.strokeStyle = glow(0.13 * b);
				ctx.lineWidth = 30 * u * (1 + burst * 2.5);
				ctx.stroke();
				ctx.strokeStyle = glow(0.22 * b);
				ctx.lineWidth = 9 * u * (1 + burst * 2);
				ctx.stroke();
				for (let k = -1; k <= 1; k++) {
					tracePath(k * 0.022, k * 0.12);
					ctx.strokeStyle = core((k === 0 ? 0.85 : 0.45) * b);
					ctx.lineWidth = (k === 0 ? 2.6 : 1.4) * u * (1 + burst * 2.5);
					ctx.stroke();
				}
			}

			// particles flowing inward along the stream
			for (const p of st.particles) {
				const s = (p.phase + f * p.speed) % 1;
				if (s > reveal) continue;
				const [x0, y0] = pt(s, st.angle, st.twist);
				const [x1, y1] = pt(Math.min(1, s + 0.01), st.angle, st.twist);
				const len = Math.hypot(x1 - x0, y1 - y0) || 1;
				const spread = p.off * 34 * u * (1 - s);
				const x = x0 + (-(y1 - y0) / len) * spread;
				const y = y0 + ((x1 - x0) / len) * spread;
				const a = 0.95 * st.bright * Math.min(1, s / 0.05);
				const r = p.size * u * (1.2 - s * 0.6);
				if (p.halo) {
					ctx.fillStyle = glow(a * 0.25);
					ctx.beginPath();
					ctx.arc(x, y, r * 6, 0, Math.PI * 2);
					ctx.fill();
				}
				ctx.fillStyle = core(a);
				ctx.beginPath();
				ctx.arc(x, y, r, 0, Math.PI * 2);
				ctx.fill();
			}
		}

		// four comets leading the swirl in
		const head = interpolate(f, SW.comets, [0, 0.97], {...clamp, easing: Easing.inOut(Easing.sin)});
		const cometA = interpolate(f, [SW.comets[0], SW.comets[0] + 8, SW.comets[1] - 10, SW.comets[1] + 15], [0, 1, 1, 0], clamp);
		if (cometA > 0) {
			for (let k = 0; k < 4; k++) {
				const angle = -Math.PI * 0.8 + (k * Math.PI) / 2;
				for (let j = COMET_TRAIL; j >= 0; j--) {
					const s = head - j * 0.0042;
					if (s < 0) continue;
					const [x0, y0] = pt(s, angle, 2.8);
					const fade = Math.pow(1 - j / COMET_TRAIL, 1.6);
					ctx.fillStyle = glow(0.12 * fade * cometA);
					ctx.beginPath();
					ctx.arc(x0, y0, (22 - (j / COMET_TRAIL) * 14) * u, 0, Math.PI * 2);
					ctx.fill();
					ctx.fillStyle = core(0.8 * fade * cometA);
					ctx.beginPath();
					ctx.arc(x0, y0, (5 - (j / COMET_TRAIL) * 3.5) * u, 0, Math.PI * 2);
					ctx.fill();
					// glittering spray around the trail
					for (let m = 0; m < 6; m++) {
						const ox = (random(`ct-x-${k}-${j}-${m}`) - 0.5) * 110 * u * (j / COMET_TRAIL);
						const oy = (random(`ct-y-${k}-${j}-${m}`) - 0.5) * 110 * u * (j / COMET_TRAIL);
						ctx.fillStyle = core(0.8 * fade * cometA * random(`ct-a-${k}-${j}-${m}`));
						ctx.fillRect(x0 + ox, y0 + oy, 2.4 * u, 2.4 * u);
					}
				}
				const [hx, hy] = pt(head, angle, 2.8);
				const g = ctx.createRadialGradient(hx, hy, 0, hx, hy, 90 * u);
				g.addColorStop(0, core(cometA));
				g.addColorStop(0.25, glow(0.55 * cometA));
				g.addColorStop(1, glow(0));
				ctx.fillStyle = g;
				ctx.beginPath();
				ctx.arc(hx, hy, 90 * u, 0, Math.PI * 2);
				ctx.fill();
			}
		}

		// glowing eye of the vortex
		const eyeIn = interpolate(f, [90, 180], [0, 1], clamp);
		const eyeR = (110 + burst * 700) * u;
		if (eyeIn > 0) {
			const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, eyeR);
			g.addColorStop(0, core(0.35 * eyeIn + burst * 0.6));
			g.addColorStop(0.4, glow(0.18 * eyeIn + burst * 0.3));
			g.addColorStop(1, glow(0));
			ctx.fillStyle = g;
			ctx.beginPath();
			ctx.arc(cx, cy, eyeR, 0, Math.PI * 2);
			ctx.fill();
		}

		// burst rays
		if (burst > 0) {
			for (let i = 0; i < 70; i++) {
				const a = random(`ray-a-${i}`) * Math.PI * 2 + rot * 0.3;
				const len = rMax * burst * (0.4 + random(`ray-l-${i}`) * 0.8);
				ctx.strokeStyle = core(0.35 * burst * random(`ray-b-${i}`));
				ctx.lineWidth = (2 + random(`ray-w-${i}`) * 12) * u * burst;
				ctx.beginPath();
				ctx.moveTo(cx, cy);
				ctx.lineTo(cx + Math.cos(a) * len, cy + Math.sin(a) * len);
				ctx.stroke();
			}
		}
		ctx.globalAlpha = 1;
	}, [frame, W, H, cx, cy, u, rMax, seeds, colors.glow, colors.ember]);

	return (
		<canvas
			ref={ref}
			width={W}
			height={H}
			style={{position: 'absolute', inset: 0, width: W, height: H, mixBlendMode: 'screen'}}
		/>
	);
};
