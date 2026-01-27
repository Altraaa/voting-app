import { EventMember, StatusEvent } from "@/generated/prisma";
import { ICategories } from "./CategoriesModel";

export interface IEvent {
  id: string;
  name: string;
  description: string;
  photo_url: string;
  status: StatusEvent;
  startDate: string;
  endDate: string;
  isActive: boolean;
  pointsPerVote: number; // 1 = 1 point per vote, 2 = 2 points per vote
  _count?: { candidates: number };
  categories: ICategories[];
  users: EventMember[];
  createdAt: string;
  updatedAt: string;
}