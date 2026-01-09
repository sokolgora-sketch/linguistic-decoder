import { buildOriginClaimSupportStub } from "@/engine/originClaimSupport.stub";

describe("origin claim support guard", () => {
  it("support refs do not imply ranking or truth", () => {
    const support = buildOriginClaimSupportStub("claim:test");

    expect(support.refs).toEqual([]);
    expect(support).toHaveProperty("claimId");
  });
});
