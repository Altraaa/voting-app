import { EventMember } from "@/generated/prisma";
import { ICategories } from "./CategoriesModel";

export interface IEvent {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  categories: ICategories[];
  user: EventMember[];
  createdAt: string;
  updatedAt: string;
}