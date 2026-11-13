import { Suspense } from "react";
import ExamClient from "../../components/ExamClient";

export default function ExamPage() {
  return (
    <Suspense fallback={<main><p>Loading exam…</p></main>}>
      <ExamClient />
    </Suspense>
  );
}
