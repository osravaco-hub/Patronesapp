// User tier management (client-side simulation)
export type UserPlan = 'guest' | 'free' | 'premium';

export interface UserState {
  plan: UserPlan;
  email: string | null;
  isLoggedIn: boolean;
  downloadsToday: number;
  totalDownloads: number;
}

export const DOWNLOAD_LIMITS: Record<UserPlan, number> = {
  guest: 3,
  free: 10,
  premium: Infinity,
};

export const EXPORT_FORMATS: Record<UserPlan, string[]> = {
  guest: ['png-low'],
  free: ['png-low', 'png-high', 'svg'],
  premium: ['png-low', 'png-high', 'svg', 'png-ultra', 'pdf'],
};

export function canUsePattern(plan: UserPlan, isPremiumPattern: boolean): boolean {
  if (!isPremiumPattern) return true;
  return plan === 'premium';
}

export function canExport(plan: UserPlan, format: string): boolean {
  return EXPORT_FORMATS[plan].includes(format);
}

export function canDownload(plan: UserPlan, downloadsToday: number): boolean {
  return downloadsToday < DOWNLOAD_LIMITS[plan];
}

export function getRemainingDownloads(plan: UserPlan, downloadsToday: number): number {
  const limit = DOWNLOAD_LIMITS[plan];
  if (limit === Infinity) return Infinity;
  return Math.max(0, limit - downloadsToday);
}

export function getDefaultUser(): UserState {
  const stored = localStorage.getItem('geopattern_user');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // ignore
    }
  }
  return {
    plan: 'guest',
    email: null,
    isLoggedIn: false,
    downloadsToday: 0,
    totalDownloads: 0,
  };
}

export function saveUser(user: UserState) {
  localStorage.setItem('geopattern_user', JSON.stringify(user));
}

export function simulateLogin(email: string): UserState {
  const user: UserState = {
    plan: 'free',
    email,
    isLoggedIn: true,
    downloadsToday: 0,
    totalDownloads: 0,
  };
  saveUser(user);
  return user;
}

export function simulatePremiumUpgrade(user: UserState): UserState {
  const updated = { ...user, plan: 'premium' as UserPlan };
  saveUser(updated);
  return updated;
}

export function recordDownload(user: UserState): UserState {
  const updated = {
    ...user,
    downloadsToday: user.downloadsToday + 1,
    totalDownloads: user.totalDownloads + 1,
  };
  saveUser(updated);
  return updated;
}

export function resetDailyDownloads(user: UserState): UserState {
  const updated = { ...user, downloadsToday: 0 };
  saveUser(updated);
  return updated;
}
