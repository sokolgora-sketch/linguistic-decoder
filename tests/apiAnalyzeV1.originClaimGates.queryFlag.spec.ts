import { GET } from "@/app/api/analyze-v1/route";
import { NextRequest } from "next/server";

function req(url: string) {
  // NextRequest accepts a URL string in Node test env (Node 18+).
  return new NextRequest(url);
}

describe("/api/analyze-v1 originClaim gates — query flag", () => {
  it("ocg=1 enables gates for the request", async () => {
    const r = req("http://localhost/api/analyze-v1?word=study&mode=strict&ocg=1");
    const res = await GET(r);

    expect(res.status).toBe(200);

    const json = await res.json();

    // Keep assertions minimal + stable.
    // We only care that the request-level ocg flag flips gates ON in the response.
    expect(json?.originClaimGates).toBeDefined();
    expect(json.originClaimGates.flag).toBe("ocg");
    expect(json.originClaimGates.active).toBe(true);
  });

  it("default (no ocg) keeps gates OFF", async () => {
    const r = req("http://localhost/api/analyze-v1?word=study&mode=strict");
    const res = await GET(r);

    expect(res.status).toBe(200);

    const json = await res.json();

    expect(json?.originClaimGates).toBeDefined();
    expect(json.originClaimGates.flag).toBe("ocg");
    expect(json.originClaimGates.active === false || json.originClaimGates.active === null).toBe(true);
  });
});
