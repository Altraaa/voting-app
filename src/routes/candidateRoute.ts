import { ICandidate } from "@/config/models/CandidateModel";
import { CandidatesCreatePayload, CandidatesUpdatePayload } from "@/config/types/candidatesType";
import { ApiRequest } from "@/lib/api";

export const CandidateRoute = {
  getAll: (): Promise<ICandidate> =>
    ApiRequest({
      url: "candidates",
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