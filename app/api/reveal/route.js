import { NextResponse } from "next/server";
import { loadBank, isExam } from "../../../lib/bank";
import { rateLimited, readJson, tooMany, crossOrigin, forbidden } from "../../../lib/guard";

export const dynamic = "force-dynamic";

// Practice feature: returns the correct option(s) for one question on request.
export async function POST(request) {
  if (crossOrigin(request)) return forbidden();
  if (rateLimited(request, "reveal", 120)) return tooMany();
  const parsed = await readJson(request, 2_000);
  if (parsed.error) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  const body = parsed.data;
  if (!isExam(body.exam) || typeof body.id !== "string" || body.id.length > 40) return NextResponse.json({ error: "Bad request" }, { status: 400 });
  try {
    const q = loadBank(body.exam).find((x) => x.id === body.id);
    if (!q) return NextResponse.json({ error: "Unknown question." }, { status: 404 });
    return NextResponse.json({ correct: q.correct });
  } catch (err) {
    return NextResponse.json({ error: "The question bank could not be read on the server." }, { status: 500 });
  }
}
