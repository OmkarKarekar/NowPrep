"use client";
import { Search } from "lucide-react";

// Focuses the search field in the top bar.
export default function FindExamButton() {
  function focusSearch() {
    window.scrollTo({ top: 0 });
    document.getElementById("exam-search")?.focus();
  }
  return (
    <button className="btn" onClick={focusSearch}>
      <Search className="i" aria-hidden="true" /> Find your exam
    </button>
  );
}
