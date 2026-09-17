"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { BiUpArrowAlt } from "react-icons/bi";
import "./footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [copyrightName, setCopyrightName] = useState("Rana Akmal");

  useEffect(() => {
    fetch("/api/admin/settings", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (data && data.copyrightName) setCopyrightName(data.copyrightName);
        else if (data && data.name) setCopyrightName(data.name);
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="footer">
      <div className="waves">
        <div className="wave" id="wave1"></div>
        <div className="wave" id="wave2"></div>
        <div className="wave" id="wave3"></div>
        <div className="wave" id="wave4"></div>
      </div>

      <div className="footer-bottom-container">
        <p>
          Copyright &copy; {currentYear} by{" "}
          <span className="font-accent">{copyrightName}</span>. All Rights Reserved.
        </p>
        <Link href="#home" className="scroll-top" aria-label="Back to top">
          <BiUpArrowAlt size={22} />
        </Link>
      </div>
    </footer>
  );
}
