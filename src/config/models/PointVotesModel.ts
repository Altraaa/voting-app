import { PointVotes, } from "@/generated/prisma";

export interface IPointVotes extends PointVotes {
  user: {
    id: string;
    email: string;
    points: number;
  };
  package: {
    id: string;
    name: string;
    points: number;
  };
}