// Avatar conversation knowledge base + local responder.
//
// This answers visitor questions from the REAL portfolio data only (profile,
// skills, experience, education, projects, certifications). It invents nothing.
// Everything a visitor-facing avatar says is configurable here.
//
// This is an offline, client-side responder (no API keys, nothing leaked). To
// plug in a real conversational AI later, POST the question to your own backend
// endpoint and feed the reply into the same speak()/caption pipeline — the UI is
// already decoupled from this responder via getAvatarResponse().

import { profile } from './profile';
import { skillCategories } from './skills';
import { experiences, education } from './experience';
import { projects } from './projects';

// Configurable greeting shown when the conversation opens.
export const avatarGreeting =
  "Hey there! Welcome to my portfolio. I'm glad you're here. Feel free to explore my projects, learn about my skills, or ask me anything about my work.";

// Suggested quick prompts surfaced in the UI.
export const avatarSuggestions = [
  'Who are you?',
  'What are your skills?',
  'Tell me about your projects',
  'What are your future interests?',
  'What are your qualifications?',
  'What is your experience?',
  'Any certifications?',
  'How can I contact you?',
];

const allSkillNames = skillCategories.flatMap((c) => c.skills.map((s) => s.name));

// Full, "best of the best" rundown of the uploaded projects. Covers the top
// projects (featured first, then the rest up to a sensible limit) so visitors
// hear real titles like Awaaz Pakistan, each with what it is and its tech.
function describeProjects() {
  const ordered = [
    ...projects.filter((p) => p.featured),
    ...projects.filter((p) => !p.featured),
  ];
  const list = ordered.slice(0, 7);
  const intro = `I've built ${projects.length} projects across web, backend, and systems. Here are some of my best: `;
  const lines = list.map((p) => {
    const tech = (p.tags || []).slice(0, 3).join(', ');
    const what = p.subtitle || p.summary || '';
    return `${p.title} — ${what}${tech ? ` (${tech})` : ''}.`;
  });
  return (
    intro +
    lines.join(' ') +
    ` And more. You can open any of them in the Selected Work section for a full case study.`
  );
}

// Keyword -> project slug map for recognizing a SPECIFIC named project.
const projectKeywords = [
  { slug: 'awaaz-pakistan', words: ['awaaz', 'pakistan', 'civic', 'hacktoberfest', 'open source', 'open-source'] },
  { slug: 'ecommerce-marketplace', words: ['ecommerce', 'e-commerce', 'commerce', 'marketplace', 'shop backend'] },
  { slug: 'multi-client-chat', words: ['chat', 'socket', 'messaging', 'tcp'] },
  { slug: 'bank-management', words: ['bank', 'banking'] },
  { slug: 'secure-voting', words: ['voting', 'vote', 'ballot', 'election', 'cnic'] },
  { slug: 'online-shopping-cart', words: ['shopping', 'cart', 'storefront'] },
  { slug: 'library-management', words: ['library', 'books', 'borrow'] },
  { slug: 'student-management', words: ['student', 'attendance', 'results'] },
  { slug: 'weather-application', words: ['weather', 'forecast', 'openweather'] },
  { slug: 'airline-management', words: ['airline', 'flight', 'booking', 'ticket'] },
  { slug: 'snake-game', words: ['snake', 'game', 'turtle'] },
];

