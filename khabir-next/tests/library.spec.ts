import { expect, test, type Page } from "@playwright/test";

const LOCALES = ["fr", "ar", "en"] as const;
const PHONE = { width: 390, height: 844 };

function trackProblems(page: Page) {
  const problems: string[] = [];
  page.on("pageerror", (error) => problems.push(String(error)));
  page.on("console", (message) => message.type() === "error" && problems.push(message.text()));
  return problems;
}

test.describe("fault-code library", () => {
  test("the list shows every code and the search narrows it", async ({ page }) => {
    const problems = trackProblems(page);
    await page.goto("/fr/codes");
    await expect(page.locator("h1")).toBeVisible();
    const all = await page.locator("ul li a[href*='/fr/codes/']").count();
    expect(all).toBeGreaterThanOrEqual(40);

    await page.getByRole("searchbox").fill("p0420");
    await expect(page.locator("ul li a[href*='/fr/codes/']")).toHaveCount(1);
    await page.getByRole("searchbox").fill("zzzz-no-such-code");
    await expect(page.getByText("Aucun code ne correspond")).toBeVisible();
    expect(problems).toEqual([]);
  });

  test("a system chip filters the list", async ({ page }) => {
    await page.goto("/en/codes");
    const before = await page.locator("ul li a[href*='/en/codes/']").count();
    await page.getByRole("button", { name: "AdBlue / SCR" }).click();
    const after = await page.locator("ul li a[href*='/en/codes/']").count();
    expect(after).toBeGreaterThan(0);
    expect(after).toBeLessThan(before);
  });

  for (const locale of LOCALES) {
    test(`/${locale}/codes/p0113 (no extras) has the full structure and structured data`, async ({ page }) => {
      const problems = trackProblems(page);
      await page.goto(`/${locale}/codes/p0113`);
      await expect(page.locator("h1")).toContainText("P0113");
      await expect(page.locator("main h2")).toHaveCount(6); // can I drive, symptoms, causes, check, related + call to action
      await expect(page.locator("link[rel='canonical']")).toHaveAttribute("href", new RegExp(`/${locale}/codes/p0113$`));
      const blocks = await page.locator("script[type='application/ld+json']").allTextContents();
      const types = blocks.map((b) => JSON.parse(b)["@type"]);
      expect(types).toEqual(expect.arrayContaining(["Article", "BreadcrumbList", "FAQPage"]));
      // The WhatsApp button carries the code in the pre-filled message.
      const wa = await page.locator("a[href*='wa.me']").last().getAttribute("href");
      expect(decodeURIComponent(wa ?? "")).toContain("P0113");
      expect(problems).toEqual([]);
    });
  }

  test("codes with extra detail show the diagnostic steps and the brand notes, others do not", async ({ page }) => {
    for (const locale of LOCALES) {
      await page.goto(`/${locale}/codes/p0299`);
      await expect(page.locator("main ol li")).toHaveCount(6);
      await expect(page.locator("main li strong", { hasText: "Peugeot" })).toBeVisible();
    }
    await page.goto("/en/codes/p0113");
    await expect(page.locator("main ol")).toHaveCount(0);
  });

  test("an unknown code is a 404", async ({ page }) => {
    const response = await page.goto("/fr/codes/p9999");
    expect(response?.status()).toBe(404);
  });

  test("code pages do not overflow on a phone, in Arabic too", async ({ page }) => {
    await page.setViewportSize(PHONE);
    for (const path of ["/ar/codes", "/ar/codes/p20ee", "/fr/codes/p0300"]) {
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, path).toBeLessThanOrEqual(0);
    }
  });
});

test.describe("legal and contact pages (AdSense requirements)", () => {
  for (const locale of LOCALES) {
    for (const slug of ["privacy", "terms", "contact"]) {
      test(`/${locale}/${slug} renders with one h1`, async ({ page }) => {
        const problems = trackProblems(page);
        const response = await page.goto(`/${locale}/${slug}`);
        expect(response?.status()).toBe(200);
        await expect(page.locator("h1")).toHaveCount(1);
        expect(problems).toEqual([]);
      });
    }

    test(`/${locale} footer links to contact, privacy, terms and codes`, async ({ page }) => {
      await page.goto(`/${locale}`);
      const footer = page.locator("footer");
      for (const slug of ["contact", "privacy", "terms", "codes"]) {
        await expect(footer.locator(`a[href='/${locale}/${slug}']`)).toHaveCount(1);
      }
    });
  }

  test("the privacy policy names Google AdSense and the opt-out page", async ({ page }) => {
    await page.goto("/en/privacy");
    await expect(page.getByText("Google AdSense")).toBeVisible();
    await expect(page.getByText("https://adssettings.google.com")).toBeVisible();
  });
});

test.describe("search engine files", () => {
  test("the sitemap lists code pages and the new pages", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    for (const path of ["/fr/codes", "/ar/contact", "/en/privacy", "/fr/terms", "/en/codes/p20ee", "/ar/codes/u0100"]) {
      expect(xml).toContain(path);
    }
  });

  test("without an AdSense ID there is no ads.txt, no ad script and a strict CSP", async ({ request, page }) => {
    expect((await request.get("/ads.txt")).status()).toBe(404);
    const response = await page.goto("/fr/codes/p0113");
    const csp = response?.headers()["content-security-policy"] ?? "";
    expect(csp).not.toContain("googlesyndication");
    expect(await page.locator("script[src*='adsbygoogle']").count()).toBe(0);
    expect(await page.locator("ins.adsbygoogle").count()).toBe(0);
  });
});
