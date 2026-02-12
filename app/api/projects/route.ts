import { NextRequest, NextResponse } from "next/server";
import { updateProjects } from "@/lib/queries";
import { Project } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const projects: Project[] = await req.json();
    await updateProjects(projects);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
