import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import type { ContactSection } from "@/lib/types";

type PortfolioDoc = { _id: string; contact?: ContactSection };

export async function POST(req: NextRequest) {
  try {
    const contact: ContactSection = await req.json();
    const db = await getDb();
    const col = db.collection<PortfolioDoc>("portfolio");
    await col.updateOne(
      { _id: "main" },
      { $set: { contact } },
      { upsert: true }
    );
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
