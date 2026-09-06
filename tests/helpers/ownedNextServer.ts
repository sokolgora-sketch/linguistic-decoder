import { spawn, type ChildProcess } from "node:child_process";
import http from "node:http";
import net from "node:net";

export async function availablePort(): Promise<number> {
  const probe = net.createServer();
  return new Promise((resolve, reject) => {
    probe.once("error", reject);
    probe.listen(0, "127.0.0.1", () => {
      const address = probe.address() as net.AddressInfo;
      probe.close((error) => error ? reject(error) : resolve(address.port));
    });
  });
}

// A wall-clock deadline also covers sockets that connect but never send headers.
export function requestJson(url: string, method = "GET", body: unknown = null, timeoutMs = 30_000) {
  return new Promise<{ status: number; json: any; raw: string }>((resolve, reject) => {
    const payload = body == null ? "" : JSON.stringify(body);
    const req = http.request(url, {
      method,
      agent: false,
      headers: { "Content-Type": "application/json", Accept: "application/json", "Content-Length": Buffer.byteLength(payload) },
    });
    const timer = setTimeout(() => req.destroy(new Error(`HTTP deadline exceeded: ${url}`)), timeoutMs);
    req.once("error", (error) => { clearTimeout(timer); reject(error); });
    req.once("response", (res) => {
      let raw = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => { raw += chunk; });
      res.once("error", (error) => { clearTimeout(timer); reject(error); });
      res.once("end", () => {
        clearTimeout(timer);
        try { resolve({ status: res.statusCode ?? 0, json: JSON.parse(raw), raw }); }
        catch { reject(new Error(`Expected JSON but got: ${raw.slice(0, 300)}`)); }
      });
    });
    req.end(payload);
  });
}

// POSIX children have a private process group: cleanup never targets another run.
export function ownProcess(proc: ChildProcess) {
  let closed = false;
  let failure: Error | undefined;
  proc.once("error", (error) => { failure = error; });
  proc.once("close", () => { closed = true; });
  let stopPromise: Promise<void> | undefined;
  function signal(value: NodeJS.Signals) {
    try {
      if (process.platform !== "win32" && proc.pid) process.kill(-proc.pid, value);
      else proc.kill(value);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ESRCH") throw error;
    }
  }
  function groupAlive() {
    if (process.platform === "win32" || !proc.pid) return !closed;
    try { process.kill(-proc.pid, 0); return true; }
    catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ESRCH") return false;
      throw error;
    }
  }
  return {
    assertRunning() {
      if (failure) throw failure;
      if (closed || proc.exitCode !== null || proc.signalCode !== null) throw new Error("Owned Next process exited before readiness");
    },
    stop() {
      stopPromise ??= (async () => {
        if (closed && !groupAlive()) return;
        signal("SIGTERM");
        const started = Date.now();
        let forced = false;
        // Leader closure does not prove that descendants with separate stdio exited.
        // After SIGKILL, an unreaped zombie may keep kill(group, 0) successful.
        // Await the owned child's close, but do not wait for PID 1 to reap orphans.
        while (!closed || (!forced && groupAlive())) {
          const elapsed = Date.now() - started;
          if (!forced && elapsed >= 5_000) { signal("SIGKILL"); forced = true; }
          if (elapsed >= 10_000) throw new Error("Owned process group did not close after termination");
          await new Promise((resolve) => setTimeout(resolve, 25));
        }
      })();
      return stopPromise;
    },
  };
}

export async function startNextServer(mode: "dev" | "start") {
  const port = await availablePort();
  const base = `http://127.0.0.1:${port}`;
  const proc = spawn(process.execPath, [require.resolve("next/dist/bin/next"), mode, "-p", String(port), "-H", "127.0.0.1"], {
    env: { ...process.env, PORT: String(port), NEXT_TELEMETRY_DISABLED: "1", ...(mode === "start" ? { NODE_ENV: "production" } : {}) },
    detached: process.platform !== "win32",
    stdio: ["ignore", "pipe", "pipe"],
  });
  const owned = ownProcess(proc);
  let logs = "";
  const drain = (chunk: Buffer) => { logs = (logs + chunk.toString()).slice(-8_000); };
  proc.stdout.on("data", drain);
  proc.stderr.on("data", drain);
  try {
    const deadline = Date.now() + 120_000;
    while (Date.now() < deadline) {
      owned.assertRunning();
      try {
        const response = await requestJson(`${base}/api/analyze-v1?word=study&mode=strict`, "GET", null, Math.min(5_000, deadline - Date.now()));
        owned.assertRunning();
        if (response.status === 200) return { base, stop: owned.stop };
      } catch { owned.assertRunning(); }
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
    throw new Error("Owned Next server did not become ready within 120 seconds");
  } catch (error) {
    await owned.stop();
    throw new Error(`${String(error)}\n${logs}`);
  }
}
