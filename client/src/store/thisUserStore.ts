import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { IUser } from "../models/interface/IUser";
import AuthService from "../services/AuthService";
import { eventBus } from "../http/events";

interface UserState {
  user: IUser | null;
  isAuth: boolean;
  setUser: (user: IUser) => void;
  login: (name: string, email: string, password: string) => Promise<void>;
  registration: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useThisUserStore = create<UserState>()(
  persist(
    set => {
      eventBus.on("logout", () => {
        set({ user: null, isAuth: false });
      });

      return {
        user: null,
        isAuth: false,

        setUser: user => set({ user, isAuth: true }),

        login: async (name, email, password) => {
          try {
            const response = await AuthService.login(name, email, password);
            localStorage.setItem("token", response.data.accessToken);
            set({ user: response.data.user, isAuth: true });
          } catch (e: any) {
            throw e;
          }
        },

        registration: async (name, email, password) => {
          try {
            const response = await AuthService.registration(name, email, password);
            localStorage.setItem("token", response.data.accessToken);
            set({ user: response.data.user, isAuth: true });
          } catch (e: any) {
            throw e;
          }
        },

        logout: async () => {
          try {
            await AuthService.logout();
            localStorage.removeItem("token");
            set({ user: null, isAuth: false });
          } catch (e: any) {
            throw e;
          }
        },
      };
    },
    {
      name: "this-user-store",
    }
  )
);
function t(arg0: string): import("react-hot-toast").Renderable | import("react-hot-toast").ValueFunction<import("react-hot-toast").Renderable, import("react-hot-toast").Toast> {
  throw new Error("Function not implemented.");
}

