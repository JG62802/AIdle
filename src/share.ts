/**
 * General-purpose "Share AIdle" behaviour.
 *
 * This module is intentionally free of React and DOM imports so it can be unit tested.
 * It never touches a player's score, guesses or results: it only invites people to play.
 */

/** The one canonical production URL. Never use a *.vercel.app deployment URL for sharing. */
export const CANONICAL_URL = 'https://www.aidle.fun/';

export const SHARE_TITLE = 'AIdle';
export const SHARE_INTRO = 'Think you can identify the AI? Play AIdle:';

export interface ShareData {
  title: string;
  text: string;
  url: string;
}

/**
 * Data handed to the Web Share API. `text` deliberately does NOT contain the URL, because
 * share targets combine `text` and `url` themselves and would otherwise show the link twice.
 */
export function getShareData(): ShareData {
  return {title: SHARE_TITLE, text: SHARE_INTRO, url: CANONICAL_URL};
}

/** Plain-text message used for the clipboard fallback (intro and URL together). */
export function getShareMessage(): string {
  return `${SHARE_INTRO} ${CANONICAL_URL}`;
}

/**
 * 'shared'    the Web Share API completed
 * 'copied'    the link was copied to the clipboard (fallback)
 * 'cancelled' the user dismissed the share sheet; nothing else is done
 * 'failed'    neither sharing nor copying worked; the caller should show the URL
 */
export type ShareOutcome = 'shared' | 'copied' | 'cancelled' | 'failed';

export interface NavigatorShareLike {
  share?: (data: ShareData) => Promise<void>;
  canShare?: (data: ShareData) => boolean;
}

export interface ShareDeps {
  /** Usually `navigator`. Pass undefined where no navigator exists. */
  nav?: NavigatorShareLike;
  /** Copies text to the clipboard and reports whether it succeeded. */
  copy: (text: string) => Promise<boolean>;
}

function isAbortError(err: unknown): boolean {
  return (
    typeof err === 'object' && err !== null && (err as {name?: string}).name === 'AbortError'
  );
}

export async function shareAIdle(deps: ShareDeps): Promise<ShareOutcome> {
  const data = getShareData();
  const nav = deps.nav;

  if (nav && typeof nav.share === 'function') {
    let supported = true;
    try {
      if (typeof nav.canShare === 'function') supported = nav.canShare(data);
    } catch {
      supported = false;
    }
    if (supported) {
      try {
        await nav.share(data);
        return 'shared';
      } catch (err) {
        // Closing the share sheet is a normal user action, not a failure: do not copy.
        if (isAbortError(err)) return 'cancelled';
        // Any other error (e.g. permission, unsupported target): fall back to the clipboard.
      }
    }
  }

  try {
    return (await deps.copy(getShareMessage())) ? 'copied' : 'failed';
  } catch {
    return 'failed';
  }
}
