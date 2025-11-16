import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

// Use sessionStorage for tab isolation - each tab has its own session
// This allows different users to login in different tabs
const useAuthStoreBase = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: (user, token) =>
        set({ user, token }),
      logout: () =>
        set({ user: null, token: null }),
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage), // Changed to sessionStorage for tab isolation
      // Only persist user and token, not functions
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);

// Export with computed isAuthenticated getter
export const useAuthStore = () => {
  const store = useAuthStoreBase();
  
  // Computed property - check if user and token exist
  const isAuthenticated = () => {
    // Check store first
    if (store.user && store.token) {
      return true;
    }
    
    // Fallback: check sessionStorage directly (for hydration issues)
    try {
      const stored = sessionStorage.getItem("auth-storage");
      if (stored) {
        const parsed = JSON.parse(stored);
        return !!(parsed?.state?.user && parsed?.state?.token);
      }
    } catch (e) {
      // Ignore parse errors
    }
    
    return false;
  };
  
  return {
    ...store,
    isAuthenticated,
  };
};

