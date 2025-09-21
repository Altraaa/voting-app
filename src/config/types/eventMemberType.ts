import { IEventMember } from "../models/EventMemberModel";

export type EventMemberBasePayload = Pick<IEventMember, "eventId" | "userId">;

export type EventMemberCreatePayload = EventMemberBasePayload;