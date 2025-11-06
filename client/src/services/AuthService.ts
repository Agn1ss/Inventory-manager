import $api from "../http";
import type { IUser } from "../models/interface/IUser";
import type { AuthResponse } from "../models/response/AuthResponse";

export default class AuthService {
  static async login(name: string, email: string, password: string) {
    try {
      return await $api.post<AuthResponse>("/login", { name, email, password });
    } catch (error) {
      throw error;
    }
  }

  static async registration(name: string, email: string, password: string) {
    try {
      return await $api.post<AuthResponse>("/registration", { name, email, password });
    } catch (error) {
      throw error;
    }
  }

  static async logout() {
    try {
      return await $api.post<AuthResponse>("/logout");
    } catch (error) {
      throw error;
    }
  }

  static async fetchCurrentUser() {
    try {
      return await $api.get<IUser>("/me");
    } catch (error) {
      throw error;
    }
  }
}