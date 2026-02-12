import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import type { HeroSection, AboutSection, TimelineExperience } from "@/lib/types";

type Payload = {
  hero: HeroSection;
  about: AboutSection;
  timelineExperience: TimelineExperience;
};

type PortfolioDoc = {
  _id: string;
  hero?: HeroSection;
  about?: AboutSection;
  timelineExperience?: TimelineExperience;
};

export async function POST(req: NextRequest) {
  try {
    const payload: Payload = await req.json();
    const db = await getDb();
    const col = db.collection<PortfolioDoc>("portfolio");
    await col.updateOne(
      { _id: "main" },
      {
        $set: {
          hero: payload.hero,
          about: payload.about,
          timelineExperience: payload.timelineExperience,
        },
      },
      { upsert: true }
    );
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
