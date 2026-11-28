// Set NEXT_PUBLIC_CONTACT_EMAIL in .env.local. The .example address is a placeholder, not a real mailbox.
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@nowprep.example";

export const TOPICS = [
  { value: "correction", label: "Suggest a correction" },
  { value: "question", label: "Contribute a question" },
  { value: "bug", label: "Report a problem with the site" },
  { value: "general", label: "General message" },
];

// Public site address. Netlify provides URL at build time; set NEXT_PUBLIC_SITE_URL to override.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || process.env.URL || "http://localhost:3000").replace(/\/+$/, "");
export const SITE_NAME = "NowPrep";

const DISPOSABLE = new Set([
  "mailinator.com", "guerrillamail.com", "guerrillamail.net", "sharklasers.com", "10minutemail.com", "10minutemail.net", "tempmail.com", "temp-mail.org",
  "yopmail.com", "trashmail.com", "getnada.com", "throwawaymail.com", "maildrop.cc", "dispostable.com", "fakeinbox.com", "mailnesia.com", "mintemail.com", "tempr.email",
]);

// Checks the format and rejects well-known disposable domains. It cannot prove the person owns the mailbox.
export function validateEmail(value) {
  const v = (value || "").trim();
  if (!v) return "Please enter your email address.";
  const shape = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;
  const [local, domain = ""] = v.split("@");
  const tld = domain.split(".").pop().toLowerCase();
  if (v.length > 254 || local.length > 64 || !shape.test(v) || v.includes("..") || local.startsWith(".") || local.endsWith(".") || !/^(?:[a-z]{2,}|xn--[a-z0-9-]{2,})$/.test(tld)) return "That email address does not look right.";
  if (DISPOSABLE.has(domain.toLowerCase())) return "Please use a permanent email address, not a disposable one.";
  return "";
}
