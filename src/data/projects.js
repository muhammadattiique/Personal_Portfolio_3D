// Project data for Muhammad Attique's portfolio
// Each project contains rich case-study details for the /projects/:slug route

export const projects = [
  {
    id: "multi-client-chat",
    slug: "multi-client-chat",
    number: "01",
    title: "Multi-Client Chat Application",
    subtitle: "A concurrent TCP chat server and client built with Python sockets and threading",
    year: "2025",
    role: "Backend & Systems Developer",
    client: "Personal Project",
    category: "Networking & Concurrency",
    featured: true,
    tags: ["Python", "Socket Programming", "Multithreading", "TCP/IP"],
    coverImage: "/projects/multi-client-chat.svg",
    gallery: [
      "/projects/multi-client-chat.svg"
    ],
    summary: "A socket-based chat application that lets multiple clients connect to a single server and exchange messages in real time using Python's socket and threading modules.",
    overview: "This project implements a client-server chat system in Python. The server accepts multiple client connections and broadcasts messages between them, while each client runs its own send and receive loops so users can type and read messages concurrently.",
    challenge: "Supporting several clients at the same time without blocking, and handling clients that join or disconnect during a session without crashing the server.",
    solution: "Used Python sockets for the network layer and dedicated threads for each connected client so reads and writes do not block one another. Added handling for client disconnects so the server keeps running and other clients stay connected.",
    results: [
      "Multiple clients can connect to one server and chat in real time",
      "Per-client threads keep sending and receiving responsive",
      "Clients can disconnect without taking down the server or other sessions"
    ],
    github: "https://github.com/muhammadattiique/MultiClient-Chat-Application-Python-",
    live: null,
  },
  {
    id: "bank-management",
    slug: "bank-management",
    number: "02",
    title: "Bank Management System",
    subtitle: "A console banking application in C++ using object-oriented design and file handling",
    year: "2024",
    role: "Software Developer",
    client: "Academic Project",
    category: "Object-Oriented Programming",
    featured: true,
    tags: ["C++", "OOP", "File Handling", "Data Structures"],
    coverImage: "/projects/bank-management.svg",
    gallery: [
      "/projects/bank-management.svg"
    ],
    summary: "A C++ console application that simulates core banking operations such as creating accounts, deposits, withdrawals, and balance inquiries, with records persisted to files.",
    overview: "A menu-driven banking system built in C++ to practice object-oriented programming and file-based persistence. Account data is modeled with classes and stored in files so information is retained between runs of the program.",
    challenge: "Keeping account records consistent across program runs and organizing the banking operations into a clean, maintainable class structure.",
    solution: "Modeled accounts and transactions with C++ classes, and used file read/write operations to save and load records. Structured the program around a clear menu so each operation maps to a focused function.",
    results: [
      "Supports account creation, deposits, withdrawals, and balance checks",
      "Account records persist between sessions through file handling",
      "Organized with object-oriented classes for readability and reuse"
    ],
    github: "https://github.com/muhammadattiique/Bank_Management_System-with-cpp",
    live: null,
  },
  {
    id: "secure-voting",
    slug: "secure-voting",
    number: "03",
    title: "Secure Voting System",
    subtitle: "A C++ voting application with CNIC-based authentication and Caesar cipher encryption",
    year: "2024",
    role: "Software Developer",
    client: "Academic Project",
    category: "Object-Oriented Programming",
    featured: true,
    tags: ["C++", "File Handling", "Caesar Cipher", "Authentication"],
    coverImage: "/projects/bank-management.svg",
    gallery: [
      "/projects/bank-management.svg"
    ],
    summary: "A console voting system in C++ that authenticates voters by CNIC, prevents duplicate votes, and stores records in files with Caesar cipher encryption applied to sensitive data.",
    overview: "A C++ program that models a basic secure voting workflow. Voters are identified by their CNIC, each voter can cast a single vote, and stored data is obfuscated using a Caesar cipher to practice simple encryption with file persistence.",
    challenge: "Ensuring each voter can only vote once and protecting stored data from being read in plain text, while keeping the system simple and file-based.",
    solution: "Validated voters by CNIC and checked against existing records to block repeat voting. Applied a Caesar cipher when writing sensitive values to file so records are not stored as plain text.",
    results: [
      "Authenticates voters by CNIC and blocks duplicate votes",
      "Applies Caesar cipher encryption to stored data",
      "Persists votes and voter records through file handling"
    ],
    github: "https://github.com/muhammadattiique/Secure_Voting_System-with-cpp",
    live: null,
  },
  {
    id: "online-shopping-cart",
    slug: "online-shopping-cart",
    number: "04",
    title: "Online Shopping Cart",
    subtitle: "A web storefront with cart functionality built using HTML, CSS, JavaScript, and PHP",
    year: "2024",
    role: "Full-Stack Developer",
    client: "Academic Project",
    category: "Web Applications",
    featured: true,
    tags: ["HTML5", "CSS3", "JavaScript", "PHP", "MySQL"],
    coverImage: "/projects/shopping-cart.svg",
    gallery: [
      "/projects/shopping-cart.svg"
    ],
    summary: "An online shopping cart web application where users can browse products, add items to a cart, and manage their selections, built with a PHP backend running on XAMPP.",
    overview: "A full-stack shopping cart built with HTML, CSS, and JavaScript on the frontend and PHP with a MySQL database on the backend, served locally through XAMPP. Users can view products and build up a cart of items.",
    challenge: "Connecting a browser-based frontend to a PHP backend and database so cart state and product data are handled on the server.",
    solution: "Built product and cart pages with HTML, CSS, and JavaScript, and used PHP with MySQL to handle product data and cart operations. Ran the stack locally on XAMPP during development.",
    results: [
      "Users can browse products and add them to a cart",
      "Frontend communicates with a PHP and MySQL backend",
      "Runs as a complete local stack on XAMPP"
    ],
    github: "https://github.com/muhammadattiique/Online_Shopping_Cart",
    live: null,
  },
  {
    id: "student-management",
    slug: "student-management",
    number: "05",
    title: "Student Management System",
    subtitle: "A Python application for managing student records and routine academic operations",
    year: "2024",
    role: "Software Developer",
    client: "Academic Project",
    category: "Applications",
    featured: false,
    tags: ["Python", "File Handling", "OOP"],
    coverImage: "/projects/multi-client-chat.svg",
    gallery: [
      "/projects/multi-client-chat.svg"
    ],
    summary: "A Python application that manages student records, allowing users to add, view, update, and remove student information through a simple interface.",
    overview: "A student management program written in Python to handle common record-keeping tasks. It lets users maintain a list of students and perform standard create, read, update, and delete operations on their records.",
    challenge: "Organizing student data and the operations on it so records stay consistent and the program is easy to extend.",
    solution: "Structured the record-handling logic in Python and provided clear options for adding, viewing, updating, and deleting student entries, keeping the code organized around each operation.",
    results: [
      "Supports adding, viewing, updating, and deleting student records",
      "Keeps record-handling logic organized and readable",
      "Provides a straightforward interface for managing student data"
    ],
    github: "https://github.com/muhammadattiique/Student_Management_System",
    live: null,
  },
  {
    id: "weather-application",
    slug: "weather-application",
    number: "06",
    title: "Weather Application",
    subtitle: "A web app that fetches live weather data from the OpenWeather API",
    year: "2024",
    role: "Frontend Developer",
    client: "Personal Project",
    category: "Web Applications",
    featured: false,
    tags: ["HTML5", "CSS3", "JavaScript", "OpenWeather API"],
    coverImage: "/projects/shopping-cart.svg",
    gallery: [
      "/projects/shopping-cart.svg"
    ],
    summary: "A weather web application built with HTML, CSS, and JavaScript that lets users search for a city and view current conditions using the OpenWeather API.",
    overview: "A browser-based weather app that queries the OpenWeather API for a user-entered city and displays the returned conditions. Built with plain HTML, CSS, and JavaScript to practice working with a public REST API and asynchronous requests.",
    challenge: "Fetching live data from an external API, handling the asynchronous response, and updating the interface with the returned weather details.",
    solution: "Used JavaScript to call the OpenWeather API for the requested city, parsed the JSON response, and updated the page with the current conditions. Styled the interface with CSS for a clean, readable layout.",
    results: [
      "Fetches live weather data for a searched city via the OpenWeather API",
      "Handles asynchronous requests and updates the UI with the response",
      "Built with plain HTML, CSS, and JavaScript"
    ],
    github: "https://github.com/muhammadattiique/Weather-Application",
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
