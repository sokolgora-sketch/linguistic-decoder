import type { AlbanianStructuralEvidenceVMV0_1 } from "../albanianStructuralEvidenceAdapter.v0_1";

function voicePath(voices: readonly string[]): string {
  return voices.length > 0 ? voices.join(" → ") : "no vowel events";
}

export function AlbanianStructuralEvidenceCardV0_1({
  evidence,
}: {
  evidence: AlbanianStructuralEvidenceVMV0_1;
}) {
  const allVoices = evidence.analysis.inputVoiceEvents.map((event) => event.voice);

  return (
    <section
      aria-labelledby="albanian-structural-evidence-title"
      className="rounded-xl border border-[#303a45] bg-[#10151c] p-4"
      data-testid="albanian-structural-evidence"
    >
      <h2
        id="albanian-structural-evidence-title"
        className="text-sm font-semibold text-[#e5edf5]"
      >
        Albanian structural boundary evidence
      </h2>
      <p className="mt-1 text-xs leading-5 text-[#aeb7c5]">
        Written structure with source-positioned graphemes. Meaning, spoken
        pronunciation, and historical origin remain unclaimed here.
      </p>

      <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs text-[#97a7b8]">Complete written Voice events</dt>
          <dd data-testid="albanian-structural-voice-path" className="mt-1 text-[#f5f7fb]">
            {voicePath(allVoices)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-[#97a7b8]">Lossless surface partition</dt>
          <dd data-testid="albanian-structural-partition" className="mt-1 text-[#f5f7fb]">
            {evidence.surfacePartition.left.form} ({voicePath(evidence.surfacePartition.left.voiceEvents.map((event) => event.voice))})
            {" + "}
            {evidence.surfacePartition.right.form} ({voicePath(evidence.surfacePartition.right.voiceEvents.map((event) => event.voice))})
          </dd>
        </div>
        <div>
          <dt className="text-xs text-[#97a7b8]">Boundary comparison</dt>
          <dd data-testid="albanian-boundary-classification" className="mt-1 font-mono text-[#f5f7fb]">
            {evidence.boundaryComparison.classification}
          </dd>
          <dd className="mt-1 text-xs leading-5 text-[#aeb7c5]">
            {evidence.boundaryComparison.explanation}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-[#97a7b8]">Exact target-sense alignment</dt>
          <dd className="mt-1 font-mono text-[#f5f7fb]">
            {evidence.boundaryComparison.exactTargetSenseAlignment}
          </dd>
        </div>
      </dl>

      <details className="mt-3 rounded-lg border border-[#303a45] p-3">
        <summary className="cursor-pointer text-xs font-semibold text-[#c6d0dc]">
          Source record and structural alternatives
        </summary>
        <div className="mt-3 space-y-2 break-words text-xs leading-5 text-[#aeb7c5]">
          <p>Source: {evidence.sourceIdentity.sourceArtifact}; SHA-256 {evidence.sourceIdentity.sha256}.</p>
          <p>Record: {evidence.sourceRecord.sourceRecordId}; JSONL line {evidence.sourceRecord.sourceFileLine}.</p>
          <p>Entry locator: {evidence.sourceRecord.entryLocator}.</p>
          <p>Source sense IDs: {evidence.sourceRecord.sourceSenseIds.join(", ") || "not supplied"}.</p>
          <p>{evidence.sourceRecord.sourceCaveat}</p>
          <p>
            Left span: {evidence.surfacePartition.left.sourceSpan.start}–{evidence.surfacePartition.left.sourceSpan.end}; graphemes {evidence.surfacePartition.left.graphemes.join(" · ")}.
          </p>
          <p>
            Right span: {evidence.surfacePartition.right.sourceSpan.start}–{evidence.surfacePartition.right.sourceSpan.end}; graphemes {evidence.surfacePartition.right.graphemes.join(" · ")}.
          </p>
          <p>Structural alternatives: {evidence.structuralAlternatives.length > 0
            ? evidence.structuralAlternatives.map((item) => `${item.embryo} (${item.expansionChain.join(" → ")})`).join("; ")
            : "Null after Albanian digraph-boundary filtering"}.
          </p>
          {evidence.analysis.excludedHypotheses.length > 0 ? (
            <p>
              Excluded reductions split an Albanian digraph: {evidence.analysis.excludedHypotheses
                .map((item) => `${item.digraph} at source code-point ${item.splitSourcePosition}`)
                .join("; ")}.
            </p>
          ) : null}
          <p>Representation authority: orthographic. Pronunciation authority: not established.</p>
        </div>
      </details>

      {evidence.ghegProposal ? (
        <div
          className="mt-3 rounded-lg border border-[#554b36] bg-[#17150f] p-3 text-xs leading-5 text-[#e2d8c2]"
          data-testid="albanian-gheg-proposal"
        >
          <h3 className="font-semibold">Dialect representation: source status UNKNOWN</h3>
          <p className="mt-1">
            User-proposed Gheg spelling {evidence.ghegProposal.proposedForm}: {evidence.ghegProposal.proposalStatus}; orthographic path {voicePath(evidence.ghegProposal.proposedOrthographicVoicePath)}.
          </p>
          <p>
            Frozen source headword {evidence.ghegProposal.sourceHeadwordForm} is a separate written record at JSONL line {evidence.ghegProposal.sourceHeadwordLine}; its headword record does not mark a dialect register. Its orthographic path is {voicePath(evidence.ghegProposal.sourceOrthographicVoicePath)}.
          </p>
          <p>Source record: {evidence.ghegProposal.sourceHeadwordRecordId}; entry locator: {evidence.ghegProposal.sourceHeadwordEntryLocator}.</p>
          <p>
            This noun record has dialectal-tagged senses under the written headword {evidence.ghegProposal.sourceHeadwordForm}; it contains no bare JET noun form. This does not establish the proposed spelling&apos;s dialect or pronunciation.
          </p>
          <p>
            The source does not establish the proposed Gheg form or a historical derivation. Pronunciation authority remains not established.
          </p>
        </div>
      ) : null}
    </section>
  );
}
