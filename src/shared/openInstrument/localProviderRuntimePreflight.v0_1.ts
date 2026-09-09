export type LocalProviderRuntimeReadinessStatusV0_1 =
  | "provider_unsupported"
  | "non_loopback_endpoint"
  | "endpoint_unavailable"
  | "model_not_visible"
  | "residency_observation_unavailable"
  | "model_not_resident"
  | "runtime_residency_ready";

export type LocalProviderRuntimePreflightV0_1 = Readonly<{
  providerId: string;
  modelId: string;
  endpointUrl: string;
  endpointReachable: boolean;
  modelVisible: boolean;
  residencyObservationSupported: boolean;
  modelResident: boolean;
  expiresAt: string | null;
  readinessStatus: LocalProviderRuntimeReadinessStatusV0_1;
  reasonCodes: readonly string[];
}>;

type RuntimePreflightOptionsV0_1 = Readonly<{
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
}>;

type JsonResponseV0_1 = Readonly<{
  ok: boolean;
  status: number;
  body: unknown;
}>;

function safeTimeoutMsV0_1(value?: number): number {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return Math.max(50, Math.min(Math.floor(value), 5000));
  }
  return 1500;
}

function isLoopbackUrlV0_1(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" && (url.hostname === "127.0.0.1" || url.hostname === "localhost");
  } catch {
    return false;
  }
}

function baseResultV0_1(
  providerId: string,
  modelId: string,
  endpointUrl: string,
  readinessStatus: LocalProviderRuntimeReadinessStatusV0_1,
  reasonCodes: readonly string[],
  overrides: Partial<LocalProviderRuntimePreflightV0_1> = {},
): LocalProviderRuntimePreflightV0_1 {
  return {
    providerId,
    modelId,
    endpointUrl,
    endpointReachable: false,
    modelVisible: false,
    residencyObservationSupported: false,
    modelResident: false,
    expiresAt: null,
    readinessStatus,
    reasonCodes,
    ...overrides,
  };
}

async function getJsonV0_1(
  url: string,
  fetchImpl: typeof fetch,
  timeoutMs: number,
): Promise<JsonResponseV0_1 | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(url, { method: "GET", signal: controller.signal });
    let body: unknown = null;
    if (response.ok) {
      try {
        body = await response.json();
      } catch {
        body = null;
      }
    }
    return { ok: response.ok, status: response.status, body };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function visibleModelV0_1(body: unknown, modelId: string): boolean {
  if (!body || typeof body !== "object" || !Array.isArray((body as { data?: unknown }).data)) return false;
  return (body as { data: unknown[] }).data.some(
    (entry) => entry && typeof entry === "object" && (entry as { id?: unknown }).id === modelId,
  );
}

function residentModelV0_1(body: unknown, modelId: string): { resident: boolean; expiresAt: string | null } | null {
  if (!body || typeof body !== "object" || !Array.isArray((body as { models?: unknown }).models)) return null;
  const entry = (body as { models: unknown[] }).models.find((candidate) => {
    if (!candidate || typeof candidate !== "object") return false;
    const row = candidate as { name?: unknown; model?: unknown; model_id?: unknown };
    return row.name === modelId || row.model === modelId || row.model_id === modelId;
  });
  if (!entry || typeof entry !== "object") return { resident: false, expiresAt: null };
  const row = entry as { expires_at?: unknown; expiresAt?: unknown; expires?: unknown };
  const expiresAt = [row.expires_at, row.expiresAt, row.expires].find((value) => typeof value === "string" && value.trim());
  return { resident: true, expiresAt: typeof expiresAt === "string" ? expiresAt.trim() : null };
}

export async function runLocalProviderRuntimePreflightV0_1(
  providerId: string,
  modelId: string,
  endpointUrl: string,
  localOnly: boolean,
  options: RuntimePreflightOptionsV0_1 = {},
): Promise<LocalProviderRuntimePreflightV0_1> {
  if (providerId !== "openai_compat") {
    return baseResultV0_1(providerId, modelId, endpointUrl, "provider_unsupported", ["LOCAL_PROVIDER_UNSUPPORTED"]);
  }
  if (!localOnly || !isLoopbackUrlV0_1(endpointUrl)) {
    return baseResultV0_1(providerId, modelId, endpointUrl, "non_loopback_endpoint", ["LOCAL_PROVIDER_LOOPBACK_REQUIRED"]);
  }

  const fetchImpl = options.fetchImpl ?? fetch;
  const timeoutMs = safeTimeoutMsV0_1(options.timeoutMs);
  let endpoint: URL;
  try {
    endpoint = new URL(endpointUrl);
  } catch {
    return baseResultV0_1(providerId, modelId, endpointUrl, "non_loopback_endpoint", ["LOCAL_PROVIDER_LOOPBACK_REQUIRED"]);
  }

  const modelsResponse = await getJsonV0_1(new URL("/v1/models", endpoint).toString(), fetchImpl, timeoutMs);
  if (!modelsResponse) {
    return baseResultV0_1(providerId, modelId, endpointUrl, "endpoint_unavailable", ["LOCAL_PROVIDER_ENDPOINT_UNAVAILABLE"]);
  }
  const modelVisible = modelsResponse.ok && visibleModelV0_1(modelsResponse.body, modelId);
  if (!modelVisible) {
    return baseResultV0_1(providerId, modelId, endpointUrl, "model_not_visible", ["LOCAL_PROVIDER_MODEL_NOT_VISIBLE"], {
      endpointReachable: true,
    });
  }

  const residencyResponse = await getJsonV0_1(new URL("/api/ps", endpoint).toString(), fetchImpl, timeoutMs);
  const baseOverrides = { endpointReachable: true, modelVisible: true };
  if (!residencyResponse || !residencyResponse.ok) {
    return baseResultV0_1(
      providerId,
      modelId,
      endpointUrl,
      "residency_observation_unavailable",
      ["LOCAL_PROVIDER_RESIDENCY_OBSERVATION_UNAVAILABLE"],
      baseOverrides,
    );
  }

  const residency = residentModelV0_1(residencyResponse.body, modelId);
  if (!residency) {
    return baseResultV0_1(
      providerId,
      modelId,
      endpointUrl,
      "residency_observation_unavailable",
      ["LOCAL_PROVIDER_RESIDENCY_OBSERVATION_UNAVAILABLE"],
      baseOverrides,
    );
  }
  if (!residency.resident) {
    return baseResultV0_1(providerId, modelId, endpointUrl, "model_not_resident", ["LOCAL_PROVIDER_MODEL_NOT_RESIDENT"], {
      ...baseOverrides,
      residencyObservationSupported: true,
    });
  }
  return baseResultV0_1(providerId, modelId, endpointUrl, "runtime_residency_ready", ["LOCAL_PROVIDER_RUNTIME_RESIDENCY_READY"], {
    ...baseOverrides,
    residencyObservationSupported: true,
    modelResident: true,
    expiresAt: residency.expiresAt,
  });
}
