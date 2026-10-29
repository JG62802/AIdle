/**
 * @fileoverview Barrel export for shared utilities from `./BackgroundMusic`
 * and `./helper`.
 */

export {
  BackgroundMusic,
  createSeamlessLoopBuffer,
  scanAudioBoundaries,
  type AudioBoundaries,
  type BackgroundMusicProps,
  type SeamlessLoopResult,
} from './BackgroundMusic';
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
} from './helper';
