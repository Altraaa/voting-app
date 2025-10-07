import { NextResponse } from "next/server";
import { pointVotesService } from "../services/pointVotesService";
import prisma from "@/lib/prisma";
import { DuitkuService } from "@/lib/duitku";
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
      console.log("=== CREATE POINT VOTE ===");
      console.log("Request data:", JSON.stringify(data, null, 2));

      const requiredFields = [
        "userId",
        "packageId",
        "amount",
        "merchantOrderId",
        "phoneNumber",
      ];
      const missingFields = requiredFields.filter((field) => !data[field]);

      if (missingFields.length > 0) {
        console.error("Missing required fields:", missingFields);
        return NextResponse.json(
          {
            error: "Missing required fields",
            missingFields,
          },
          { status: 400 }
        );
      }

      if (!/^(\+62|62|0)[0-9]{9,12}$/.test(data.phoneNumber)) {
        return NextResponse.json(
          { error: "Invalid phone number format. Use format: 08123456789" },
          { status: 400 }
        );
      }

      const pointVote = await pointVotesService.create(data);
      console.log("Point vote created:", JSON.stringify(pointVote, null, 2));

      return NextResponse.json(
        {
          success: true,
          data: pointVote,
          message: "Point vote created successfully",
        },
        { status: 201 }
      );
    } catch (error) {
      console.error("=== CREATE POINT VOTE ERROR ===");
      console.error(error);
      return NextResponse.json(
        {
          error: "Failed to create point vote",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  },

  async initiatePayment(req: Request) {
    try {
      const { pointVoteId, paymentMethod } = await req.json();

      console.log("=== INITIATE PAYMENT ===");
      console.log("Request body:", { pointVoteId, paymentMethod });

      if (!pointVoteId || !paymentMethod) {
        return NextResponse.json(
          { error: "Missing pointVoteId or paymentMethod" },
          { status: 400 }
        );
      }

      const pointVote = await pointVotesService.getById(pointVoteId);
      if (!pointVote) {
        return NextResponse.json(
          { error: "Point vote not found" },
          { status: 404 }
        );
      }

      console.log("Point vote found:", JSON.stringify(pointVote, null, 2));

      const user = await prisma.user.findUnique({
        where: { id: pointVote.userId },
        select: {
          email: true,
          firstName: true,
          lastName: true,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      console.log("User found:", JSON.stringify(user, null, 2));

      const packageData = await prisma.package.findUnique({
        where: { id: pointVote.packageId },
        select: { name: true, points: true },
      });

      if (!packageData) {
        throw new Error("Package not found");
      }

      console.log("Package found:", JSON.stringify(packageData, null, 2));

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(user.email)) {
        return NextResponse.json(
          { error: "Invalid email format" },
          { status: 400 }
        );
      }

      let customerName = `${user.firstName || ""} ${
        user.lastName || ""
      }`.trim();
      if (!customerName) {
        customerName = user.email.split("@")[0];
      }
      customerName = customerName.substring(0, 20);

      const phoneNumber = pointVote.phoneNumber || "";
      if (!phoneNumber || !/^(\+62|62|0)[0-9]{9,12}$/.test(phoneNumber)) {
        return NextResponse.json(
          { error: "Invalid phone number. Please update your phone number" },
          { status: 400 }
        );
      }

      const paymentData = {
        merchantOrderId: pointVote.merchantOrderId,
        paymentAmount: pointVote.amount,
        productDetails: `${packageData.name} - ${packageData.points} Points`,
        email: user.email,
        customerName: customerName,
        phoneNumber: phoneNumber,
        paymentMethod: paymentMethod,
      };

      console.log(
        "Payment data prepared:",
        JSON.stringify(paymentData, null, 2)
      );

      const paymentResponse = await DuitkuService.createPayment(paymentData);

      console.log(
        "Payment response from Duitku:",
        JSON.stringify(paymentResponse, null, 2)
      );

      const updatedPointVote = await pointVotesService.update({
        id: pointVote.id,
        reference: paymentResponse.reference,
        paymentMethod: paymentMethod,
      });

      return NextResponse.json({
        success: true,
        data: {
          ...updatedPointVote,
          paymentUrl: paymentResponse.paymentUrl,
        },
        message: "Payment initiated successfully",
      });
    } catch (error) {
      console.error("=== PAYMENT INITIATION ERROR ===");
      console.error(error);
      return NextResponse.json(
        {
          error: "Failed to initiate payment",
          details: error instanceof Error ? error.message : "Unknown error",
        },
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

      console.log("=== DUITKU CALLBACK ===");
      console.log("Callback data:", JSON.stringify(callbackData, null, 2));

      const isValidSignature =
        DuitkuService.validateCallbackSignature(callbackData);
      if (!isValidSignature) {
        console.error("Invalid signature from Duitku callback");
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 400 }
        );
      }

      const result = await pointVotesService.handleDuitkuCallback(callbackData);

      return NextResponse.json({
        success: true,
        message: "Callback processed successfully",
        data: result,
      });
    } catch (error) {
      console.error("=== DUITKU CALLBACK ERROR ===");
      console.error(error);
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
