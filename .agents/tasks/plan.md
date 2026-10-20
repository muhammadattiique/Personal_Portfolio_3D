# Implementation Plan — Portfolio Updates for Muhammad Attique

Project: React + Vite + Tailwind + Three.js portfolio.
Build command: `npm run build`. Lint: `npm run lint`. Dev: `npm run dev`.
There are no automated tests in this repo (no test runner in package.json), so verification is the production build (`npm run build`) plus `npm run lint`, plus targeted grep to confirm no old lime/near-black hex values remain. The build is the real gate: a broken import, bad JSX, or undefined reference fails `vite build`.

Design decisions (made here, grounded in the code I read):
- The GitHub username is ALREADY correct (`muhammadattiique`, double-i) everywhere in src/ — grep found zero single-i occurrences. So the "fix username" work is really: rewrite the projects list to the 6 real repos and drop the two repos that are not in the real set (Calculator). No URL spelling changes are needed, but every new URL must still use the double-i spelling.
- `profile.phone` is defined but rendered by NO component (confirmed by grep). Setting it to `""` satisfies "keep phone off the site" with zero render risk.
- The voice feature uses the browser Web Speech API via a new `useSpeech` hook in `src/hooks/index.js` (the existing hooks barrel), consumed by `Hero.section.jsx`. No new dependency.
- Palette: keep every existing CSS variable name and Tailwind color key so no component class breaks; only values change. Add `accent-2` / `accent-2-soft` as NEW keys.
- `ProjectDetail.jsx` hardcodes `{project.number} / 04`; with 6 projects this must become `/ 06`.
- `CustomCursor.jsx` (not in the original read list, found by grep) also hardcodes the lime hex and must be fixed.

- [ ] 1. Replace the color palette in both the CSS variables block and the Tailwind color config with the deep-indigo/midnight theme, keeping every existing variable/key name and adding the new `accent-2` keys.
      In `src/index.css` `:root` set: `--bg-color:#0B1020`, `--surface-color:#121832`, `--surface-elevated-color:#1A2142`, `--border-color:rgba(255,255,255,0.09)`, `--border-strong-color:rgba(255,255,255,0.18)`, `--text-color`/`--foreground-color`:`#F2F4FF`, `--muted-color:#9AA3C7`, `--faint-color:#5A6291`, `--accent-color:#4F8CFF`, `--accent-soft-color:rgba(79,140,255,0.14)`, `--accent-glow-color:rgba(79,140,255,0.35)`; ADD `--accent-2-color:#A855F7` and `--accent-2-soft-color:rgba(168,85,247,0.14)`.
      In `tailwind.config.js` `theme.extend.colors` mirror the same values on keys `background, surface, surface-elevated, border, border-strong, foreground, muted, faint, accent, accent-soft, accent-glow`, and ADD `accent-2:'#A855F7'` and `accent-2-soft:'rgba(168,85,247,0.14)'`.
      Files: src/index.css, tailwind.config.js
      Verify: `npm run build` succeeds.

- [ ] 2. Replace every HARDCODED old lime hex in components with the new blue accent `#4F8CFF` and lime glow rgba with `rgba(79,140,255,...)`.
      Occurrences (from grep): `src/components/avatar/Avatar3D.jsx` — `<pointLight color="#C6FF3D">` → `#4F8CFF`, and `StaticAvatarFallback` shadow `rgba(198,255,61,0.2)` → `rgba(79,140,255,0.2)`; `src/components/avatar/ProceduralBoy.jsx` — `accentMaterial` `color` and `emissive` `#C6FF3D` → `#4F8CFF`; `src/components/ui/Button.jsx` — primary shadow `rgba(198,255,61,0.2)` → `rgba(79,140,255,0.2)`; `src/pages/Projects.jsx` — pill shadow `rgba(198,255,61,0.25)` → `rgba(79,140,255,0.25)`; `src/components/ui/CustomCursor.jsx` — two `#C6FF3D` and `rgba(198,255,61,0.4)` → `#4F8CFF` / `rgba(79,140,255,0.4)`.
      Files: src/components/avatar/Avatar3D.jsx, src/components/avatar/ProceduralBoy.jsx, src/components/ui/Button.jsx, src/pages/Projects.jsx, src/components/ui/CustomCursor.jsx
      Verify: `npm run build` succeeds, AND grep for `C6FF3D` and `198, ?255, ?61` across `src/` returns ZERO matches.

- [ ] 3. Rewrite `src/data/profile.js` content to match the real resume: bio (paraphrased professional summary, no "Tavern"), `location:"Rawalpindi, Pakistan"`, `phone:""`, honest `stats` (e.g. `3.84` CGPA, `15+` GitHub Projects, `1` Software Engineering Internship), socials = GitHub + LinkedIn only (remove X/Twitter), and ADD `voiceIntro` with the exact intro script. Keep all existing keys the components read (name, firstName, lastName, role, tagline, shortIntro, status, city, country, timezone, email, resumeUrl, services). Keep services but drop fabricated "60fps" language if trivially editable; honesty over flourish.
      Files: src/data/profile.js
      Verify: `npm run build` succeeds; grep `profile.js` for `Tavern` and `X / Twitter` returns zero; grep returns `voiceIntro` present and `phone: ""`.

