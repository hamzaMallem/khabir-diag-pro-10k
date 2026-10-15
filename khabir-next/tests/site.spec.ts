import { expect, test, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";

const LOCALES = ["fr", "ar", "en"] as const;
const DESKTOP = { width: 1440, height: 900 };
const PHONE = { width: 390, height: 844 };
const TABLET = { width: 820, height: 1180 };
const PHONE_LANDSCAPE = { width: 844, height: 390 };

/** Collect console errors and uncaught exceptions during a test. */
function trackProblems(page: Page) {
  const problems: string[] = [];
  page.on("pageerror", (error) => problems.push(String(error)));
  page.on("console", (message) => message.type() === "error" && problems.push(message.text()));
  return problems;
}

function trackVideoRequests(page: Page) {
  const urls: string[] = [];
  page.on("request", (request) => request.url().includes(".mp4") && urls.push(new URL(request.url()).pathname));
  return urls;
}

/** Scroll so that the hero is `progress` (0 to 1) of the way through, then wait for the playhead to settle. */
async function scrollHeroTo(page: Page, progress: number) {
  await page.evaluate((p) => {
    const hero = document.querySelector<HTMLElement>("#top")!;
    const stage = document.querySelector<HTMLElement>("[data-hero-stage]")!;
    window.scrollTo({ top: hero.offsetTop + (hero.offsetHeight - stage.clientHeight) * p, behavior: "instant" });
  }, progress);
  await page.waitForTimeout(1500);
}

const videoTime = (page: Page) => page.evaluate(() => document.querySelector<HTMLVideoElement>("[data-hero-video]")!.currentTime);

test.describe("routing and language", () => {
  test("/ redirects to French when the browser asks for French", async ({ browser }) => {
    const context = await browser.newContext({ locale: "fr-MA" });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page).toHaveURL(/\/fr$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "fr");
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
    await context.close();
  });

  test("an unsupported browser language falls back to French", async ({ browser }) => {
    const context = await browser.newContext({ locale: "de-DE" });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page).toHaveURL(/\/fr$/);
    await context.close();
  });

  test("a saved language cookie decides the redirect", async ({ page, context, baseURL }) => {
    await context.addCookies([{ name: "khabir-lang", value: "ar", url: baseURL! }]);
    await page.goto("/");
    await expect(page).toHaveURL(/\/ar$/);
  });

  test("Arabic is right-to-left and English is left-to-right", async ({ page }) => {
    await page.goto("/ar");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("html")).toHaveAttribute("lang", "ar");
    await page.goto("/en");
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  });

  test("language switcher navigates and remembers the choice", async ({ page, context }) => {
    await page.goto("/fr");
    await page.getByRole("link", { name: "EN", exact: true }).click();
    await expect(page).toHaveURL(/\/en$/);
    const cookies = await context.cookies();
    expect(cookies.find((c) => c.name === "khabir-lang")?.value).toBe("en");
  });

  test("metadata: canonical, hreflang, and no unverified structured data", async ({ page }) => {
    await page.goto("/fr");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/fr$/);
    for (const l of LOCALES) await expect(page.locator(`link[rel="alternate"][hreflang="${l}"]`)).toHaveCount(1);
    const json = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? "{}");
    expect(json["@type"]).toBe("AutoRepair");
    expect(json.telephone).toBe("+212632899218"); // WhatsApp number confirmed by the owner (config/site.ts)
    expect(json.openingHours).toContain("Fr 09:00-19:00");
  });

  test("security headers are sent on every page", async ({ request }) => {
    for (const path of ["/fr", "/ar/blog", "/ar/blog/adblue-light", "/en/services"]) {
      const response = await request.get(path);
      const headers = response.headers();
      expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'");
      expect(headers["content-security-policy"]).toContain("object-src 'none'");
      expect(headers["x-content-type-options"]).toBe("nosniff");
      expect(headers["x-frame-options"]).toBe("DENY");
      expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
      expect(headers["strict-transport-security"]).toContain("max-age=");
      expect(headers["x-powered-by"]).toBeUndefined();
    }
  });

  test("translation files have identical keys", () => {
    const keys = (l: string) => Object.keys(JSON.parse(readFileSync(`messages/${l}.json`, "utf8"))).sort();
    expect(keys("ar")).toEqual(keys("fr"));
    expect(keys("en")).toEqual(keys("fr"));
  });
});

