# AIdle — Engineering Handoff Document

**Date:** 2026-10-27  
**Current Milestone:** Turn 10 Launch Readiness Sprint Across Priorities 1–5  
**Author:** 2D Game Code Editor Subagent

---

## 1. Current Stopping Point

The launch readiness sprint for **AIdle** has successfully completed all target priorities:
- **Priority 1: Daily Challenge Quality & Provenance:**
  - UTC date synchronization and non-spoiler presentation verified. Correct answer remains 100% hidden until solve or exhaustion.
  - Subtle editorial provenance badge (`Verified Record` vs `Partially Verified Reference`) is surfaced on both the scenario card and post-game card without asserting raw API archives where only benchmark reference runs exist.
  - 100% of candidate pool options map to authentic verified model responses for the active prompt.
- **Priority 2: End-of-Game Experience & Shareable Results:**
  - Result cards clearly communicate outcome, target model name, and release version (`targetModel.name` • `modelVersion`).
  - Victory card includes a full score calculation breakdown: Base Score, Wrong Guess Penalty, Clue Penalty, and Speed Bonus.
  - Educational section headline: *"Why this response matches [Model]"* followed by stylometric analysis, distinguishing traits, and signature communication profile.
  - Side-by-side alternative model response comparison for the exact same prompt in Tab 2.
  - Share Results feature formatted in clean Wordle emoji style (`AIdle #YYYY-MM-DD • 3/5 guesses • Score: 850`), using `copyToClipboard` with resilient textarea fallback and toast notification.
- **Priority 3: Replayability & Practice Cycle:**
  - Prominent *"Continue with Unlimited Practice"* button when Daily Challenge finishes.
  - Practice mode tracks recently played scenarios in `aidle_recent_practice_ids` via `safeStorage`, avoiding repeats until the library has cycled.
  - *"Next Practice Round"* button with real-world category filter chips directly on the post-game card.
- **Priority 4: Launch Blocker & Edge Case Hardening:**
  - Storage safety: `safeStorage` wraps all `localStorage` calls with an in-memory `Map` fallback, protecting private browsing and cookie-restricted environments.
  - Daily UTC midnight rollover: A 15-second background interval and visibility listener alerts players when a new UTC day rolls over, offering a seamless prompt to load the new case without corrupting active gameplay state.
  - Concurrency lock: `isSubmittingRef` guarded with `try...finally` to prevent race conditions or dropped frames.
  - Mobile responsiveness: Grid, cards, and modal dialogs verified across viewports from 320px to 1440px.
- **Priority 5: Project Continuity:**
  - `AIDLE_PROJECT_STATE.md`, `AIDLE_HANDOFF.md`, and `AIDLE_CHANGELOG.md` updated with verified launch audit results.

---

## 2. Verification Checklist

| Test Item | Specification | Status | Evidence / Notes |
| :--- | :--- | :---: | :--- |
| **Daily Quality & Non-Spoiler** | No model leaks prior to solve | **PASS** | Correct target model is never rendered during active gameplay. |
| **Provenance Badges** | `Verified Record` vs `Partially Verified Reference` | **PASS** | Surfaced on scenario card & post-game card with clean evidence tooltips. |
| **Candidate Pool Mapping** | Candidates map to verified prompt responses | **PASS** | Pool strictly derived from `getAllModelVariantsForChallenge(puzzle)`. |
| **End-of-Game Result Card** | Detailed score breakdown & model version | **PASS** | Base score, guess penalty, clue penalty, and speed bonus rendered cleanly. |
| **Educational Stylometry** | "Why this response matches [Model]" | **PASS** | Stylometric analysis, trait badges, and signature communication profile displayed. |
| **Side-by-Side Comparison** | Compares all verified responses for prompt | **PASS** | Tab 2 renders Target Solution followed by alternative model outputs. |
| **Share Results Format** | Spoiler-free Wordle grid + resilient copy | **PASS** | Copies clean text; uses `copyToClipboard` with textarea fallback; toast shown. |
| **Unlimited Practice Flow** | Prominent practice invite + no repeats | **PASS** | `aidle_recent_practice_ids` tracked; category chips on post-game card. |
| **Storage Safety** | `safeStorage` in-memory fallback | **PASS** | No uncaught `localStorage` exceptions in private browsing or disabled-cookie modes. |
| **UTC Midnight Rollover** | Non-destructive alert on date change | **PASS** | Listener checks `getUTCDateKey()`; displays gentle rollover switch banner. |
| **Double-Submission Lock** | `isSubmittingRef` deadlock-free | **PASS** | Protected by `try...finally` block in `handleSubmitGuess`. |

---

## 3. Key Files & Code Locations

- **`App.tsx`**:
  - `safeStorage` & `copyToClipboard`: Lines 60–120.
  - `getRecentPracticeIds` & `recordRecentPracticeId`: Lines 120–150.
  - UTC midnight rollover monitor: Lines 220–250.
  - Score breakdown calculation & persistence: Lines 300–420.
  - `handleSubmitGuess` concurrency guard: Lines 430–560.
  - `handleShare` Wordle format with toast feedback: Lines 570–615.
  - Scenario card provenance badge: Lines 740–765.
  - Result overlays (Victory & Game Over) with score breakdown, educational review, and practice handoff: Lines 1030–1350.
- **`aiModelsData.ts`**:
  - `getRandomPuzzle` with `excludeIds` array support: Lines 1000–1035.
  - Candidate pool derivation strictly from verified prompt variants: Lines 1040–1085.

---

## 4. Remaining Risks & Concrete Next Milestones

1. **Category Expansion (Post-Launch Milestone):**
   - Introduce new scenarios for Creative Writing and Code Review feedback.
2. **Offline Audio Pre-caching:**
   - Pre-cache the ambient background music track with a ServiceWorker for instant offline playback.
3. **Accessibility Review:**
   - Add high-contrast mode toggle in Settings for increased border and text definition on outdoor displays.
