/** @jest-environment node */
import { spawn } from "node:child_process";
import { once } from "node:events";
import http from "node:http";
import type { AddressInfo } from "node:net";
import { ownProcess, requestJson } from "./helpers/ownedNextServer";

describe("integration server ownership", () => {
  test("destroys a request when a connected server never sends headers", async () => {
    const server = http.createServer(() => {});
    server.listen(0, "127.0.0.1");
    await once(server, "listening");
    try {
      const port = (server.address() as AddressInfo).port;
      await expect(requestJson(`http://127.0.0.1:${port}`, "GET", null, 50)).rejects.toThrow("HTTP deadline exceeded");
    } finally {
      server.closeAllConnections();
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
  });

  test("awaits process closure and permits repeated cleanup", async () => {
    const child = spawn(process.execPath, ["-e", "console.log('ready'); setInterval(() => {}, 1000)"], {
      detached: process.platform !== "win32", stdio: ["ignore", "pipe", "pipe"],
    });
    const owned = ownProcess(child);
    await once(child.stdout!, "data");
    await owned.stop();
    await owned.stop();
    expect(child.exitCode !== null || child.signalCode !== null).toBe(true);
  });

  (process.platform === "win32" ? test.skip : test).each(["inherit", "ignore"] as const)("cleans a descendant with %s stdio after its wrapper exits", async (stdio) => {
    const script = `
      const { spawn } = require('node:child_process');
      const child = spawn(process.execPath, ['-e', "process.on('SIGTERM', () => {}); process.send('ready'); setInterval(() => {}, 1000)"], { stdio: ['ignore', '${stdio}', '${stdio}', 'ipc'] });
      child.on('message', () => console.log('ready'));
      process.on('SIGTERM', () => process.exit(0));
    `;
    const child = spawn(process.execPath, ["-e", script], { detached: true, stdio: ["ignore", "pipe", "pipe"] });
    const owned = ownProcess(child);
    try {
      await once(child.stdout!, "data");
      await owned.stop();
      expect(child.exitCode).toBe(0);
      expect(() => process.kill(-child.pid!, 0)).toThrow();
    } finally {
      await owned.stop();
    }
  }, 15_000);
});
