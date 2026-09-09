import { runLocalProviderRuntimePreflightV0_1 } from "../src/shared/openInstrument/localProviderRuntimePreflight.v0_1";

function response(body: unknown, status = 200): Response {
  return { ok: status >= 200 && status < 300, status, json: async () => body } as Response;
}

function fetchDouble(models: unknown, ps: unknown, psStatus = 200) {
  return jest.fn(async (input: RequestInfo | URL) => {
    const url = String(input);
    if (url.endsWith("/v1/models")) return response(models);
    if (url.endsWith("/api/ps")) return response(ps, psStatus);
    throw new Error(`unexpected endpoint: ${url}`);
  }) as unknown as typeof fetch;
}

describe("local provider runtime preflight v0.1", () => {
  const endpoint = "http://127.0.0.1:11434/v1";
  const models = { data: [{ id: "gemma3:4b" }] };

  test("does not treat /v1/models visibility alone as resident readiness", async () => {
    const fetchImpl = fetchDouble(models, { models: [] });
    const result = await runLocalProviderRuntimePreflightV0_1("openai_compat", "gemma3:4b", endpoint, true, { fetchImpl });
    expect(result).toMatchObject({ modelVisible: true, residencyObservationSupported: true, modelResident: false, readinessStatus: "model_not_resident" });
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  test("passes only when the requested model is present in /api/ps", async () => {
    const fetchImpl = fetchDouble(models, { models: [{ name: "gemma3:4b", expires_at: "2030-01-01T00:00:00Z" }] });
    const result = await runLocalProviderRuntimePreflightV0_1("openai_compat", "gemma3:4b", endpoint, true, { fetchImpl });
    expect(result).toMatchObject({ endpointReachable: true, modelVisible: true, residencyObservationSupported: true, modelResident: true, readinessStatus: "runtime_residency_ready", expiresAt: "2030-01-01T00:00:00Z" });
  });

  test("fails closed when residency observation is unsupported", async () => {
    const fetchImpl = fetchDouble(models, {}, 404);
    const result = await runLocalProviderRuntimePreflightV0_1("openai_compat", "gemma3:4b", endpoint, true, { fetchImpl });
    expect(result.readinessStatus).toBe("residency_observation_unavailable");
    expect(result.modelResident).toBe(false);
  });

  test("blocks endpoint failure and absent model without retaining response bodies", async () => {
    const unavailable = jest.fn(async () => { throw new Error("network body must not escape"); }) as unknown as typeof fetch;
    const result = await runLocalProviderRuntimePreflightV0_1("openai_compat", "gemma3:4b", endpoint, true, { fetchImpl: unavailable });
    expect(result).toMatchObject({ endpointReachable: false, modelVisible: false, readinessStatus: "endpoint_unavailable" });
    expect(JSON.stringify(result)).not.toContain("network body");

    const absent = await runLocalProviderRuntimePreflightV0_1("openai_compat", "gemma3:4b", endpoint, true, { fetchImpl: fetchDouble({ data: [{ id: "llama3.1:8b" }] }, { models: [] }) });
    expect(absent.readinessStatus).toBe("model_not_visible");
  });

  test("rejects non-loopback and unsupported provider before HTTP", async () => {
    const fetchImpl = jest.fn() as unknown as typeof fetch;
    expect((await runLocalProviderRuntimePreflightV0_1("openai_compat", "gemma3:4b", "https://example.test/v1", true, { fetchImpl })).readinessStatus).toBe("non_loopback_endpoint");
    expect((await runLocalProviderRuntimePreflightV0_1("remote", "gemma3:4b", endpoint, true, { fetchImpl })).readinessStatus).toBe("provider_unsupported");
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  test("never calls semantic completion endpoints", async () => {
    const fetchImpl = fetchDouble(models, { models: [{ model: "gemma3:4b" }] });
    const result = await runLocalProviderRuntimePreflightV0_1("openai_compat", "gemma3:4b", endpoint, true, { fetchImpl });
    expect(result.readinessStatus).toBe("runtime_residency_ready");
    expect(fetchImpl.mock.calls.map(([url]) => String(url))).toEqual([`${endpoint.replace(/\/v1$/, "")}/v1/models`, "http://127.0.0.1:11434/api/ps"]);
    expect(fetchImpl.mock.calls.every(([url]) => !String(url).includes("chat/completions") && !String(url).includes("/generate"))).toBe(true);
  });
});
