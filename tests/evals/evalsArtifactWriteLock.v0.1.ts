import fs from "fs";
import path from "path";

const LOCK_TIMEOUT_MS = 30_000;
const LOCK_POLL_INTERVAL_MS = 10;

/**
 * Serializes writes to the stable, gitignored Evals artifact paths across
 * Jest worker processes and separate local test processes for this checkout.
 */
export function withEvalsArtifactWriteLockV0_1<T>(
  root: string,
  operation: () => T
): T {
  const canonicalRoot = fs.realpathSync(root);
  const lockPath = path.join(
    canonicalRoot,
    "tests/validation/out/.evals-artifact-write.lock"
  );

  fs.mkdirSync(path.dirname(lockPath), { recursive: true });
  const deadline = Date.now() + LOCK_TIMEOUT_MS;
  const waitCell = new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT));

  while (true) {
    try {
      // mkdir is the exclusive acquisition primitive shared by worker processes.
      fs.mkdirSync(lockPath);
      break;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
      if (Date.now() >= deadline) {
        throw new Error(
          `Timed out waiting for Evals artifact lock at ${lockPath}; ` +
            "inspect owner.json before removing a stale lock."
        );
      }
      Atomics.wait(waitCell, 0, 0, LOCK_POLL_INTERVAL_MS);
    }
  }

  try {
    fs.writeFileSync(
      path.join(lockPath, "owner.json"),
      `${JSON.stringify({ pid: process.pid, acquiredAt: new Date().toISOString() })}\n`,
      "utf8"
    );
    return operation();
  } finally {
    fs.rmSync(lockPath, { recursive: true, force: true });
  }
}
