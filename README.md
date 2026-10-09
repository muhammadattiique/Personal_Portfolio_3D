# Muhammad Attique — Personal Portfolio

An editorial, minimal, personality-driven dark portfolio built with **React 18**, **Tailwind CSS**, and **Vite**, inspired by the **Logan** Framer design aesthetic. Features fluid clamp typography, numbered editorial sections, high-contrast monochrome palette with an electric lime accent (`#C6FF3D`), Lenis smooth scrolling, and an interactive **3D Avatar** with procedural fallback.

---

## 🌟 Highlights

- **Logan-Inspired Editorial Aesthetics**: Near-black canvas (`#0A0A0C`), off-white typography (`#EDEDED`), hairline borders (`rgba(255,255,255,0.08)`), uppercase numbered sections (`01`, `02`, `03...`), and a single electric lime accent (`#C6FF3D`).
- **Interactive 3D Avatar**: Built with `@react-three/fiber` and `@react-three/drei`. Includes smooth mouse & touch head tracking, breathing/floating idle animation, blinking, and a greeting wave.
- **Zero Asset Dependency**: If `/public/models/avatar.glb` is not present, a procedural stylized 3D clay character renders automatically with soft lighting and ambient occlusion.
- **Data-Driven Architecture**: All portfolio copy, statistics, experience, skills, and project case studies are maintained strictly in `/src/data/`—no need to touch UI components to edit your info.
- **Dedicated Case Study Pages**: Rich routing via React Router (`/projects/:slug`) detailing the engineering challenge, architectural solution, measured metrics, and adjacent project navigation.
- **Desktop Custom Cursor & Magnetic Buttons**: Smooth pointer tracking, magnetic spring physics, and an interactive "VIEW" cursor badge over project cards.
- **Fluid Typography**: Dynamic display sizing using CSS `clamp()` tailored for mobile (360px) to ultra-wide (1440px+) displays.
- **Engineered for Speed & SEO**: Route-level code-splitting, manual chunk optimization, Open Graph tags, JSON-LD structured data, and Lenis smooth scroll.

---

## 🛠️ Tech Stack

- **Framework**: React 18 (Functional components + Hooks) with Vite 5
- **Styling**: Tailwind CSS (Tailwind 3.4 with custom theme tokens)
- **Routing**: React Router v7 (`react-router-dom`)
- **3D Graphics**: Three.js, `@react-three/fiber`, `@react-three/drei`
- **Animation**: Framer Motion
- **Smooth Scroll**: Lenis
- **Icons**: Lucide React
- **Typography**: Google Fonts (Space Grotesk, Inter Tight, JetBrains Mono) + `@fontsource/geist`
- **Meta / SEO**: `react-helmet-async`

---

## 🚀 Quick Start

### 1. Installation

Ensure Node.js 18+ is installed.

```bash
# Navigate to the portfolio directory
cd Portfolio

# Install dependencies
npm install
```

### 2. Development Server

Start the local Vite dev server with Hot Module Replacement (HMR):

```bash
npm run dev
```

Visit `http://localhost:3000` (or the port specified in your console).

### 3. Production Build & Linting

```bash
# Typecheck and build optimized static assets into dist/
npm run build

# Run ESLint check
npm run lint

# Preview the production build locally
npm run preview
```

---

## 📁 Project Structure

```
Portfolio/
├── public/
│   ├── models/                # Optional 3D avatar GLB file (/models/avatar.glb)
│   ├── projects/              # Project mockups (16:10 SVGs or WebP screenshots)
│   │   ├── vesper-calculator.svg
│   │   ├── multi-client-chat.svg
│   │   ├── bank-management.svg
│   │   └── shopping-cart.svg
│   ├── favicon.svg            # Site favicon
│   ├── og-image.png           # Social share preview image
│   ├── robots.txt             # Search engine crawler directives
│   └── sitemap.xml            # XML sitemap for SEO
│
├── src/
│   ├── assets/                # Local static assets
│   ├── components/
│   │   ├── avatar/            # 3D Avatar implementation
│   │   │   ├── Avatar3D.jsx   # R3F Canvas, lighting, GLTF loader & fallback
│   │   │   └── ProceduralBoy.jsx # Procedural 3D clay character with mouse tracking
│   │   ├── layout/
│   │   │   ├── Navbar.jsx     # Minimal sticky header + mobile drawer
│   │   │   └── Footer.jsx     # Editorial footer + live PKT clock
│   │   ├── sections/          # Home page sections
│   │   │   ├── Hero.section.jsx
│   │   │   ├── SelectedWork.section.jsx
│   │   │   ├── About.section.jsx
│   │   │   ├── Skills.section.jsx
│   │   │   ├── Experience.section.jsx
│   │   │   ├── Services.section.jsx
│   │   │   └── Contact.section.jsx
│   │   └── ui/                # Reusable design tokens
│   │       ├── Button.jsx     # Polymorphic button / link
│   │       ├── MagneticButton.jsx
│   │       ├── SectionHeader.jsx
│   │       ├── Tag.jsx
│   │       ├── Marquee.jsx
│   │       ├── Reveal.jsx
│   │       ├── ProjectCard.jsx
│   │       └── CustomCursor.jsx
│   │
│   ├── data/                  # Single source of truth for portfolio content
│   │   ├── profile.js         # Name, bio, tagline, socials, stats & services
│   │   ├── projects.js        # Detailed case studies & mockups
│   │   ├── skills.js          # Categorized technical toolset & marquee items
│   │   └── experience.js      # Work history and academic education
│   │
│   ├── hooks/                 # Custom React hooks (mouse, mobile, reduced motion)
│   ├── utils/                 # Classname merge (cn) and time helpers
│   ├── pages/                 # Route views (Home, Projects, ProjectDetail, NotFound)
│   ├── App.jsx                # Layout shell, Lenis init, and route definitions
│   ├── index.css              # Tailwind base, dark palette, and Lenis rules
│   └── main.jsx               # Entry point with BrowserRouter & HelmetProvider
│
├── index.html                 # HTML shell, typography preconnect, and meta tags
├── tailwind.config.js         # Editorial design tokens and fluid clamp sizing
├── vite.config.js             # Rollup manual chunking and development options
└── package.json
```

