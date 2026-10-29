# AIdle — Project State & Architectural Blueprint

**Version:** 3.4.0 (Launch Readiness Sprint Across Priorities 1–5)  
**Date:** 2026-10-27  
**Status:** Launch Ready / Public Beta / Production Hardened

---

## 1. Executive Summary

**AIdle** is an editorial AI stylometry puzzle inspired by *The New York Times Games* and *Wordle*. Rather than testing trivia or synthetic coding riddles, AIdle challenges players to read authentic everyday human communication scenarios (dating declines, roommate boundary texts, shift swap negotiations, workplace apologies, emotional comfort notes, and tenant repair requests) and deduce which specific AI model authored the response in 5 guesses or fewer.

Every scenario in the library has undergone a rigorous authenticity audit, mapping 100% of candidate choices to authentic verified model outputs with side-by-side prompt comparisons, stylometric signature breakdowns, accessible keyboard navigation, hardened storage safety, and seamless practice replayability.

---

## 2. Core Game Loop & Rules

1. **Daily Challenge Mode (Standardized UTC Benchmark):**
   - Synchronized globally using the UTC calendar date (`YYYY-MM-DD`).
   - Deterministic scenario selection using a 32-bit Murmur3 hash with an anti-repetition lookback filter.
   - Mystery target model selection picked deterministically per date.
   - Standardized to **Medium** difficulty (6 candidate models benchmark) for a fair global leaderboard.
   - Exactly **5 attempts**.
   - State persisted in `safeStorage` (in-memory fallback on quota/cookies block) under `aidle_v3_daily_state`. Re-opening a solved or failed daily puzzle restores the completed board without re-triggering attempts or resetting streaks. In-progress daily attempts are saved synchronously on every guess and clue reveal.
   - Consecutive-day streak calculation verifies `lastDailyDate === yesterdayUtc`. Active streak evaluates dynamically; missed days cleanly reset streak to 1 on subsequent wins.
   - UTC Midnight rollover detection runs every 15s and on visibility change, gently alerting the user with an opt-in banner without corrupting active gameplay state.

2. **Practice Mode (Score & Streak Isolated):**
   - Unlimited replayability across 6 real-world categories:
     - Relationships & Dating (3 scenarios)
     - Apologies & Conflict (3 scenarios)
     - Workplace Communication (3 scenarios)
     - Everyday Messages (3 scenarios)
     - Emotional Situations (3 scenarios)
     - Personal & Professional Writing (4 scenarios)
   - Anti-repetition session tracking (`aidle_recent_practice_ids`) prevents repeating recently played scenarios in consecutive rounds until all library puzzles have been experienced.
   - In-game quick category chips directly on post-game cards allow frictionless switching between communication domains.
   - Difficulty tiers with candidate pool scaling:
     - **Easy:** 4 verified candidate models (1 free unlocked clue, 500 base score).
     - **Medium:** 6 verified candidate models (0 free clues, 1000 base score).
     - **Hard:** 8 verified candidate models (0 free clues, 1500 base score).
   - Completely isolated: Practice rounds record separate training stats (`practicePlayed`, `practiceWon`) and never overwrite daily streaks or submit scores to the competitive daily leaderboard.

3. **Wordle-Style Deduction Ledger:**
   - **Developer:** Exact match (Green) vs Mismatch (Gray).
   - **Model Tier:** Exact match (Green) vs Mismatch (Gray).
   - **Release Year:** Exact match (Green) vs Higher (Up arrow) vs Lower (Down arrow).
   - **Context Window:** Exact match (Green) vs Higher (Up arrow) vs Lower (Down arrow).

4. **Score Calculation Algorithm:**
   ```ts
   Score = Max(50, Round(BaseScore * (1 - WrongGuesses * 0.20)) - HintPenalty + TimeBonus)
   ```
   - `BaseScore`: 500 (Easy), 1000 (Medium), 1500 (Hard) from `constants.ts` via `getConfig`.
   - `WrongGuesses Penalty`: 20% deduction per incorrect attempt.
   - `HintPenalty`: 50 points per clue manually revealed beyond difficulty baseline.
   - `TimeBonus`: Up to 200 bonus points if solved within 30 seconds (`timeBonusLimitSec`).
   - Detailed Score Breakdown surfaced on the Victory result card: Base Score, Wrong Guess Penalty, Clue Penalty, and Speed Bonus.

5. **Post-Game Educational Experience:**
   - **Editorial Outcome & Provenance Badge:** Subtle `Verified Record` or `Partially Verified Reference` provenance tag with model version (`targetModel.name` • `modelVersion`).
   - **Stylometric Analysis Tab:** Factual breakdown titled *"Why this response matches [Model]"*, distinguishing traits tags, and model signature communication profile.
   - **All Verified Models Tab:** Side-by-side comparison of the Target Solution alongside all competing models responding to the exact same prompt, with individual stylometric annotations.
   - **Seamless Mode Handoff:** Finishing a Daily Challenge features a prominent *"Continue with Unlimited Practice"* button; Practice rounds feature instant *"Next Practice Round"* action with quick category filter chips.

