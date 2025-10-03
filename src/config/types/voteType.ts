import { IVotes } from "../models/VotesModel";

export type VoteCreatePayload = Pick<IVotes, "candidateId" | "pointUsed">;
