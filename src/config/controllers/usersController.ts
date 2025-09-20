import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { userService } from "../services/usersService";
import { Role } from "@/generated/prisma";

export const userController = {
  async getAll() {
    const users = await userService.getAll();
    return NextResponse.json(users);
  },

  async create(req: Request, token: string | undefined) {
    const decoded = verifyToken(token || "");
    if (!decoded || decoded.role !== Role.ADMIN) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { email, name, password, role } = await req.json();
    const user = await userService.create({ email, name, password, role });
    return NextResponse.json(user);
  },

  async update(req: Request) {
    const { id, name, role } = await req.json();
    const user = await userService.update({ id, name, role });
    return NextResponse.json(user);
  },

  async remove(req: Request) {
    const { id } = await req.json();
    await userService.remove(id);
    return NextResponse.json({ message: "User deleted" });
  },
};
