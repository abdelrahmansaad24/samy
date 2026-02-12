import { NextRequest, NextResponse } from "next/server";
import { updateProfile } from "@/lib/queries";
import { Profile } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const profile: Profile = await req.json();
    await updateProfile(profile);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
