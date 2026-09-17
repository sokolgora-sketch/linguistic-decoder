# Generic Reviewed Source Tradition Authority Policy v1

Status: IMPLEMENTED_CONTRACT.

Project lane: Open Instrument / ZËRO.

## Scope

This policy defines only `SOURCE_TRADITION_AUTHORITY`, the deterministic Gate 1
that decides whether a source tradition is eligible to submit records for
reviewed-source intake.

`SOURCE TRADITION ELIGIBILITY != SOURCE RECORD ACCEPTANCE != FUNCTIONAL/RUNTIME AUTHORIZATION`.

An eligible tradition has not supplied an accepted record, gained production
membership, or gained runtime authority.

## Three independent gates

Gate 1 evaluates tradition-level metadata:

- source identity;
- provenance;
- reproducibility or archive posture;
- license status;
- supported source type;
- language representation;
- variety representation;
- compatible claim boundaries.

Gate 2 remains the existing source-record validation and review process. It
still requires the exact form or explicitly authorized representation, stable
record locator, provenance, deterministic sense or variant handling, supported
citation type, reviewer, review date, reviewed status, and claim boundaries.

Gate 3 remains the existing functional/runtime authorization process. It still
requires explicit production membership, machine-readable runtime
authorization, functional readiness, bounded scope, and runtime projection
controls.

Gate 1 passing does not imply Gate 2 passing. Gate 2 passing does not imply
Gate 3 passing. Unknown or incomplete authority fails closed.

## Source-type and prestige boundary

The contract recognizes only the currently supported reviewed static,
dictionary, and lexical source kinds together with `dictionary_entry` or
`academic_lexical_reference` citation types. Other source types, including
instructional grammar material, remain review-required.

Labels such as national academy, university, academic, scholarly, historical
dictionary, dialect dictionary, and institutional source are descriptive
metadata only. Prestige does not create authority.

License and archive fields validate explicitly reviewed metadata. They do not
make a legal conclusion or authorize scraping or external acquisition.

## Claim boundary

Gate 1 preserves the following boundaries:

- source attestation is not functional correspondence;
- functional correspondence is not historical ancestry;
- no winner is selected;
- user judgment remains required;
- functional correspondence and historical relation remain unevaluated or
  unclaimed at this gate.

## Compatibility and non-promotion

Existing FJALË, Lewis & Short, and Middle Liddell source-adapter mappings are
unchanged. Existing Gate 2 record validation, production membership, and Gate 3
runtime authorization remain separate contracts.

EL / RAE, OT / DSL, and IT / CUNY remain boundary fixtures only. This policy
does not authorize, promote, register, or project them.

The implementation does not change structural grammar, reviewed production
rows, runtime authorization, functional correspondence, functional acceptance,
historical claims, winner selection, matching behavior, canonical Voices, or
runtime network behavior. Reviewed generic query coverage remains `1 / 164`
(`0.61%`), and structurally successful input witness coverage remains `2 / 157`
(`1.27%`).
