import { NextResponse } from "next/server";
import { getAdminSession, isValidSession } from "@/app/lib/auth";
import { getProjects, saveProjects } from "@/app/lib/portfolioData";

export async function GET() {
  try {
    const data = getProjects();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await getAdminSession();
    if (!isValidSession(session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const data = await request.json();
    saveProjects(data);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save projects" }, { status: 500 });
  }
}
