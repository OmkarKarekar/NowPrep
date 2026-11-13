"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function Header() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    setTheme(document.documentElement.getAttribute("data-theme") || "dark");
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("nowprep-theme", next); } catch (e) {}
    setTheme(next);
  }

  const isDark = theme === "dark";
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link href="/" className="logo" aria-label="NowPrep home">
          <span className="logo-mark">N</span>
          <span>Now<span className="accent">Prep</span></span>
        </Link>
        <button className="icon-btn" onClick={toggle} aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"} title={isDark ? "Light mode" : "Dark mode"}>
          {isDark ? <Sun className="i" aria-hidden="true" /> : <Moon className="i" aria-hidden="true" />}
          <span>{isDark ? "Light" : "Dark"}</span>
        </button>
      </div>
    </header>
  );
}
