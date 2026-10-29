import {SpriteConfig} from './utils/helper';

/**
 * Configuration for AIdle (Editorial / Wordle Edition).
 */
export const CONFIG = {
  // Core game initialization values
  title: {
    value: 'AIdle',
    type: 'string',
    label: 'Game Title',
    group: 'GAME',
  },
  baseCanvasWidth: {
    value: 1376,
    type: 'number',
    label: 'Base Canvas Width',
    group: 'GAME',
  },
  baseCanvasHeight: {
    value: 768,
    type: 'number',
    label: 'Base Canvas Height',
    group: 'GAME',
  },

  // System Constants
  targetFPS: {
    value: 60,
    type: 'number',
    label: 'Target FPS',
    group: 'SYSTEM',
  },
  stepMs: {
    value: 1000 / 60,
    type: 'number',
    label: 'Step MS',
    group: 'SYSTEM',
  },
  maxSubSteps: {
    value: 5,
    type: 'number',
    label: 'Max Sub Steps',
    group: 'SYSTEM',
  },

  // Thematic Styling - Sleek Editorial / NYT Games Warm Palette
  backgroundColor: {
    value: '#F8F7F3', // Warm off-white
    type: 'color',
    label: 'Page Background',
    group: 'THEME',
  },
  primaryColor: {
    value: '#242424', // Near-black charcoal
    type: 'color',
    label: 'Primary Text',
    group: 'THEME',
  },
  accentColor: {
    value: '#477A60', // Muted forest green
    type: 'color',
    label: 'Primary Accent',
    group: 'THEME',
  },
  borderColor: {
    value: '#E5E3DE', // Subtle divider gray
    type: 'color',
    label: 'Border Color',
    group: 'THEME',
  },
  fontFamily: {
    value: '"Newsreader", "Georgia", "Merriweather", "Playfair Display", serif',
    type: 'string',
    label: 'Font Family Serif',
    group: 'THEME',
  },

  // Audio Levels
  defaultMusicVolume: {
    value: 0.3,
    type: 'number',
    label: 'Default Music Volume',
    group: 'AUDIO',
  },
  defaultSfxVolume: {
    value: 0.5,
    type: 'number',
    label: 'Default SFX Volume',
    group: 'AUDIO',
  },

  // Game Rules & Difficulty Tuning
  maxGuesses: {
    value: 5,
    type: 'number',
    label: 'Max Guesses Allowed',
    group: 'Rules',
  },
  easyBaseScore: {
    value: 500,
    type: 'number',
    label: 'Easy Base Score',
    group: 'Rules',
  },
  mediumBaseScore: {
    value: 1000,
    type: 'number',
    label: 'Medium Base Score',
    group: 'Rules',
  },
  hardBaseScore: {
    value: 1500,
    type: 'number',
    label: 'Hard Base Score',
    group: 'Rules',
  },
  timeBonusLimitSec: {
    value: 30,
    type: 'number',
    label: 'Time Bonus Limit (Sec)',
    group: 'Rules',
  },
  wrongGuessPenaltyPct: {
    value: 20,
    type: 'number',
    label: 'Wrong Guess Penalty (%)',
    group: 'Rules',
  },

  // Assets metadata preservation
  assetLogoAspectRatio: {
    value: 573 / 528,
    type: 'number',
    label: 'Logo Aspect Ratio',
    group: 'ASSETS',
  },
  assetLogoWidth: {
    value: 573,
    type: 'number',
    label: 'Logo Width',
    group: 'ASSETS',
  },
  assetLogoHeight: {
    value: 528,
    type: 'number',
    label: 'Logo Height',
    group: 'ASSETS',
  },

  assetTrophyAspectRatio: {
    value: 500 / 697,
    type: 'number',
    label: 'Trophy Aspect Ratio',
    group: 'ASSETS',
  },
  assetTrophyWidth: {
    value: 500,
    type: 'number',
    label: 'Trophy Width',
    group: 'ASSETS',
  },
  assetTrophyHeight: {
    value: 697,
    type: 'number',
    label: 'Trophy Height',
    group: 'ASSETS',
  },

  assetChipAspectRatio: {
    value: 604 / 585,
    type: 'number',
    label: 'Chip Aspect Ratio',
    group: 'ASSETS',
  },
  assetChipWidth: {
    value: 604,
    type: 'number',
    label: 'Chip Width',
    group: 'ASSETS',
  },
  assetChipHeight: {
    value: 585,
    type: 'number',
    label: 'Chip Height',
    group: 'ASSETS',
  },

  assetBgGridAspectRatio: {
    value: 1376 / 768,
    type: 'number',
    label: 'Neural Grid Aspect Ratio',
    group: 'ASSETS',
  },
  assetBgGridWidth: {
    value: 1376,
    type: 'number',
    label: 'Neural Grid Width',
    group: 'ASSETS',
  },
  assetBgGridHeight: {
    value: 768,
    type: 'number',
    label: 'Neural Grid Height',
    group: 'ASSETS',
  },

  assetFlameAspectRatio: {
    value: 358 / 532,
    type: 'number',
    label: 'Flame Aspect Ratio',
    group: 'ASSETS',
  },
  assetFlameWidth: {
    value: 358,
    type: 'number',
    label: 'Flame Width',
    group: 'ASSETS',
  },
  assetFlameHeight: {
    value: 532,
    type: 'number',
    label: 'Flame Height',
    group: 'ASSETS',
  },
};

/**
 * Type helper for reading values in game code
 */
export type ConfigKey = keyof typeof CONFIG;

/**
 * Gets a configuration value by key.
 * @param key The configuration key.
 * @return The configuration value.
 */
export function getConfig<K extends ConfigKey>(
  key: K,
): (typeof CONFIG)[K]['value'] {
  return CONFIG[key].value;
}

export const THEME = {
  // Editorial / Wordle NYT Palette
  bg: '#F8F7F3',
  cardBg: '#FFFFFF',
  cardHover: '#FAFAF8',
  textPrimary: '#242424',
  textSecondary: '#6B6966',
  textMuted: '#9B9994',
  border: '#E5E3DE',
  borderDark: '#CCC8C0',
  
  // Accents
  accentGreen: '#477A60',
  accentGreenLight: '#EDF5F0',
  accentGreenDark: '#36604A',
  accentRed: '#B85C54',
  accentRedLight: '#FBF1F0',
  accentYellow: '#C28B38',
  accentYellowLight: '#FDF7EB',
  accentBlue: '#4A6FA5',
  accentBlueLight: '#EFF4FB',

  // Status mapping
  correct: '#477A60',
  incorrect: '#B85C54',
  partial: '#C28B38',
};
