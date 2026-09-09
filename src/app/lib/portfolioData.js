import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "src", "data");

function ensureDir() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
}

function readFile(name) {
  ensureDir();
  const filePath = path.join(dataDir, `${name}.json`);
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function writeFile(name, data) {
  ensureDir();
  const filePath = path.join(dataDir, `${name}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// ─── Skills ──────────────────────────────────────────────────────────────────
export function getSkills() {
  const saved = readFile("skills");
  if (saved && saved.technical && saved.technical.length > 0) return saved;
  return {

    technical: [
      { id: 1, name: "Next.js", percent: 85, class: "nextjs", level: "Advanced", capabilities: "SSR/SSG, App Router, API routes & authentication" },
      { id: 2, name: "React.js", percent: 85, class: "reactjs", level: "Advanced", capabilities: "Component architecture, state management & hooks" },
      { id: 3, name: "Node.js & Express", percent: 80, class: "nodejs", level: "Intermediate", capabilities: "REST APIs, server middleware & JWT auth" },
      { id: 4, name: "MongoDB & Mongoose", percent: 80, class: "mongodb", level: "Intermediate", capabilities: "Database design, schema modeling & CRUD" },
      { id: 5, name: "JavaScript (ES6+)", percent: 88, class: "javascript", level: "Advanced", capabilities: "Async/await, ES modules, DOM & Fetch API" },
      { id: 6, name: "CSS3 & HTML5", percent: 90, class: "css", level: "Advanced", capabilities: "Responsive layouts, glassmorphic UI & animations" },
      { id: 7, name: "Git & GitHub", percent: 85, class: "git", level: "Intermediate", capabilities: "Version control, branching & pull requests" },
    ],
    professional: [
      { id: 1, name: "Problem Solving", percent: 85 },
      { id: 2, name: "Clean Architecture", percent: 85 },
      { id: 3, name: "Team Communication", percent: 80 },
      { id: 4, name: "Project Delivery", percent: 75 },
    ],
    tools: ["VS Code", "GitHub", "Vercel", "MongoDB Atlas", "Postman", "npm / npx", "Cloudinary"],
  };
}

export function saveSkills(data) {
  writeFile("skills", data);
}

// ─── Projects ─────────────────────────────────────────────────────────────────
export function getProjects() {
  const saved = readFile("projects");
  if (saved.length > 0) return saved;
  return [
    {
      id: 1, category: "product", img: "/images/image2.jpeg",
      title: "Elevare Digital Store", role: "Full-Stack Developer",
      description: "A full-featured e-commerce platform with product catalog, shopping cart, secure checkout, and a complete admin panel for inventory and order management.",
      tech: ["Next.js", "MongoDB", "Node.js", "NextAuth"],
      problem: "The client needed an online store they could manage themselves without relying on a developer for every update.",
      features: ["Product catalog with filters", "Cart with localStorage sync", "Admin CRUD panel", "JWT-based auth", "Responsive on all devices"],
      result: "Live store managing 50+ SKUs with daily orders.",
      link: "#", github: "#",
    },
    {
      id: 2, category: "web", img: "/images/image3.jpeg",
      title: "CartifyOutlet E-commerce Platform", role: "Full-Stack Developer",
      description: "A full-stack e-commerce platform built to manage product listings, user authentication, and order workflows with a seamless shopping experience.",
      tech: ["Next.js", "Node.js", "MongoDB", "NextAuth", "JWT"],
      problem: "The business needed a complete online store to handle product management, user accounts, and secure checkout without relying on third-party limitations.",
      features: ["User authentication with Google OAuth and JWT", "Product listing & category management", "Cart and checkout system", "Order tracking and user dashboard", "Admin panel for product and order control"],
      result: "Delivered a complete e-commerce workflow enabling users to browse, purchase, and manage orders efficiently.",
      link: "https://www.cartifyoutlet.com/", github: "#",
    },
    {
      id: 3, category: "inter", img: "/images/image1.jpeg",
      title: "DaaSForge Admin Dashboard", role: "Frontend Developer (Contributor)",
      description: "Contributed frontend modules to a company platform — data tables, chart views, and responsive layout improvements for the admin interface.",
      tech: ["Next.js", "React", "REST API", "Chart.js"],
      problem: "The team needed a unified data management interface that non-technical users could navigate comfortably.",
      features: ["Role-based access views", "Interactive charts", "Filterable data tables", "CSV export", "Fully responsive"],
      result: "Platform deployed and used daily by the DaaSForge team.",
      link: "https://daas-forge.vercel.app/", github: "#",
    },
    {
      id: 4, category: "product", img: "/images/image5.jpeg",
      title: "LaanCer — Freelancer Platform", role: "Frontend Developer",
      description: "Landing page and project showcase UI for a Next.js freelancer marketplace platform.",
      tech: ["Next.js", "React"],
      problem: "The startup needed a polished landing page that communicated their value proposition clearly to both clients and freelancers.",
      features: ["Hero with CTA", "Feature highlights section", "Freelancer profile cards", "Fully responsive"],
      result: "Live at laancer.vercel.app with positive stakeholder feedback.",
      link: "https://laancer.vercel.app/", github: "#",
    },
    {
      id: 5, category: "inter", img: "/images/image6.jpeg",
      title: "Libaas e Zauq — Fashion Store", role: "Frontend Developer",
      description: "Complete UI for a Pakistani fashion e-commerce brand — product pages, collections grid, and responsive mobile layout built from scratch.",
      tech: ["Next.js", "CSS3", "React"],
      problem: "The brand had no online presence; they needed a store that reflected their aesthetic and worked well on mobile.",
      features: ["Product collection grid", "Category filtering", "Mobile-first layout", "Fast page loads"],
      result: "Live at libaasezauq.shop; drives consistent organic traffic.",
      link: "https://www.libaasezauq.shop", github: "#",
    },
    {
      id: 6, category: "web", img: "/images/image4.jpeg",
      title: "DaaS Tech Admin Dashboard", role: "Full Stack Developer",
      description: "A scalable admin dashboard developed for DaaS Tech to manage clients, services, and digital projects efficiently through a centralized system.",
      tech: ["Next.js", "Node.js", "MongoDB", "Express", "Redux"],
      problem: "The company lacked a centralized admin system to manage client projects, service orders, and internal workflows, causing delays and manual handling issues.",
      features: ["Admin dashboard with role-based access", "Client & project management system", "Service order tracking & status updates", "Secure authentication with JWT", "Real-time notifications for admin actions"],
      result: "Improved internal workflow efficiency and reduced manual management effort by over 60%.",
      link: "https://www.daastech.info/", github: "#",
    },
  ];
}

export function saveProjects(data) {
  writeFile("projects", data);
}

// ─── Services ─────────────────────────────────────────────────────────────────
export function getServices() {
  const saved = readFile("services");
  if (saved.length > 0) return saved;
  return [
    { id: "fullstack", title: "Full-Stack Web Development", icon: "FaDesktop", shortDesc: "End-to-end web apps built with Next.js, Node.js, and MongoDB — from database to deployment.", fullDesc: "I build complete web applications — not just the part users see. That means designing the database schema, writing the API, handling auth, and building a fast, responsive frontend. I use Next.js for the UI layer, Node.js/Express for the server, and MongoDB for the database. I deploy on Vercel and Railway and hand off with clear documentation." },
    { id: "dashboard", title: "Admin Dashboards", icon: "FaChartBar", shortDesc: "Custom management interfaces that give you real control over your data — no spreadsheets needed.", fullDesc: "Businesses need to manage products, orders, users, and reports without touching code. I build clean admin dashboards with real-time data tables, charts, search, filters, and role-based access. You get a tool that fits your workflow, not a generic template." },
    { id: "api", title: "REST API Development", icon: "FaCode", shortDesc: "Secure, well-structured APIs that power your frontend, mobile app, or third-party integrations.", fullDesc: "I design and build REST APIs using Node.js and Express, with proper route structure, JWT authentication, input validation, and error handling. I follow REST conventions, document endpoints, and make sure the API is easy to integrate whether you're connecting a web app, mobile app, or external service." },
    { id: "bugfix", title: "Bug Fixing & Performance", icon: "FaBug", shortDesc: "Slow page? Broken feature? I diagnose the issue and fix it — with proof that it's actually solved.", fullDesc: "I audit existing codebases for performance bottlenecks, memory leaks, broken API calls, and layout bugs. Whether it's a React re-rendering issue, a slow MongoDB query, or a CSS layout that breaks on mobile — I find the root cause and fix it properly, not patch it temporarily." },
  ];
}

export function saveServices(data) {
  writeFile("services", data);
}

// ─── Experience ───────────────────────────────────────────────────────────────
export function getExperience() {
  const saved = readFile("experience");
  if (saved.length > 0) return saved;
  return [
    {
      id: 1,
      period: "2024 – Present",
      title: "Freelance Frontend & Web Development",
      type: "Freelance / Client Work",
      points: [
        "Developed responsive frontend interfaces and product storefronts for web clients (e.g. Libaas e Zauq and DaaS Tech admin panel).",
        "Integrated REST APIs, component logic, and responsive layouts tailored to client specifications.",
        "Handled project deployments on Vercel, DNS configurations, and client review iterations.",
      ],
      tech: ["Next.js", "React", "Node.js", "MongoDB", "TailwindCSS"],
    },
    {
      id: 2,
      period: "2024 – Present",
      title: "Full-Stack Application Engineering",
      type: "Personal & Production Projects",
      points: [
        "Engineered full-stack applications including SkyPulse PRO (Weather PWA) and CartifyOutlet e-commerce platform.",
        "Implemented secure authentication (JWT + bcrypt), custom state management, and real-time PWA features.",
        "Built dynamic UI dashboards, interactive charting widgets, and RESTful middleware endpoints.",
        "Maintained structured commit history and documented codebases open-sourced on GitHub.",
      ],
      tech: ["Next.js", "React", "Node.js", "Express", "MongoDB", "PWA"],
    },
    {
      id: 3,
      period: "2023 – 2024",
      title: "Web Engineering Foundations & Practice Labs",
      type: "Learning & Open Source",
      points: [
        "Built 10+ practice applications from scratch to master modern full-stack web development.",
        "Contributed UI improvements and responsive styling fixes to company repository codebases.",
        "Practiced RESTful architecture, state management patterns, and git-based workflows.",
      ],
      tech: ["JavaScript (ES6+)", "React", "HTML5", "CSS3", "Git"],
    },
  ];
}

export function saveExperience(data) {
  writeFile("experience", data);
}
