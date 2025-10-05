import { useApiQuery } from "@/config/constants/useApiQuery";
import {
  CategoriesDetailResponse,
  CategoriesResponse,
} from "@/config/types/responseType";
import { CATEGORY_QUERY_KEYS } from "./categoryQueryKey";
import { CategoriesRoute } from "@/routes/categoriesRoute";
import { ICategories } from "@/config/models/CategoriesModel";

export const useCategoryQueries = {
  useGetAllCategories: (filters?: string) =>
    useApiQuery<CategoriesResponse>(CATEGORY_QUERY_KEYS.list(filters), () =>
      CategoriesRoute.getAll()
    ),

  useGetAllSimpleEvents: (filters?: string) =>
    useApiQuery<ICategories[]>(CATEGORY_QUERY_KEYS.simpleList(filters), () =>
      CategoriesRoute.getAllSimple()
    ),

  useGetCategoryById: (id: string) =>
    useApiQuery<CategoriesDetailResponse>(
      CATEGORY_QUERY_KEYS.detail(id),
      () => CategoriesRoute.getById(id),
      {
        enabled: !!id,
      }
    ),
};
