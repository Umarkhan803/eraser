import { create } from "zustand";
import type { User } from "../types/Interface";
import { signUpUser } from "../services/api";

export const useStore = create((set, get) => {
  const signUpHandler = async (data: User) => {
    try {
      const response = await signUpUser(data);
      if (response.data.success) {
        set({ user: response.data });
      }
    } catch (error) {
      console.log(error);
    }
  };
});
