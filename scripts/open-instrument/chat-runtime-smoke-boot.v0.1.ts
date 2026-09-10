#!/usr/bin/env tsx

import net from "node:net";
import { chromium, type Browser } from "playwright";
import { startNextServer } from "../../tests/helpers/ownedNextServer";

const PAGE_TIMEOUT_MS = 30_000;
const FORCE_FAILURE = process.env.OPEN_INSTRUMENT_BROWSER_SMOKE_FORCE_FAILURE === "1";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

async function isPortClosed(url: string): Promise<boolean> {
  const port = Number(new URL(url).port);
  return await new Promise((resolve) => {
    const probe = net.createConnection({ host: "127.0.0.1", port });
    const close = (value: boolean) => {
      probe.destroy();
      resolve(value);
    };
    probe.once("connect", () => close(false));
    probe.once("error", () => close(true));
  });
}

async function main(): Promise<void> {
  let server: Awaited<ReturnType<typeof startNextServer>> | undefined;
  let browser: Browser | undefined;

  try {
    server = await startNextServer("start");
    const baseUrl = new URL(server.base);
    assert(baseUrl.protocol === "http:", "Browser smoke server must use HTTP.");
    assert(baseUrl.hostname === "127.0.0.1", "Browser smoke server must bind loopback.");
    console.log("SERVER_START=PASS");

    browser = await chromium.launch({ headless: true });
    console.log("BROWSER_LAUNCH=PASS");

    const context = await browser.newContext();
    const externalRequests = new Set<string>();
    context.on("request", (request) => {
      const requestUrl = new URL(request.url());
      if (
        (requestUrl.protocol === "http:" || requestUrl.protocol === "https:") &&
        (requestUrl.hostname !== baseUrl.hostname || requestUrl.port !== baseUrl.port)
      ) {
        externalRequests.add(request.url());
      }
    });

    const page = await context.newPage();
    page.setDefaultTimeout(PAGE_TIMEOUT_MS);
    const response = await page.goto(`${server.base}/chat`, {
      waitUntil: "domcontentloaded",
      timeout: PAGE_TIMEOUT_MS,
    });
    assert(response?.ok(), `Expected /chat to load, received HTTP ${response?.status() ?? "no response"}.`);
    await page.getByRole("textbox", { name: "Word" }).waitFor({ state: "visible" });
    await page.getByRole("region", { name: "Open Instrument ready" }).waitFor({ state: "visible" });
    console.log("CHAT_PAGE_BROWSER_LOAD=PASS");

    await page.getByRole("button", { name: "Analyze" }).click();
    await page.getByText("Type a word before analyzing.", { exact: true }).waitFor({ state: "visible" });
    console.log("CHAT_HYDRATION=PASS");

    if (externalRequests.size > 0) {
      throw new Error(`Browser smoke observed non-loopback requests: ${[...externalRequests].join(", ")}`);
    }
    console.log("LOOPBACK_ONLY=PASS");

    if (FORCE_FAILURE) {
      throw new Error("Intentional browser smoke cleanup probe failure.");
    }

    await context.close();
  } finally {
    if (browser) {
      await browser.close();
      browser = undefined;
      console.log("BROWSER_CLEANUP=PASS");
    }
    if (server) {
      const baseUrl = server.base;
      await server.stop();
      assert(await isPortClosed(baseUrl), "Owned Next server port remained open after cleanup.");
      server = undefined;
      console.log("SERVER_CLEANUP=PASS");
    }
  }
}

main().catch((error) => {
  console.error("\nERROR: Open Instrument browser boot smoke failed");
  console.error(error instanceof Error ? error.stack ?? error.message : String(error));
  process.exitCode = 1;
});
