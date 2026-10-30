# AIdle

Daily game: read an AI-written response and guess which model wrote it in 5 attempts.

## Run locally
    npm install
    npm run dev          # http://localhost:5173
    npm run typecheck
    npm run build && npm run preview

## Tests
    npm test              # pool integrity, share behaviour, hint fairness (node:test via tsx)
    npm run audit:hints   # prints the hint fairness audit report (exit code 1 on findings)
    npm run report:content-gaps   # CSV of the authentic responses still missing per challenge

## Styling
The UI is styled with Tailwind CSS v3 utility classes in `src/App.tsx` and `src/utils/*`.
Tailwind is wired in via `tailwind.config.js`, `postcss.config.js` and `src/index.css`
(imported from `src/index.tsx`). Fonts (Newsreader, Inter) load from Google Fonts via the
`@import` in App.tsx. Do not define an `xs` breakpoint: one header element is intentionally
`hidden xs:flex` and the original design never showed it.

## Analytics
Vercel Web Analytics (`@vercel/analytics`) is mounted once in `src/index.tsx`.
It only reports when served from Vercel with Web Analytics enabled in the project dashboard.

## Deploy
Vercel auto-detects Vite (`vercel.json` included). No environment variables or secrets are required.

## Known gaps
`public/images/` must contain (referenced as `/images/<name>`): app_logo_mark.png, icon_trophy_gold.png,
icon_ai_chip.png, icon_streak_flame.png. They were not in the upload; the game
falls back to drawn shapes when they are missing.

AIdle is fully standalone: no Google AI Studio / Playground SDK, no backend, no API keys.
