import { ICategories } from "@/config/models/CategoriesModel";
import { CandidatesCreatePayload, CandidatesUpdatePayload } from "@/config/types/candidatesType";
import { ApiRequest } from "@/lib/api";

export const CategoriesRoute = {
  getAll: (): Promise<ICategories> =>
    ApiRequest({
      url: "categories",
      method: "GET",
    }),
  create: (data: CandidatesCreatePayload): Promise<ICategories> =>
    ApiRequest({
      url: "categories",
      method: "POST",
      body: data,
    }),
  update: (data: CandidatesUpdatePayload): Promise<ICategories> =>
    ApiRequest({
      url: "categories",
      method: "PUT",
      body: data,
    }),
  remove: (id: string): Promise<ICategories> =>
    ApiRequest({
      url: `categories/${id}`,
      method: "DELETE",
    }),
};
