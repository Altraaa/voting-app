import { SupportType } from "@/generated/prisma";

export interface IPackage {
  id: string;
  name: string;
  description?: string;
  points: number;
  price: number;
  originalPrice?: number;
  validityDays: number;
  supportType: SupportType;
  bonusPercentage?: number;
  earlyAccess: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}