// Additional real public GitHub repos not featured in the main projects grid,
// so the avatar can still answer about them accurately and point to the repo.
// Descriptions mirror the actual GitHub repo descriptions.
const extraRepos = [
  {
    words: ['to-do', 'to do', 'todo', 'task list', 'task manager'],
    title: 'To-Do List',
    text: 'To-Do List: a simple, responsive to-do web app built with HTML, CSS, and JavaScript. It lets users add, delete, and manage daily tasks, with data persistence via localStorage so tasks survive page reloads. Tech stack: HTML, CSS, JavaScript, localStorage.',
    github: 'https://github.com/muhammadattiique/To-Do-List',
  },
  {
    words: ['registration form', 'registration', 'student form', 'sign up form'],
    title: 'Student Registration Form',
    text: 'Student Registration Form: an HTML, CSS, and JavaScript form that captures student details like name, father name, gender, qualification, and country, and displays the data dynamically. Tech stack: HTML, CSS, JavaScript.',
    github: 'https://github.com/muhammadattiique/Student-Registation-Form',
  },
  {
    words: ['vesper', 'calculator', '3d calculator'],
    title: 'Vesper 3D Calculator',
    text: 'Vesper is a visually immersive React web app that reimagines the standard calculator as a sleek, cinematic 3D experience, blending functional utility with a modern interface. Tech stack: React, JavaScript, 3D web.',
    github: 'https://github.com/muhammadattiique/Vesper_3D_Calculator',
  },
  {
    words: ['frontend internship', 'internship tasks', 'frontend development internship'],
    title: 'Frontend Development Internship',
    text: 'Frontend Development Internship: a collection of daily frontend tasks and assignments completed during my internship, featuring responsive layouts, modern CSS techniques, and interactive UI components. Tech stack: HTML, CSS, JavaScript.',
    github: 'https://github.com/muhammadattiique/Frontend_Development_Internship',
  },
];

// If the question clearly names a specific project, answer about just that one
// in detail. Returns null when no specific project is matched.
function describeSpecificProject(q) {
  // Featured / main-grid projects first.
  const hit = projectKeywords.find((pk) => pk.words.some((w) => q.includes(w)));
  if (hit) return getProjectDetail(hit.slug);
  // Then the extra real repos not in the main grid.
  const extra = extraRepos.find((r) => r.words.some((w) => q.includes(w)));
  if (extra) return `${extra.text} The code is on my GitHub at ${extra.github}.`;
  return null;
}

// --- Project picker API (used by the chat UI) -----------------------------

// Lightweight list for rendering the clickable project buttons (featured first).
export const projectList = [
  ...projects.filter((p) => p.featured),
  ...projects.filter((p) => !p.featured),
].map((p) => ({ slug: p.slug, title: p.title }));

// Detailed, spoken-friendly answer for a single project by slug. Pulls directly
// from the project's GitHub-derived data: what it is, the PROBLEM it solves, the
// solution/outcome, its TECH STACK, and the repo link.
export function getProjectDetail(slug) {
  const p = projects.find((x) => x.slug === slug);
  if (!p) return null;

  const tech = (p.tags || []).join(', ');
  const parts = [];

  // What it is
  parts.push(`${p.title}.`);
  parts.push(p.summary || p.subtitle || '');

  // The problem it solves
  if (p.challenge) parts.push(`The problem it solves: ${p.challenge}`);

  // How it's solved / key outcome
  if (p.solution) {
    parts.push(`How I solved it: ${p.solution}`);
  } else if (Array.isArray(p.results) && p.results.length) {
    parts.push(`Key outcomes: ${p.results.slice(0, 2).join('; ')}.`);
  }

  // Tech stack
  if (tech) parts.push(`Tech stack: ${tech}.`);

  // Role + repo link
  if (p.role) parts.push(`My role was ${p.role}.`);
  if (p.github) parts.push(`The code is on my GitHub at ${p.github}.`);

  return parts.filter(Boolean).join(' ');
}

// Prompt shown when the visitor asks about projects generally — the UI pairs
// this with clickable buttons for every project.
export const projectPickerPrompt =
  `I've worked on ${projects.length} projects. Which one would you like to know about? Pick any below.`;

