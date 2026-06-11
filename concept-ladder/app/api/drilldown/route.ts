import { NextResponse } from "next/server";
import { generateDrilldown } from "@/lib/ai";
import { parseDrilldownInput } from "@/lib/ai/schemas";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = parseDrilldownInput(body);
  const output = await generateDrilldown(input);

  return NextResponse.json(output);
}
