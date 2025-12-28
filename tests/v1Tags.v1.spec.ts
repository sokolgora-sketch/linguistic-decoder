import { buildV1Tags } from "../src/shared/v1Tags.v1";

describe("v1Tags v1 — buildV1Tags", () => {
  it("returns both tags (stable shape)", () => {
    const tags = buildV1Tags("study");
    expect(tags).toMatchSnapshot();
  });

  it("returns nulls when no cluster applies", () => {
    const tags = buildV1Tags("damage");
    expect(tags).toMatchSnapshot();
  });

  it("detects Z cluster where applicable", () => {
    const tags = buildV1Tags("zemër");
    expect(tags).toMatchSnapshot();
  });
});
