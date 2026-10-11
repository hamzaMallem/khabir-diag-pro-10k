// Proves the scroll-controlled video on a running production server.
//   npm run build && npm run start -- -p 3001
//   BASE_URL=http://localhost:3001 node tests/scrub-check.mjs
// For desktop and phone-sized screens it: loads the page, counts video downloads, scrolls through the hero
// at 0/25/50/75/100% (forward, then backward), records the video's currentTime, and saves screenshots to tests/out/.
import { chromium } from "@playwright/test";
import fs from "node:fs/promises";

const BASE = process.env.BASE_URL ?? "http://localhost:3001";
const LOCALE = process.env.LOCALE ?? "fr";
const OUT = new URL("./out/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
await fs.mkdir(OUT, { recursive: true });

const CONTEXTS = {
  desktop: { viewport: { width: 1440, height: 900 } },
  mobile: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
};
const POINTS = [0, 0.25, 0.5, 0.75, 1, 0.75, 0.5, 0.25, 0];
const results = {};

const browser = await chromium.launch();
for (const [name, options] of Object.entries(CONTEXTS)) {
  const context = await browser.newContext(options);
  const page = await context.newPage();
  const videoRequests = [];
  const problems = [];
  page.on("request", (r) => r.url().includes(".mp4") && videoRequests.push(new URL(r.url()).pathname));
  page.on("pageerror", (e) => problems.push(String(e)));
  page.on("console", (m) => m.type() === "error" && problems.push(m.text()));

  await page.goto(`${BASE}/${LOCALE}`, { waitUntil: "load" });
  await page.waitForSelector('section#top[data-status="ready"]', { timeout: 30000 });

  const samples = [];
  for (const p of POINTS) {
    await page.evaluate((progress) => {
      const hero = document.querySelector("#top");
      const stage = document.querySelector("[data-hero-stage]");
      const range = hero.offsetHeight - stage.clientHeight;
      window.scrollTo({ top: hero.offsetTop + range * progress, behavior: "instant" });
    }, p);
    await page.waitForTimeout(1600); // let the smoothing settle and the last seek finish
    const info = await page.evaluate(() => {
      const v = document.querySelector("[data-hero-video]");
      return { time: +v.currentTime.toFixed(2), duration: +v.duration.toFixed(2), src: v.currentSrc.split("/").pop(), seeking: v.seeking };
    });
    samples.push({ progress: p, ...info });
    if (samples.length <= 5) await page.screenshot({ path: `${OUT}${name}-${LOCALE}-${String(Math.round(p * 100)).padStart(3, "0")}.png` });
  }
  results[name] = { videoRequests, problems, samples };
  await context.close();
}
await browser.close();
console.log(JSON.stringify(results, null, 2));
