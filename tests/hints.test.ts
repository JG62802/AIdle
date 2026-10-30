import {test} from 'node:test';
import assert from 'node:assert/strict';
import {
  IDENTITY_TERMS,
  LITERAL_NAMES,
  auditHints,
  collectAllAuthoredHintStrings,
  collectPlayerVisibleHints,
  type HintRecord,
} from '../scripts/hintAudit';
import {
  AI_MODELS,
  VERIFIED_CHALLENGE_LIBRARY,
  describeResponseStructure,
  getAllModelVariantsForChallenge,
  sanitizeHint,
} from '../src/aiModelsData';

test('every player-visible hint passes the fairness audit (R1-R5)', () => {
  const findings = auditHints();
  assert.deepEqual(
    findings.map((f) => `[${f.rule}] ${f.challengeId}/${f.targetModelId}: ${f.detail} :: ${f.text}`),
    [],
  );
});

test('audit covers every challenge and every recorded model as a possible target', () => {
  const recs = collectPlayerVisibleHints();
  const expected = VERIFIED_CHALLENGE_LIBRARY.reduce((n, c) => n + getAllModelVariantsForChallenge(c).length, 0);
  assert.equal(recs.length, expected * 2); // stylometry + structural slot per configuration
  assert.ok(recs.every((r) => r.text.trim().length > 0), 'empty hint slot');
});

test('no authored hint string (including fields the UI does not render) names a model or identity trait', () => {
  const all = collectAllAuthoredHintStrings();
  assert.ok(all.length > 100);
  for (const t of all) {
    const unquoted = t.replace(/"[^"]*"/g, ' ');
    assert.doesNotMatch(unquoted, LITERAL_NAMES, t);
    assert.doesNotMatch(unquoted, IDENTITY_TERMS, t);
  }
});

test('hints never name any roster model or developer', () => {
  const words = AI_MODELS.flatMap((m) => [m.name, m.developer, m.version]).map((w) => w.toLowerCase());
  for (const r of collectPlayerVisibleHints()) {
    for (const w of words) {
      // Whole-word match: the developer "Meta" must not fire on "metaphor".
      const re = new RegExp(`(^|[^a-z0-9])${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-z0-9]|$)`, 'i');
      assert.ok(!re.test(r.text), `${r.challengeId}: '${w}' in '${r.text}'`);
    }
  }
});

// The scanner must actually detect violations, otherwise a clean result proves nothing.
test('the audit detects each kind of violation (non-vacuous)', () => {
  const base = (text: string, targetModelId: string, response = 'x'): HintRecord => ({
    challengeId: 'synthetic', targetModelId, slot: 'stylometryClue', text, response,
  });
  const rules = (recs: HintRecord[]) => auditHints(recs).map((f) => f.rule);
  assert.ok(rules([base('Sounds like Claude with warm phrasing', 'claude-3-5-sonnet')]).includes('R1'));
  assert.ok(rules([base('Polite European directness', 'mistral-large')]).includes('R2'));
  assert.ok(rules([base('Pragmatic and punchy tone', 'mistral-large')]).includes('R3'));
  assert.ok(rules([base('Notes "a phrase that is not in the response"', 'gpt-4o', 'Totally different text.')]).includes('R5'));
  assert.deepEqual(rules([base('Notes "real phrase" in text and then continues for a while so that it clearly has enough words.', 'gpt-4o', 'A real phrase appears here.')]), []);
});

// ---------------------------------------------------------------------------------------------
// Regression tests for the leaks found in the second audit
// ---------------------------------------------------------------------------------------------

test('REGRESSION: no structural clue is a per-model string reused across challenges (fingerprint leak)', () => {
  const recs = collectPlayerVisibleHints().filter((r) => r.slot === 'structuralClue');
  const targetsByText = new Map<string, Set<string>>();
  const challengesByText = new Map<string, Set<string>>();
  for (const r of recs) {
    (targetsByText.get(r.text) ?? targetsByText.set(r.text, new Set()).get(r.text)!).add(r.targetModelId);
    (challengesByText.get(r.text) ?? challengesByText.set(r.text, new Set()).get(r.text)!).add(r.challengeId);
  }
  // Before the fix, 93 of 112 configurations used 9 strings, each mapping to exactly one model.
  const reused = [...challengesByText].filter(([, c]) => c.size >= 2).length;
  const usedByRealCount = recs.filter((r) => (challengesByText.get(r.text)?.size ?? 0) >= 2).length;
  assert.ok(reused <= 5, `${reused} structural strings are reused across challenges`);
  assert.ok(usedByRealCount <= 12, `${usedByRealCount} configurations share a reused structural string`);
  assert.ok(targetsByText.size >= 100, `only ${targetsByText.size} distinct structural clues`);
});

test('R6 detects reuse of a hand-written hint text that always accompanies one model', () => {
  const rec = (challengeId: string): HintRecord => ({
    challengeId, targetModelId: 'mistral-large', slot: 'structuralClue',
    text: 'Observe the razor-sharp brevity of the reply.', response: 'Short reply. Done.',
  });
  assert.ok(auditHints([rec('c1'), rec('c2')]).some((f) => f.rule === 'R6'));
  assert.ok(!auditHints([rec('c1')]).some((f) => f.rule === 'R6'), 'a single use is not reuse');
});