// Intent rules: ordered; first whose keywords match wins. Each builds an answer
// string from live data so it stays truthful and in sync with the portfolio.
const intents = [
  {
    keywords: ['who are you', 'introduce', 'about you', 'yourself', 'your name'],
    answer: () =>
      `I'm ${profile.name}, a ${profile.role} based in ${profile.location}. ${profile.shortIntro}`,
  },
  {
    keywords: ['skill', 'tech', 'stack', 'technolog', 'language', 'tools', 'what can you do'],
    answer: () =>
      `My core skills span ${allSkillNames.slice(0, 10).join(', ')}, and more. I work across frontend, backend, and a bit of creative 3D web.`,
  },
  {
    keywords: ['project', 'work', 'built', 'build', 'portfolio', 'repo', 'made', 'app'],
    answer: () => describeProjects(),
  },
  {
    keywords: [
      'future', 'interest', 'goal', 'aspir', 'next', 'plan', 'passion',
      'cyber', 'security', 'ai', 'ml', 'machine learning', 'artificial intelligence',
      'want to', 'dream', 'direction',
    ],
    answer: () =>
      profile.futureInterests ||
      "I'm focused on growing in cybersecurity and AI/ML, building on my Computer Science background.",
  },
  {
    keywords: ['experience', 'job', 'intern', 'company', 'worked', 'career'],
    answer: () => {
      const current = experiences.find((e) => e.isCurrent) || experiences[0];
      const prev = experiences.find((e) => !e.isCurrent);
      let out = `Currently I'm a ${current.role} at ${current.company} (${current.duration}).`;
      if (prev) out += ` Before that I was a ${prev.role} at ${prev.company} (${prev.duration}).`;
      return out;
    },
  },
  {
    keywords: ['qualification', 'qualified', 'credential', 'background', 'are you qualified'],
    answer: () =>
      profile.qualificationSummary ||
      `I'm a Computer Science undergraduate at ${education[0]?.institution}.`,
  },

  {
    keywords: ['certif', 'course', 'achievement', 'award', 'hackathon', 'won', 'credential'],
    answer: () => {
      const certs = (profile.certifications ?? []).map((c) => `${c.title} (${c.issuer})`);
      const achievements = (profile.achievements ?? []).map((a) => a.title);
      const parts = [];
      if (certs.length) parts.push(`Certifications: ${certs.join(', ')}.`);
      if (achievements.length) parts.push(`Achievements: ${achievements.join(', ')}.`);
      return parts.join(' ') || 'I have several certifications listed in the Certifications section.';
    },
  },
  {
    keywords: ['contact', 'email', 'hire', 'reach', 'connect', 'linkedin', 'github', 'available'],
    answer: () => {
      const github = profile.socials.find((s) => s.label === 'GitHub');
      return `You can email me at ${profile.email}. I'm also on GitHub (${github?.username}) and LinkedIn. I'm currently ${profile.status.toLowerCase()}.`;
    },
  },
  {
    keywords: ['hello', 'hi', 'hey', 'salam', 'greet'],
    answer: () => `Hello! I'm ${profile.name}. Ask me about my skills, projects, experience, qualifications, or how to get in touch.`,
  },
  {
    keywords: ['thank', 'thanks', 'bye', 'goodbye'],
    answer: () => `Thanks for stopping by! Feel free to explore the rest of the portfolio or reach out any time.`,
  },
];

// Honest fallback when nothing matches — never fabricates an answer.
const fallback = () =>
  `I don't have an answer to that from my portfolio. Try asking about my skills, projects, experience, qualifications, certifications, or contact details.`;

/**
 * Resolve a visitor's question to an answer string, using only portfolio data.
 * @param {string} question
 * @returns {string}
 */
// True when the question is a GENERAL projects ask (vs. a specific project).
// The chat UI uses this to render the clickable project picker.
export function isProjectsQuery(question) {
  const q = (question || '').toLowerCase().trim();
  if (!q) return false;
  // A specific named project (featured OR an extra repo) is NOT a general query.
  if (projectKeywords.some((pk) => pk.words.some((w) => q.includes(w)))) {
    return false;
  }
  if (extraRepos.some((r) => r.words.some((w) => q.includes(w)))) {
    return false;
  }
  return /\b(projects?|portfolio|work|built|build|made|repos?)\b/.test(q);
}

export function getAvatarResponse(question) {
  const q = (question || '').toLowerCase().trim();
  if (!q) return fallback();

  // --- Projects handled FIRST (before generic intents) ---
  // General projects ask → the picker prompt (UI shows buttons for all 11).
  if (isProjectsQuery(q)) {
    return projectPickerPrompt;
  }
  // Specific named project ("the chat app", "awaaz pakistan", "banking") → that
  // one in detail.
  const specific = describeSpecificProject(q);
  if (specific) {
    return specific;
  }

  for (const intent of intents) {
    if (intent.keywords.some((k) => q.includes(k))) {
      return intent.answer();
    }
  }
  return fallback();
}
