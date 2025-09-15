import { IUsers } from "../models/UsersModel";

export type LoginPayload = Pick<IUsers, "email" | "password">;