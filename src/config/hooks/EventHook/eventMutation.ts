import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { EVENT_QUERY_KEYS } from "./eventQueryKey";
import { useApiMutation } from "@/config/constants/useApiMutate";
import { IEvent } from "@/config/models/EventModel";
import { EventRoute } from "@/routes/eventRoute";
import { toast } from "sonner";
import {
  EventCreatePayload,
  EventUpdatePayload,
} from "@/config/types/eventType";
import { getErrorMessage } from "@/config/utils/ErrorHandler";

const invalidateEventQueries = (queryClient: QueryClient) => {
  return queryClient.invalidateQueries({
    queryKey: EVENT_QUERY_KEYS.all,
  });
};

export const useEventMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useApiMutation<IEvent, EventCreatePayload>(
    (data) => EventRoute.create(data),
    {
      onSuccess: () => {
        invalidateEventQueries(queryClient);
        toast.success("Event berhasil dibuat");
      },
      onError: (error) => {
        toast.error("Gagal membuat event", {
          description:
            getErrorMessage(error) || "Terjadi kesalahan saat membuat event",
        });
      },
    }
  );

  const updateMutation = useApiMutation<IEvent, EventUpdatePayload>(
    (data) => EventRoute.update(data),
    {
      onSuccess: (updatedEvent) => {
        queryClient.setQueryData(
          EVENT_QUERY_KEYS.detail(updatedEvent.id),
          updatedEvent
        );
        invalidateEventQueries(queryClient);
        toast.success("Event berhasil diperbarui");
      },
      onError: (error) => {
        toast.error("Gagal memperbarui event", {
          description:
            getErrorMessage(error) ||
            "Terjadi kesalahan saat memperbarui event",
        });
      },
    }
  );

  const removeMutation = useApiMutation<IEvent, string>(
    (id) => EventRoute.remove(id),
    {
      onSuccess: (_, id) => {
        queryClient.removeQueries({
          queryKey: EVENT_QUERY_KEYS.detail(id),
        });
        invalidateEventQueries(queryClient);
        toast.success("Event berhasil dihapus");
      },
      onError: (error) => {
        toast.error("Gagal menghapus event", {
          description:
            getErrorMessage(error) || "Terjadi kesalahan saat menghapus event",
        });
      },
    }
  );

  return {
    createMutation,
    updateMutation,
    removeMutation,
  };
};
