export type PublicShareRecord = {
  id: string;           // permalink / doc id
  word: string;         // analyzed word
  createdAt: string;    // ISO timestamp

  engineLabel: string;  // e.g. "SevenVoices Core"
  heartSummary: string; // one-line heart summary

  zhejiSummary?: string;
  symbolicSummary?: string;

  version: "v1";        // for future migrations
};