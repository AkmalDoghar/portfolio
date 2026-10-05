import { NextResponse } from "next/server";
import { getAdminSession, isValidSession } from "@/app/lib/auth";
import { getCvContent, saveCvContent } from "@/app/lib/portfolioData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const data = getCvContent();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch CV content" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await getAdminSession();
    if (!isValidSession(session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    saveCvContent(body);
    return NextResponse.json({ success: true, data: body });
  } catch (error) {
    console.error("CV content update error:", error);
    return NextResponse.json({ error: "Failed to save CV content" }, { status: 500 });
  }
}
