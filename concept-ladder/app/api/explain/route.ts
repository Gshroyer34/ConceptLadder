import { NextResponse } from "next/server";
import { generateExplanation } from "@/lib/ai";
import { parseExplainInput } from "@/lib/ai/schemas";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const input = parseExplainInput(body);
  const output = await generateExplanation(input);

  return NextResponse.json(output);
}
