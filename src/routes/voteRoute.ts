import { IVotes } from "@/config/models/VotesModel";
import { VoteCreatePayload } from "@/config/types/voteType";
import { ApiRequest } from "@/lib/api";

export const VoteRoute = {
  getAll: (): Promise<IVotes[]> =>
    ApiRequest({
      url: "votes",
      method: "GET",
    }),
    
  create: (data: VoteCreatePayload): Promise<IVotes> =>
    ApiRequest({
      url: "votes",
      method: "POST",
      body: data,
    }),
};
