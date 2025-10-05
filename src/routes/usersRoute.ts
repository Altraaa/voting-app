import { IUsers } from "@/config/models/UsersModel";
import {
  UsersCreatePayload,
  UsersUpdatePayload,
  UsersUpdateProfilePayload,
} from "@/config/types/usersType";
import { ApiRequest } from "@/lib/api";

export const UsersRoute = {
  getAll: (): Promise<IUsers[]> =>
    ApiRequest({
      url: "users",
      method: "GET",
    }),

  getById: (id: string): Promise<IUsers> =>
    ApiRequest({
      url: `users/${id}`,
      method: "GET",
    }),

  getProfile: (): Promise<IUsers> =>
    ApiRequest({
      url: "users/profile",
      method: "GET",
    }),

  getUserVote: (): Promise<IUsers[]> =>
    ApiRequest({
      url: "users/vote",
      method: "GET",
    }),

  create: (data: UsersCreatePayload): Promise<IUsers> =>
    ApiRequest({
      url: "users",
      method: "POST",
      body: data,
    }),

  update: (data: UsersUpdatePayload): Promise<IUsers> =>
    ApiRequest({
      url: "users",
      method: "PUT",
      body: data,
    }),

  updateProfile: (data: UsersUpdateProfilePayload): Promise<IUsers> =>
    ApiRequest({
      url: "users/profile",
      method: "PUT",
      body: data,
    }),

  remove: (id: string): Promise<IUsers> =>
    ApiRequest({
      url: "users",
      method: "DELETE",
      body: { id },
    }),
};