---

## ✏️ How to Edit Your Data (`/src/data`)

All portfolio content is decoupled from layout components. To modify your information:

### 1. Personal Profile (`src/data/profile.js`)
Edit your name, role, bio paragraphs, social media links, statistics, and services:
```javascript
export const profile = {
  name: "Muhammad Attique",
  role: "Full-Stack Developer & Software Engineer",
  tagline: "Building high-performance web products, scalable systems, and tactile creative experiences.",
  email: "muhammadattiique.dev@gmail.com",
  location: "Islamabad / Rawalpindi, Pakistan",
  // ...
};
```

### 2. Work Experience & Education (`src/data/experience.js`)
Add or edit jobs and degrees:
```javascript
export const experiences = [
  {
    id: "company-slug",
    role: "Software Engineer",
    company: "Company Name",
    duration: "Oct 2026 – Present",
    isCurrent: true,
    location: "City, Country",
    description: "Overview of your impact.",
    highlights: ["Achievement 1", "Achievement 2"],
    tags: ["React", "TypeScript", "Node.js"],
  },
];
```

### 3. Skills & Technologies (`src/data/skills.js`)
Update categories and the marquee ticker list:
```javascript
export const marqueeSkills = [
  "React.js",
  "Tailwind CSS",
  "Three.js",
  "Java Spring Boot",
  "Docker",
];
```

---

## 📂 How to Add a New Project

1. Open `src/data/projects.js`.
2. Add a new project object to the `projects` array:

```javascript
{
  id: "my-new-app",
  slug: "my-new-app",
  number: "05",
  title: "My New Project Title",
  subtitle: "One sentence overview of the engineering feat",
  year: "2026",
  role: "Lead Full-Stack Engineer",
  client: "Client / Open Source",
  category: "Web Applications",
  featured: true,
  tags: ["React", "Next.js", "Tailwind CSS"],
  coverImage: "/projects/my-new-app.svg", // Or /projects/my-new-app.webp
  summary: "Brief executive summary.",
  overview: "Detailed multi-paragraph breakdown.",
  challenge: "What technical bottleneck or constraint had to be solved?",
  solution: "How did your architecture address the bottleneck?",
  results: [
    "Outcome metric #1 (e.g. 99.9% uptime)",
    "Outcome metric #2",
  ],
  github: "https://github.com/muhammadattiique/your-repo",
  live: "https://your-demo-url.com",
}
```

3. Place your mockup or screenshot in `/public/projects/my-new-app.svg` (or `.webp` / `.png`). A 16:10 aspect ratio (such as `1600x1000px`) is recommended.
4. The project will automatically appear on the Home page, the `/projects` catalog, and receive its own case study page at `/projects/my-new-app`!

---

## 🤖 How to Replace the 3D Avatar

The portfolio is designed to run seamlessly with zero 3D model downloads using an integrated procedural clay character (`ProceduralBoy.jsx`).

If you have a custom 3D model (e.g. from Ready Player Me, Blender, or Mixamo):

1. Export your 3D model as a binary glTF file named **`avatar.glb`**.
2. Place the file inside the `/public/models/` folder:
   ```
   public/
   └── models/
       └── avatar.glb
   ```
3. `Avatar3D.jsx` will detect `/models/avatar.glb` via `@react-three/drei`'s `useGLTF` and render it automatically in place of the procedural fallback!
4. If the model file is removed or encounters a parsing error, the component gracefully falls back to the procedural clay avatar.

---

## 📬 Contact Form Configuration

The Contact section includes support for **EmailJS** with automatic fallback simulation:

1. Create a free account at [EmailJS](https://www.emailjs.com/).
2. Create an Email Service (Gmail, Outlook, etc.) and an Email Template.
3. Configure your variables in `.env`:
   ```env
   VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
   VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
   ```
4. If left as `your_service_id`, the form simulates a successful transmission so you can preview interaction states without throwing errors.

---

## 🚀 Deployment Guide

### Deploying to Vercel (Recommended)
1. Push your repository to GitHub.
2. Sign in to [Vercel](https://vercel.com/) and click **"Add New Project"**.
3. Import your repository. Vercel automatically detects **Vite**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. In Project Settings > Environment Variables, add any `.env` keys if using EmailJS.
5. Click **Deploy**.

> **Note for SPA Routing on Vercel**: If direct URLs (like `/projects/vesper-calculator`) return 404 on hard reload, create a `vercel.json` file in the root:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Deploying to Netlify
1. Sign in to [Netlify](https://www.netlify.com/) and select **"Add new site" > "Import an existing project"**.
2. Set the build command to `npm run build` and publish directory to `dist`.
3. To support client-side routing, add a `public/_redirects` file:
   ```
   /*    /index.html   200
   ```
4. Click **Deploy Site**.

---

## 📄 License

MIT License © 2026 Muhammad Attique.
Feel free to use this project as inspiration or a template for your personal portfolio.