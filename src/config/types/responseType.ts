import { ICandidate } from "../models/CandidateModel";
import { ICategories } from "../models/CategoriesModel";

export type CandidateResponse = ICandidate[];
export type CandidateDetailResponse = ICandidate;
export type CandidateDeleteResponse = {
  message: string;
};

export type CategoriesResponse = ICategories[];
export type CategoriesDetailResponse = ICategories;