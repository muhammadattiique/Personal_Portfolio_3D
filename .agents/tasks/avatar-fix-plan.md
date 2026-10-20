# Implementation Plan — Avatar RPM model + name pronunciation fix

Single-part work. Two problems, one coherent change set. Does **not** decompose
into separable features, so this is one ordered plan, not a FEAT breakdown.

## Context (verified by reading the code)

- Stack: React 18 + Vite 5 + Tailwind 3, `@react-three/fiber` 8, `@react-three/drei` 9, `three` 0.167.
- Scripts (from `package.json`): build = `npm run build` (`vite build`), lint = `npm run lint` (`eslint .`). No test runner is configured — there is no `test` script and no test framework in deps, so verification is **build + lint only**, done statically.
- ESLint is flat config (`eslint.config.js`): `no-unused-vars` is a **warn** (not error), `varsIgnorePattern: '^[A-Z]|^motion|^_'` (capitalized/unused component imports are tolerated), plus `react-hooks` recommended rules — so hooks must be called unconditionally and in stable order.
- Root cause confirmed for Problem 1: there is **no** `public/models/` directory (`models/avatar` search returned nothing), so `useGLTF('/models/avatar.glb')` always fails and `ProceduralBoy` always renders. Current `ExternalAvatarModel` wraps `useGLTF` in try/catch, but `useGLTF` **suspends** (throws a promise) and a thrown load rejection surfaces during render/commit — a plain try/catch around the hook does not reliably catch it. An **error boundary** is the correct mechanism.
- `speaking` prop path already exists: `Hero` (`useSpeech().speaking`) → `<Avatar3DLazy speaking={speaking} />` → `Avatar3D` → `ModelOrProceduralAvatar({ speaking })` → `ProceduralBoy`. The new external-model component must accept and use `speaking` too.
- `ProceduralBoy` already lip-syncs via `mouthRef` scale.y oscillation driven by `speaking`; it uses a dark hoodie material `hoodieMaterial = color '#15151A'` and already has the LIGHT beard (`beardMaterial '#8A6B55'`). Only the torso color needs the business-casual change.
- `useSpeech()` in `src/hooks/index.js` picks the first `en-US` voice — robotic on Windows. `voiceIntro` in `src/data/profile.js` currently spells the name "Muhammad Atteeky" (wrong three-syllable sound).
- Existing camera: `position [0,0,4.2], fov 42` — keep it; frame the GLB by adjusting its primitive position/scale only.

## Constraints

- **No network in the build sandbox.** Do NOT download the GLB. `useGLTF(AVATAR_GLB_URL)` loads at **runtime in the end user's browser** from the Ready Player Me CDN. `useGLTF.preload` stays guarded in try/catch. In-sandbox we cannot verify audio playback or live model rendering — those must be confirmed by the user in a real browser. Do not start a dev server / do not wait on one.
- Work on branch `main`. Match existing code style (function components, named exports, `three` imported as `* as THREE`, comments explaining intent).

---

## Plan

- [ ] 1. Add the RPM GLB source + a dedicated model-error boundary and wire the robust fallback chain in `Avatar3D.jsx`.
      Replace the `/models/avatar.glb` usage with a top-of-file constant
      `const AVATAR_GLB_URL = "https://models.readyplayer.me/64bfa15f0e72c63d7c3934a6.glb?morphTargets=mouthOpen,mouthSmile,viseme_aa,viseme_O,viseme_E&textureAtlas=1024&pose=A";`
      Rework `ModelOrProceduralAvatar` so the external model is wrapped by a new small class error boundary (`ModelErrorBoundary`) whose `fallback` is `<ProceduralBoy mouseHover speaking />` (NOT the 2D `StaticAvatarFallback`), nested inside the existing `<Suspense fallback={<ProceduralBoy .../>}>`. Priority order on failure must be: try GLB → on any GLB load/decode/network error render `ProceduralBoy` → only if WebGL itself is unavailable does the outer `WebGLErrorBoundary` show `StaticAvatarFallback`. Keep `ModelErrorBoundary` separate from `WebGLErrorBoundary` (do not reuse it) so a model failure degrades to the 3D procedural boy, not the 2D badge. Update `useGLTF.preload('/models/avatar.glb')` at the bottom to `useGLTF.preload(AVATAR_GLB_URL)`, still inside try/catch. Add a code comment noting the avatar is a Ready Player Me model loaded at runtime from the CDN, requires internet in the end-user browser, that the user can replace `AVATAR_GLB_URL` with their own RPM `.glb` URL, and that morph-target names depend on the `?morphTargets=` query param.
      Files: `src/components/avatar/Avatar3D.jsx`
      Verify: `npm run build` succeeds and `npm run lint` reports no new errors (warnings OK) — run after item 2 since both edit the same file; see item 4.

