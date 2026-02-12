import { NextRequest, NextResponse } from "next/server";
import { updateExperiences } from "@/lib/queries";
import { Experience } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const experiences: Experience[] = await req.json();
    await updateExperiences(experiences);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
