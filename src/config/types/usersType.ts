import { IUsers } from "../models/UsersModel";

export type UsersBasePayload = Pick<
  IUsers,
  | "email"
  | "password"
  | "firstName"
  | "role"
  | "lastName"
  | "phone"
  | "terms"
  | "newsLetter"
  | "name"
>;

export type UsersCreatePayload = UsersBasePayload;

export type UsersUpdatePayload = Pick<IUsers, "id" | "name" | "role">;