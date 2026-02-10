import * as mod from "../app/api/analyze-v1/route";

function encIpa(s: string): string {
  return encodeURIComponent(s);
}

describe("/api/analyze-v1 — IPA input v0.1", () => {
  it("POST: includes phoneticIpaV0_1 when ipa is provided", async () => {
    const req = new Request("http://localhost/api/analyze-v1", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ word: "rhythm", ipa: "/ɹɪðəm/" }),
    });

    const res: any = await mod.POST(req);
    expect(res.status).toBe(200);

    const json: any = await res.json();
    expect(json.phoneticIpaV0_1).toBeTruthy();
    expect(json.phoneticIpaV0_1.ipa).toBe("/ɹɪðəm/");
    expect(json.phoneticIpaV0_1.voices).toEqual(["I", "Ë"]);
  });

  it("GET: includes phoneticIpaV0_1 when ipa query is provided", async () => {
    const ipa = "/ɹɪðəm/";
    const url = `http://localhost/api/analyze-v1?word=rhythm&ipa=${encIpa(ipa)}`;
    const req = new Request(url);

    const res: any = await mod.GET(req);
    expect(res.status).toBe(200);

    const json: any = await res.json();
    expect(json.phoneticIpaV0_1).toBeTruthy();
    expect(json.phoneticIpaV0_1.ipa).toBe(ipa);
    expect(json.phoneticIpaV0_1.voices).toEqual(["I", "Ë"]);
  });

  it("POST: trims ipa", async () => {
    const req = new Request("http://localhost/api/analyze-v1", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ word: "rhythm", ipa: "  /ɹɪðəm/  " }),
    });

    const res: any = await mod.POST(req);
    expect(res.status).toBe(200);

    const json: any = await res.json();
    expect(json.phoneticIpaV0_1.ipa).toBe("/ɹɪðəm/");
    expect(json.phoneticIpaV0_1.voices).toEqual(["I", "Ë"]);
  });
});
