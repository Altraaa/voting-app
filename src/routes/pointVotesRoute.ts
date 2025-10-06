import { IPointVotes } from "@/config/models/PointVotesModel";
import { PaymentInitiate } from "@/config/types/dutikuType";
import { DuitkuCallbackPayload, PointVotesCreatePayload, PointVotesCreateResponse } from "@/config/types/pointVotesType";
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

  create: (data: PointVotesCreatePayload): Promise<PointVotesCreateResponse> =>
    ApiRequest({
      url: "points/votes",
      method: "POST",
      body: data,
    }),

  paymentInitiate: (data: PaymentInitiate): Promise<PointVotesCreateResponse> =>
    ApiRequest({
      url: "payment/initiate",
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
