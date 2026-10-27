// End-to-end smoke test of the web app in headless Chromium.
// Usage: node tests/smoke.cjs [screenshotDir]
const { chromium } = require('playwright');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const webRoot = path.join(__dirname, '..', 'web');
const shotDir = process.argv[2];
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json', '.json': 'application/json' };

function serve() {
  const server = http.createServer((req, res) => {
    const rel = decodeURIComponent(new URL(req.url, 'http://x').pathname).replace(/^\/+/, '') || 'index.html';
    const file = path.join(webRoot, rel);
    if (!file.startsWith(webRoot) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(0, () => resolve(server)));
}

function assert(cond, msg) { if (!cond) throw new Error('Assertion failed: ' + msg); }

(async () => {
  const server = await serve();
  const base = `http://localhost:${server.address().port}/`;
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1100, height: 900 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  const shot = async (name) => { if (shotDir) await page.screenshot({ path: path.join(shotDir, name + '.png'), fullPage: true }); };
  const go = async (hash) => { await page.goto(base + 'index.html#' + hash); await page.waitForSelector('#app > *'); };
  const step = (name) => console.log('•', name);

  step('landing');
  await go('/');
  assert(await page.locator('.lang-card').count() === 2, 'two language cards');
  await shot('01-landing');

  for (const lang of ['ar', 'es']) {
    step(`${lang}: home`);
    await go(`/${lang}`);
    assert(await page.locator('.lang-hero').count() === 1, 'language hero');
    await shot(`02-${lang}-home`);

    step(`${lang}: lesson + quiz`);
    await page.locator('.tile', { hasText: 'Continue learning' }).click();
    await page.waitForSelector('#quiz .option');
    const lessonId = page.url().split('/').pop();
    while (await page.locator('#quiz [data-act="quiz-pick"]').count()) {
      await page.locator('#quiz [data-act="quiz-pick"]').first().click();
      await page.locator('#quiz [data-act="quiz-next"]').click();
    }
    assert(await page.locator('#quiz .score-big').count() === 1, 'quiz finished');
    await shot(`03-${lang}-lesson`);
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('lingua.progress.v1')));
    assert(saved.languages[lang].lessons[lessonId].done === true, 'lesson saved as done');

    step(`${lang}: reading tabs`);
    await go(`/${lang}/read`);
    await page.locator('.letter').nth(1).click();
    assert(await page.locator('.letter.studied').count() >= 1, 'letter studied');
    if (lang === 'ar') assert(await page.locator('.forms .glyph').count() === 4, 'four forms');
    await shot(`04-${lang}-letters`);
    for (const tab of ['marks', 'read', 'write', 'trace', 'quiz']) {
      await page.locator(`[data-act="tab"][data-tab="${tab}"]`).click();
    }
    step(`${lang}: writing`);
    await page.locator('[data-act="tab"][data-tab="write"]').click();
    const answer = await page.evaluate((id) => window.LINGUA_CONTENT.languages.find((l) => l.id === id).reading.writing[0].answer, lang);
    await page.fill('#write-input', answer);
    await page.locator('[data-act="write-check"]').click();
    assert(await page.locator('.feedback.good').count() === 1, 'writing accepted');
    await page.locator('.kbd [data-act="key"]').first().click();
    assert((await page.inputValue('#write-input')).length > answer.length, 'on-screen keyboard types');

    step(`${lang}: tracing`);
    await page.locator('[data-act="tab"][data-tab="trace"]').click();
    const box = await page.locator('#trace-ink').boundingBox();
    await page.mouse.move(box.x + box.width * 0.3, box.y + box.height * 0.5);
    await page.mouse.down();
    for (let i = 0; i <= 20; i++) await page.mouse.move(box.x + box.width * (0.3 + i * 0.02), box.y + box.height * 0.5);
    await page.mouse.up();
    await page.locator('[data-act="trace-check"]').click();
    assert(await page.locator('.feedback').count() === 1, 'trace scored');

    step(`${lang}: stylus pressure + palm rejection`);
    await page.locator('[data-act="trace-clear"]').click();
    const inkPixels = () => page.evaluate(() => {
      const c = document.getElementById('trace-ink');
      const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
      let n = 0; for (let i = 3; i < d.length; i += 4) if (d[i] > 100) n++; return n;
    });
    const stroke = (type, pressure, y) => page.evaluate(([type, pressure, y]) => {
      const c = document.getElementById('trace-ink');
      const b = c.getBoundingClientRect();
      const fire = (name, x) => c.dispatchEvent(new PointerEvent(name, { pointerType: type, pointerId: type === 'pen' ? 7 : 8, pressure, bubbles: true, clientX: b.left + b.width * x, clientY: b.top + b.height * y }));
      fire('pointerdown', 0.2);
      for (let i = 1; i <= 10; i++) fire('pointermove', 0.2 + i * 0.05);
      fire('pointerup', 0.7);
    }, [type, pressure, y]);
    await stroke('pen', 0.2, 0.3);
    const light = await inkPixels();
    await stroke('pen', 1.0, 0.7);
    const heavy = (await inkPixels()) - light;
    assert(light > 0 && heavy > light * 1.5, `harder pen pressure draws a thicker line (${light} vs ${heavy})`);
    assert(await page.locator('#pen-note').isVisible(), 'stylus note shown');
    const beforeTouch = await inkPixels();
    await stroke('touch', 0, 0.5);
    assert(await inkPixels() === beforeTouch, 'finger/palm touch ignored after stylus');
    await page.locator('[data-act="pen-mode"]').click();
    await stroke('touch', 0, 0.5);
    assert(await inkPixels() > beforeTouch, 'finger drawing works again when allowed');
    await page.locator('[data-act="pen-mode"]').click();
    await shot(`05-${lang}-trace`);

    step(`${lang}: scenario`);
    await go(`/${lang}/scenarios`);
    await page.locator('.tile').first().click();
    for (let guard = 0; guard < 40; guard++) {
      if (await page.locator('[data-act="sc-restart"]').count()) break;
      const cont = page.locator('[data-act="sc-continue"]');
      if (await cont.count()) { await cont.click(); continue; }
      await page.locator('[data-act="sc-pick"]:not([disabled])').first().click();
    }
    assert(await page.locator('.score-big').count() === 1, 'scenario finished');
    await shot(`06-${lang}-scenario`);

    step(`${lang}: translator`);
    await go(`/${lang}/translate`);
    const sample = lang === 'ar' ? 'شكرا' : 'muchas gracias';
    await page.fill('#tr-input', sample);
    const out = await page.locator('.tr-out').innerText();
    assert(/thank/i.test(out), `translated "${sample}" → "${out}"`);
    await page.fill('#tr-input', 'where is the bathroom');
    await page.locator('[data-act="tr-save"]').click();
    assert(await page.locator('[data-act="tr-unsave"]').count() === 1, 'saved word listed');
    await shot(`07-${lang}-translate`);

    step(`${lang}: aptitude test`);
    await go(`/${lang}/test`);
    await page.locator('[data-act="test-start"]').click();
    const correct = await page.evaluate((id) => window.LINGUA_CONTENT.languages.find((l) => l.id === id).aptitude.map((q) => q.answer), lang);
    for (const a of correct) await page.locator(`[data-act="quiz-pick"][data-i="${a}"]`).click();
    const level = await page.locator('.score-big').innerText();
    assert(level === 'C1', `perfect test places C1 (got ${level})`);
    await shot(`08-${lang}-test`);

    step(`${lang}: media`);
    await go(`/${lang}/media`);
    assert(await page.locator('.media-card').count() >= 3, 'media for placed level');
    await shot(`09-${lang}-media`);
  }

  step('progress persists across reload');
  await go('/progress');
  await page.reload();
  await page.waitForSelector('#app > *');
  const xp = Number((await page.locator('#xp').innerText()).replace(/\D/g, ''));
  assert(xp > 0, 'xp kept after reload');
  await shot('10-progress');

  step('export / import round trip');
  const [download] = await Promise.all([page.waitForEvent('download'), page.locator('[data-act="export"]').click()]);
  const file = await download.path();
  const exported = JSON.parse(fs.readFileSync(file, 'utf8'));
  assert(exported.languages.ar.aptitude.length === 1, 'export has data');
  page.once('dialog', (d) => d.accept());
  await page.locator('[data-act="reset"]').click();
  assert(await page.locator('#xp').innerText() === '⭐ 0', 'reset cleared xp');
  page.once('dialog', (d) => d.accept());
  await page.setInputFiles('input[data-change="import"]', file);
  await page.waitForFunction(() => !document.querySelector('#xp').textContent.endsWith(' 0'));

  step('mobile layout has no horizontal scroll');
  await page.setViewportSize({ width: 375, height: 800 });
  for (const hash of ['/', '/ar', '/ar/read', '/es/lesson/es-greet-1', '/es/translate']) {
    await go(hash);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    assert(overflow <= 1, `no horizontal overflow on ${hash} (${overflow}px)`);
  }
  await go('/ar/lesson/ar-greet-1');
  await shot('11-mobile-lesson');

  step('works from file:// without a server');
  const filePage = await context.newPage();
  filePage.on('pageerror', (e) => errors.push('file:// ' + e.message));
  await filePage.goto('file://' + path.join(webRoot, 'index.html') + '#/es');
  await filePage.waitForSelector('.lang-hero');

  step('offline after first visit (service worker)');
  const sw = await browser.newContext();
  const swPage = await sw.newPage();
  await swPage.goto(base + 'index.html');
  await swPage.evaluate(() => navigator.serviceWorker.ready);
  await swPage.reload();
  await swPage.evaluate(() => navigator.serviceWorker.ready);
  await sw.setOffline(true);
  await swPage.reload();
  await swPage.waitForSelector('.lang-card');
  await sw.close();

  await browser.close();
  server.close();
  if (errors.length) { console.error('Console errors:\n  ' + errors.join('\n  ')); process.exit(1); }
  console.log('Smoke test passed.');
})().catch((err) => { console.error(err); process.exit(1); });
