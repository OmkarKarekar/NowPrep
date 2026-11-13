// Server-only: answer keys never leave the server through these helpers.
import fs from "fs";
import path from "path";

const FILES = { CAD: "cad.json", "CIS-CSM": "csm.json", CMDB: "cmdb.json" };

export const EXAMS = {
  CAD: { code: "CAD", name: "Certified Application Developer", short: "CAD" },
  "CIS-CSM": { code: "CIS-CSM", name: "Certified Implementation Specialist: Customer Service Management", short: "CIS-CSM" },
  CMDB: { code: "CMDB", name: "CMDB and CSDM", short: "CMDB" },
};

// Look for the data folder from the project root, then from the parent folder.
function dataDir() {
  const candidates = [path.join(process.cwd(), "data"), path.join(process.cwd(), "..", "data")];
  const found = candidates.find((d) => fs.existsSync(path.join(d, "cad.json")));
  if (!found) throw new Error("Question data folder not found on the server.");
  return found;
}

export function loadBank(exam) {
  const file = FILES[exam];
  if (!file) return null;
  return JSON.parse(fs.readFileSync(path.join(dataDir(), file), "utf8"));
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
