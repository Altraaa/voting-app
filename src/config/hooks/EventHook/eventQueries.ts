import { useApiQuery } from "@/config/constants/useApiQuery";
import { EVENT_QUERY_KEYS } from "./eventQueryKey";
import { EventRoute } from "@/routes/eventRoute";
import { IEvent } from "@/config/models/EventModel";
import { EventSimpleData } from "@/config/types/eventType";

export const useEventQueries = {
  useGetAllEvents: (filters?: string) =>
    useApiQuery<IEvent[]>(EVENT_QUERY_KEYS.list(filters), () =>
      EventRoute.getAll()
    ),

  useGetAllSimpleEvents: (filters?: string) =>
    useApiQuery<EventSimpleData[]>(
      EVENT_QUERY_KEYS.simpleList(filters),
      () => EventRoute.getAllSimple()
    ),

  useGetEventById: (id: string) =>
    useApiQuery<IEvent>(
      EVENT_QUERY_KEYS.detail(id),
      () => EventRoute.getById(id),
      { enabled: !!id }
    ),
};
