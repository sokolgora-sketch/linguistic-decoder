import { PROTO_ROOTS_V1 } from "../src/shared/protoRoots.v1";

describe("DA proto-root dialect carriers v1", () => {
  const da = PROTO_ROOTS_V1.find((root) => root.id === "DA");

  it("keeps DA aligned with reviewed Gheg split/divide evidence", () => {
    expect(da).toMatchObject({
      id: "DA",
      gloss: "split / divide / cut / separate",
      roleHint: "Action",
    });

    expect(da?.carriers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          lang: "sq",
          dialect: "Gheg",
          form: "da",
          gloss: "split / divide / cut",
          notes: expect.stringContaining("Dedvukaj & Ndoci 2023 PLSA"),
        }),
      ]),
    );
  });

  it("keeps Tosk cognate and derivative DA-family support separate from exact Gheg proof", () => {
    expect(da?.carriers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          lang: "sq",
          dialect: "Tosk",
          form: "daj",
          gloss: "split / divide",
        }),
        expect.objectContaining({
          lang: "sq",
          dialect: "Tosk",
          form: "ndaj",
          gloss: "divide / share",
          notes: expect.stringContaining("DA-family derivative support"),
        }),
        expect.objectContaining({
          lang: "sq",
          dialect: "Tosk",
          form: "ndarë",
          gloss: "divided",
          notes: expect.stringContaining("DA-family derivative support"),
        }),
      ]),
    );
  });

  it("keeps da equals gave as a non-runtime homophone collision lane", () => {
    expect(da?.notes).toContain("Homophone collision lane");
    expect(da?.notes).toContain("gave (aorist/part)");

    expect(da?.carriers).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          form: "da",
          gloss: "gave (aorist/part)",
        }),
      ]),
    );
  });
});
