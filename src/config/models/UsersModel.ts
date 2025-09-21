import { Role } from "@/generated/prisma";
import { IVotes } from "./VotesModel";

export interface IUsers {
  id: string;
  email: string;
  name: string;
  password: string;
  points: number;
  role?: Role;
  firstName: string;
  lastName: string;
  newsLetter: boolean;
  phone: string;
  terms: boolean;
  votes: IVotes;
  avatar_url: string;
  created: string;
  updated: string;
}