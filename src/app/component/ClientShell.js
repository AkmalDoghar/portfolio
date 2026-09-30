"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "./navbar/page";
import Footer from "./footer/page";
import MagicCursor from "./MagicCursor/page";
import LogoIntro from "./LogoIntro/LogoIntro";

export default function ClientShell({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  const isValidRoute =
    pathname === "/" ||
    pathname === "/services" ||
    pathname?.startsWith("/services/") ||
    pathname?.startsWith("/admin");

  // Track whether intro has completed so we can reveal Navbar
  const [introComplete, setIntroComplete] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      document.body.classList.remove("hide-cursor");
      document.body.classList.add("admin-mode");
    } else {
      document.body.classList.remove("admin-mode");
    }
  }, [isAdmin]);

  if (isAdmin) {
    return <main className="admin-root-wrapper">{children}</main>;
  }

  // Standalone 404 Page without Navbar & Footer
  if (!isValidRoute) {
    return (
      <>
        <MagicCursor />
        <main className="not-found-root-wrapper">{children}</main>
      </>
    );
  }

  return (
    <>
      <LogoIntro onDone={() => setIntroComplete(true)} />
      <MagicCursor />
      {/* Navbar: hidden with opacity until intro finishes, then fades in smoothly */}
      <div
        style={{
          opacity: introComplete ? 1 : 0,
          pointerEvents: introComplete ? "auto" : "none",
          transition: "opacity 0.5s ease",
        }}
      >
        <Navbar />
      </div>
      <main>{children}</main>
      <Footer />
    </>
  );
}