- [ ] 2. Implement the morph-target lip-sync external-model component inside `Avatar3D.jsx`.
      In `ExternalAvatarModel({ mouseHover, speaking })`: call `const gltf = useGLTF(AVATAR_GLB_URL)` (hook called unconditionally at top — no try/catch around the hook; the new `ModelErrorBoundary` handles load failure). On first render, memoize (via `useMemo` keyed on `gltf.scene`) the list of lip-sync targets by traversing `gltf.scene`: for each mesh with `morphTargetDictionary` + `morphTargetInfluences`, resolve the mouth index by checking, in order, the dictionary keys `"mouthOpen"`, then `"viseme_aa"`, then `"jawOpen"`, then `"mouthSmile"`; collect `{ mesh, index }` for every matching mesh so all are driven. In `useFrame((state) => {...})`: when `speaking`, set each target influence to `Math.min(1, Math.abs(Math.sin(t*10)) * (0.4 + Math.random()*0.4))` (clamped, t = `state.clock.elapsedTime`); when not speaking, ease toward 0. Guard every access (`?.`, array bounds, `Number.isInteger(index)`) so a model missing those morph targets never throws. Render `<primitive object={gltf.scene} position={[0,-1.5,0]} scale={1.45} />` (within the 1.3–1.6 range; tune so the RPM head/upper body sits centered in the square panel under the existing `camera position [0,0,4.2] fov 42`). `mouseHover` is accepted for signature parity; if unused, prefix-ignore or omit per lint rules. Keep the `Float` wrapper, reduced-motion branch, and IntersectionObserver frameloop pause in `Avatar3D` untouched.
      Files: `src/components/avatar/Avatar3D.jsx`
      Verify: covered by item 4 (`npm run build` + `npm run lint`). Statically confirm the file reads correctly: `useGLTF` points at `AVATAR_GLB_URL`, hooks are unconditional/stable-order, morph access is fully guarded.

- [ ] 3. Give the procedural fallback a business-casual blazer (secondary polish) in `ProceduralBoy.jsx`.
      Change the torso material from the dark hoodie tone to a blazer: set `hoodieMaterial` color to a muted navy/indigo `#2A3356` (optionally add a lighter collared-shirt accent on the chest/neck using an existing or new light material ~`#C9D2E3` without restructuring geometry). Keep the LIGHT beard material (`#8A6B55`) and all existing animation (mouse tracking, blink, wave, `mouthRef` speaking lip-sync) exactly as-is. Update the top-of-file doc comment: replace "Dark charcoal hoodie" wording with business-casual blazer. This is secondary — do not regress the speaking-driven mouth animation.
      Files: `src/components/avatar/ProceduralBoy.jsx`
      Verify: covered by item 4. Statically confirm `speaking` prop and `mouthRef` oscillation logic are unchanged.

- [ ] 4. Build + lint the avatar changes together.
      After items 1–3 (all touch avatar files), run the project's real commands.
      Files: none (verification step).
      Verify: run `npm run build` — expect it to complete and emit `dist/` with no errors; run `npm run lint` — expect no new errors (pre-existing warnings acceptable). If either fails, fix and re-run before proceeding.

- [ ] 5. Fix the spoken name pronunciation in `profile.js` (voiceIntro ONLY).
      In `src/data/profile.js`, change the spoken name inside `voiceIntro` from "Muhammad Atteeky" to "Muhammad Atteek" (this most reliably yields the two-syllable "ah-TEEK" with a hard-k ending on en-US TTS). Do NOT touch `profile.name`, `firstName`, `lastName`, or any displayed text — those stay "Muhammad Attique". Update the NOTE comment above `voiceIntro` to explain the corrected phonetic intent: "ah-TEEK", two syllables, stress on the second, hard "k" ending — and that it affects spoken text only. Leave the rest of the voiceIntro script unchanged.
      Files: `src/data/profile.js`
      Verify: covered by item 7. Statically confirm `profile.name`/`firstName`/`lastName` are still "Muhammad Attique" and only the `voiceIntro` string + its comment changed.

- [ ] 6. Improve the TTS voice picker in `useSpeech()` in `hooks/index.js`.
      Rewrite `pickVoice()` with a case-insensitive substring-on-`voice.name` preference order, first match wins: (1) name includes "natural" AND `lang` starts "en"; (2) name includes "google" AND `lang` starts "en"; (3) name includes any of "aria","jenny","guy","zira","david" AND `lang` starts "en"; (4) any `lang` starts "en-US"; (5) any `lang` starts "en-GB"; (6) any `lang` starts "en"; (7) `null`. Keep the `voiceschanged` async listener, the SSR/`supported` guard, cleanup (`cancel()` on unmount), and `rate 0.95` / `pitch 1.0` unchanged. Do not alter the `speaking` flag wiring or anything the lip-sync depends on.
      Files: `src/hooks/index.js`
      Verify: covered by item 7. Statically confirm the preference order and that `voiceschanged`/SSR guard/rate/pitch are intact.

- [ ] 7. Build + lint the pronunciation/voice changes.
      After items 5–6, run the real commands again.
      Files: none (verification step).
      Verify: run `npm run build` (expect success, `dist/` emitted, no errors) and `npm run lint` (no new errors; warnings OK). Fix and re-run on failure.

