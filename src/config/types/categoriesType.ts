import { ICategories } from "../models/CategoriesModel";

export type CategoriesBasePayload = Omit<ICategories, "id" | "created" | "updated">;
export type CategoriesCreatePayload = Pick<ICategories, "name">;
export type CategoriesUpdatePayload = Pick<ICategories, "id" | "name">;