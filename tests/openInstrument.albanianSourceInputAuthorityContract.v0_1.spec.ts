import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const contractDoc = readFileSync(
  "docs/open-instrument/albanian-source-input-authority-contract-v0.1.md",
  "utf8",
);

describe("Albanian source input authority contract v0.1", () => {
  it("freezes the contract document identity", () => {
    expect(Buffer.byteLength(contractDoc, "utf8")).toBe(10900);
    expect(createHash("sha256").update(contractDoc, "utf8").digest("hex")).toBe(
      "c66b43c8d399d93c15047709f60d01ca08962f1b54ecd4f3e73ae1178240e85a",
    );
  });

  it("freezes the doctrine contract identity and boundaries", () => {
    expect(contractDoc).toContain(
      "OPEN_INSTRUMENT_ALBANIAN_SOURCE_INPUT_AUTHORITY_CONTRACT_V0_1",
    );
    expect(contractDoc).toContain("Status: `FROZEN_DOCTRINE_CONTRACT`");
    expect(contractDoc).toContain("/.../  → PHONEMIC");
    expect(contractDoc).toContain("[...]  → PHONETIC");
    expect(contractDoc).toContain("An atomic vowel-only input is not required.");
    expect(contractDoc).toContain("yll /yɫ/");
    expect(contractDoc).toContain("çun /tʃun/");
    expect(contractDoc).toContain(
      "PLAIN_IPA_ADJACENCY_INSUFFICIENT",
    );
    expect(contractDoc).toContain("ALBANIAN_UNSPECIFIED != STANDARD_EXPLICIT");
    expect(contractDoc).toContain("IPA_TO_SEVEN_VOICE_AUTHORITY = NO");
    expect(contractDoc).toContain("RUNTIME_WIRING = NO");
  });

  it("keeps extraction separate from category and Voice authority", () => {
    expect(contractDoc).toContain(
      "extraction does not itself assign a phonological category",
    );
    expect(contractDoc).toContain(
      "extraction does not itself establish a moving nucleus",
    );
    expect(contractDoc).toContain(
      "ALBANIAN PHONOLOGICAL CATEGORY MATRIX",
    );
    expect(contractDoc).toContain(
      "The input authority does not bypass the existing Albanian source contract",
    );
  });
});
