"use client";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Send, AlertCircle, CheckCircle2 } from "lucide-react";
import { CONTACT_EMAIL, TOPICS, validateEmail } from "../lib/site";

const clean = (s, max) => s.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "").trim().slice(0, max);

const MAX_FILE = 5 * 1024 * 1024;
const ALLOWED = ["pdf", "png", "jpg", "jpeg", "gif", "webp", "txt", "csv", "json", "md", "doc", "docx", "xls", "xlsx"];
const ACCEPT = ALLOWED.map((x) => `.${x}`).join(",");

function checkFile(f) {
  if (!f) return "";
  const ext = f.name.includes(".") ? f.name.split(".").pop().toLowerCase() : "";
  if (!ALLOWED.includes(ext)) return `That file type is not accepted. Allowed: ${ALLOWED.join(", ")}.`;
  if (f.name.length > 100) return "The file name is too long. Please rename it and try again.";
  if (f.size === 0) return "That file is empty.";
  if (f.size > MAX_FILE) return "The file is larger than 5 MB.";
  return "";
}

const sizeLabel = (n) => (n >= 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);

export default function ContactForm({ exams = [] }) {
  const params = useSearchParams();
  const topicParam = params.get("topic");
  const [topic, setTopic] = useState(TOPICS.some((t) => t.value === topicParam) ? topicParam : "general");
  const [exam, setExam] = useState(exams.some((e) => e.code === params.get("exam")) ? params.get("exam") : "");
  const [ref, setRef] = useState((params.get("q") || "").slice(0, 40));
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [fileKey, setFileKey] = useState(0);
  const [error, setError] = useState("");
  const [errorField, setErrorField] = useState("");
  const [status, setStatus] = useState("idle");
  const opened = useRef(Date.now());
  useEffect(() => { opened.current = Date.now(); }, []);

  function fail(field, text) { setErrorField(field); setError(text); }

  function pickFile(e) {
    const f = e.target.files && e.target.files[0] ? e.target.files[0] : null;
    const problem = checkFile(f);
    if (problem) { fail("file", problem); setFile(null); setFileKey((k) => k + 1); return; }
    setError(""); setErrorField(""); setFile(f);
  }

  function removeFile() { setFile(null); setFileKey((k) => k + 1); }

  async function submit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const emailProblem = validateEmail(email);
    if (emailProblem) { fail("email", emailProblem); return; }
    if (clean(message, 1500).length < 10) { fail("message", "Please write a message of at least 10 characters."); return; }
    if (Date.now() - opened.current < 4000) { fail("message", "Please take a moment to review your message, then send it again."); return; }
    try {
      const last = Number(localStorage.getItem("nowprep-last-contact") || 0);
      if (Date.now() - last < 60000) { fail("", "You sent a message a moment ago. Please wait a minute before sending another."); return; }
    } catch (err) {}
    const fileProblem = checkFile(file);
    if (fileProblem) { fail("file", fileProblem); return; }
    setError(""); setErrorField(""); setStatus("sending");
    const data = new FormData();
    data.append("form-name", "contact");
    data.append("bot-field", form.elements["bot-field"].value);
    data.append("topic", TOPICS.find((t) => t.value === topic).label);
    data.append("exam", exam);
    data.append("question", clean(ref, 40));
    data.append("name", clean(name, 80));
    data.append("email", clean(email, 254));
    data.append("message", clean(message, 1500));
    if (file) data.append("attachment", file, file.name);
    try {
      const res = await fetch("/__forms.html", { method: "POST", body: data });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      try { localStorage.setItem("nowprep-last-contact", String(Date.now())); } catch (err) {}
      setStatus("sent");
      setMessage(""); setRef(""); setName(""); setEmail(""); removeFile();
    } catch (err) {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="card form-done" role="status">
        <CheckCircle2 className="i big" aria-hidden="true" />
        <h2 style={{ fontSize: 20, lineHeight: "26px" }}>Thank you, your message has been sent</h2>
        <p className="muted" style={{ margin: "0 0 16px" }}>We read everything and will review any correction or question before it appears on the site.</p>
        <button className="btn ghost" onClick={() => setStatus("idle")}>Send another message</button>
      </div>
    );
  }

  return (
    <form className="card form" name="contact" onSubmit={submit} noValidate>
      <p className="sr-only" aria-hidden="true"><label>Do not fill this in: <input name="bot-field" tabIndex={-1} autoComplete="off" /></label></p>
      <label>
        <span>Topic</span>
        <select value={topic} onChange={(e) => setTopic(e.target.value)}>
          {TOPICS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </label>
      <div className="form-two">
        <label>
          <span>Exam (optional)</span>
          <select value={exam} onChange={(e) => setExam(e.target.value)}>
            <option value="">Not specific</option>
            {exams.map((e) => <option key={e.code} value={e.code}>{e.code}</option>)}
          </select>
        </label>
        <label>
          <span>Question number or id (optional)</span>
          <input type="text" value={ref} onChange={(e) => setRef(e.target.value)} placeholder="For example CSA-14" maxLength={40} />
        </label>
      </div>
      <div className="form-two">
        <label>
          <span>Your name (optional)</span>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" maxLength={80} />
        </label>
        <label>
          <span>Your email (required)</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" maxLength={254} required aria-required="true" aria-invalid={errorField === "email"} aria-describedby="email-help" />
          <small id="email-help" className="field-help">We only use it to reply to you. It is never shown on the site.</small>
        </label>
      </div>
      <label>
        <span>Message</span>
        <textarea rows={7} value={message} onChange={(e) => setMessage(e.target.value)} maxLength={1500} aria-required="true" aria-invalid={errorField === "message"}
          placeholder={topic === "correction" ? "What is wrong, what you think is correct, and a link to the ServiceNow documentation if you have one." : topic === "question" ? "The question, the options, the correct answer(s) and a link to the ServiceNow documentation that supports it." : "How can we help?"} />
      </label>
      <div className="form-file">
        <label htmlFor="attachment"><span>Attachment (optional)</span></label>
        <input key={fileKey} id="attachment" name="attachment" type="file" accept={ACCEPT} onChange={pickFile} aria-invalid={errorField === "file"} aria-describedby="file-help" />
        {file && <p className="file-chosen">{file.name} ({sizeLabel(file.size)}) <button type="button" className="link-btn" onClick={removeFile}>Remove</button></p>}
        <small id="file-help" className="field-help">One file, up to 5 MB: PDF, image, Word, Excel or text. Only send material you have the right to share, and nothing taken from an exam you have sat.</small>
      </div>
      {error && <div className="error" role="alert"><AlertCircle size={18} aria-hidden="true" /> {error}</div>}
      {status === "error" && <div className="error" role="alert"><AlertCircle size={18} aria-hidden="true" /> The message could not be sent. Please try again, or email us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</div>}
      <div className="row">
        <button className="btn" type="submit" disabled={status === "sending"}><Send size={18} aria-hidden="true" /> {status === "sending" ? "Sending…" : "Send message"}</button>
        <span className="hint" style={{ margin: 0 }}>{message.length}/1500</span>
      </div>
    </form>
  );
}