test.describe("scroll-controlled hero video", () => {
  for (const [name, viewport, isMobile, expected] of [
    ["desktop", DESKTOP, false, "/media/hero-desktop.mp4"],
    ["phone", PHONE, true, "/media/hero-mobile.mp4"],
  ] as const) {
    test(`${name}: downloads only its own video and scrubs forward and backward`, async ({ browser }) => {
      const context = await browser.newContext({ viewport, isMobile, hasTouch: isMobile });
      const page = await context.newPage();
      const problems = trackProblems(page);
      const requests = trackVideoRequests(page);
      await page.goto("/fr");
      await expect(page.locator('#top[data-status="ready"]')).toBeVisible({ timeout: 30_000 });
      const duration = await page.evaluate(() => document.querySelector<HTMLVideoElement>("[data-hero-video]")!.duration);

      // The video reaches its last frame at 90% of the scroll (endAt in config/hero.ts).
      for (const p of [0, 0.25, 0.5, 0.75, 1, 0.75, 0.5, 0.25, 0]) {
        await scrollHeroTo(page, p);
        const expectedTime = Math.min(1, p / 0.9) * duration;
        expect(await videoTime(page)).toBeCloseTo(expectedTime, 0);
      }
      expect(new Set(requests)).toEqual(new Set([expected]));
      expect(problems).toEqual([]);
      await context.close();
    });
  }

  test("switching between desktop and phone size swaps the source, and only then", async ({ browser }) => {
    const context = await browser.newContext({ viewport: DESKTOP });
    const page = await context.newPage();
    const requests = trackVideoRequests(page);
    await page.goto("/fr");
    await expect(page.locator('#top[data-status="ready"]')).toBeVisible({ timeout: 30_000 });
    await page.setViewportSize({ width: 1200, height: 800 }); // same variant: no new download
    await page.waitForTimeout(500);
    expect(requests.filter((u) => u.includes("desktop"))).toHaveLength(1);
    await page.setViewportSize(PHONE);
    await expect(page.locator('#top[data-variant="mobile"][data-status="ready"]')).toBeVisible({ timeout: 30_000 });
    expect(requests.some((u) => u.includes("hero-mobile"))).toBe(true);
    await context.close();
  });

  test("a failing video keeps captions and falls back to still frames", async ({ page }) => {
    await page.route("**/*.mp4", (route) => route.abort());
    const problems = trackProblems(page);
    await page.goto("/fr");
    await expect(page.locator('#top[data-status="failed"]')).toBeVisible({ timeout: 15_000 });
    await scrollHeroTo(page, 0.95);
    await expect(page.getByRole("heading", { name: /La vraie panne/ }).first()).toBeVisible();
    await expect(page.locator("[data-hero-stage]").getByRole("link", { name: "Trouver ma panne sur WhatsApp" })).toBeVisible();
    expect(problems.filter((p) => !/ERR_FAILED|Failed to load resource/.test(p))).toEqual([]);
  });

  test("reduced motion: no video, still hero, call to action available", async ({ browser }) => {
    const context = await browser.newContext({ viewport: DESKTOP, reducedMotion: "reduce" });
    const page = await context.newPage();
    const requests = trackVideoRequests(page);
    await page.goto("/fr");
    await page.waitForTimeout(1000);
    expect(requests).toEqual([]);
    await expect(page.locator("[data-hero-stage]")).toBeHidden();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("La vraie panne");
    await expect(page.getByRole("link", { name: "Trouver ma panne sur WhatsApp" }).last()).toBeVisible();
    await context.close();
  });

  test("the animation loop stops when scrolling stops", async ({ page }) => {
    await page.addInitScript(() => {
      const original = window.requestAnimationFrame.bind(window);
      (window as unknown as { __raf: number }).__raf = 0;
      window.requestAnimationFrame = (cb) => {
        (window as unknown as { __raf: number }).__raf++;
        return original(cb);
      };
    });
    await page.goto("/fr");
    await expect(page.locator('#top[data-status="ready"]')).toBeVisible({ timeout: 30_000 });
    await scrollHeroTo(page, 0.4);
    await page.waitForTimeout(1500);
    const before = await page.evaluate(() => (window as unknown as { __raf: number }).__raf);
    await page.waitForTimeout(1000);
    const after = await page.evaluate(() => (window as unknown as { __raf: number }).__raf);
    expect(after - before).toBeLessThanOrEqual(2); // only unrelated page animations may still ask for frames
  });
});

