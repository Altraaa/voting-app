import { IEvent } from "./EventModel";
import { IUsers } from "./UsersModel";

export interface IEventMember {
  id: string;
  userId: string;
  eventId: string;
  user: IUsers;
  event: IEvent;
  createdAt: string;
  updatedAt: string;
}