import $api from "../http";
import type { IUser } from "../models/interface/IUser";

export default class UserService {
  static fetchUsers(search: string, skip: number, take: number, sortBy: string) {
    return $api.get<IUser[]>("/users", {
      params: { search, skip, take, sortBy },
    });
  }

  static blockUser(id: string) {
    return $api.patch(`/users/${id}/block`);
  }

  static unlockUser(id: string) {
    return $api.patch(`/users/${id}/unlock`);
  }

  static deleteUser(id: string) {
    return $api.delete(`/users/${id}`);
  }

  static changeUserRole(id: string, role: String) {
    return $api.patch(`/users/${id}/changeRole`, { role });
  }

  static fetchInventoryEditors(
    id: string,
    search: string,
    skip: number,
    take: number,
    sortBy: string
  ) {
    return $api.get<IUser[]>(`/${id}/editors`, {
      params: { search, skip, take, sortBy },
    });
  }
}
