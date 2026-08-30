import {
  NextResponse,
} from "next/server";

import {
  buildSevenVoiceFunctionalRecurrenceResearchSurfaceV0_1,
  SEVEN_VOICE_FUNCTIONAL_RECURRENCE_RESEARCH_SURFACE_SCHEMA_V0_1,
} from "@/shared/openInstrument/sevenVoiceFunctionalRecurrenceResearchCatalog.v0_1";

export async function GET(
  request: Request,
) {
  const url =
    new URL(
      request.url,
    );

  const concept =
    url
      .searchParams
      .get(
        "concept",
      )
      ?.normalize(
        "NFC",
      )
      .trim() ??
    "";

  if (!concept) {
    return NextResponse.json(
      {
        schemaVersion:
          SEVEN_VOICE_FUNCTIONAL_RECURRENCE_RESEARCH_SURFACE_SCHEMA_V0_1,
        status:
          "invalid_request",
        reason:
          "missing_concept",
      },
      {
        status: 400,
      },
    );
  }

  const result =
    buildSevenVoiceFunctionalRecurrenceResearchSurfaceV0_1(
      concept,
    );

  if (!result) {
    return NextResponse.json(
      {
        schemaVersion:
          SEVEN_VOICE_FUNCTIONAL_RECURRENCE_RESEARCH_SURFACE_SCHEMA_V0_1,
        status:
          "not_available",
        conceptId:
          concept,
      },
      {
        status: 404,
      },
    );
  }

  if (
    result.status ===
      "rejected"
  ) {
    return NextResponse.json(
      result,
      {
        status: 422,
      },
    );
  }

  return NextResponse.json(
    result,
  );
}
