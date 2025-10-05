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

export type UsersUpdatePayload = Partial<UsersBasePayload> & Pick<IUsers, "id">;

export type UsersUpdateProfilePayload = Partial<UsersBasePayload>;