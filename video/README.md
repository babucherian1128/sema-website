# SEMA animated intro (Remotion)

A 10-second animated intro for **SEMA – South Edmonton Malayalee Association**, built with
[Remotion](https://www.remotion.dev) (React + TypeScript). Kerala heritage meets Canadian prairie:
a pookalam mandala, kasavu gold borders, nilavilakku glow, and coconut palms that turn into the
Edmonton skyline.

| Composition         | Size      | Use                                    |
| ------------------- | --------- | -------------------------------------- |
| `SemaIntro`         | 1920×1080 | Website hero, YouTube, Facebook        |
| `SemaIntroVertical` | 1080×1920 | Instagram Reels / Stories, WhatsApp    |

Both run at 30 fps for 300 frames, on the same timeline with a responsive layout.

### Theme 2: "Two Homes, One Sunrise"

| Composition           | Size      |
| --------------------- | --------- |
| `SemaSunrise`         | 1920×1080 |
| `SemaSunriseVertical` | 1080×1920 |

A bright daytime counterpart. Dawn breaks over the Kerala backwaters as a chundan vallam
(snake boat) races past under its muthukuda umbrellas. A diagonal gold seam wipes the scene
into Alberta's canola prairie, with a red grain elevator and Edmonton on the horizon. The same
sun climbs through both homes, throws its rays, and irises open into the SEMA logo. A
frosted card brings in the title word by word, and the tagline tracks in. The video ends on
cream. Typography is DM Serif Display with Montserrat. Code: `src/sunrise/`, with every frame
number in `src/sunrise/timeline.ts`.

| Time      | Frames  | What happens                                                          |
| --------- | ------- | --------------------------------------------------------------------- |
| 0–4s      | 0–120   | Dawn on the backwaters, sun rises, palms lean in, snake boat races by |
| 4–5.7s    | 122–170 | Gold seam wipes Kerala → prairie, sky turns from dawn to morning      |
| 5.2–6s    | 156–180 | Sun grows, sunburst rays, logo irises open from the sun               |
| 6–8s      | 180–240 | Frosted card: title word by word, brush underline, tagline tracks in  |
| 8–9s      | 196–262 | Canada geese cross the sky, light glints across the card              |
| 9–10s     | 270–300 | Settle, fade to cream                                                 |

### Theme 3: Particle swirl (12 s)

| Composition         | Size      |
| ------------------- | --------- |
| `SemaSwirl`         | 1920×1080 |
| `SemaSwirlVertical` | 1080×1920 |

A gold particle-vortex logo reveal. Gold dust and bokeh drift. Four comets streak in from
the edges, then ribbons of light and dashed ember streams spiral into a tightening vortex.
The vortex speeds up, bursts into rays and a white flash, and the logo settles out of the
flash with an anamorphic streak. The name and tagline flicker in letter by letter, in random
order. The vortex is drawn on a `<canvas>` each frame, with every particle position computed
from the frame number, so renders are deterministic. Code: `src/swirl/`, with timing in
`src/swirl/timeline.ts`. It runs 360 frames at 30 fps.

| Time      | Frames  | What happens                                                   |
| --------- | ------- | -------------------------------------------------------------- |
| 0–1.3s    | 0–38    | Gold backdrop, drifting dust and bokeh, slow push-in           |
| 1.3–4.7s  | 38–140  | Four comets streak in from the edges and spiral to the centre  |
| 2.3–6.3s  | 70–190  | Light ribbons fill in; the vortex tightens and accelerates     |
| 6.3–8.4s  | 190–252 | Streams straighten into rays, burst, white flash, logo settles |
| 8.3–9.5s  | 248–290 | Name, then tagline, flicker in letter by letter                |
| 10–12s    | 300–360 | Light sweep across the logo, hold                              |

## Quick start

```bash
cd video
npm install
npm run dev            # opens Remotion Studio — edit props live in the right panel
```

## Render (MP4, H.264)

```bash
npx remotion render SemaIntro         out/sema-intro.mp4          --codec=h264
npx remotion render SemaIntroVertical out/sema-intro-vertical.mp4 --codec=h264

npx remotion render SemaSunrise         out/sema-sunrise.mp4          --codec=h264
npx remotion render SemaSunriseVertical out/sema-sunrise-vertical.mp4 --codec=h264
npx remotion render SemaSwirl           out/sema-swirl.mp4            --codec=h264
npx remotion render SemaSwirlVertical   out/sema-swirl-vertical.mp4   --codec=h264

# or
npm run render:all
```

`remotion.config.ts` sets CRF 16, `yuv420p` (plays everywhere, including iPhone and WhatsApp)
and JPEG frames at quality 95.

## Editable props (Remotion Studio)

Defined with zod in `src/schema.ts`:

- `title`: the association name, revealed letter by letter.
- `tagline`: revealed word by word. The first word gets the gold shimmer.
- `logoSrc`: a file in `public/` (PNG **or SVG**) or an `https://` URL.
- `musicSrc`: a file in `public/`. If the file isn't there, the video renders silently.
- `colors`: background, gold, green, teal, marigold, magenta, text (each has a colour picker).

You can also override props from the CLI:

```bash
npx remotion render SemaIntro out/onam.mp4 --codec=h264 \
  --props='{"tagline":"Happy Onam from South Edmonton"}'
```

(Props passed on the CLI are merged over the defaults for top-level keys. If you override
`colors`, pass the full object.)

## Assets

- `public/sema-logo.png` is the official SEMA badge (with the SEMA wordmark), cut out with a
  circular transparent mask.
- `public/intro-music.mp3` is optional. Drop a track in and it fades in over the first
  0.5 s and out over the last 1 s. Use music you have the rights to.

## Timeline

| Time      | Frames  | What happens                                                                     |
| --------- | ------- | -------------------------------------------------------------------------------- |
| 0–1.5s    | 0–45    | Indigo + radial glow, seeded gold dust rising, kasavu line draws across centre  |
| 1.5–3.5s  | 45–105  | Pookalam blooms: 5 rings springing in, staggered, alternating rotation           |
| 3.5–5.5s  | 105–165 | Mandala contracts into a gold ring + petal crown, logo springs 0.6→1.05→1, shimmer |
| 5.5–7.5s  | 165–225 | Title letter by letter, tagline word by word (blur→sharp), connection network    |
| 7.5–9s    | 225–270 | Kasavu border draws, palms rise and morph into Edmonton skyline, petals fall     |
| 9–10s     | 270–300 | Settle, logo glow breathes once, fade to indigo on the last 10 frames            |

All frame numbers live in `src/timeline.ts`. Change them there to re-time the piece.

## Structure

```
src/
  index.ts            registerRoot
  Root.tsx            both <Composition>s + zod schema
  SemaIntro.tsx       the timeline: one <Sequence> per layer, commented with timing
  schema.ts           props schema + defaults (palette)
  timeline.ts         every frame number in one place
  fonts.ts            Playfair Display + Poppins via @remotion/google-fonts
  lib/layout.ts       responsive layout (16:9 vs 9:16), balanced line breaks
  lib/utils.ts        colour alpha, asset resolution, petal path
  components/
    Background.tsx        indigo + nilavilakku glow + vignette
    Particles.tsx         seeded gold dust
    GoldLine.tsx          opening kasavu line
    Pookalam.tsx          flower-carpet mandala
    LogoReveal.tsx        gold ring, logo spring, halo, light sweep
    TitleText.tsx         letter-by-letter title + kasavu divider
    Tagline.tsx           word-by-word tagline, gold shimmer on "Connecting"
    ConnectionNetwork.tsx light points + gold threads
    KasavuFrame.tsx       kasavu-saree border + lotus corners
    Skyline.tsx           palms → Edmonton skyline
    FallingPetals.tsx     drifting petals
```

Animation uses only Remotion primitives (`useCurrentFrame`, `interpolate`, `spring`,
`Sequence`, `AbsoluteFill`, `Easing`, `random`). There are no CSS transitions or keyframes, so
every frame is deterministic and renders can run in parallel.
