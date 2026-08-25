import "./globals.css";
import ClientShell from "./component/ClientShell";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Akmal Portfolio",
  description: "Personal Portfolio built with Next.js",
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
