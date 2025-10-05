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

export type LoginPayload = Pick<IUsers, "email" | "password">;

export type AuthResponse = Pick<IUsers, "id" | "email" | "name" | "role">;

export type RegisterForm = RegisterPayload & { confirmPassword: string };

export type LoginForm = LoginPayload & { rememberMe: boolean };