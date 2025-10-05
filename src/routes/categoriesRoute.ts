import { ICategories } from "@/config/models/CategoriesModel";
import { CategoriesCreatePayload, CategoriesUpdatePayload } from "@/config/types/categoriesType";
import { ApiRequest } from "@/lib/api";

export const CategoriesRoute = {
  getAll: (): Promise<ICategories[]> =>
    ApiRequest({
      url: "categories",
      method: "GET",
    }),

  getAllSimple: (): Promise<ICategories[]> =>
    ApiRequest({
      url: "categories/simple",
      method: "GET",
  }),

  getById: (id: string): Promise<ICategories> =>
    ApiRequest({
      url: `categories/${id}`,
      method: "GET"
    }),

  create: (data: CategoriesCreatePayload): Promise<ICategories> =>
    ApiRequest({
      url: "categories",
      method: "POST",
      body: data,
    }),

  update: (data: CategoriesUpdatePayload): Promise<ICategories> =>
    ApiRequest({
      url: "categories",
      method: "PUT",
      body: data,
    }),
    
  remove: (id: string): Promise<ICategories> =>
    ApiRequest({
      url: "categories",
      method: "DELETE",
      body: { id },
    }),
};
