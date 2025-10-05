import { IEventMember } from "@/config/models/EventMemberModel";
import { EventMemberCreatePayload } from "@/config/types/eventMemberType";
import { ApiRequest } from "@/lib/api";

export const EventMemberRoute = {
  getAll: (): Promise<IEventMember> =>
    ApiRequest({
      url: "event/member",
      method: "GET",
    }),

  getByEvent: (eventId: string): Promise<IEventMember> =>
    ApiRequest({
      url: "event/member/by-event",
      method: "GET",
      body: { eventId },
    }),

  create: (data: EventMemberCreatePayload): Promise<IEventMember> =>
    ApiRequest({
      url: "event/member",
      method: "POST",
      body: data,
    }),

  removeByUserAndEvent: (
    userId: string,
    eventId: string
  ): Promise<IEventMember> =>
    ApiRequest({
      url: "event/member/by-user",
      method: "DELETE",
      body: { userId, eventId },
    }),
    
  remove: (id: string): Promise<IEventMember> =>
    ApiRequest({
      url: "event/member",
      method: "DELETE",
      body: { id },
    }),
};
