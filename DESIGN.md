# NowPrep Design

Draft derived from the current code (`app/globals.css`, `components/`, `app/`). Replace with the original design.md when available.

## Intent

NowPrep is a practice site for ServiceNow certification exams. The interface borrows the look of ServiceNow (Aurora design language): dark navy surfaces, the Now green accent, pill buttons and quiet cards. Candidates should feel they are in a familiar, trusted environment.

Goals: calm, focused, low-distraction. No decoration that competes with the question.

## Foundations

### Colour tokens

| Token | Dark (default) | Light | Use |
|---|---|---|---|
| `--bg` | `#001f30` | `#f7f8fa` | Page background |
| `--header` | `#001f30` | `#032d42` | Top bar (stays dark in both themes) |
| `--panel` | `#032d42` | `#ffffff` | Cards, options, modal |
| `--panel-2` | `#0a3a52` | `#f7f8fa` | Hover, selected and answered states |
| `--ink` | `#ffffff` | `#032d42` | Primary text |
| `--muted` | `#b9c7cf` | `#4d6472` | Secondary text, hints, metadata |
| `--line` | `#1f4a5e` | `#e5e7eb` | Borders, dividers, progress track |
| `--primary` / `--btn` | `#62d84e` | `#62d84e` | Primary actions, progress, selection |
| `--btn-hover` | `#4cc33a` | `#4cc33a` | Primary hover |
| `--btn-ink` | `#032d42` | `#032d42` | Text on green buttons |
| `--accent` | `#62d84e` | `#2e7d1f` | Eyebrows, card codes, icons |
| `--good` / `--good-bg` | `#62d84e` / green 14% | `#2e7d1f` / `#eaf8e6` | Correct answer |
| `--bad` / `--bad-bg` | `#ff8a80` / red 18% | `#d92d20` / `#fdecea` | Incorrect answer, errors |
| `--warn` | `#f5c451` | `#8a5b00` | Flagged questions |

Dark is the default theme. The choice is stored in `localStorage` under `nowprep-theme` and applied before first paint through `data-theme` on `<html>` to avoid a flash.

### Typography

- Font stack: ServiceNow Sans (licensed, used only if installed), Source Sans 3, Segoe UI, system sans-serif.
- Body 16/24. Question text 18/28. Meta and hints 14. Letter-spacing 0.
- `h1` 32/38 bold, `h2` 23/28 bold, lead paragraph 18/28 muted (max width 680px).
- Eyebrow: 14px, semibold, accent colour, sits above headings.

### Shape and spacing

- Content width: 1040px max, 20px side padding, 40px top, 80px bottom.
- Cards and options: 8px radius, 1px `--line` border, 20px padding. Hero 12px radius, modal 12px.
- Buttons, chips and segmented controls: fully rounded (9999px).
- Grid gap 20px. Light theme cards add a faint shadow; dark theme uses none.

### Focus and motion

- Focus ring: 3px `--primary`, 2px offset, on every interactive element.
- Transitions are minimal (progress bar width). All animation is disabled under `prefers-reduced-motion`.

## Components

### Top bar (`components/Header.js`)
Sticky, dark in both themes, 1px bottom border, full window width (24px side padding). The logo sits in the left corner (32px green rounded square with "N" and wordmark "Now**Prep**", "Prep" in green; links home). Everything else is one cluster on the right, in this order: the search (up to 240px, always open), an **Exams** dropdown, **About** (scrolls to the home page section), **Contribute**, **Contact** (the current page shown in green), and last an icon-only theme toggle. The space between the logo and the cluster grows with the window. The Exams menu lists every exam as code (green) over full name (muted), closes on outside click, Escape or selection, and is fed from `EXAMS` through the layout. Under 1000px Contribute is hidden, under 720px About and the other links drop out and the search moves to its own full-width row.

### Buttons
- **Primary** (`.btn`): 40px high, green fill, navy text, 14px semibold. Disabled at 45% opacity.
- **Ghost** (`.btn.ghost`): transparent, 1px border, hover fills with `--panel-2`.
- **Icon button** (`.icon-btn`): white outline on the dark bar.
- **Flag chip** (`.flag-btn`): 32px pill. The "on" state uses the warning colour.
- **Segmented control** (`.seg`): pill group for Sequential and Shuffled. The active segment is green.
- **Back to top** (`.to-top`): 44px green circle, fixed bottom right, appears after 500px of scroll.