- [ ] 8. Final static verification summary for the report.
      Confirm and record for the final report: `npm run build` and `npm run lint` both pass; `useGLTF` and `useGLTF.preload` both reference `AVATAR_GLB_URL`; the model-failure path renders `ProceduralBoy` (3D) and only a true WebGL-unavailable path renders the 2D `StaticAvatarFallback`; morph-target access is guarded; displayed name is still "Muhammad Attique" while spoken text is "Muhammad Atteek". Explicitly state in the report that **runtime audio playback and live RPM model rendering could not be verified in the no-network sandbox and must be confirmed by the user in a real browser** (the GLB loads from the Ready Player Me CDN and needs internet in the end-user browser; `AVATAR_GLB_URL` is user-replaceable and morph names depend on the `?morphTargets=` query param).
      Files: none (reporting step).
      Verify: the two prior build+lint runs (items 4 and 7) are green and the above invariants hold on re-read of the changed files.

## Notes / assumptions

- No test framework exists and adding one is out of scope for a two-issue avatar/voice fix, so verification is deliberately build + lint + static code review. This is stated as a known gap rather than silently skipped.
- The exact GLB `position`/`scale` is a visual tuning value; `position [0,-1.5,0]`, `scale 1.45` is the starting point within the specified 1.3–1.6 range. Final framing is a runtime-browser judgment the user confirms, since it can't be rendered in the sandbox.
- RPM morph-target names (`mouthOpen`, `viseme_aa`, etc.) are present only because they're requested in the `?morphTargets=` query param of `AVATAR_GLB_URL`; the lip-sync code is written to no-op safely if a replacement URL omits them.

---

## Verification (iteration 1)

Commands run from the project root on branch `main`:

- `npm install` — skipped; `node_modules` already present.
- `npm run build` (`vite build`) — **exit 0**. 2568 modules transformed, `dist/` emitted (e.g. `dist/assets/Avatar3D-*.js`, `three-core`, `three-fiber`, `react-vendor` chunks), built in ~17.7s. No errors.
- `npm run lint` (`eslint .`) — **exit 0**: `5 problems (0 errors, 5 warnings)`. All 5 are the pre-existing warnings in `CommandPalette.jsx`, `ProjectCard.jsx`, and `Toast.jsx`. **No** warnings or errors in the files changed here (`Avatar3D.jsx`, `ProceduralBoy.jsx`, `profile.js`, `hooks/index.js`).

Static checks:

- `grep '/models/avatar.glb'` over `**/*.{js,jsx}` — **no matches**. `useGLTF(AVATAR_GLB_URL)` and `useGLTF.preload(AVATAR_GLB_URL)` both reference the RPM CDN constant. (The only remaining textual references to the old path are stale prose in `README.md` and in this plan file — not source code, and out of this task's listed scope.)
- Fallback priority confirmed by re-reading `Avatar3D.jsx`: GLB is tried first; a load/decode/network error is caught by the dedicated `ModelErrorBoundary` → renders `<ProceduralBoy>` (3D). The 2D `StaticAvatarFallback` is only reached when WebGL itself is unavailable (`webGLSupported === false` early return, or the separate `WebGLErrorBoundary`). The two boundaries are distinct classes.
- Morph-target lip-sync: `ExternalAvatarModel` calls `useGLTF(AVATAR_GLB_URL)` unconditionally; `useMemo` keyed on `gltf?.scene` collects every mesh with `morphTargetDictionary` + `morphTargetInfluences`, resolving the mouth index via `mouthOpen → viseme_aa → jawOpen → mouthSmile` with `Number.isInteger`/bounds guards; `useFrame` drives `Math.min(1, Math.abs(Math.sin(t*10)) * (0.4 + Math.random()*0.4))` while `speaking`, eases to 0 otherwise. Every influence access is guarded so missing targets never throw.
- `Float` wrapper, reduced-motion branch, and IntersectionObserver frameloop pause are untouched.
- `ProceduralBoy`: torso `hoodieMaterial` now muted navy/indigo `#2A3356` with a lighter `#C9D2E3` collared-shirt accent; LIGHT beard `#8A6B55` and the `speaking`/`mouthRef` lip-sync animation are unchanged.
- `profile.js`: only `voiceIntro` spoken name changed `Muhammad Atteeky → Muhammad Atteek` plus the NOTE comment; `name`/`firstName`/`lastName` and all displayed text remain `Muhammad Attique`.
- `hooks/index.js` `pickVoice()`: new case-insensitive, first-match-wins order — Natural+en → Google+en → Aria/Jenny/Guy/Zira/David+en → en-US → en-GB → en → null. `voiceschanged` async handling, SSR/`supported` guard, cleanup, `rate 0.95`, `pitch 1.0`, and the `speaking` flag wiring are intact.

**Not verifiable in this no-network sandbox and must be confirmed by the user in a real browser:** live RPM model rendering and audio playback. The GLB loads at runtime from the Ready Player Me CDN and needs internet in the end-user browser; `AVATAR_GLB_URL` is user-replaceable, and the lip-sync morph names depend on the `?morphTargets=` query param.
