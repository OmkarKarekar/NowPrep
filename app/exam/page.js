import { Suspense } from "react";
import ExamClient from "../../components/ExamClient";
import { loadBank, isExam } from "../../lib/bank";

export const metadata = { title: "Practice exam", robots: { index: false, follow: true } };

export default function ExamPage({ searchParams }) {
  const code = typeof searchParams?.exam === "string" ? searchParams.exam : "CAD";
  let info = null;
  if (isExam(code)) {
    try {
      const bank = loadBank(code);
      const multi = bank.filter((q) => q.multi).length;
      info = { total: bank.length, multi, single: bank.length - multi };
    } catch (e) {}
  }
  return (
    <Suspense fallback={<main><p>Loading exam…</p></main>}>
      <ExamClient info={info} />
    </Suspense>
  );
}
