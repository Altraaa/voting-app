import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { voteService } from "../service/voteService";

export const voteController = {
  async create(req: Request, token: string | undefined) {
    const decoded = verifyToken(token || "");
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { candidateId, points } = await req.json();

    const user = await voteService.getUser(decoded.id);
    if (!user || user.points < points) {
      return NextResponse.json({ error: "Not enough points" }, { status: 400 });
    }

    const vote = await voteService.createVote(decoded.id, candidateId, points);
    return NextResponse.json(vote);
  },

  async getAll() {
    const votes = await voteService.getVotes();
    return NextResponse.json(votes);
  },
};