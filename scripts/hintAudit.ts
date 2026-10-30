/**
 * Hint fairness audit for AIdle.
 *
 * A hint should help a player narrow down the candidates without naming the answer.
 * Rules (see docs in the engineering report):
 *   R1  No model / developer / product / version names.
 *   R2  No identity terms such as the developer's region ("European"), "open-weight", token counts.
 *   R3  No echo of two or more words from the target's own card tagline.
 *   R4  No word that is printed on exactly one candidate card AND is used, across the whole
 *       hint corpus, almost only when that model is the target (>= 75% exclusivity, >= 2 uses).
 *   R5  Every quoted phrase must occur in the target's recorded response (hint-to-target link).
 *   R6  No "fingerprint" hints: an identical hint text must not appear in two or more challenges
 *       while always accompanying the same target model (a player could memorise the mapping).
 *       Exempt: a clue that equals describeResponseStructure(response). It is a pure function of the
 *       response the player is already looking at, so it cannot disclose anything beyond it.
 *   R7  Every stylometry hint must quote the response and have at least 12 words, for the featured
 *       model and every other model alike, so no model's rounds get conspicuously richer or
 *       thinner clues than another's.
 *
 * A clean scan is NOT proof of fairness; it is a regression guard on top of manual review.
 */
import {
  AI_MODELS,
  VERIFIED_CHALLENGE_LIBRARY,
  createChallengeInstanceWithVariant,
  describeResponseStructure,
  getAllModelVariantsForChallenge,
  getModelObservableNuanceClue,
  getModelObservableToneClue,
  type AIModel,
} from '../src/aiModelsData';

const STOP = new Set(
  'a an and the of to in on with for by or but is are be as at it its this that from into than then them their his her you your not no zero without while each any all only very more most just also own up out via per'.split(
    ' ',
  ),
);
const stem = (w: string) =>
  w.toLowerCase().replace(/[^a-z]/g, '').replace(/(ing|ly|ness|ed|es|s)$/, '');
