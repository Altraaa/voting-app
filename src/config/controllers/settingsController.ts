import { settingsService } from "@/config/services/settingsService";
import { NextResponse } from "next/server";

export const settingsController = {
  async getSettings() {
    try {
      const settings = await settingsService.getSettings();
      return NextResponse.json(settings);
    } catch (error) {
      console.error("Error getting settings:", error);
      return NextResponse.json(
        { error: "Failed to get settings" },
        { status: 500 }
      );
    }
  },

  async updateSettings(data: { showTotalVotes?: boolean }) {
    try {
      const settings = await settingsService.updateSettings(data);
      return NextResponse.json(settings);
    } catch (error) {
      console.error("Error updating settings:", error);
      return NextResponse.json(
        { error: "Failed to update settings" },
        { status: 500 }
      );
    }
  },
};
