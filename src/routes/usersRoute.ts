import { IUsers } from "@/config/models/UsersModel";
import { UsersCreatePayload } from "@/config/types/usersType";
import { ApiRequest } from "@/lib/api";

export const UsersRoute = {
  getAll: (): Promise<IUsers> =>
    ApiRequest({
      url: "users",
      method: "GET",
    }),
  create: (data: UsersCreatePayload): Promise<IUsers> =>
    ApiRequest({
      url: "users",
      method: "POST",
      body: data,
    }),
  update: (data: UsersCreatePayload): Promise<IUsers> =>
    ApiRequest({
      url: "users",
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
