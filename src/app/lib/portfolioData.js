import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "src", "data");

function ensureDir() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
}

function readFile(name) {
  try {
    const tmpPath = path.join("/tmp", `${name}.json`);
    if (fs.existsSync(tmpPath)) {
      return JSON.parse(fs.readFileSync(tmpPath, "utf-8"));
    }
  } catch {
    /* ignore read error */
  }

  try {
    ensureDir();
    const filePath = path.join(dataDir, `${name}.json`);
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }
  } catch {
    /* ignore tmp read error */
  }

  return [];
}

function writeFile(name, data) {
  // First try writing to project data directory (works on localhost)
  try {
    ensureDir();
    const filePath = path.join(dataDir, `${name}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    const tmpPath = path.join("/tmp", `${name}.json`);
    if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
    return;
  } catch {
    /* ignore local write error */
  }

  // Fallback write to /tmp on Vercel (read-only filesystem)
  try {
    const tmpPath = path.join("/tmp", `${name}.json`);
    fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2));
  } catch (error) {
    throw error;
  }
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
      { id: 1, name: "Responsive UI Development", level: "Expert", capabilities: "Mobile-first layouts, glassmorphism UI & smooth CSS animations" },
      { id: 2, name: "REST API Integration", level: "Advanced", capabilities: "JSON payloads, async fetch, error handling & state sync" },
      { id: 3, name: "Authentication & Security", level: "Advanced", capabilities: "JWT tokens, NextAuth, HTTP-Only cookies & role guards" },
      { id: 4, name: "Database Architecture", level: "Intermediate", capabilities: "Mongoose schemas, indexed queries, CRUD & data validation" },
      { id: 5, name: "Deployment & Maintenance", level: "Advanced", capabilities: "Vercel deployments, environment configs & git version control" },
      { id: 6, name: "Bug Fixing & Performance", level: "Advanced", capabilities: "Code auditing, re-render fixes & Lighthouse score optimization" },
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
      id: 1787643601718, category: "web", img: "/images/uploads/project-1787643597701.png",
      title: "SkyPulse PRO Weather PWA", role: "Lead Full-Stack Developer & UI/UX Designer",
      description: "SkyPulse PRO is a high-performance, real-time Progressive Web App (PWA) delivering accurate weather forecasts, interactive radar metrics, dynamic frosted glassmorphism themes, and AI-driven weather summaries.",
      tech: ["Next.js", "React", "TailwindCSS", "PWA", "OpenWeather API", "Chart.js", "Framer Motion"],
      problem: "Standard weather applications are often cluttered with ads, slow to load, and lack offline capabilities or real-time location precision.",
      features: ["Progressive Web App (PWA) with offline support & native mobile installation", "Real-time Geolocation Weather Tracking & City Search", "24-Hour Hourly & 7-Day Extended Weather Forecasts", "Dynamic Frosted Glassmorphism Theme (Adaptive Light & Dark Modes)", "Integrated AI Assistant for personalized daily weather insights"],
      result: "Achieved a 98+ Lighthouse performance rating, sub-second page loads, and a seamless PWA installation experience across iOS and Android devices.",
      link: "https://skyplusweather.vercel.app/", github: "https://github.com/AkmalDoghar/weather-app",
    },
    {
      id: 6, category: "web", img: "/images/uploads/project-1787644934308.png",
      title: "DaaS Tech Admin Dashboard", role: "Full-Stack Developer",
      description: "A scalable admin dashboard developed for DaaS Tech to manage clients, services, and digital projects efficiently through a centralized system.",
      tech: ["Next.js", "Node.js", "MongoDB", "Express", "Redux"],
      problem: "The company lacked a centralized admin system to manage client projects, service orders, and internal workflows, causing delays and manual handling issues.",
      features: ["Admin dashboard with role-based access", "Client & project management system", "Service order tracking & status updates", "Secure authentication with JWT", "Real-time notifications for admin actions"],
      result: "Streamlined internal admin workflows, unifying client records, order tracking, and project management into a single interface.",
      link: "https://daas-tech.vercel.app/", github: "https://github.com/Timigill/daas-tech",
    },
    {
      id: 5, category: "inter", img: "/images/uploads/project-1787643774271.png",
      title: "Libaas e Zauq — Fashion Store", role: "Frontend Developer",
      description: "Complete UI for a Pakistani fashion e-commerce brand — product pages, collections grid, and responsive mobile layout built from scratch.",
      tech: ["Next.js", "CSS3", "React"],
      problem: "The brand needed an online storefront that reflected their aesthetic, showcased product categories clearly, and worked seamlessly on mobile.",
      features: ["Product collection grid", "Category filtering", "Mobile-first layout", "Fast page loads"],
      result: "Deployed live e-commerce platform with product collections, responsive mobile navigation, and optimized assets.",
      link: "https://www.libaasezauq.shop", github: "https://github.com/Timigill/LibaaSeZauq",
    },
    {
      id: 4, category: "product", img: "/images/uploads/project-1787643760794.png",
      title: "LaanCer — Freelancer Platform", role: "Frontend Developer",
      description: "Landing page and project showcase UI for a Next.js freelancer marketplace platform.",
      tech: ["Next.js", "React"],
      problem: "The startup needed a polished landing page that communicated their value proposition clearly to both clients and freelancers.",
      features: ["Hero with CTA", "Feature highlights section", "Freelancer profile cards", "Fully responsive"],
      result: "Deployed landing page and platform UI with responsive layout and clear stakeholder feedback.",
      link: "https://laancer.vercel.app/", github: "https://github.com/Timigill/freelance-dashboard",
    },
    {
      id: 3, category: "inter", img: "/images/uploads/project-1787643746427.png",
      title: "DaaSForge Admin Dashboard", role: "Frontend Developer (Contributor)",
      description: "Contributed frontend modules to a company platform — data tables, chart views, and responsive layout improvements for the admin interface.",
      tech: ["Next.js", "React", "REST API", "Chart.js"],
      problem: "The team needed a unified data management interface that non-technical users could navigate comfortably.",
      features: ["Role-based access views", "Interactive charts", "Filterable data tables", "CSV export", "Fully responsive"],
      result: "Contributed responsive data tables, analytical charts, and interactive views to company platform.",
      link: "https://daas-forge.vercel.app/", github: "https://github.com/Timigill/daas-forge",
    },
    {
      id: 2, category: "web", img: "/images/uploads/project-1787643341031.png",
      title: "CartifyOutlet E-commerce Platform", role: "Full-Stack Developer",
      description: "A full-stack e-commerce platform built to manage product listings, user authentication, and order workflows with a seamless shopping experience.",
      tech: ["Next.js", "Node.js", "MongoDB", "NextAuth", "JWT"],
      problem: "The business needed a complete online store to handle product management, user accounts, and secure checkout without relying on third-party limitations.",
      features: ["User authentication with Google OAuth and JWT", "Product listing & category management", "Cart and checkout system", "Order tracking and user dashboard", "Admin panel for product and order control"],
      result: "Delivered full-stack e-commerce solution with OAuth authentication, cart state management, and order processing.",
      link: "https://www.cartifyoutlet.com/", github: "https://github.com/Timigill/Found",
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
    { id: "fullstack", title: "Full-Stack Web Development", icon: "FaDesktop", shortDesc: "End-to-end web applications built with Next.js, React, Node.js, and MongoDB — from database to deployment.", fullDesc: "I build complete, responsive web applications designed for performance and SEO. That includes database schema design, RESTful APIs, secure authentication, serverless functions, and interactive user interfaces." },
    { id: "dashboard", title: "Dashboard & Admin Panel Development", icon: "FaChartBar", shortDesc: "Custom management interfaces giving you real-time control over products, users, and business analytics.", fullDesc: "Businesses need clear admin controls without touching code. I build custom admin dashboards with real-time data tables, dynamic charts, CSV exports, role-based access, and instant database CMS synchronization." },
    { id: "api", title: "API Development & Integration", icon: "FaCode", shortDesc: "Secure, RESTful APIs powering web apps, mobile services, and third-party API integrations.", fullDesc: "I engineer REST APIs using Node.js, Express, and Next.js Route Handlers with structured JSON payloads, JWT authentication middleware, rate limiting, and comprehensive endpoint documentation." },
    { id: "database", title: "Database Architecture & Development", icon: "FaDatabase", shortDesc: "Scalable MongoDB document schemas, Mongoose models, indexing, and efficient CRUD query execution.", fullDesc: "I design robust document databases optimized for high read/write performance, schema validation, data aggregation pipelines, and secure cloud backups on MongoDB Atlas." },
    { id: "bugfix", title: "Bug Fixing & Performance Optimization", icon: "FaBug", shortDesc: "Auditing existing codebases for layout glitches, slow queries, memory leaks, and Lighthouse optimization.", fullDesc: "I inspect existing React/Next.js applications to fix broken state logic, CSS layout bugs, hydration errors, slow API calls, and optimize bundle sizes for sub-second page loads." }
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

// ─── Case Study ──────────────────────────────────────────────────────────────
export function getCaseStudy() {
  const saved = readFile("casestudy");
  if (saved.length > 0) return saved;
  return [
    {
      id: "cs-1",
      badge: "CORE ARCHITECTURE",
      title: "Full-Stack Next.js 14 Engine",
      icon: "⚡",
      desc: "Architected around Next.js 14 App Router, Server Components (RSC), and dynamic API routes for optimal SSR performance.",
      points: [
        "Hybrid rendering strategy: SSR for SEO-critical pages & CSR for interactive state",
        "Custom middleware route guards for authenticated session validation",
        "Dynamic API routes handling JSON payloads with structured error handling",
      ],
      accent: "cyan",
      span: 1,
    },
    {
      id: "cs-2",
      badge: "SECURITY & SHIELD",
      title: "Authentication & Role Guards",
      icon: "🔒",
      desc: "Robust authentication pipeline utilizing HTTP-Only cookies, JWT encryption, and role-based access control (RBAC).",
      points: [
        "Encrypted JWT tokens stored in secure HTTP-Only cookies",
        "Role-based access control protecting admin endpoints",
        "CSRF protection & input sanitization across form submissions",
      ],
      accent: "rose",
      span: 1,
    },
    {
      id: "cs-3",
      badge: "PERFORMANCE",
      title: "Core Web Vitals Optimization",
      icon: "🚀",
      desc: "Engineered for 95+ Lighthouse performance scores through image optimization, lazy loading, and lightweight bundle splitting.",
      points: [
        "Next.js Image component optimization with WebP encoding",
        "Asynchronous script loading & font subsetting",
        "Optimized First Contentful Paint (FCP) delivery",
      ],
      accent: "amber",
      span: 1,
    },
    {
      id: "cs-4",
      badge: "DATA MODEL",
      title: "MongoDB & Mongoose Schema Design",
      icon: "💾",
      desc: "Flexible, index-optimized Document modeling tailored for real-time CRUD operations and seamless CMS synchronization.",
      points: [
        "Indexed fields for fast query execution & pagination",
        "Strict schema validation preventing bad document writes",
        "Automated backup sync & connection pool management",
      ],
      accent: "emerald",
      span: 1,
    },
  ];
}

export function saveCaseStudy(data) {
  writeFile("casestudy", data);
}

// ─── CV / Resume ─────────────────────────────────────────────────────────────
export function getCv() {
  const saved = readFile("cv");
  if (saved && saved.url) return saved;
  return {
    url: "/M.Akmal CV.pdf",
    name: "M.Akmal CV.pdf",
    updatedAt: "2026-09-10T00:00:00.000Z",
  };
}

export function saveCv(data) {
  writeFile("cv", data);
}

// ─── Home & Site Settings ───────────────────────────────────────────────────
export function getSettings() {
  const saved = readFile("settings");
  if (saved && typeof saved === "object" && !Array.isArray(saved) && Object.keys(saved).length > 0) {
    return saved;
  }
  return {
    name: "Muhammad Akmal",
    copyrightName: "Muhammad Akmal",
    navbarLogoText: "Akmal",
    email: "m.akmal.dev42@gmail.com",
    location: "Pakistan (Remote Worldwide)",
    responseTime: "Within 24 hours guaranteed",
    github: "https://github.com/AkmalDoghar",
    linkedin: "https://www.linkedin.com/in/muhammad-akmal-dev/",
    facebook: "",
    instagram: "https://www.instagram.com/muhammadakmal1225/",
    whatsapp: "https://wa.me/923017697832",
    heroTitle: "Building Fast, Production-Ready Web Apps",
    typingWords: [
      "Full-Stack Next.js Developer",
      "React & Node.js Engineer",
      "MongoDB & API Architect"
    ],
    heroDescription: "I build modern, scalable web applications using Next.js, React, Node.js and MongoDB.",
    heroImage: "/Akmal1.png",
    badge1Title: "Full-Stack JS",
    badge1Sub: "Next.js • React • Node • Mongo",
    badge2Title: "Web Apps",
    badge2Sub: "Fast & Scalable",
    aboutImage: "/Akmal2.png",
    aboutTag: "FULL-STACK NEXT.JS DEVELOPER",
    aboutTitle: "Crafting Scalable Digital Products with Clean Architecture",
    aboutDescription1: "I'm Muhammad Akmal, a full-stack JavaScript engineer who builds web applications from the ground up — database schema design, RESTful APIs, server-side logic, and responsive user interfaces.",
    aboutDescription2: "Primary focus on Next.js, React, Node.js, and MongoDB. I emphasize clean code, structured commit histories, clear documentation, and seamless deployments.",
    aboutYearsExp: "1+",
    aboutProjectsBuilt: "7+",
    aboutLiveDeployed: "6+"
  };
}

export function saveSettings(data) {
  writeFile("settings", data);
}

// ─── Interactive CV Content ──────────────────────────────────────────────────
export function getCvContent() {
  const saved = readFile("cv_content");
  if (saved && typeof saved === "object" && saved.personalInfo) {
    return saved;
  }
  return {
    personalInfo: {
      name: "Muhammad Akmal",
      title: "Full-Stack Next.js & React Developer",
      email: "m.akmal.dev42@gmail.com",
      phone: "+92 301 7697832",
      location: "Pakistan (Remote Worldwide)",
      summary: "Full-Stack JavaScript Developer specializing in Next.js, React, Node.js, Express, and MongoDB.",
      github: "https://github.com/AkmalDoghar",
      linkedin: "https://www.linkedin.com/in/muhammad-akmal-dev/",
      website: "https://akmalcode.vercel.app"
    },
    experience: [],
    education: [],
    skills: { frontend: [], backend: [], tools: [] },
    projects: []
  };
}

export function saveCvContent(data) {
  writeFile("cv_content", data);
}



