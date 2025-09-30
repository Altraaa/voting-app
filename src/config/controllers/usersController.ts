import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { userService } from "../services/usersService";
import { Role } from "@/generated/prisma";
import { UsersCreatePayload, UsersUpdatePayload } from "../types/usersType";

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

    const CreateUsers: UsersCreatePayload  = await req.json();
    const user = await userService.create(CreateUsers);
    return NextResponse.json(user);
  },

  async update(req: Request) {
    const UpdateUsers: UsersUpdatePayload = await req.json();
    const user = await userService.update(UpdateUsers);
    return NextResponse.json(user);
  },

  async remove(req: Request) {
    const { id } = await req.json();
    await userService.remove(id);
    return NextResponse.json({ message: "User deleted" });
  },
};
