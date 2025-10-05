import { ICategories } from "./CategoriesModel";
import { IVotes } from "./VotesModel";

export interface ICandidate {
  id: string;
  name: string;
  description: string;
  photo_url: string;
  categoryId: string;
  created: Date;
  updated: Date;
  _count: {
    _count: { candidates: number };
  };
  category: ICategories;
  votes: IVotes[];
}
