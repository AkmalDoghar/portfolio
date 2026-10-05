import { NextResponse } from "next/server";
import { getAdminSession, isValidSession } from "@/app/lib/auth";
import { getCv, saveCv } from "@/app/lib/portfolioData";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const data = getCv();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch CV data" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await getAdminSession();
    if (!isValidSession(session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contentType = request.headers.get("content-type") || "";

    // Handle Multipart Form Data (File Upload)
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file");
      const customName = formData.get("name");

      if (!file || typeof file === "string") {
        return NextResponse.json({ error: "No CV file provided" }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const ext = path.extname(file.name) || ".pdf";
      const sanitizedFileName = (customName || file.name || "CV").replace(/[^a-zA-Z0-9.-]/g, "_");
      const filename = `CV-${Date.now()}-${sanitizedFileName}`;

      let publicUrl = `/uploads/${filename}`;

      // Upload to public/uploads
      try {
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        await mkdir(uploadDir, { recursive: true });
        const filePath = path.join(uploadDir, filename);
        await writeFile(filePath, buffer);
      } catch {
        // Fallback to Data URL for Vercel serverless read-only filesystem
        if (bytes.byteLength < 4 * 1024 * 1024) {
          const base64 = buffer.toString("base64");
          const mimeType = file.type || "application/pdf";
          publicUrl = `data:${mimeType};base64,${base64}`;
        }
      }

      const newCvData = {
        url: publicUrl,
        name: customName || file.name || "Muhammad Akmal CV.pdf",
        updatedAt: new Date().toISOString(),
      };

      saveCv(newCvData);
      return NextResponse.json({ success: true, data: newCvData });
    }

    // Handle JSON payload (e.g. manual URL or Title update)
    const body = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const existing = getCv();
    const updated = {
      url: typeof body.url === "string" ? body.url.trim() : existing.url,
      name: typeof body.name === "string" ? body.name.trim() : existing.name,
      updatedAt: new Date().toISOString(),
    };

    saveCv(updated);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("CV update error:", error);
    return NextResponse.json({ error: "Failed to save CV" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await getAdminSession();
    if (!isValidSession(session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const defaultCv = {
      url: "/M.Akmal CV.pdf",
      name: "M.Akmal CV.pdf",
      updatedAt: new Date().toISOString(),
    };

    saveCv(defaultCv);
    return NextResponse.json({ success: true, data: defaultCv });
  } catch {
    return NextResponse.json({ error: "Failed to reset CV" }, { status: 500 });
  }
}
