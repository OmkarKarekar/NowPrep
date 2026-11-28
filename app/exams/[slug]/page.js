import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import JsonLd from "../../../components/JsonLd";
import ExamBadge from "../../../components/ExamBadge";
import Breadcrumbs from "../../../components/Breadcrumbs";
import { EXAMS, examBySlug, loadBank } from "../../../lib/bank";
import { SITE_URL } from "../../../lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.values(EXAMS).map((e) => ({ slug: e.slug }));
}

function facts(exam) {
  const bank = loadBank(exam.code);
  const multi = bank.filter((q) => q.multi).length;
  return { total: bank.length, multi, single: bank.length - multi };
}

export function generateMetadata({ params }) {
  const exam = examBySlug(params.slug);
  if (!exam) return {};
  const { total } = facts(exam);
  const title = `ServiceNow ${exam.short} practice exam`;
  const description = `Free ServiceNow ${exam.short} practice exam: ${total} questions with instant answers and a score review. ${exam.focus}`;
  const url = `/exams/${exam.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", siteName: "NowPrep", title: `${title} | NowPrep`, description, url, locale: "en_US" },
    twitter: { card: "summary_large_image", title: `${title} | NowPrep`, description },
  };
}

export default function ExamLanding({ params }) {
  const exam = examBySlug(params.slug);
  if (!exam) notFound();
  const { total, single, multi } = facts(exam);
  const others = Object.values(EXAMS).filter((e) => e.code !== exam.code);
  const practice = `/exam?exam=${encodeURIComponent(exam.code)}`;
  const faqs = [
    { q: `Is the ${exam.short} practice exam free?`, a: "Yes. NowPrep is free to use and you do not need an account." },
    { q: `How many ${exam.short} practice questions are there?`, a: `There are ${total} questions: ${single} single-answer and ${multi} multiple-answer. You can practise them in order or shuffled.` },
    { q: "Can I see the correct answer while I practise?", a: "Yes. Use Show answer on any question to see the correct option, and Hide answer to try again. At the end you get your score and every correct answer." },
    { q: "Are these official ServiceNow questions?", a: "No. NowPrep is an independent study resource, not affiliated with or endorsed by ServiceNow, Inc. The questions are community practice material and may contain mistakes, so check anything important against the official ServiceNow documentation." },
    { q: "I found a mistake. What should I do?", a: "Use the Suggest a correction link on any question, or contact us. We review every report." },
  ];
  return (
    <main>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Exams", item: `${SITE_URL}/exams` },
        { "@type": "ListItem", position: 3, name: exam.short, item: `${SITE_URL}/exams/${exam.slug}` },
      ] }} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }} />

      <Breadcrumbs items={[{ label: "Exams", href: "/exams" }, { label: exam.short }]} />

      <div className="card setup">
        <div>
          <div className="eyebrow">{exam.short}</div>
          <h1 style={{ fontSize: 32, lineHeight: "38px" }}>ServiceNow {exam.short} practice exam</h1>
          <p className="lead" style={{ fontSize: 16 }}>{exam.name}. {exam.summary} {total} free questions with instant answers and a score review.</p>
          <div className="row">
            <Link className="btn" href={practice}>Start practising</Link>
            <Link className="btn ghost" href="/exams">All exams</Link>
          </div>
          <dl className="stats">
            <div><dt>Questions</dt><dd>{total}</dd></div>
            <div><dt>Single answer</dt><dd>{single}</dd></div>
            <div><dt>Multiple answer</dt><dd>{multi}</dd></div>
          </dl>
        </div>
        <ExamBadge code={exam.code} />
      </div>

      <section className="about">
        <h2>What the {exam.short} exam covers</h2>
        <div className="card">
          <ul className="plain">
            {exam.topics.map((t) => <li key={t}><Check className="i" aria-hidden="true" /> {t}</li>)}
          </ul>
        </div>
        <p className="callout">These are general topic areas. For the full and current list, always check the official ServiceNow exam guide for {exam.short}.</p>
      </section>

      <section className="about">
        <h2>Frequently asked questions</h2>
        <div className="faq">
          {faqs.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="about">
        <h2>Other practice exams</h2>
        <div className="mini-cards">
          {others.map((e) => (
            <Link key={e.code} className="mini" href={`/exams/${e.slug}`}>
              <span className="code">{e.short}</span>
              <strong>{e.name.replace(/^Certified (Implementation Specialist: )?/, "")}</strong>
              <span className="muted">{facts(e).total} questions</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
