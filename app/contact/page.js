import { Suspense } from "react";
import { Mail } from "lucide-react";
import ContactForm from "../../components/ContactForm";
import Breadcrumbs from "../../components/Breadcrumbs";
import { EXAMS } from "../../lib/bank";
import { CONTACT_EMAIL } from "../../lib/site";

export const metadata = { title: "Contact", description: "Send a correction, contribute a question or report a problem with NowPrep." };

export default function ContactPage() {
  const exams = Object.values(EXAMS).map(({ code }) => ({ code }));
  return (
    <main>
      <Breadcrumbs items={[{ label: "Contact" }]} />
      <div className="eyebrow">Contact</div>
      <h1>Get in touch</h1>
      <p className="lead">Found a mistake, want to add a question, or just have feedback? Send us a message. You do not need an account.</p>
      <div className="grid contact-grid">
        <Suspense fallback={<div className="card">Loading form&hellip;</div>}>
          <ContactForm exams={exams} />
        </Suspense>
        <aside className="card">
          <h2 style={{ fontSize: 18, lineHeight: "24px" }}>Email us directly</h2>
          <p style={{ color: "var(--muted)", marginTop: 0 }}>Prefer your own email? Write to us at:</p>
          <p><a className="mail" href={`mailto:${CONTACT_EMAIL}`}><Mail size={16} aria-hidden="true" /> {CONTACT_EMAIL}</a></p>
          <p style={{ color: "var(--muted)", fontSize: 14 }}>For a correction, include the exam, the question and what you think the right answer is. A link to the ServiceNow documentation helps us confirm it faster.</p>
        </aside>
      </div>
    </main>
  );
}
