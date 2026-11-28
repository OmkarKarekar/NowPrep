"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { RefreshCw, ArrowRight } from "lucide-react";

const LETTERS = "ABCDE";

export default function HeroTry() {
  const [sample, setSample] = useState(null);
  const [picked, setPicked] = useState(null);
  const [correct, setCorrect] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setBusy(true); setError(""); setPicked(null); setCorrect(null);
    try {
      const res = await fetch("/api/sample", { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error();
      setSample(data);
    } catch (err) {
      setError("Could not load a sample question.");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function pick(i) {
    if (!sample || correct) return;
    setPicked(i); setError("");
    try {
      const res = await fetch("/api/reveal", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ exam: sample.exam, id: sample.question.id }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error();
      setCorrect(data.correct);
    } catch (err) {
      setError("Could not check the answer.");
      setPicked(null);
    }
  }

  const q = sample && sample.question;
  const right = correct && picked !== null && correct.includes(picked);

  return (
    <div className="try">
      <div className="try-head">
        <strong>Try a question</strong>
        {sample && <span className="code">{sample.exam}</span>}
      </div>
      {!q && !error && <p className="try-note">Loading a question&hellip;</p>}
      {error && <p className="try-note" role="alert">{error}</p>}
      {q && (
        <>
          <p className="qtext">{q.q}</p>
          <div role="group" aria-label="Answer options">
            {q.options.map((opt, i) => (
              <button
                key={i}
                type="button"
                className={`opt ${correct ? (correct.includes(i) ? "correct" : picked === i ? "wrong" : "") : ""}`}
                disabled={!!correct}
                onClick={() => pick(i)}
              >
                <span className="lt">{LETTERS[i]}.</span>
                <span>{opt}</span>
              </button>
            ))}
          </div>
          <div aria-live="polite">
            {correct && (
              <p className={`try-result ${right ? "ok" : "no"}`}>
                <strong>{right ? "Correct." : "Not quite."}</strong>{" "}
                {!right && <>The answer is {correct.map((i) => `${LETTERS[i]}. ${q.options[i]}`).join("; ")}.</>}
              </p>
            )}
          </div>
          <div className="row" style={{ marginTop: 14 }}>
            <button type="button" className="btn ghost" onClick={load} disabled={busy}>
              <RefreshCw size={16} aria-hidden="true" /> Another question
            </button>
            {correct && (
              <Link className="btn" href={`/exam?exam=${encodeURIComponent(sample.exam)}`}>
                Practise {sample.exam} <ArrowRight size={16} aria-hidden="true" />
              </Link>
            )}
          </div>
        </>
      )}
    </div>
  );
}
