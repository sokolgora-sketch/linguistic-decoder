// src/engine/principles.v2.ts

export type SevenVoiceId = "A" | "E" | "I" | "O" | "U" | "Y" | "Ë";

export type SevenPrinciple = {
  id: SevenVoiceId;
  principle: string;
  color: string;
  ring: 0 | 1 | 2 | 3;
  level: "high" | "mid" | "low";
  gender: "male" | "female" | "neutral";
  element: "fire" | "water" | "air" | "earth" | "ether";
  metal: "iron" | "copper" | "gold" | "silver" | "mercury" | "bronze" | "none";
  role: string;
  function: string;
  notes: string[];
};

export const PRINCIPLES_V2: Record<SevenVoiceId, SevenPrinciple> = {
  A: {
    id: "A",
    principle: "Truth / Source / Action",
    color: "#FF3B30",
    ring: 3,
    level: "high",
    gender: "male",
    element: "fire",
    metal: "iron",
    role: "Father tone, first strike",
    function: "initiate, cut, assert",
    notes: ["The first cry", "Action and assertion", "Sun-force"],
  },
  E: {
    id: "E",
    principle: "Expansion",
    color: "#FF9500",
    ring: 2,
    level: "high",
    gender: "female",
    element: "air",
    metal: "bronze",
    role: "Expansion of what A starts",
    function: "stretch, spread, radiate",
    notes: ["Connects and stretches", "Grows the field", "Radiates outward"],
  },
  I: {
    id: "I",
    principle: "Insight / Focus",
    color: "#FFCC00",
    ring: 1,
    level: "high",
    gender: "male",
    element: "air",
    metal: "gold",
    role: "Ray of understanding",
    function: "concentrate, see, discriminate",
    notes: ["A clear line of thought", "Focuses energy", "The 'I' of awareness"],
  },
  O: {
    id: "O",
    principle: "Balance / Mediator",
    color: "#34C759",
    ring: 0,
    level: "mid",
    gender: "neutral",
    element: "ether",
    metal: "none",
    role: "Heart, mediator of flows",
    function: "hold, contain, harmonize",
    notes: ["The central pivot", "Holds balance", "A container or field"],
  },
  U: {
    id: "U",
    principle: "Unity / Flow",
    color: "#007AFF",
    ring: 1,
    level: "low",
    gender: "male",
    element: "water",
    metal: "silver",
    role: "River of connection",
    function: "unify, bind, sustain",
    notes: ["Carries the flow", "Connects all parts", "The breath of the word"],
  },
  Y: {
    id: "Y",
    principle: "Network / Integrity",
    color: "#5856D6",
    ring: 2,
    level: "low",
    gender: "female",
    element: "ether",
    metal: "mercury",
    role: "Weaving connections",
    function: "link, branch, create paths",
    notes: ["Forms loops and networks", "Maintains structural integrity", "Weaves across the matrix"],
  },
  Ë: {
    id: "Ë",
    principle: "Evolution / Closure",
    color: "#AF52DE",
    ring: 3,
    level: "low",
    gender: "female",
    element: "earth",
    metal: "copper",
    role: "Mother tone, soft closure",
    function: "receive, transform, complete",
    notes: ["The completion of a cycle", "Birth of a new state", "The 'done' or formed unit"],
  },
} as const;
