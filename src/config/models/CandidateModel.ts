import { ICategories } from "./CategoriesModel";
import { IVotes } from "./VotesModel";

export interface ICandidate {
  id: string;
  categoryId: string;
  category: ICategories;
  name: string;
  description: string;
  photo_url: string;
  votes: IVotes[];
  created: string;
  updated: string;
}