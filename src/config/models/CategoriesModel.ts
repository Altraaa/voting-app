import { ICandidate } from "./CandidateModel";
import { IEvent } from "./EventModel";

export interface ICategories {
  id: string;
  name: string;
  photo_url?: string;
  eventId: string;
  candidates: ICandidate[];
  _count: { candidates: number }; 
  event: IEvent;
  created: string;
  updated: string;
}