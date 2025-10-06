import { IPointVotes } from "@/config/models/PointVotesModel";
import { DuitkuCallbackPayload, PointVotesCreatePayload } from "@/config/types/pointVotesType";
import { ApiRequest } from "@/lib/api";

export const PointVotesRoute = {
  getAll: (): Promise<IPointVotes[]> =>
    ApiRequest({
      url: "points/votes",
      method: "GET",
    }),

  getById: (id: string): Promise<IPointVotes> =>
    ApiRequest({
      url: `points/votes/${id}`,
      method: "GET",
    }),

  create: (data: PointVotesCreatePayload): Promise<IPointVotes> =>
    ApiRequest({
      url: "points/votes",
      method: "POST",
      body: data,
    }),

  paymentCallback: (callbackData: DuitkuCallbackPayload): Promise<IPointVotes> =>
    ApiRequest({
      url: "payment/callback",
      method: "POST",
      body: callbackData,
    }),
};
