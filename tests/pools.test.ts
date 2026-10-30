import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {
  AI_MODELS,
  CandidatePoolError,
  DIFFICULTY_POOL_SIZE,
  VERIFIED_CHALLENGE_LIBRARY,
  createChallengeInstanceWithVariant,
  describeTierChoices,
  evaluateGuess,
  getAllModelVariantsForChallenge,
  getDailyPuzzle,
  getDifficultyCandidatePool,
  getRandomPuzzle,
  getRecordedModels,
  getTierChoiceCount,
  getTierChoiceRange,
  type DifficultyTier,
} from '../src/aiModelsData';

const TIERS: DifficultyTier[] = ['easy', 'medium', 'hard'];
const roster = new Set(AI_MODELS.map((m) => m.id));
const json = (f: string) => JSON.parse(readFileSync(new URL(`./golden/${f}`, import.meta.url), 'utf8'));

/** Every playable round: each challenge with each of its recorded models as the target. */
function* allRounds() {
  for (const c of VERIFIED_CHALLENGE_LIBRARY) {
    const variants = getAllModelVariantsForChallenge(c);
    for (const v of variants) {
      yield {challenge: c, variant: v, puzzle: createChallengeInstanceWithVariant(c, v, variants, '2026-01-01')};
    }
  }
}

/** TEST FIXTURE ONLY (never shipped): a puzzle with `n` recorded models, padding with placeholder responses. */
function fixturePuzzle(n: number) {
  const base = VERIFIED_CHALLENGE_LIBRARY[0];
  const have = new Set(getAllModelVariantsForChallenge(base).map((v) => v.modelId));
  let comparison = [...base.comparisonResponses];
  if (n < have.size) comparison = comparison.slice(0, Math.max(0, n - 1));
  const extra = AI_MODELS.filter((m) => !have.has(m.id));
  for (let i = 0; comparison.length + 1 < n; i++) {
    const m = extra[i];
    comparison.push({modelId: m.id, model: m.name, version: m.version, response: `fixture response ${m.id}`, keyStylometricNote: 'fixture'});
  }
  return {...base, comparisonResponses: comparison};
}

test('tier sizes are 4 / 6 / 8', () => {
  assert.deepEqual(DIFFICULTY_POOL_SIZE, {easy: 4, medium: 6, hard: 8});
});

for (const tier of TIERS) {
  test(`${tier}: pool = min(${DIFFICULTY_POOL_SIZE[tier]}, recorded responses); unique; target once; every choice has a recorded response`, () => {
    let rounds = 0;
    for (const {challenge, puzzle} of allRounds()) {
      rounds++;
      const pool = getDifficultyCandidatePool(puzzle, tier);
      const ids = pool.map((m) => m.id);
      const recorded = new Set(getAllModelVariantsForChallenge(challenge).map((v) => v.modelId));
      const where = `${challenge.id} target=${puzzle.targetModelId}`;
      assert.equal(pool.length, Math.min(DIFFICULTY_POOL_SIZE[tier], recorded.size), `size ${where}`);
      assert.equal(new Set(ids).size, ids.length, `duplicate ids ${where}`);
      assert.equal(ids.filter((id) => id === puzzle.targetModelId).length, 1, `target not exactly once ${where}`);
      for (const id of ids) {
        assert.ok(roster.has(id), `unknown model '${id}' ${where}`);
        assert.ok(recorded.has(id), `'${id}' has NO recorded response to this prompt but is offered ${where}`);
      }
      for (const m of pool) assert.equal(m, AI_MODELS.find((x) => x.id === m.id));
    }
    assert.ok(rounds >= VERIFIED_CHALLENGE_LIBRARY.length);
  });
}

test('Easy is always exactly 4; Medium and Hard offer every recorded model when it fits', () => {
  for (const {challenge, puzzle} of allRounds()) {
    assert.equal(getDifficultyCandidatePool(puzzle, 'easy').length, 4, challenge.id);
    const recorded = getRecordedModels(puzzle).map((m) => m.id).sort();
    for (const tier of ['medium', 'hard'] as const) {
      if (recorded.length <= DIFFICULTY_POOL_SIZE[tier]) {
        assert.deepEqual(getDifficultyCandidatePool(puzzle, tier).map((m) => m.id).sort(), recorded, `${challenge.id} ${tier}`);
      }
    }
  }
});

