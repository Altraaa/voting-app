import { ICategories } from "../models/CategoriesModel";

export type CategoriesBasePayload = Pick<
  ICategories,
  "name" | "photo_url" | "eventId"
>;
export type CategoriesCreatePayload = CategoriesBasePayload;
export type CategoriesUpdatePayload = CategoriesBasePayload & Pick<ICategories, "id" >;