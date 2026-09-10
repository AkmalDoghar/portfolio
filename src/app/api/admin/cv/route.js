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

      if (!file || typeof file === "string") {
        return NextResponse.json({ error: "No CV file provided" }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const ext = path.extname(file.name) || ".pdf";
      const filename = `CV-${Date.now()}${ext.toLowerCase()}`;

      // Upload to public/uploads
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      try {
        await mkdir(uploadDir, { recursive: true });
        const filePath = path.join(uploadDir, filename);
        await writeFile(filePath, buffer);
      } catch {
        /* fallback for serverless */
      }

      const publicUrl = `/uploads/${filename}`;
      const newCvData = {
        url: publicUrl,
        name: file.name,
        updatedAt: new Date().toISOString(),
      };

      saveCv(newCvData);
      return NextResponse.json({ success: true, data: newCvData });
    }

    // Handle JSON payload (e.g. manual URL update)
    const data = await request.json();
    saveCv(data);
    return NextResponse.json({ success: true, data });
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

    const emptyCv = {
      url: "",
      name: "No CV Uploaded",
      updatedAt: new Date().toISOString(),
    };

    saveCv(emptyCv);
    return NextResponse.json({ success: true, data: emptyCv });
  } catch {
    return NextResponse.json({ error: "Failed to delete CV" }, { status: 500 });
  }
}
