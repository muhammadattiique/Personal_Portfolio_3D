// Personal Profile data for Muhammad Attique
export const profile = {
  name: "Muhammad Attique",
  firstName: "Muhammad",
  lastName: "Attique",
  role: "Full-Stack Developer & Software Engineer",
  tagline: "Building high-performance web products, scalable systems, and tactile creative experiences.",
  shortIntro: "Full-Stack Developer based in Pakistan, focused on modern React interfaces, robust backend services, and interactive 3D web craft.",
  bio: [
    "I am a Computer Science undergraduate and software engineer with hands-on full-stack and backend experience. I enjoy building responsive React interfaces alongside dependable server-side systems, from microservices and event-driven pipelines to real-time socket applications.",
    "During a software engineering internship I worked across backend services, DevOps, and CI/CD, while continuing to strengthen my foundations in object-oriented programming, data structures and algorithms, and computer networks. I care about turning complex systems into clean, reliable products."
  ],
  // NOTE: "Ah-Teek" is an intentional phonetic respelling of the surname "Attique"
  // so that en-US text-to-speech pronounces it as "ah-TEEK" — two syllables,
  // stress on the second, with a hard "k" ending. The comma after "Muhammad" adds a
  // brief pause so the two names stay distinct, and the hyphen nudges the stress onto
  // the second syllable. This only affects the SPOKEN text, never the displayed name
  // (which stays "Muhammad Attique").
  voiceIntro: "Hi, I am Muhammad, Ah-Teek — a Full-Stack Developer and Software Engineer from Pakistan. I build high-performance web applications with React and Tailwind, scalable backend services with Java, Spring Boot, and Kafka, and interactive three-D experiences on the web. I love turning complex systems into clean, reliable products. Welcome to my portfolio — take a look at my work.",
  status: "Available for work",
  location: "Rawalpindi, Pakistan",
  city: "Rawalpindi",
  country: "Pakistan",
  timezone: "PKT (UTC+5)",
  email: "muhammadattiquetariq@gmail.com",
  phone: "",
  resumeUrl: "/MUHAMMAD_ATTIQUE_RESUME.pdf",
  socials: [
    { label: "GitHub", href: "https://github.com/muhammadattiique", username: "@muhammadattiique" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/muhammad-attique-45666b363", username: "in/muhammad-attique-45666b363" },
  ],
  stats: [
    { value: "3.84", label: "CGPA", description: "Computer Science undergraduate performance (out of 4.00)" },
    { value: "15+", label: "GitHub Projects", description: "Public repositories across web, systems & backend" },
    { value: "1", label: "SW Engineering Internship", description: "Backend, DevOps & CI/CD experience in industry" },
  ],
  // Certifications & achievements (shown in the Certifications section and used
  // by the avatar's portfolio Q&A knowledge base).
  certifications: [
    {
      title: "MERN Stack Development",
      issuer: "DigiSkills",
      type: "Certification",
      description: "Full-stack web development with MongoDB, Express, React, and Node.js.",
    },
    {
      title: "Artificial Intelligence Using Python",
      issuer: "DigiSkills",
      type: "Certification",
      description: "Applied AI and machine-learning fundamentals implemented in Python.",
    },
    {
      title: "Search Engine Optimization (SEO)",
      issuer: "DigiSkills",
      type: "Certification",
      description: "On-page and technical SEO, keyword strategy, and search ranking fundamentals.",
    },
  ],
  achievements: [
    {
      title: "AI Hackathon Winner",
      issuer: "AI Hackathon",
      type: "Achievement",
      description: "Won an AI Hackathon, building an AI-driven solution under a competitive, time-boxed challenge.",
    },
  ],
  // Spoken-friendly answer for "what are your future interests / goals" — rooted
  // in the Computer Science (BSCS) background, with a focus on cybersecurity and
  // AI/ML. Editable in one place.
  futureInterests:
    "Right now, as a Computer Science student, I'm specializing in general computing — building strong, broad foundations across software engineering, systems, and the web. Looking ahead, I want to grow into two areas I'm genuinely passionate about: cybersecurity and AI and machine learning. On the security side, I plan to go deeper into secure systems, authentication, encryption, and network security, building on my background in computer networks and socket programming. On the AI and ML side, I'm excited about training and applying machine-learning models and building real-world AI solutions — I already won an AI hackathon. My long-term goal is to combine the two: engineering intelligent systems that are also secure, reliable, and production-ready.",
  // Spoken-friendly answer for "what is your qualification / are you qualified".
  qualificationSummary:
    "I'm a Computer Science undergraduate, pursuing a Bachelor of Science in Computer Science at PMAS Arid Agriculture University Rawalpindi, expected to graduate in 2027, with a CGPA of 3.84 out of 4.00 and six semesters completed. Alongside the degree, I hold certifications in MERN Stack Development, Artificial Intelligence Using Python, and Search Engine Optimization from DigiSkills, and I'm an AI Hackathon winner. I also have hands-on industry experience from software engineering internships.",
  services: [
    {
      number: "01",
      title: "Frontend Engineering",
      description: "Modern, component-driven web applications built with React, Vite, and Tailwind CSS, with a focus on smooth, responsive interfaces and clean, maintainable code.",
      tags: ["React", "JavaScript", "Tailwind CSS", "Vite", "React Native"],
    },
    {
      number: "02",
      title: "Backend & Systems",
      description: "Scalable REST APIs and backend microservices engineered with Java, Spring Boot, Kafka, and Python, including event-driven and real-time socket-based systems.",
      tags: ["Java", "Spring Boot", "Kafka", "Python", "Microservices"],
    },
    {
      number: "03",
      title: "Creative Web & 3D",
      description: "Interactive spatial web experiences and real-time canvas graphics powered by Three.js, React Three Fiber, and the Web Audio API.",
      tags: ["Three.js", "R3F", "@react-three/drei", "WebGL", "Web Audio API"],
    },
    {
      number: "04",
      title: "DevOps & Delivery",
      description: "Containerized builds, automated pipelines, and reproducible Linux environments using Docker, Jenkins, Git workflows, and Kubernetes fundamentals.",
      tags: ["Docker", "Jenkins", "CI/CD", "Linux", "Kubernetes"],
    },
  ],
};