test('REGRESSION: no pool ever offers a model without a recorded response to the prompt (no decoys)', () => {
  const neverRecorded = AI_MODELS.filter((m) => !VERIFIED_CHALLENGE_LIBRARY.some((c) => getAllModelVariantsForChallenge(c).some((v) => v.modelId === m.id)));
  for (const {puzzle} of allRounds()) {
    const recorded = new Set(getRecordedModels(puzzle).map((m) => m.id));
    for (const tier of TIERS) {
      for (const m of getDifficultyCandidatePool(puzzle, tier)) {
        assert.ok(recorded.has(m.id), `${puzzle.id} ${tier} offers unrecorded '${m.id}'`);
        assert.ok(!neverRecorded.some((n) => n.id === m.id), `${m.id} can never be the answer anywhere`);
      }
    }
  }
});

test('pools are deterministic', () => {
  for (const {puzzle} of allRounds()) {
    for (const tier of TIERS) {
      assert.deepEqual(getDifficultyCandidatePool(puzzle, tier).map((m) => m.id), getDifficultyCandidatePool(puzzle, tier).map((m) => m.id));
    }
  }
});

test('GOLDEN: every pool is identical to production (Easy, Medium and Hard, 456 configurations)', () => {
  const golden: Record<string, string[]> = json('production-pools.json');
  let n = 0;
  for (const {challenge, variant, puzzle} of allRounds()) {
    for (const tier of TIERS) {
      const key = `${challenge.id}|${variant.modelId}|${tier}`;
      assert.deepEqual(getDifficultyCandidatePool(puzzle, tier).map((m) => m.id), golden[key], key);
      n++;
    }
  }
  assert.equal(n, Object.keys(golden).length);
});

test('GOLDEN: daily puzzle id, target and Medium pool are identical to production on 730 dates', () => {
  const golden: Record<string, string> = json('production-daily.json');
  const dates = Object.keys(golden);
  assert.equal(dates.length, 730);
  for (const date of dates) {
    const p = getDailyPuzzle(date);
    assert.equal(`${p.id}|${p.targetModelId}|${getDifficultyCandidatePool(p, 'medium').map((m) => m.id).join(',')}`, golden[date], date);
  }
});

test('labels are derived from the data and match the pools actually served', () => {
  for (const tier of TIERS) {
    const counts = [...allRounds()].map(({puzzle}) => getDifficultyCandidatePool(puzzle, tier).length);
    const {min, max} = getTierChoiceRange(tier);
    assert.equal(min, Math.min(...counts), `${tier} min`);
    assert.equal(max, Math.max(...counts), `${tier} max`);
    assert.equal(describeTierChoices(tier), min === max ? String(max) : `${min}\u2013${max}`);
  }
  assert.equal(describeTierChoices('easy'), '4');
  for (const {puzzle} of allRounds()) assert.equal(getTierChoiceCount(puzzle, 'hard'), getDifficultyCandidatePool(puzzle, 'hard').length);
});

test('when a prompt has 9 recorded models the tiers reach exactly 4 / 6 / 8', () => {
  const puzzle = fixturePuzzle(9);
  assert.equal(getRecordedModels(puzzle).length, 9);
  for (const tier of TIERS) {
    const pool = getDifficultyCandidatePool(puzzle, tier);
    const ids = pool.map((m) => m.id);
    assert.equal(pool.length, DIFFICULTY_POOL_SIZE[tier]);
    assert.equal(new Set(ids).size, ids.length);
    assert.equal(ids.filter((id) => id === puzzle.targetModelId).length, 1);
    const recorded = new Set(getRecordedModels(puzzle).map((m) => m.id));
    for (const id of ids) assert.ok(recorded.has(id));
  }
});

test('with 7 recorded models Hard offers 7, never padded to 8', () => {
  const puzzle = fixturePuzzle(7);
  assert.equal(getDifficultyCandidatePool(puzzle, 'hard').length, 7);
  assert.equal(getDifficultyCandidatePool(puzzle, 'medium').length, 6);
});

