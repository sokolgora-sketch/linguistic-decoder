import fs from "node:fs";
import path from "node:path";

const DOC =
  path.join(
    process.cwd(),
    "docs/open-instrument/z-zero-seven-voice-functional-recurrence-milestone-v0.1.md",
  );

function readDoc(): string {
  return fs.readFileSync(
    DOC,
    "utf8",
  );
}

describe(
  "ZË-RO Seven-Voice Functional Recurrence milestone contract v0.1",
  () => {
    it(
      "locks the Seven Voices as the primary functional comparison layer",
      () => {
        const text =
          readDoc();

        expect(
          text,
        ).toContain(
          "`A, E, I, O, U, Y, Ë`",
        );

        expect(
          text,
        ).toContain(
          "The Seven Voices carry the functional comparison. Consonants are structural frames and carriers.",
        );

        expect(
          text,
        ).toContain(
          "Consonants do not independently drive the Seven-Voices path.",
        );
      },
    );

    it(
      "locks the cross-linguistic functional recurrence hypothesis",
      () => {
        const text =
          readDoc();

        expect(
          text,
        ).toContain(
          "Concept-equivalent forms across languages may preserve or recur around one or more of the same canonical Seven Voices",
        );

        expect(
          text,
        ).toContain(
          "**Seven-Voice Functional Recurrence.**",
        );

        expect(
          text,
        ).toContain(
          "**shared functional nucleus**",
        );
      },
    );

    it(
      "locks WATER → UOTER and shared WATER nucleus U without rewriting raw orthography",
      () => {
        const text =
          readDoc();

        expect(
          text,
        ).toContain(
          "`WATER`",
        );

        expect(
          text,
        ).toContain(
          "`A-E`",
        );

        expect(
          text,
        ).toContain(
          "`UOTER`",
        );

        expect(
          text,
        ).toContain(
          "`U-O-E`",
        );

        expect(
          text,
        ).toContain(
          "**WATER cohort → shared functional nucleus U**",
        );

        expect(
          text,
        ).toContain(
          "`UJË`",
        );

        expect(
          text,
        ).toContain(
          "`UJ`",
        );

        expect(
          text,
        ).toContain(
          "`SHUI`",
        );

        expect(
          text,
        ).toContain(
          "It does not rewrite raw English orthography.",
        );
      },
    );

    it(
      "locks SY / EYE shared Y while rejecting a phonetic-identity shortcut",
      () => {
        const text =
          readDoc();

        expect(
          text,
        ).toContain(
          "`SY`",
        );

        expect(
          text,
        ).toContain(
          "`E-Y-E`",
        );

        expect(
          text,
        ).toContain(
          "**EYE cohort → shared functional nucleus Y**",
        );

        expect(
          text,
        ).toContain(
          "It does not claim that English `eye` contains the Albanian phonetic vowel /y/.",
        );
      },
    );

    it(
      "locks explicit comparison modes and forbids hidden functional normalization",
      () => {
        const text =
          readDoc();

        for (
          const mode of [
            "`orthography`",
            "`transliteration`",
            "`z_zero_functional_normalization`",
          ]
        ) {
          expect(
            text,
          ).toContain(
            mode,
          );
        }

        expect(
          text,
        ).toContain(
          "The recurrence engine does not invent a functional comparison form.",
        );

        expect(
          text,
        ).toContain(
          "This proves there is no hidden WATER-specific shortcut.",
        );
      },
    );

    it(
      "locks the truth hierarchy and no-single-winner posture",
      () => {
        const text =
          readDoc();

        expect(
          text,
        ).toContain(
          "### Fact within declared comparison forms",
        );

        expect(
          text,
        ).toContain(
          "### Research hypothesis",
        );

        expect(
          text,
        ).toContain(
          "### Not claimed",
        );

        for (
          const claim of [
            "phonetic identity",
            "historical origin",
            "historical transmission",
            "cognacy",
            "borrowing",
            "a single historical winner",
            "candidate truth",
            "universality",
          ]
        ) {
          expect(
            text,
          ).toContain(
            claim,
          );
        }

        expect(
          text,
        ).toContain(
          "`user_decides`",
        );

        expect(
          text,
        ).toContain(
          "`no_single_winner`",
        );

        expect(
          text,
        ).toContain(
          "Null remains valid.",
        );
      },
    );

    it(
      "locks U doctrine context as research doctrine rather than scientific proof",
      () => {
        const text =
          readDoc();

        for (
          const term of [
            "container",
            "inside",
            "adding",
            "holding",
            "depth",
          ]
        ) {
          expect(
            text,
          ).toContain(
            term,
          );
        }

        expect(
          text,
        ).toContain(
          "U is also the blue canonical voice",
        );

        expect(
          text,
        ).toContain(
          "This milestone does not declare that the hypothesis is already scientifically proven.",
        );
      },
    );
  },
);
