import { ICandidate } from "./CandidateModel";
import { IUsers } from "./UsersModel";

export interface IVotes {
  id: string;
  userId: string;
  candidateId: string;
  pointsUsed: number;
  user: IUsers;
  candidate: ICandidate;
  created: string;
  updated: string;
}