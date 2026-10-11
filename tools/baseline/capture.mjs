// Captures visual + behavioural baselines of a Khabir build.
//   TARGET=original BASE_URL=http://localhost:8080/  node capture.mjs   (static site, locale via localStorage)
//   TARGET=next     BASE_URL=http://localhost:3001/  node capture.mjs   (Next build, locale via /fr /ar /en)
// Output: out/<target>/*.png, metrics.json, reference.json
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const TARGET = process.env.TARGET || 'original';
const BASE = (process.env.BASE_URL || 'http://localhost:8080/').replace(/\/?$/, '/');
const OUT = path.resolve(process.env.OUT_DIR || 'out', TARGET);
const LOCALES = (process.env.LOCALES || 'fr,ar,en').split(',');
const PROGRESS = [0, 0.1, 0.33, 0.6, 0.9, 1];
const SECTIONS = { problem: '.problem', method: '.method', lab: '.lab', services: '.services', promises: '.promises', faq: '.faq', cta: '#rdv', footer: 'footer' };
const SHOT = { animations: 'disabled', caret: 'hide' };

const CONTEXTS = {
  desktop:   { viewport: { width: 1440, height: 900 } },
  mobile:    { viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true },
  tablet:    { viewport: { width: 768, height: 1024 }, isMobile: true, hasTouch: true },
  landscape: { viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true },
  reduced:   { viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' },
};

// count every rAF the page schedules, so we can prove the loop goes idle
const RAF_COUNTER = () => {
  const orig = window.requestAnimationFrame.bind(window);
  window.__origRAF = orig; window.__raf = 0;
  window.requestAnimationFrame = cb => { window.__raf++; return orig(cb); };
};

const urlFor = locale => TARGET === 'next' ? `${BASE}${locale}` : BASE;

async function openPage(browser, ctxName, locale) {
  const ctx = await browser.newContext({ ...CONTEXTS[ctxName], deviceScaleFactor: 1 });
  if (TARGET === 'original') await ctx.addInitScript(l => { try { localStorage.setItem('khabir-lang', l); } catch {} }, locale);
  await ctx.addInitScript(RAF_COUNTER);
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(urlFor(locale), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  return { ctx, page, errors };
}

const scrollHero = (page, p) => page.evaluate(p => {
  const h = document.getElementById('top');
  const top = h.getBoundingClientRect().top + scrollY;
  window.scrollTo({ top: top + p * (h.offsetHeight - innerHeight), behavior: 'instant' });
}, p);

const scrollTo = (page, sel) => page.evaluate(sel => {
  const el = document.querySelector(sel);
  window.scrollTo({ top: el.getBoundingClientRect().top + scrollY, behavior: 'instant' });
}, sel);

async function shot(page, name) {
  await page.screenshot({ path: path.join(OUT, `${name}.png`), ...SHOT });
}

async function sections(page, prefix) {
  for (const [name, sel] of Object.entries(SECTIONS)) {
    await scrollTo(page, sel);
    await page.waitForTimeout(1400);
    await shot(page, `${prefix}-${name}`);
  }
}

async function labDone(page, prefix) {
  await scrollTo(page, '.lab');
  await page.waitForTimeout(1200);
  const box = await page.locator('#holdbtn').boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(3900);
  await page.mouse.up();
  await page.waitForTimeout(400);
  await shot(page, `${prefix}-lab-done`);
}

async function faqOpen(page, prefix) {
  await scrollTo(page, '.faq');
  await page.waitForTimeout(1200);
  await page.locator('.qa').nth(1).locator('summary').click();
  await page.waitForTimeout(900);
  await shot(page, `${prefix}-faq-open`);
}

async function scrollMetrics(page) {
  await scrollHero(page, 0);
  await page.waitForTimeout(1500);
  await page.mouse.move(720, 450);
  await page.evaluate(() => {
    window.__frames = []; window.__long = [];
    let last = performance.now();
    const loop = now => { window.__frames.push(now - last); last = now; if (!window.__stopFrames) window.__origRAF(loop); };
    window.__origRAF(loop);
    try { new PerformanceObserver(l => l.getEntries().forEach(e => window.__long.push(e.duration))).observe({ type: 'longtask', buffered: false }); } catch {}
  });
  for (let i = 0; i < 45; i++) { await page.mouse.wheel(0, 100); await page.waitForTimeout(60); }
  await page.waitForTimeout(2500);                         // let the lerp settle
  const rafBefore = await page.evaluate(() => window.__raf);
  await page.waitForTimeout(1000);
  const rafAfter = await page.evaluate(() => window.__raf);
  const res = await page.evaluate(() => {
    window.__stopFrames = true;
    const f = window.__frames.slice(1).sort((a, b) => a - b);
    const q = x => +f[Math.min(f.length - 1, Math.floor(f.length * x))].toFixed(2);
    return { frames: f.length, p50ms: q(0.5), p95ms: q(0.95), maxMs: +f[f.length - 1].toFixed(2), over33ms: f.filter(x => x > 33.4).length,
             longTasks: window.__long.length, longTaskMs: Math.round(window.__long.reduce((a, b) => a + b, 0)) };
  });
  // page-scheduled rAFs during one idle second (our own frame counter excluded since it uses __origRAF)
  res.idleRafPerSec = rafAfter - rafBefore;
  return res;
}

async function reference(page) {
  return page.evaluate(() => ({
    b1: document.querySelector('.b1 h1').outerHTML,
    b2: document.querySelector('.b2 h2').outerHTML,
    b3: document.querySelector('.b3 h2').outerHTML,
    b4: document.querySelector('.b4 h2').outerHTML,
    dust: document.querySelector('.dust').innerHTML,
    title: document.title,
    lang: document.documentElement.lang,
    dir: document.documentElement.dir,
    waHref: document.querySelector('a.wa').href,
  }));
}

async function run() {
  await fs.mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();
  const metrics = {}, refs = {}, errs = {};
  const log = (...a) => console.log(`[${TARGET}]`, ...a);

  for (const locale of LOCALES) {
    // desktop: scrub hero at fixed progress points, then sections, lab, faq
    {
      const { ctx, page, errors } = await openPage(browser, 'desktop', locale);
      refs[locale] = await reference(page);
      await page.waitForSelector('#stage.video-ready', { timeout: 45000 });
      for (const p of PROGRESS) {
        await scrollHero(page, p);
        await page.waitForTimeout(1600);
        await shot(page, `desktop-${locale}-hero-${String(Math.round(p * 100)).padStart(3, '0')}`);
      }
      await sections(page, `desktop-${locale}`);
      await labDone(page, `desktop-${locale}`);
      await faqOpen(page, `desktop-${locale}`);
      if (locale === 'fr') metrics[`desktop-${locale}`] = await scrollMetrics(page);
      errs[`desktop-${locale}`] = errors;
      await ctx.close();
      log('desktop', locale, 'done');
    }
    // mobile: static hero + sections
    {
      const { ctx, page, errors } = await openPage(browser, 'mobile', locale);
      await page.waitForTimeout(800);
      await shot(page, `mobile-${locale}-hero`);
      await sections(page, `mobile-${locale}`);
      errs[`mobile-${locale}`] = errors;
      await ctx.close();
      log('mobile', locale, 'done');
    }
    // remaining gates: hero only (+ lab pinned under reduced motion)
    for (const c of ['tablet', 'landscape', 'reduced']) {
      const { ctx, page, errors } = await openPage(browser, c, locale);
      await page.waitForTimeout(800);
      await shot(page, `${c}-${locale}-hero`);
      if (c === 'reduced') { await scrollTo(page, '.lab'); await page.waitForTimeout(600); await shot(page, `${c}-${locale}-lab`); }
      errs[`${c}-${locale}`] = errors;
      await ctx.close();
      log(c, locale, 'done');
    }
  }

  await fs.writeFile(path.join(OUT, 'metrics.json'), JSON.stringify(metrics, null, 2));
  await fs.writeFile(path.join(OUT, 'reference.json'), JSON.stringify(refs, null, 2));
  await fs.writeFile(path.join(OUT, 'console-errors.json'), JSON.stringify(errs, null, 2));
  await browser.close();
  log('metrics', JSON.stringify(metrics));
  log('errors', Object.values(errs).flat().length);
}

run().catch(e => { console.error(e); process.exit(1); });
