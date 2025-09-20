import { IEvent } from "../models/EventModel";

export type EventBasePayload = Omit<IEvent, "id" | "createdAt" | "updatedAt" | "categories"| "user">;

export type EventCreatePayload = EventBasePayload;

export type EventUpdatePayload = Partial<EventBasePayload> & Pick<IEvent, "id">;
