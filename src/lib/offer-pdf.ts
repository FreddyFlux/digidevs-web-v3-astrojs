import type { Browser, Page } from "playwright-core";
import { chromium as playwrightChromium } from "playwright-core";

export type OfferPdfCookie = { name: string; value: string; url: string };

/**
 * Renders a URL (typically the print-optimized offer page) to a PDF buffer.
 * On Vercel, uses @sparticuz/chromium. Locally, uses Chrome channel or CHROMIUM_EXECUTABLE_PATH.
 * Pass session cookies so password-protected print routes load in headless Chromium.
 */
export async function renderUrlToPdf(
  url: string,
  cookies?: OfferPdfCookie[],
): Promise<Uint8Array> {
  const browser = await launchChromium();
  try {
    const context = await browser.newContext();
    try {
      if (cookies?.length) {
        await context.addCookies(cookies);
      }
      const page = await context.newPage();
      try {
        await page.goto(url, { waitUntil: "load", timeout: 60_000 });
        await page.emulateMedia({ media: "print" });
        await page.addStyleTag({
          content: `
            @media print {
              html, body {
                margin: 0 !important;
                background: #000 !important;
              }

              /*
               * Keep visual layout unchanged after removing PDF engine margins:
               * old pdf margins (12mm) + existing print padding (15/12mm)
               */
              .offer-print-root {
                padding: 24mm 27mm !important;
              }
            }
          `,
        });
        await page.evaluate(() => document.fonts.ready).catch(() => undefined);
        await waitForPageImages(page, 20_000);
        const buf = await page.pdf({
          format: "A4",
          printBackground: true,
          margin: { top: "0mm", bottom: "0mm", left: "0mm", right: "0mm" },
        });
        return buf;
      } finally {
        await page.close();
      }
    } finally {
      await context.close();
    }
  } finally {
    await browser.close();
  }
}

async function launchChromium(): Promise<Browser> {
  const onVercel = Boolean(process.env.VERCEL);

  if (onVercel) {
    const sparticuz = (await import("@sparticuz/chromium")).default;
    return playwrightChromium.launch({
      args: sparticuz.args,
      executablePath: await sparticuz.executablePath(),
      headless: true,
    });
  }

  const executablePath = process.env.CHROMIUM_EXECUTABLE_PATH?.trim();
  if (executablePath) {
    return playwrightChromium.launch({
      executablePath,
      headless: true,
    });
  }

  return playwrightChromium.launch({
    channel: "chrome",
    headless: true,
  });
}

async function waitForPageImages(page: Page, timeoutMs: number): Promise<void> {
  await page.waitForFunction(
    () => {
      const images = Array.from(document.images);
      if (images.length === 0) return true;
      return images.every((img) => {
        if (!img.complete) return false;
        return img.naturalHeight > 0 || img.naturalWidth > 0;
      });
    },
    undefined,
    { timeout: timeoutMs },
  );
}
