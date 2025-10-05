import { CandidateDetailResponse, CandidateResponse } from "@/config/types/responseType";
import { CANDIDATE_QUERY_KEYS } from "./candidateQueryKey";
import { CandidateRoute } from "@/routes/candidateRoute";
import { useApiQuery } from "@/config/constants/useApiQuery";

export const useCandidateQueries = {
  useGetAllCandidates: (filters?: string) =>
    useApiQuery<CandidateResponse>(CANDIDATE_QUERY_KEYS.list(filters), () =>
      CandidateRoute.getAll()
    ),

  useGetCandidateById: (id: string) =>
    useApiQuery<CandidateDetailResponse>(
      CANDIDATE_QUERY_KEYS.detail(id),
      () => CandidateRoute.getById(id),
      { enabled: !!id }
    ),

  useGetCandidatesByCategoryId: (categoryId: string) =>
    useApiQuery<CandidateResponse>(
      CANDIDATE_QUERY_KEYS.byCategory(categoryId),
      () => CandidateRoute.getByCategoryId(categoryId),
      { enabled: !!categoryId }
    ),
};
