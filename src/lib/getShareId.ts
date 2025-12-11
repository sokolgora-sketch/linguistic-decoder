import { customAlphabet } from "nanoid";

const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";
const nanoid = customAlphabet(alphabet, 10);

/**
 * Generates a URL-friendly share ID.
 * Not guaranteed to be unique, but collision risk is low for this use case.
 */
export function getShareId(): string {
  return nanoid();
}
