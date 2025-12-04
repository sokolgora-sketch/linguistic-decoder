describe("Mode & Alphabet propagation", () => {
  it("defaults to strict/auto", () => {
    const meta = { mode: "strict", alphabet: "auto" };
    expect(meta.mode).toBe("strict");
    expect(meta.alphabet).toBe("auto");
  });
});
