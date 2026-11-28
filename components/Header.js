"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Sun, Moon, ChevronDown } from "lucide-react";
import ExamSearch from "./ExamSearch";

export default function Header({ exams = [] }) {
  const [theme, setTheme] = useState("dark");
  const [menu, setMenu] = useState(false);
  const pathname = usePathname() || "";
  const item = useRef(null);

  useEffect(() => {
    if (!menu) return;
    const close = (e) => { if (item.current && !item.current.contains(e.target)) setMenu(false); };
    const esc = (e) => { if (e.key === "Escape") setMenu(false); };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", esc); };
  }, [menu]);

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
        <div className="topbar-search"><ExamSearch exams={exams} compact /></div>
        <nav className="nav" aria-label="Main">
          <div className="nav-item" ref={item}>
            <button className={`nav-btn ${pathname.startsWith("/exam") ? "active" : ""}`} aria-expanded={menu} aria-haspopup="true" aria-controls="exams-menu" onClick={() => setMenu(!menu)}>
              Exams <ChevronDown size={16} aria-hidden="true" />
            </button>
            {menu && (
              <div className="menu" id="exams-menu">
                {exams.map((e) => (
                  <Link key={e.code} href={`/exam?exam=${encodeURIComponent(e.code)}`} onClick={() => setMenu(false)}>
                    <span className="code">{e.code}</span>
                    <span className="nm">{e.name}</span>
                  </Link>
                ))}
                <Link href="/exams" onClick={() => setMenu(false)} className="menu-all">All exams and details</Link>
              </div>
            )}
          </div>
          <Link className="nav-link nav-hide-sm" href="/#about">About</Link>
          <Link className="nav-link nav-hide-md" href="/contribute" aria-current={pathname === "/contribute" ? "page" : undefined}>Contribute</Link>
          <Link className="nav-link nav-hide-xs" href="/contact" aria-current={pathname === "/contact" ? "page" : undefined}>Contact</Link>
        </nav>
        <button className="icon-btn icon-only theme-btn" onClick={toggle} aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"} title={isDark ? "Light mode" : "Dark mode"}>
          {isDark ? <Sun className="i" aria-hidden="true" /> : <Moon className="i" aria-hidden="true" />}
        </button>
      </div>
    </header>
  );
}
