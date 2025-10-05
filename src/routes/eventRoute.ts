import { IEvent } from "@/config/models/EventModel";
import {
  EventCreatePayload,
  EventSimpleData,
  EventUpdatePayload,
} from "@/config/types/eventType";
import { ApiRequest } from "@/lib/api";

export const EventRoute = {
  getAll: (): Promise<IEvent[]> =>
    ApiRequest({
      url: "event",
      method: "GET",
    }),

  getAllSimple: (): Promise<EventSimpleData[]> =>
    ApiRequest({
      url: "event/simple",
      method: "GET",
    }),

  getById: (id: string): Promise<IEvent> =>
    ApiRequest({
      url: `event/${id}`,
      method: "GET",
    }),

  create: (data: EventCreatePayload): Promise<IEvent> =>
    ApiRequest({
      url: "event",
      method: "POST",
      body: data,
    }),

  update: (data: EventUpdatePayload): Promise<IEvent> =>
    ApiRequest({
      url: "event",
      method: "PUT",
      body: data,
    }),
    
  remove: (id: string): Promise<IEvent> =>
    ApiRequest({
      url: "event",
      method: "DELETE",
      body: { id },
    }),
};
