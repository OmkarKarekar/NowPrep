import Link from "next/link";
import { EXAMS } from "../lib/bank";

export default function Footer() {
  const exams = Object.values(EXAMS);
  return (
    <footer className="site">
      <div className="footer-inner">
        <div className="footer-grid">
          <div>
            <Link href="/" className="logo" aria-label="NowPrep home">
              <span className="logo-mark">N</span>
              <span>Now<span className="accent">Prep</span></span>
            </Link>
            <p>Free practice exams for people preparing for ServiceNow certifications, built with help from the community.</p>
          </div>
          <nav aria-label="Exams">
            <h3>Exams</h3>
            <ul>
              {exams.map((e) => (
                <li key={e.code}><Link href={`/exams/${e.slug}`}>{e.short}</Link></li>
              ))}
              <li><Link href="/exams">All exams</Link></li>
            </ul>
          </nav>
          <nav aria-label="Site">
            <h3>NowPrep</h3>
            <ul>
              <li><Link href="/#how">How it works</Link></li>
              <li><Link href="/#about">About</Link></li>
              <li><Link href="/contribute">Contribute</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </nav>
        </div>
        <div className="footer-base">
          <span>&copy; {new Date().getFullYear()} NowPrep</span>
          <span>NowPrep is an independent study resource and is not affiliated with or endorsed by ServiceNow, Inc. ServiceNow is a trademark of ServiceNow, Inc.</span>
        </div>
      </div>
    </footer>
  );
}
