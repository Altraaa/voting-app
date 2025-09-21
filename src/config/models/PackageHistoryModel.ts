import { IPackage } from "./PackageModel";
import { IUsers } from "./UsersModel";

export interface IPackagePurchase {
  id: string;
  userId: string;
  packageId: string;
  purchaseDate: string; 
  pointsReceived: number;
  validUntil: Date; 
  isActive: boolean;
  package: IPackage;
  user: IUsers;
  createdAt: string; 
  updatedAt: string;
}
