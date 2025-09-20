import { ICategories } from "../models/CategoriesModel";

export type CategoriesCreatePayload = Pick<ICategories, "name">;
export type CategoriesUpdatePayload = Pick<ICategories, "id" | "name">;