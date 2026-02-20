import battery from "./__fixtures__/maskVsCarrierGeometryBattery.v0.2.json";
import { extractOrthographyVoicesFromWordV0_1 } from "@/shared/vowels/extractOrthographyVoicesFromWord.v0.1";
import { extractCarrierVoicesFromIpaV0_1 } from "@/shared/vowels/extractCarrierVoicesFromIpa.v0.1";
import { vectorDeltaSummaryV0_1 } from "@/shared/geometry/vectorDeltaSummary.v0.1";

type Row = { id: string; word: string; ipa: string };

test("Mask vs Carrier Geometry Battery v0.2 (snapshot lock)", () => {
  const rows = (battery as unknown as Row[]).map((r) => {
    const mask = extractOrthographyVoicesFromWordV0_1(r.word);
    const carrier = extractCarrierVoicesFromIpaV0_1(r.ipa);

    const maskVoices = (mask as any)?.voices ?? [];
    const carrierVoices = (carrier as any)?.voices ?? [];

    const maskGeom = vectorDeltaSummaryV0_1(Array.isArray(maskVoices) ? maskVoices : []);
    const carrierGeom = vectorDeltaSummaryV0_1(Array.isArray(carrierVoices) ? carrierVoices : []);

    return {
      id: r.id,
      in: { word: r.word, ipa: r.ipa },
      mask: { voices: maskVoices, signature: maskGeom.signature, totals: maskGeom.totals },
      carrier: { voices: carrierVoices, signature: carrierGeom.signature, totals: carrierGeom.totals }
    };
  });

  expect(rows).toMatchSnapshot();
});
