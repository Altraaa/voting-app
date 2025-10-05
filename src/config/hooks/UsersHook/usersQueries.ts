import { useApiQuery } from "@/config/constants/useApiQuery";
import { UsersRoute } from "@/routes/usersRoute";
import { USER_QUERY_KEYS } from "./usersQueryKey";
import { IUsers } from "@/config/models/UsersModel";

export const useUserQueries = {
  useGetAllUsers: (filters?: string) =>
    useApiQuery<IUsers[]>(USER_QUERY_KEYS.list(filters), () =>
      UsersRoute.getAll()
    ),

  useGetUserById: (id: string) =>
    useApiQuery<IUsers>(
      USER_QUERY_KEYS.detail(id),
      () => UsersRoute.getById(id),
      { enabled: !!id }
    ),

  useGetProfile: () =>
    useApiQuery<IUsers>(
      USER_QUERY_KEYS.profile(),
      () => UsersRoute.getProfile(),
      {
        staleTime: 5 * 60 * 1000,
        retry: false,
      }
    ),

  useGetUserVoteHistory: () =>
    useApiQuery<IUsers[]>(
      USER_QUERY_KEYS.voteHistory("me"),
      () => UsersRoute.getUserVote()
    ),
};