test('guess evaluation works for every choice in every tier', () => {
  for (const {puzzle} of allRounds()) {
    for (const tier of TIERS) {
      const pool = getDifficultyCandidatePool(puzzle, tier);
      const correct = pool.filter((m) => evaluateGuess(m.id, puzzle.targetModelId).isCorrect);
      assert.equal(correct.length, 1);
      assert.equal(correct[0].id, puzzle.targetModelId);
      for (const m of pool) {
        const fb = evaluateGuess(m.id, puzzle.targetModelId);
        assert.equal(fb.model.id, m.id);
        assert.ok(['correct', 'incorrect'].includes(fb.developerMatch));
        assert.ok(['correct', 'higher', 'lower'].includes(fb.yearMatch));
      }
    }
  }
});

test('random practice puzzles produce valid pools for every tier', () => {
  for (let i = 0; i < 300; i++) {
    for (const tier of TIERS) {
      const p = getRandomPuzzle(tier);
      assert.equal(getDifficultyCandidatePool(p, tier).length, getTierChoiceCount(p, tier));
    }
  }
});

test('fails explicitly instead of presenting an invalid round', () => {
  const base = VERIFIED_CHALLENGE_LIBRARY[0];
  assert.throws(() => getDifficultyCandidatePool({...base, targetModelId: 'not-a-model'}, 'hard'), CandidatePoolError);
  assert.throws(() => getDifficultyCandidatePool(base, 'impossible' as DifficultyTier), CandidatePoolError);
  assert.throws(
    () => getDifficultyCandidatePool(fixturePuzzle(1), 'easy'),
    (e: Error) => e instanceof CandidatePoolError && /at least two/.test(e.message),
  );
});

test('Microsoft Copilot and Perplexity Sonar are registered in AI_MODELS with authentic schema', () => {
  const copilot = AI_MODELS.find((m) => m.id === 'copilot');
  assert.ok(copilot, 'copilot must be present in AI_MODELS');
  assert.equal(copilot.name, 'Microsoft Copilot');
  assert.equal(copilot.developer, 'Microsoft');
  assert.equal(copilot.tier, 'Flagship');
  assert.equal(copilot.releaseYear, 2024);
  assert.equal(copilot.contextWindow, '128k');
  assert.equal(copilot.contextSizeNum, 128);

  const perplexity = AI_MODELS.find((m) => m.id === 'perplexity-sonar');
  assert.ok(perplexity, 'perplexity-sonar must be present in AI_MODELS');
  assert.equal(perplexity.name, 'Perplexity Sonar');
  assert.equal(perplexity.developer, 'Perplexity AI');
  assert.equal(perplexity.tier, 'Flagship');
  assert.equal(perplexity.releaseYear, 2024);
  assert.equal(perplexity.contextWindow, '128k');
  assert.equal(perplexity.contextSizeNum, 128);
});

test('evaluateGuess correctly compares Microsoft Copilot and Perplexity Sonar', () => {
  const fbCopilot = evaluateGuess('copilot', 'copilot');
  assert.equal(fbCopilot.isCorrect, true);
  assert.equal(fbCopilot.developerMatch, 'correct');
  assert.equal(fbCopilot.tierMatch, 'correct');

  const fbCross = evaluateGuess('copilot', 'perplexity-sonar');
  assert.equal(fbCross.isCorrect, false);
  assert.equal(fbCross.developerMatch, 'incorrect');
  assert.equal(fbCross.tierMatch, 'correct');
  assert.equal(fbCross.yearMatch, 'correct');
  assert.equal(fbCross.contextMatch, 'correct');
});

test('recorded models (copilot, perplexity-sonar) are validly integrated into candidate pools', () => {
  const allChoices = new Set<string>();
  for (const {puzzle} of allRounds()) {
    for (const tier of TIERS) {
      const pool = getDifficultyCandidatePool(puzzle, tier);
      pool.forEach((m) => allChoices.add(m.id));
    }
  }
  assert.ok(allChoices.has('copilot'), 'copilot should be included in candidate pools');
  assert.ok(allChoices.has('perplexity-sonar'), 'perplexity-sonar should be included in candidate pools');
});
