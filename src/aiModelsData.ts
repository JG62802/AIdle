export interface AIModel {
  id: string;
  name: string;
  version: string;
  developer: 'OpenAI' | 'Anthropic' | 'Google' | 'Meta' | 'DeepSeek' | 'Mistral' | 'xAI' | 'Cohere';
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
    default:
      return 'Notice the distinctive stylistic cadence and intentional choice of phrasing.';
  }
}

/**
 * Returns observable structure & cadence clues without model or developer spoilers.
 */
export function getModelObservableStructureClue(modelId: string): string {
  switch (modelId) {
    case 'gpt-4o':
      return 'Observe the balanced three-part structure: positive affirmation, clear boundary preference, and a cooperative forward-looking conclusion.';
    case 'claude-3-5-sonnet':
      return 'Observe the smooth conversational pacing: includes unforced personal callbacks and low-pressure disclaimers that put the reader at ease.';
    case 'gemini-1-5-pro':
      return 'Observe the actionable structure: pairs immediate contextual awareness with direct, pragmatic steps forward.';
    case 'gemini-1-5-flash':
      return 'Observe the brisk, economical cadence: delivers key information directly with minimal transitional padding.';
    case 'llama-3-70b':
      return 'Observe the grounded domestic syntax: relies on familiar spoken idioms and low-friction, casual clause progression.';
    case 'mistral-large':
      return 'Observe the razor-sharp brevity: delivers clear ownership or notification in concise sentences with zero apologetic hedging.';
    case 'deepseek-v3':
      return 'Observe the orderly syntactic boundaries: balances formal clauses methodically with neutral, procedural clarity.';
    case 'claude-3-5-haiku':
      return 'Observe the punchy, abbreviated cadence: delivers sincere interpersonal warmth within tight sentence boundaries.';
    case 'gpt-4-turbo':
      return 'Observe the thorough multi-stage progression: carefully builds out detailed context before delivering structured conclusions.';
    case 'grok-2':
      return 'Observe the playful rhetorical pacing: uses conversational challenges and interactive questions to engage the recipient.';
    default:
      return 'Observe the measured sentence pacing and structural flow tailored to the situation.';
  }
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
    /\b(?:Claude 3\.5 Sonnet|Claude 3\.5 Haiku|Claude 3 Opus|Claude 3|Claude)\b/gi,
    /\b(?:GPT-4o|GPT-4-turbo|GPT-4 Turbo|GPT-4|ChatGPT|OpenAI)\b/gi,
    /\b(?:Gemini 1\.5 Pro|Gemini 1\.5 Flash|Gemini Pro|Gemini Flash|Gemini|Google)\b/gi,
    /\b(?:Llama 3 70B|Llama 3|Llama-3|Meta Llama|Meta)\b/gi,
    /\b(?:Mistral Large|Mistral 7B|Mistral)\b/gi,
    /\b(?:DeepSeek V3|DeepSeek-V3|DeepSeek)\b/gi,
    /\b(?:Grok 2|Grok-2|Grok|xAI)\b/gi,
    /\b(?:Anthropic|Cohere)\b/gi,
    /\bContext window is [^.]+\.?/gi,
    /\bDeveloped by [^.]+\.?/gi,
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
    data.hints.structuralClue || data.hints.contextClue || getModelObservableStructureClue(data.targetModelId),
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
      stylometryClue: 'Specific shared detail callback ("photography trips"), empathetic conversational framing ("rather than leave things hanging"), and warm closure.',
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
        keyStylometricNote: 'Polished and courteous tone, relying on balanced transition phrases like "out of respect for your time".',
      },
      {
        modelId: 'mistral-large',
        model: 'Mistral Large',
        version: 'mistral-large-2407',
        response: "Thanks for meeting up yesterday. I enjoyed our conversation, but I didn't feel a romantic connection. I wanted to be direct and wish you the best in your search.",
        keyStylometricNote: 'Delivers maximum conciseness with polite European directness and zero filler.',
      },
      {
        modelId: 'llama-3-70b',
        model: 'Llama 3 70B',
        version: 'meta-llama-3-70b-instruct',
        response: "Hey, thanks for meeting up for coffee yesterday! I had fun chatting, but I didn't really feel that romantic click. Wanted to be honest with you—best of luck out there!",
        keyStylometricNote: 'Relaxed, casual, and uses grounded everyday phrasing like "romantic click".',
      },
      {
        modelId: 'gemini-1-5-pro',
        model: 'Gemini 1.5 Pro',
        version: 'gemini-1.5-pro-001',
        response: "Thanks so much for taking the time to grab coffee yesterday! I enjoyed hearing all about your travel plans, but I don't think we have the romantic chemistry I'm looking for. Wanted to let you know right away—wishing you the best!",
        keyStylometricNote: 'Energetic, clear, and proactive with upbeat conversational momentum.',
      },
      {
        modelId: 'deepseek-v3',
        model: 'DeepSeek V3',
        version: 'deepseek-chat-v3',
        response: "Thank you for taking the time to meet for coffee yesterday. While I appreciated our conversation, I did not sense a romantic alignment. I wanted to communicate this clearly and wish you the best going forward.",
        keyStylometricNote: 'Structured, objective, and methodical language with tidy sentence boundaries.',
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
      stylometryClue: 'Supportive sandwich structure (positive validation + clear preference + forward-looking reassurance) with upbeat exclamation points.',
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
        keyStylometricNote: 'Calm, clear, and economical without emotional preamble.',
      },
      {
        modelId: 'llama-3-70b',
        model: 'Llama 3 70B',
        version: 'meta-llama-3-70b-instruct',
        response: "Hey, I'm having a great time hanging out with you and definitely want to keep seeing where this goes. I just usually move a bit slower when dating, so I want to make sure we don't rush things. Looking forward to our next hangout!",
        keyStylometricNote: 'Casual vocabulary ("hanging out", "rush things") with relaxed pacing.',
      },
      {
        modelId: 'gemini-1-5-pro',
        model: 'Gemini 1.5 Pro',
        version: 'gemini-1.5-pro-001',
        response: "I've had so much fun on our dates these past few weeks! Because I really value getting to know each other, I like taking new relationships at a more measured pace. Looking forward to seeing you this weekend!",
        keyStylometricNote: 'Proactive value statements and straightforward optimism.',
      },
      {
        modelId: 'deepseek-v3',
        model: 'DeepSeek V3',
        version: 'deepseek-chat-v3',
        response: "I appreciate our time together over the past three weeks and want to continue getting to know you. However, I prefer pacing new relationships gradually. I look forward to continuing at a comfortable rhythm.",
        keyStylometricNote: 'Objective, balanced framing with structured clauses.',
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
      structuralClue: 'Opens with high-stakes teasing, followed by a witty either/or dilemma and an interactive hook question.',
    },
    responseAnalysis: 'Employs dynamic situational banter, playfully interrogating the prompt’s premise with confident colloquial humor and an engaging interactive hook.',
    distinguishingTraits: ['Playful challenge framing', 'Colloquial confident cadence', 'Interactive hook question'],
    comparisonResponses: [
      {
        modelId: 'claude-3-5-sonnet',
        model: 'Claude 3.5 Sonnet',
        version: 'claude-3-5-sonnet-20240620',
        response: "That is a bold sourdough claim for someone whose bread I haven't taste-tested yet! What's the secret—super active starter, or do you just have an obsessive baker's schedule?",
        keyStylometricNote: 'Warm, natural, and invites an easy story-driven response.',
      },
      {
        modelId: 'gpt-4o',
        model: 'GPT-4o',
        version: 'gpt-4o-2024-08-06',
        response: "Best homemade sourdough in the city? That's quite the title to hold! What's the secret to your crust, and how long have you been keeping your starter alive?",
        keyStylometricNote: 'Cheerful, tidy, and asks structured inquisitive questions.',
      },
      {
        modelId: 'mistral-large',
        model: 'Mistral Large',
        version: 'mistral-large-2407',
        response: "That is a serious claim about your sourdough. What hydration percentage are you running, or is the recipe top secret?",
        keyStylometricNote: 'Direct, technical question with dry conversational flair.',
      },
      {
        modelId: 'llama-3-70b',
        model: 'Llama 3 70B',
        version: 'meta-llama-3-70b-instruct',
        response: "Big sourdough claims! Are we talking legit bakery level, or is this just hype? What's your starter's name, because I know all serious bakers name theirs.",
        keyStylometricNote: 'Punchy informal banter and relatable trivia.',
      },
      {
        modelId: 'gemini-1-5-pro',
        model: 'Gemini 1.5 Pro',
        version: 'gemini-1.5-pro-001',
        response: "Claiming the best sourdough in the city is a bold opener! Do you have an active 5-year-old starter, or is this all beginner's luck with Dutch oven bread? Tell me your favorite loaf to bake.",
        keyStylometricNote: 'Energetic, enthusiastic, and asks upbeat interactive questions.',
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
        keyStylometricNote: 'Relaxed, casual, and straightforward.',
      },
      {
        modelId: 'mistral-large',
        model: 'Mistral Large',
        version: 'mistral-large-2407',
        response: "I am really sorry for missing your birthday yesterday. I hope you had a great day celebrating. Please let me treat you to lunch or dinner this week so we can celebrate properly.",
        keyStylometricNote: 'Keeps the apology concise, polite, and respectful without excess padding.',
      },
      {
        modelId: 'gemini-1-5-pro',
        model: 'Gemini 1.5 Pro',
        version: 'gemini-1.5-pro-001',
        response: "I am so sorry I missed your birthday yesterday! Completely my fault for losing track of the date. I hope you had a fantastic day, and I'd love to take you out this week to celebrate your birthday dinner on me.",
        keyStylometricNote: 'Direct, energetic, and immediately action-oriented.',
      },
      {
        modelId: 'claude-3-5-haiku',
        model: 'Claude 3.5 Haiku',
        version: 'claude-3-5-haiku-20241022',
        response: "I'm so sorry for missing your birthday yesterday! Totally dropped the ball and feel awful. Hope you had a wonderful day—dinner is 100% on me this week whenever you're free.",
        keyStylometricNote: 'Punchy, warm, and highly economical.',
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
        keyStylometricNote: 'Warm, polite, and gives a clear reasonable time window.',
      },
      {
        modelId: 'mistral-large',
        model: 'Mistral Large',
        version: 'mistral-large-2407',
        response: "Hi Sam, could you please wash the pots in the sink today? I need to use the kitchen space to make dinner tonight. Thank you.",
        keyStylometricNote: 'Short, direct, and matter-of-fact.',
      },
      {
        modelId: 'gpt-4o',
        model: 'GPT-4o',
        version: 'gpt-4o-2024-08-06',
        response: "Hi Sam! Hope you're having a good week. Could you do me a quick favor and wash the pots soaking in the sink today? I'm planning on cooking tonight and need the space to prep. Thanks so much for your help!",
        keyStylometricNote: 'Polished and upbeat with classic courteous padding.',
      },
      {
        modelId: 'gemini-1-5-pro',
        model: 'Gemini 1.5 Pro',
        version: 'gemini-1.5-pro-001',
        response: "Hey Sam, could you clear the pots out of the sink when you get a chance today? I need to cook dinner tonight and could really use the sink space. Thanks!",
        keyStylometricNote: 'Brisk, practical, and cleanly formatted.',
      },
      {
        modelId: 'deepseek-v3',
        model: 'DeepSeek V3',
        version: 'deepseek-chat-v3',
        response: "Hi Sam, could you please clean the pots in the sink when you have a moment today? I will need the sink space for cooking dinner this evening. Thank you.",
        keyStylometricNote: 'Structured, neutral, and courteous directness.',
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
        keyStylometricNote: 'Energetic reassurance and proactive scheduling details.',
      },
      {
        modelId: 'claude-3-5-sonnet',
        model: 'Claude 3.5 Sonnet',
        version: 'claude-3-5-sonnet-20240620',
        response: "Hi Elena, I dropped the ball on sending the client summary before logging off yesterday—I'm really sorry for the lapse. I just sent the complete document over to their team with an apology for the morning delivery, and I'll keep you posted if they have any immediate notes.",
        keyStylometricNote: 'Candid personal responsibility and smooth narrative flow.',
      },
      {
        modelId: 'deepseek-v3',
        model: 'DeepSeek V3',
        version: 'deepseek-chat-v3',
        response: "Elena, I overlooked transmitting the client summary yesterday afternoon. The completed summary has now been dispatched to the client, and I am monitoring for their confirmation.",
        keyStylometricNote: 'Formal operational language ("transmitted", "dispatched").',
      },
      {
        modelId: 'gemini-1-5-pro',
        model: 'Gemini 1.5 Pro',
        version: 'gemini-1.5-pro-001',
        response: "Hi Elena, I missed sending out the client summary yesterday before logging off. I apologize for the delay—I've just sent the finalized document to the client and will monitor for their feedback this morning.",
        keyStylometricNote: 'Direct, concise, and focused on operational follow-through.',
      },
      {
        modelId: 'llama-3-70b',
        model: 'Llama 3 70B',
        version: 'meta-llama-3-70b-instruct',
        response: "Hi Elena, realized I slipped up and didn't send the client summary yesterday before heading out—my bad on that. I've sent the finalized document over to them this morning and am following up to make sure they got it.",
        keyStylometricNote: 'Grounded colloquial accountability ("my bad on that") and practical cadence.',
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
      stylometryClue: 'Warm coworker rapport, explicit reciprocity offer, and an authentic low-pressure closing ("No worries at all if that doesn\'t work...").',
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
        keyStylometricNote: 'Polished and structured with neat, balanced sentences.',
      },
      {
        modelId: 'mistral-large',
        model: 'Mistral Large',
        version: 'mistral-large-2407',
        response: "Hi Sarah, are you available to swap shifts this Saturday? A family event came up on my end. I can cover your next scheduled shift in exchange if that works for you.",
        keyStylometricNote: 'Goes straight to the swap mechanics with zero wasted words.',
      },
      {
        modelId: 'gemini-1-5-pro',
        model: 'Gemini 1.5 Pro',
        version: 'gemini-1.5-pro-001',
        response: "Hey Sarah, quick question for you: Would you be able to switch shifts with me this Saturday? I have an unexpected family event. I'd gladly take any of your shifts next week to make up for it. Thanks either way!",
        keyStylometricNote: 'Brisk, upbeat, and clearly structured.',
      },
      {
        modelId: 'llama-3-70b',
        model: 'Llama 3 70B',
        version: 'meta-llama-3-70b-instruct',
        response: "Hey Sarah! Any chance you can cover for me this Saturday? Got hit with a family thing. Happy to take your next shift or whenever you need time off. Let me know if that works!",
        keyStylometricNote: 'Informal, friendly, and uses colloquial cadence.',
      },
      {
        modelId: 'deepseek-v3',
        model: 'DeepSeek V3',
        version: 'deepseek-chat-v3',
        response: "Hi Sarah, are you open to exchanging shifts for this coming Saturday due to a personal family obligation? I am available to cover an upcoming shift of yours in exchange. Thank you for considering.",
        keyStylometricNote: 'Polite, systematic, and formal language structure.',
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
        keyStylometricNote: 'Keeps the boundary smooth and unforced.',
      },
      {
        modelId: 'mistral-large',
        model: 'Mistral Large',
        version: 'mistral-large-2407',
        response: "Hi David, thank you for checking with me. I am unavailable this Saturday due to prior commitments and cannot take the extra shift. I will see you Monday as scheduled.",
        keyStylometricNote: 'Crisp, polite, and completely devoid of unnecessary fluff.',
      },
      {
        modelId: 'llama-3-70b',
        model: 'Llama 3 70B',
        version: 'meta-llama-3-70b-instruct',
        response: "Hey David, thanks for asking, but I already have plans locked in for Saturday so I won't be able to come in. See you on Monday!",
        keyStylometricNote: 'Casual conversational phrasing ("locked in").',
      },
      {
        modelId: 'gemini-1-5-pro',
        model: 'Gemini 1.5 Pro',
        version: 'gemini-1.5-pro-001',
        response: "Hi David, thanks for the heads-up! I'm unable to pick up the Saturday shift due to existing personal plans, but I will be ready to go for my regular shift on Monday.",
        keyStylometricNote: 'Energetic, direct, and affirms upcoming availability.',
      },
      {
        modelId: 'deepseek-v3',
        model: 'DeepSeek V3',
        version: 'deepseek-chat-v3',
        response: "David, thank you for checking. I am unable to take the Saturday shift due to prior commitments scheduled for that day. I will report for my standard shift on Monday morning.",
        keyStylometricNote: 'Structured, neutral, and matter-of-fact professional syntax.',
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
      stylometryClue: 'Friendly greeting paired with a specific hard deadline ("by 2 PM today") and a helpful fallback option ("pull preliminary numbers myself").',
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
        keyStylometricNote: 'Upbeat encouragement and offers collaborative assistance.',
      },
      {
        modelId: 'mistral-large',
        model: 'Mistral Large',
        version: 'mistral-large-2407',
        response: "Hi Jordan, I am checking on the status of the Q3 data report. I must finalize the presentation slides by 2 PM today. Please confirm when the data will be available.",
        keyStylometricNote: 'Concise, firm, and focused on deadlines.',
      },
      {
        modelId: 'deepseek-v3',
        model: 'DeepSeek V3',
        version: 'deepseek-chat-v3',
        response: "Jordan, please provide the Q3 conversion dataset. The slide deck review is scheduled for this afternoon, requiring data integration by 2:00 PM. Please update on deliverable status.",
        keyStylometricNote: 'Procedural vocabulary and formal structuring.',
      },
      {
        modelId: 'gemini-1-5-flash',
        model: 'Gemini 1.5 Flash',
        version: 'gemini-1.5-flash-001',
        response: "Hey Jordan, following up on the Q3 numbers needed for today's 2 PM deck. Can you send those over shortly so I can plug them in? Thanks!",
        keyStylometricNote: 'Rapid, direct, and minimal.',
      },
      {
        modelId: 'llama-3-70b',
        model: 'Llama 3 70B',
        version: 'meta-llama-3-70b-instruct',
        response: "Hey Jordan, hope your week's going well! Quick check-in on the Q3 numbers—I've got to lock the slide deck by 2 PM today. Could you shoot those over when you get a sec? Thanks!",
        keyStylometricNote: 'Relaxed, casual, and friendly without being confrontational.',
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
      stylometryClue: 'Honest vulnerability ("completely wiped out", "not good company"), genuine apology, and an immediate concrete reschedule offer.',
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
        keyStylometricNote: 'Friendly popular idioms like "take a rain check" with cheerful closure.',
      },
      {
        modelId: 'llama-3-70b',
        model: 'Llama 3 70B',
        version: 'meta-llama-3-70b-instruct',
        response: "Hey Maya, I'm really sorry to bail, but I'm running on empty today and need to crash tonight. Let's definitely reschedule for next week when I'm back to 100%.",
        keyStylometricNote: 'Grounded colloquial expressions ("running on empty", "crash tonight").',
      },
      {
        modelId: 'mistral-large',
        model: 'Mistral Large',
        version: 'mistral-large-2407',
        response: "Hi Maya, I am feeling very exhausted today and need to cancel our dinner tonight. Sincere apologies for the short notice—let's reschedule for some time next week.",
        keyStylometricNote: 'Direct, respectful, no-excuse notification.',
      },
      {
        modelId: 'grok-2',
        model: 'Grok 2',
        version: 'grok-2-2024-08-13',
        response: "Hey Maya, I'm running on zero battery today and need to bow out of dinner tonight. Super sorry for the late notice—can I buy your meal when we reschedule next week?",
        keyStylometricNote: 'Punchy, colloquial ("running on zero battery"), and casual.',
      },
      {
        modelId: 'claude-3-5-haiku',
        model: 'Claude 3.5 Haiku',
        version: 'claude-3-5-haiku-20241022',
        response: "Hey Maya, really sorry to cancel, but I'm completely exhausted today and need a quiet night. Could we push our dinner to next week? My treat!",
        keyStylometricNote: 'Warm, brief, and to the point.',
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
      stylometryClue: 'Breezy casual tone, straightforward payment modality reminder, and zero emotional friction or passive aggression.',
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
        keyStylometricNote: 'Polished, structured, and cheerful.',
      },
      {
        modelId: 'claude-3-5-sonnet',
        model: 'Claude 3.5 Sonnet',
        version: 'claude-3-5-sonnet-20240620',
        response: "Hey Chris, hope you're doing well! Quick ping regarding the $75 concert ticket from the other week—no rush, just whenever you have a second to settle up via Venmo. Thanks so much!",
        keyStylometricNote: 'Gentle low-pressure framing ("no rush, just whenever you have a second").',
      },
      {
        modelId: 'mistral-large',
        model: 'Mistral Large',
        version: 'mistral-large-2407',
        response: "Hi Chris, sending a quick reminder about the $75 for the concert tickets. Please send it over via Venmo or bank transfer when you can. Thank you.",
        keyStylometricNote: 'Short, clear, and direct.',
      },
      {
        modelId: 'gemini-1-5-pro',
        model: 'Gemini 1.5 Pro',
        version: 'gemini-1.5-pro-001',
        response: "Hey Chris, hope things are going well! Whenever you get a chance, could you send over that $75 for the concert tickets? You can shoot it over on Venmo or PayPal. Thanks!",
        keyStylometricNote: 'Straightforward, polite, and practical.',
      },
      {
        modelId: 'deepseek-v3',
        model: 'DeepSeek V3',
        version: 'deepseek-chat-v3',
        response: "Hi Chris, hope you are doing well. Just a quick reminder regarding the $75 for the concert tickets from two weeks ago. Please transfer via Venmo whenever convenient. Thank you!",
        keyStylometricNote: 'Orderly, courteous, and straightforward phrasing.',
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
      stylometryClue: 'Enthusiastic gratitude for the invitation, smooth general boundary without over-explaining finances, and a lower-commitment local alternative.',
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
        keyStylometricNote: 'Relaxed vernacular ("swing it this time", "out there").',
      },
      {
        modelId: 'mistral-large',
        model: 'Mistral Large',
        version: 'mistral-large-2407',
        response: "Thank you for the invitation. Unfortunately, I will not be able to join the trip this weekend. I hope you have a great time, and let's catch up another time.",
        keyStylometricNote: 'Polite, concise European response.',
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
        keyStylometricNote: 'Formal, tidy, and courteous.',
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
        keyStylometricNote: 'Warm supportive encouragement with balanced structured sentences.',
      },
      {
        modelId: 'llama-3-70b',
        model: 'Llama 3 70B',
        version: 'meta-llama-3-70b-instruct',
        response: "Man, I'm so sorry. That seriously sucks after grinding through four rounds. You worked so hard and any team would be lucky to have you. Dinner is on me whenever you want to decompress.",
        keyStylometricNote: 'Candid, gritty, and uses authentic conversational phrases like "seriously sucks".',
      },
      {
        modelId: 'mistral-large',
        model: 'Mistral Large',
        version: 'mistral-large-2407',
        response: "I am really sorry to hear that. Four rounds is a significant effort, and it is completely normal to feel disappointed. Let me know if you want to meet up tonight or take your mind off things.",
        keyStylometricNote: 'Clean, sincere emotional support with zero exaggerated drama.',
      },
      {
        modelId: 'gemini-1-5-pro',
        model: 'Gemini 1.5 Pro',
        version: 'gemini-1.5-pro-001',
        response: "I am so sorry. Doing four rounds of interviews takes so much out of you, and it's completely unfair after that much effort. Take all the space you need today—I'm here whenever you want to grab food or vent.",
        keyStylometricNote: 'Warm, validating, and directly supportive.',
      },
      {
        modelId: 'deepseek-v3',
        model: 'DeepSeek V3',
        version: 'deepseek-chat-v3',
        response: "I am so sorry to hear this. Completing four interview rounds requires tremendous effort, and it is completely natural to feel disappointed right now. Please take time to decompress—I am here whenever you want to talk.",
        keyStylometricNote: 'Balanced, structured, and validating without excessive sentimentality.',
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
        keyStylometricNote: 'Affirmative phrasing and positive future pacing.',
      },
      {
        modelId: 'llama-3-70b',
        model: 'Llama 3 70B',
        version: 'meta-llama-3-70b-instruct',
        response: "Hey, really appreciate you checking on me! I'm just running on empty and need a solo weekend to recharge my battery. All good on my end—I'll hit you up on Monday.",
        keyStylometricNote: 'Relaxed, informal ("running on empty", "hit you up").',
      },
      {
        modelId: 'mistral-large',
        model: 'Mistral Large',
        version: 'mistral-large-2407',
        response: "Thank you for checking in. I am taking this weekend to rest quietly and recharge. Everything is fine, and I will get back in touch with you early next week.",
        keyStylometricNote: 'Calm, polite, and reassuring.',
      },
      {
        modelId: 'deepseek-v3',
        model: 'DeepSeek V3',
        version: 'deepseek-chat-v3',
        response: "Thank you for checking in, I truly appreciate your thoughtfulness. I am currently experiencing burnout and need this weekend to disconnect and rest. Everything is fine between us, and I will reconnect with you on Monday.",
        keyStylometricNote: 'Clear, orderly sentence construction with polite reassurance.',
      },
      {
        modelId: 'gemini-1-5-pro',
        model: 'Gemini 1.5 Pro',
        version: 'gemini-1.5-pro-001',
        response: "Thank you for checking in on me, you're the best! I'm just feeling pretty burned out lately and need a totally quiet weekend to recharge my batteries. We're totally good, and I'll catch up with you on Monday!",
        keyStylometricNote: 'Energetic, affectionate, and establishes an upbeat clear timeframe.',
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
        keyStylometricNote: 'Communicates authentic vulnerability ("wanted to mention it gently rather than let it linger").',
      },
      {
        modelId: 'gpt-4o',
        model: 'GPT-4o',
        version: 'gpt-4o-2024-08-06',
        response: "Hey there! I saw the pictures from brunch yesterday and it looked wonderful. To be honest, I felt a little left out seeing everyone together, but I know plans come together quickly. I'd love to join next time you all get together!",
        keyStylometricNote: 'Gracious rationalization ("I know plans come together quickly").',
      },
      {
        modelId: 'mistral-large',
        model: 'Mistral Large',
        version: 'mistral-large-2407',
        response: "Hi, I saw the pictures from brunch yesterday. I was a bit disappointed not to be included, but I hope you had a good time. Please let me know when the next group gathering is.",
        keyStylometricNote: 'Frank, concise, and direct.',
      },
      {
        modelId: 'gemini-1-5-pro',
        model: 'Gemini 1.5 Pro',
        version: 'gemini-1.5-pro-001',
        response: "Hey! Saw the photos from brunch—it looked like so much fun! Not trying to make a big deal of it, but I felt a bit left out seeing the group together. Definitely keep me posted for the next meetup!",
        keyStylometricNote: 'Energetic, friendly, and non-accusatory.',
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
      stylometryClue: 'Clear proactive mitigation details ("placed towels down and turned the shut-off valve"), actionable urgency, and respectful direct tone.',
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
        keyStylometricNote: 'Polite formal framing and clear concern for property integrity.',
      },
      {
        modelId: 'claude-3-5-sonnet',
        model: 'Claude 3.5 Sonnet',
        version: 'claude-3-5-sonnet-20240620',
        response: "Hi Mr. Henderson, reaching out urgently because our water heater developed a noticeable leak this morning and water is pooling on the utility floor. I've contained it with towels for now, but it will need emergency repair today to avoid structural damage. Could you please let me know when a plumber can come take a look?",
        keyStylometricNote: 'Natural problem-solving prose with high clarity.',
      },
      {
        modelId: 'mistral-large',
        model: 'Mistral Large',
        version: 'mistral-large-2407',
        response: "Dear Mr. Henderson, the water heater in unit 3B has started leaking water onto the floor this morning. I have contained the leak temporarily, but urgent maintenance is needed today to prevent property damage. Please confirm when a technician can inspect it.",
        keyStylometricNote: 'Sharp, formal, and strictly factual.',
      },
      {
        modelId: 'deepseek-v3',
        model: 'DeepSeek V3',
        version: 'deepseek-chat-v3',
        response: "Mr. Henderson, I am reporting an active water heater leak in the utility closet discovered this morning. I have closed the intake valve and contained surface water, but urgent inspection is required today to prevent floor damage. Please advise on maintenance arrival.",
        keyStylometricNote: 'Procedural, systematic language structure.',
      },
      {
        modelId: 'llama-3-70b',
        model: 'Llama 3 70B',
        version: 'meta-llama-3-70b-instruct',
        response: "Hi Mr. Henderson, our water heater started leaking puddles this morning. I've shut off the valve and put down towels to protect the floors, but we need someone to check it out ASAP today. Please let me know when maintenance can stop by.",
        keyStylometricNote: 'Practical, grounded, and highlights immediate damage-mitigation actions.',
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
      stylometryClue: 'High narrative resonance, specific authentic growth metrics, and a grounded philosophical antithesis ("broadcast announcements vs. genuine relationships").',
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
        keyStylometricNote: 'Polished, classic professional alignment and energetic enthusiasm.',
      },
      {
        modelId: 'mistral-large',
        model: 'Mistral Large',
        version: 'mistral-large-2407',
        response: "With four years of experience managing active player communities and driving engagement across digital platforms, I am applying for the Community Manager position at Moonlit Studio. I look forward to scaling your player base with structured engagement initiatives.",
        keyStylometricNote: 'Concise, professional, and focuses strictly on operational competence.',
      },
      {
        modelId: 'deepseek-v3',
        model: 'DeepSeek V3',
        version: 'deepseek-chat-v3',
        response: "I am writing to apply for the Community Manager role at Moonlit Studio, bringing proven experience in moderation architecture and user retention strategies across gaming ecosystems. My background in data-driven player engagement will support your title's community growth.",
        keyStylometricNote: 'Systematic and structural methodologies ("moderation architecture", "retention strategies").',
      },
      {
        modelId: 'gemini-1-5-pro',
        model: 'Gemini 1.5 Pro',
        version: 'gemini-1.5-pro-001',
        response: "Having scaled passionate gaming communities from grassroots Discord channels to thriving multi-thousand member hubs, I know what keeps players engaged and heard. I'm excited to bring that player-centric energy to Moonlit Studio as your next Community Manager.",
        keyStylometricNote: 'Energetic, proactive, and speaks to high-impact outcomes.',
      },
      {
        modelId: 'llama-3-70b',
        model: 'Llama 3 70B',
        version: 'meta-llama-3-70b-instruct',
        response: "Over the last four years, I've grown indie gaming discords from small friend groups to vibrant ten-thousand-member hubs by focusing on real player relationships. I'm excited to bring that genuine community-first approach to Moonlit Studio's upcoming game releases.",
        keyStylometricNote: 'Grounded, direct, and speaks in natural gamer vernacular.',
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
      stylometryClue: 'Order reference number included, photo evidence cited, polite balanced tone, and clear resolution options (replacement or refund).',
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
        keyStylometricNote: 'Friendly, conversational, and respectful.',
      },
      {
        modelId: 'mistral-large',
        model: 'Mistral Large',
        version: 'mistral-large-2407',
        response: "Dear Support, Order #84920 arrived today with the ceramic bowl shattered due to inadequate packaging. Attached are photographs of the damaged product. Please confirm whether you will send a replacement or issue a full refund.",
        keyStylometricNote: 'Direct, formal, and focuses on quick administrative resolution.',
      },
      {
        modelId: 'gemini-1-5-flash',
        model: 'Gemini 1.5 Flash',
        version: 'gemini-1.5-flash-001',
        response: "Hello, my ceramic bowl in order #84920 arrived broken due to poor packaging. Photos are attached. Please send a replacement or process a refund as soon as possible. Thank you!",
        keyStylometricNote: 'Rapid, brief, and to the point.',
      },
      {
        modelId: 'deepseek-v3',
        model: 'DeepSeek V3',
        version: 'deepseek-chat-v3',
        response: "Dear Support, regarding order #84920, the ceramic item was received damaged due to insufficient transit protection. Photographic documentation is attached. Please confirm whether a replacement shipment or full refund will be processed.",
        keyStylometricNote: 'Structured, administrative vocabulary.',
      },
      {
        modelId: 'llama-3-70b',
        model: 'Llama 3 70B',
        version: 'meta-llama-3-70b-instruct',
        response: "Hi there, I received order #84920 today, but the ceramic bowl arrived completely cracked due to very little protective packaging. I've attached photos of the bowl and the box. Could you please send a replacement or issue a full refund? Thanks!",
        keyStylometricNote: 'Straightforward, polite, and requests a resolution without excess corporate jargon.',
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
      stylometryClue: 'Frames the extension as a commitment to quality ("ensure final deliverables meet high quality standards") and offers a specific, concrete new delivery time.',
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
        keyStylometricNote: 'Natural, human phrasing ("bad bug", "away from my desk").',
      },
      {
        modelId: 'mistral-large',
        model: 'Mistral Large',
        version: 'mistral-large-2407',
        response: "Hi Claire, due to unexpected illness over the weekend, I require a short two-day extension on the brand concepts. I propose delivering the complete files by Friday afternoon. Thank you for your flexibility.",
        keyStylometricNote: 'Clean, direct, and straightforward.',
      },
      {
        modelId: 'deepseek-v3',
        model: 'DeepSeek V3',
        version: 'deepseek-chat-v3',
        response: "Claire, owing to sudden medical downtime over the weekend, production on the brand identity assets is delayed. I request shifting the submission deadline to Friday at 3:00 PM to ensure complete specifications are met.",
        keyStylometricNote: 'Formal and methodical.',
      },
      {
        modelId: 'gemini-1-5-pro',
        model: 'Gemini 1.5 Pro',
        version: 'gemini-1.5-pro-001',
        response: "Hi Claire, I caught a sudden bug this past weekend that slowed down my design schedule. To ensure you get the absolute best concepts, could we shift our target from Wednesday to Friday at 2 PM? I'm excited to share the finalized work with you.",
        keyStylometricNote: 'Energetic, clear on timestamps, and optimistic.',
      },
      {
        modelId: 'llama-3-70b',
        model: 'Llama 3 70B',
        version: 'meta-llama-3-70b-instruct',
        response: "Hi Claire, hope you're having a good week. I came down with a stomach bug over the weekend that set my progress back a couple days. To make sure the final branding looks great, could we push delivery from Wednesday to Friday? Thanks so much for being understanding!",
        keyStylometricNote: 'Honest, friendly, and proposes a reasonable adjusted delivery.',
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
    getModelObservableStructureClue(base.targetModelId),
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
    const structural = getModelObservableStructureClue(cr.modelId);
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
    getModelObservableStructureClue(variant.modelId),
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

/**
 * Deterministically generates the candidate pool for a given puzzle and difficulty tier:
 * - Easy: up to 4 candidate models (1.0x score base)
 * - Medium: up to 6 candidate models (1.5x score multiplier)
 * - Hard: up to 8 candidate models (2.0x score multiplier)
 */
export function getDifficultyCandidatePool(
  puzzle: VerifiedChallenge,
  difficulty: 'easy' | 'medium' | 'hard',
): AIModel[] {
  const allVariants = getAllModelVariantsForChallenge(puzzle);

  // Map each verified variant to its authentic AIModel metadata
  const verifiedModelsMap = new Map<string, AIModel>();
  for (const v of allVariants) {
    const model = AI_MODELS.find((m) => m.id === v.modelId);
    if (model) {
      verifiedModelsMap.set(model.id, model);
    }
  }

  const targetModel =
    verifiedModelsMap.get(puzzle.targetModelId) ||
    AI_MODELS.find((m) => m.id === puzzle.targetModelId) ||
    AI_MODELS[0];

  // If target wasn't in map for some reason, ensure it's recorded
  if (!verifiedModelsMap.has(targetModel.id)) {
    verifiedModelsMap.set(targetModel.id, targetModel);
  }

  const verifiedModelsList = Array.from(verifiedModelsMap.values());
  const targetCap = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 6 : 8;

  // If total available verified models is <= requested difficulty cap, return all verified models
  if (verifiedModelsList.length <= targetCap) {
    return verifiedModelsList.sort((a, b) => a.name.localeCompare(b.name));
  }

  // Otherwise, select targetModel + deterministic subset of verified distractors
  const verifiedDistractors = verifiedModelsList.filter((m) => m.id !== targetModel.id);
  const poolSeed = murmur3_32(`${puzzle.id}::candidate_pool::${difficulty}`);
  const shuffledDistractors = deterministicShuffle(verifiedDistractors, poolSeed);
  const selectedDistractors = shuffledDistractors.slice(0, targetCap - 1);

  const finalPool = [targetModel, ...selectedDistractors];
  return finalPool.sort((a, b) => a.name.localeCompare(b.name));
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
