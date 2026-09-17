import { NextResponse } from "next/server";
import { getAdminSession, isValidSession } from "@/app/lib/auth";
import { getSettings, saveSettings } from "@/app/lib/portfolioData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const settings = getSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error("GET settings error:", error);
    return NextResponse.json({ error: "Failed to fetch site settings" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await getAdminSession();
    if (!isValidSession(session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    if (!data || typeof data !== "object") {
      return NextResponse.json({ error: "Invalid settings payload" }, { status: 400 });
    }

    const current = getSettings();
    const updated = {
      ...current,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    saveSettings(updated);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("PUT settings error:", error);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
