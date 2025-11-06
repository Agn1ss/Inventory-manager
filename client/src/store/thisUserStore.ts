import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { IUser } from "../models/interface/IUser";
import AuthService from "../services/AuthService";
import UserService from "../services/UserService";
import { eventBus } from "../http/events";

type AccessLevel = "OWNER" | "EDITOR" | "NONE";

interface UserState {
  user: IUser | null;
  isAuth: boolean;
  setUser: (user: IUser) => void;
  fetchCurrentUser: () => Promise<void>; // новый метод
  login: (name: string, email: string, password: string) => Promise<void>;
  registration: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;

  getInventoryAccessLevel: (inventoryId: string, ownerId: string) => Promise<AccessLevel>;
}

export const useThisUserStore = create<UserState>()(
  persist(
    (set, get) => {
      eventBus.on("logout", () => {
        set({ user: null, isAuth: false });
      });

      return {
        user: null,
        isAuth: false,

        setUser: user => set({ user, isAuth: true }),

        fetchCurrentUser: async () => {
          try {
            const response = await AuthService.fetchCurrentUser();
            set({ user: response.data.user, isAuth: true });
          } catch (err) {
            set({ user: null, isAuth: false });
          }
        },

        login: async (name, email, password) => {
          const response = await AuthService.login(name, email, password);
          localStorage.setItem("token", response.data.accessToken);
          set({ user: response.data.user, isAuth: true });
        },

        registration: async (name, email, password) => {
          const response = await AuthService.registration(name, email, password);
          localStorage.setItem("token", response.data.accessToken);
          set({ user: response.data.user, isAuth: true });
        },

        logout: async () => {
          await AuthService.logout();
          localStorage.removeItem("token");
          set({ user: null, isAuth: false });
        },

        getInventoryAccessLevel: async (inventoryId: string, ownerId: string): Promise<AccessLevel> => {
          const user = get().user;

          if (!user) return "NONE";

          if (user.role === "ADMIN" || user.id === ownerId) return "OWNER";

          try {
            const res = await UserService.fetchInventoryEditors(inventoryId, "", 0, 100, "name");
            const isEditor = res.data.some(u => u.id === user.id);
            return isEditor ? "EDITOR" : "NONE";
          } catch (err) {
            console.error(err);
            return "NONE";
          }
        },
      };
    },
    { name: "this-user-store" }
  )
);
