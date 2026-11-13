import { NextResponse } from "next/server";
import { loadBank } from "../../../lib/bank";

export const dynamic = "force-dynamic";

// Marking rule (same as before): a question is correct only when the selected
// options exactly match the correct options. Unanswered counts as incorrect.
function sameSet(selected, correct) {
  if (selected.length !== correct.length) return false;
  const s = new Set(selected);
  return correct.every((c) => s.has(c));
}

export async function POST(request) {
  const body = await request.json().catch(() => null);
  let bank;
  try { bank = body && loadBank(body.exam); } catch (e) { bank = null; }
  if (!bank) return NextResponse.json({ error: "Bad request" }, { status: 400 });
  const answers = body.answers || {};
  const items = bank.map((q) => {
    const selected = Array.isArray(answers[q.id]) ? answers[q.id].map(Number) : [];
    const correct = sameSet(selected, q.correct);
    return { id: q.id, q: q.q, options: q.options, selected, correctIdx: q.correct, correct, skipped: selected.length === 0 };
  });
  const score = items.filter((i) => i.correct).length;
  return NextResponse.json({ total: bank.length, score, items });
}
