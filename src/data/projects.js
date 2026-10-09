// Project data for Muhammad Attique's portfolio
// Each project contains rich case-study details for the /projects/:slug route

export const projects = [
  {
    id: "vesper-calculator",
    slug: "vesper-calculator",
    number: "01",
    title: "Vesper Spatial Calculator",
    subtitle: "Cinematic 3D spatial calculator with tactile haptic physics & WebGL optics",
    year: "2026",
    role: "Creative Developer & UI Engineer",
    client: "Creative Engineering Lab",
    category: "Creative Web & 3D",
    featured: true,
    tags: ["React", "Three.js", "Tailwind CSS", "Web Audio API", "Framer Motion"],
    coverImage: "/projects/vesper-calculator.svg",
    gallery: [
      "/projects/vesper-calculator.svg"
    ],
    summary: "A cinematic spatial computing calculator combining Three.js twilight optics, realistic glassmorphic refraction, and reactive audio synthesizer feedback.",
    overview: "Vesper rethinks the routine digital calculator by treating each input key as a tactile physical specimen suspended in 3D space. Built with React and Three.js, it translates mouse movement and touch gestures into dynamic camera parallax, ambient light caustics, and subtle micro-haptics generated directly in the browser via the Web Audio API.",
    challenge: "Maintaining a fluid 60 frames per second on both desktop and mobile while rendering real-time mesh deformation, transparent glass shaders, dynamic shadows, and high-frequency calculation state updates without frame drops.",
    solution: "Implemented an isolated R3F scene graph utilizing instanced meshes for numeric keys, throttled state updates through custom event buses, and built an interactive expression evaluation engine capable of displaying compound parenthetical math in real-time.",
    results: [
      "Consistent 60fps rendering across both mobile browsers and desktop monitors",
      "Zero external audio assets: procedural sound synthesis synthesized via Web Audio API oscillators",
      "Full keyboard navigation and accessible screen-reader calculation announcements"
    ],
    github: "https://github.com/muhammadattiique/Calculator-Using-Frontend-Development",
    live: "https://github.com/muhammadattiique/Calculator-Using-Frontend-Development", // TODO: Update with live demo URL if deployed
  },
  {
    id: "multi-client-chat",
    slug: "multi-client-chat",
    number: "02",
    title: "Multi-Client Chat System",
    subtitle: "Concurrent low-latency socket server with multithreaded stream multiplexing",
    year: "2026",
    role: "Backend & Systems Developer",
    client: "Systems Architecture Project",
    category: "Networking & Concurrency",
    featured: true,
    tags: ["Python", "Socket API", "Multithreading", "Network Protocols", "TCP/IP"],
    coverImage: "/projects/multi-client-chat.svg",
    gallery: [
      "/projects/multi-client-chat.svg"
    ],
    summary: "High-performance TCP socket server coordinating simultaneous bi-directional client channels with thread safety, message serializing, and fault tolerance.",
    overview: "This project implements a concurrent socket server from core OS primitives. Rather than relying on heavyweight application frameworks, it implements raw socket bindings, thread pooling, and custom message envelope parsing to manage multi-user chat rooms with negligible latency.",
    challenge: "Handling concurrent socket reads and writes across dozens of simultaneous clients without race conditions, memory leaks, or thread starvation when users disconnect unexpectedly.",
    solution: "Engineered a multithreaded worker model utilizing mutex locks on shared client registries, implemented heartbeat ping frames to identify zombie sockets, and provided deterministic cleanup routines upon connection termination.",
    results: [
      "Sub-millisecond local latency across concurrent connected client threads",
      "Robust fault tolerance with automatic socket cleanup and reconnect handling",
      "Clear ASCII-framed logging and diagnostics monitor for real-time traffic observation"
    ],
    github: "https://github.com/muhammadattiique/MultiClient-Chat-Application-Python-",
    live: null,
  },
  {
    id: "bank-management",
    slug: "bank-management",
    number: "03",
    title: "Bank Management System",
    subtitle: "Robust console banking engine with persistent file streams & ACID-like integrity",
    year: "2026",
    role: "Software Engineer",
    client: "Core Systems Software",
    category: "Object-Oriented Architecture",
    featured: true,
    tags: ["C++", "OOP", "File Streams", "Data Structures", "Algorithms"],
    coverImage: "/projects/bank-management.svg",
    gallery: [
      "/projects/bank-management.svg"
    ],
    summary: "Object-oriented banking console application delivering safe transaction logging, authenticated account operations, and persistent binary record storage.",
    overview: "A core C++ software suite built to simulate high-reliability transactional banking operations. The engine utilizes deep OOP hierarchies, custom binary serialization, and secure authentication schemas to ensure data consistency across multiple account lifecycles.",
    challenge: "Guaranteeing persistent file records remained uncorrupted across unexpected process termination, while maintaining fast random access retrieval for account balance queries.",
    solution: "Designed strict file pointer offsets and binary read/write streams with pre-operation checksum verifications, encapsulating customer identities within polymorphic account classes.",
    results: [
      "Zero record corruption during stress testing with abrupt interruptions",
      "Clean separation of business logic, authentication security, and I/O persistence layers",
      "Modular class architecture ready for compilation across Linux and Windows environments"
    ],
    github: "https://github.com/muhammadattiique/Bank_Management_System-with-cpp",
    live: null,
  },
  {
    id: "shopping-cart",
    slug: "shopping-cart",
    number: "04",
    title: "Online Shopping Cart",
    subtitle: "Reactive client-side e-commerce store with stateful inventory & fluid DOM updates",
    year: "2026",
    role: "Frontend Developer",
    client: "E-Commerce Prototype",
    category: "Web Applications",
    featured: true,
    tags: ["JavaScript (ES6+)", "HTML5", "CSS3", "DOM API", "State Management"],
    coverImage: "/projects/shopping-cart.svg",
    gallery: [
      "/projects/shopping-cart.svg"
    ],
    summary: "Interactive storefront interface featuring real-time cart computation, stock validation, promo code parsing, and fluid micro-animations.",
    overview: "A pure JavaScript e-commerce checkout interface built to showcase foundational DOM manipulation, custom event dispatching, and deterministic local storage synchronization without bloated external framework overhead.",
    challenge: "Managing complex asynchronous price recalculations, tax adjustments, and coupon deductions with instant visual feedback and flawless persistence across browser refreshes.",
    solution: "Built a centralized store state pattern that broadcasts mutation events to decoupled UI modules, synchronizing basket state to LocalStorage and executing smooth optimistic UI updates.",
    results: [
      "Instantaneous subtotal, tax, and discount recalibration with zero render delay",
      "Persistent cart state surviving browser reload and cross-tab actions",
      "Lightweight bundle under 35KB with instantaneous First Contentful Paint"
    ],
    github: "https://github.com/muhammadattiique/Online_Shopping_Cart",
    live: "https://github.com/muhammadattiique/Online_Shopping_Cart", // TODO: Update with live URL if hosted
  },
];

export function getProjectBySlug(slug) {
  return projects.find((p) => p.slug === slug || p.id === slug);
}

export function getAdjacentProjects(currentSlug) {
  const currentIndex = projects.findIndex((p) => p.slug === currentSlug || p.id === currentSlug);
  if (currentIndex === -1) return { prev: null, next: null };
  const prevIndex = (currentIndex - 1 + projects.length) % projects.length;
  const nextIndex = (currentIndex + 1) % projects.length;
  return {
    prev: projects[prevIndex],
    next: projects[nextIndex],
  };
}