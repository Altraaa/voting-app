import { EventMember, StatusEvent } from "@/generated/prisma";
import { ICategories } from "./CategoriesModel";

export interface IEvent {
  id: string;
  name: string;
  description?: string;
  photo_url?: string;
  status: StatusEvent;
  startDate: string;
  endDate: string;
  isActive: boolean;
  categories: ICategories[];
  user: EventMember[];
  createdAt: string;
  updatedAt: string;
}