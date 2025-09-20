import { AddPointsPayload } from "@/config/types/pointsType";
import { ApiRequest } from "@/lib/api";

export const PointsRoute = {
  addPoints: (data: AddPointsPayload) =>
    ApiRequest({
      url: "points",
      method: "POST",
      body: data,
    }),
};
