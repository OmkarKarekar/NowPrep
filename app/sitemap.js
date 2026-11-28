import { EXAMS } from "../lib/bank";
import { SITE_URL } from "../lib/site";

export default function sitemap() {
  const now = new Date();
  const pages = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/exams", priority: 0.9, changeFrequency: "weekly" },
    ...Object.values(EXAMS).map((e) => ({ path: `/exams/${e.slug}`, priority: 0.8, changeFrequency: "weekly" })),
    { path: "/contribute", priority: 0.5, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.3, changeFrequency: "yearly" },
  ];
  return pages.map((p) => ({ url: `${SITE_URL}${p.path}`, lastModified: now, changeFrequency: p.changeFrequency, priority: p.priority }));
}
