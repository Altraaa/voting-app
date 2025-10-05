import { IPackage } from "@/config/models/PackageModel";
import {
  PackageCreatePayload,
  PackageUpdatePayload,
} from "@/config/types/packageType";
import { ApiRequest } from "@/lib/api";

export const PackageRoute = {
  getAll: (): Promise<IPackage[]> =>
    ApiRequest({
      url: "package",
      method: "GET",
    }),

  getById: (id: string): Promise<IPackage> =>
    ApiRequest({
      url: `package/${id}`,
      method: "GET",
    }),

  create: (data: PackageCreatePayload): Promise<IPackage> =>
    ApiRequest({
      url: "package",
      method: "POST",
      body: data,
    }),

  update: (data: PackageUpdatePayload): Promise<IPackage> =>
    ApiRequest({
      url: "package",
      method: "PUT",
      body: data,
    }),
    
  remove: (id: string): Promise<IPackage> =>
    ApiRequest({
      url: "package",
      method: "DELETE",
      body: { id },
    }),
};