test('R6 does not flag a clue that is a pure function of the visible response', () => {
  const response = 'Thank you for the invitation. I will not be able to join. Take care.';
  const rec = (challengeId: string): HintRecord => ({
    challengeId, targetModelId: 'mistral-large', slot: 'structuralClue',
    text: describeResponseStructure(response), response,
  });
  assert.ok(!auditHints([rec('c1'), rec('c2')]).some((f) => f.rule === 'R6'));
});

test('describeResponseStructure: exact output for known inputs', () => {
  const d = describeResponseStructure;
  assert.equal(
    d('Hi Sarah, hope you are well! Would you be open to swapping shifts? I can cover yours in return. Let me know if that works for you!'),
    'Four sentences, 27 words; opens with a greeting, uses no contractions, has 2 exclamation marks, and ends by inviting a reply.',
  );
  assert.equal(
    d('Thank you for the invitation. Unfortunately, I will not be able to join the trip this weekend. I hope you have a great time, and let\'s catch up another time.'),
    'Three sentences, 30 words; opens with thanks, uses contractions, has no exclamation marks, and ends with a statement.',
  );
  assert.equal(d('Sorry about that. Can you resend it?'), 'Two sentences, 7 words; opens with an apology, uses no contractions, has no exclamation marks, and ends with a question.');
});

test('describeResponseStructure: abbreviations are not sentence ends and possessives are not contractions', () => {
  assert.match(describeResponseStructure('Mr. Henderson, I am reporting a leak. Please advise.'), /^Two sentences, 9 words;/);
  assert.match(describeResponseStructure("Sarah's shift is fine. I cannot attend."), /uses no contractions/);
  assert.match(describeResponseStructure("I can't make it, it's late."), /uses contractions/);
});

test('describeResponseStructure: deterministic, depends only on the response, and its word count is correct for every real response', () => {
  for (const c of VERIFIED_CHALLENGE_LIBRARY) {
    for (const v of getAllModelVariantsForChallenge(c)) {
      const a = describeResponseStructure(v.response);
      assert.equal(a, describeResponseStructure(v.response));
      const words = v.response.trim().split(/\s+/).filter(Boolean).length;
      assert.ok(a.includes(`, ${words} words;`), `${c.id}/${v.modelId}: '${a}' vs ${words} words`);
      assert.doesNotMatch(a, /claude|gpt|gemini|llama|mistral|deepseek|grok|copilot|perplexity|openai|anthropic|google|meta|microsoft/i);
    }
  }
});

test('sanitizeHint strips Copilot, Perplexity, and Microsoft references', () => {
  assert.equal(sanitizeHint('Microsoft Copilot crafts responses with care.'), 'Crafts responses with care.');
  assert.equal(sanitizeHint('Perplexity Sonar answers clearly.'), 'Answers clearly.');
  assert.equal(sanitizeHint('Developed by Microsoft.'), '');
  assert.equal(sanitizeHint('Uses Perplexity AI search logic.'), 'Employs search logic.');
});

test('R7: every stylometry hint quotes the response and has at least 12 words, for featured and other models alike', () => {
  const stylometry = collectPlayerVisibleHints().filter((r) => r.slot === 'stylometryClue');
  assert.equal(stylometry.length, 152);
  for (const r of stylometry) {
    assert.match(r.text, /"[^"]+"/, `${r.challengeId}/${r.targetModelId}: no quoted evidence`);
    assert.ok(r.text.split(/\s+/).length >= 12, `${r.challengeId}/${r.targetModelId}: under 12 words`);
  }
  const primary = new Map(VERIFIED_CHALLENGE_LIBRARY.map((c) => [c.id, c.targetModelId]));
  const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
  const words = (f: (r: HintRecord) => boolean) => mean(stylometry.filter(f).map((r) => r.text.split(/\s+/).length));
  const featured = words((r) => primary.get(r.challengeId) === r.targetModelId);
  const others = words((r) => primary.get(r.challengeId) !== r.targetModelId);
  assert.ok(Math.abs(featured - others) / Math.max(featured, others) < 0.25, `mean words ${featured.toFixed(1)} vs ${others.toFixed(1)}`);
});

test('R7 detects a thin or unquoted stylometry hint (non-vacuous)', () => {
  const rec = (text: string): HintRecord => ({challengeId: 'c', targetModelId: 'mistral-large', slot: 'stylometryClue', text, response: 'A real phrase appears here.'});
  assert.ok(auditHints([rec('Short, clear, and direct.')]).some((f) => f.rule === 'R7'));
  assert.ok(!auditHints([rec('Opens plainly and then says "A real phrase appears" before stopping right there at the end.')]).some((f) => f.rule === 'R7'));
});

test('whole-word name check still catches a real name (and ignores "metaphor")', () => {
  const re = (w: string) => new RegExp(`(^|[^a-z0-9])${w}([^a-z0-9]|$)`, 'i');
  assert.ok(re('meta').test('Sounds like Meta wrote it'));
  assert.ok(!re('meta').test('Uses a battery metaphor'));
});
