import { NextResponse } from "next/server";
import { getAdminSession, isValidSession } from "@/app/lib/auth";
import { getSkills, saveSkills } from "@/app/lib/portfolioData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {

  try {
    const data = getSkills();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch skills" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await getAdminSession();
    if (!isValidSession(session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const data = await request.json();
    saveSkills(data);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save skills" }, { status: 500 });
  }
}
