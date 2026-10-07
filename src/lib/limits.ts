// Download limits and tracking
import { UserPlan, DOWNLOAD_LIMITS } from './userTier';

export interface DownloadRecord {
  id: string;
  patternType: string;
  format: string;
  timestamp: number;
}

export function getDownloadHistory(): DownloadRecord[] {
  const stored = localStorage.getItem('geopattern_downloads');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  return [];
}

export function addDownloadRecord(patternType: string, format: string): DownloadRecord {
  const record: DownloadRecord = {
    id: crypto.randomUUID?.() || Math.random().toString(36).slice(2),
    patternType,
    format,
    timestamp: Date.now(),
  };
  const history = getDownloadHistory();
  history.unshift(record);
  // Keep only last 100 records
  const trimmed = history.slice(0, 100);
  localStorage.setItem('geopattern_downloads', JSON.stringify(trimmed));
  return record;
}

export function getTodayDownloads(): number {
  const history = getDownloadHistory();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return history.filter((r) => r.timestamp >= today.getTime()).length;
}

export function isLimitReached(plan: UserPlan): boolean {
  const limit = DOWNLOAD_LIMITS[plan];
  if (limit === Infinity) return false;
  return getTodayDownloads() >= limit;
}

export function getLimitInfo(plan: UserPlan): { used: number; limit: number | string; percentage: number } {
  const limit = DOWNLOAD_LIMITS[plan];
  const used = getTodayDownloads();
  if (limit === Infinity) {
    return { used, limit: '∞', percentage: 0 };
  }
  return { used, limit, percentage: Math.min(100, (used / limit) * 100) };
}
