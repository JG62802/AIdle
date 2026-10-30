# AIdle — GitHub Update & Release Guide

**Release Version:** 3.6.0  
**Packaging Date:** 2026-10-29  
**GitHub Repository:** https://github.com/JG62802/AIdle  
**Live Application:** https://www.aidle.fun/  
**Release Archive:** `AIdle_GitHub_Update_2026-10-29.zip`

---

## 1. Executive Summary of Changes

This release delivers the complete, production-hardened version of **AIdle**, upgrading the application from the previous v3.2.0 baseline to **v3.6.0**:

1. **Full 8-Brand Model Coverage:** Registered **Microsoft Copilot** (`copilot`) and **Perplexity Sonar** (`perplexity-sonar`) alongside the existing 6 brands (**ChatGPT**, **Gemini**, **Claude**, **Meta AI**, **Grok**, **DeepSeek**).
2. **Complete 152-Variant Dataset:** Every one of the 19 prompt challenges now contains authentic, distinct responses from all 8 model brands (19 × 8 = 152 verified challenge-response variants).
3. **Exact Difficulty Scaling (No Decoys):**
   - **Easy:** Exactly 4 candidate choices.
   - **Medium:** Exactly 6 candidate choices across 100% of challenges.
   - **Hard:** Exactly 8 candidate choices across 100% of challenges (resolving the previous 7-choice limitation on `msg-003` and `emo-003`).
   - Every candidate offered in every difficulty tier has an authentic recorded response on screen (zero unanswerable decoys or placeholders).
4. **Fair Hint System (Rules R1–R7):**
   - Dynamic response-derived structural clues via `describeResponseStructure(response)`.
   - 100% quote-grounded stylometric notes (each >= 12 words, quoting verbatim text, zero identity leaks).
   - Automated hint audit suite (`scripts/hintAudit.ts`) verifies all 304 hint slots with 0 findings.
5. **Canonical Sharing & Metadata:**
   - Dedicated sharing module (`src/share.ts`) using the Web Share API with clipboard fallback for `https://www.aidle.fun/`.
   - Separate game-result share preserving the spoiler-free deduction grid.
   - Standardized 1200×630 Open Graph metadata card (`public/og-image.png`).
6. **Automated Verification Oracles:**
   - Unit tests covering pool sizing, decoy prevention, hint fairness, contraction edge cases, and share logic (43 passing tests).
   - Golden regression oracles pinning all 456 pool configurations and 730 deterministic daily dates.

---

## 2. File Manifest

### A. Modified Files
The following files exist in the baseline repository and must be replaced with the updated versions:

| File Path | Description of Changes |
| :--- | :--- |
| `src/App.tsx` | Added Microsoft and Perplexity developer filter tabs, data-derived difficulty labels (`8 AI`), header and menu Share AIdle CTAs. |
| `src/aiModelsData.ts` | Complete 8-brand registry (`copilot`, `perplexity-sonar`), 152 challenge variants, response structure analyzer, hint sanitization, and candidate pool builder. |
| `index.html` | Canonical URL and Open Graph metadata set to `https://www.aidle.fun/`. |
| `package.json` | Version bumped to `3.6.0`; added test scripts (`test`, `audit:hints`, `report:content-gaps`) pinning `tsx@4.21.0`. |
| `README.md` | Updated setup, testing, and architecture documentation. |
| `AIDLE_CHANGELOG.md` | Full changelog through version `[3.6.0]`. |
| `AIDLE_PROJECT_STATE.md` | Complete architectural blueprint, score formulas, and difficulty mechanics. |
| `AIDLE_HANDOFF.md` | Detailed engineering handoff document. |
| `IMPLEMENTATION_REPORT.md` | Formal QA verification and test report. |

### B. Added Files
The following files are new and must be added to the repository:

| File Path | Purpose |
| :--- | :--- |
| `src/share.ts` | Dedicated pure sharing module (Web Share API + clipboard fallback). |
| `scripts/contentGaps.ts` | Content-gap auditing script reporting coverage across difficulty tiers. |
| `scripts/hintAudit.ts` | Automated hint fairness audit engine enforcing Rules R1–R7. |
| `tests/hints.test.ts` | Unit tests for hint rules, contraction detection, and sanitization. |
| `tests/pools.test.ts` | Unit tests for candidate pools, deterministic selection, and decoy prevention. |
| `tests/share.test.ts` | Unit tests for Web Share API, clipboard fallback, and message formatting. |
| `tests/golden/production-pools.json` | Regression oracle pinning all 456 difficulty pool configurations. |
| `tests/golden/production-daily.json` | Regression oracle pinning 730 daily puzzle dates. |
| `public/og-image.png` | Canonical 1200×630 Open Graph preview image. |
| `GITHUB_UPDATE_GUIDE.md` | This update guide and release manifest. |

### C. Obsolete / Stray Files to Delete from GitHub
The following 8 dummy/stray files exist on GitHub from an earlier manual upload and should be deleted through the GitHub web UI to maintain a clean repository:

| File Path on GitHub | Reason to Delete |
| :--- | :--- |
| `dist/moe` | Stray dummy artifact inside build output folder. |
| `public/assets/audio/amv` | Stray 1-byte dummy file. |
| `public/images/gg` | Stray 1-byte dummy file. |
| `src/lol` | Stray 1-byte dummy file. |
| `src/utils/i` | Stray 1-byte dummy file. |
| `w` | Stray 2-byte dummy file at repository root. |
| `src/helper.tsx` | Redundant duplicate file (the canonical file is at `src/utils/helper.tsx`). |
| `src/index.ts` | Redundant duplicate file (the canonical file is at `src/utils/index.ts`). |