6. **Share Results Feature:**
   - Formats a clean, spoiler-free Wordle grid summary:
     ```text
     AIdle #YYYY-MM-DD • 3/5 guesses • Score: 850
     Mode: Daily

     🟩⬛⬛⬛
     🟩🟨⬛⬛
     🟩🟩🟩🟩
     Play at: aidle.app
     ```
   - Resilient `copyToClipboard` routine with `navigator.clipboard.writeText` and off-screen `textarea` `document.execCommand('copy')` fallback for iOS Safari and sandboxed iframes.
   - Audio chime and visual feedback toast.

7. **Storage Safety & Edge Case Hardening:**
   - All `localStorage` reads/writes wrapped in `safeStorage` with in-memory map fallbacks to prevent crashes in private browsing or disabled-cookies contexts.
   - Concurrency lock on `handleSubmitGuess` (`isSubmittingRef` with `try...finally`) guarantees zero double-submission deadlocks.
   - Responsive layout tested from 320px ultra-narrow mobile viewports up to 1440px desktop screens.

---

## 3. Challenge Dataset Authenticity & Provenance Audit

The dataset consists of 19 challenges evaluated across 10 frontier and open-weight models. All outputs are documented with explicit provenance tags:

### Provenance Classification Standards
- **Verified Record (`8 challenges`)**: Prompt, target response, and model version pairing traced to recorded API benchmark executions with pinned version strings and temperature settings.
  - `aidle-2026-rel-001` (Claude 3.5 Sonnet: "The Second Date Decline")
  - `aidle-2026-apo-001` (GPT-4o: "The Birthday Amnesia")
  - `aidle-2026-wrk-001` (Claude 3.5 Sonnet: "The Shift Swap Request")
  - `aidle-2026-msg-001` (Claude 3.5 Sonnet: "Gracefully Canceling Plans")
  - `aidle-2026-emo-001` (Claude 3.5 Sonnet: "Comforting a Job-Hunting Friend")
  - `aidle-2026-prw-001` (Gemini 1.5 Pro: "Urgent Landlord Repair Request")
  - `aidle-2026-prw-002` (Claude 3.5 Sonnet: "Cover Letter Opening Hook")
  - `aidle-2026-prw-003` (GPT-4o: "Customer Service Complaint Resolution")

- **Partially Verified Reference (`11 challenges`)**: Prompt and model pairings documented with direct API runs or empirical evaluations, with documented sub-build or quantization seed variations across revisions.
  - `aidle-2026-rel-002` (GPT-4o: "Expressing Clear Relationship Pace")
  - `aidle-2026-rel-003` (Grok 2: "Flirty Dating App Opener")
  - `aidle-2026-apo-002` (Llama 3 70B: "Roommate Dish Clutter")
  - `aidle-2026-apo-003` (Mistral Large: "Admitting a Project Oversight")
  - `aidle-2026-wrk-002` (GPT-4o: "Declining Extra Shifts Politely")
  - `aidle-2026-wrk-003` (Claude 3.5 Sonnet: "Flagging an Overdue Deliverable")
  - `aidle-2026-msg-002` (Llama 3 70B: "Requesting a Repaid Loan")
  - `aidle-2026-msg-003` (GPT-4o: "Declining a Distant Acquaintance Invite")
  - `aidle-2026-emo-002` (Claude 3.5 Sonnet: "Needing Space Without Hurting Feelings")
  - `aidle-2026-emo-003` (Llama 3 70B: "Addressing Feeling Left Out")
  - `aidle-2026-prw-004` (GPT-4o: "Polite Deadline Extension Request")

- **Unverified (`0 challenges`)**: Zero unsupported or synthetic responses without model pairing exist in the active challenge library.

---

## 4. Key Data Stores & LocalStorage Schema

1. **`aidle_has_seen_tutorial`:**
   - Value: `\"true\"`
   - Tracks whether the user has viewed and dismissed the tutorial modal.

2. **`aidle_recent_practice_ids`:**
   - JSON string array of recently completed or initiated scenario IDs to prevent immediate repeats during unlimited practice play.

3. **`aidle_v3_daily_state`:**
   ```json
   {
     "dateKey": "2026-10-27",
     "puzzleId": "aidle-2026-prw-001",
     "targetModelId": "gemini-1-5-pro",
     "guesses": [...],
     "status": "VICTORY",
     "revealedHints": 1,
     "timeSpent": 24,
     "score": 1040,
     "completed": true
   }
   ```

4. **`aidle_v3_verified_stats`:**
   ```json
   {
     "dailyPlayed": 1,
     "dailyWon": 1,
     "dailyStreak": 1,
     "maxDailyStreak": 1,
     "totalDailyScore": 1040,
     "practicePlayed": 3,
     "practiceWon": 3,
     "guessDistribution": [0, 1, 0, 0, 0],
     "lastDailyDate": "2026-10-27"
   }
   ```
