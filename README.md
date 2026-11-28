# NowPrep

Practice exams for ServiceNow certifications (CSA, CAD, CIS-DF, CIS-ITSM and CIS-CSM). The UI is documented in `DESIGN.md`.

## Run locally

    npm install
    npm run build
    npm start        # open http://localhost:3000

## Security and SEO

- `next.config.js` sends a Content-Security-Policy, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy, COOP/CORP and HSTS headers, and hides `X-Powered-By`. Scripts allow `'unsafe-inline'` because Next.js and the theme bootstrap use inline scripts.
- API routes validate input, cap body size, require JSON, refuse requests from other websites (Origin check), and apply a best-effort per-IP rate limit (`lib/guard.js`). The limiter only trusts Netlify's `x-nf-client-connection-ip` header (a client-supplied `X-Forwarded-For` is ignored); on other hosts all callers share one larger bucket. Serverless instances do not share memory, so this slows scraping but is not a hard limit. The Next.js image optimiser is switched off because the site does not use it.
- The contact form requires a valid, non-disposable email, has a honeypot field, a 4-second minimum fill time and a 60-second cooldown. These checks run in the browser; anyone can post to Netlify directly, so also turn on Netlify's spam filtering and use the notification emails with care. Format checks cannot prove someone owns an address.
- SEO: per-page titles and descriptions, canonical URLs, Open Graph and Twitter tags, JSON-LD (WebSite, Organization, BreadcrumbList, FAQPage), `sitemap.xml`, `robots.txt`, a favicon and a share image. Set `NEXT_PUBLIC_SITE_URL` to your real domain (Netlify's `URL` is used by default).
- Run `npm audit` on a network that can reach the npm registry and keep Next.js on the latest 14.2.x patch release.

## Where things live

- Set `NEXT_PUBLIC_CONTACT_EMAIL` (for example in `.env.local`) to the address shown on the contact page. Until then a placeholder address is shown.
- The contact form uses Netlify Forms (`public/__forms.html`) and accepts one optional attachment: PDF, image, Word, Excel or text, up to 5 MB, checked in the browser against an allow-list (no archives, scripts or executables). Netlify limits a whole submission to about 8 MB. It only works once deployed on Netlify; locally it shows the failure message.
- To receive the messages by email: (1) deploy the site on Netlify, (2) open the site in Netlify, then Forms, and check that a form named `contact` is listed (enable form detection and redeploy if it is not), (3) go to Forms, Form notifications, Add notification, Email notification, choose the `contact` form and enter the address that should receive messages, (4) set `NEXT_PUBLIC_CONTACT_EMAIL` under Site configuration, Environment variables, and redeploy. Submissions always appear under Forms, Submissions (check the Spam tab too) even before a notification is set up. After the first deploy, open the site in Netlify, go to Forms, then Form notifications, and add an email notification so messages reach you.

- `app/` pages and API routes. `/api/exam/[exam]` serves questions without answers. `/api/grade` marks a submission.
- `lib/bank.js` server-only loading of question banks and shuffling.
- `data/cad.json`, `data/csa.json`, `data/csm.json`, `data/itsm.json` and `data/cmdb.json` are the question banks, including answer keys. Keep this folder server-side.
- `components/ExamClient.js` the exam flow: setup, quiz, submit with confirmation, results, back-to-top arrow.
- `components/Header.js` logo (home link) and theme toggle (dark is default).

## Marking

A question is correct only when the selected options exactly match the correct option(s). Unanswered questions count as incorrect. Score = correct / total questions.

## Before release

- `data/csm.json`: 48 questions have hand-written wrong options. Review them.
- `data/cad.json`: 102 answers come from the source dump and are not yet checked against official documentation.