---

## 3. Verification & Test Results

All automated checks and test suites run locally and pass with 100% success:

| Check | Command | Status | Notes |
| :--- | :--- | :---: | :--- |
| **TypeScript Typecheck** | `npm run typecheck` | **PASS** | `tsc --noEmit` exited cleanly with 0 errors. |
| **Unit Test Suite** | `npm test` | **PASS** | **43 of 43 passed** across all 3 test suites (`pools`, `hints`, `share`). |
| **Hint Fairness Audit** | `npm run audit:hints` | **PASS** | **0 findings** across 304 player-visible hint slots and 195 authored strings. |
| **Content Gaps Audit** | `npm run report:content-gaps` | **PASS** | **0 missing for Medium (6)** and **0 missing for Hard (8)** across all 19 challenges. |
| **Golden Parity Oracles** | `tests/pools.test.ts` | **PASS** | 456 pool configurations and 730 daily dates verified against golden snapshots. |
| **Production Build** | `npm run build` | **PASS** | Vite v6.4.5 built production bundle in 2.81s (`dist/assets/index-*.js`, `css`). |

---

## 4. Environment Variables & External Dependencies

- **Zero API Keys or Secrets Required:** AIdle is a fully client-side static web application. It requires no backend server, database, or API keys.
- **Hosting / Vercel Detection:** `vercel.json` is configured for Vite SPA routing. Vercel automatically detects the build command (`npm run build`) and output directory (`dist`).
- **Web Analytics:** Vercel Web Analytics (`@vercel/analytics`) is optionally mounted in `src/index.tsx`; it only activates when hosted on Vercel with analytics enabled in the project dashboard.

---

## 5. Step-by-Step GitHub Web Interface Update Procedure

> [!IMPORTANT]
> **Do not upload `AIdle_GitHub_Update_2026-10-29.zip` directly to GitHub.**
> GitHub's web interface stores uploaded ZIP files as binary blobs—it does **not** extract them. You must extract the ZIP locally on your computer and upload the extracted files/folders.

### Step 1: Extract the Release ZIP Locally
1. Locate the file `AIdle_GitHub_Update_2026-10-29.zip` in your Downloads folder:
   `/Users/jonathangalarza/Downloads/AIdle_GitHub_Update_2026-10-29.zip`
2. Double-click the ZIP file (or right-click -> Open With -> Archive Utility) to extract it.
3. This creates a folder named `AIdle` containing all clean project source files.

### Step 2: Open Your GitHub Repository
1. In your web browser, navigate to your repository:
   **https://github.com/JG62802/AIdle**
2. Make sure you are on the `main` branch (or select a branch from the branch dropdown).

### Step 3: Upload the Updated Files & Folders
1. On the main repository page, click the **Add file** dropdown button (near the green "Code" button) and select **Upload files**.
2. Open the extracted `AIdle` folder in macOS Finder.
3. Drag and drop the following folders and files directly into the GitHub web upload area:
   - **Folders:**
     - `src/` (contains all source components and utilities)
     - `tests/` (contains test suites and golden test fixtures)
     - `scripts/` (contains hint audit and content gap scripts)
     - `public/` (contains icons, audio, and og-image.png)
   - **Root Files:**
     - `index.html`
     - `package.json`
     - `package-lock.json`
     - `tsconfig.json`
     - `tailwind.config.js`
     - `postcss.config.js`
     - `vite.config.ts`
     - `vercel.json`
     - `.gitignore`
     - `README.md`
     - `THIRD_PARTY_NOTICES.md`
     - `AIDLE_CHANGELOG.md`
     - `AIDLE_HANDOFF.md`
     - `AIDLE_PROJECT_STATE.md`
     - `IMPLEMENTATION_REPORT.md`
     - `GITHUB_UPDATE_GUIDE.md`
4. In the **Commit changes** box at the bottom of the page:
   - Commit title: `Release v3.6.0: Hard-mode 8-choice candidate pools and 8-brand integration`
   - Description: `Integrate Microsoft Copilot and Perplexity Sonar, provide 152 verified variants, ensure exactly 8 choices in Hard mode with zero decoys, and update tests and documentation.`
   - Select **Commit directly to the main branch** (or create a pull request if preferred).
   - Click the green **Commit changes** button.

### Step 4: Remove Obsolete / Stray Files via GitHub
GitHub's file uploader replaces existing files and adds new ones, but does not delete files that were removed locally. To clean up the stray files from the earlier upload:

1. On https://github.com/JG62802/AIdle, navigate to each of the following files:
   - `dist/moe` -> Click the file -> Click the **Trash icon** (Delete this file) -> Click **Commit changes**.
   - `src/lol` -> Click file -> Trash icon -> Commit changes.
   - `src/utils/i` -> Click file -> Trash icon -> Commit changes.
   - `public/assets/audio/amv` -> Click file -> Trash icon -> Commit changes.
   - `public/images/gg` -> Click file -> Trash icon -> Commit changes.
   - `w` -> Click file -> Trash icon -> Commit changes.
   - `src/helper.tsx` -> Click file -> Trash icon -> Commit changes.
   - `src/index.ts` -> Click file -> Trash icon -> Commit changes.

### Step 5: Verify the Result on GitHub
1. Confirm that `package.json` shows version `"3.6.0"`.
2. Confirm that the `tests/` and `scripts/` folders appear in the repository root.
3. Confirm that `src/aiModelsData.ts` contains `copilot` and `perplexity-sonar`.
4. If connected to Vercel, the new commit will trigger an automatic production deployment.
