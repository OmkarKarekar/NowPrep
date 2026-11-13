# NowPrep

Practice exams for ServiceNow certifications (CAD and CIS-CSM).

## Run locally

    npm install
    npm run build
    npm start        # open http://localhost:3000

## Where things live

- `app/` pages and API routes. `/api/exam/[exam]` serves questions without answers. `/api/grade` marks a submission.
- `lib/bank.js` server-only loading of question banks and shuffling.
- `data/cad.json` and `data/csm.json` are the question banks, including answer keys. Keep this folder server-side.
- `components/ExamClient.js` the exam flow: setup, quiz, submit with confirmation, results, back-to-top arrow.
- `components/Header.js` logo (home link) and theme toggle (dark is default).

## Marking

A question is correct only when the selected options exactly match the correct option(s). Unanswered questions count as incorrect. Score = correct / total questions.

## Before release

- `data/csm.json`: 48 questions have hand-written wrong options. Review them.
- `data/cad.json`: 102 answers come from the source dump and are not yet checked against official documentation.
