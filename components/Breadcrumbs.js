import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

// items: [{ label, href? }]. The last item is the current page and has no link.
export default function Breadcrumbs({ items }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      <ol>
        <li>
          <Link href="/" aria-label="Home"><Home size={14} aria-hidden="true" /><span className="crumb-home">Home</span></Link>
        </li>
        {items.map((it, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${it.label}-${i}`}>
              <ChevronRight className="sep" size={14} aria-hidden="true" />
              {last || !it.href ? <span aria-current={last ? "page" : undefined}>{it.label}</span> : <Link href={it.href}>{it.label}</Link>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
