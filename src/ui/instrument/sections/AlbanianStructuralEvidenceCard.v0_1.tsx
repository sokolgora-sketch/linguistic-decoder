import type { AlbanianStructuralEvidenceVMV0_1 } from "../albanianStructuralEvidenceAdapter.v0_1";

function voicePath(voices: readonly string[]): string {
  return voices.length > 0 ? voices.join(" → ") : "no vowel events";
}

function structuralReadout(evidence: AlbanianStructuralEvidenceVMV0_1): string[] {
  return evidence.analysis.hypotheses.map((hypothesis) => {
    const decomposition = hypothesis.losslessDecomposition;
    const terminalComponents = decomposition.terminalComponentIds
      .map((componentId) => decomposition.components.find(
        (component) => component.componentId === componentId,
      ))
      .filter((component) => component !== undefined);
    const components = terminalComponents.map((component) =>
      `${component.form} (${voicePath(component.voiceEvents.map((event) => event.voice))})`,
    );
    const chain = hypothesis.expansionChain.join(" → ") || hypothesis.embryo;
    return `${chain} | ${components.join(" + ")}`;
  });
}

export function AlbanianStructuralEvidenceCardV0_1({
  evidence,
}: {
  evidence: AlbanianStructuralEvidenceVMV0_1;
}) {
  const allVoices = evidence.analysis.inputVoiceEvents.map((event) => event.voice);
  const alternatives = structuralReadout(evidence);
  const reference = evidence.sourceReference;
  const segmentation = reference?.sourceSurfaceSegmentation;

  return (
    <section
      aria-labelledby="orthographic-structural-evidence-title"
      className="rounded-xl border border-[#303a45] bg-[#10151c] p-4"
      data-testid="albanian-structural-evidence"
    >
      <h2
        id="orthographic-structural-evidence-title"
        className="text-sm font-semibold text-[#e5edf5]"
      >
        Orthographic structural analysis
      </h2>
      <p className="mt-1 text-xs leading-5 text-[#aeb7c5]">
        Form-only analysis. It does not establish Albanian lexical identity,
        meaning, pronunciation, or historical origin.
      </p>

      <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs text-[#97a7b8]">Complete written Voice events</dt>
          <dd data-testid="albanian-structural-voice-path" className="mt-1 text-[#f5f7fb]">
            {voicePath(allVoices)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-[#97a7b8]">Source-positioned graphemes</dt>
          <dd data-testid="albanian-structural-graphemes" className="mt-1 text-[#f5f7fb]">
            {evidence.analysis.inputGraphemes.map((grapheme) =>
              grapheme.grapheme.toLocaleUpperCase("en-US"),
            ).join(" · ") || "Unknown / Null"}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-[#97a7b8]">Analysis status</dt>
          <dd className="mt-1 font-mono text-[#f5f7fb]">
            {evidence.analysis.analysisStatus}; Voice sequence {evidence.analysis.inputVoiceSequenceStatus}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-[#97a7b8]">Pronunciation authority</dt>
          <dd className="mt-1 font-mono text-[#f5f7fb]">{evidence.pronunciationAuthority}</dd>
        </div>
      </dl>

      <div className="mt-3 rounded-lg border border-[#303a45] p-3">
        <h3 className="text-xs font-semibold text-[#c6d0dc]">Engine reductions and alternatives</h3>
        {alternatives.length > 0 ? (
          <ul className="mt-2 space-y-1 break-words text-xs leading-5 text-[#aeb7c5]">
            {alternatives.map((alternative, index) => (
              <li key={`${alternative}-${index}`}>{alternative}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-xs leading-5 text-[#aeb7c5]">
            No retained engine reduction hypothesis; structural alternatives are Null.
          </p>
        )}
        {evidence.analysis.excludedHypotheses.length > 0 ? (
          <p className="mt-2 text-xs leading-5 text-[#aeb7c5]">
            Excluded reductions split Albanian digraphs: {evidence.analysis.excludedHypotheses
              .map((item) => `${item.digraph} at source code-point ${item.splitSourcePosition}`)
              .join("; ")}.
          </p>
        ) : null}
      </div>

      <details className="mt-3 rounded-lg border border-[#303a45] p-3">
        <summary className="cursor-pointer text-xs font-semibold text-[#c6d0dc]">
          Event and grapheme positions
        </summary>
        <div className="mt-3 space-y-2 break-words text-xs leading-5 text-[#aeb7c5]">
          {evidence.analysis.inputVoiceEvents.length > 0 ? (
            <p>
              Events: {evidence.analysis.inputVoiceEvents.map((event) =>
                `${event.voice}@${event.sourcePosition}`,
              ).join(" · ")} (Unicode code-point offsets in supplied form).
            </p>
          ) : (
            <p>No written vowel events.</p>
          )}
          <p>
            Grapheme spans: {evidence.analysis.inputGraphemes.map((grapheme) =>
              `${grapheme.grapheme.toLocaleUpperCase("en-US")} ${grapheme.sourceSpan.start}–${grapheme.sourceSpan.end}`,
            ).join(" · ")}.
          </p>
          <p>Lexical identity: {evidence.lexicalIdentity}; historical origin: {evidence.historicalOriginClaim}.</p>
        </div>
      </details>

      {reference ? (
        <div
          className="mt-3 rounded-lg border border-[#554b36] bg-[#17150f] p-3 text-xs leading-5 text-[#e2d8c2]"
          data-testid="albanian-source-reference"
        >
          <h3 className="font-semibold">Same-form source reference only</h3>
          <p className="mt-1 font-mono" data-testid="albanian-source-reference-status">
            {reference.status}
          </p>
          <p>
            Matching spelling does not establish the input language, this source record&apos;s identity,
            or a target-sense match.
          </p>
          <p className="mt-2">
            Source: {reference.sourceIdentity.sourceArtifact}; SHA-256 {reference.sourceIdentity.sha256}.
            Record {reference.sourceRecord.sourceRecordId}; JSONL line {reference.sourceRecord.sourceFileLine}.
          </p>
          <p>Entry locator: {reference.sourceRecord.entryLocator}.</p>
          <p>Source record sense IDs: {reference.sourceRecord.sourceSenseIds.join(", ") || "Unknown / Null"}.</p>
          <p>Exact target-sense alignment: {reference.exactTargetSenseAlignment}.</p>
          <p>{reference.sourceRecord.sourceCaveat}</p>

          {segmentation ? (
            <>
              <p className="mt-2 font-mono" data-testid="source-surface-segmentation-status">
                Source surface segmentation: {segmentation.status}
              </p>
              {segmentation.left && segmentation.right ? (
                <p data-testid="source-surface-segmentation">
                  {segmentation.left.form} | {segmentation.right.form}; source field {segmentation.sourceField};
                  {" "}affix {segmentation.kind === "prefix"
                    ? `${segmentation.affix}-`
                    : `-${segmentation.affix}`}; boundary code-point {segmentation.boundaryCodePointOffset}.
                </p>
              ) : null}
              <p>{segmentation.explanation}</p>
              <p>Source base/surface alignment: {segmentation.sourceBaseSurfaceAlignment}.</p>
              <p className="font-mono" data-testid="engine-reduction-comparison">
                Actual engine reduction comparison: {reference.engineReductionComparison.status}.
              </p>
              <p>
                Source boundary: {reference.engineReductionComparison.sourceBoundaryCodePointOffset ?? "Unknown / Null"};
                {" "}actual emitted engine boundaries: {reference.engineReductionComparison.engineBoundaryCodePointOffsets.join(", ") || "none"}.
              </p>
            </>
          ) : (
            <p className="mt-2">Source morphology and boundary: Unknown / Null for this record.</p>
          )}

          {reference.ghegProposal ? (
            <div className="mt-3 border-t border-[#554b36] pt-3" data-testid="albanian-gheg-proposal">
              <h4 className="font-semibold">Separate user Gheg hypothesis</h4>
              <p>
                {reference.ghegProposal.userProposedStatement}: {reference.ghegProposal.proposalStatus};
                {" "}JET orthographic path {voicePath(reference.ghegProposal.proposedOrthographicVoicePath)}.
              </p>
              <p>
                The separate written source headword {reference.ghegProposal.sourceHeadwordForm} is at JSONL line
                {" "}{reference.ghegProposal.sourceHeadwordLine}, with orthographic path
                {" "}{voicePath(reference.ghegProposal.sourceOrthographicVoicePath)}.
              </p>
              <p>Source status for bare JET: {reference.ghegProposal.sourceAttestationStatus}; pronunciation authority not established.</p>
              <p>No historical derivation is claimed; JET is not expanded to JETË.</p>
            </div>
          ) : null}
        </div>
      ) : (
        <p className="mt-3 text-xs leading-5 text-[#aeb7c5]" data-testid="source-evidence-null">
          Source provenance, lexical identity, morphology, and exact sense alignment: Unknown / Null.
        </p>
      )}
    </section>
  );
}
