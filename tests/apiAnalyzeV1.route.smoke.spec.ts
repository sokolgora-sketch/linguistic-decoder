jest.mock("next/server", () => ({
  NextResponse: {
    json: (body: any, init?: { status?: number }) => ({
      status: init?.status ?? 200,
      json: async () => body,
    }),
  },
}));

describe("/api/analyze-v1 (adapter) — smoke", () => {
  test("POST returns adapter output", async () => {
    const mod = await import("../app/api/analyze-v1/route");

    const req: any = { json: async () => ({ word: "study", mode: "strict" }) };

    const res: any = await mod.POST(req);
    expect(res.status).toBe(200);

    const json: any = await res.json();
    expect(json.word.toLowerCase()).toBe("study");
    expect(json).toHaveProperty("heart");
    expect(json).toHaveProperty("candidates");
  });

  test("GET returns adapter output", async () => {
    const mod = await import("../app/api/analyze-v1/route");

    const req: any = { url: "http://localhost/api/analyze-v1?word=study&mode=strict" };

    const res: any = await mod.GET(req);
    expect(res.status).toBe(200);

    const json: any = await res.json();
    expect(json.word.toLowerCase()).toBe("study");
    expect(json).toHaveProperty("heart");
  });
});
