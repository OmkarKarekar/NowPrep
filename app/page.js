import Link from "next/link";
import { BookOpen, ArrowRight, CheckCircle2, ListOrdered, Flag, Send, Layers } from "lucide-react";
import { loadBank, EXAMS } from "../lib/bank";

export default function Home() {
  const counts = { CAD: loadBank("CAD").length, "CIS-CSM": loadBank("CIS-CSM").length, CMDB: loadBank("CMDB").length };
  return (
    <main>
      <section className="hero">
        <div className="eyebrow">ServiceNow practice exams</div>
        <h1>Practise, check your score, and see exactly what to review.</h1>
        <p className="lead">Choose an exam, answer in sequential or shuffled order, submit when you are ready, and review every answer at the end.</p>
        <div className="row">
          <Link className="btn" href="#exams">Start practising <ArrowRight className="i" aria-hidden="true" /></Link>
          <Link className="btn ghost" href="#how"><BookOpen className="i" aria-hidden="true" /> How it works</Link>
        </div>
      </section>

      <section id="exams">
        <h2>Choose an exam</h2>
        <div className="grid two" style={{ margin: "14px 0 34px" }}>
          {Object.values(EXAMS).map((e) => (
            <Link key={e.code} className="exam-card" href={`/exam?exam=${encodeURIComponent(e.code)}`}>
              <span className="code">{e.short}</span>
              <strong style={{ fontSize: 18 }}>{e.name}</strong>
              <span className="count"><Layers className="i" aria-hidden="true" /> {counts[e.code]} questions</span>
            </Link>
          ))}
        </div>
      </section>

      <section id="how" className="grid two">
        <div className="card">
          <h2>How it works</h2>
          <ul className="plain">
            <li><ListOrdered className="i" aria-hidden="true" /> Pick an exam, then sequential or shuffled order.</li>
            <li><CheckCircle2 className="i" aria-hidden="true" /> Select one option, or every option that applies.</li>
            <li><Flag className="i" aria-hidden="true" /> Flag questions and jump to any question from the list.</li>
            <li><Send className="i" aria-hidden="true" /> Submit at any time. You will be asked to confirm.</li>
          </ul>
        </div>
        <div className="card">
          <h2>How marking works</h2>
          <ul className="plain">
            <li><CheckCircle2 className="i" aria-hidden="true" /> A question is correct only when your selection matches the correct option(s) exactly.</li>
            <li><CheckCircle2 className="i" aria-hidden="true" /> Unanswered questions count as incorrect.</li>
            <li><CheckCircle2 className="i" aria-hidden="true" /> Score = correct answers out of all questions.</li>
            <li><CheckCircle2 className="i" aria-hidden="true" /> After you submit, every answer is shown with the correct option(s).</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
