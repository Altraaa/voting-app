import { NextResponse } from "next/server";
import { eventService } from "../services/eventService";

export const eventController = {
  async getAll() {
    const events = await eventService.getAll();
    return NextResponse.json(events);
  },

  async getById(id: string) {
    const event = await eventService.getById(id);
    return NextResponse.json(event);
  },

  async create(req: Request) {
    const data = await req.json();
    const event = await eventService.create(data);
    return NextResponse.json(event);
  },

  async update(req: Request) {
    const { id, ...data } = await req.json();
    const event = await eventService.update(id, data);
    return NextResponse.json(event);
  },

  async remove(req: Request) {
    const { id } = await req.json();
    await eventService.remove(id);
    return NextResponse.json({ message: "Event deleted" });
  },
};