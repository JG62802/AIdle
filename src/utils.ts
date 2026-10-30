/**
 * @fileoverview Shared utility functions (re-exports from `./utils/helper` and
 * `./utils/BackgroundMusic`, plus common math and random number helpers).
 */

export {
  BackgroundMusic,
  createSeamlessLoopBuffer,
  scanAudioBoundaries,
  type AudioBoundaries,
  type BackgroundMusicProps,
  type SeamlessLoopResult,
} from './utils/BackgroundMusic';
export {
  MenuOverlay,
  Overlay,
  clamp,
  createFixedStepper,
  drawAsset,
  drawBackground,
  formatTime,
  gameAudio,
  prepareCanvas,
  shuffle,
  useAssets,
  useAutoFocus,
  useInput,
  useIsMobile,
  type Entity,
  type GamePhase,
  type GameState,
  type InputAction,
  type InputSnapshot,
  type MenuOverlayProps,
  type MusicTrack,
  type PointerState,
  type Position,
  type SpriteConfig,
} from './utils/helper';

/** Degrees to radians. */
export function degToRad(deg: number): number {
  return deg * (Math.PI / 180);
}

/** Radians to degrees. */
export function radToDeg(rad: number): number {
  return rad * (180 / Math.PI);
}

/** Random float in [min, max). */
export function randomRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

/** Random integer in [min, max] (inclusive). */
export function randomInt(min: number, max: number): number {
  return Math.floor(randomRange(min, max + 1));
}

/**
 * Seeded PRNG (mulberry32) for deterministic procedural generation.
 * Returns a function that produces floats in [0, 1) on each call.
 */
export function createSeededRandom(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
