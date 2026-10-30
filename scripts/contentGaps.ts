/**
 * Content work order: which authentic model responses are missing for each challenge.
 *
 * Each difficulty tier offers min(tier size, recorded responses) choices, and every choice is a
 * model with a recorded response to that prompt. Medium (6) and Hard (8) are therefore limited by
 * the number of recorded responses: every challenge has at most 6, and two have 5. Recording the
 * missing responses raises those tiers automatically, with no code change.
 *
 *   npm run report:content-gaps            # CSV on stdout, summary on stderr
 *
 * This only lists what is missing. It never creates or invents a response.
 */
import {
  AI_MODELS,
  DIFFICULTY_POOL_SIZE,
  VERIFIED_CHALLENGE_LIBRARY,
  describeTierChoices,
  getAllModelVariantsForChallenge,
} from '../src/aiModelsData';

const q = (s: string) => `"${s.replace(/"/g, '""')}"`;
const coverage = new Map<string, number>();
const rows: string[] = ['challenge_id,category,title,recorded_count,missing_for_medium_6,missing_for_hard_8,models_that_could_be_recorded'];
let needMedium = 0;
let needHard = 0;
for (const c of VERIFIED_CHALLENGE_LIBRARY) {
  const recorded = new Set(getAllModelVariantsForChallenge(c).map((v) => v.modelId));
  recorded.forEach((id) => coverage.set(id, (coverage.get(id) || 0) + 1));
  const mMed = Math.max(0, DIFFICULTY_POOL_SIZE.medium - recorded.size);
  const mHard = Math.max(0, DIFFICULTY_POOL_SIZE.hard - recorded.size);
  needMedium += mMed;
  needHard += mHard;
  const candidates = AI_MODELS.filter((m) => !recorded.has(m.id)).map((m) => `${m.id} (${m.version})`);
  rows.push([c.id, c.category, q(c.title), recorded.size, mMed, mHard, q(candidates.join('; '))].join(','));
}
console.log(rows.join('\n'));
console.error(
  `Challenges: ${VERIFIED_CHALLENGE_LIBRARY.length}\n` +
    `Choices offered today: Easy ${describeTierChoices('easy')}, Medium ${describeTierChoices('medium')}, Hard ${describeTierChoices('hard')}\n` +
    `Responses still needed for every Medium round to have 6 choices: ${needMedium}\n` +
    `Responses still needed for every Hard round to have 8 choices: ${needHard}\n` +
    `Recorded responses per model: ${AI_MODELS.map((m) => `${m.id}=${coverage.get(m.id) || 0}`).join(', ')}`,
);
