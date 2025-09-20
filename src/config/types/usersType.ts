import { IUsers } from "../models/UsersModel";

export type UsersCreatePayload = Pick<
  IUsers,
  "email" | "name" | "password" | "role"
>;

export type UsersUpdatePayload = Pick<IUsers, "id" | "name" | "role">;