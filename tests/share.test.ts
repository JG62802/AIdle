import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {
  CANONICAL_URL,
  getShareData,
  getShareMessage,
  shareAIdle,
  type ShareData,
} from '../src/share';

const abort = () => Object.assign(new Error('cancelled'), {name: 'AbortError'});

test('canonical URL and exact message', () => {
  assert.equal(CANONICAL_URL, 'https://www.aidle.fun/');
  assert.equal(getShareMessage(), 'Think you can identify the AI? Play AIdle: https://www.aidle.fun/');
});

test('share data: url is separate from text (no duplicated link) and is the canonical URL', () => {
  const d = getShareData();
  assert.equal(d.url, 'https://www.aidle.fun/');
  assert.ok(!d.text.includes('http'));
  assert.doesNotMatch(JSON.stringify(d) + getShareMessage(), /vercel\.app|aidle\.app|localhost/i);
});

test('share data contains no score, result or grid content', () => {
  const all = JSON.stringify(getShareData()) + getShareMessage();
  assert.doesNotMatch(all, /score|guess|🟩|🟨|⬛|#\d|mode:/i);
});

test('Web Share API is used when available (exact payload)', async () => {
  const calls: ShareData[] = [];
  let copied = 0;
  const out = await shareAIdle({
    nav: {share: async (d) => void calls.push(d), canShare: () => true},
    copy: async () => (copied++, true),
  });
  assert.equal(out, 'shared');
  assert.deepEqual(calls, [{title: 'AIdle', text: 'Think you can identify the AI? Play AIdle:', url: 'https://www.aidle.fun/'}]);
  assert.equal(copied, 0);
});

test('clipboard fallback when Web Share is unavailable (copies exact message)', async () => {
  const copies: string[] = [];
  for (const nav of [undefined, {}, {share: undefined}]) {
    const out = await shareAIdle({nav, copy: async (t) => (copies.push(t), true)});
    assert.equal(out, 'copied');
  }
  assert.deepEqual(new Set(copies), new Set(['Think you can identify the AI? Play AIdle: https://www.aidle.fun/']));
});

test('falls back to clipboard when canShare rejects the data or throws', async () => {
  for (const canShare of [() => false, () => { throw new Error('boom'); }]) {
    let shared = 0;
    let copied = 0;
    const out = await shareAIdle({
      nav: {share: async () => void shared++, canShare},
      copy: async () => (copied++, true),
    });
    assert.equal(out, 'copied');
    assert.equal(shared, 0);
    assert.equal(copied, 1);
  }
});

test('user dismissing the share sheet is not an error and does not copy', async () => {
  let copied = 0;
  const out = await shareAIdle({
    nav: {share: async () => { throw abort(); }},
    copy: async () => (copied++, true),
  });
  assert.equal(out, 'cancelled');
  assert.equal(copied, 0);
});

test('non-abort share errors fall back to the clipboard', async () => {
  let copied = 0;
  const out = await shareAIdle({
    nav: {share: async () => { throw Object.assign(new Error('x'), {name: 'NotAllowedError'}); }},
    copy: async () => (copied++, true),
  });
  assert.equal(out, 'copied');
  assert.equal(copied, 1);
});

test('reports failure (never throws) when sharing and clipboard both fail', async () => {
  assert.equal(await shareAIdle({nav: undefined, copy: async () => false}), 'failed');
  assert.equal(await shareAIdle({nav: undefined, copy: async () => { throw new Error('denied'); }}), 'failed');
  assert.equal(
    await shareAIdle({nav: {share: async () => { throw new Error('x'); }}, copy: async () => false}),
    'failed',
  );
});

// --- Source inspection (not behavioural): wiring of the two CTAs in App.tsx ---
test('[source inspection] both Share AIdle buttons call handleShareAIdle, results share is separate', () => {
  const app = readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8');
  const btn = (id: string) => app.match(new RegExp(`<button[^>]*onClick=\\{(\\w+)\\}[^>]*data-testid="${id}"`, 's'))?.[1];
  assert.equal(btn('share-aidle-header'), 'handleShareAIdle');
  assert.equal(btn('share-aidle-menu'), 'handleShareAIdle');
  assert.ok(app.includes('onClick={handleShare}'), 'post-game Share Result must remain');
  assert.ok(!app.includes('aidle.app'), 'no non-canonical domain in App.tsx');
  // Scan code only (comments may legitimately mention what NOT to use).
  const stripComments = (src: string) => src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(?<!:)\/\/.*$/gm, '');
  const shareSrc = readFileSync(new URL('../src/share.ts', import.meta.url), 'utf8');
  assert.ok(!/vercel\.app/.test(stripComments(app)), 'deployment URL in App.tsx code');
  assert.ok(!/vercel\.app/.test(stripComments(shareSrc)), 'deployment URL in share.ts code');
  // the scanner itself must catch a real violation, otherwise the check proves nothing
  assert.ok(/vercel\.app/.test(stripComments("const u = 'https://aidle-two.vercel.app/'; // x")));
});
