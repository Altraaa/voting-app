import { ICandidate } from "@/config/models/CandidateModel";
import {
  CandidatesCreatePayload,
  CandidatesUpdatePayload,
} from "@/config/types/candidatesType";
import { CandidateDetailResponse } from "@/config/types/responseType";
import { ApiRequest } from "@/lib/api";

export const CandidateRoute = {
  getAll: (): Promise<ICandidate[]> =>
    ApiRequest({
      url: "candidates",
      method: "GET",
    }),

  getById: (id: string): Promise<CandidateDetailResponse> =>
    ApiRequest({
      url: `candidates/${id}`,
      method: "GET",
    }),

  getByCategoryId: (categoryId: string): Promise<ICandidate[]> =>
    ApiRequest({
      url: `candidates/category/${categoryId}`,
      method: "GET",
    }),

  create: (data: CandidatesCreatePayload): Promise<ICandidate> =>
    ApiRequest({
      url: "candidates",
      method: "POST",
      body: data,
    }),

  update: (data: CandidatesUpdatePayload): Promise<ICandidate> =>
    ApiRequest({
      url: "candidates",
      method: "PUT",
      body: data,
    }),

  remove: (id: string): Promise<ICandidate> =>
    ApiRequest({
      url: "candidates",
      method: "DELETE",
      body: { id },
    }),
};