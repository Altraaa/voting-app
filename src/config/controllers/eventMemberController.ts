import { NextResponse } from "next/server";
import { eventMemberService } from "../services/eventMemberService";

export const eventMemberController = {
  async getAll() {
    const members = await eventMemberService.getAll();
    return NextResponse.json(members);
  },

  async getByEvent(req: Request) {
    const { eventId } = await req.json();
    const members = await eventMemberService.getByEventId(eventId);
    return NextResponse.json(members);
  },

  async create(req: Request) {
    const { userId, eventId } = await req.json();
    const member = await eventMemberService.create({ userId, eventId });
    return NextResponse.json(member);
  },

  async remove(req: Request) {
    const { id } = await req.json();
    await eventMemberService.remove(id);
    return NextResponse.json({ message: "Event member removed" });
  },

  async removeByUserAndEvent(req: Request) {
    const { userId, eventId } = await req.json();
    await eventMemberService.removeByUserAndEvent(userId, eventId);
    return NextResponse.json({ message: "Event member removed" });
  },
};