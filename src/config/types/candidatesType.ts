import { ICandidate } from "../models/CandidateModel";

export type CandidatesCreatePayload = Pick<ICandidate, "name" | "categoryId">;
export type CandidatesUpdatePayload = Pick<
  ICandidate,
  "id" | "name" | "categoryId"
>;