import { NextResponse } from "next/server";
import { pointVotesService } from "../services/pointVotesService";
import { DuitkuCallbackPayload } from "../types/pointVotesType";

export const pointVotesController = {
  async getAll() {
    try {
      const pointVotes = await pointVotesService.getAll();
      return NextResponse.json(pointVotes);
    } catch (error) {
      console.error("Controller get all error:", error);
      return NextResponse.json(
        { error: "Failed to fetch point votes" },
        { status: 500 }
      );
    }
  },

  async getById(id: string) {
    try {
      const pointVote = await pointVotesService.getById(id);
      if (!pointVote) {
        return NextResponse.json(
          { error: "Point vote not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(pointVote);
    } catch (error) {
      console.error("Controller get by id error:", error);
      return NextResponse.json(
        { error: "Failed to fetch point vote" },
        { status: 500 }
      );
    }
  },

  async create(req: Request) {
    try {
      const data = await req.json();
      const pointVote = await pointVotesService.create(data);
      return NextResponse.json(pointVote, { status: 201 });
    } catch (error) {
      console.error("Controller create error:", error);
      return NextResponse.json(
        { error: "Failed to create point vote" },
        { status: 500 }
      );
    }
  },

  async update(req: Request) {
    try {
      const data = await req.json();
      const pointVote = await pointVotesService.update(data);
      return NextResponse.json(pointVote);
    } catch (error) {
      console.error("Controller update error:", error);
      return NextResponse.json(
        { error: "Failed to update point vote" },
        { status: 500 }
      );
    }
  },

  async duitkuCallback(req: Request) {
    try {
      const callbackData: DuitkuCallbackPayload = await req.json();

      // Validasi signature (sesuai dokumentasi Duitku)
      // const isValidSignature = validateSignature(callbackData);
      // if (!isValidSignature) {
      //   return NextResponse.json(
      //     { error: "Invalid signature" },
      //     { status: 400 }
      //   );
      // }

      const result = await pointVotesService.handleDuitkuCallback(callbackData);

      return NextResponse.json({
        success: true,
        message: "Callback processed successfully",
        data: result,
      });
    } catch (error) {
      console.error("Controller duitku callback error:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to process callback",
        },
        { status: 500 }
      );
    }
  },

  async remove(req: Request) {
    try {
      const { id } = await req.json();
      await pointVotesService.remove(id);
      return NextResponse.json({ message: "Point vote deleted" });
    } catch (error) {
      console.error("Controller delete error:", error);
      return NextResponse.json(
        { error: "Failed to delete point vote" },
        { status: 500 }
      );
    }
  },
};
