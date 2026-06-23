import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
    persist(
        (set) => ({
            isAuthenticated: false,
            admin: null,
            setAuth: (isAuthenticated, admin) => set({ isAuthenticated, admin }),
            logout: () => set({ isAuthenticated: false, admin: null }),
        }),
        {
            name: "admin-auth",
            version: 2, // bump to clear stale sessions with no role field
            migrate: (persistedState, version) => {
                // If the stored state has no role on the admin, clear it
                if (!persistedState?.admin?.role) {
                    return { isAuthenticated: false, admin: null };
                }
                return persistedState;
            },
            partialize: (state) => ({ isAuthenticated: state.isAuthenticated, admin: state.admin }),
        }
    )
);
