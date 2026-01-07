export function toPrettyJson(x: unknown) {
    try {
      return JSON.stringify(x, null, 2);
    } catch {
      return String(x);
    }
  }