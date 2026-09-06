/** @jest-environment node */
import { ChildProcess, spawn } from "node:child_process";
import { once } from "node:events";
import { readFileSync } from "node:fs";
import http from "node:http";
import type { AddressInfo } from "node:net";
import { ownProcess, requestJson } from "./helpers/ownedNextServer";

describe("integration server ownership", () => {
  test("forces provider-disabled execution for owned integration servers", () => {
    const helper = readFileSync("tests/helpers/ownedNextServer.ts", "utf8");
    expect(helper).toContain('OPEN_INSTRUMENT_AUTO_PROPOSER: "0"');
    expect(helper).toContain('OPEN_INSTRUMENT_AUTO_CARRIER: "0"');
    expect(helper).toContain('PROPOSER_PROVIDER: "mock"');
  });

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
      child.on('message', () => process.stdout.write(String(child.pid) + '\\n'));
      process.on('SIGTERM', () => process.exit(0));
    `;
    const child = spawn(process.execPath, ["-e", script], {
      detached: true,
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, FORCE_COLOR: "1" },
    });
    const owned = ownProcess(child);
    try {
      const [output] = await once(child.stdout!, "data");
      const descendantPid = Number(String(output).trim());
      expect(Number.isInteger(descendantPid)).toBe(true);
      expect(descendantPid).toBeGreaterThan(0);
      await owned.stop();
      expect(child.exitCode).toBe(0);
      // Linux PID 1 may retain a dead orphan as a zombie; that is not a live leak.
      try {
        process.kill(descendantPid, 0);
        expect(process.platform).toBe("linux");
        const stat = readFileSync(`/proc/${descendantPid}/stat`, "utf8");
        expect(stat.slice(stat.lastIndexOf(")") + 2).split(" ")[0]).toBe("Z");
      } catch (error) {
        if (!["ESRCH", "ENOENT"].includes((error as NodeJS.ErrnoException).code ?? "")) throw error;
      }
    } finally {
      await owned.stop();
    }
  }, 15_000);

  test("does not wait for a zombie-only group to disappear after SIGKILL", async () => {
    if (process.platform === "win32") return;
    jest.useFakeTimers();
    const child = new ChildProcess();
    Object.defineProperty(child, "pid", { value: 123456 });
    const kill = jest.spyOn(process, "kill").mockImplementation((_pid, signal) => {
      if (signal === "SIGTERM") child.emit("close", 0, null);
      return true; // group lookup remains successful, as with unreaped zombies
    });
    try {
      const stopping = ownProcess(child).stop();
      await jest.advanceTimersByTimeAsync(5_100);
      await stopping;
      expect(kill).toHaveBeenCalledWith(-123456, "SIGKILL");
      expect(jest.getTimerCount()).toBe(0);
    } finally {
      kill.mockRestore();
      jest.useRealTimers();
    }
  });
});
