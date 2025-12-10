import type { PublicShareRecord } from "@/lib/publicShare.types";

export interface PublicShareStore {
  save(record: PublicShareRecord): Promise<void>;
  get(id: string): Promise<PublicShareRecord | null>;
}

/**
 * Simple in-memory store for now.
 * Later we can swap this to Firestore without touching callers.
 */
const memory = new Map<string, PublicShareRecord>();

export const inMemoryPublicShareStore: PublicShareStore = {
  async save(record) {
    memory.set(record.id, record);
  },
  async get(id) {
    return memory.get(id) ?? null;
  },
};

export async function savePublicShare(record: PublicShareRecord) {
  return inMemoryPublicShareStore.save(record);
}

export async function loadPublicShare(id: string) {
  return inMemoryPublicShareStore.get(id);
}
