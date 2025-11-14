
// Drops undefined recursively by serializing; preserves primitives/arrays/objects.
// Do NOT include firebase FieldValue sentinels in the object you pass in.
export function sanitizeForFirestore<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}
