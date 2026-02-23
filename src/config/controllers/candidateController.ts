// controllers/candidateController.ts
import { NextResponse } from "next/server";
import { candidateService } from "../services/candidateService";
import { isValidYouTubeUrl } from "../utils/validation";
import { CandidatesUpdatePayload } from "../types/candidatesType";

export const candidateController = {
  async getAll() {
    const candidates = await candidateService.getAll();
    return NextResponse.json(candidates);
  },

  async getById(id: string) {
    const candidate = await candidateService.getById(id);
    return NextResponse.json(candidate);
  },

  async getByCategorId(categoryId: string) {
    const candidates = await candidateService.getByCategorId(categoryId);
    return NextResponse.json(candidates);
  },

  async create(req: Request) {
    const { name, categoryId, description, photo_url, video_url } =
      await req.json();

    // Validasi field wajib
    if (!name || !categoryId || !description) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: name, categoryId, description, photo_url",
        },
        { status: 400 },
      );
    }

    // Proses video_url
    let videoUrlValue: string | null = null;
    if (video_url !== undefined && video_url !== null) {
      if (video_url === "") {
        videoUrlValue = null; // string kosong dianggap tidak ada video
      } else if (typeof video_url === "string") {
        if (!isValidYouTubeUrl(video_url)) {
          return NextResponse.json(
            { error: "Invalid YouTube URL format" },
            { status: 400 },
          );
        }
        videoUrlValue = video_url;
      }
    }

    const candidate = await candidateService.create({
      name,
      categoryId,
      description,
      photo_url,
      video_url: videoUrlValue,
    });
    return NextResponse.json(candidate);
  },

  async update(req: Request) {
    const { id, name, categoryId, description, photo_url, video_url } =
      await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    // Bangun data update secara dinamis
    const updateData: CandidatesUpdatePayload = { id };
    if (name !== undefined) updateData.name = name;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (description !== undefined) updateData.description = description;
    if (photo_url !== undefined) updateData.photo_url = photo_url;

    // Handle video_url
    if (video_url !== undefined) {
      if (video_url === null || video_url === "") {
        // Set ke null untuk menghapus video
        updateData.video_url = null;
      } else if (typeof video_url === "string") {
        if (!isValidYouTubeUrl(video_url)) {
          return NextResponse.json(
            { error: "Invalid YouTube URL format" },
            { status: 400 },
          );
        }
        updateData.video_url = video_url;
      }
    }

    const candidate = await candidateService.update(updateData);
    return NextResponse.json(candidate);
  },

  async remove(req: Request) {
    const { id } = await req.json();
    await candidateService.remove(id);
    return NextResponse.json({ message: "Candidate deleted" });
  },
};
