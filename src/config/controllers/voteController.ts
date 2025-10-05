import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { voteService } from "../services/voteService";

export const voteController = {
  async create(req: Request, token: string | undefined) {
    const decoded = verifyToken(token || "");
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const points = body.pointsUsed;
    const candidateId = body.candidateId;

    if (!candidateId || points === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

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