import { CheckCircle2, ListOrdered, Flag, Send, Eye, Map, ArrowRight } from "lucide-react";
import Link from "next/link";
import { loadBank, EXAMS } from "../lib/bank";
import FindExamButton from "../components/FindExamButton";
import HeroTry from "../components/HeroTry";
import CountUp from "../components/CountUp";

export const metadata = { alternates: { canonical: "/" } };

export default function Home() {
  const exams = Object.values(EXAMS).map((e) => ({ code: e.code, slug: e.slug, name: e.name, count: loadBank(e.code).length }));
  const total = exams.reduce((n, e) => n + e.count, 0);
  return (
    <main>
      <section className="hero hero-split">
        <div>
          <div className="eyebrow">Free ServiceNow certification practice</div>
          <h1>Practice for your ServiceNow certification exams.</h1>
          <p className="lead">Work through exam-style questions at your own pace, check the correct answer as you go, and see exactly what to review at the end.</p>
          <div className="row">
            <FindExamButton />
            <Link className="btn ghost" href="/#how">How it works</Link>
          </div>
          <dl className="stats">
            <div><dt>Exams</dt><dd><CountUp value={exams.length} /></dd></div>
            <div><dt>Practice questions</dt><dd><CountUp value={total} /></dd></div>
            <div><dt>Cost</dt><dd>Free</dd></div>
          </dl>
        </div>
        <HeroTry />
      </section>

      <section id="practice-exams" className="about">
        <h2>Practice exams</h2>
        <p className="lead" style={{ marginBottom: 0 }}>Choose a ServiceNow certification to see what it covers and start practising.</p>
        <div className="mini-cards">
          {exams.map((e) => (
            <Link key={e.code} className="mini" href={`/exams/${e.slug}`}>
              <span className="code">{e.code}</span>
              <strong>{e.name.replace(/^Certified (Implementation Specialist: )?/, "")}</strong>
              <span className="muted">{e.count} questions</span>
            </Link>
          ))}
          <Link className="mini mini-all" href="/exams">
            <strong>View all exams</strong>
            <span className="muted">See what each one covers <ArrowRight size={14} aria-hidden="true" style={{ verticalAlign: "-2px" }} /></span>
          </Link>
        </div>
      </section>

      <section id="how" className="grid two">
        <div className="card">
          <h2>How it works</h2>
          <ul className="plain">
            <li><ListOrdered className="i" aria-hidden="true" /> Pick an exam, then sequential or shuffled order.</li>
            <li><CheckCircle2 className="i" aria-hidden="true" /> Select one option, or every option that applies.</li>
            <li><Eye className="i" aria-hidden="true" /> Use Show answer on any question to see the correct option straight away.</li>
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
            <li><Map className="i" aria-hidden="true" /> After you submit, a question map shows what you got right, wrong or skipped, with every correct answer below it.</li>
          </ul>
        </div>
      </section>

      <section id="contribute" className="cta">
        <div>
          <h2>Help improve NowPrep</h2>
          <p>Found a wrong answer or have a good question? Tell us and we will review it.</p>
        </div>
        <div className="row">
          <Link className="btn" href="/contribute">Contribute</Link>
          <Link className="btn ghost" href="/contact?topic=correction">Suggest a correction</Link>
        </div>
      </section>

      <section id="about" className="about">
        <h2>About NowPrep</h2>
        <p className="lead">NowPrep is a free practice site for people preparing for ServiceNow certification exams, open to everyone and improved by the community. It keeps the layout clean and familiar, so the question is the only thing you need to think about.</p>
        <div className="about-grid">
          <div className="card">
            <h3>Practise</h3>
            <p>Exam-style questions with single and multiple answers, in sequential or shuffled order, with a timer and flags.</p>
          </div>
          <div className="card">
            <h3>Learn as you go</h3>
            <p>Reveal the correct answer on any question while you practise, so each question teaches you something.</p>
          </div>
          <div className="card">
            <h3>Review</h3>
            <p>Finish with a score, a colour-coded question map and the correct answer for every question.</p>
          </div>
        </div>
        <p className="callout">Question sets are study material and may contain mistakes. Check anything important against the official ServiceNow documentation.</p>
      </section>
    </main>
  );
}
