import { NextRequest, NextResponse } from "next/server";
import { getPortfolio } from "@/lib/queries";

export async function GET(_req: NextRequest) {
  try {
    const portfolio = await getPortfolio();
    return NextResponse.json(portfolio);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