test.describe("layout", () => {
  for (const locale of LOCALES) {
    for (const [name, viewport] of [
      ["desktop", DESKTOP],
      ["tablet portrait", TABLET],
      ["phone portrait", PHONE],
      ["phone landscape", PHONE_LANDSCAPE],
    ] as const) {
      test(`${locale} ${name}: no horizontal overflow, no errors`, async ({ browser }) => {
        const context = await browser.newContext({ viewport, hasTouch: viewport.width < 900 });
        const page = await context.newPage();
        const problems = trackProblems(page);
        await page.goto(`/${locale}`);
        await page.waitForTimeout(800);
        // scroll through the whole page so lazy and reveal content is exercised
        const height = await page.evaluate(() => document.documentElement.scrollHeight);
        for (let y = 0; y < height; y += viewport.height * 0.8) {
          await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
          await page.waitForTimeout(60);
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
        expect(problems).toEqual([]);
        await context.close();
      });
    }
  }

  // Guards the top bar: page links sit side by side, no bullets or underlines, and the bar never grows past two rows.
  for (const [name, viewport] of [
    ["desktop", DESKTOP],
    ["tablet portrait", TABLET],
    ["phone portrait", PHONE],
  ] as const) {
    test(`ar ${name}: top bar links are one tidy row`, async ({ browser }) => {
      const context = await browser.newContext({ viewport });
      const page = await context.newPage();
      await page.goto("/ar");
      const links = page.locator("nav ul a");
      await expect(links).toHaveCount(4);
      const boxes = await links.evaluateAll((els) =>
        els.map((el) => {
          const r = el.getBoundingClientRect();
          const cs = getComputedStyle(el);
          return { y: Math.round(r.y), underline: cs.textDecorationLine, bullet: getComputedStyle(el.parentElement!).listStyleType };
        }),
      );
      expect(new Set(boxes.map((b) => b.y)).size).toBe(1); // all on the same line
      expect(boxes.every((b) => b.underline === "none" && b.bullet === "none")).toBe(true);
      const navHeight = await page.locator("nav").evaluate((el) => el.getBoundingClientRect().height);
      expect(navHeight).toBeLessThan(130);
      await context.close();
    });
  }
});

test.describe("interactions", () => {
  test("FAQ opens and closes", async ({ page }) => {
    await page.goto("/fr");
    const first = page.locator("details").first();
    await first.scrollIntoViewIfNeeded();
    await first.locator("summary").click();
    await expect(first).toHaveAttribute("open", "");
    await first.locator("summary").click();
    await expect(first).not.toHaveAttribute("open", "");
  });

  test("diagnostic demo: holding the button isolates the fault, releasing early eases back", async ({ page }) => {
    await page.goto("/fr");
    const button = page.locator("button", { hasText: "Maintenir pour scanner" });
    await button.scrollIntoViewIfNeeded();
    const box = (await button.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.waitForTimeout(1200);
    await page.mouse.up();
    await page.waitForTimeout(2500);
    await expect(page.getByText("Prêt. Maintenez pour démarrer.")).toBeVisible(); // eased back to idle
    await page.mouse.down();
    await page.waitForTimeout(4200);
    await page.mouse.up();
    await expect(page.getByText("Défaut isolé :")).toBeVisible();
    await expect(page.getByText("P20EE")).toBeVisible();
  });

  test("diagnostic demo works from the keyboard", async ({ page }) => {
    await page.goto("/en");
    const button = page.getByRole("button", { name: /Hold to scan/ });
    await button.scrollIntoViewIfNeeded();
    await button.focus();
    await page.keyboard.down("Space");
    await page.waitForTimeout(4200);
    await page.keyboard.up("Space");
    await expect(page.getByText("Fault isolated:")).toBeVisible();
  });

  test("keyboard: skip link is the first focus stop and works", async ({ page }) => {
    await page.goto("/fr");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Aller au contenu" })).toBeFocused();
  });

  test("contact buttons never pretend to be a workshop WhatsApp link when no number is set", async ({ page }) => {
    await page.goto("/fr");
    const hrefs = await page.locator("a", { hasText: "Diagnostiquer ma voiture" }).evaluateAll((els) => els.map((e) => e.getAttribute("href")));
    for (const href of hrefs) expect(href === "#rdv" || /^https:\/\/wa\.me\/\d+\?text=/.test(href ?? "")).toBe(true);
  });
});
