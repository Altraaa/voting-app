import { IUsers } from "../models/UsersModel";

export type RegisterPayload = Pick<
  IUsers,
  | "email"
  | "password"
  | "firstName"
  | "lastName"
  | "phone"
  | "terms"
  | "newsLetter"
  | "name"
>;