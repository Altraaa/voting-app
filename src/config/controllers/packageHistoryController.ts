import { NextResponse } from "next/server";
import { packageHistoryService } from "../services/packageHistoryService";

export const packageHistoryController = {
  async getAll() {
    const histories = await packageHistoryService.getAll();
    return NextResponse.json(histories);
  },

  async getByUser(req: Request) {
    const { userId } = await req.json();
    const histories = await packageHistoryService.getByUserId(userId);
    return NextResponse.json(histories);
  },

  async create(req: Request) {
    const data = await req.json();
    const history = await packageHistoryService.create(data);
    return NextResponse.json(history);
  },

  async update(req: Request) {
    const { id, ...data } = await req.json();
    const history = await packageHistoryService.update(id, data);
    return NextResponse.json(history);
  },
};