import { ICategories } from "./CategoriesModel";
import { IVotes } from "./VotesModel";

export interface ICandidate {
  id: string;
  categoryId: string;
  votesId: string;
  name: string;
  description: string;
  photo_url: string;
  category: ICategories;
  votes: IVotes[];
  created: string;
  updated: string;
}