export const tokens = (t: string) => [
  ...new Set(t.split(/[^A-Za-z']+/).map(stem).filter((w) => w.length > 3 && !STOP.has(w))),
];

export const LITERAL_NAMES =
  /(claude|anthropic|sonnet|haiku|opus|gpt|openai|chatgpt|gemini|google|bard|llama|\bmeta\b|mistral|deepseek|grok|\bxai\b|cohere|turbo|\bflash\b|\b4o\b|3\.5|1\.5|\b70b\b|\bv3\b)/i;
export const IDENTITY_TERMS =
  /(european|france|french|chinese|china|american|silicon|open[- ]?(source|weight)|weights|constitution|harmless|helpful, honest|twitter|\bx\.com\b|real-time|multimodal|long[- ]context|million|\btoken|\b2m\b|\b1m\b|\b128k\b|\b200k\b|trained|parameters)/i;

export interface HintRecord {
  challengeId: string;
  targetModelId: string;
  slot: 'stylometryClue' | 'structuralClue';
  text: string;
  response: string;
}

/** Every hint a player can see: each challenge, with each recorded model as the target. */
export function collectPlayerVisibleHints(): HintRecord[] {
  const out: HintRecord[] = [];
  for (const c of VERIFIED_CHALLENGE_LIBRARY) {
    const variants = getAllModelVariantsForChallenge(c);
    for (const v of variants) {
      const p = createChallengeInstanceWithVariant(c, v, variants, '2026-01-01');
      const h = p.difficultyMetadata.hints;
      out.push({challengeId: c.id, targetModelId: v.modelId, slot: 'stylometryClue', text: h.stylometryClue, response: v.response});
      out.push({challengeId: c.id, targetModelId: v.modelId, slot: 'structuralClue', text: h.structuralClue || h.contextClue || '', response: v.response});
    }
  }
  return out;
}

/** All hint strings in the library, including fields the UI does not currently render. */
export function collectAllAuthoredHintStrings(): string[] {
  const all = new Set<string>();
  for (const m of AI_MODELS) {
    [getModelObservableToneClue, getModelObservableNuanceClue].forEach((f) => all.add(f(m.id)));
  }
  for (const c of VERIFIED_CHALLENGE_LIBRARY) {
    const h = c.difficultyMetadata.hints;
    [h.stylometryClue, h.structuralClue, h.contextClue, h.developerClue].forEach((t) => t && all.add(t));
    c.comparisonResponses.forEach((r) => r.keyStylometricNote && all.add(r.keyStylometricNote));
  }
  return [...all];
}

export interface Finding {
  rule: 'R1' | 'R2' | 'R3' | 'R4' | 'R5' | 'R6' | 'R7';
  challengeId: string;
  targetModelId: string;
  slot: string;
  text: string;
  detail: string;
}

const norm = (s: string) => s.toLowerCase().replace(/[\u2018\u2019]/g, "'").replace(/\s+/g, ' ');

export function auditHints(records = collectPlayerVisibleHints()): Finding[] {
  const findings: Finding[] = [];
  const byId = new Map<string, AIModel>(AI_MODELS.map((m) => [m.id, m]));
  const uniqueTexts = new Map<string, Set<string>>(); // text -> targets
  for (const r of records) {
    if (!uniqueTexts.has(r.text)) uniqueTexts.set(r.text, new Set());
    uniqueTexts.get(r.text)!.add(r.targetModelId);
  }
  // R4 statistics: per tagline token, how exclusively is it used with its owning model as target?
  const owners = new Map<string, Set<string>>();
  for (const m of AI_MODELS) for (const t of tokens(m.tagline)) (owners.get(t) ?? owners.set(t, new Set()).get(t)!).add(m.id);
  const usage = new Map<string, Map<string, number>>();
  for (const [text, targets] of uniqueTexts) {
    for (const t of tokens(text)) {
      const mm = usage.get(t) ?? new Map<string, number>();
      for (const tg of targets) mm.set(tg, (mm.get(tg) || 0) + 1);
      usage.set(t, mm);
    }
  }
  const exclusive = new Set<string>();
  for (const [tok, own] of owners) {
    if (own.size !== 1) continue;
    const mm = usage.get(tok);
    if (!mm) continue;
    const total = [...mm.values()].reduce((a, b) => a + b, 0);
    const ownerUses = mm.get([...own][0]) || 0;
    if (total >= 2 && ownerUses / total >= 0.75) exclusive.add(tok);
  }

  // R6 statistics: for each hint text, the challenges it appears in and the target models it accompanies.
  const textChallenges = new Map<string, Set<string>>();
  const textTargets = new Map<string, Set<string>>();
  for (const r of records) {
    (textChallenges.get(r.text) ?? textChallenges.set(r.text, new Set()).get(r.text)!).add(r.challengeId);
    (textTargets.get(r.text) ?? textTargets.set(r.text, new Set()).get(r.text)!).add(r.targetModelId);
  }

  const seen = new Set<string>();
  for (const r of records) {
    const key = `${r.slot}|${r.targetModelId}|${r.text}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const f = (rule: Finding['rule'], detail: string) =>
      findings.push({rule, challengeId: r.challengeId, targetModelId: r.targetModelId, slot: r.slot, text: r.text, detail});
    const target = byId.get(r.targetModelId)!;
    // Words inside quotation marks come from the response the player is already reading.
    const unquoted = r.text.replace(/"[^"]*"/g, ' ');
    if (LITERAL_NAMES.test(unquoted)) f('R1', 'names a model, developer or product');
    if (IDENTITY_TERMS.test(unquoted)) f('R2', 'contains an identity term');
    const cardWords = new Set(tokens(target.tagline));
    const echoed = tokens(unquoted).filter((t) => cardWords.has(t));
    if (echoed.length >= 2) f('R3', `echoes target tagline words: ${echoed.join(', ')}`);
    const excl = tokens(unquoted).filter((t) => exclusive.has(t) && cardWords.has(t));
    if (excl.length) f('R4', `exclusive identifier(s): ${excl.join(', ')}`);
    if (
      (textChallenges.get(r.text)?.size ?? 0) >= 2 &&
      (textTargets.get(r.text)?.size ?? 0) === 1 &&
      r.text !== describeResponseStructure(r.response)
    ) {
      f('R6', `identical text reused in ${textChallenges.get(r.text)!.size} challenges and always paired with ${r.targetModelId}`);
    }
    if (r.slot === 'stylometryClue') {
      const words = r.text.split(/\s+/).filter(Boolean).length;
      if (!/"[^"]+"/.test(r.text)) f('R7', 'stylometry hint quotes no phrase from the response');
      if (words < 12) f('R7', `stylometry hint has only ${words} words (minimum 12)`);
    }
    // R5: quoted phrases must appear in the target's response (trailing "..." means "starts with")
    for (const q of r.text.match(/"[^"]+"/g) ?? []) {
      const phrase = norm(q.slice(1, -1)).replace(/\.\.\.$/, '').replace(/\s*\.\.\.\s*/g, ' ').trim();
      if (phrase && !norm(r.response).includes(phrase)) f('R5', `quoted phrase not found in the target response: ${q}`);
    }
  }
  return findings;
}

// CLI: `npm run audit:hints`
const isMain = typeof process !== 'undefined' && process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href;
if (isMain) {
  const recs = collectPlayerVisibleHints();
  const f = auditHints(recs);
  const uniq = new Set(recs.map((r) => r.text));
  console.log(`Challenges: ${VERIFIED_CHALLENGE_LIBRARY.length}`);
  console.log(`Challenge/target configurations: ${recs.length / 2}`);
  console.log(`Player-visible hint slots: ${recs.length} (${uniq.size} distinct strings)`);
  console.log(`All authored hint strings incl. unrendered fields: ${collectAllAuthoredHintStrings().length}`);
  console.log(`Findings: ${f.length}`);
  for (const x of f) console.log(` [${x.rule}] ${x.challengeId} / ${x.targetModelId} / ${x.slot}: ${x.detail}\n     ${x.text}`);
  const primary = new Map(VERIFIED_CHALLENGE_LIBRARY.map((c) => [c.id, c.targetModelId]));
  const stat = (slot: string, isPrimary: boolean) => {
    const x = recs.filter((r) => r.slot === slot && (primary.get(r.challengeId) === r.targetModelId) === isPrimary);
    const words = x.map((r) => r.text.split(/\s+/).length);
    const withQuote = x.filter((r) => /"[^"]+"/.test(r.text)).length;
    return `n=${x.length}, mean ${(words.reduce((a, b) => a + b, 0) / Math.max(1, x.length)).toFixed(1)} words, ${Math.round((100 * withQuote) / Math.max(1, x.length))}% quote the response`;
  };
  console.log('Specificity (informational, not a pass/fail rule):');
  for (const slot of ['stylometryClue', 'structuralClue']) {
    console.log(`  ${slot}: featured model ${stat(slot, true)} | other models ${stat(slot, false)}`);
  }
  process.exitCode = f.length ? 1 : 0;
}
