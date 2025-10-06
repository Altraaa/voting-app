import { POINT_VOTES_QUERY_KEYS } from "./pointVotesQueryKey";
import { PointVotesRoute } from "@/routes/pointVotesRoute";
import { useApiQuery } from "@/config/constants/useApiQuery";
import { IPointVotes } from "@/config/models/PointVotesModel";

export const usePointVotesQueries = {
  useGetAllPointVotes: (filters?: string) =>
    useApiQuery<IPointVotes[]>(
      POINT_VOTES_QUERY_KEYS.list(filters),
      () => PointVotesRoute.getAll(),
      {
        staleTime: 5 * 60 * 1000,
      }
    ),

  useGetPointVoteById: (id: string) =>
    useApiQuery<IPointVotes>(
      POINT_VOTES_QUERY_KEYS.detail(id),
      () => PointVotesRoute.getById(id),
      {
        enabled: !!id,
        staleTime: 2 * 60 * 1000, 
      }
    ),
};
