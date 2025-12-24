import { create } from "zustand";
import type { User } from "../types/Interface";

export const useStore = create((set) => ({
  user: null,
  setUser: (user: User) => set({ user }),
}));
