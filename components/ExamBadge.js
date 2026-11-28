import { Settings, Code2, Database, Headset, Users, Award } from "lucide-react";

const ICONS = { CSA: Settings, CAD: Code2, "CIS-DF": Database, "CIS-ITSM": Headset, "CIS-CSM": Users };

// NowPrep's own practice badge. It is not an official ServiceNow credential.
export default function ExamBadge({ code, size = 176 }) {
  const Icon = ICONS[code] || Award;
  return (
    <figure className="badge" style={{ width: size }}>
      <div className="badge-art" role="img" aria-label={`${code} practice badge`}>
        <svg viewBox="0 0 120 138" aria-hidden="true">
          <polygon points="60,3 114,34 114,104 60,135 6,104 6,34" fill="#001f30" stroke="#62d84e" strokeWidth="4" strokeLinejoin="round" />
          <polygon points="60,14 104,39 104,99 60,124 16,99 16,39" fill="none" stroke="#1f4a5e" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
        <div className="badge-in">
          <Icon size={30} aria-hidden="true" />
          <strong>{code}</strong>
          <span>PRACTICE</span>
        </div>
      </div>
      <figcaption>NowPrep practice badge</figcaption>
    </figure>
  );
}
