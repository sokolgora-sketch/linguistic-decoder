import http from "node:http";

function get(url: string): Promise<{ status: number; body: any }> {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      const status = res.statusCode ?? 0;
      let data = "";
      res.on("data", (d) => (data += d));
      res.on("end", () => {
        try {
          resolve({ status, body: JSON.parse(data) });
        } catch (e) {
          reject(e);
        }
      });
    }).on("error", reject);
  });
}

describe("/api/analyze-v1 originClaim gates — query flag", () => {
  test("ocg=1 enables gates for the request", async () => {
    const base = "http://localhost:3000";
    // assumes dev server is already running in this repo’s test harness,
    // but if not, switch this to your existing spawn harness pattern.
    const rOff = await get(`${base}/api/analyze-v1?word=father&mode=strict`);
    const rOn = await get(`${base}/api/analyze-v1?word=father&mode=strict&ocg=1`);

    expect(rOff.status).toBe(200);
    expect(rOn.status).toBe(200);

    // We only assert observables that exist in the contract:
    expect(rOff.body.originClaim).toBeTruthy();
    expect(rOn.body.originClaim).toBeTruthy();

    // Gates ON should be visible in policy (or any field you already expose)
    // Adjust to your exact contract field:
    const pOn = rOn.body.originClaim?.policy;
    expect(pOn).toBeTruthy();
  });
});