### Exam search (`components/ExamSearch.js`)
The home page does not list exams as cards, so it scales to many exams. A compact 36px pill search field with a 14px font and a small icon sits at the start of the right-hand cluster in the top bar (translucent white on the dark bar). It is always open, up to 240px wide, and shrinks on narrower windows. Its results list is up to 420px wide. The hero's \"Find your exam\" button focuses it. Typing filters by code or name; focus shows a green ring and a results list (code, name, question count; 560px wide, max 340px high, scrolls). Arrow keys move, Enter opens, Escape closes, and picking an exam clears the field. It is a combobox with a listbox of options. The Exams menu in the top bar is the browse path.

(The earlier `.exam-card` style is no longer used on the home page.)

### Option row (`.opt`)
Full-width label with border and 12/16px padding: native radio or checkbox (green accent colour), bold letter ("A."), option text. Selected state: green border, `--panel-2` background and a 3px green inset bar on the left.

### Progress and meta
6px rounded progress bar in green on a `--line` track. Above it, a muted meta row: exam name and "Question N of M" on the left, timer and "Answered X/M" on the right.

### Question palette
Collapsible "Jump to a question" list of 40x36 number buttons. States: answered (panel-2, semibold), current (green border), flagged (warning border).

### Review card (`.review`)
Panel with a 4px left border: green when correct, red when incorrect or skipped. Shows id and status, the question, "Your answer" and "Correct answer" lines in muted text with bold values.

### Show answer
A small pill button with an eye icon sits beside Flag in the question header. It asks the server for that question's correct option(s). Afterwards the correct options turn green, a wrong selection turns red, the selection is locked, and a status panel (4px left border, green or red) reads "Correct", "Not quite" or "Correct answer" followed by the answer. The button then reads "Answer shown" and is disabled. Marking at the end still uses the candidate's own selection.

### Question map (results)
The results page shows a "Question map" card: a legend and one button per question, numbered in the order the candidate saw them. Correct is green with a check, incorrect is red with a cross, skipped is dashed and empty, and flagged adds a yellow bar along the bottom. Each button has a text label for screen readers and jumps to that question's review card, clearing any filter first.

### Footer (`components/Footer.js`)
Dark band on every page: logo and one-line description, an Exams column and a NowPrep column (How it works, About), then a bottom row with the copyright and the independence disclaimer (not affiliated with or endorsed by ServiceNow, Inc.). One column on mobile.

### About section
Anchored at `#about` on the home page: heading, lead paragraph, three short cards (Practise, Learn as you go, Review) and a callout noting that question sets are study material and may contain mistakes.

### Page background
A fixed layer of small green dots (22px grid) sits behind all content and fades out toward the edges (`--dot`: 24% green in dark, 32% deeper green in light). Cards and panels keep their solid fill, so text is never placed on the pattern.

### Mini exam cards (`.mini`)
Small, plain cards used for the home "Practice exams" section and the "Other practice exams" block: code in green, short exam name, question count. 8px radius, 1px border, border turns green and the card lifts 2px on hover. A dashed "View all exams" card ends the home row. The home section has 72px of space above and below and 20px between cards.

### Breadcrumbs (`components/Breadcrumbs.js`)
Plain text with a small home icon, chevron separators and the current page in bold ink. No pill, border or background. Links are muted and turn green with an underline on hover. Used on the exam index, exam pages, practice setup, Contribute and Contact. Under 720px the home label is hidden so long trails wrap cleanly.

### Modal
Centred 440px panel on a navy 60% backdrop. Used for the submit confirmation, with a ghost "Keep practising" and a primary "Yes, submit".

### Error banner (`.error`)
Red text on `--bad-bg`, 8px radius, alert icon, 14px.

Icons come from `lucide-react` at 18px (`svg.i`), 15 to 16px inside chips.

### Exam pages (`/exams` and `/exams/[slug]`)
Crawlable pages for search engines. `/exams` lists every exam as a row (code, name, summary, question count) and a "More exams coming" section of chips for certifications that are not available yet. Each `/exams/<slug>` page repeats the full-width setup layout with the practice badge, adds question counts, the topics the exam covers, a visible FAQ and links to the other exams. The practice runner at `/exam?exam=CODE` is marked noindex.

