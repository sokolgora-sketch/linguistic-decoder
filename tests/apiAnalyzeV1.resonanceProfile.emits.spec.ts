import { GET } from "@/app/api/analyze-v1/route";

function req(url: string): any {
  return { url };
}

describe("/api/analyze-v1 emits resonanceProfileV1 (v0.1)", () => {
  it("GET includes resonanceProfileV1 (study strict)", async () => {
    const r = req("http://localhost/api/analyze-v1?word=study&mode=strict");
    const res: any = await GET(r);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json).toHaveProperty("resonanceProfileV1");
    expect(json.resonanceProfileV1).not.toBeNull();
  });
});
