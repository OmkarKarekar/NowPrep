import { NextResponse } from "next/server";
import { loadBank, publicQuestion, EXAMS } from "../../../lib/bank";
import { rateLimited, tooMany, crossOrigin, forbidden } from "../../../lib/guard";

export const dynamic = "force-dynamic";

// A short single-answer question for the home page "Try a question" card. The answer is checked through /api/reveal.
export async function GET(request) {
  if (crossOrigin(request)) return forbidden();
  if (rateLimited(request, "sample", 60)) return tooMany();
  try {
    const codes = Object.keys(EXAMS);
    for (let attempt = 0; attempt < 10; attempt++) {
      const exam = codes[Math.floor(Math.random() * codes.length)];
      const pool = loadBank(exam).filter(
        (q) => !q.multi && q.q.length <= 200 && !/^match/i.test(q.q) && q.options.length <= 5 && q.options.every((o) => o.length <= 110)
      );
      if (pool.length) {
        const q = pool[Math.floor(Math.random() * pool.length)];
        return NextResponse.json({ exam, question: publicQuestion(q) });
      }
    }
    return NextResponse.json({ error: "No sample available." }, { status: 404 });
  } catch (err) {
    return NextResponse.json({ error: "The question bank could not be read on the server." }, { status: 500 });
  }
}
