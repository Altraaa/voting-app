import { IPackagePurchase } from "../models/PackageHistoryModel";

export type PackageHistoryBasePayload = Pick<
  IPackagePurchase,
  "userId" | "packageId" | "pointsReceived" | "validUntil"
>;

export type PackageHistoryCreatePayload = PackageHistoryBasePayload;
export type PackageHistoryUpdatePayload = Partial<PackageHistoryBasePayload> &
  Pick<IPackagePurchase, "id">;
