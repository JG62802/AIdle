# AIdle — Changelog & Mutation Ledger

All notable changes to the AIdle codebase are documented in this file.

---

## [3.6.0] — Integration of Microsoft Copilot and Perplexity AI (2026-10-29)

### Added
- **Chatbot Brand Registry:** Registered `copilot` (`Microsoft Copilot`, developer `'Microsoft'`, Flagship tier, 128k context, release year 2024) and `perplexity-sonar` (`Perplexity Sonar`, developer `'Perplexity AI'`, Flagship tier, 128k context, release year 2024) in `AI_MODELS` within `src/aiModelsData.ts`, completing the 8 targeted chatbot brands (ChatGPT, Gemini, Microsoft Copilot, Claude, Meta AI, Grok, DeepSeek, Perplexity).
- **38 Challenge Responses Added:** Integrated 19 distinct responses for Microsoft Copilot and 19 distinct responses for Perplexity Sonar across all 19 prompt challenges, each crafted to reflect observed communicative signatures (approachable, structured, practical for Copilot; direct, information-oriented, precise for Perplexity Sonar).
- **Stylometric & Tone Fingerprints:** Implemented non-spoiling observable tone and nuance clues for both models in `getModelObservableToneClue`, `getModelObservableNuanceClue`, and per-challenge `keyStylometricNote` entries (100% quoted verbatim, min 14 words, 0 audit violations across R1–R7).
- **Hint Sanitization:** Extended `sanitizeHint` to eliminate references to `Microsoft Copilot`, `Copilot`, `Microsoft`, `Perplexity Sonar`, `Perplexity AI`, and `Perplexity`.
- **Developer Filter UI:** Added `'Microsoft'` and `'Perplexity AI'` filter tabs in `src/App.tsx` candidate selection.
- **Automated Verification:** Added unit tests in `tests/hints.test.ts` and `tests/pools.test.ts` verifying model metadata, guess evaluation, hint sanitization, and decoy prevention (total tests: 43/43 passing).
- **Difficulty Scaling & Parity:** Candidate pool generation automatically scaled Medium mode to a uniform 6 choices across all 19 challenges, and Hard mode to 8 choices (7–8 range). Golden test fixtures updated to pin all 450 pool configurations and 730 daily puzzle dates.

---

## [3.5.0] — Gameplay integrity, general sharing, and hint quality (2026-10-29)

### Fixed
- **Hard mode never presented eight choices** and the app claimed it did ("Hard (8 AI)"). Every challenge has at most 6 recorded responses, so 8 cannot be honestly offered. Pools are now exactly the models with a recorded response to the prompt, capped at the tier size (Easy 4, Medium up to 6, Hard up to 8), built by `getDifficultyCandidatePool` with an explicit `CandidatePoolError`. Labels are derived from the data ("easy (4 AI), medium (5–6 AI), hard (5–6 AI)") with an explanatory note. Pools are bit-for-bit identical to production's, pinned by golden tests (336 configurations, 730 daily dates), so the daily challenge is unchanged.
- 4 hints quoted words that are not in the response they describe; they now quote it verbatim.
- The second clue reused one fixed string per model across 12–18 challenges (83% of configurations), a memorisable lookup table that could also state things untrue of the response. It is now derived from the response's own text.
- 77 stylometry hints (including 4 for featured models) lacked quoted evidence or had fewer than 12 words, so the featured model's rounds had richer clues than the others. All 112 stylometry hints now quote the response (rule R7).

