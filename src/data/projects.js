// Project data for Muhammad Attique's portfolio
// Each project contains rich case-study details for the /projects/:slug route.
// Cover images reference ONLY the four SVGs that exist in public/projects/:
//   bank-management.svg, multi-client-chat.svg, shopping-cart.svg, vesper-calculator.svg
// The first four entries (featured: true) are the strongest, recruiter-appealing builds
// and are shown on the Home "Selected Work" grid; the rest appear via "See all".

export const projects = [
  {
    id: "ecommerce-marketplace",
    slug: "ecommerce-marketplace",
    number: "01",
    title: "E-Commerce Marketplace",
    subtitle: "A Java e-commerce marketplace backend covering product catalog, cart, and orders",
    year: "2025",
    role: "Backend Developer",
    client: "Personal Project",
    category: "Backend & Systems",
    featured: true,
    tags: ["Java", "Spring Boot", "REST API", "OOP"],
    coverImage: "/projects/shopping-cart.svg",
    gallery: ["/projects/shopping-cart.svg"],
    summary:
      "A Java-based e-commerce marketplace backend that models the core commerce flow — browsing a product catalog, managing a shopping cart, and placing orders — with a clean, object-oriented service layer.",
    overview:
      "This project implements the server-side foundation of an online marketplace in Java, following a Spring Boot style layered structure. It organizes products, carts, and orders into focused domain models and services so the commerce flow can be reasoned about and extended with confidence.",
    challenge:
      "Designing a maintainable domain model that keeps products, carts, and orders cleanly separated while still letting them work together through a predictable commerce flow.",
    solution:
      "Modeled the catalog, cart, and order concepts as distinct Java classes with a service layer that coordinates them. Structured the code around clear responsibilities so each part of the purchase journey stays readable and testable.",
    results: [
      "Supports product catalog browsing, cart management, and order placement",
      "Organized around a clean, layered object-oriented service structure",
      "Built with Java in a Spring Boot style backend architecture",
    ],
    github: "https://github.com/muhammadattiique/Ecommerce_Marketplace",
    live: null,
  },
  {
    id: "multi-client-chat",
    slug: "multi-client-chat",
    number: "02",
    title: "Multi-Client Chat Application",
    subtitle: "A concurrent TCP chat server and client built with Python sockets and threading",
    year: "2025",
    role: "Backend & Systems Developer",
    client: "Personal Project",
    category: "Networking & Concurrency",
    featured: true,
    tags: ["Python", "Socket Programming", "Multithreading", "TCP/IP"],
    coverImage: "/projects/multi-client-chat.svg",
    gallery: ["/projects/multi-client-chat.svg"],
    summary:
      "A socket-based chat application that lets multiple clients connect to a single server and exchange messages in real time using Python's socket and threading modules, with nickname assignment and message broadcast.",
    overview:
      "This project implements a client-server chat system in Python. A multi-threaded TCP server accepts several client connections at once, assigns each user a nickname, and broadcasts messages to everyone in the room, while each client runs its own send and receive loops so users can type and read concurrently.",
    challenge:
      "Supporting several clients at the same time without blocking, assigning nicknames, and handling clients that join or disconnect mid-session without crashing the server.",
    solution:
      "Used Python sockets for the network layer and a dedicated thread per connected client so reads and writes never block one another. Added nickname assignment and real-time broadcast, plus handling for disconnects so the server keeps running and other clients stay connected.",
    results: [
      "Multiple clients connect to one server and chat in real time",
      "Per-client threads keep sending, receiving, and broadcasting responsive",
      "Clients can disconnect without taking down the server or other sessions",
    ],
    github: "https://github.com/muhammadattiique/MultiClient-Chat-Application-Python-",
    live: null,
  },
  {
    id: "bank-management",
    slug: "bank-management",
    number: "03",
    title: "Bank Management System",
    subtitle: "A menu-driven C++ banking application using object-oriented design and file handling",
    year: "2024",
    role: "Software Developer",
    client: "Academic Project",
    category: "Object-Oriented Programming",
    featured: true,
    tags: ["C++", "OOP", "File Handling", "Data Structures"],
    coverImage: "/projects/bank-management.svg",
    gallery: ["/projects/bank-management.svg"],
    summary:
      "A C++ console application that simulates core banking operations such as creating accounts, deposits, withdrawals, and balance inquiries, with records persisted to files between runs.",
    overview:
      "A menu-driven banking system built in C++ to practice object-oriented programming and file-based persistence. Account data is modeled with classes and stored in files so information is retained between runs of the program.",
    challenge:
      "Keeping account records consistent across program runs and organizing the banking operations into a clean, maintainable class structure.",
    solution:
      "Modeled accounts and transactions with C++ classes, and used file read/write operations to save and load records. Structured the program around a clear menu so each operation maps to a focused function.",
    results: [
      "Supports account creation, deposits, withdrawals, and balance checks",
      "Account records persist between sessions through file handling",
      "Organized with object-oriented classes for readability and reuse",
    ],
    github: "https://github.com/muhammadattiique/Bank_Management_System-with-cpp",
    live: null,
  },
  {
    id: "secure-voting",
    slug: "secure-voting",
    number: "04",
    title: "Secure Voting System",
    subtitle: "A C++ voting application with CNIC authentication and Caesar cipher encryption",
    year: "2024",
    role: "Software Developer",
    client: "Academic Project",
    category: "Object-Oriented Programming",
    featured: true,
    tags: ["C++", "File Handling", "Caesar Cipher", "Authentication"],
    coverImage: "/projects/bank-management.svg",
    gallery: ["/projects/bank-management.svg"],
    summary:
      "A console voting system in C++ that authenticates voters by CNIC, prevents double-voting, encrypts stored data with a Caesar cipher, and lets an admin tally real-time party-wise results.",
    overview:
      "A C++ program that models a secure voting workflow. Voters are identified by their CNIC and can cast exactly one vote, stored records are obfuscated with a Caesar cipher, and an admin view tallies results party-by-party in real time as votes come in.",
    challenge:
      "Ensuring each voter can only vote once, protecting stored records from being read in plain text, and giving an admin an accurate running count of results.",
    solution:
      "Validated voters by CNIC and checked against existing records to block repeat voting. Applied a Caesar cipher when writing sensitive values to file, and added an admin tally that reads the records to report real-time party-wise counts.",
    results: [
      "Authenticates voters by CNIC and prevents double-voting",
      "Encrypts stored data with a Caesar cipher and persists via file handling",
      "Provides admin result tallying with real-time party-wise counts",
    ],
    github: "https://github.com/muhammadattiique/Secure_Voting_System-with-cpp",
    live: null,
  },
  {
    id: "awaaz-pakistan",
    slug: "awaaz-pakistan",
    number: "05",
    title: "Awaaz Pakistan",
    subtitle: "An open-source civic-tech platform contributed to during Hacktoberfest",
    year: "2024",
    role: "Open-Source Contributor",
    client: "Hacktoberfest / Community",
    category: "Web Applications",
    featured: false,
    tags: ["Open Source", "Hacktoberfest", "Web", "Collaboration"],
    coverImage: "/projects/shopping-cart.svg",
    gallery: ["/projects/shopping-cart.svg"],
    summary:
      "An open-source, collaborative civic-tech project — a 'voice of Pakistan' platform — contributed to during Hacktoberfest alongside the wider community.",
    overview:
      "Awaaz Pakistan is a community-driven, open-source web project aimed at giving people a shared civic platform. The work was done in the open during Hacktoberfest, collaborating with other contributors through issues and pull requests on a shared web codebase.",
    challenge:
      "Contributing effectively to an existing open-source codebase — understanding other people's code, following project conventions, and shipping changes that fit the maintainers' direction.",
    solution:
      "Worked within the project's web stack and contribution workflow: picking up issues, following the existing patterns, and submitting pull requests reviewed by maintainers during the Hacktoberfest collaboration.",
    results: [
      "Contributed to a live open-source civic-tech project during Hacktoberfest",
      "Collaborated through issues and pull requests on a shared web codebase",
      "Practiced real-world open-source workflow and code review",
    ],
    github: "https://github.com/muhammadattiique/HacktoberFest_Project-Awaaz_Pakistan-",
    live: null,
  },
  {
    id: "online-shopping-cart",
    slug: "online-shopping-cart",
    number: "06",
    title: "Online Shopping Cart",
    subtitle: "A web storefront with cart functionality built using HTML, CSS, JavaScript, and PHP",
    year: "2024",
    role: "Full-Stack Developer",
    client: "Academic Project",
    category: "Web Applications",
    featured: false,
    tags: ["HTML5", "CSS3", "JavaScript", "PHP", "MySQL"],
    coverImage: "/projects/shopping-cart.svg",
    gallery: ["/projects/shopping-cart.svg"],
    summary:
      "An online shopping cart web application where users can browse products, add items to a cart, and manage their selections, built with a PHP backend running on XAMPP.",
    overview:
      "A full-stack shopping cart built with HTML, CSS, and JavaScript on the frontend and PHP with a MySQL database on the backend, served locally through XAMPP. Users can view products and build up a cart of items.",
    challenge:
      "Connecting a browser-based frontend to a PHP backend and database so cart state and product data are handled on the server.",
    solution:
      "Built product and cart pages with HTML, CSS, and JavaScript, and used PHP with MySQL to handle product data and cart operations. Ran the stack locally on XAMPP during development.",
    results: [
      "Users can browse products and add them to a cart",
      "Frontend communicates with a PHP and MySQL backend",
      "Runs as a complete local stack on XAMPP",
    ],
    github: "https://github.com/muhammadattiique/Online_Shopping_Cart",
    live: null,
  },
  {
    id: "library-management",
    slug: "library-management",
    number: "07",
    title: "Library Management System",
    subtitle: "A PHP and MySQL system for managing books, members, and borrowing",
    year: "2024",
    role: "Full-Stack Developer",
    client: "Academic Project",
    category: "Web Applications",
    featured: false,
    tags: ["PHP", "MySQL", "Authentication", "CRUD"],
    coverImage: "/projects/bank-management.svg",
    gallery: ["/projects/bank-management.svg"],
    summary:
      "A web-based library management system built with PHP and MySQL that manages books, student accounts, borrowing records, and availability tracking behind an authenticated interface.",
    overview:
      "A library management application built with PHP and a MySQL database. It lets staff manage the book catalog and student accounts, record borrowing and returns, and track which titles are available, all behind a login-protected interface.",
    challenge:
      "Modeling the relationships between books, students, and borrowing records, and keeping availability accurate while restricting access through authentication.",
    solution:
      "Designed MySQL tables for books, students, and borrowing records, and used PHP to drive the create, read, update, and delete operations. Added authentication so only logged-in users can manage records.",
    results: [
      "Manages books, student accounts, and borrowing records",
      "Tracks title availability as items are borrowed and returned",
      "Protects management features behind user authentication",
    ],
    github: "https://github.com/muhammadattiique/Library_Management_System",
    live: null,
  },
  {
    id: "student-management",
    slug: "student-management",
    number: "08",
    title: "Student Management System",
    subtitle: "A Python application for managing students, courses, attendance, and results",
    year: "2024",
    role: "Software Developer",
    client: "Academic Project",
    category: "Applications",
    featured: false,
    tags: ["Python", "File Handling", "OOP", "Authentication"],
    coverImage: "/projects/multi-client-chat.svg",
    gallery: ["/projects/multi-client-chat.svg"],
    summary:
      "A Python application with an admin portal to manage students, courses, attendance, and results, plus a student login so learners can view their own records.",
    overview:
      "A student management program written in Python with two roles. An administrator manages students, courses, attendance, and results, while students can log in to view the records that belong to them.",
    challenge:
      "Separating administrator and student capabilities, and keeping student, course, attendance, and result data organized and consistent.",
    solution:
      "Structured the record-handling logic in Python with an admin workflow for managing students, courses, attendance, and results, and a student login path that exposes only each student's own records.",
    results: [
      "Admin manages students, courses, attendance, and results",
      "Students log in to view their own academic records",
      "Keeps record-handling logic organized and readable",
    ],
    github: "https://github.com/muhammadattiique/Student_Management_System",
    live: null,
  },
  {
    id: "weather-application",
    slug: "weather-application",
    number: "09",
    title: "Weather Application",
    subtitle: "A responsive web app with live weather, hourly data, and forecasts via OpenWeather",
    year: "2024",
    role: "Frontend Developer",
    client: "Personal Project",
    category: "Web Applications",
    featured: false,
    tags: ["HTML5", "CSS3", "JavaScript", "OpenWeather API"],
    coverImage: "/projects/shopping-cart.svg",
    gallery: ["/projects/shopping-cart.svg"],
    summary:
      "A responsive weather web application built with HTML, CSS, and JavaScript that lets users search a city and view current conditions, hourly data, and forecasts using the OpenWeather API.",
    overview:
      "A browser-based weather app that queries the OpenWeather API for a user-entered city and displays current conditions along with hourly and forecast data. Built with plain HTML, CSS, and JavaScript to practice working with a public REST API and asynchronous requests, with a responsive layout.",
    challenge:
      "Fetching live data from an external API, handling the asynchronous responses, and presenting current, hourly, and forecast views in a responsive interface.",
    solution:
      "Used JavaScript to call the OpenWeather API for the requested city, parsed the JSON responses, and updated the page with current, hourly, and forecast details. Styled the interface with responsive CSS for a clean layout across screen sizes.",
    results: [
      "Fetches live weather, hourly data, and forecasts via the OpenWeather API",
      "Handles asynchronous requests and updates the UI with the response",
      "Responsive layout built with plain HTML, CSS, and JavaScript",
    ],
    github: "https://github.com/muhammadattiique/Weather-Application",
    live: null,
  },
  {
    id: "airline-management",
    slug: "airline-management",
    number: "10",
    title: "Airline Management System",
    subtitle: "A C++ console airline booking system with admin and passenger portals",
    year: "2024",
    role: "Software Developer",
    client: "Academic Project",
    category: "Object-Oriented Programming",
    featured: false,
    tags: ["C++", "OOP", "File Handling", "Console"],
    coverImage: "/projects/bank-management.svg",
    gallery: ["/projects/bank-management.svg"],
    summary:
      "A C++ console airline booking system with separate admin and passenger portals, seat reservation, dynamic pricing, and support for domestic and international tickets.",
    overview:
      "An airline management application written in C++ for the console. Administrators manage flights while passengers book seats, with seat reservation, dynamic pricing, and handling for both domestic and international tickets.",
    challenge:
      "Modeling flights, seats, and tickets while keeping admin and passenger workflows distinct and pricing logic flexible across ticket types.",
    solution:
      "Built the system around C++ classes for flights, seats, and bookings, with separate admin and passenger menus. Added seat reservation, dynamic pricing, and distinct handling for domestic and international tickets.",
    results: [
      "Separate admin and passenger portals for managing and booking flights",
      "Supports seat reservation and dynamic ticket pricing",
      "Handles both domestic and international tickets",
    ],
    github: "https://github.com/muhammadattiique/Airline_Management_System-with-cpp",
    live: null,
  },
  {
    id: "snake-game",
    slug: "snake-game",
    number: "11",
    title: "Snake Game",
    subtitle: "A classic Snake game built in Python with turtle graphics and score tracking",
    year: "2023",
    role: "Software Developer",
    client: "Personal Project",
    category: "Applications",
    featured: false,
    tags: ["Python", "Turtle Graphics", "Game"],
    coverImage: "/projects/multi-client-chat.svg",
    gallery: ["/projects/multi-client-chat.svg"],
    summary:
      "A classic Snake game built in Python with the turtle graphics module, featuring arrow-key controls, score and high-score tracking, snake growth, border wrap, and self-collision game over.",
    overview:
      "A recreation of the classic Snake game using Python's turtle graphics. The player steers the snake with the arrow keys to eat food, grow longer, and chase a high score, with the game ending when the snake collides with itself.",
    challenge:
      "Handling real-time keyboard input, growing the snake correctly, wrapping movement at the borders, and detecting self-collision for a clean game-over.",
    solution:
      "Used Python's turtle graphics for rendering and input, tracking the snake's segments to handle growth and self-collision. Added score and high-score tracking and border wrap so the snake reappears on the opposite edge.",
    results: [
      "Arrow-key controls with snake growth and border wrap",
      "Tracks current score and persists a high score",
      "Ends the game on self-collision",
    ],
    github: "https://github.com/muhammadattiique/Snake_Game_Python",
    live: null,
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
