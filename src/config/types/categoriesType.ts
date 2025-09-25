import { ICategories } from "../models/CategoriesModel";

export type CategoriesBasePayload = Omit<
  ICategories,
  "id" | "created" | "updated" | "event" | "candidates"
>;
export type CategoriesCreatePayload = CategoriesBasePayload;
export type CategoriesUpdatePayload = Pick<ICategories, "id" | "name">;