import { IEvent } from "../models/EventModel";

export type EventBasePayload = Omit<IEvent, "id" | "createdAt" | "updatedAt" | "categories"| "users">;

export type EventSimpleData = Pick<IEvent, "id" | "name">;

export type EventCreatePayload = EventBasePayload;

export type EventUpdatePayload = Partial<EventBasePayload> & Pick<IEvent, "id">;
