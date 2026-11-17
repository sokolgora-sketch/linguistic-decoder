/** Matches an Albanian source form using the Workbench's existing NFC, trim, and sq-AL case convention. */
export function sameAlbanianSourceForm(left: string, right: string): boolean {
  return left.normalize("NFC").trim().toLocaleLowerCase("sq-AL") ===
    right.normalize("NFC").trim().toLocaleLowerCase("sq-AL");
}