- [ ] 4. Rewrite `src/data/experience.js`: remove the fabricated "Tavern" entry; keep one work entry — Software Engineer Intern, Planet Beyond Pvt. Ltd, Jul 2026 – Sep 2026, Islamabad/Rawalpindi, Pakistan — with highlights/tags from the resume (Java, Spring Boot, Kafka, Docker, CI/CD, Jenkins, Kubernetes fundamentals, React.js, React Native, Linux). Update education to BSCS (In Progress) PMAS Arid Agriculture University Rawalpindi, 09/2023–05/2027 (expected), CGPA 3.84/4.00, 6 semesters completed. Keep the exact field shape consumed by `Experience.section.jsx` (company, role, duration, location, isCurrent, description, highlights[], tags[]; edu: degree, institution, location, duration, details).
      Files: src/data/experience.js
      Verify: `npm run build` succeeds; grep `experience.js` for `Tavern` returns zero.

- [ ] 5. Align `src/data/skills.js` to the real resume skill set across the 4 categories, keeping the `{number,title,description,skills:[{name,category,level}]}` shape and the `marqueeSkills` array. Languages C++/Java/Python/JavaScript; Web HTML5/CSS3/React/Tailwind/PHP/Spring Boot/React Native; DBs MySQL/SQL; Core DS/Algorithms/OOP/File Handling; Networking (Computer Networks, IP Addressing, VLANs, Socket Programming); Tools Git/GitHub/VS Code/Docker/Jenkins/Kubernetes (fundamentals)/Cisco Packet Tracer/IntelliJ/Android Studio. Keep a "Creative Web & 3D" category (Three.js/R3F) with honest levels (Intermediate/Proficient, not all Advanced).
      Files: src/data/skills.js
      Verify: `npm run build` succeeds.

- [ ] 6. Rewrite `src/data/projects.js` to the 6 real repos in order, renumbered "01".."06", keeping the full case-study object shape and the `getProjectBySlug`/`getAdjacentProjects` exports. Slugs: multi-client-chat, bank-management, secure-voting, online-shopping-cart, student-management, weather-application. Use ONLY the 4 existing SVGs (bank-management.svg, multi-client-chat.svg, shopping-cart.svg, vesper-calculator.svg) — reuse closest for secure-voting (bank-management.svg), student-management (multi-client-chat.svg), weather-application (shopping-cart.svg). `live:null` for all. Honest copy, no invented metrics. GitHub URLs exactly as specified (double-i). featured: 1-4 true, 5-6 false.
      Files: src/data/projects.js
      Verify: `npm run build` succeeds; `/projects` and each `/projects/:slug` render (dev check); grep confirms no reference to a non-existent SVG filename.

- [ ] 7. Update the hardcoded project count in `src/pages/ProjectDetail.jsx` from `{project.number} / 04` to `{project.number} / 06`.
      Files: src/pages/ProjectDetail.jsx
      Verify: `npm run build` succeeds; grep `ProjectDetail.jsx` for `/ 04` returns zero.

- [ ] 8. Add a `useSpeech` hook to `src/hooks/index.js` wrapping `window.speechSynthesis`: `speak(text)` cancels ongoing speech, creates a `SpeechSynthesisUtterance`, picks an en-US/en-GB voice (handle async `voiceschanged`), sets rate ~0.95 / pitch ~1.0, tracks `speaking` state, exposes `stop()`; `supported` flag false when `speechSynthesis` is undefined. Guard all `window` access for SSR-safety consistent with the existing hooks.
      Files: src/hooks/index.js
      Verify: `npm run build` succeeds.

- [ ] 9. Wire the speaking intro into `src/components/sections/Hero.section.jsx`: use `useSpeech`, add a visible control button near the avatar panel labeled "▶ Hear intro" / "⏸ Stop" (styled with existing `Button`, blue accent), `aria-label` set; add a one-time `document` click/keydown listener that triggers `speak(profile.voiceIntro)` on first user gesture then removes itself; add a subtle "Speaking…" pulse chip (accent color) while speaking; hide the button when `!supported`; do not loop; respect reduced motion for the pulse.
      Files: src/components/sections/Hero.section.jsx
      Verify: `npm run build` succeeds; manual dev check — button appears, speaks once, toggles label, no crash when speechSynthesis absent.

- [ ] 10. Final integration pass: run the full build and lint, start dev, click through Home (Hero voice button + 3D avatar blue light), /projects (6 cards, filters), and several /projects/:slug case studies including prev/next nav. Confirm no lime remains and no console errors.
      Files: (verification only)
      Verify: `npm run build` and `npm run lint` both pass; grep for `C6FF3D` / `198, ?255, ?61` / `0A0A0C` / `111114` / `17171B` across `src/` returns zero; all routes render.

Grep cleanup targets (must all return zero in `src/` at the end):
`C6FF3D`, `198, ?255, ?61`, `0A0A0C`, `111114`, `17171B`, `Tavern`, `X / Twitter`, `/ 04` (in ProjectDetail.jsx).
