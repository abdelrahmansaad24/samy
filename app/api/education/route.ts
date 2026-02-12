import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import type { EducationItem } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const education: EducationItem[] = await req.json();
    const db = await getDb();
    const col = db.collection("portfolio");
    await col.updateOne(
      { _id: "main" } as any,
      { $set: { education } },
      { upsert: true }
    );
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
