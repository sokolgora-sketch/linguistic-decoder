import { adaptAnalysisToTelemetryVM } from "../src/ui/instrument/contractAdapter";

describe("contractAdapter: malformed payload never throws (v0.1.1)", () => {
  test("null payload -> stable VM with missing fields", () => {
    const vm = adaptAnalysisToTelemetryVM(null);

    // Always a string fallback
    expect(vm.readout.word).toBe("(missing word)");

    // Mode/engineVersion/alphabet/etc should be missing when not emitted
    expect(vm.readout.mode.kind).toBe("missing");
    expect(vm.readout.engineVersion.kind).toBe("missing");

    // strictInput derives only if mode exists; here mode missing => strictInput missing
    expect(vm.readout.strictInput.kind).toBe("missing");
    if (vm.readout.strictInput.kind === "missing") {
      expect(vm.readout.strictInput.missing).toBe("not_emitted");
    }

    // Candidates safe default
    expect(vm.candidates).toEqual([]);
    expect(vm.readout.counts.candidates).toBe(0);

    // Counts should be missing when arrays not emitted
    expect(vm.readout.counts.ops.kind).toBe("missing");
    expect(vm.readout.counts.notes.kind).toBe("missing");
    expect(vm.readout.counts.signals.kind).toBe("missing");
  });

  test("non-record payload -> stable VM", () => {
    const vmA = adaptAnalysisToTelemetryVM("nope");
    const vmB = adaptAnalysisToTelemetryVM(123);
    const vmC = adaptAnalysisToTelemetryVM([1, 2, 3]);

    expect(vmA.readout.word).toBe("(missing word)");
    expect(vmB.readout.word).toBe("(missing word)");
    expect(vmC.readout.word).toBe("(missing word)");
  });

  test("minimal record with word only", () => {
    const vm = adaptAnalysisToTelemetryVM({ word: "study" });

    expect(vm.readout.word).toBe("study");
    expect(vm.readout.normalizedWord.kind).toBe("missing"); // sanitized not emitted
    expect(vm.readout.mode.kind).toBe("missing"); // no mode emitted => missing
    expect(vm.readout.strictInput.kind).toBe("missing"); // derive requires mode
    if (vm.readout.strictInput.kind === "missing") {
      expect(vm.readout.strictInput.note).toBe("Expected strictInput; derive requires mode");
    }

    expect(vm.readout.counts.candidates).toBe(0);
  });

  test("mode present -> strictInput derived", () => {
    const vmStrict = adaptAnalysisToTelemetryVM({ word: "x", mode: "strict" });
    expect(vmStrict.readout.mode.kind).toBe("present");
    if (vmStrict.readout.mode.kind === "present") {
      expect(vmStrict.readout.mode.value).toBe("strict");
    }
    expect(vmStrict.readout.strictInput.kind).toBe("present");
    if (vmStrict.readout.strictInput.kind === "present") {
      expect(vmStrict.readout.strictInput.value).toBe(true);
    }

    const vmOpen = adaptAnalysisToTelemetryVM({ word: "x", mode: "open" });
    expect(vmOpen.readout.strictInput.kind).toBe("present");
    if (vmOpen.readout.strictInput.kind === "present") {
      expect(vmOpen.readout.strictInput.value).toBe(false);
    }
  });

  test("strictInput boolean wins when emitted", () => {
    const vm = adaptAnalysisToTelemetryVM({ word: "x", mode: "strict", strictInput: false });
    expect(vm.readout.strictInput.kind).toBe("present");
    if (vm.readout.strictInput.kind === "present") {
      expect(vm.readout.strictInput.value).toBe(false);
    }
  });

  test("candidates non-array ignored; candidates array accepted", () => {
    const vmBad = adaptAnalysisToTelemetryVM({ word: "x", candidates: 123 });
    expect(vmBad.candidates).toEqual([]);
    expect(vmBad.readout.counts.candidates).toBe(0);

    const vmOk = adaptAnalysisToTelemetryVM({
      word: "x",
      candidates: [{ language: "en", form: "x" }],
    });

    expect(vmOk.readout.counts.candidates).toBe(1);
    expect(vmOk.candidates.length).toBe(1);
    expect(vmOk.candidates[0].language.kind).toBe("present");
    expect(vmOk.candidates[0].form.kind).toBe("present");
  });

  test("ops/notes/signals counts: present when arrays emitted under evidence", () => {
    const vm = adaptAnalysisToTelemetryVM({
      word: "x",
      evidence: {
        ops: [{ t: "op" }, { t: "op2" }],
        notes: ["a"],
        signals: [],
      },
    });

    // candidate count still 0
    expect(vm.readout.counts.candidates).toBe(0);

    // counts are present if evidence arrays exist (even empty array counts as 0 present)
    expect(vm.readout.counts.ops.kind).toBe("present");
    if (vm.readout.counts.ops.kind === "present") {
      expect(vm.readout.counts.ops.value).toBe(2);
    }

    expect(vm.readout.counts.notes.kind).toBe("present");
    if (vm.readout.counts.notes.kind === "present") {
      expect(vm.readout.counts.notes.value).toBe(1);
    }

    expect(vm.readout.counts.signals.kind).toBe("present");
    if (vm.readout.counts.signals.kind === "present") {
      expect(vm.readout.counts.signals.value).toBe(0);
    }
  });
});
