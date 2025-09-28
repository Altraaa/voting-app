import { ICandidate } from "../models/CandidateModel";
import { ICategories } from "../models/CategoriesModel";
import { IPackagePurchase } from "../models/PackageHistoryModel";

export type CandidateResponse = ICandidate[];
export type CandidateDetailResponse = ICandidate;
export type CandidateDeleteResponse = {
  message: string;
};

export type CategoriesResponse = ICategories[];
export type CategoriesDetailResponse = ICategories;

export type PackageHistoryResponse = IPackagePurchase[];
export type PackageHistoryDetailResponse = IPackagePurchase;