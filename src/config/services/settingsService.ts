import { prisma } from "@/lib/prisma";

export const settingsService = {
  async getSettings() {
    // Coba ambil settings yang ada, jika tidak ada buat default
    let settings = await prisma.settings.findUnique({
      where: { id: "app-settings" },
    });

    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          id: "app-settings",
          showTotalVotes: true,
        },
      });
    }

    return settings;
  },

  async updateSettings(data: { showTotalVotes?: boolean }) {
    const settings = await prisma.settings.upsert({
      where: { id: "app-settings" },
      update: {
        showTotalVotes: data.showTotalVotes,
      },
      create: {
        id: "app-settings",
        showTotalVotes: data.showTotalVotes ?? true,
      },
    });

    return settings;
  },
};
