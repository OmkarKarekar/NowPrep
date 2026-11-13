import { NextResponse } from "next/server";
import { loadBank, publicQuestion, shuffle, EXAMS } from "../../../../lib/bank";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const exam = decodeURIComponent(params.exam);
  if (!EXAMS[exam]) return NextResponse.json({ error: "Unknown exam." }, { status: 404 });
  try {
    const bank = loadBank(exam);
    const order = new URL(request.url).searchParams.get("order") === "shuffled" ? "shuffled" : "sequential";
    const list = order === "shuffled" ? shuffle(bank) : bank;
    return NextResponse.json({ exam: EXAMS[exam], order, total: list.length, questions: list.map(publicQuestion) });
  } catch (err) {
    return NextResponse.json({ error: "The question bank could not be read on the server." }, { status: 500 });
  }
}
