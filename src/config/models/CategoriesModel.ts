import { ICandidate } from "./CandidateModel";

export interface ICategories {
  id: string;
  name: string;
  candidate_count: number;
  candiates: ICandidate;
  created: string;
  updated: string;
}