### Home hero (live elements)
Two columns on wide screens, stacked under 900px. Left: eyebrow, h1, lead, "Find your exam" and "How it works" buttons, and a stats row whose numbers count up on load (exams, questions) next to "Free". Right: a **Try a question** card (`components/HeroTry.js`). It loads a random short single-answer question from `/api/sample`; picking an option checks it through `/api/reveal`, marks it green or red, and offers "Another question" and a link to practise that exam. Content fades up on load and buttons lift 1px on hover. All motion is removed under `prefers-reduced-motion`.

### Exam setup instructions
The setup card spans the full 1040px content width, the same as the instruction cards below it. Text and controls are on the left. On the right is the exam's **practice badge** (`components/ExamBadge.js`): a navy hexagon with a green outline, an icon per exam, the exam code and the word PRACTICE, captioned "NowPrep practice badge". It is NowPrep's own artwork and deliberately not an official ServiceNow credential. Under 900px the badge moves above the text and shrinks.

Under the setup card, a "Before you start" section with three cards (This exam with question counts, While you practise, Marking and results) and a callout linking to the correction form. It also fills the page so the footer sits below the fold.

### Contact and Contribute
`/contact` has a form (topic, exam, question id, name, optional reply email, message up to 1500 characters) that posts to Netlify Forms, with a hidden honeypot field against spam. It shows a thank-you card on success and an error with the direct email on failure. The form is declared for Netlify in `public/__forms.html` and the page posts to `/__forms.html`. The page also lists a direct email address. Links such as `/contact?topic=correction&exam=CSA&q=CSA-14` prefill it, and the quiz and review screens link to it as "Suggest a correction". `/contribute` explains the three ways to help (suggest a correction, contribute a question, report a problem) and what makes a good question. The address comes from `NEXT_PUBLIC_CONTACT_EMAIL` (`lib/site.js`).

## Pages and flow

1. **Home** (`app/page.js`): generic hero (eyebrow, h1, lead, a \"Find your exam\" button that focuses the top-bar search plus a ghost \"How it works\" button, and a line with the exam and question totals), then \"How it works\" and \"How marking works\" cards, then About, then the footer.
2. **Setup** (`/exam?exam=CODE`): centred 680px card with exam code, full name, order toggle, "Start practice exam" and a Home link. Unknown exams disable the start button.
3. **Quiz**: meta row, progress bar, question card (question number, Show answer and Flag buttons, question text, "Select one answer." or "Select all that apply.", options, answer panel once shown, Previous and Next on the left, Submit exam on the right), then the question palette.
4. **Confirm**: modal showing how many questions are answered.
5. **Results**: score card (large green percentage, correct count, time, incorrect, skipped, flagged), question map, filter chips (All, Incorrect, Skipped, Flagged), review cards, then "Retake exam" and "Choose another exam".

## Behaviour that shapes the UI

- Questions load from `/api/exam/[exam]` without answers. Answers are revealed by `/api/grade` after submission, or for a single question by `/api/reveal` when the candidate asks for it.
- A question is correct only when the selected options exactly match the correct set. Unanswered counts as incorrect.
- Single-answer questions use radios, multi-answer questions use checkboxes. Multi-answer wording comes from the data (for example "Choose three").

## Accessibility

- Icons are `aria-hidden`. Icon-only controls have `aria-label` and `title`.
- Option groups use `radiogroup` or `group` roles. The flag button uses `aria-pressed`. The modal uses `role="dialog"` with `aria-modal` and a labelled title. Errors use `role="alert"`.
- Colour is never the only signal: results also use text labels ("Correct", "Incorrect", "Skipped").

## Exams currently offered

CSA, CAD, CIS-DF, CIS-ITSM, CIS-CSM, in that order. Defined in `lib/bank.js` (`EXAMS`, whose key order is the display order on the home page) and named in `components/ExamClient.js` (`EXAM_NAMES`). CIS-DF (Data Foundations, CMDB and CSDM) reads `data/cmdb.json`. Adding an exam means a data file in `data/`, one line in `FILES`, one entry in `EXAMS`, and one name in `EXAM_NAMES`.
