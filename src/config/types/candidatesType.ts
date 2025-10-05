import { ICandidate } from "../models/CandidateModel";

export type CandidatesBasePayload = Pick<ICandidate, "name" | "categoryId" | "description" | "photo_url">;

export type CandidatesCreatePayload = CandidatesBasePayload;

export type CandidatesUpdatePayload = Partial<CandidatesBasePayload> & Pick<ICandidate, "id">;