import { z } from "zod";
import { adminProcedure, publicProcedure, router } from "./trpc";

export const systemRouter = router({
  health: publicProcedure
    .input(
      z.object({
        timestamp: z.number().min(0, "timestamp cannot be negative"),
      })
    )
    .query(() => ({
      ok: true,
    })),

  notifyOwner: adminProcedure
    .input(
      z.object({
        title: z.string().min(1, "title is required"),
        content: z.string().min(1, "content is required"),
      })
    )
    .mutation(async ({ input }) => {
      // Notifications disabled in local version
      // To enable, integrate with email service (SendGrid, Mailgun, etc.)
      console.log("[Notification] Admin notification:", input.title, input.content);
      return {
        success: false, // Notifications not available locally
      } as const;
    }),
});