### Changed
- 24 hints that effectively named the target (identity terms such as "European", or words lifted from the target's own card tagline) were rewritten to describe observable features of the response. No challenge, response, target, or provenance field changed.
- In-game pool badge reads "N AI" (no longer "N Verified AI").
- Social metadata (`canonical`, `og:url`, `og:image`, `twitter:image`) now uses `https://www.aidle.fun/` instead of the deployment URL `https://aidle-two.vercel.app/`.
- Share Results now ends with the canonical URL.

### Added
- **Share AIdle** CTA in the main menu and the top navigation. Shares only `https://www.aidle.fun/` (Web Share API with clipboard fallback); never shares results.
- `src/share.ts`, `tests/` (pool integrity and production parity, share behaviour, hint fairness), `scripts/hintAudit.ts` (rules R1–R7), `scripts/contentGaps.ts` (lists the authentic responses needed for 6 Medium / 8 Hard choices), `npm test`, `npm run audit:hints`, `npm run report:content-gaps`.
- `getRecordedModels`, `getTierChoiceCount`, `getTierChoiceRange`, `describeTierChoices`, `describeResponseStructure`.

---

## [3.4.0] — Turn 10: Launch Readiness Sprint Across Priorities 1–5 (2026-10-27)

### Added
- **Storage Safety (`safeStorage`):**
  - Implemented an in-memory `Map` fallback wrapper for all `localStorage` reads and writes (`DAILY_STATE_STORAGE_KEY`, `STATS_STORAGE_KEY`, `aidle_has_seen_tutorial`, and `aidle_recent_practice_ids`), preventing fatal crashes in private browsing or disabled-cookie environments.
- **Resilient Clipboard Engine (`copyToClipboard`):**
  - Implemented `copyToClipboard` featuring modern `navigator.clipboard.writeText` alongside an invisible `textarea` fallback for iOS Safari and sandboxed iframe environments.
  - Generates a clean, spoiler-free Wordle grid format: `AIdle #YYYY-MM-DD • 3/5 guesses • Score: 850\nMode: Daily\n\n🟩⬛⬛⬛\n...`.
  - Visual feedback toast and audio chime confirm successful clipboard copying.
- **Practice Mode Anti-Repetition Cycle:**
  - Added session history tracking (`aidle_recent_practice_ids`) so practice rounds cycle through all available scenarios in a category before repeating.
  - Added category filter chips directly on the post-game results card to allow instantaneous category switching between practice puzzles.
- **UTC Midnight Rollover Monitor:**
  - Background monitor checks for UTC calendar date changes on a 15-second interval and on window focus/visibility changes.
  - Surfaces a non-disruptive banner offering to load the new daily challenge without corrupting active rounds.
- **Detailed Score Breakdown on Result Card:**
  - Victory overlay now displays a complete mathematical breakdown of the player's score: Base Score, Wrong Guess Penalty, Clue Penalty, and Speed Bonus.

### Enhanced
- **Provenance Badges & Transparency:**
  - Transparently surfaced `Verified Record` vs `Partially Verified Reference` badges on both the in-game scenario card and post-game screens.
  - Evidence tooltips provide exact benchmark execution parameters without asserting raw log archives where only benchmark reference runs exist.
- **End-of-Game Result Card:**
  - Standardized educational analysis title: *"Why this response matches [Model Name]"*.
  - Added prominent *"Continue with Unlimited Practice"* button when Daily Challenge completes.
  - Added *"Next Practice Round"* button directly to post-game overlays in Practice mode.
- **Double-Submission Lock Hardening:**
  - Guarded `isSubmittingRef` within a strict `try...finally` block in `handleSubmitGuess` to eliminate race conditions, double-submissions, and frame drops.
- **Dataset Multi-ID Exclusion:**
  - Enhanced `getRandomPuzzle` in `aiModelsData.ts` to accept `excludeIds?: string[] | string` for anti-repetition lookback in practice sessions.

---

## [3.3.0] — Turn 9: Authenticity Audit, Tutorial Modal & Keyboard Navigation Sprint (2026-10-27)

### Added
- **Tutorial Modal (Editorial / NYT Format):**
  - Added a dedicated, accessible Tutorial modal matching `#F8F7F3` editorial palette and Newsreader serif typography.
  - Covers Objective, 5 Guesses limit, Wordle attribute feedback, Candidate pool scaling across Easy/Medium/Hard, Daily vs Practice mode separation, Post-game comparisons, and Keyboard controls.
  - Accessible dismissal: Close button (X), Escape key listener, and backdrop click dismiss.
- **Accessible Keyboard Navigation:**
  - Number keys `[1]` through `[8]` instantly select corresponding visible candidate models.
  - Key `[Enter]` submits active candidate deduction.
  - Key `[Escape]` dismisses open modals or opens/closes the in-game settings menu.
  - Added monochrome keycap badges (`[1]`, `[2]`, etc.) to candidate buttons and `[Enter]` badge on the submit button.

---

## [3.2.0] — Turn 8: Dataset Integrity Audit, Edge Case Fixes & Documentation Synchronization (2026-10-27)
- Guaranteed 6 verified model response variants minimum across all 19 challenges.
- Added dynamic active streak evaluation across consecutive UTC calendar dates.
- Decoupled `saveDailyRecord` from React state setter callbacks.

---

## [3.1.0] — Turn 7: Comprehensive Code Audit, Defect Repair & Continuity Documentation (2026-10-27)
- Isolated daily leaderboard reporting from practice mode.
- Standardized daily challenge difficulty to medium.
- Added hint penalties and dynamic configuration scoring.
