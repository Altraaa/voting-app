import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { voteService } from "../services/voteService";

export const voteController = {
  async create(req: Request, token: string | undefined) {
    try {
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

      // Verify candidate and get event config
      const candidateContext = await voteService.getCandidateWithEvent(candidateId);

      if (!candidateContext) {
        return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
      }

      const pointsPerVote = candidateContext.category.event.pointsPerVote || 1;

      // Validation: Points must be at least the minimum required per vote
      if (points < pointsPerVote) {
        return NextResponse.json(
          { error: `Minimum ${pointsPerVote} points required for 1 vote` },
          { status: 400 }
        );
      }

      // Validation: Points must be a multiple of pointsPerVote
      if (points % pointsPerVote !== 0) {
        return NextResponse.json(
          { error: `Points must be a multiple of ${pointsPerVote}` },
          { status: 400 }
        );
      }

      const user = await voteService.getUser(decoded.id);
      if (!user || user.points < points) {
        return NextResponse.json({ error: "Not enough points" }, { status: 400 });
      }

      // Check event status and dates
      const event = candidateContext.category.event;
      const now = new Date();
      
      if (event.status === 'ended' || !event.isActive) {
        return NextResponse.json({ error: "Event has ended or is not active" }, { status: 400 });
      }

      if (new Date(event.startDate) > now) {
        return NextResponse.json({ error: "Event has not started yet" }, { status: 400 });
      }

      if (new Date(event.endDate) < now) {
        return NextResponse.json({ error: "Event has ended" }, { status: 400 });
      }

      // Create vote
      const voteResult = await voteService.createVote(decoded.id, candidateId, points);

      const votesReceived = Math.floor(points / pointsPerVote);

      return NextResponse.json({
        success: true,
        vote: voteResult,
        message: `Berhasil vote! ${points} poin = ${votesReceived} suara`,
      });
    } catch (error: any) {
      console.error("Error creating vote:", error);
      return NextResponse.json(
        { error: error.message || "Failed to create vote" },
        { status: 500 }
      );
    }
  },

  async getAll() {
    try {
      const votes = await voteService.getVotes();
      return NextResponse.json(votes);
    } catch (error: any) {
      console.error("Error getting votes:", error);
      return NextResponse.json(
        { error: error.message || "Failed to get votes" },
        { status: 500 }
      );
    }
  },
};