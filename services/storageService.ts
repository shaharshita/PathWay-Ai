
import { AppState, User, ResumeAnalysis, CareerPath } from "../types";

const STORAGE_KEY = "pathway_ai_data";

export const storageService = {
  saveSession: (data: Partial<AppState>) => {
    const existing = storageService.getSession();
    const updated = { ...existing, ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  getSession: (): Partial<AppState> => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  },

  clearSession: () => {
    localStorage.removeItem(STORAGE_KEY);
  },

  // Mock Supabase methods
  async signUp(user: User) {
    storageService.saveSession({ user });
    return { error: null };
  },

  async login(email: string) {
    const user: User = { id: '1', email, name: email.split('@')[0] };
    storageService.saveSession({ user });
    return { data: { user }, error: null };
  }
};
