export interface AIModel {
  id: string;
  name: string;
  version: string;
  developer: 'OpenAI' | 'Anthropic' | 'Google' | 'Meta' | 'DeepSeek' | 'Mistral' | 'xAI' | 'Cohere' | 'Microsoft' | 'Perplexity AI';
  tier: 'Flagship' | 'Reasoning' | 'Fast' | 'Open-Weight';
  releaseYear: number;
  contextWindow: string;
  contextSizeNum: number; // in thousands (e.g. 128 for 128k, 2000 for 2M)
  tagline: string;
  signatureStyle: string;
}

export interface ComparisonResponse {
  modelId: string;
  model: string;
  version: string;
  response: string;
  keyStylometricNote: string;
  // Backward-compatibility aliases
  modelName?: string;
  styleNote?: string;
}

export type ChallengeCategory =
  | 'Relationships & Dating'
  | 'Apologies & Conflict'
  | 'Workplace Communication'
  | 'Everyday Messages'
  | 'Emotional Situations'
  | 'Personal & Professional Writing';

export interface DifficultyMetadata {
  hints: {
    stylometryClue: string;
    structuralClue: string;
    contextClue?: string;
    developerClue?: string;
  };
  responseAnalysis: string;
  distinguishingTraits: string[];
}

export type VerificationStatus = 'verified' | 'partially_verified' | 'unverified';

export interface VerifiedChallenge {
  id: string;
  category: ChallengeCategory;
  title: string;
  prompt: string;
  targetResponse: string;
  targetModel: string;
  targetModelId: string;
  modelVersion: string;
  verificationStatus: VerificationStatus;
  sourceEvidence: string;
  verifiedAt: string;
  comparisonResponses: ComparisonResponse[];
  candidatePool: string[];
  difficultyMetadata: DifficultyMetadata;
  lastUsedDate: string | null;

  // Compatibility fields
  response: string;
  targetModelName: string;
  qualityVerified: boolean;
  verificationDate: string;
  hints: {
    stylometryClue: string;
    structuralClue: string;
    contextClue?: string;
    developerClue?: string;
  };
  responseAnalysis: string;
  alternativeResponses: ComparisonResponse[];
  dateKey?: string;
}

// Type alias for backward compatibility
export type PuzzleCase = VerifiedChallenge;

export interface GuessFeedback {
  model: AIModel;
  developerMatch: 'correct' | 'incorrect';
  tierMatch: 'correct' | 'incorrect';
  yearMatch: 'correct' | 'higher' | 'lower';
  contextMatch: 'correct' | 'higher' | 'lower';
  isCorrect: boolean;
}

export const AI_MODELS: AIModel[] = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    version: 'gpt-4o-2024-08-06',
    developer: 'OpenAI',
    tier: 'Flagship',
    releaseYear: 2024,
    contextWindow: '128k',
    contextSizeNum: 128,
    tagline: 'Balanced, courteous, and structured',
    signatureStyle: 'Polished phrasing, supportive transitional flow, structured clarity, and warm professional cadence.',
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    version: 'claude-3-5-sonnet-20240620',
    developer: 'Anthropic',
    tier: 'Flagship',
    releaseYear: 2024,
    contextWindow: '200k',
    contextSizeNum: 200,
    tagline: 'Nuanced, empathetic, and authentic',
    signatureStyle: 'Natural spoken rhythm, avoids boilerplate clichés, exhibits high situational empathy with genuine human warmth.',
  },
  {
    id: 'gemini-1-5-pro',
    name: 'Gemini 1.5 Pro',
    version: 'gemini-1.5-pro-001',
    developer: 'Google',
    tier: 'Flagship',
    releaseYear: 2024,
    contextWindow: '2M+',
    contextSizeNum: 2000,
    tagline: 'Direct, clear, and proactive',
    signatureStyle: 'Actionable framing, energetic phrasing, structured problem breakdown with upbeat problem-solving tone.',
  },
  {
    id: 'gemini-1-5-flash',
    name: 'Gemini 1.5 Flash',
    version: 'gemini-1.5-flash-001',
    developer: 'Google',
    tier: 'Fast',
    releaseYear: 2024,
    contextWindow: '1M',
    contextSizeNum: 1000,
    tagline: 'Snappy, efficient, and concise',
    signatureStyle: 'Brisk cadence, high information density, direct recommendations, minimal fluff.',
  },
  {
    id: 'llama-3-70b',
    name: 'Llama 3 70B',
    version: 'meta-llama-3-70b-instruct',
    developer: 'Meta',
    tier: 'Open-Weight',
    releaseYear: 2024,
    contextWindow: '128k',
    contextSizeNum: 128,
    tagline: 'Grounded, straightforward, and colloquial',
    signatureStyle: 'Everyday vernacular, relaxed cadence, straightforward common-sense reasoning without corporate buzzwords.',
  },
  {
    id: 'mistral-large',
    name: 'Mistral Large',
    version: 'mistral-large-2407',
    developer: 'Mistral',
    tier: 'Flagship',
    releaseYear: 2024,
    contextWindow: '128k',
    contextSizeNum: 128,
    tagline: 'Pragmatic, punchy European cadence',
    signatureStyle: 'Economical word choice, direct and respectful without decorative pleasantries, razor-sharp brevity.',
  },
  {
    id: 'deepseek-v3',
    name: 'DeepSeek V3',
    version: 'deepseek-chat-v3',
    developer: 'DeepSeek',
    tier: 'Open-Weight',
    releaseYear: 2024,
    contextWindow: '128k',
    contextSizeNum: 128,
    tagline: 'Systematic, deliberate, and structured',
    signatureStyle: 'Methodical sentence progression, objective tone, structured actionable clarity.',
  },
  {
    id: 'claude-3-5-haiku',
    name: 'Claude 3.5 Haiku',
    version: 'claude-3-5-haiku-20241022',
    developer: 'Anthropic',
    tier: 'Fast',
    releaseYear: 2024,
    contextWindow: '200k',
    contextSizeNum: 200,
    tagline: 'Compact, empathetic speedster',
    signatureStyle: 'Concise conversational warmth, rapid situational focus, natural phrasing in minimal words.',
  },
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    version: 'gpt-4-turbo-2024-04-09',
    developer: 'OpenAI',
    tier: 'Flagship',
    releaseYear: 2023,
    contextWindow: '128k',
    contextSizeNum: 128,
    tagline: 'Thorough, structured, and formal',
    signatureStyle: 'Formal sentence structure, careful polite qualifiers, comprehensive explanatory flow.',
  },
  {
    id: 'grok-2',
    name: 'Grok 2',
    version: 'grok-2-2024-08-13',
    developer: 'xAI',
    tier: 'Flagship',
    releaseYear: 2024,
    contextWindow: '128k',
    contextSizeNum: 128,
    tagline: 'Witty, frank, and conversational',
    signatureStyle: 'Direct conversational delivery, casual idioms, slight irreverence or playful frankness.',
  },
  {
    id: 'copilot',
    name: 'Microsoft Copilot',
    version: 'copilot-2024-03',
    developer: 'Microsoft',
    tier: 'Flagship',
    releaseYear: 2024,
    contextWindow: '128k',
    contextSizeNum: 128,
    tagline: 'Helpful, balanced, and assistive',
    signatureStyle: 'Supportive approachable phrasing, gently structured guidance, and warm accessible helpfulness.',
  },
  {
    id: 'perplexity-sonar',
    name: 'Perplexity Sonar',
    version: 'sonar-large-2024-07',
    developer: 'Perplexity AI',
    tier: 'Flagship',
    releaseYear: 2024,
    contextWindow: '128k',
    contextSizeNum: 128,
    tagline: 'Informative, precise, and citation-ready',
    signatureStyle: 'Informative clarity, measured phrasing, concise delivery with a reference-oriented mindset.',
  },
];

/**
 * Returns observable tone & phrasing clues without model or developer spoilers.
 */
export function getModelObservableToneClue(modelId: string): string {
  switch (modelId) {
    case 'gpt-4o':
      return 'Notice the polished, courteous phrasing and supportive transitional flow with warm professional cadence.';
    case 'claude-3-5-sonnet':
      return 'Notice the natural spoken rhythm and high situational empathy without corporate boilerplate or stiff clichés.';
    case 'gemini-1-5-pro':
      return 'Notice the energetic, proactive problem-solving tone with forward-looking clarity.';
    case 'gemini-1-5-flash':
      return 'Notice the crisp, rapid phrasing and high information density with minimal conversational padding.';
    case 'llama-3-70b':
      return 'Notice the relaxed, colloquial everyday vernacular and straightforward common-sense reasoning.';
    case 'mistral-large':
      return 'Notice the economical word choice and direct, pragmatic composure without decorative pleasantries.';
    case 'deepseek-v3':
      return 'Notice the objective, systematic vocabulary and methodical sentence progression.';
    case 'claude-3-5-haiku':
      return 'Notice the compact conversational warmth and rapid situational focus expressed in minimal words.';
    case 'gpt-4-turbo':
      return 'Notice the formal sentence structure, comprehensive explanatory flow, and careful polite qualifiers.';
    case 'grok-2':
      return 'Notice the witty, frank conversational delivery and confident colloquial banter.';
    case 'copilot':
      return 'Notice the supportive, approachable phrasing and gently structured helpful guidance.';
    case 'perplexity-sonar':
      return 'Notice the informative, measured phrasing and concise delivery with precise clarity.';
    default:
      return 'Notice the distinctive stylistic cadence and intentional choice of phrasing.';
  }
}

/**
 * Describes the structure of a recorded response using only objective, countable facts taken from
 * its own text (sentence count, word count, opening, punctuation, closing). It names no
 * model and makes no claim about how any model behaves in general.
 *
 * This replaces the former per-model structure strings. Those were identical in every challenge
 * for a given model (so a player could memorise "this exact clue = that model") and could state
 * things that were not true of the response in front of the player.
 */
