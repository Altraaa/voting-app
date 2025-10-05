import { NextResponse } from "next/server";
import { eventService } from "../services/eventService";

export const eventController = {
  async getAll() {
    const events = await eventService.getAll();
    return NextResponse.json(events);
  },

  async getAllSimple() {
    const events = await eventService.getAllSimple();
    return NextResponse.json(events);
  },

  async getById(id: string) {
    const event = await eventService.getById(id);
    return NextResponse.json(event);
  },

  async create(req: Request) {
    try {
      const data = await req.json();
      const event = await eventService.create(data);
      return NextResponse.json(event);
    } catch (error) {
      console.error("Controller create error:", error);
      return NextResponse.json(
        { error: "Failed to create event" },
        { status: 500 }
      );
    }
  },

  async update(req: Request) {
    try {
      const data = await req.json(); 
      const event = await eventService.update(data);
      return NextResponse.json(event);
    } catch (error) {
      console.error("Controller update error:", error);
      return NextResponse.json(
        { error: "Failed to update event" },
        { status: 500 }
      );
    }
  },

  async remove(req: Request) {
    try {
      const { id } = await req.json();
      await eventService.remove(id);
      return NextResponse.json({ message: "Event deleted" });
    } catch (error) {
      console.error("Controller delete error:", error);
      return NextResponse.json(
        { error: "Failed to delete event" },
        { status: 500 }
      );
    }
  },
};
