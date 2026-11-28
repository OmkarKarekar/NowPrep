"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ExamBadge from "./ExamBadge";
import Breadcrumbs from "./Breadcrumbs";
import { ChevronLeft, ChevronRight, Flag, Send, Clock, RotateCcw, Home, ArrowUp, AlertCircle, Shuffle, ListOrdered, X, Eye, EyeOff, Check } from "lucide-react";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const EXAM_NAMES = {
  CSA: "Certified System Administrator (CSA)",
  CAD: "Certified Application Developer (CAD)",
  "CIS-DF": "Certified Implementation Specialist: Data Foundations (CIS-DF)",
  "CIS-ITSM": "Certified Implementation Specialist: IT Service Management (CIS-ITSM)",
  "CIS-CSM": "Certified Implementation Specialist: Customer Service Management (CIS-CSM)",
};
const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
const sameSet = (a, b) => a.length === b.length && b.every((x) => a.includes(x));

export default function ExamClient({ info = null }) {
  const params = useSearchParams();
  const exam = params.get("exam") || "CAD";
  const [stage, setStage] = useState("setup");
  const [order, setOrder] = useState("sequential");
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flags, setFlags] = useState({});
  const [revealed, setRevealed] = useState({});
  const [showing, setShowing] = useState({});
  const [revealing, setRevealing] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");
  const [starting, setStarting] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    window.addEventListener("scroll", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); clearInterval(timer.current); };
  }, []);

  async function start() {
    setError(""); setStarting(true);
    try {
      const res = await fetch(`/api/exam/${encodeURIComponent(exam)}?order=${order}`, { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Server returned ${res.status}.`);
      setQuestions(data.questions);
      setIdx(0); setAnswers({}); setFlags({}); setRevealed({}); setShowing({}); setElapsed(0); setResult(null); setFilter("all");
      setStage("quiz");
      clearInterval(timer.current);
      timer.current = setInterval(() => setElapsed((s) => s + 1), 1000);
      window.scrollTo({ top: 0 });
    } catch (err) {
      setError(`Could not load this exam. ${err.message}`);
    } finally {
      setStarting(false);
    }
  }

  const q = questions[idx];
  const answered = useMemo(() => Object.keys(answers).filter((k) => (answers[k] || []).length > 0).length, [answers]);

  function toggleOption(i) {
    if (!q || showing[q.id]) return;
    const cur = answers[q.id] || [];
    const next = q.multi ? (cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i]) : [i];
    setAnswers({ ...answers, [q.id]: next });
  }

  async function toggleAnswer() {
    if (!q) return;
    const id = q.id;
    if (showing[id]) { setShowing((s) => ({ ...s, [id]: false })); return; }
    if (revealed[id]) { setShowing((s) => ({ ...s, [id]: true })); return; }
    setRevealing(true); setError("");
    try {
      const res = await fetch("/api/reveal", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ exam, id }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Server returned ${res.status}.`);
      setRevealed((r) => ({ ...r, [id]: data.correct }));
      setShowing((s) => ({ ...s, [id]: true }));
    } catch (err) {
      setError(`Could not load the answer. ${err.message}`);
    } finally {
      setRevealing(false);
    }
  }

  function jumpTo(id) {
    setFilter("all");
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    setTimeout(() => document.getElementById(`rv-${id}`)?.scrollIntoView({ behavior, block: "center" }), 60);
  }

  async function submitExam() {
    setSubmitting(true);
    clearInterval(timer.current);
    try {
      const res = await fetch("/api/grade", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ exam, answers }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submit failed.");
      setResult(data); setConfirmOpen(false); setStage("results");
      window.scrollTo({ top: 0 });
    } catch (err) {
      setError(`Could not submit. ${err.message}`);
      setConfirmOpen(false);
    } finally {
      setSubmitting(false);
    }
  }

  const topButton = showTop ? (
    <button className="to-top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Back to top" title="Back to top">
      <ArrowUp size={20} aria-hidden="true" />
    </button>
  ) : null;

  if (stage === "setup") {
    const known = Object.prototype.hasOwnProperty.call(EXAM_NAMES, exam);
    return (
      <main>
        <Breadcrumbs items={known ? [{ label: "Exams", href: "/exams" }, { label: exam, href: `/exams/${exam.toLowerCase()}` }, { label: "Practice" }] : [{ label: "Exams", href: "/exams" }, { label: "Practice" }]} />
        <div className="card setup">
          <div>
            <div className="eyebrow">{exam}</div>
            <h1 style={{ fontSize: 28, lineHeight: "34px" }}>{known ? EXAM_NAMES[exam] : "Unknown exam"}</h1>
            <p className="lead" style={{ fontSize: 16 }}>Choose how questions are ordered, then start. You can submit at any time.</p>
            <div className="seg" role="group" aria-label="Question order">
              <button className={order === "sequential" ? "on" : ""} onClick={() => setOrder("sequential")}><ListOrdered size={16} aria-hidden="true" /> Sequential</button>
              <button className={order === "shuffled" ? "on" : ""} onClick={() => setOrder("shuffled")}><Shuffle size={16} aria-hidden="true" /> Shuffled</button>
            </div>
            <div className="row" style={{ marginTop: 22 }}>
              <button className="btn" onClick={start} disabled={starting || !known}>
                <Send size={18} aria-hidden="true" /> {starting ? "Loading…" : "Start practice exam"}
              </button>
              <Link className="btn ghost" href="/"><Home size={18} aria-hidden="true" /> Home</Link>
            </div>
            {error && <div className="error" role="alert"><AlertCircle size={18} aria-hidden="true" /> {error}</div>}
          </div>
          {known && <ExamBadge code={exam} />}
        </div>

        {info && (
          <section className="instructions" aria-labelledby="inst-title">
            <h2 id="inst-title">Before you start</h2>
            <div className="grid three">
              <div className="card">
                <h3>This exam</h3>
                <ul className="plain">
                  <li><Check className="i" aria-hidden="true" /> {info.total} questions: {info.single} single answer and {info.multi} multiple answer.</li>
                  <li><Check className="i" aria-hidden="true" /> Sequential follows the original order. Shuffled mixes them up each time.</li>
                  <li><Check className="i" aria-hidden="true" /> No time limit. A timer shows how long you take.</li>
                </ul>
              </div>
              <div className="card">
                <h3>While you practise</h3>
                <ul className="plain">
                  <li><Check className="i" aria-hidden="true" /> Select one option, or every option that applies.</li>
                  <li><Check className="i" aria-hidden="true" /> Use Show answer to see the correct option, and Hide answer to try again.</li>
                  <li><Check className="i" aria-hidden="true" /> Flag a question to come back to it, and use the jump list to move around.</li>
                </ul>
              </div>
              <div className="card">
                <h3>Marking and results</h3>
                <ul className="plain">
                  <li><Check className="i" aria-hidden="true" /> A question is correct only when your selection matches exactly.</li>
                  <li><Check className="i" aria-hidden="true" /> Unanswered questions count as incorrect.</li>
                  <li><Check className="i" aria-hidden="true" /> At the end you get a score, a question map and every correct answer.</li>
                </ul>
              </div>
            </div>
            <p className="callout">These questions are community practice material and may contain mistakes. Found one? <Link href={`/contact?topic=correction&exam=${encodeURIComponent(exam)}`}>Suggest a correction</Link>.</p>
          </section>
        )}
      </main>
    );
  }

  if (stage === "quiz" && q) {
    const sel = answers[q.id] || [];
    const shown = showing[q.id] ? revealed[q.id] : null;
    return (
      <main>
        <div className="meta">
          <span>{EXAM_NAMES[exam]} · Question {idx + 1} of {questions.length}</span>
          <span className="row" style={{ gap: 6 }}><Clock size={15} aria-hidden="true" /> {fmt(elapsed)} · Answered {answered}/{questions.length}</span>
        </div>
        <div className="progress"><div style={{ width: `${((idx + 1) / questions.length) * 100}%` }} /></div>
        <div className="card">
          <div className="row" style={{ justifyContent: "space-between", marginBottom: 6 }}>
            <strong style={{ color: "var(--muted)", fontSize: 14 }}>QUESTION {idx + 1}</strong>
            <div className="row" style={{ gap: 8 }}>
              <button className="flag-btn" onClick={toggleAnswer} disabled={revealing} aria-pressed={!!shown}>
                {shown ? <EyeOff size={15} aria-hidden="true" /> : <Eye size={15} aria-hidden="true" />} {shown ? "Hide answer" : revealing ? "Loading…" : "Show answer"}
              </button>
              <button className={`flag-btn ${flags[q.id] ? "on" : ""}`} onClick={() => setFlags({ ...flags, [q.id]: !flags[q.id] })} aria-pressed={!!flags[q.id]}>
                <Flag size={15} aria-hidden="true" /> {flags[q.id] ? "Flagged" : "Flag for review"}
              </button>
            </div>
          </div>
          <p className="qtext">{q.q}</p>
          <p className="hint">{q.multi ? "Select all that apply." : "Select one answer."}</p>
          <div role={q.multi ? "group" : "radiogroup"}>
            {q.options.map((opt, i) => (
              <label key={i} className={`opt ${sel.includes(i) ? "on" : ""} ${shown ? (shown.includes(i) ? "correct" : sel.includes(i) ? "wrong" : "") : ""}`}>
                <input type={q.multi ? "checkbox" : "radio"} name={q.id} checked={sel.includes(i)} disabled={!!shown} onChange={() => toggleOption(i)} />
                <span className="lt">{LETTERS[i]}.</span>
                <span>{opt}</span>
              </label>
            ))}
          </div>
          {shown && (
            <div className={`reveal ${sameSet(sel, shown) ? "ok" : "no"}`} role="status">
              <strong>{sel.length === 0 ? "Correct answer" : sameSet(sel, shown) ? "Correct" : "Not quite"}</strong>
              <span>{shown.map((i) => `${LETTERS[i]}. ${q.options[i]}`).join("; ")}</span>
              <small>Your selection is locked while the answer is shown.</small>
            </div>
          )}
          <div className="actions">
            <div className="row">
              <button className="btn ghost" disabled={idx === 0} onClick={() => setIdx(idx - 1)}><ChevronLeft size={18} aria-hidden="true" /> Previous</button>
              <button className="btn ghost" disabled={idx === questions.length - 1} onClick={() => setIdx(idx + 1)}>Next <ChevronRight size={18} aria-hidden="true" /></button>
            </div>
            <button className="btn" onClick={() => setConfirmOpen(true)}><Send size={18} aria-hidden="true" /> Submit exam</button>
          </div>
        </div>

        <p className="report">Spotted a mistake? <Link href={`/contact?topic=correction&exam=${encodeURIComponent(exam)}&q=${encodeURIComponent(q.id)}`} target="_blank" rel="noopener">Suggest a correction</Link></p>

        <details style={{ marginTop: 18 }}>
          <summary style={{ cursor: "pointer", color: "var(--muted)" }}>Jump to a question</summary>
          <div className="palette">
            {questions.map((qq, i) => (
              <button key={qq.id} className={`pal ${i === idx ? "on" : ""} ${(answers[qq.id] || []).length ? "done" : ""} ${flags[qq.id] ? "flag" : ""}`} onClick={() => setIdx(i)} aria-label={`Question ${i + 1}`}>{i + 1}</button>
            ))}
          </div>
        </details>

        {confirmOpen && (
          <div className="modal-back" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
            <div className="modal">
              <h2 id="confirm-title">Submit this exam?</h2>
              <p style={{ color: "var(--muted)" }}>You have answered {answered} of {questions.length} questions. Unanswered questions count as incorrect.</p>
              <div className="row" style={{ justifyContent: "flex-end" }}>
                <button className="btn ghost" onClick={() => setConfirmOpen(false)} disabled={submitting}><X size={16} aria-hidden="true" /> Keep practising</button>
                <button className="btn" onClick={submitExam} disabled={submitting}><Send size={16} aria-hidden="true" /> {submitting ? "Submitting…" : "Yes, submit"}</button>
              </div>
            </div>
          </div>
        )}
        {error && <div className="error" role="alert"><AlertCircle size={18} aria-hidden="true" /> {error}</div>}
        {topButton}
      </main>
    );
  }

  if (stage === "results" && result) {
    const total = result.total;
    const byId = Object.fromEntries(result.items.map((i) => [i.id, i]));
    const ordered = (questions.length ? questions.map((qq) => byId[qq.id]).filter(Boolean) : result.items).map((it, n) => ({ ...it, n: n + 1 }));
    const status = (it) => (it.correct ? "ok" : it.skipped ? "skip" : "no");
    const label = { ok: "Correct", no: "Incorrect", skip: "Skipped" };
    const pct = total ? Math.round((result.score / total) * 100) : 0;
    const skipped = ordered.filter((i) => i.skipped).length;
    const wrong = ordered.filter((i) => !i.correct && !i.skipped).length;
    const flagged = ordered.filter((i) => flags[i.id]).length;
    const shown = ordered.filter((i) =>
      filter === "all" ? true : filter === "wrong" ? !i.correct && !i.skipped : filter === "skipped" ? i.skipped : !!flags[i.id]);
    return (
      <main>
        <div className="card">
          <div className="eyebrow">Results · {exam}</div>
          <div className="score">{pct}%</div>
          <p style={{ margin: 0 }}>{result.score} of {total} correct · {fmt(elapsed)} taken</p>
          <div className="row" style={{ marginTop: 10, color: "var(--muted)", fontSize: 14 }}>
            <span>Incorrect: {wrong}</span><span>Skipped: {skipped}</span><span>Flagged: {flagged}</span>
          </div>
        </div>

        <div className="card" style={{ marginTop: 22 }}>
          <h2 style={{ fontSize: 18, lineHeight: "24px" }}>Question map</h2>
          <div className="legend">
            <span><i className="sw ok" /> Correct ({result.score})</span>
            <span><i className="sw no" /> Incorrect ({wrong})</span>
            <span><i className="sw skip" /> Skipped ({skipped})</span>
            <span><i className="sw flag" /> Flagged ({flagged})</span>
          </div>
          <div className="palette">
            {ordered.map((it) => (
              <button key={it.id} className={`pal res ${status(it)} ${flags[it.id] ? "flag" : ""}`} onClick={() => jumpTo(it.id)}
                aria-label={`Question ${it.n}: ${label[status(it)]}${flags[it.id] ? ", flagged" : ""}`} title={`Question ${it.n}: ${label[status(it)]}`}>
                {it.n}
                {status(it) === "ok" && <Check size={11} aria-hidden="true" />}
                {status(it) === "no" && <X size={11} aria-hidden="true" />}
              </button>
            ))}
          </div>
        </div>

        <div className="row" style={{ margin: "22px 0 14px" }}>
          {[["all", `All (${total})`], ["wrong", `Incorrect (${wrong})`], ["skipped", `Skipped (${skipped})`], ["flagged", `Flagged (${flagged})`]].map(([k, label]) => (
            <button key={k} className={`flag-btn ${filter === k ? "on" : ""}`} onClick={() => setFilter(k)}>{label}</button>
          ))}
        </div>

        {shown.map((it) => {
          const yours = it.selected.length ? it.selected.map((i) => `${LETTERS[i]}. ${it.options[i]}`).join("; ") : "No answer";
          const correct = it.correctIdx.map((i) => `${LETTERS[i]}. ${it.options[i]}`).join("; ");
          return (
            <div key={it.id} id={`rv-${it.id}`} className={`review ${it.correct ? "ok" : "no"}`}>
              <div style={{ fontSize: 14, color: "var(--muted)" }}>Question {it.n} · {label[status(it)]}</div>
              <div className="qtext" style={{ fontSize: 16 }}>{it.q}</div>
              <div className="ans">Your answer: <b>{yours}</b></div>
              <div className="ans">Correct answer: <b>{correct}</b></div>
              <div className="ans"><Link href={`/contact?topic=correction&exam=${encodeURIComponent(exam)}&q=${encodeURIComponent(it.id)}`} target="_blank" rel="noopener">Suggest a correction</Link></div>
            </div>
          );
        })}
        {shown.length === 0 && <p style={{ color: "var(--muted)" }}>Nothing in this filter.</p>}

        <div className="row" style={{ marginTop: 24 }}>
          <button className="btn" onClick={start}><RotateCcw size={18} aria-hidden="true" /> Retake exam</button>
          <Link className="btn ghost" href="/"><Home size={18} aria-hidden="true" /> Choose another exam</Link>
        </div>
        {topButton}
      </main>
    );
  }

  return <main><p>Loading…</p></main>;
}
