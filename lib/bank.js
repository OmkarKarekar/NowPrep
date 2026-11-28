// Server-only: answer keys never leave the server through these helpers.
import fs from "fs";
import path from "path";

const FILES = { CSA: "csa.json", CAD: "cad.json", "CIS-DF": "cmdb.json", "CIS-ITSM": "itsm.json", "CIS-CSM": "csm.json" };

// Object order is the display order on the home page.
export const EXAMS = {
  CSA: {
    code: "CSA", slug: "csa", short: "CSA", name: "Certified System Administrator", focus: "Covers everyday platform administration.",
    summary: "Practice questions for the ServiceNow Certified System Administrator (CSA) exam, covering everyday platform administration.",
    topics: ["Platform navigation, lists and forms", "Users, groups and roles", "Tasks, SLAs and notifications", "Service Catalog and knowledge management", "Import sets and transform maps", "CMDB basics and reporting"],
  },
  CAD: {
    code: "CAD", slug: "cad", short: "CAD", name: "Certified Application Developer", focus: "Covers scoped application development.",
    summary: "Practice questions for the ServiceNow Certified Application Developer (CAD) exam, covering scoped application development.",
    topics: ["Scoped applications and tables", "Business rules, client scripts and script includes", "Access controls and application security", "Flow Designer and integrations (REST)", "Forms, UI policies and notifications", "Update sets, testing and debugging"],
  },
  "CIS-DF": {
    code: "CIS-DF", slug: "cis-df", short: "CIS-DF", name: "Certified Implementation Specialist: Data Foundations (CMDB and CSDM)", focus: "Covers the CMDB and CSDM.",
    summary: "Practice questions for the ServiceNow Certified Implementation Specialist Data Foundations (CIS-DF) exam, covering the CMDB and the Common Service Data Model.",
    topics: ["CMDB data quality and health", "Identification and reconciliation (IRE)", "CSDM layers and life cycle", "CMDB Data Manager and governance", "Service Graph Connectors and data sources", "CMDB Workspace and CMDB 360"],
  },
  "CIS-ITSM": {
    code: "CIS-ITSM", slug: "cis-itsm", short: "CIS-ITSM", name: "Certified Implementation Specialist: IT Service Management", focus: "Covers incident, problem, change and request.",
    summary: "Practice questions for the ServiceNow Certified Implementation Specialist IT Service Management (CIS-ITSM) exam.",
    topics: ["Incident and problem management", "Change enablement and change models", "Request fulfilment and Service Catalog", "Knowledge management", "Service Level Management", "CMDB in service management processes"],
  },
  "CIS-CSM": {
    code: "CIS-CSM", slug: "cis-csm", short: "CIS-CSM", name: "Certified Implementation Specialist: Customer Service Management", focus: "Covers cases, accounts and entitlements.",
    summary: "Practice questions for the ServiceNow Certified Implementation Specialist Customer Service Management (CIS-CSM) exam.",
    topics: ["Cases, accounts, contacts and consumers", "Entitlements and service contracts", "Case routing and assignment", "Customer portals and communities", "Knowledge and chat", "Implementation workshops and best practice"],
  },
};

// Other certifications we do not have questions for yet.
export const COMING_SOON = [
  { code: "CIS-HRSD", name: "HR Service Delivery" },
  { code: "CIS-SPM", name: "Strategic Portfolio Management" },
  { code: "CIS-VR", name: "Vulnerability Response" },
  { code: "CIS-SIR", name: "Security Incident Response" },
  { code: "CIS-Discovery", name: "Discovery" },
  { code: "CIS-FSM", name: "Field Service Management" },
  { code: "CIS-HAM", name: "Hardware Asset Management" },
  { code: "CIS-SAM", name: "Software Asset Management" },
];

// Own-property checks, so inputs like "constructor" or "__proto__" never count as exams.
const own = (obj, key) => typeof key === "string" && Object.prototype.hasOwnProperty.call(obj, key);
export const isExam = (code) => own(EXAMS, code);
export const examBySlug = (slug) => Object.values(EXAMS).find((e) => e.slug === slug) || null;

// Look for the data folder from the project root, then from the parent folder.
function dataDir() {
  const candidates = [path.join(process.cwd(), "data"), path.join(process.cwd(), "..", "data")];
  const found = candidates.find((d) => fs.existsSync(path.join(d, "cad.json")));
  if (!found) throw new Error("Question data folder not found on the server.");
  return found;
}

export function loadBank(exam) {
  if (!own(FILES, exam)) return null;
  return JSON.parse(fs.readFileSync(path.join(dataDir(), FILES[exam]), "utf8"));
}

export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Client-safe view: no answer keys.
export function publicQuestion(q) {
  return { id: q.id, q: q.q, options: q.options, multi: q.multi };
}
