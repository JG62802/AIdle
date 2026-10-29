# AIdle — Changelog & Mutation Ledger

All notable changes to the AIdle codebase are documented in this file.

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
