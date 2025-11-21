// src/engine/principles.v2.ts

export type PrincipleId = "A" | "E" | "I" | "O" | "U" | "Y" | "Ë";

export interface PrincipleV2 {
  id: PrincipleId;
  name: string;
  coreWord: string;
  color: string;          // semantic color, you already know the palette
  ring: "outer" | "middle" | "inner" | "core";
  role: string;           // short archetype
  coreQuestion: string;   // the main check this principle asks
  healthyUse: string;     // what this principle should do
  shadowUse: string;      // what happens when it dominates / is distorted
}

export const PRINCIPLES_V2: PrincipleV2[] = [
  {
    id: "A",
    name: "Truth / Origin",
    coreWord: "Truth",
    color: "red",
    ring: "outer",
    role: "Father / Source",
    coreQuestion: "Is this the cleanest, most honest statement of what it is?",
    healthyUse:
      "Name things precisely, cut noise, define units and actions clearly.",
    shadowUse:
      "Dogma and rigidity; assumes its own frame is the only truth and cuts away too much."
  },
  {
    id: "E",
    name: "Expansion / Reach",
    coreWord: "Expansion",
    color: "orange",
    ring: "middle",
    role: "Breath / Horizon",
    coreQuestion: "Have we explored enough possibilities and directions?",
    healthyUse:
      "Open options, search alternatives, see a wider field before locking in.",
    shadowUse:
      "Endless branching and inflation; no decision, everything keeps expanding."
  },
  {
    id: "I",
    name: "Insight / Focus",
    coreWord: "Insight",
    color: "yellow",
    ring: "inner",
    role: "Beam / Eye / Nerve",
    coreQuestion: "What pattern or rule actually explains this?",
    healthyUse:
      "Compress complexity into a simple rule or pattern; pick the minimal explanation.",
    shadowUse:
      "Over-analysis and clever models that drift away from reality on the ground."
  },
  {
    id: "O",
    name: "Balance / Center",
    coreWord: "Balance",
    color: "green",
    ring: "core",
    role: "Heart / Mediator",
    coreQuestion: "Is the system in balance and self-consistent?",
    healthyUse:
      "Reconcile tensions fairly, stabilize the structure, keep both sides in view.",
    shadowUse:
      "Compromises everything; avoids sharp decisions even when they’re needed."
  },
  {
    id: "U",
    name: "Unity / Cohesion",
    coreWord: "Unity",
    color: "blue",
    ring: "inner",
    role: "Body / River",
    coreQuestion: "Does this hold together as one working body?",
    healthyUse:
      "Connect parts, ensure continuous flow, apply the same rules across the whole.",
    shadowUse:
      "Smears important differences, drifts into groupthink and over-fusion."
  },
  {
    id: "Y",
    name: "Network Integrity",
    coreWord: "Network",
    color: "indigo",
    ring: "middle",
    role: "Web / Grid / Circuit",
    coreQuestion: "Are all links, references, and interfaces honest and solid?",
    healthyUse:
      "Track relationships, dependencies, and interfaces; keep the web honest.",
    shadowUse:
      "Paranoid or over-wired system; obsessed with links and signals everywhere."
  },
  {
    id: "Ë",
    name: "Evolution / Outcome",
    coreWord: "Evolution",
    color: "violet",
    ring: "outer",
    role: "Mother / Womb",
    coreQuestion: "What does this become over time, and is that the right final form?",
    healthyUse:
      "Check lifecycle, consequence, and maturation; hold a long-term arc in view.",
    shadowUse:
      "Hides everything in ‘future evolution’ and avoids real commitments now, or forces a single destiny."
  }
];
