import Link from "next/link";
import { PencilLine, FilePlus2, Bug } from "lucide-react";
import Breadcrumbs from "../../components/Breadcrumbs";

export const metadata = { title: "Contribute", description: "Help improve NowPrep: suggest a correction, contribute a practice question or report a problem." };

export default function ContributePage() {
  return (
    <main>
      <Breadcrumbs items={[{ label: "Contribute" }]} />
      <div className="eyebrow">Contribute</div>
      <h1>Help make NowPrep better</h1>
      <p className="lead">NowPrep is free for everyone, and it gets better when candidates help. If you spot a wrong answer or have a good question, tell us.</p>

      <div className="grid three">
        <div className="card">
          <PencilLine className="i big" aria-hidden="true" />
          <h2 style={{ fontSize: 18, lineHeight: "24px" }}>Suggest a correction</h2>
          <p className="muted">An answer looks wrong, a question is unclear or an option is missing? Let us know which question and what you think is right.</p>
          <Link className="btn" href="/contact?topic=correction">Suggest a correction</Link>
        </div>
        <div className="card">
          <FilePlus2 className="i big" aria-hidden="true" />
          <h2 style={{ fontSize: 18, lineHeight: "24px" }}>Contribute a question</h2>
          <p className="muted">Write a new practice question for any of the exams and send it to us. We review it before adding it.</p>
          <Link className="btn" href="/contact?topic=question">Contribute a question</Link>
        </div>
        <div className="card">
          <Bug className="i big" aria-hidden="true" />
          <h2 style={{ fontSize: 18, lineHeight: "24px" }}>Report a problem</h2>
          <p className="muted">Something on the site is broken or hard to use? Tell us what you did and what you saw.</p>
          <Link className="btn" href="/contact?topic=bug">Report a problem</Link>
        </div>
      </div>

      <section className="about">
        <h2>What makes a good question</h2>
        <div className="card">
          <ul className="plain">
            <li>One clear question, with three to five options and the correct answer(s) marked.</li>
            <li>Write it in your own words. Please do not paste questions from exams you have sat or from paid material.</li>
            <li>Add a link to the ServiceNow documentation or training page that supports the answer, so we can check it.</li>
            <li>For multiple-answer questions, say how many to choose, for example &ldquo;Choose two.&rdquo;</li>
          </ul>
        </div>
        <p className="callout">Everything you send is reviewed before it appears on the site. We may edit questions for clarity.</p>
      </section>
    </main>
  );
}
