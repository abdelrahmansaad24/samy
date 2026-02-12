import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import type { SkillsSection } from "@/lib/types";

type PortfolioDoc = { _id: string; skills?: SkillsSection };

export async function POST(req: NextRequest) {
  try {
    const skills: SkillsSection = await req.json();
    const db = await getDb();
    const col = db.collection<PortfolioDoc>("portfolio");
    await col.updateOne(
      { _id: "main" },
      { $set: { skills } },
      { upsert: true }
    );
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
