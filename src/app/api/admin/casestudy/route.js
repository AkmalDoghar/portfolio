import { NextResponse } from "next/server";
import { getAdminSession, isValidSession } from "@/app/lib/auth";
import { getCaseStudy, saveCaseStudy } from "@/app/lib/portfolioData";

export async function GET() {
  try {
    const data = getCaseStudy();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch case study cards" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await getAdminSession();
    if (!isValidSession(session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const data = await request.json();
    saveCaseStudy(data);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save case study cards" }, { status: 500 });
  }
}
