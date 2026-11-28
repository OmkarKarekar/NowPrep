import Link from "next/link";
import { ArrowRight, Layers } from "lucide-react";
import JsonLd from "../../components/JsonLd";
import { EXAMS, COMING_SOON, loadBank } from "../../lib/bank";
import { SITE_URL } from "../../lib/site";
import Breadcrumbs from "../../components/Breadcrumbs";

const TITLE = "ServiceNow practice exams";
const DESC = "Browse free ServiceNow practice exams: CSA, CAD, CIS-DF, CIS-ITSM and CIS-CSM. Choose an exam, practise at your own pace and review your score.";

export const metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/exams" },
  openGraph: { type: "website", siteName: "NowPrep", title: `${TITLE} | NowPrep`, description: DESC, url: "/exams", locale: "en_US" },
};

export default function ExamsPage() {
  const exams = Object.values(EXAMS).map((e) => ({ ...e, count: loadBank(e.code).length }));
  return (
    <main>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Exams", item: `${SITE_URL}/exams` },
      ] }} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "ItemList", itemListElement: exams.map((e, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE_URL}/exams/${e.slug}`, name: e.name })) }} />
      <Breadcrumbs items={[{ label: "Exams" }]} />
      <div className="eyebrow">Exams</div>
      <h1>ServiceNow practice exams</h1>
      <p className="lead">Pick an exam to see what it covers and start practising. Everything is free.</p>

      <div className="exam-rows">
        {exams.map((e) => (
          <Link key={e.code} className="exam-row" href={`/exams/${e.slug}`}>
            <span className="code">{e.short}</span>
            <span className="exam-row-main">
              <strong>{e.name}</strong>
              <span className="muted">{e.summary}</span>
            </span>
            <span className="count"><Layers className="i" aria-hidden="true" /> {e.count} questions</span>
            <ArrowRight className="i go" aria-hidden="true" />
          </Link>
        ))}
      </div>

      <section className="about">
        <h2>More exams coming</h2>
        <p className="lead">These ServiceNow certifications are not available yet. Want one added sooner? Contribute original practice questions and help us build it.</p>
        <ul className="chips" aria-label="Exams not available yet">
          {COMING_SOON.map((c) => <li key={c.code}><span className="chip"><strong>{c.code}</strong> {c.name}</span></li>)}
        </ul>
        <div className="row" style={{ marginTop: 20 }}>
          <Link className="btn" href="/contribute">Contribute questions</Link>
        </div>
      </section>
    </main>
  );
}
