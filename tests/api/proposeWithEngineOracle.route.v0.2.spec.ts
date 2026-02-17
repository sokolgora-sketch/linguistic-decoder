import { POST } from "../../app/api/propose-with-engine-oracle/route";

describe("/api/propose-with-engine-oracle (route)", () => {
  test("POST: ok=true for mock provider; snapshot locked", async () => {
    const req = new Request("http://localhost/api/propose-with-engine-oracle", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ word: "study", mode: "strict", provider: "mock" }),
    });

    const res = await POST(req as any);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.claimPacket?.oracle?.engineV1?.source).toBe("v1/analyzeWordV1");

    expect(json).toMatchSnapshot();
  });

  test("POST: missing word => 400", async () => {
    const req = new Request("http://localhost/api/propose-with-engine-oracle", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ word: "" }),
    });

    const res = await POST(req as any);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.ok).toBe(false);
  });
});
