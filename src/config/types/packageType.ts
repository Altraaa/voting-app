import { IPackage } from "../models/PackageModel";

export type PackageBasePayload = Omit<IPackage, "id" | "isActive" | "createdAt" | "updatedAt">;

export type PackageCreatePayload = PackageBasePayload;

export type PackageUpdatePayload = Partial<PackageBasePayload> &
  Pick<IPackage, "id">;
