import { ICandidate } from "./CandidateModel";
import { IEvent } from "./EventModel";

export interface ICategories {
  id: string;
  name: string;
  eventId: string;
  candidates: ICandidate[];
  event: IEvent;
  created: string;
  updated: string;
}