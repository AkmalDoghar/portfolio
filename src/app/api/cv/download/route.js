import { NextResponse } from "next/server";
import { getCv } from "@/app/lib/portfolioData";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const cvData = getCv();
    const rawUrl = cvData?.url || "/M.Akmal CV.pdf";
    const displayName = cvData?.name || "Muhammad Akmal CV.pdf";

    let filePath = null;

    // 1. Check if rawUrl points to public static file
    if (rawUrl.startsWith("/") && !rawUrl.startsWith("/api/")) {
      const cleanPath = rawUrl.replace(/^\/+/, "");
      const possiblePublicPath = path.join(process.cwd(), "public", cleanPath);
      if (fs.existsSync(possiblePublicPath)) {
        filePath = possiblePublicPath;
      }
    }

    // 2. Check fallback /tmp directory for serverless environments
    if (!filePath) {
      const tmpPath = path.join("/tmp", "cv_uploaded.pdf");
      if (fs.existsSync(tmpPath)) {
        filePath = tmpPath;
      }
    }

    // 3. Fallback to default public CV document
    if (!filePath) {
      const defaultPath = path.join(process.cwd(), "public", "M.Akmal CV.pdf");
      if (fs.existsSync(defaultPath)) {
        filePath = defaultPath;
      }
    }

    if (!filePath || !fs.existsSync(filePath)) {
      return NextResponse.json({ error: "CV document file not found" }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    const sanitizedFilename = displayName.replace(/[^a-zA-Z0-9._-]/g, "_");

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${sanitizedFilename}"`,
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
  } catch (error) {
    console.error("Error serving CV file:", error);
    return NextResponse.json({ error: "Failed to download CV file" }, { status: 500 });
  }
}
