import "./globals.css";
import ClientShell from "./component/ClientShell";
import { Toaster } from "react-hot-toast";

export const metadata = {
  metadataBase: new URL("https://akmalcode.vercel.app/"),
  title: "Muhammad Akmal | Full-Stack Next.js & React Developer",
  description:
    "Full-Stack JavaScript Developer specializing in Next.js, React, Node.js, and MongoDB. Available for freelance web applications and developer roles.",
  keywords: [
    "Muhammad Akmal",
    "Full-Stack Developer",
    "Next.js Developer",
    "React Engineer",
    "Node.js",
    "MongoDB",
    "Web Developer Portfolio",
  ],
  authors: [{ name: "Muhammad Akmal" }],
  openGraph: {
    title: "Muhammad Akmal | Full-Stack Next.js & React Developer",
    description:
      "Full-Stack JavaScript Developer building fast, production-ready web applications with Next.js, React, Node.js, and MongoDB.",
    url: "https://akmalcode.vercel.app/",
    siteName: "Muhammad Akmal Portfolio",
    images: [
      {
        url: "/Akmal1.png",
        width: 600,
        height: 850,
        alt: "Muhammad Akmal - Full-Stack Developer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhammad Akmal | Full-Stack Next.js & React Developer",
    description:
      "Full-Stack JavaScript Developer building fast, production-ready web applications with Next.js, React, Node.js, and MongoDB.",
    images: ["/Akmal1.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientShell>{children}</ClientShell>

        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "var(--bg-color)",
              color: "var(--text-color)",
              border: "1px solid var(--hover-color)",
              padding: "12px 16px",
              borderRadius: "8px",
            },
            success: {
              style: {
                border: "1px solid var(--hover-color)",
                color: "var(--hover-color)",
              },
              iconTheme: {
                primary: "var(--hover-color)",
                secondary: "var(--bg-color)",
              },
            },
            error: {
              style: {
                border: "1px solid #ff4d4d",
                color: "#ff4d4d",
              },
              iconTheme: {
                primary: "#ff4d4d",
                secondary: "var(--bg-color)",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
