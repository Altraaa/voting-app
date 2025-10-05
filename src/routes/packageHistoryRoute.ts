import { IPackagePurchase } from "@/config/models/PackageHistoryModel";
import { PackageHistoryCreatePayload, PackageHistoryUpdatePayload } from "@/config/types/packageHistoryType";
import { ApiRequest } from "@/lib/api";

export const PackageHistoryRoute = {
  getAll: (): Promise<IPackagePurchase[]> =>
    ApiRequest({
      url: "package/history",
      method: "GET",
    }),

  getByUser: (userId: string): Promise<IPackagePurchase> =>
    ApiRequest({
      url: `package/history/by-user`,
      method: "GET",
      body: { userId },
  }),

  create: (data: PackageHistoryCreatePayload): Promise<IPackagePurchase> =>
    ApiRequest({
      url: "package/history",
      method: "POST",
      body: data,
    }),

  update: (data: PackageHistoryUpdatePayload): Promise<IPackagePurchase> =>
    ApiRequest({
      url: "package/history",
      method: "PUT",
      body: { data },
    }),
    
  remove: (id: string): Promise<IPackagePurchase> =>
    ApiRequest({
      url: "package/history",
      method: "DELETE",
      body: { id },
    }),
};
