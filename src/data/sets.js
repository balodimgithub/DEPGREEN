// Mock neighborhood/set data — stands in for the agent-side allocation
// system described in the spec's Terms Clarification section.
export const NEIGHBORHOODS = [
  {
    id: "n_ikeja",
    name: "Ikeja GRA",
    sets: [
      { id: "s_ikeja_1", name: "Set A — Oduduwa Way" },
      { id: "s_ikeja_2", name: "Set B — Isaac John St" },
    ],
  },
  {
    id: "n_lekki",
    name: "Lekki Phase 1",
    sets: [
      { id: "s_lekki_1", name: "Set A — Admiralty Way" },
      { id: "s_lekki_2", name: "Set B — Freedom Way" },
    ],
  },
  {
    id: "n_yaba",
    name: "Yaba",
    sets: [
      { id: "s_yaba_1", name: "Set A — Herbert Macaulay" },
      { id: "s_yaba_2", name: "Set B — Commercial Ave" },
    ],
  },
];
