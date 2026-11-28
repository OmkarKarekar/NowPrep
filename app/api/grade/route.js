import { NextResponse } from "next/server";
import { loadBank, isExam } from "../../../lib/bank";
import { rateLimited, readJson, tooMany, crossOrigin, forbidden } from "../../../lib/guard";

export const dynamic = "force-dynamic";

// Marking rule (same as before): a question is correct only when the selected
// options exactly match the correct options. Unanswered counts as incorrect.
function sameSet(selected, correct) {
  if (selected.length !== correct.length) return false;
  const s = new Set(selected);
  return correct.every((c) => s.has(c));
}

// Keeps only whole numbers that are valid option positions, without repeats.
function cleanSelection(value, optionCount) {
  if (!Array.isArray(value)) return [];
  const out = new Set();
  for (const v of value.slice(0, 12)) if (Number.isInteger(v) && v >= 0 && v < optionCount) out.add(v);
  return [...out];
}

export async function POST(request) {
  if (crossOrigin(request)) return forbidden();
  if (rateLimited(request, "grade", 20)) return tooMany();
  const parsed = await readJson(request, 100_000);
  if (parsed.error) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  const body = parsed.data;
  let bank = null;
  try { bank = isExam(body.exam) ? loadBank(body.exam) : null; } catch (e) { bank = null; }
  if (!bank) return NextResponse.json({ error: "Bad request" }, { status: 400 });
  const answers = body.answers && typeof body.answers === "object" && !Array.isArray(body.answers) ? body.answers : {};
  const items = bank.map((q) => {
    const selected = Object.prototype.hasOwnProperty.call(answers, q.id) ? cleanSelection(answers[q.id], q.options.length) : [];
    const correct = sameSet(selected, q.correct);
    return { id: q.id, q: q.q, options: q.options, selected, correctIdx: q.correct, correct, skipped: selected.length === 0 };
  });
  const score = items.filter((i) => i.correct).length;
  return NextResponse.json({ total: bank.length, score, items });
}
