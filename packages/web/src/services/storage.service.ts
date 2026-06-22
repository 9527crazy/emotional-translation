import Dexie, { type Table } from 'dexie';
import type { EmotionResult } from '@emotional-translation/shared';

interface EmotionRecord {
  id?: number;
  timestamp: number;
  emotions: EmotionResult['emotions'];
  dominant: string;
  confidence: number;
}

class EmotionDatabase extends Dexie {
  records!: Table<EmotionRecord>;

  constructor() {
    super('EmotionalTranslationDB');
    this.version(1).stores({
      records: '++id, timestamp, dominant',
    });
  }
}

const db = new EmotionDatabase();

class StorageService {
  async saveRecord(result: EmotionResult): Promise<void> {
    try {
      await db.records.add({
        timestamp: result.timestamp,
        emotions: result.emotions,
        dominant: result.dominant,
        confidence: result.confidence,
      });
    } catch (err) {
      console.error('[Storage] Save failed:', err);
    }
  }

  async getRecords(startTime: number, endTime: number): Promise<EmotionRecord[]> {
    return db.records
      .where('timestamp')
      .between(startTime, endTime, true, true)
      .toArray();
  }

  async getTodayRecords(): Promise<EmotionRecord[]> {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    return this.getRecords(startOfDay, Date.now());
  }

  async getRecordCount(): Promise<number> {
    return db.records.count();
  }

  async clearAll(): Promise<void> {
    await db.records.clear();
  }
}

export const storageService = new StorageService();
