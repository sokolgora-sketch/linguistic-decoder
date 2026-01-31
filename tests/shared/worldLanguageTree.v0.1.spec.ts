import { WORLD_LANGUAGE_TREE_V01 } from "@/shared/worldLanguageTree.v0.1";

function hasCycle(nodes: Record<string, any>, rootId: string): boolean {
  const visiting = new Set<string>();
  const visited = new Set<string>();

  function dfs(id: string): boolean {
    if (visiting.has(id)) return true;
    if (visited.has(id)) return false;
    visiting.add(id);

    const node = nodes[id];
    const kids: string[] = Array.isArray(node?.childrenIds) ? node.childrenIds : [];
    for (const k of kids) {
      if (!nodes[k]) continue;
      if (dfs(k)) return true;
    }

    visiting.delete(id);
    visited.add(id);
    return false;
  }

  return dfs(rootId);
}

describe("WORLD_LANGUAGE_TREE_V01", () => {
  it("has stable version and root", () => {
    expect(WORLD_LANGUAGE_TREE_V01.version).toBe("world_language_tree.v0.1");
    expect(WORLD_LANGUAGE_TREE_V01.rootId).toBe("world");
  });

  it("has unique node ids matching keys", () => {
    const keys = Object.keys(WORLD_LANGUAGE_TREE_V01.nodes);
    const ids = keys.map((k) => WORLD_LANGUAGE_TREE_V01.nodes[k].id);

    // key matches id (strongest guarantee)
    for (const k of keys) {
      expect(WORLD_LANGUAGE_TREE_V01.nodes[k].id).toBe(k);
    }

    // unique
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("is acyclic from root", () => {
    expect(hasCycle(WORLD_LANGUAGE_TREE_V01.nodes, WORLD_LANGUAGE_TREE_V01.rootId)).toBe(false);
  });
});