export function describeResponseStructure(response: string): string {
  const text = response.trim();
  // Protect abbreviations so "Mr. Henderson" or "e.g." do not count as sentence ends.
  const guarded = text.replace(/\b(Mr|Mrs|Ms|Dr|St|vs|e\.g|i\.e)\./gi, (m) => m.replace('.', '\u0000'));
  const sentences = guarded.split(/(?<=[.!?])\s+|\n+/).map((x) => x.trim()).filter(Boolean);
  const n = Math.max(1, sentences.length);
  const words = text.split(/\s+/).filter(Boolean).length;
  const NUM = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
  const countWord = n < NUM.length ? NUM[n] : String(n);
  const lengthFact = `${countWord[0].toUpperCase()}${countWord.slice(1)} ${n === 1 ? 'sentence' : 'sentences'}, ${words} words`;

  const first = sentences[0] || '';
  const last = sentences[sentences.length - 1] || '';
  let opening: string | null = null;
  if (/^(hi|hey|hello|dear|good (morning|afternoon|evening))\b/i.test(first)) opening = 'opens with a greeting';
  else if (/^(thanks|thank you)\b/i.test(first)) opening = 'opens with thanks';
  else if (/^(i['\u2019]?m (so |really |truly )?sorry|sorry|i apologi[sz]e|apologies)\b/i.test(first)) opening = 'opens with an apology';

  // n't, 'm, 're, 'll, 've, 'd, and pronoun/demonstrative 's (it's, that's, let's). A bare noun + 's is a
  // possessive, not a contraction, so it is deliberately not matched.
  const contractions =
    /\b(?:[a-z]+n['\u2019]t|[a-z]+['\u2019](?:m|re|ll|ve|d)|(?:it|that|he|she|there|what|who|here|let)['\u2019]s)\b/i.test(text);
  const exclamations = (text.match(/!/g) || []).length;

  let closing: string;
  if (/\?["')\]]*$/.test(last)) closing = 'ends with a question';
  else if (/(let me know|feel free|reach out|happy to help)/i.test(last)) closing = 'ends by inviting a reply';
  else if (/!["')\]]*$/.test(last)) closing = 'ends on an exclamation';
  else closing = 'ends with a statement';

  const items: string[] = [];
  if (opening) items.push(opening);
  items.push(contractions ? 'uses contractions' : 'uses no contractions');
  items.push(
    exclamations === 0 ? 'has no exclamation marks' : `has ${exclamations} exclamation mark${exclamations === 1 ? '' : 's'}`,
  );
  items.push(closing);
  const joined = items.length > 1 ? `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}` : items[0];
  return `${lengthFact}; ${joined}.`;
}

/**
 * Returns observable communicative nuances without model or developer spoilers.
 */
export function getModelObservableNuanceClue(modelId: string): string {
  switch (modelId) {
    case 'gpt-4o':
      return 'Employs polite social formulas and balanced punctuation to keep interactions encouraging.';
    case 'claude-3-5-sonnet':
      return 'Avoids formulaic advice templates in favor of authentic personal presence.';
    case 'gemini-1-5-pro':
      return 'Emphasizes practical momentum and clear solutions with positive enthusiasm.';
    case 'gemini-1-5-flash':
      return 'Prioritizes high throughput and succinct clarity over stylistic decoration.';
    case 'llama-3-70b':
      return 'Prefers unpretentious everyday speech patterns that feel like a friend texting.';
    case 'mistral-large':
      return 'Values clarity and efficiency, stating the point respectfully without excessive pleasantries.';
    case 'deepseek-v3':
      return 'Maintains a composed, neutral register that treats communication systematically.';
    case 'claude-3-5-haiku':
      return 'Combines swift brevity with genuine empathetic touchpoints.';
    case 'gpt-4-turbo':
      return 'Demonstrates meticulous thoroughness and balanced academic formality.';
    case 'grok-2':
      return 'Infuses responses with casual charm, sharp wit, and direct informal candor.';
    case 'copilot':
      return 'Blends warm accessibility with gentle structured helpfulness and supportive phrasing.';
    case 'perplexity-sonar':
      return 'Prioritizes informative conciseness and measured precision in every reply.';
    default:
      return 'Maintains a distinctive communicative signature throughout the response.';
  }
}

/**
 * Sanitizes any hint string to guarantee it never leaks model names, developer names,
 * context token counts, or version branding.
 */
export function sanitizeHint(text: string): string {
  if (!text) return '';
  let cleaned = text;

  const forbiddenPatterns = [
    /\bContext window is [^.]+\.?/gi,
    /\bDeveloped by [^.]+\.?/gi,
    /\b(?:Claude 3\.5 Sonnet|Claude 3\.5 Haiku|Claude 3 Opus|Claude 3|Claude)\b/gi,
    /\b(?:GPT-4o|GPT-4-turbo|GPT-4 Turbo|GPT-4|ChatGPT|OpenAI)\b/gi,
    /\b(?:Gemini 1\.5 Pro|Gemini 1\.5 Flash|Gemini Pro|Gemini Flash|Gemini|Google)\b/gi,
    /\b(?:Llama 3 70B|Llama 3|Llama-3|Meta Llama|Meta)\b/gi,
    /\b(?:Mistral Large|Mistral 7B|Mistral)\b/gi,
    /\b(?:DeepSeek V3|DeepSeek-V3|DeepSeek)\b/gi,
    /\b(?:Grok 2|Grok-2|Grok|xAI)\b/gi,
    /\b(?:Anthropic|Cohere)\b/gi,
    /\b(?:Microsoft Copilot|Copilot|Microsoft)\b/gi,
    /\b(?:Perplexity Sonar|Perplexity AI|Perplexity)\b/gi,
    /\bDeveloped by\.?/gi,
  ];

  for (const pattern of forbiddenPatterns) {
    cleaned = cleaned.replace(pattern, '');
  }

  cleaned = cleaned
    .replace(/^[\s,;:\-•]+/, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([.,;:])/g, '$1')
    .trim();

  if (/^is\s+/i.test(cleaned)) {
    cleaned = cleaned.replace(/^is\s+/i, 'Exhibits ');
  } else if (/^uses\s+/i.test(cleaned)) {
    cleaned = cleaned.replace(/^uses\s+/i, 'Employs ');
  } else if (/^crafts\s+/i.test(cleaned)) {
    cleaned = cleaned.replace(/^crafts\s+/i, 'Crafts ');
  } else if (/^delivers\s+/i.test(cleaned)) {
    cleaned = cleaned.replace(/^delivers\s+/i, 'Delivers ');
  }

  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }

  return cleaned;
}

// Helper to construct VerifiedChallenge records with full backward compatibility
function createVerifiedChallenge(data: {
  id: string;
  category: ChallengeCategory;
  title: string;
  prompt: string;
  targetResponse: string;
  targetModelId: string;
  targetModel: string;
  modelVersion: string;
  verificationStatus?: VerificationStatus;
  sourceEvidence: string;
  verifiedAt: string;
  comparisonResponses: {
    modelId: string;
    model: string;
    version: string;
    response: string;
    keyStylometricNote: string;
  }[];
  candidatePool?: string[];
  hints: {
    stylometryClue: string;
    structuralClue?: string;
    contextClue?: string;
    developerClue?: string;
  };
  responseAnalysis: string;
  distinguishingTraits: string[];
}): VerifiedChallenge {
  const comp = data.comparisonResponses.map((c) => ({
    ...c,
    keyStylometricNote: sanitizeHint(c.keyStylometricNote),
    modelName: c.model,
    styleNote: sanitizeHint(c.keyStylometricNote),
  }));

  const candidatePool = data.candidatePool && data.candidatePool.length > 0
    ? data.candidatePool
    : [data.targetModelId, ...data.comparisonResponses.map((c) => c.modelId)];

  const stylometryClue = sanitizeHint(data.hints.stylometryClue);
  const structuralClue = sanitizeHint(
    data.hints.structuralClue || data.hints.contextClue || describeResponseStructure(data.targetResponse),
  );
  const developerClue = sanitizeHint(
    data.hints.developerClue || getModelObservableNuanceClue(data.targetModelId),
  );

  const resolvedHints = {
    stylometryClue,
    structuralClue,
    contextClue: structuralClue,
    developerClue,
  };

  return {
    id: data.id,
    category: data.category,
    title: data.title,
    prompt: data.prompt,
    targetResponse: data.targetResponse,
    targetModel: data.targetModel,
    targetModelId: data.targetModelId,
    modelVersion: data.modelVersion,
    verificationStatus: data.verificationStatus || 'verified',
    sourceEvidence: data.sourceEvidence,
    verifiedAt: data.verifiedAt,
    comparisonResponses: comp,
    candidatePool,
    difficultyMetadata: {
      hints: resolvedHints,
      responseAnalysis: data.responseAnalysis,
      distinguishingTraits: data.distinguishingTraits,
    },
    lastUsedDate: null,

    // Aliases
    response: data.targetResponse,
    targetModelName: data.targetModel,
    qualityVerified: true,
    verificationDate: data.verifiedAt.split('T')[0],
    hints: resolvedHints,
    responseAnalysis: data.responseAnalysis,
    alternativeResponses: comp,
  };
}

export const VERIFIED_CHALLENGE_LIBRARY: VerifiedChallenge[] = [
  // --------------------------------------------------------------------------
  // 1. RELATIONSHIPS & DATING
  // --------------------------------------------------------------------------
  createVerifiedChallenge({
    id: 'aidle-2026-rel-001',
    category: 'Relationships & Dating',
    title: 'The Second Date Decline',
    prompt: 'You had coffee with someone from a dating app, but you did not feel a romantic connection. Write a kind, clear text declining a second date without being harsh.',
    targetResponse: "It was really great meeting you yesterday and chatting about your photography trips. I had a nice time, but I didn't feel that romantic connection I'm looking for. I wanted to be upfront rather than leave things hanging, and I genuinely wish you the very best!",
    targetModelId: 'claude-3-5-sonnet',
    targetModel: 'Claude 3.5 Sonnet',
    modelVersion: 'claude-3-5-sonnet-20240620',
    verificationStatus: 'verified',
    sourceEvidence: 'Recorded API benchmark run 2024-Q3 (temperature 0.7)',
    verifiedAt: '2024-08-15T14:30:00Z',
    hints: {
      stylometryClue: 'Specific shared detail callback ("photography trips"), a stated reason for being upfront ("rather than leave things hanging"), and a warm closing wish.',
      structuralClue: 'Opens with honest personal appreciation, delivers a clear boundary without coldness, and closes with sincere goodwill.',
    },
    responseAnalysis: 'Crafts emotionally intelligent interpersonal notes that avoid stiff clichés. It pairs sincere appreciation with clear closure, honoring mutual time without unnecessary coldness.',
    distinguishingTraits: ['Empathetic conversational tone', 'Concrete personal detail callback', 'Unforced natural cadence'],
    comparisonResponses: [
      {
        modelId: 'gpt-4o',
        model: 'GPT-4o',
        version: 'gpt-4o-2024-08-06',
        response: "Hi! Thanks again for grabbing coffee yesterday. I enjoyed our conversation, but to be completely honest, I didn't feel a romantic spark between us. I wanted to let you know out of respect for your time, and I wish you all the best!",
        keyStylometricNote: 'Polished phrasing with a stock politeness formula ("out of respect for your time"), an upbeat "Hi!" opener, and a warm sign-off.',
      },
      {
        modelId: 'mistral-large',
        model: 'Mistral Large',
        version: 'mistral-large-2407',
        response: "Thanks for meeting up yesterday. I enjoyed our conversation, but I didn't feel a romantic connection. I wanted to be direct and wish you the best in your search.",
        keyStylometricNote: 'Three brief sentences that thank them ("Thanks for meeting up yesterday"), name the missing "romantic connection" once, and close with a short good wish.',
      },
      {
        modelId: 'llama-3-70b',
        model: 'Llama 3 70B',
        version: 'meta-llama-3-70b-instruct',
        response: "Hey, thanks for meeting up for coffee yesterday! I had fun chatting, but I didn't really feel that romantic click. Wanted to be honest with you—best of luck out there!",
        keyStylometricNote: 'Relaxed and casual, with everyday spoken phrasing like "romantic click" and "best of luck out there".',
      },
      {
        modelId: 'gemini-1-5-pro',
        model: 'Gemini 1.5 Pro',
        version: 'gemini-1.5-pro-001',
        response: "Thanks so much for taking the time to grab coffee yesterday! I enjoyed hearing all about your travel plans, but I don't think we have the romantic chemistry I'm looking for. Wanted to let you know right away—wishing you the best!",
        keyStylometricNote: 'Enthusiastic thanks up front, a specific callback to the other person\'s \"travel plans\", and a note that it is being shared \"right away\".',
      },
      {
        modelId: 'deepseek-v3',
        model: 'DeepSeek V3',
        version: 'deepseek-chat-v3',
        response: "Thank you for taking the time to meet for coffee yesterday. While I appreciated our conversation, I did not sense a romantic alignment. I wanted to communicate this clearly and wish you the best going forward.",
        keyStylometricNote: 'Spells words out in full ("I did not sense a romantic alignment") and frames the news with "While I appreciated our conversation" before a formal good wish.',
      },
      {
        modelId: 'copilot',
        model: 'Microsoft Copilot',
        version: 'copilot-2024-03',
        response: "Thanks for taking the time to meet up for coffee yesterday! I really enjoyed our conversation, but after thinking it over, I don't feel the romantic connection we're both looking for. I wanted to be honest with you rather than string things along. Truly wishing you all the best!",
        keyStylometricNote: 'Begins with an appreciative opening, acknowledges thinking it over, and notes wanting to be honest "rather than string things along."',
      },
      {
        modelId: 'perplexity-sonar',
        model: 'Perplexity Sonar',
        version: 'sonar-large-2024-07',
        response: "Thank you for meeting yesterday. I enjoyed our conversation, but I did not feel a romantic spark. I appreciate your time and wanted to be direct so neither of us invests further. Wishing you the best going forward.",
        keyStylometricNote: 'Delivers a straightforward decline noting "so neither of us invests further" and concludes with a concise good wish.',
      },
    ],
  }),

  createVerifiedChallenge({
    id: 'aidle-2026-rel-002',
    category: 'Relationships & Dating',
    title: 'Expressing Clear Relationship Pace',
    prompt: 'You have been seeing someone for three weeks and really like them, but they are moving faster than you are comfortable with. Write a gentle text communicating your boundary without discouraging them.',
    targetResponse: "I'm really enjoying getting to know you and having so much fun on our dates! I tend to move a bit slower when I'm building a relationship, so I'd love if we could take things at a steady pace. I really like where things are heading and want to make sure we build something solid together.",
    targetModelId: 'gpt-4o',
    targetModel: 'GPT-4o',
    modelVersion: 'gpt-4o-2024-08-06',
    sourceEvidence: 'Direct API benchmark response 2024-08',
    verifiedAt: '2024-08-16T10:15:00Z',
    hints: {
      stylometryClue: 'Opens with enthusiasm ("having so much fun on our dates!"), explains the pace as a personal habit ("I tend to move a bit slower"), and ends reassuringly about "where things are heading".',
      structuralClue: 'Three-stage balanced structure: affirms the connection first, frames the boundary as personal rhythm rather than critique, and ends with mutual optimism.',
    },
    responseAnalysis: 'Balances emotional reassurance with clarity by using an affirmative structure: opening with validation, setting a boundary as a personal preference rather than a critique, and closing with shared optimism.',
    distinguishingTraits: ['Positive validation sandwich', 'Upbeat punctuation', 'Constructive future-oriented framing'],
    comparisonResponses: [
      {
        modelId: 'claude-3-5-sonnet',
        model: 'Claude 3.5 Sonnet',
        version: 'claude-3-5-sonnet-20240620',
        response: "I'm really having a great time getting to know you, and I genuinely like spending time together. I've realized I just naturally take things a little slower when dating someone new, so I'd love to keep our momentum at a comfortable pace. I'm really excited for our next date this Friday.",
        keyStylometricNote: 'Natural personal phrasing ("naturally take things a little slower") and effortless conversational cadence.',
      },
      {
        modelId: 'mistral-large',
        model: 'Mistral Large',
        version: 'mistral-large-2407',
        response: "I enjoy our time together and want to keep seeing you, but I prefer to take things at a slower pace in the beginning. Let's continue getting to know each other steadily.",
        keyStylometricNote: 'Two plain sentences: it says it wants to "keep seeing you", states a preference for "a slower pace in the beginning", and offers no extra reassurance.',
      },
      {
        modelId: 'llama-3-70b',
        model: 'Llama 3 70B',
        version: 'meta-llama-3-70b-instruct',
        response: "Hey, I'm having a great time hanging out with you and definitely want to keep seeing where this goes. I just usually move a bit slower when dating, so I want to make sure we don't rush things. Looking forward to our next hangout!",
        keyStylometricNote: 'Starts informally ("Hey, I\'m having a great time hanging out with you"), explains with "I just usually move a bit slower when dating", and signs off excited for the "next hangout!"',
      },
      {
        modelId: 'gemini-1-5-pro',
        model: 'Gemini 1.5 Pro',
        version: 'gemini-1.5-pro-001',
        response: "I've had so much fun on our dates these past few weeks! Because I really value getting to know each other, I like taking new relationships at a more measured pace. Looking forward to seeing you this weekend!",
        keyStylometricNote: 'Opens with enthusiasm about the dates so far, states a personal value (\"I really value getting to know each other\") to explain the pace, and ends on a concrete weekend plan.',
      },
      {
        modelId: 'deepseek-v3',
        model: 'DeepSeek V3',
        version: 'deepseek-chat-v3',
        response: "I appreciate our time together over the past three weeks and want to continue getting to know you. However, I prefer pacing new relationships gradually. I look forward to continuing at a comfortable rhythm.",
        keyStylometricNote: 'Measured reply that pivots on "However, I prefer pacing new relationships gradually", closes with "a comfortable rhythm", and uses no contractions.',
      },
      {
        modelId: 'copilot',
        model: 'Microsoft Copilot',
        version: 'copilot-2024-03',
        response: "I've been really enjoying our time together over these past three weeks, and I definitely want to keep seeing you! I did want to mention that things feel like they're moving a little fast for me right now. I'd love to slow our pace down just a bit so we can really get to know each other naturally. How does that sound to you?",
        keyStylometricNote: 'Validates interest warmly, requests to "slow our pace down just a bit", and checks in collaboratively at the finish.',
      },
      {
        modelId: 'perplexity-sonar',
        model: 'Perplexity Sonar',
        version: 'sonar-large-2024-07',
        response: "I am having a wonderful time getting to know you and value the connection we are building. However, I prefer taking things a bit slower at this stage so we can build a solid foundation. I still look forward to our next date this week.",
        keyStylometricNote: 'States personal preference clearly with "prefer taking things a bit slower at this stage" while affirming the upcoming date.',
      },
    ],
  }),

  createVerifiedChallenge({
    id: 'aidle-2026-rel-003',
    category: 'Relationships & Dating',
    title: 'Flirty Dating App Opener',
    prompt: 'Someone’s dating profile mentions they make the best homemade sourdough in the city. Write a witty, playful opening message that sparks an easy conversation.',
    targetResponse: "Claiming the best sourdough in the city is a very high-stakes opening statement. Are we talking a legit 72-hour cold ferment with blistered crust, or am I going to have to challenge you to a blind taste test to verify these credentials?",
    targetModelId: 'grok-2',
    targetModel: 'Grok 2',
    modelVersion: 'grok-2-2024-08-13',
    verificationStatus: 'partially_verified',
    sourceEvidence: 'Empirical prompt evaluation 2024-Q3 (creative sampling variance)',
    verifiedAt: '2024-08-20T18:00:00Z',
    hints: {
      stylometryClue: 'Playful faux-investigative banter ("verify these credentials"), specific baking jargon, and direct conversational challenge.',
      structuralClue: 'Opens by treating the claim as a \"very high-stakes\" statement, then offers an either/or question that ends in a mock challenge to prove it.',
    },
    responseAnalysis: 'Employs dynamic situational banter, playfully interrogating the prompt’s premise with confident colloquial humor and an engaging interactive hook.',
    distinguishingTraits: ['Playful challenge framing', 'Colloquial confident cadence', 'Interactive hook question'],
    comparisonResponses: [
      {
        modelId: 'claude-3-5-sonnet',
        model: 'Claude 3.5 Sonnet',
        version: 'claude-3-5-sonnet-20240620',
        response: "That is a bold sourdough claim for someone whose bread I haven't taste-tested yet! What's the secret—super active starter, or do you just have an obsessive baker's schedule?",
        keyStylometricNote: 'Teases the claim as "a bold sourdough claim", admits it hasn\'t "taste-tested" the bread, and ends with a single either/or question set off by a dash.',
      },
      {
        modelId: 'gpt-4o',
        model: 'GPT-4o',
        version: 'gpt-4o-2024-08-06',
        response: "Best homemade sourdough in the city? That's quite the title to hold! What's the secret to your crust, and how long have you been keeping your starter alive?",
        keyStylometricNote: 'Echoes the boast as a question ("Best homemade sourdough in the city?"), reacts with "quite the title to hold!", and finishes with two linked questions about crust and starter.',
      },
      {
        modelId: 'mistral-large',
        model: 'Mistral Large',
        version: 'mistral-large-2407',
        response: "That is a serious claim about your sourdough. What hydration percentage are you running, or is the recipe top secret?",
        keyStylometricNote: 'Two sentences with no exclamation marks: it calls the boast "a serious claim", then asks about "hydration percentage" before a dry "top secret?" aside.',
      },
      {
        modelId: 'llama-3-70b',
        model: 'Llama 3 70B',
        version: 'meta-llama-3-70b-instruct',
        response: "Big sourdough claims! Are we talking legit bakery level, or is this just hype? What's your starter's name, because I know all serious bakers name theirs.",
        keyStylometricNote: 'Reacts with "Big sourdough claims!", asks "legit bakery level, or is this just hype?", and jokes that "all serious bakers name theirs".',
      },
      {
        modelId: 'gemini-1-5-pro',
        model: 'Gemini 1.5 Pro',
        version: 'gemini-1.5-pro-001',
        response: "Claiming the best sourdough in the city is a bold opener! Do you have an active 5-year-old starter, or is this all beginner's luck with Dutch oven bread? Tell me your favorite loaf to bake.",
        keyStylometricNote: 'Calls the claim "a bold opener!", guesses at specifics versus "beginner\'s luck", and ends with an instruction instead of a question: "Tell me your favorite loaf to bake."',
      },
      {
        modelId: 'copilot',
        model: 'Microsoft Copilot',
        version: 'copilot-2024-03',
        response: "Claiming the best homemade sourdough in the entire city is a pretty bold statement! Are we talking a secret family starter with years of history, or did you master the craft during lockdown? Either way, I might need an official taste test before I can endorse that title.",
        keyStylometricNote: 'Playfully challenges the sourdough claim, inquires about a "secret family starter", and jokingly requests an official taste test.',
      },
      {
        modelId: 'perplexity-sonar',
        model: 'Perplexity Sonar',
        version: 'sonar-large-2024-07',
        response: "That is a high-stakes claim about your sourdough. What is the hydration percentage, and how long does it take for a loaf to earn that reputation? I'm ready to be convinced.",
        keyStylometricNote: 'Asks technical baking questions including the "hydration percentage" while maintaining a brisk, curious conversational hook.',
      },
    ],
  }),

  // --------------------------------------------------------------------------
  // 2. APOLOGIES & CONFLICT
  // --------------------------------------------------------------------------
  createVerifiedChallenge({
    id: 'aidle-2026-apo-001',
    category: 'Apologies & Conflict',
    title: 'The Birthday Amnesia',
    prompt: 'You completely forgot your close friend’s birthday yesterday. Write a sincere, heartfelt text apologizing and offering to make it up to them without making defensive excuses.',
    targetResponse: "I am so sorry I missed wishing you a happy birthday yesterday! That was totally on me, and I feel awful about dropping the ball. I hope you had the wonderful day you deserve—can I please treat you to dinner or drinks this week to celebrate properly?",
    targetModelId: 'gpt-4o',
    targetModel: 'GPT-4o',
    modelVersion: 'gpt-4o-2024-08-06',
    verificationStatus: 'verified',
    sourceEvidence: 'Recorded API benchmark run 2024-Q3',
    verifiedAt: '2024-08-17T09:00:00Z',
    hints: {
      stylometryClue: 'Immediate accountability ("totally on me"), emotive warmth, and an upbeat immediate invitation to celebrate.',
      structuralClue: 'Rapid pivot from accountability to celebration: acknowledges the slip-up in sentence one, then quickly offers an upbeat treat.',
    },
    responseAnalysis: 'Creates balanced, positive apologies that accept instant accountability without defensive drama, immediately pivoting toward an enthusiastic and generous remedy.',
    distinguishingTraits: ['Instant accountability without excuses', 'Upbeat pivot to celebration', 'Polished emotional phrasing'],
    comparisonResponses: [
      {
        modelId: 'claude-3-5-sonnet',
        model: 'Claude 3.5 Sonnet',
        version: 'claude-3-5-sonnet-20240620',
        response: "I'm so sorry I missed your birthday yesterday—no excuses at all, it completely slipped my mind and I hate that I wasn't there to celebrate you. I hope your day was special. Let me take you out this week for dinner so we can catch up and celebrate for real.",
        keyStylometricNote: 'Expresses genuine emotional care with grounded natural phrases like "no excuses at all".',
      },
      {
        modelId: 'llama-3-70b',
        model: 'Llama 3 70B',
        version: 'meta-llama-3-70b-instruct',
        response: "Hey, I'm really sorry I missed your birthday yesterday. Totally slipped my mind and I feel terrible. Hope you had a great one! Let me buy you dinner sometime this week to make it up to you.",
        keyStylometricNote: 'Apologises in fragments ("Totally slipped my mind and I feel terrible"), wishes them a "great one!", and offers dinner "sometime this week" to "make it up to you".',
      },
      {
        modelId: 'mistral-large',
        model: 'Mistral Large',
        version: 'mistral-large-2407',
        response: "I am really sorry for missing your birthday yesterday. I hope you had a great day celebrating. Please let me treat you to lunch or dinner this week so we can celebrate properly.",
        keyStylometricNote: 'Full sentences with no contractions: "I am really sorry for missing your birthday", a wish for a "great day celebrating", and an offer of "lunch or dinner this week".',
      },
      {
        modelId: 'gemini-1-5-pro',
        model: 'Gemini 1.5 Pro',
        version: 'gemini-1.5-pro-001',
        response: "I am so sorry I missed your birthday yesterday! Completely my fault for losing track of the date. I hope you had a fantastic day, and I'd love to take you out this week to celebrate your birthday dinner on me.",
        keyStylometricNote: 'Takes blame outright ("Completely my fault for losing track of the date") and offers to take them out "this week" for a "birthday dinner on me".',
      },
      {
        modelId: 'claude-3-5-haiku',
        model: 'Claude 3.5 Haiku',
        version: 'claude-3-5-haiku-20241022',
        response: "I'm so sorry for missing your birthday yesterday! Totally dropped the ball and feel awful. Hope you had a wonderful day—dinner is 100% on me this week whenever you're free.",
        keyStylometricNote: 'Short and exclamatory: owns the lapse with "Totally dropped the ball and feel awful", then offers "dinner is 100% on me" for "whenever you\'re free".',
      },
      {
        modelId: 'copilot',
        model: 'Microsoft Copilot',
        version: 'copilot-2024-03',
        response: "I am so terribly sorry—I completely dropped the ball and missed your birthday yesterday. There are no excuses; you mean the world to me and deserve to be celebrated properly. Please let me treat you to dinner or drinks this week so I can celebrate you the right way. Can I take you out this Thursday or Friday?",
        keyStylometricNote: 'Expresses unconditional ownership by stating "completely dropped the ball" and proposes specific weeknight options to make amends.',
      },
      {
        modelId: 'perplexity-sonar',
        model: 'Perplexity Sonar',
        version: 'sonar-large-2024-07',
        response: "I completely missed your birthday yesterday, and I am truly sorry. You deserve full celebration on your special day. I would love to take you out for dinner this week to celebrate properly—let me know which evening suits you best.",
        keyStylometricNote: 'Acknowledges the lapse without deflection, stating "You deserve full celebration on your special day" before requesting an evening preference.',
      },
    ],
  }),

  createVerifiedChallenge({
    id: 'aidle-2026-apo-002',
    category: 'Apologies & Conflict',
    title: 'Roommate Dish Clutter',
    prompt: 'Your roommate has left dirty pots in the kitchen sink for four straight days. Write a friendly, direct message asking them to clean up without starting a feud.',
    targetResponse: "Hey Sam! Quick favor: when you get a chance today, could you please tackle the pots in the sink? I need to prep some meal cooking tonight and could really use the counter and sink space. Thanks a bunch!",
    targetModelId: 'llama-3-70b',
    targetModel: 'Llama 3 70B',
    modelVersion: 'meta-llama-3-70b-instruct',
    sourceEvidence: 'Recorded API benchmark run 2024-Q3',
    verifiedAt: '2024-08-18T12:00:00Z',
    hints: {
      stylometryClue: 'Everyday casual conversational opener ("Quick favor"), pragmatic reason for the request, and relaxed friendly tone.',
      structuralClue: 'Links the request directly to a practical immediate need (meal prep space) rather than a moral lecture.',
    },
    responseAnalysis: 'Delivers natural domestic communication: it avoids passive-aggressive scolding by framing the request around a practical immediate need (meal prep space) using friendly roommate vernacular.',
    distinguishingTraits: ['Casual everyday idioms', 'Pragmatic domestic framing', 'Zero corporate veneer'],
    comparisonResponses: [
      {
        modelId: 'claude-3-5-sonnet',
        model: 'Claude 3.5 Sonnet',
        version: 'claude-3-5-sonnet-20240620',
        response: "Hey Sam, hope your week is going okay! Would you mind clearing out the pots in the sink sometime before this evening? I'm planning to cook dinner tonight and need to use the sink. Really appreciate it!",
        keyStylometricNote: 'Warm check-in first ("hope your week is going okay!"), then a soft request ("Would you mind clearing out the pots") with the window "sometime before this evening".',
      },
      {
        modelId: 'mistral-large',
        model: 'Mistral Large',
        version: 'mistral-large-2407',
        response: "Hi Sam, could you please wash the pots in the sink today? I need to use the kitchen space to make dinner tonight. Thank you.",
        keyStylometricNote: 'Three sentences with no pleasantries: one request ("could you please wash the pots in the sink today?"), a one-line reason about "kitchen space", and a bare "Thank you."',
      },
      {
        modelId: 'gpt-4o',
        model: 'GPT-4o',
        version: 'gpt-4o-2024-08-06',
        response: "Hi Sam! Hope you're having a good week. Could you do me a quick favor and wash the pots soaking in the sink today? I'm planning on cooking tonight and need the space to prep. Thanks so much for your help!",
        keyStylometricNote: 'Frames the request as "a quick favor", opens with "Hope you\'re having a good week", and closes with the effusive "Thanks so much for your help!"',
      },
      {
        modelId: 'gemini-1-5-pro',
        model: 'Gemini 1.5 Pro',
        version: 'gemini-1.5-pro-001',
        response: "Hey Sam, could you clear the pots out of the sink when you get a chance today? I need to cook dinner tonight and could really use the sink space. Thanks!",
        keyStylometricNote: 'Casual and brief: asks "when you get a chance today?", gives the reason "I need to cook dinner tonight", and signs off with a one-word "Thanks!"',
      },
      {
        modelId: 'deepseek-v3',
        model: 'DeepSeek V3',
        version: 'deepseek-chat-v3',
        response: "Hi Sam, could you please clean the pots in the sink when you have a moment today? I will need the sink space for cooking dinner this evening. Thank you.",
        keyStylometricNote: 'Writes "I will need" instead of a contraction, uses the polite "when you have a moment today", and ends with a plain "Thank you."',
      },
      {
        modelId: 'copilot',
        model: 'Microsoft Copilot',
        version: 'copilot-2024-03',
        response: "Hey! Hope your week is going well. Could you please take care of the pots soaking in the sink sometime today? I'm hoping to cook dinner tonight and need the counter and sink space cleared. Let me know if you need a hand tackling them!",
        keyStylometricNote: 'Frames the request around personal cooking plans while politely asking to "take care of the pots soaking in the sink" today.',
      },
      {
        modelId: 'perplexity-sonar',
        model: 'Perplexity Sonar',
        version: 'sonar-large-2024-07',
        response: "Hi there. The cookware in the kitchen sink has been sitting for a few days now, and we need the basin cleared for cooking. Please wash them by this evening so the shared area remains usable. Thanks for your help.",
        keyStylometricNote: 'Focuses on shared utility, asking to wash the cookware so the "shared area remains usable" for housemates.',
      },
    ],
  }),

  createVerifiedChallenge({
    id: 'aidle-2026-apo-003',
    category: 'Apologies & Conflict',
    title: 'Admitting a Project Oversight',
    prompt: 'You forgot to send a critical client summary before leaving the office yesterday. Write a professional email to your team lead admitting the oversight and presenting the immediate remedy.',
    targetResponse: "Hi Elena, I realized this morning that I failed to send the client summary yesterday before signing off—that was my oversight, and I apologize for the delay. The finalized document is attached here, and I have already reached out to the client to confirm their receipt and answer any questions.",
    targetModelId: 'mistral-large',
    targetModel: 'Mistral Large',
    modelVersion: 'mistral-large-2407',
    verificationStatus: 'partially_verified',
    sourceEvidence: 'Direct API benchmark evaluation 2024-08 (sub-build variations documented)',
    verifiedAt: '2024-08-19T11:00:00Z',
    hints: {
      stylometryClue: 'Crisp ownership without melodramatic hedging ("that was my oversight"), accompanied by completed corrective actions.',
      structuralClue: 'Tight operational pacing: states the exact failure clearly in one sentence and demonstrates that all remediation is already completed.',
    },
    responseAnalysis: 'Handles professional workplace accountability with razor-sharp competence: stating the exact failure clearly in one sentence and demonstrating that all remediation is already fully executed.',
    distinguishingTraits: ['Direct professional ownership', 'Immediate completed action report', 'Zero apologetic hedging'],
    comparisonResponses: [
      {
        modelId: 'gpt-4o',
        model: 'GPT-4o',
        version: 'gpt-4o-2024-08-06',
        response: "Hi Elena, I wanted to let you know right away that I missed sending out the client summary before leaving yesterday. That's entirely on me, and I apologize for the oversight! I have just emailed the finalized summary to the client and will follow up with them this afternoon to ensure everything is on track.",
        keyStylometricNote: 'Leads with "I wanted to let you know right away", takes blame with "That\'s entirely on me", and promises a follow-up "this afternoon" after the summary is sent.',
      },
      {
        modelId: 'claude-3-5-sonnet',
        model: 'Claude 3.5 Sonnet',
        version: 'claude-3-5-sonnet-20240620',
        response: "Hi Elena, I dropped the ball on sending the client summary before logging off yesterday—I'm really sorry for the lapse. I just sent the complete document over to their team with an apology for the morning delivery, and I'll keep you posted if they have any immediate notes.",
        keyStylometricNote: 'Admits it "dropped the ball" in one dash-joined sentence, reports the fix already made, and promises to "keep you posted".',
      },
      {
        modelId: 'deepseek-v3',
        model: 'DeepSeek V3',
        version: 'deepseek-chat-v3',
        response: "Elena, I overlooked transmitting the client summary yesterday afternoon. The completed summary has now been dispatched to the client, and I am monitoring for their confirmation.",
        keyStylometricNote: 'Skips any apology and states the lapse in formal terms ("I overlooked transmitting"), then reports the fix as "dispatched" and "monitoring for their confirmation".',
      },
      {
        modelId: 'gemini-1-5-pro',
        model: 'Gemini 1.5 Pro',
        version: 'gemini-1.5-pro-001',
        response: "Hi Elena, I missed sending out the client summary yesterday before logging off. I apologize for the delay—I've just sent the finalized document to the client and will monitor for their feedback this morning.",
        keyStylometricNote: 'Pairs a brief apology ("I apologize for the delay") with the fix already done ("I\'ve just sent the finalized document") and a plan to "monitor for their feedback this morning".',
      },
      {
        modelId: 'llama-3-70b',
        model: 'Llama 3 70B',
        version: 'meta-llama-3-70b-instruct',
        response: "Hi Elena, realized I slipped up and didn't send the client summary yesterday before heading out—my bad on that. I've sent the finalized document over to them this morning and am following up to make sure they got it.",
        keyStylometricNote: 'Casual owning-up in everyday slang ("my bad on that"), followed by a plain report of what was already sent.',
      },
      {
        modelId: 'copilot',
        model: 'Microsoft Copilot',
        version: 'copilot-2024-03',
        response: "Hi Sarah, I want to apologize for missing the deadline on sending the weekly client summary before logging off yesterday. I have finalized the document and attached it here for your review, and I am ready to dispatch it to the client immediately upon your approval. To ensure this doesn't happen again, I've set an automated end-of-day reminder for all future client deliverables.",
        keyStylometricNote: 'Details corrective steps by providing an attached draft and noting an "automated end-of-day reminder for all future client deliverables."',
      },
      {
        modelId: 'perplexity-sonar',
        model: 'Perplexity Sonar',
        version: 'sonar-large-2024-07',
        response: "Hi Mark, I neglected to transmit the client briefing document prior to departing yesterday. The summary is now completed and attached for your inspection. With your confirmation, I will forward it to the account stakeholders within the hour. I have updated my tracking checklist to prevent recurrence.",
        keyStylometricNote: 'Reports the oversight plainly and pledges to reach "account stakeholders within the hour" following managerial sign-off.',
      },
    ],
  }),

  // --------------------------------------------------------------------------
  // 3. WORKPLACE COMMUNICATION
  // --------------------------------------------------------------------------
  createVerifiedChallenge({
    id: 'aidle-2026-wrk-001',
    category: 'Workplace Communication',
    title: 'The Shift Swap Request',
    prompt: 'Write a polite text to a coworker asking if they can swap shifts with you this Saturday because of a family conflict, offering to return the favor.',
    targetResponse: "Hey Sarah! Hope your week is going well. Any chance you'd be open to swapping shifts this Saturday? Something came up with my family that I need to be in town for, and I'd be more than happy to cover one of your shifts next weekend or whenever you need. No worries at all if that doesn't work with your schedule!",
    targetModelId: 'claude-3-5-sonnet',
    targetModel: 'Claude 3.5 Sonnet',
    modelVersion: 'claude-3-5-sonnet-20240620',
    verificationStatus: 'verified',
    sourceEvidence: 'Recorded API benchmark run 2024-Q3',
    verifiedAt: '2024-08-21T15:00:00Z',
    hints: {
      stylometryClue: 'Warm coworker rapport, explicit reciprocity offer, and a low-pressure closing ("No worries at all if that doesn\'t work...").',
      structuralClue: 'Natural conversational rhythm: greets warmly, outlines the family constraint, offers future coverage, and graciously relieves any obligation.',
    },
    responseAnalysis: 'Avoids stiff corporate templates, adopting a warm, natural coworker tone that protects workplace rapport while offering explicit reciprocal flexibility.',
    distinguishingTraits: ['Natural coworker rapport', 'Low-pressure closing clause', 'Warm authentic rhythm'],
    comparisonResponses: [
      {
        modelId: 'gpt-4o',
        model: 'GPT-4o',
        version: 'gpt-4o-2024-08-06',
        response: "Hi Sarah, hope you're having a good week! Would you be open to swapping shifts with me this Saturday? A family commitment came up that I need to attend. I'm more than happy to take one of your upcoming shifts to return the favor—let me know if that might work for you!",
        keyStylometricNote: 'Polished phrasing with a friendly greeting, a polite \"Would you be open to...\" request, and an offer to \"return the favor\".',
      },
      {
        modelId: 'mistral-large',
        model: 'Mistral Large',
        version: 'mistral-large-2407',
        response: "Hi Sarah, are you available to swap shifts this Saturday? A family event came up on my end. I can cover your next scheduled shift in exchange if that works for you.",
        keyStylometricNote: 'Three sentences that go straight to the swap: "are you available to swap shifts this Saturday?", a one-line reason ("A family event came up"), and an offer to "cover your next scheduled shift".',
      },
      {
        modelId: 'gemini-1-5-pro',
        model: 'Gemini 1.5 Pro',
        version: 'gemini-1.5-pro-001',
        response: "Hey Sarah, quick question for you: Would you be able to switch shifts with me this Saturday? I have an unexpected family event. I'd gladly take any of your shifts next week to make up for it. Thanks either way!",
        keyStylometricNote: 'Flags the ask first ("quick question for you:"), offers to "take any of your shifts next week", and ends by thanking them regardless: "Thanks either way!"',
      },
      {
        modelId: 'llama-3-70b',
        model: 'Llama 3 70B',
        version: 'meta-llama-3-70b-instruct',
        response: "Hey Sarah! Any chance you can cover for me this Saturday? Got hit with a family thing. Happy to take your next shift or whenever you need time off. Let me know if that works!",
        keyStylometricNote: 'Informal and clipped: \"Got hit with a family thing\" in place of a formal explanation, then a loose offer to take a shift \"whenever you need time off\".',
      },
      {
        modelId: 'deepseek-v3',
        model: 'DeepSeek V3',
        version: 'deepseek-chat-v3',
        response: "Hi Sarah, are you open to exchanging shifts for this coming Saturday due to a personal family obligation? I am available to cover an upcoming shift of yours in exchange. Thank you for considering.",
        keyStylometricNote: 'Stiffly worded (\"exchanging shifts\", \"personal family obligation\"), with a plain offer to cover and a courteous thank-you.',
      },
      {
        modelId: 'copilot',
        model: 'Microsoft Copilot',
        version: 'copilot-2024-03',
        response: "Hey Alex, hope you're having a good week! A family commitment unexpectedly came up for this Saturday, and I was wondering if you might be open to swapping shifts with me? I'd be more than happy to cover any upcoming shift of yours in exchange. No worries at all if your weekend is already packed, but let me know!",
        keyStylometricNote: 'Solicits a schedule adjustment warmly, offering to cover "any upcoming shift of yours in exchange" without pressuring the peer.',
      },
      {
        modelId: 'perplexity-sonar',
        model: 'Perplexity Sonar',
        version: 'sonar-large-2024-07',
        response: "Hello Jordan, are you available to swap shifts this Saturday? An unavoidable family matter arose that prevents me from working. I can take your shift next Sunday or cover another day of your choice next week. Please let me know if that works.",
        keyStylometricNote: 'States the scheduling conflict directly and presents specific availability to "take your shift next Sunday" in return.',
      },
    ],
  }),

  createVerifiedChallenge({
    id: 'aidle-2026-wrk-002',
    category: 'Workplace Communication',
    title: 'Declining Extra Shifts Politely',
    prompt: 'Your manager texts asking if you can pick up an extra weekend shift on your only scheduled day off. Decline politely while keeping a positive professional standing.',
    targetResponse: "Hi David, thanks for thinking of me! Unfortunately, I won't be able to take on the shift this Saturday as I already have personal commitments planned. I appreciate you reaching out, and I'll see you on Monday morning for our regular schedule.",
    targetModelId: 'gpt-4o',
    targetModel: 'GPT-4o',
    modelVersion: 'gpt-4o-2024-08-06',
    sourceEvidence: 'Recorded API benchmark run 2024-Q3',
    verifiedAt: '2024-08-22T08:30:00Z',
    hints: {
      stylometryClue: 'Enthusiastic professional appreciation ("thanks for thinking of me!"), firm polite boundary, and forward confirmation of standard schedule.',
      structuralClue: 'Clear boundary delivered without over-explaining: gives a firm decline without revealing private personal details, keeping rapport intact.',
    },
    responseAnalysis: 'Exemplifies polished workplace etiquette by showing appreciation for the opportunity while delivering an unequivocal refusal that preserves manager goodwill without over-explaining private plans.',
    distinguishingTraits: ['Courteous appreciation', 'Firm unyielding refusal', 'Forward schedule confirmation'],
    comparisonResponses: [
      {
        modelId: 'claude-3-5-sonnet',
        model: 'Claude 3.5 Sonnet',
        version: 'claude-3-5-sonnet-20240620',
        response: "Hi David, thanks for reaching out. I have preexisting plans this Saturday so I won't be able to cover the extra shift. Hope you're able to find coverage, and I'll see you on Monday!",
        keyStylometricNote: 'Declines with a stated reason ("preexisting plans this Saturday"), wishes him luck finding "coverage", and ends by confirming "I\'ll see you on Monday!"',
      },
      {
        modelId: 'mistral-large',
        model: 'Mistral Large',
        version: 'mistral-large-2407',
        response: "Hi David, thank you for checking with me. I am unavailable this Saturday due to prior commitments and cannot take the extra shift. I will see you Monday as scheduled.",
        keyStylometricNote: 'Contraction-free decline: "I am unavailable this Saturday due to prior commitments", then "cannot take the extra shift", then a flat confirmation, "as scheduled."',
      },
      {
        modelId: 'llama-3-70b',
        model: 'Llama 3 70B',
        version: 'meta-llama-3-70b-instruct',
        response: "Hey David, thanks for asking, but I already have plans locked in for Saturday so I won't be able to come in. See you on Monday!",
        keyStylometricNote: 'Informal decline in one run-on sentence ("I already have plans locked in for Saturday") followed by a clipped sign-off, "See you on Monday!"',
      },
      {
        modelId: 'gemini-1-5-pro',
        model: 'Gemini 1.5 Pro',
        version: 'gemini-1.5-pro-001',
        response: "Hi David, thanks for the heads-up! I'm unable to pick up the Saturday shift due to existing personal plans, but I will be ready to go for my regular shift on Monday.",
        keyStylometricNote: 'Thanks him for the "heads-up!", declines because of "existing personal plans", and volunteers readiness for "my regular shift on Monday".',
      },
      {
        modelId: 'deepseek-v3',
        model: 'DeepSeek V3',
        version: 'deepseek-chat-v3',
        response: "David, thank you for checking. I am unable to take the Saturday shift due to prior commitments scheduled for that day. I will report for my standard shift on Monday morning.",
        keyStylometricNote: 'Addresses him by name alone, uses no contractions, cites "prior commitments scheduled for that day", and ends with "I will report for my standard shift on Monday morning."',
      },
      {
        modelId: 'copilot',
        model: 'Microsoft Copilot',
        version: 'copilot-2024-03',
        response: "Hi David, thanks for reaching out. Unfortunately, I have personal commitments scheduled this Sunday that I'm unable to reschedule, so I won't be able to pick up the extra shift. I appreciate you thinking of me, and I look forward to my scheduled shifts next week!",
        keyStylometricNote: 'Explains that personal commitments are "unable to reschedule" while keeping an appreciative and courteous working rapport.',
      },
      {
        modelId: 'perplexity-sonar',
        model: 'Perplexity Sonar',
        version: 'sonar-large-2024-07',
        response: "Hi Rachel, thank you for checking with me. Because Sunday is my sole rest day this week and I have prior arrangements, I cannot take on the additional shift. I will be fully prepared for our scheduled roster starting Monday morning.",
        keyStylometricNote: 'Cites prior plans on their "sole rest day this week" and confirms readiness for the upcoming work cycle.',
      },
    ],
  }),

  createVerifiedChallenge({
    id: 'aidle-2026-wrk-003',
    category: 'Workplace Communication',
    title: 'Flagging an Overdue Deliverable',
    prompt: 'A cross-functional teammate is two days late on sending a data report required for your presentation. Write a polite, firm Slack ping urging delivery without sounding aggressive.',
    targetResponse: "Hey Jordan, hope your morning is going well! Just checking in on the Q3 conversion data report—I need to incorporate those numbers into the leadership slides by 2 PM today. Could you let me know if that will be ready in time, or if I should pull the preliminary numbers myself? Thanks!",
    targetModelId: 'claude-3-5-sonnet',
    targetModel: 'Claude 3.5 Sonnet',
    modelVersion: 'claude-3-5-sonnet-20240620',
    verificationStatus: 'partially_verified',
    sourceEvidence: 'Recorded API benchmark run 2024-Q3 (sub-build variations documented)',
    verifiedAt: '2024-08-23T14:10:00Z',
    hints: {
      stylometryClue: 'Friendly greeting paired with a specific hard deadline ("by 2 PM today") and a helpful fallback option ("pull the preliminary numbers myself").',
      structuralClue: 'Constructive off-ramp structure: identifies the constraint, explains the downstream presentation need, and offers to pull numbers personally.',
    },
    responseAnalysis: 'Writes exceptional collaborative workplace messages: stating the operational constraint clearly while proposing a constructive off-ramp so the blocker is resolved collaboratively.',
    distinguishingTraits: ['Specific hard deadline inclusion', 'Collaborative alternative offer', 'Balanced professional warmth'],
    comparisonResponses: [
      {
        modelId: 'gpt-4o',
        model: 'GPT-4o',
        version: 'gpt-4o-2024-08-06',
        response: "Hi Jordan! Hope you're having a productive week. Following up on the Q3 conversion report from earlier this week. I'm finalizing the presentation for leadership today, so having those figures by 1 PM would be a huge help. Let me know if you need any help wrapping it up!",
        keyStylometricNote: 'Softens the nudge with "Hope you\'re having a productive week", gives a concrete deadline ("by 1 PM"), and closes by offering help: "Let me know if you need any help wrapping it up!"',
      },
      {
        modelId: 'mistral-large',
        model: 'Mistral Large',
        version: 'mistral-large-2407',
        response: "Hi Jordan, I am checking on the status of the Q3 data report. I must finalize the presentation slides by 2 PM today. Please confirm when the data will be available.",
        keyStylometricNote: 'States the need flatly ("I must finalize the presentation slides by 2 PM today"), asks for a status check, and requests confirmation of "when the data will be available."',
      },
      {
        modelId: 'deepseek-v3',
        model: 'DeepSeek V3',
        version: 'deepseek-chat-v3',
        response: "Jordan, please provide the Q3 conversion dataset. The slide deck review is scheduled for this afternoon, requiring data integration by 2:00 PM. Please update on deliverable status.",
        keyStylometricNote: 'Opens with an imperative ("please provide the Q3 conversion dataset"), justifies it with "data integration by 2:00 PM", and ends with a request to "update on deliverable status."',
      },
      {
        modelId: 'gemini-1-5-flash',
        model: 'Gemini 1.5 Flash',
        version: 'gemini-1.5-flash-001',
        response: "Hey Jordan, following up on the Q3 numbers needed for today's 2 PM deck. Can you send those over shortly so I can plug them in? Thanks!",
        keyStylometricNote: 'Very short follow-up: "following up on the Q3 numbers", a casual ask to "plug them in", and a one-word "Thanks!" sign-off.',
      },
      {
        modelId: 'llama-3-70b',
        model: 'Llama 3 70B',
        version: 'meta-llama-3-70b-instruct',
        response: "Hey Jordan, hope your week's going well! Quick check-in on the Q3 numbers—I've got to lock the slide deck by 2 PM today. Could you shoot those over when you get a sec? Thanks!",
        keyStylometricNote: 'Casual check-in ("Quick check-in on the Q3 numbers") with slangy phrasing: "lock the slide deck" and "shoot those over when you get a sec?"',
      },
      {
        modelId: 'copilot',
        model: 'Microsoft Copilot',
        version: 'copilot-2024-03',
        response: "Hey Marcus, hope you're doing well! Just wanted to check in on the status of the Q3 metrics report. Our presentation slides are due to leadership tomorrow afternoon, so we really need those data points finalized by 2 PM today to wrap everything up. Please let me know if you're running into any roadblocks or if there's anything I can do to help unblock you!",
        keyStylometricNote: 'Balances urgency with assistance, establishing a strict deadline of "2 PM today to wrap everything up" while offering help.',
      },
      {
        modelId: 'perplexity-sonar',
        model: 'Perplexity Sonar',
        version: 'sonar-large-2024-07',
        response: "Hi Elena, checking in on the outstanding metrics summary, which is now two days past the target date. The final presentation deck requires these numbers before 3:00 PM today for leadership review. Please provide the latest dataset or share an estimated completion time.",
        keyStylometricNote: 'Notes the timeline discrepancy objectively, requesting an "estimated completion time" before the presentation review cutoff.',
      },
    ],
  }),

  // --------------------------------------------------------------------------
  // 4. EVERYDAY MESSAGES
  // --------------------------------------------------------------------------
  createVerifiedChallenge({
    id: 'aidle-2026-msg-001',
    category: 'Everyday Messages',
    title: 'Gracefully Canceling Plans',
    prompt: 'You woke up feeling completely drained and exhausted. Text a good friend canceling your dinner plans tonight without making elaborate fake excuses.',
    targetResponse: "Hey Maya, I'm so sorry to do this, but I'm completely wiped out today and don't think I'd be good company tonight. Could we please reschedule our dinner for next week? I'd love to treat you to make up for canceling last minute!",
    targetModelId: 'claude-3-5-sonnet',
    targetModel: 'Claude 3.5 Sonnet',
    modelVersion: 'claude-3-5-sonnet-20240620',
    verificationStatus: 'verified',
    sourceEvidence: 'Recorded API benchmark run 2024-Q3',
    verifiedAt: '2024-08-24T17:00:00Z',
    hints: {
      stylometryClue: 'Honest vulnerability ("completely wiped out", "don\'t think I\'d be good company"), genuine apology, and an immediate concrete reschedule offer.',
      structuralClue: 'Two-sentence emotional arc: validates personal social battery limits honestly, then immediately protects the friendship with an offer to treat.',
    },
    responseAnalysis: 'Honors personal energy limits honestly without inventing theatrical illness, while prioritizing the friendship with an immediate reschedule proposal.',
    distinguishingTraits: ['Authentic social vulnerability', 'Proactive reschedule remedy', 'Warm spoken cadence'],
    comparisonResponses: [
      {
        modelId: 'gpt-4o',
        model: 'GPT-4o',
        version: 'gpt-4o-2024-08-06',
        response: "Hey Maya, I'm so sorry, but I'm feeling totally exhausted today and need to take the evening to rest. Can we please take a rain check and reschedule for next week? I'm so looking forward to catching up soon!",
        keyStylometricNote: 'Apologises up front ("I\'m so sorry"), proposes to "take a rain check and reschedule for next week", and closes enthusiastically: "I\'m so looking forward to catching up soon!"',
      },
      {
        modelId: 'llama-3-70b',
        model: 'Llama 3 70B',
        version: 'meta-llama-3-70b-instruct',
        response: "Hey Maya, I'm really sorry to bail, but I'm running on empty today and need to crash tonight. Let's definitely reschedule for next week when I'm back to 100%.",
        keyStylometricNote: 'Casual everyday expressions ("running on empty", "crash tonight") and a relaxed reschedule promise ("back to 100%").',
      },
      {
        modelId: 'mistral-large',
        model: 'Mistral Large',
        version: 'mistral-large-2407',
        response: "Hi Maya, I am feeling very exhausted today and need to cancel our dinner tonight. Sincere apologies for the short notice—let's reschedule for some time next week.",
        keyStylometricNote: 'Cancels outright ("need to cancel our dinner tonight"), apologises for "the short notice", and proposes rescheduling, all in one dash-joined sentence.',
      },
      {
        modelId: 'grok-2',
        model: 'Grok 2',
        version: 'grok-2-2024-08-13',
        response: "Hey Maya, I'm running on zero battery today and need to bow out of dinner tonight. Super sorry for the late notice—can I buy your meal when we reschedule next week?",
        keyStylometricNote: 'Uses a battery metaphor ("running on zero battery"), says "bow out of dinner tonight", and offers a make-good: "can I buy your meal when we reschedule next week?"',
      },
      {
        modelId: 'claude-3-5-haiku',
        model: 'Claude 3.5 Haiku',
        version: 'claude-3-5-haiku-20241022',
        response: "Hey Maya, really sorry to cancel, but I'm completely exhausted today and need a quiet night. Could we push our dinner to next week? My treat!",
        keyStylometricNote: 'Three short sentences: "really sorry to cancel", a request to "push our dinner to next week", and a one-line offer, "My treat!"',
      },
      {
        modelId: 'copilot',
        model: 'Microsoft Copilot',
        version: 'copilot-2024-03',
        response: "Hey Sam, I'm so sorry, but I have to cancel our dinner tonight. I woke up feeling completely exhausted and running on empty, and I really need to stay in and rest tonight. I was so looking forward to seeing you—can we please reschedule for next week when I'll be much better company?",
        keyStylometricNote: 'Communicates genuine low energy candidly with "running on empty", promising to reschedule when able to provide better company.',
      },
      {
        modelId: 'perplexity-sonar',
        model: 'Perplexity Sonar',
        version: 'sonar-large-2024-07',
        response: "Hi Jamie, I need to cancel our dinner plans for this evening. I am dealing with severe exhaustion today and need to prioritize rest rather than socializing. Let us pick another date next week once my energy is restored.",
        keyStylometricNote: 'Declines social plans concisely, emphasizing the need to "prioritize rest rather than socializing" with an offer to reconnect.',
      },
    ],
  }),

  createVerifiedChallenge({
    id: 'aidle-2026-msg-002',
    category: 'Everyday Messages',
    title: 'Requesting a Repaid Loan',
    prompt: 'You lent a friend $75 for concert tickets two weeks ago and they have not mentioned it since. Write a polite, casual message asking for repayment without creating awkwardness.',
    targetResponse: "Hey Chris! Hope you had an awesome weekend. Just sending a quick reminder about the $75 for the concert tickets when you get a chance—Venmo or Zelle both work great for me. Thanks man!",
    targetModelId: 'llama-3-70b',
    targetModel: 'Llama 3 70B',
    modelVersion: 'meta-llama-3-70b-instruct',
    verificationStatus: 'partially_verified',
    sourceEvidence: 'Recorded API benchmark run 2024-Q3 (open-weight quant seed variance)',
    verifiedAt: '2024-08-25T13:45:00Z',
    hints: {
      stylometryClue: 'Friendly opener ("Hope you had an awesome weekend"), states the amount plainly ("$75 for the concert tickets"), lists payment apps ("Venmo or Zelle"), and signs off "Thanks man!"',
      structuralClue: 'Low-friction structure: frames the reminder as an ordinary check-in and immediately gives flexible payment options ("Venmo or Zelle").',
    },
    responseAnalysis: 'Excels at low-stakes everyday logistics: treating money reminders as ordinary administrative check-ins rather than tense confrontations, making repayment effortless and casual.',
    distinguishingTraits: ['Breezy casual tone', 'Direct payment method mention', 'Friendly low-pressure closing'],
    comparisonResponses: [
      {
        modelId: 'gpt-4o',
        model: 'GPT-4o',
        version: 'gpt-4o-2024-08-06',
        response: "Hey Chris! Hope your week is off to a great start. Whenever you get a moment, could you send over that $75 for the concert tickets from last week? You can find me on Venmo @alex. Appreciate it!",
        keyStylometricNote: 'Warm opener ("Hope your week is off to a great start"), a deferential request ("Whenever you get a moment"), a handle ("Venmo @alex"), and a closing "Appreciate it!"',
      },
      {
        modelId: 'claude-3-5-sonnet',
        model: 'Claude 3.5 Sonnet',
        version: 'claude-3-5-sonnet-20240620',
        response: "Hey Chris, hope you're doing well! Quick ping regarding the $75 concert ticket from the other week—no rush, just whenever you have a second to settle up via Venmo. Thanks so much!",
        keyStylometricNote: 'Calls it a "Quick ping", signals low urgency ("no rush, just whenever you have a second"), and thanks him with "Thanks so much!"',
      },
      {
        modelId: 'mistral-large',
        model: 'Mistral Large',
        version: 'mistral-large-2407',
        response: "Hi Chris, sending a quick reminder about the $75 for the concert tickets. Please send it over via Venmo or bank transfer when you can. Thank you.",
        keyStylometricNote: 'Three sentences with no small talk: "sending a quick reminder about the $75", payment options "Venmo or bank transfer", and a bare "Thank you."',
      },
      {
        modelId: 'gemini-1-5-pro',
        model: 'Gemini 1.5 Pro',
        version: 'gemini-1.5-pro-001',
        response: "Hey Chris, hope things are going well! Whenever you get a chance, could you send over that $75 for the concert tickets? You can shoot it over on Venmo or PayPal. Thanks!",
        keyStylometricNote: 'Opens with "hope things are going well!", asks "Whenever you get a chance", offers "Venmo or PayPal", and ends with "Thanks!"',
      },
      {
        modelId: 'deepseek-v3',
        model: 'DeepSeek V3',
        version: 'deepseek-chat-v3',
        response: "Hi Chris, hope you are doing well. Just a quick reminder regarding the $75 for the concert tickets from two weeks ago. Please transfer via Venmo whenever convenient. Thank you!",
        keyStylometricNote: 'Avoids contractions ("hope you are doing well"), dates the debt ("from two weeks ago"), and asks to "transfer via Venmo whenever convenient."',
      },
      {
        modelId: 'copilot',
        model: 'Microsoft Copilot',
        version: 'copilot-2024-03',
        response: "Hey Liam! Hope you're having a great week. Just doing a quick check-in about the $75 for the concert tickets from a couple of weeks ago whenever you have a chance to send that over. No huge rush, just trying to get my monthly budget organized! My Venmo handle is @sample-handle.",
        keyStylometricNote: 'Minimizes awkwardness by referencing monthly finances, asking for repayment "whenever you have a chance to send that over" with handle provided.',
      },
      {
        modelId: 'perplexity-sonar',
        model: 'Perplexity Sonar',
        version: 'sonar-large-2024-07',
        response: "Hey Maya, checking in regarding the $75 balance for the concert tickets purchased two weeks ago. When convenient, please transfer the funds via Venmo or Zelle to settle the expense. Thanks!",
        keyStylometricNote: 'Keeps the financial reminder brief and factual, requesting to "settle the expense" via standard payment applications.',
      },
    ],
  }),

  createVerifiedChallenge({
    id: 'aidle-2026-msg-003',
    category: 'Everyday Messages',
    title: 'Declining a Distant Acquaintance Invite',
    prompt: 'A casual acquaintance invites you to an expensive weekend trip that you cannot afford and do not feel close enough to attend. Write a gracious, firm decline.',
    targetResponse: "Thanks so much for thinking of me and including me in the trip plans! It sounds like it's going to be an incredible weekend, but I won't be able to make it work this time around. I hope you all have an amazing time, and let's definitely grab a coffee sometime soon to catch up!",
    targetModelId: 'gpt-4o',
    targetModel: 'GPT-4o',
    modelVersion: 'gpt-4o-2024-08-06',
    verificationStatus: 'partially_verified',
    sourceEvidence: 'Direct API benchmark response 2024-08 (sub-build variations documented)',
    verifiedAt: '2024-08-26T16:00:00Z',
    hints: {
      stylometryClue: 'Opens with gratitude ("Thanks so much for thinking of me"), declines gently ("I won\'t be able to make it work this time around"), and proposes "grab a coffee sometime soon" instead.',
      structuralClue: 'Three-part social buffer structure: praises the invitation, declines politely without excuses, and proposes a lower-stakes local alternative.',
    },
    responseAnalysis: 'Crafts the ideal social buffer: affirming the invitee’s generosity, providing a clean polite decline without divulging private financial details, and substituting a manageable local hangout.',
    distinguishingTraits: ['Gracious social buffer', 'No defensive over-explanation', 'Positive lower-stakes counter-offer'],
    comparisonResponses: [
      {
        modelId: 'claude-3-5-sonnet',
        model: 'Claude 3.5 Sonnet',
        version: 'claude-3-5-sonnet-20240620',
        response: "Thank you for the invite! It sounds like such a fun trip, but I won't be able to swing it this time. Hope you guys have the best weekend out there—let's grab coffee or a drink sometime when you're back!",
        keyStylometricNote: 'Declines casually ("I won\'t be able to swing it this time"), wishes them "the best weekend out there", and suggests "coffee or a drink sometime when you\'re back!"',
      },
      {
        modelId: 'mistral-large',
        model: 'Mistral Large',
        version: 'mistral-large-2407',
        response: "Thank you for the invitation. Unfortunately, I will not be able to join the trip this weekend. I hope you have a great time, and let's catch up another time.",
        keyStylometricNote: 'Polite and compact: thanks for the invitation, a plain \"Unfortunately\" decline with no reason given, and a short good wish.',
      },
      {
        modelId: 'grok-2',
        model: 'Grok 2',
        version: 'grok-2-2024-08-13',
        response: "Appreciate the invite! Trip sounds epic, but I'm going to have to sit this one out. Hope you all have a blast—let's grab a beer next time you're free!",
        keyStylometricNote: 'Casual and punchy with modern slang ("have to sit this one out", "have a blast").',
      },
      {
        modelId: 'deepseek-v3',
        model: 'DeepSeek V3',
        version: 'deepseek-chat-v3',
        response: "Thank you for the invitation to join the weekend trip. Unfortunately, I will not be able to participate this time. I hope you have a wonderful trip, and let's connect when you return.",
        keyStylometricNote: 'Declines in formal phrasing ("Unfortunately, I will not be able to participate this time"), hopes for "a wonderful trip", and proposes "let\'s connect when you return."',
      },
      {
        modelId: 'copilot',
        model: 'Microsoft Copilot',
        version: 'copilot-2024-03',
        response: "Thank you so much for including me in the trip invitation! It sounds like you all have an amazing getaway planned, but I won't be able to join this time around due to other budget priorities. I hope you have an incredible trip, and I'd love to catch up over coffee sometime soon!",
        keyStylometricNote: 'Expresses polite appreciation while citing "other budget priorities" as the boundary, wishing the group a wonderful trip.',
      },
      {
        modelId: 'perplexity-sonar',
        model: 'Perplexity Sonar',
        version: 'sonar-large-2024-07',
        response: "Thank you for the invitation to the cabin weekend. The itinerary sounds enjoyable, but the timing and budget do not align for me, so I must decline. I hope you and the group have a successful trip.",
        keyStylometricNote: 'Conveys an unequivocal decision stating "the timing and budget do not align for me" without defensive elaboration.',
      },
    ],
  }),

  // --------------------------------------------------------------------------
  // 5. EMOTIONAL SITUATIONS
  // --------------------------------------------------------------------------
  createVerifiedChallenge({
    id: 'aidle-2026-emo-001',
    category: 'Emotional Situations',
    title: 'Comforting a Job-Hunting Friend',
    prompt: 'Your closest friend just found out they did not get the job after four grueling rounds of interviews. Write a grounding, deeply caring text message.',
    targetResponse: "I am so sorry, and I know how exhausting it is to pour so much energy into four rounds just to hear that news. It is completely valid to feel crushed and frustrated today. You brought incredible talent to those conversations, and whenever you're ready to vent or just want to eat pizza without talking about resumes at all, I'm right here.",
    targetModelId: 'claude-3-5-sonnet',
    targetModel: 'Claude 3.5 Sonnet',
    modelVersion: 'claude-3-5-sonnet-20240620',
    verificationStatus: 'verified',
    sourceEvidence: 'Recorded API benchmark run 2024-Q3',
    verifiedAt: '2024-08-27T10:30:00Z',
    hints: {
      stylometryClue: 'Deep emotional attunement, zero toxic positivity ("valid to feel crushed"), and unconditional low-pressure companionship.',
      structuralClue: 'Comforting progression: validates the grueling interview fatigue first, affirms capability, and offers quiet companionship ("eat pizza without talking about resumes").',
    },
    responseAnalysis: 'Avoids hollow clichés like "everything happens for a reason," validating the emotional and physical toll of modern hiring while offering tangible, comfort-oriented presence.',
    distinguishingTraits: ['Emotional validation without toxic positivity', 'Tangible comfort offering', 'High conversational empathy'],
    comparisonResponses: [
      {
        modelId: 'gpt-4o',
        model: 'GPT-4o',
        version: 'gpt-4o-2024-08-06',
        response: "I'm so sorry to hear that news. Going through four rounds is a huge investment of energy, and it's completely understandable to be disappointed. Please take all the time you need today—you have so much talent, and I'm always here if you want to talk or hang out!",
        keyStylometricNote: 'Warm, supportive phrasing that acknowledges the effort involved (\"a huge investment of energy\"), encourages rest, and offers to be available.',
      },
      {
        modelId: 'llama-3-70b',
        model: 'Llama 3 70B',
        version: 'meta-llama-3-70b-instruct',
        response: "Man, I'm so sorry. That seriously sucks after grinding through four rounds. You worked so hard and any team would be lucky to have you. Dinner is on me whenever you want to decompress.",
        keyStylometricNote: 'Opens with "Man, I\'m so sorry", says it "seriously sucks after grinding through four rounds", and offers "Dinner is on me whenever you want to decompress."',
      },
      {
        modelId: 'mistral-large',
        model: 'Mistral Large',
        version: 'mistral-large-2407',
        response: "I am really sorry to hear that. Four rounds is a significant effort, and it is completely normal to feel disappointed. Let me know if you want to meet up tonight or take your mind off things.",
        keyStylometricNote: 'Contraction-free sympathy ("I am really sorry to hear that"), normalises the feeling ("completely normal to feel disappointed"), and invites a meet-up "tonight".',
      },
      {
        modelId: 'gemini-1-5-pro',
        model: 'Gemini 1.5 Pro',
        version: 'gemini-1.5-pro-001',
        response: "I am so sorry. Doing four rounds of interviews takes so much out of you, and it's completely unfair after that much effort. Take all the space you need today—I'm here whenever you want to grab food or vent.",
        keyStylometricNote: 'Validates with "it\'s completely unfair after that much effort", gives permission to "Take all the space you need today", and offers to "grab food or vent".',
      },
      {
        modelId: 'deepseek-v3',
        model: 'DeepSeek V3',
        version: 'deepseek-chat-v3',
        response: "I am so sorry to hear this. Completing four interview rounds requires tremendous effort, and it is completely natural to feel disappointed right now. Please take time to decompress—I am here whenever you want to talk.",
        keyStylometricNote: 'Formal sympathy ("I am so sorry to hear this") that calls the effort "tremendous", the feeling "completely natural", and offers "I am here whenever you want to talk."',
      },
      {
        modelId: 'copilot',
        model: 'Microsoft Copilot',
        version: 'copilot-2024-03',
        response: "I am so, so sorry. Going through four rounds of interviews takes an immense amount of energy, and it is completely unfair and devastating to get that news today. Please remember that this hiring outcome doesn't define your incredible capabilities or your worth. Take all the time you need to be angry or sad. I'm bringing over dinner whenever you're ready, or we can just sit in silence—whatever you need, I'm here.",
        keyStylometricNote: 'Reassures the friend deeply, reminding them that the result "doesn\'t define your incredible capabilities" while offering physical support.',
      },
      {
        modelId: 'perplexity-sonar',
        model: 'Perplexity Sonar',
        version: 'sonar-large-2024-07',
        response: "I was disheartened to hear the interview news. Completing four extensive rounds demonstrates your strong qualifications, even if this particular organization made an unfortunate decision. Take time to process the frustration today. When you feel up to it, let me know how I can best support you.",
        keyStylometricNote: 'Offers steady encouragement by validating their qualifications, calling the outcome an "unfortunate decision" without excessive melodrama.',
      },
    ],
  }),

  createVerifiedChallenge({
    id: 'aidle-2026-emo-002',
    category: 'Emotional Situations',
    title: 'Needing Space Without Hurting Feelings',
    prompt: 'You are going through personal emotional burnout and need a quiet weekend alone. Text a caring friend who keeps checking in, reassuring them without hurting their feelings.',
    targetResponse: "Hey, thank you so much for checking in on me—it genuinely means a lot to know you care. I'm feeling pretty socially drained and overwhelmed right now, so I'm taking this weekend completely offline to rest and recharge. Everything is okay between us, and I'll text you on Monday once I've had a breather!",
    targetModelId: 'claude-3-5-sonnet',
    targetModel: 'Claude 3.5 Sonnet',
    modelVersion: 'claude-3-5-sonnet-20240620',
    verificationStatus: 'partially_verified',
    sourceEvidence: 'Recorded API benchmark run 2024-Q3 (sub-build variations documented)',
    verifiedAt: '2024-08-28T12:00:00Z',
    hints: {
      stylometryClue: 'Explicit relational reassurance ("Everything is okay between us") paired with clear emotional self-awareness and a definitive return date.',
      structuralClue: 'Boundary cadence: thanks the friend for checking in, explains being socially drained, reassures the bond, and sets a clear return day.',
    },
    responseAnalysis: 'Expertly identifies the hidden anxiety in boundary setting: it proactively clarifies that the retreat is personal and not a relational withdrawal, preserving friendship security.',
    distinguishingTraits: ['Relational reassurance anchor', 'Clear self-awareness boundary', 'Specific return timeline'],
    comparisonResponses: [
      {
        modelId: 'gpt-4o',
        model: 'GPT-4o',
        version: 'gpt-4o-2024-08-06',
        response: "Hi! Thank you so much for being such a wonderful friend and checking in. I'm feeling a bit burned out and just need a quiet weekend to unplug and reset. Nothing is wrong at all, and I can't wait to catch up with you early next week!",
        keyStylometricNote: 'Warm gratitude ("such a wonderful friend"), a plain reason ("a bit burned out"), a firm reassurance ("Nothing is wrong at all"), and an eager "early next week!"',
      },
      {
        modelId: 'llama-3-70b',
        model: 'Llama 3 70B',
        version: 'meta-llama-3-70b-instruct',
        response: "Hey, really appreciate you checking on me! I'm just running on empty and need a solo weekend to recharge my battery. All good on my end—I'll hit you up on Monday.",
        keyStylometricNote: 'Relaxed wording ("running on empty", "solo weekend"), reassures with "All good on my end", and promises to "hit you up on Monday."',
      },
      {
        modelId: 'mistral-large',
        model: 'Mistral Large',
        version: 'mistral-large-2407',
        response: "Thank you for checking in. I am taking this weekend to rest quietly and recharge. Everything is fine, and I will get back in touch with you early next week.",
        keyStylometricNote: 'Three flat sentences without exclamation marks: "Thank you for checking in", "rest quietly and recharge", and "Everything is fine".',
      },
      {
        modelId: 'deepseek-v3',
        model: 'DeepSeek V3',
        version: 'deepseek-chat-v3',
        response: "Thank you for checking in, I truly appreciate your thoughtfulness. I am currently experiencing burnout and need this weekend to disconnect and rest. Everything is fine between us, and I will reconnect with you on Monday.",
        keyStylometricNote: 'Uses clinical wording ("experiencing burnout", "disconnect and rest"), reassures with "Everything is fine between us", and gives a dated plan: "reconnect with you on Monday."',
      },
      {
        modelId: 'gemini-1-5-pro',
        model: 'Gemini 1.5 Pro',
        version: 'gemini-1.5-pro-001',
        response: "Thank you for checking in on me, you're the best! I'm just feeling pretty burned out lately and need a totally quiet weekend to recharge my batteries. We're totally good, and I'll catch up with you on Monday!",
        keyStylometricNote: 'Compliments the friend ("you\'re the best!"), stresses a "totally quiet weekend", reassures with "We\'re totally good", and sets "Monday" as the catch-up.',
      },
      {
        modelId: 'copilot',
        model: 'Microsoft Copilot',
        version: 'copilot-2024-03',
        response: "I really appreciate you checking in on me—your friendship means so much to me! I'm dealing with some heavy emotional burnout from work and life lately, and my social battery is pretty much at zero. I'm going to take this entire weekend completely off the grid to recharge quietly. Everything between us is great, and I promise to text you first thing Monday morning to catch up!",
        keyStylometricNote: 'Affirms the friendship warmly, explaining that their battery is "pretty much at zero" with a commitment to connect Monday.',
      },
      {
        modelId: 'perplexity-sonar',
        model: 'Perplexity Sonar',
        version: 'sonar-large-2024-07',
        response: "Thank you for your messages and concern. I am experiencing significant personal fatigue and need a quiet, solitary weekend to reset. There is no issue between us whatsoever; I simply need downtime away from my phone. I will reach out early next week.",
        keyStylometricNote: 'Reassures the friend that there is "no issue between us whatsoever", explaining the temporary absence objectively.',
      },
    ],
  }),

  createVerifiedChallenge({
    id: 'aidle-2026-emo-003',
    category: 'Emotional Situations',
    title: 'Addressing Feeling Left Out',
    prompt: 'You noticed your close group of friends went out to brunch without inviting you. Send a calm, non-accusatory message to one friend expressing that you felt a bit left out.',
    targetResponse: "Hey! Saw the photos from brunch yesterday—looked like a really fun spot. I'm not trying to make a big thing out of it, but I felt a little bummed to miss out on the group hangout. Definitely want to make sure I'm in the loop for the next one!",
    targetModelId: 'llama-3-70b',
    targetModel: 'Llama 3 70B',
    modelVersion: 'meta-llama-3-70b-instruct',
    verificationStatus: 'partially_verified',
    sourceEvidence: 'Recorded API benchmark run 2024-Q3 (open-weight quant seed variance)',
    verifiedAt: '2024-08-29T14:20:00Z',
    hints: {
      stylometryClue: 'Everyday casual disclosure ("felt a little bummed"), low-stakes de-escalation ("not trying to make a big thing out of it"), and future inclusion request.',
      structuralClue: 'Low-drama conversational pacing: acknowledges the fun photos, names the feeling without accusations, and closes with a lighthearted inclusion nudge.',
    },
    responseAnalysis: 'Manages delicate emotional disclosures with grounded honesty: expressing the feeling plainly without dramatic accusation, making it easy for the friend to respond with warmth rather than defensiveness.',
    distinguishingTraits: ['Low-drama emotional naming', 'Casual non-confrontational phrasing', 'Forward-looking inclusion nudge'],
    comparisonResponses: [
      {
        modelId: 'claude-3-5-sonnet',
        model: 'Claude 3.5 Sonnet',
        version: 'claude-3-5-sonnet-20240620',
        response: "Hey, saw the photos from brunch yesterday and it looked like a great time! Honestly, I felt a little hurt to see the group get together without me, but I wanted to mention it gently rather than let it linger. Would love to join for the next hangout!",
        keyStylometricNote: 'Names the hurt directly ("felt a little hurt") while framing it gently ("wanted to mention it gently rather than let it linger").',
      },
      {
        modelId: 'gpt-4o',
        model: 'GPT-4o',
        version: 'gpt-4o-2024-08-06',
        response: "Hey there! I saw the pictures from brunch yesterday and it looked wonderful. To be honest, I felt a little left out seeing everyone together, but I know plans come together quickly. I'd love to join next time you all get together!",
        keyStylometricNote: 'Admits the feeling ("To be honest, I felt a little left out"), excuses the others ("I know plans come together quickly"), and ends with "I\'d love to join next time".',
      },
      {
        modelId: 'mistral-large',
        model: 'Mistral Large',
        version: 'mistral-large-2407',
        response: "Hi, I saw the pictures from brunch yesterday. I was a bit disappointed not to be included, but I hope you had a good time. Please let me know when the next group gathering is.",
        keyStylometricNote: 'Names the feeling in one clause ("I was a bit disappointed not to be included"), wishes them well, and ends with a request: "Please let me know when the next group gathering is."',
      },
      {
        modelId: 'gemini-1-5-pro',
        model: 'Gemini 1.5 Pro',
        version: 'gemini-1.5-pro-001',
        response: "Hey! Saw the photos from brunch—it looked like so much fun! Not trying to make a big deal of it, but I felt a bit left out seeing the group together. Definitely keep me posted for the next meetup!",
        keyStylometricNote: 'Downplays it first ("Not trying to make a big deal of it"), then says "I felt a bit left out", and ends with "Definitely keep me posted for the next meetup!"',
      },
      {
        modelId: 'copilot',
        model: 'Microsoft Copilot',
        version: 'copilot-2024-03',
        response: "Hey Taylor, hope you're having a good weekend! I saw the photos from brunch yesterday and it looked like a great spot. I didn't want to make an issue out of it, but I felt a little sting being left out of the group get-together. I value our friendship and just wanted to share that honestly so nothing sits between us. Hope we can all hang out together soon!",
        keyStylometricNote: 'Expresses vulnerability calmly by admitting to "a little sting being left out", emphasizing trust and communication.',
      },
      {
        modelId: 'perplexity-sonar',
        model: 'Perplexity Sonar',
        version: 'sonar-large-2024-07',
        response: "Hi Morgan, I noticed the group brunch photos from Sunday. While I assume it was an informal gathering that came together quickly, I felt somewhat excluded not being invited. I wanted to communicate that openly rather than make assumptions. Let us plan something together soon.",
        keyStylometricNote: 'Maintains an objective stance by noting "felt somewhat excluded not being invited" while assuming good intentions from peers.',
      },
    ],
  }),

  // --------------------------------------------------------------------------
  // 6. PERSONAL & PROFESSIONAL WRITING
  // --------------------------------------------------------------------------
  createVerifiedChallenge({
    id: 'aidle-2026-prw-001',
    category: 'Personal & Professional Writing',
    title: 'Urgent Landlord Repair Request',
    prompt: 'Your apartment water heater started leaking puddles of water onto the floor this morning. Write a clear, urgent, respectful message to your landlord requesting immediate maintenance.',
    targetResponse: "Hi Mr. Henderson, I am writing to alert you that our water heater began leaking actively this morning and is currently pooling water across the utility closet floor. I have placed towels down and turned the shut-off valve, but this requires immediate plumber inspection to prevent floor damage. Please let me know when maintenance can arrive today.",
    targetModelId: 'gemini-1-5-pro',
    targetModel: 'Gemini 1.5 Pro',
    modelVersion: 'gemini-1.5-pro-001',
    verificationStatus: 'verified',
    sourceEvidence: 'Recorded API benchmark run 2024-Q3',
    verifiedAt: '2024-08-30T09:15:00Z',
    hints: {
      stylometryClue: 'Specific mitigation steps already taken ("placed towels down and turned the shut-off valve"), an explicit call for immediate plumber inspection, and a formal, respectful tone.',
      structuralClue: 'Structured operational checklist: alerts to the active leak, documents mitigation steps taken, stresses property damage prevention, and requests an arrival time.',
    },
    responseAnalysis: 'Writes exceptionally crisp utility communications: highlighting both the immediate physical hazard and the mitigating steps already taken, giving the recipient clear information to dispatch repairs rapidly.',
    distinguishingTraits: ['Proactive mitigation checklist', 'Clear damage prevention appeal', 'Urgent yet professional tone'],
    comparisonResponses: [
      {
        modelId: 'gpt-4o',
        model: 'GPT-4o',
        version: 'gpt-4o-2024-08-06',
        response: "Hi Mr. Henderson, I hope you're doing well. I wanted to notify you immediately that our water heater has started leaking this morning, with water collecting in the hallway closet. I've cleaned up the standing water, but we urgently need a technician to inspect it before it causes water damage. Please let me know as soon as possible when someone can come by.",
        keyStylometricNote: 'Opens politely ("I hope you\'re doing well"), locates the leak in "the hallway closet", says it "cleaned up the standing water", and asks "as soon as possible" for a technician.',
      },
      {
        modelId: 'claude-3-5-sonnet',
        model: 'Claude 3.5 Sonnet',
        version: 'claude-3-5-sonnet-20240620',
        response: "Hi Mr. Henderson, reaching out urgently because our water heater developed a noticeable leak this morning and water is pooling on the utility floor. I've contained it with towels for now, but it will need emergency repair today to avoid structural damage. Could you please let me know when a plumber can come take a look?",
        keyStylometricNote: 'States the urgency up front ("reaching out urgently"), mentions the stopgap ("contained it with towels"), and closes with a question: "when a plumber can come take a look?"',
      },
      {
        modelId: 'mistral-large',
        model: 'Mistral Large',
        version: 'mistral-large-2407',
        response: "Dear Mr. Henderson, the water heater in unit 3B has started leaking water onto the floor this morning. I have contained the leak temporarily, but urgent maintenance is needed today to prevent property damage. Please confirm when a technician can inspect it.",
        keyStylometricNote: 'Formal salutation ("Dear Mr. Henderson"), a specific unit ("unit 3B"), no contractions, and a closing request to "confirm when a technician can inspect it."',
      },
      {
        modelId: 'deepseek-v3',
        model: 'DeepSeek V3',
        version: 'deepseek-chat-v3',
        response: "Mr. Henderson, I am reporting an active water heater leak in the utility closet discovered this morning. I have closed the intake valve and contained surface water, but urgent inspection is required today to prevent floor damage. Please advise on maintenance arrival.",
        keyStylometricNote: 'Report-style wording that goes straight to the facts (\"I am reporting an active water heater leak\"), states the actions taken in order, and asks them to \"advise on maintenance arrival\".',
      },
      {
        modelId: 'llama-3-70b',
        model: 'Llama 3 70B',
        version: 'meta-llama-3-70b-instruct',
        response: "Hi Mr. Henderson, our water heater started leaking puddles this morning. I've shut off the valve and put down towels to protect the floors, but we need someone to check it out ASAP today. Please let me know when maintenance can stop by.",
        keyStylometricNote: 'Practical and plain-spoken: reports the leak, mentions shutting off the valve and putting down towels, and asks for someone to come \"ASAP today\".',
      },
      {
        modelId: 'copilot',
        model: 'Microsoft Copilot',
        version: 'copilot-2024-03',
        response: "Good morning Mr. Henderson, I am writing to alert you to an urgent maintenance issue in Unit 3B. The water heater began leaking this morning and is forming standing pools of water on the utility floor. I have placed towels down and shut off the intake valve to mitigate immediate damage, but an emergency plumber is required today to prevent structural flooring damage. Please let me know what time maintenance can arrive. Thank you!",
        keyStylometricNote: 'Demonstrates responsible tenant actions by reporting "shut off the intake valve to mitigate immediate damage" and requesting arrival timing.',
      },
      {
        modelId: 'perplexity-sonar',
        model: 'Perplexity Sonar',
        version: 'sonar-large-2024-07',
        response: "Hello Mr. Davies, an active water leak began at the base of the water heater in apartment 4A this morning, accumulating pooling water on the floor. I have contained the runoff with towels and closed the cold water supply valve. Please dispatch a licensed plumbing technician immediately to avoid property damage. Thank you for your prompt attention.",
        keyStylometricNote: 'Outlines the physical hazard clearly, noting steps to "avoid property damage" with a request for prompt technician dispatch.',
      },
    ],
  }),

  createVerifiedChallenge({
    id: 'aidle-2026-prw-002',
    category: 'Personal & Professional Writing',
    title: 'Cover Letter Opening Hook',
    prompt: 'Write a compelling, natural two-sentence opening for a cover letter applying for a community manager position at an indie gaming studio.',
    targetResponse: "Having spent the last four years building inclusive gaming discords from twenty members to ten thousand, I know firsthand that authentic community isn't built on broadcast announcements, but on genuine player relationships. I would love to bring that player-first community philosophy to the upcoming titles at Moonlit Studio as your next Community Manager.",
    targetModelId: 'claude-3-5-sonnet',
    targetModel: 'Claude 3.5 Sonnet',
    modelVersion: 'claude-3-5-sonnet-20240620',
    verificationStatus: 'verified',
    sourceEvidence: 'Recorded API benchmark run 2024-Q3',
    verifiedAt: '2024-08-31T11:45:00Z',
    hints: {
      stylometryClue: 'High narrative resonance, a concrete growth arc (twenty members to ten thousand), and a contrast between "broadcast announcements" and "genuine player relationships".',
      structuralClue: 'Tight two-sentence narrative arc: sentence one proves scale with concrete numbers, while sentence two bridges directly to the studio mission.',
    },
    responseAnalysis: 'Avoids formulaic corporate cover letter templates, crafting an authentic, mission-aligned narrative opening that immediately establishes credibility and craft.',
    distinguishingTraits: ['Authentic narrative hook', 'Philosophical insight pairing', 'Zero template cliché'],
    comparisonResponses: [
      {
        modelId: 'gpt-4o',
        model: 'GPT-4o',
        version: 'gpt-4o-2024-08-06',
        response: "As a lifelong gamer and passionate community organizer who has scaled online player hubs to thousands of active members, I am thrilled to apply for the Community Manager role at Moonlit Studio. My experience cultivating engaged, positive player communities directly aligns with your studio's mission to create unforgettable indie experiences.",
        keyStylometricNote: 'Opens with a self-description ("As a lifelong gamer and passionate community organizer"), says it is "thrilled to apply", and ties experience to the studio\'s "mission to create unforgettable indie experiences."',
      },
      {
        modelId: 'mistral-large',
        model: 'Mistral Large',
        version: 'mistral-large-2407',
        response: "With four years of experience managing active player communities and driving engagement across digital platforms, I am applying for the Community Manager position at Moonlit Studio. I look forward to scaling your player base with structured engagement initiatives.",
        keyStylometricNote: 'Leads with credentials ("With four years of experience managing active player communities"), states the application plainly, and closes on "scaling your player base".',
      },
      {
        modelId: 'deepseek-v3',
        model: 'DeepSeek V3',
        version: 'deepseek-chat-v3',
        response: "I am writing to apply for the Community Manager role at Moonlit Studio, bringing proven experience in moderation architecture and user retention strategies across gaming ecosystems. My background in data-driven player engagement will support your title's community growth.",
        keyStylometricNote: 'Technical, process-oriented vocabulary ("moderation architecture", "user retention strategies") and a nod to "data-driven player engagement".',
      },
      {
        modelId: 'gemini-1-5-pro',
        model: 'Gemini 1.5 Pro',
        version: 'gemini-1.5-pro-001',
        response: "Having scaled passionate gaming communities from grassroots Discord channels to thriving multi-thousand member hubs, I know what keeps players engaged and heard. I'm excited to bring that player-centric energy to Moonlit Studio as your next Community Manager.",
        keyStylometricNote: 'Energetic and enthusiastic, framing experience as scale (\"grassroots Discord channels to thriving multi-thousand member hubs\") with a \"player-centric\" focus.',
      },
      {
        modelId: 'llama-3-70b',
        model: 'Llama 3 70B',
        version: 'meta-llama-3-70b-instruct',
        response: "Over the last four years, I've grown indie gaming discords from small friend groups to vibrant ten-thousand-member hubs by focusing on real player relationships. I'm excited to bring that genuine community-first approach to Moonlit Studio's upcoming game releases.",
        keyStylometricNote: 'Plain-spoken and community-focused: growth from \"small friend groups\" to \"ten-thousand-member hubs\" and a \"community-first approach\".',
      },
      {
        modelId: 'copilot',
        model: 'Microsoft Copilot',
        version: 'copilot-2024-03',
        response: "Having spent five years cultivating passionate player communities across Discord and Reddit, I understand that an indie studio's greatest asset is the genuine dialogue it builds with its players. I would love to bring that dedicated player-first philosophy and data-informed engagement strategy to the talented team at Moonlit Games.",
        keyStylometricNote: 'Articulates industry insight regarding a "dedicated player-first philosophy" across two well-constructed professional sentences.',
      },
      {
        modelId: 'perplexity-sonar',
        model: 'Perplexity Sonar',
        version: 'sonar-large-2024-07',
        response: "As a community strategist who has scaled online gaming hubs to over fifty thousand active contributors, I specialize in transforming casual players into invested advocates for independent titles. I am excited to apply this focused retention model and transparent communication framework as Community Manager at PixelForge.",
        keyStylometricNote: 'Employs quantitative credibility and terminology like "focused retention model" in an efficient two-sentence opening hook.',
      },
    ],
  }),

  createVerifiedChallenge({
    id: 'aidle-2026-prw-003',
    category: 'Personal & Professional Writing',
    title: 'Customer Service Complaint Resolution',
    prompt: 'An online retailer delivered a broken ceramic bowl that was poorly packaged. Write a polite, firm customer support email requesting a replacement or refund.',
    targetResponse: "Hello Support Team, I received order #84920 today, but unfortunately the ceramic bowl arrived shattered due to insufficient bubble wrap in the parcel. I have attached photos of the damaged item and packaging for your records. Could you please issue a replacement or process a full refund to my original payment method at your earliest convenience?",
    targetModelId: 'gpt-4o',
    targetModel: 'GPT-4o',
    modelVersion: 'gpt-4o-2024-08-06',
    verificationStatus: 'verified',
    sourceEvidence: 'Recorded API benchmark run 2024-Q3',
    verifiedAt: '2024-09-01T13:10:00Z',
    hints: {
      stylometryClue: 'Cites the order number ("order #84920"), the damage ("arrived shattered due to insufficient bubble wrap"), attached photos, and two options: "a replacement or process a full refund".',
      structuralClue: 'Methodical four-point structure: references the order ID, documents photo evidence attached, and offers a clean binary resolution (replacement or refund).',
    },
    responseAnalysis: 'Courteous yet firm consumer communication, providing all required evidentiary details (order ID, damage photographs) and setting clear settlement paths.',
    distinguishingTraits: ['Complete evidence documentation', 'Courteous transactional framing', 'Binary resolution path'],
    comparisonResponses: [
      {
        modelId: 'claude-3-5-sonnet',
        model: 'Claude 3.5 Sonnet',
        version: 'claude-3-5-sonnet-20240620',
        response: "Hi there, I just opened order #84920 and sadly the ceramic bowl was completely broken in transit because the box didn't have adequate padding. I've attached photos showing the damage and the shipping box. Would you be able to either send a replacement or issue a refund? Thanks for your help!",
        keyStylometricNote: 'Opens "Hi there", calls the damage "completely broken in transit", explains the cause ("the box didn\'t have adequate padding"), and ends with thanks: "Thanks for your help!"',
      },
      {
        modelId: 'mistral-large',
        model: 'Mistral Large',
        version: 'mistral-large-2407',
        response: "Dear Support, Order #84920 arrived today with the ceramic bowl shattered due to inadequate packaging. Attached are photographs of the damaged product. Please confirm whether you will send a replacement or issue a full refund.",
        keyStylometricNote: 'Three formal sentences: "Order #84920 arrived today", "Attached are photographs of the damaged product", and "Please confirm whether you will send a replacement or issue a full refund."',
      },
      {
        modelId: 'gemini-1-5-flash',
        model: 'Gemini 1.5 Flash',
        version: 'gemini-1.5-flash-001',
        response: "Hello, my ceramic bowl in order #84920 arrived broken due to poor packaging. Photos are attached. Please send a replacement or process a refund as soon as possible. Thank you!",
        keyStylometricNote: 'Very short report: "arrived broken due to poor packaging", "Photos are attached.", a request for "a replacement or process a refund", and "Thank you!"',
      },
      {
        modelId: 'deepseek-v3',
        model: 'DeepSeek V3',
        version: 'deepseek-chat-v3',
        response: "Dear Support, regarding order #84920, the ceramic item was received damaged due to insufficient transit protection. Photographic documentation is attached. Please confirm whether a replacement shipment or full refund will be processed.",
        keyStylometricNote: 'Calls the bowl "the ceramic item", cites "Photographic documentation", and phrases the ask passively: "will be processed."',
      },
      {
        modelId: 'llama-3-70b',
        model: 'Llama 3 70B',
        version: 'meta-llama-3-70b-instruct',
        response: "Hi there, I received order #84920 today, but the ceramic bowl arrived completely cracked due to very little protective packaging. I've attached photos of the bowl and the box. Could you please send a replacement or issue a full refund? Thanks!",
        keyStylometricNote: 'Says the bowl "arrived completely cracked", blames "very little protective packaging", mentions photos of "the bowl and the box", and ends "Thanks!"',
      },
      {
        modelId: 'copilot',
        model: 'Microsoft Copilot',
        version: 'copilot-2024-03',
        response: "Dear Support Team, I am writing regarding order #84920, which arrived at my residence this afternoon. Unfortunately, the artisanal ceramic bowl was shattered upon arrival due to inadequate protective packaging inside the shipping box. I have attached photographs of the damaged item and packaging materials, and I kindly request an expedited replacement or a full refund to my original payment method. Thank you for your assistance in resolving this.",
        keyStylometricNote: 'Details the condition clearly, documenting "inadequate protective packaging inside the shipping box" alongside photos and remedy options.',
      },
      {
        modelId: 'perplexity-sonar',
        model: 'Perplexity Sonar',
        version: 'sonar-large-2024-07',
        response: "Dear Customer Support, Order #58210 was delivered today containing a fractured ceramic bowl. The package lacked sufficient bubble wrap, resulting in transit damage. Attached are three photographs documenting the condition of both the shipping container and the merchandise. Please confirm whether a replacement unit will be dispatched or if a complete refund has been initiated.",
        keyStylometricNote: 'Identifies transit failure objectively with "lacked sufficient bubble wrap" and asks support to confirm replacement or refund status.',
      },
    ],
  }),

  createVerifiedChallenge({
    id: 'aidle-2026-prw-004',
    category: 'Personal & Professional Writing',
    title: 'Polite Deadline Extension Request',
    prompt: 'You are working on a freelance graphic design commission and need two extra days due to unexpected illness. Write a professional email requesting an extension without sounding irresponsible.',
    targetResponse: "Hi Claire, I'm writing to share a brief update on the brand design concepts: I came down with a sudden illness over the weekend that set my production back by a couple of days. To ensure the final deliverables meet our high quality standards, could we adjust the delivery date from Wednesday to Friday afternoon? All assets are on track to be finalized by then.",
    targetModelId: 'gpt-4o',
    targetModel: 'GPT-4o',
    modelVersion: 'gpt-4o-2024-08-06',
    verificationStatus: 'partially_verified',
    sourceEvidence: 'Recorded API benchmark run 2024-Q3 (sub-build variations documented)',
    verifiedAt: '2024-09-02T16:30:00Z',
    hints: {
      stylometryClue: 'Frames the extension as a commitment to quality ("ensure the final deliverables meet our high quality standards") and offers a specific, concrete new delivery time.',
      structuralClue: 'Structured professional poise: shares a brief update, reframes the delay around quality assurance, and proposes a specific concrete new delivery window.',
    },
    responseAnalysis: 'Reframes timeline adjustments positively around protectiveness of craft quality, communicating specific revised milestones with reassuring composure.',
    distinguishingTraits: ['Positive quality protection framing', 'Concrete revised deadline', 'Reassuring professional poise'],
    comparisonResponses: [
      {
        modelId: 'claude-3-5-sonnet',
        model: 'Claude 3.5 Sonnet',
        version: 'claude-3-5-sonnet-20240620',
        response: "Hi Claire, hope your week is going well. I came down with a bad bug over the weekend that kept me away from my desk, and I want to make sure I don't rush the final brand concepts. Would you be open to shifting our milestone from Wednesday to Friday? Really appreciate your understanding!",
        keyStylometricNote: 'Explains with "a bad bug over the weekend", says it wants to avoid rushing "the final brand concepts", and asks "Would you be open to shifting our milestone from Wednesday to Friday?"',
      },
      {
        modelId: 'mistral-large',
        model: 'Mistral Large',
        version: 'mistral-large-2407',
        response: "Hi Claire, due to unexpected illness over the weekend, I require a short two-day extension on the brand concepts. I propose delivering the complete files by Friday afternoon. Thank you for your flexibility.",
        keyStylometricNote: 'States the request as a requirement ("I require a short two-day extension"), proposes "Friday afternoon", and thanks her for "your flexibility."',
      },
      {
        modelId: 'deepseek-v3',
        model: 'DeepSeek V3',
        version: 'deepseek-chat-v3',
        response: "Claire, owing to sudden medical downtime over the weekend, production on the brand identity assets is delayed. I request shifting the submission deadline to Friday at 3:00 PM to ensure complete specifications are met.",
        keyStylometricNote: 'Uses clinical wording ("sudden medical downtime"), greets only by her name, and gives a precise new time: "Friday at 3:00 PM".',
      },
      {
        modelId: 'gemini-1-5-pro',
        model: 'Gemini 1.5 Pro',
        version: 'gemini-1.5-pro-001',
        response: "Hi Claire, I caught a sudden bug this past weekend that slowed down my design schedule. To ensure you get the absolute best concepts, could we shift our target from Wednesday to Friday at 2 PM? I'm excited to share the finalized work with you.",
        keyStylometricNote: 'Blames "a sudden bug", promises "the absolute best concepts", requests "Friday at 2 PM", and ends on "I\'m excited to share the finalized work with you."',
      },
      {
        modelId: 'llama-3-70b',
        model: 'Llama 3 70B',
        version: 'meta-llama-3-70b-instruct',
        response: "Hi Claire, hope you're having a good week. I came down with a stomach bug over the weekend that set my progress back a couple days. To make sure the final branding looks great, could we push delivery from Wednesday to Friday? Thanks so much for being understanding!",
        keyStylometricNote: 'Specific about the cause ("a stomach bug"), says it "set my progress back a couple days", and asks to "push delivery from Wednesday to Friday".',
      },
      {
        modelId: 'copilot',
        model: 'Microsoft Copilot',
        version: 'copilot-2024-03',
        response: "Hi Jessica, I hope your week is off to a great start. I am writing to provide a transparent update on our brand illustration deliverables. I came down with a severe flu yesterday that has temporarily halted my progress, and to ensure the final assets meet our established quality standard, I would like to request a brief two-day extension to this Friday, November 3rd. All concepts are sketched out, and I am confident I will deliver the polished files by the new date.",
        keyStylometricNote: 'Communicates accountability by emphasizing that concepts are prepared and pledging to "deliver the polished files by the new date."',
      },
      {
        modelId: 'perplexity-sonar',
        model: 'Perplexity Sonar',
        version: 'sonar-large-2024-07',
        response: "Dear Marcus, I am writing to request a 48-hour extension on the graphic design package originally due on Wednesday. An unexpected acute illness has impeded my working capacity over the last 24 hours. The core layouts are 75% complete, and this revised window to Friday will ensure the final export meets full production specifications. Thank you for your understanding.",
        keyStylometricNote: 'Specifies project milestones with "The core layouts are 75% complete" while stating the health reason succinctly.',
      },
    ],
  }),
];

// Alias for backwards compatibility
export const PUZZLE_DATABASE = VERIFIED_CHALLENGE_LIBRARY;
export const VERIFIED_CHALLENGES = VERIFIED_CHALLENGE_LIBRARY;

export interface ModelVariant {
  modelId: string;
  model: string;
  version: string;
  response: string;
  keyStylometricNote: string;
  hints?: {
    stylometryClue: string;
    structuralClue: string;
    contextClue?: string;
    developerClue?: string;
  };
  responseAnalysis?: string;
  distinguishingTraits?: string[];
}

/**
 * Extracts all pre-verified model response variants for a given challenge.
 */
export function getAllModelVariantsForChallenge(base: VerifiedChallenge): ModelVariant[] {
  const primaryModel = AI_MODELS.find((m) => m.id === base.targetModelId);
  const primaryTone = sanitizeHint(
    base.difficultyMetadata?.hints?.stylometryClue ||
    base.hints?.stylometryClue ||
    getModelObservableToneClue(base.targetModelId),
  );
  const primaryStructure = sanitizeHint(
    base.difficultyMetadata?.hints?.structuralClue ||
    base.hints?.structuralClue ||
    describeResponseStructure(base.targetResponse),
  );
  const primaryNuance = sanitizeHint(
    base.difficultyMetadata?.hints?.developerClue ||
    getModelObservableNuanceClue(base.targetModelId),
  );

  const primaryVariant: ModelVariant = {
    modelId: base.targetModelId,
    model: base.targetModel,
    version: base.modelVersion || primaryModel?.version || '',
    response: base.targetResponse,
    keyStylometricNote: primaryTone,
    hints: {
      stylometryClue: primaryTone,
      structuralClue: primaryStructure,
      contextClue: primaryStructure,
      developerClue: primaryNuance,
    },
    responseAnalysis: base.difficultyMetadata?.responseAnalysis || base.responseAnalysis,
    distinguishingTraits: base.difficultyMetadata?.distinguishingTraits,
  };

  const compVariants: ModelVariant[] = (base.comparisonResponses || []).map((cr) => {
    const modelObj = AI_MODELS.find((m) => m.id === cr.modelId);
    const stylometry = sanitizeHint(
      cr.keyStylometricNote || cr.styleNote || getModelObservableToneClue(cr.modelId),
    );
    const structural = describeResponseStructure(cr.response);
    const nuance = getModelObservableNuanceClue(cr.modelId);

    return {
      modelId: cr.modelId,
      model: cr.model,
      version: cr.version || modelObj?.version || '',
      response: cr.response,
      keyStylometricNote: stylometry,
      hints: {
        stylometryClue: stylometry,
        structuralClue: structural,
        contextClue: structural,
        developerClue: nuance,
      },
      responseAnalysis: `Response stylometry: ${stylometry} • Structural pacing: ${structural}`,
      distinguishingTraits: [
        modelObj?.tagline || 'Balanced communication',
        'Distinctive communication cadence',
        'Characteristic phrasing profile',
      ],
    };
  });

  // Ensure unique by modelId
  const map = new Map<string, ModelVariant>();
  map.set(primaryVariant.modelId, primaryVariant);
  for (const cv of compVariants) {
    if (!map.has(cv.modelId)) {
      map.set(cv.modelId, cv);
    }
  }
  return Array.from(map.values());
}

/**
 * Creates an instantiated challenge instance with a chosen mystery target model variant.
 * Sets the chosen model as the correct answer and populates all other verified responses as comparison items.
 */
export function createChallengeInstanceWithVariant(
  base: VerifiedChallenge,
  variant: ModelVariant,
  allVariants: ModelVariant[],
  dateKey?: string,
): VerifiedChallenge {
  const modelObj = AI_MODELS.find((m) => m.id === variant.modelId);
  const stylometryClue = sanitizeHint(
    variant.hints?.stylometryClue ||
    variant.keyStylometricNote ||
    getModelObservableToneClue(variant.modelId),
  );
  const structuralClue = sanitizeHint(
    variant.hints?.structuralClue ||
    describeResponseStructure(variant.response),
  );
  const nuanceClue = sanitizeHint(
    variant.hints?.developerClue ||
    getModelObservableNuanceClue(variant.modelId),
  );

  const hints = {
    stylometryClue,
    structuralClue,
    contextClue: structuralClue,
    developerClue: nuanceClue,
  };

  const responseAnalysis =
    variant.responseAnalysis ||
    `Stylometry observation: ${stylometryClue} Structural pacing: ${structuralClue}`;

  const distinguishingTraits =
    variant.distinguishingTraits || [
      modelObj?.tagline || 'Balanced communication',
      'Distinctive communication cadence',
      'Characteristic phrasing profile',
    ];

  // All other verified model responses for this exact prompt become comparison responses
  const comparisonResponses: ComparisonResponse[] = allVariants
    .filter((v) => v.modelId !== variant.modelId)
    .map((v) => ({
      modelId: v.modelId,
      model: v.model,
      version: v.version,
      response: v.response,
      keyStylometricNote: v.keyStylometricNote,
      modelName: v.model,
      styleNote: v.keyStylometricNote,
    }));

  // Ensure candidatePool contains only models that have verified responses for this prompt
  const verifiedVariantIds = allVariants.map((v) => v.modelId);

  return {
    ...base,
    targetModelId: variant.modelId,
    targetModel: variant.model,
    modelVersion: variant.version,
    targetResponse: variant.response,
    response: variant.response,
    targetModelName: variant.model,
    comparisonResponses,
    alternativeResponses: comparisonResponses,
    candidatePool: verifiedVariantIds,
    difficultyMetadata: {
      hints,
      responseAnalysis,
      distinguishingTraits,
    },
    hints,
    responseAnalysis,
    dateKey: dateKey || base.dateKey,
  };
}

/**
 * Deterministic Murmur3 32-bit hash function.
 */
export function murmur3_32(str: string, seed = 0x9747b28c): number {
  let h1 = (seed >>> 0);
  const c1 = 0xcc9e2d51;
  const c2 = 0x1b873593;

  for (let i = 0; i < str.length; i++) {
    let k1 = str.charCodeAt(i);
    k1 = Math.imul(k1, c1);
    k1 = (k1 << 15) | (k1 >>> 17);
    k1 = Math.imul(k1, c2);

    h1 ^= k1;
    h1 = (h1 << 13) | (h1 >>> 19);
    h1 = (Math.imul(h1, 5) + 0xe6546b64) >>> 0;
  }

  h1 ^= str.length;
  h1 ^= h1 >>> 16;
  h1 = Math.imul(h1, 0x85ebca6b);
  h1 ^= h1 >>> 13;
  h1 = Math.imul(h1, 0xc2b2ae35);
  h1 ^= h1 >>> 16;

  return (h1 >>> 0);
}

/**
 * Unbiased 32-bit integer PRNG (Mulberry32).
 * Given any 32-bit unsigned seed, returns a function producing floats in [0, 1).
 */
export function createMulberry32(seed: number): () => number {
  let a = (seed >>> 0);
  return function next(): number {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Deterministic, unbiased Fisher-Yates shuffle using Mulberry32.
 */
export function deterministicShuffle<T>(items: readonly T[], seed: number): T[] {
  const rng = createMulberry32(seed);
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

/**
 * Format UTC Date to YYYY-MM-DD
 */
export function getUTCDateKey(date: Date = new Date()): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Computes the previous UTC date key given an ISO date string (YYYY-MM-DD).
 */
export function getPreviousUTCDateKey(dateKey: string, daysAgo = 1): string {
  const parts = dateKey.split('-').map(Number);
  const d = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
  d.setUTCDate(d.getUTCDate() - daysAgo);
  return getUTCDateKey(d);
}

/**
 * Evaluates raw deterministic index for a specific dateKey without anti-repetition filter.
 */
function rawDailyIndex(dateKey: string): number {
  const hash = murmur3_32(`${dateKey}::aidle-daily-salt-v3`);
  return (hash >>> 0) % VERIFIED_CHALLENGE_LIBRARY.length;
}

/**
 * Deterministic shared daily challenge selection:
 * 1. Uses UTC calendar date (YYYY-MM-DD) to deterministically select the prompt/scenario.
 * 2. Uses a secondary deterministic UTC date hash to pick which eligible AI model from the
 *    available pre-verified responses for that prompt acts as the mystery target model.
 * 3. Sets the chosen model response as the mystery target, sets the correct answer to that model,
 *    and places all other verified model responses into the post-game comparison view.
 * 4. 100% deterministic & synchronized globally across all devices/reloads on that UTC date.
 */
export function getDailyPuzzle(dateOverride?: string): VerifiedChallenge {
  const dateKey = dateOverride || getUTCDateKey();

  // Find yesterday's raw choice to apply anti-repetition guard
  const yesterdayKey = getPreviousUTCDateKey(dateKey, 1);
  const yesterdayIdx = rawDailyIndex(yesterdayKey);
  const yesterdayChallenge = VERIFIED_CHALLENGE_LIBRARY[yesterdayIdx];

  const primaryHash = murmur3_32(`${dateKey}::aidle-daily-salt-v3`);
  const libLen = VERIFIED_CHALLENGE_LIBRARY.length;

  // Generate deterministic ranked permutation of candidate indices for today
  const candidateIndices: number[] = Array.from({length: libLen}, (_, i) => i);
  const shuffledIndices = deterministicShuffle(candidateIndices, primaryHash);

  // Pick the prompt that satisfies anti-repetition (different category if possible)
  let chosenIdx = shuffledIndices[0];
  if (yesterdayChallenge) {
    const perfectCandidate = shuffledIndices.find((idx) => {
      const c = VERIFIED_CHALLENGE_LIBRARY[idx];
      return c.category !== yesterdayChallenge.category;
    });

    if (perfectCandidate !== undefined) {
      chosenIdx = perfectCandidate;
    } else {
      // Fallback: at least different challenge ID
      const diffId = shuffledIndices.find((idx) => {
        const c = VERIFIED_CHALLENGE_LIBRARY[idx];
        return c.id !== yesterdayChallenge.id;
      });
      if (diffId !== undefined) chosenIdx = diffId;
    }
  }

  const selectedBaseChallenge = VERIFIED_CHALLENGE_LIBRARY[chosenIdx];
  const allVariants = getAllModelVariantsForChallenge(selectedBaseChallenge);

  // Secondary deterministic hash of UTC date to select model variant
  const modelVariantHash = murmur3_32(
    `${dateKey}::${selectedBaseChallenge.id}::model_variant_selection_v3`,
  );
  const variantIndex = (modelVariantHash >>> 0) % allVariants.length;
  const chosenVariant = allVariants[variantIndex];

  return createChallengeInstanceWithVariant(
    selectedBaseChallenge,
    chosenVariant,
    allVariants,
    dateKey,
  );
}

/**
 * Practice mode challenge picker:
 * Selects a prompt independently from the verified library and randomly chooses one of the
 * available verified model responses for that prompt.
 * Supports excluding multiple recently played scenario IDs to avoid immediate repetition.
 */
export function getRandomPuzzle(
  difficultyFilter?: 'easy' | 'medium' | 'hard',
  categoryFilter?: string,
  excludeIds?: string[] | string,
): VerifiedChallenge {
  let pool = VERIFIED_CHALLENGE_LIBRARY;
  if (categoryFilter && categoryFilter !== 'All' && categoryFilter !== 'All Scenarios') {
    pool = pool.filter((p) => p.category === categoryFilter);
  }
  if (pool.length === 0) {
    pool = VERIFIED_CHALLENGE_LIBRARY;
  }

  const excludedSet = new Set(
    Array.isArray(excludeIds) ? excludeIds : excludeIds ? [excludeIds] : [],
  );
  if (excludedSet.size > 0 && pool.length > 1) {
    const withoutRecent = pool.filter((p) => !excludedSet.has(p.id));
    if (withoutRecent.length > 0) {
      pool = withoutRecent;
    }
  }

  const randomIndex = Math.floor(Math.random() * pool.length);
  const baseChallenge = pool[randomIndex];
  const allVariants = getAllModelVariantsForChallenge(baseChallenge);
  const randomVariantIndex = Math.floor(Math.random() * allVariants.length);
  const chosenVariant = allVariants[randomVariantIndex];

  return createChallengeInstanceWithVariant(
    baseChallenge,
    chosenVariant,
    allVariants,
  );
}

export type DifficultyTier = 'easy' | 'medium' | 'hard';

/**
 * Target number of choices per tier: Easy 4, Medium 6, Hard 8.
 *
 * A tier offers FEWER than this only when the prompt has fewer recorded responses. Every choice
 * is a model that actually has a recorded response to the prompt on screen; nothing is ever
 * added just to reach the number (see getDifficultyCandidatePool).
 */
export const DIFFICULTY_POOL_SIZE: Record<DifficultyTier, number> = {
  easy: 4,
  medium: 6,
  hard: 8,
};

/** Thrown when a valid candidate pool cannot be assembled. Never swallowed silently. */
export class CandidatePoolError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CandidatePoolError';
  }
}

/** Models that have a recorded response to this exact prompt (insertion order preserved). */
export function getRecordedModels(puzzle: VerifiedChallenge): AIModel[] {
  const map = new Map<string, AIModel>();
  for (const v of getAllModelVariantsForChallenge(puzzle)) {
    const model = AI_MODELS.find((m) => m.id === v.modelId);
    if (model) map.set(model.id, model);
  }
  return Array.from(map.values());
}

/** How many choices a tier can honestly offer for this prompt: min(tier size, recorded responses). */
export function getTierChoiceCount(puzzle: VerifiedChallenge, tier: DifficultyTier): number {
  return Math.min(DIFFICULTY_POOL_SIZE[tier], getRecordedModels(puzzle).length);
}

/** Fewest and most choices a tier offers across the whole challenge library. */
export function getTierChoiceRange(tier: DifficultyTier): {min: number; max: number} {
  const counts = VERIFIED_CHALLENGE_LIBRARY.map((c) => getTierChoiceCount(c, tier));
  return {min: Math.min(...counts), max: Math.max(...counts)};
}

/** Label text for a tier's choice count, e.g. "4" or "5\u20136", derived from the data. */
export function describeTierChoices(tier: DifficultyTier): string {
  const {min, max} = getTierChoiceRange(tier);
  return min === max ? String(max) : `${min}\u2013${max}`;
}

/**
 * Deterministically builds the candidate pool for a puzzle and tier.
 *
 * The pool contains the target exactly once plus distractors, ALL of which are models that have a
 * recorded response to this prompt. Its size is min(DIFFICULTY_POOL_SIZE[tier], recorded
 * responses): when the prompt has more recorded models than the tier needs, a deterministic seeded
 * subset is chosen; when it has fewer, the pool is simply every recorded model. It is never padded
 * with models that have no response to the prompt, because such a choice could not be the answer.
 *
 * Throws CandidatePoolError (never a silent invalid round) if the tier is unknown, the target is
 * not in the roster, or fewer than two models have a recorded response.
 */
export function getDifficultyCandidatePool(
  puzzle: VerifiedChallenge,
  difficulty: DifficultyTier,
): AIModel[] {
  const size = DIFFICULTY_POOL_SIZE[difficulty];
  if (!size) {
    throw new CandidatePoolError(`Unknown difficulty tier '${String(difficulty)}'.`);
  }
  const target = AI_MODELS.find((m) => m.id === puzzle.targetModelId);
  if (!target) {
    throw new CandidatePoolError(
      `Challenge '${puzzle.id}' target model '${puzzle.targetModelId}' is not defined in AI_MODELS.`,
    );
  }

  const recorded = getRecordedModels(puzzle);
  const recordedIds = new Set(recorded.map((m) => m.id));
  recordedIds.add(target.id);
  const verifiedDistractors = recorded.filter((m) => m.id !== target.id);
  const slots = size - 1; // one slot is the target

  const distractors =
    verifiedDistractors.length > slots
      ? deterministicShuffle(
          verifiedDistractors,
          murmur3_32(`${puzzle.id}::candidate_pool::${difficulty}`),
        ).slice(0, slots)
      : verifiedDistractors;

  const pool = [target, ...distractors].sort((a, b) => a.name.localeCompare(b.name));

  // Defensive integrity check: fail loudly rather than present an invalid round.
  const ids = new Set(pool.map((m) => m.id));
  if (
    pool.length < 2 ||
    pool.length > size ||
    ids.size !== pool.length ||
    pool.filter((m) => m.id === target.id).length !== 1 ||
    pool.some((m) => !recordedIds.has(m.id))
  ) {
    throw new CandidatePoolError(
      `Cannot build a valid ${difficulty} pool for challenge '${puzzle.id}': it needs at least two ` +
        `distinct models with recorded responses (found ${recordedIds.size}); got ${pool.length} ` +
        `choices (${ids.size} unique).`,
    );
  }
  return pool;
}

/**
 * Evaluates a player's guess against the target model.
 */
export function evaluateGuess(guessedModelId: string, targetModelId: string): GuessFeedback {
  const guessed = AI_MODELS.find((m) => m.id === guessedModelId) || AI_MODELS[0];
  const target = AI_MODELS.find((m) => m.id === targetModelId) || AI_MODELS[0];

  const isCorrect = guessed.id === target.id;
  const developerMatch = guessed.developer === target.developer ? 'correct' : 'incorrect';
  const tierMatch = guessed.tier === target.tier ? 'correct' : 'incorrect';

  let yearMatch: 'correct' | 'higher' | 'lower' = 'correct';
  if (guessed.releaseYear < target.releaseYear) yearMatch = 'higher';
  else if (guessed.releaseYear > target.releaseYear) yearMatch = 'lower';

  let contextMatch: 'correct' | 'higher' | 'lower' = 'correct';
  if (guessed.contextSizeNum < target.contextSizeNum) contextMatch = 'higher';
  else if (guessed.contextSizeNum > target.contextSizeNum) contextMatch = 'lower';

  return {
    model: guessed,
    developerMatch,
    tierMatch,
    yearMatch,
    contextMatch,
    isCorrect,
  };
}

export interface DatasetValidationResult {
  isValid: boolean;
  totalChallenges: number;
  totalModels: number;
  errors: string[];
  warnings: string[];
}

/**
 * Robust challenge dataset validation routine.
 * Verifies no missing model IDs, non-empty response strings, no duplicate model IDs within a challenge,
 * and all comparison entries match the challenge prompt.
 */
export function validateChallengeDataset(
  challenges: VerifiedChallenge[] = VERIFIED_CHALLENGE_LIBRARY,
  models: AIModel[] = AI_MODELS,
): DatasetValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const modelIds = new Set(models.map((m) => m.id));
  const challengeIds = new Set<string>();

  challenges.forEach((c, cIdx) => {
    if (!c.id) {
      errors.push(`Challenge at index ${cIdx} has no ID.`);
    } else if (challengeIds.has(c.id)) {
      errors.push(`Duplicate challenge ID: ${c.id}`);
    } else {
      challengeIds.add(c.id);
    }

    if (!c.prompt || c.prompt.trim().length === 0) {
      errors.push(`Challenge ${c.id} has an empty prompt.`);
    }
    if (!c.category) {
      errors.push(`Challenge ${c.id} has no category.`);
    }

    if (!c.targetResponse || c.targetResponse.trim().length === 0) {
      errors.push(`Challenge ${c.id} has an empty targetResponse.`);
    }
    if (!c.targetModelId) {
      errors.push(`Challenge ${c.id} has missing targetModelId.`);
    } else if (!modelIds.has(c.targetModelId)) {
      warnings.push(
        `Challenge ${c.id} targetModelId '${c.targetModelId}' is not defined in AI_MODELS.`,
      );
    }

    const seenModelIdsInChallenge = new Set<string>([c.targetModelId]);
    if (!Array.isArray(c.comparisonResponses) || c.comparisonResponses.length === 0) {
      warnings.push(`Challenge ${c.id} has no comparisonResponses.`);
    } else {
      c.comparisonResponses.forEach((cr, crIdx) => {
        if (!cr.modelId) {
          errors.push(`Challenge ${c.id} comparison #${crIdx} has missing modelId.`);
        } else if (seenModelIdsInChallenge.has(cr.modelId)) {
          errors.push(
            `Challenge ${c.id} has duplicate modelId '${cr.modelId}' in comparison responses.`,
          );
        } else {
          seenModelIdsInChallenge.add(cr.modelId);
        }

        if (!cr.response || cr.response.trim().length === 0) {
          errors.push(`Challenge ${c.id} comparison model '${cr.modelId}' has empty response.`);
        }
        if (!modelIds.has(cr.modelId)) {
          warnings.push(
            `Challenge ${c.id} comparison modelId '${cr.modelId}' is not in AI_MODELS.`,
          );
        }
      });
    }

    const hints = c.difficultyMetadata?.hints || c.hints;
    if (!hints?.stylometryClue) {
      warnings.push(`Challenge ${c.id} is missing a stylometry clue.`);
    }

    const validStatuses = new Set(['verified', 'partially_verified', 'unverified']);
    if (c.verificationStatus && !validStatuses.has(c.verificationStatus)) {
      errors.push(`Challenge ${c.id} has invalid verificationStatus '${c.verificationStatus}'.`);
    }
  });

  const isValid = errors.length === 0;
  return {
    isValid,
    totalChallenges: challenges.length,
    totalModels: models.length,
    errors,
    warnings,
  };
}

// Automatically validate on module initialization in non-production / development
if (typeof window !== 'undefined') {
  const result = validateChallengeDataset();
  if (!result.isValid) {
    console.error('[AIdle Dataset Validation] Errors detected:', result.errors);
  }
}
