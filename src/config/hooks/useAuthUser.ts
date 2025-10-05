import { IUsers } from "../models/UsersModel";
import { useUsers } from "./UsersHook/useUsers";

interface UseAuthReturnWithGuard {
  user: IUsers | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refetch: () => void;
  requireAuth: () => IUsers;
}

export const useAuthUser = (): UseAuthReturnWithGuard => {
  const { queries } = useUsers();
  const { data: user, isLoading, refetch } = queries.useGetProfile();
  const isAuthenticated = !!user;

  const requireAuth = () => {
    if (!user) {
      throw new Error("User must be authenticated");
    }
    return user;
  };

  return {
    user: user || null,
    isLoading,
    isAuthenticated,
    refetch,
    requireAuth,
  };
};