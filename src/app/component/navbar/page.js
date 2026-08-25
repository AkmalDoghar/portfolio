"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import "./navbar.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeHash, setActiveHash] = useState("#home");
  const [scrolled, setScrolled] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const navRef = useRef(null);
  const listRef = useRef(null);

  const links = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#services", label: "Services" },
    { href: "#skills", label: "Skills" },
    { href: "#portfolio", label: "Projects" },
    { href: "#experience", label: "Experience" },
    { href: "#casestudy", label: "Case Study" },
    { href: "#contact", label: "Contact" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    const onResize = () => {
      if (window.innerWidth > 880) setIsOpen(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveHash("#" + entry.target.id);
        });
      },
      { root: null, rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    );
    links.forEach((link) => {
      const section = document.querySelector(link.href);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);

  // Slide the glowing indicator to the active link
  useEffect(() => {
    if (!listRef.current) return;
    const activeEl = listRef.current.querySelector(".active-link");
    if (!activeEl) return;
    const li = activeEl.closest("li");
    if (!li) return;
    const listRect = listRef.current.getBoundingClientRect();
    const liRect = li.getBoundingClientRect();
    setIndicatorStyle({
      left: liRect.left - listRect.left,
      width: liRect.width,
    });
  }, [activeHash]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && navRef.current && !navRef.current.contains(e.target))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const scrollTo = (href) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    setActiveHash(href);
    setIsOpen(false);
  };

  const handleEmailClick = (e) => {
    e.preventDefault();
    const mailtoUrl = "mailto:84pakarmy@gmail.com";
    const gmailUrl = "https://mail.google.com/mail/?view=cm&fs=1&to=84pakarmy@gmail.com";
    
    // Attempt opening Gmail Web Compose in new tab, and trigger mailto for default app
    const win = window.open(gmailUrl, "_blank");
    if (!win || win.closed || typeof win.closed === "undefined") {
      window.location.href = mailtoUrl;
    }
  };

  return (
    <nav className={`navbar${scrolled ? " scrolled" : ""}`} ref={navRef}>
      {/* Logo */}
      <button className="nav-logo" onClick={() => scrollTo("#home")}>
        <span className="logo-bracket">&lt;</span>
        Akmal
        <span className="logo-bracket"> /&gt;</span>
      </button>

      {/* Center pill nav */}
      <div className="nav-center">
        <ul className="navlist" ref={listRef}>
          <span className="nav-indicator" style={indicatorStyle} />
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
                className={activeHash === link.href ? "active-link" : ""}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Right: CTA + Hamburger */}
      <div className="nav-right">
        <a
          className="nav-cta"
          href="mailto:84pakarmy@gmail.com"
          onClick={handleEmailClick}
        >
          <span className="cta-dot" />
          Let&apos;s Talk
        </a>
        <button
          className={`hamburger${isOpen ? " active" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer${isOpen ? " open" : ""}`}>
        <ul>
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
                className={activeHash === link.href ? "active-link" : ""}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <a
          className="nav-cta drawer-cta"
          href="mailto:84pakarmy@gmail.com"
          onClick={handleEmailClick}
        >
          Let&apos;s Talk
        </a>
      </div>
    </nav>
  );
}
