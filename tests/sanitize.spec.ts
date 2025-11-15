
import { sanitizeForFirestore } from "@/lib/sanitize";

test("sanitize drops undefined recursively", () => {
  const dirty = { a:1, b:undefined, c:{ d:2, e:undefined }, f:[1, undefined, 3] as any };
  const clean = sanitizeForFirestore(dirty);
  expect(clean).toEqual({ a:1, c:{ d:2 }, f:[1, null, 3] }); // JSON roundtrip turns array holes into null
});

    