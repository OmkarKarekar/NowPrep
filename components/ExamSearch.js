"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function ExamSearch({ exams, compact = false }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const box = useRef(null);

  const matches = useMemo(() => {
    const s = query.trim().toLowerCase();
    return s ? exams.filter((e) => `${e.code} ${e.name}`.toLowerCase().includes(s)) : exams;
  }, [query, exams]);

  useEffect(() => {
    const close = (e) => { if (box.current && !box.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const go = (e) => {
    setOpen(false); setQuery(""); setActive(0);
    document.getElementById("exam-search")?.blur();
    router.push(`/exam?exam=${encodeURIComponent(e.code)}`);
  };

  function onKeyDown(e) {
    if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setActive((a) => Math.min(a + 1, matches.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === "Enter" && open && matches[active]) { e.preventDefault(); go(matches[active]); }
    else if (e.key === "Escape") setOpen(false);
  }

  return (
    <div className={`search ${compact ? "compact" : ""}`} ref={box}>
      <label className="search-field">
        <Search size={compact ? 15 : 18} aria-hidden="true" />
        <span className="sr-only">Search exams</span>
        <input
          id="exam-search"
          type="search"
          role="combobox"
          aria-expanded={open}
          aria-controls="exam-results"
          aria-activedescendant={open && matches[active] ? `exam-opt-${active}` : undefined}
          autoComplete="off"
          placeholder="Search exams"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setActive(0); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
        />
      </label>
      {open && (
        <ul className="results" id="exam-results" role="listbox" aria-label="Exams">
          {matches.map((e, i) => (
            <li key={e.code} id={`exam-opt-${i}`} role="option" aria-selected={i === active} onMouseEnter={() => setActive(i)} onMouseDown={() => go(e)}>
              <span className="code">{e.code}</span>
              <span className="nm">{e.name}</span>
              <span className="ct">{e.count} questions</span>
            </li>
          ))}
          {matches.length === 0 && <li className="none" role="option" aria-selected="false">No exams match &ldquo;{query}&rdquo;.</li>}
        </ul>
      )}
    </div>
  );
}
