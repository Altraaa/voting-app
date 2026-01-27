import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { userService } from "../services/usersService";
import { Role } from "@/generated/prisma";
import {
  UsersCreatePayload,
  UsersUpdatePayload,
  UsersUpdateProfilePayload,
} from "../types/usersType";

export const userController = {
  async getAll() {
    const users = await userService.getAll();
    return NextResponse.json(users);
  },

  async getById(id: string) {
    const user = await userService.getById(id);
    return NextResponse.json(user);
  },

  async create(req: Request, token: string | undefined) {
    const decoded = verifyToken(token || "");
    if (!decoded || decoded.role !== Role.ADMIN) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const CreateUsers: UsersCreatePayload = await req.json();
    const user = await userService.create(CreateUsers);
    return NextResponse.json(user);
  },

  async update(req: Request) {
    const UpdateUsers: UsersUpdatePayload = await req.json();
    const user = await userService.update(UpdateUsers);
    return NextResponse.json(user);
  },

  async getProfileRoute(req: NextRequest) {
    try {
      const token = req.cookies.get("session")?.value;
      if (!token) {
        return NextResponse.json(
          { error: "Unauthorized - No session" },
          { status: 401 }
        );
      }

      const decoded = verifyToken(token);
      if (!decoded) {
        return NextResponse.json(
          { error: "Unauthorized - Invalid session" },
          { status: 401 }
        );
      }

      const user = await userService.getProfile(decoded.id);
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      return NextResponse.json(user);
    } catch (error) {
      console.error("Error getting profile:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  },

  async updateProfileRoute(req: NextRequest) {
    try {
      const token = req.cookies.get("session")?.value;
      if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const decoded = verifyToken(token);
      if (!decoded) {
        return NextResponse.json(
          { error: "Unauthorized - Invalid session" },
          { status: 401 }
        );
      }

      const data: UsersUpdateProfilePayload = await req.json();
      const updatedUser = await userService.updateProfile(decoded.id, data);

      return NextResponse.json(updatedUser);
    } catch (error) {
      console.error("Error updating profile:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  },

  async getUserVoteHistoryRoute(req: NextRequest) {
    try {
      const token = req.cookies.get("session")?.value;

      if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const decoded = verifyToken(token);
      if (!decoded) {
        return NextResponse.json(
          { error: "Unauthorized - Invalid session" },
          { status: 401 }
        );
      }

      const voteHistory = await userService.getUserVoteHistory(decoded.id);
      return NextResponse.json(voteHistory);
    } catch (error) {
      console.error("Error getting vote history:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  },

  async remove(req: Request) {
    const { id } = await req.json();
    await userService.remove(id);
    return NextResponse.json({ message: "User deleted" });
  },
};
