"use client";
import Link from "next/link";
import { BiUpArrowAlt } from "react-icons/bi";
import "./footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer class="footer">
      <div class="waves">
        <div class="wave" id="wave1"></div>
        <div class="wave" id="wave2"></div>
        <div class="wave" id="wave3"></div>
        <div class="wave" id="wave4"></div>
      </div>

      <div className="footer-bottom-container">
        <p>
          Copyright &copy; {currentYear} by{" "}
          <span className="font-accent">Rana Akmal</span>. All Rights Reserved.
        </p>
        <Link href="#home" className="scroll-top" aria-label="Back to top">
          <BiUpArrowAlt size={22} />
        </Link>
      </div>
    </footer>
  );
}
