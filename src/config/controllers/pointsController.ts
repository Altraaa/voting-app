import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { pointsService } from "../services/pointsService";

export const pointsController = {
  async add(req: Request, token: string | undefined) {
    const decoded = verifyToken(token || "");
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { points } = await req.json();
    const user = await pointsService.addPoints(decoded.id, points);

    return NextResponse.json({
      message: "Points added",
      points: user.points,
    });
  },
};
