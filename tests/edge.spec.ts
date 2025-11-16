
import { readEdgeWindows } from "@/functions/sevenVoicesC";
import { chooseProfile } from "@/functions/languages";

test("edge windows: hope", () => {
  const profile = chooseProfile("hope", undefined);
  const e = readEdgeWindows("hope", profile);
  // prefix 'h' usually NonSibilantFricative, suffix '' (none) or 'e' not a consonant
  expect(e.prefix?.raw?.toLowerCase()).toBe("h");
  expect(typeof e.prefix?.cls).toBe("string");
});
