import { NextResponse } from "next/server";
import { loadBank, publicQuestion, shuffle, isExam, EXAMS } from "../../../../lib/bank";
import { rateLimited, tooMany, crossOrigin, forbidden } from "../../../../lib/guard";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  if (crossOrigin(request)) return forbidden();
  if (rateLimited(request, "exam", 30)) return tooMany();
  let exam = "";
  try { exam = decodeURIComponent(params.exam); } catch (e) { return NextResponse.json({ error: "Unknown exam." }, { status: 404 }); }
  if (!isExam(exam)) return NextResponse.json({ error: "Unknown exam." }, { status: 404 });
  try {
    const bank = loadBank(exam);
    const order = new URL(request.url).searchParams.get("order") === "shuffled" ? "shuffled" : "sequential";
    const list = order === "shuffled" ? shuffle(bank) : bank;
    return NextResponse.json({ exam: { code: EXAMS[exam].code, name: EXAMS[exam].name }, order, total: list.length, questions: list.map(publicQuestion) });
  } catch (err) {
    return NextResponse.json({ error: "The question bank could not be read on the server." }, { status: 500 });
  }
}
