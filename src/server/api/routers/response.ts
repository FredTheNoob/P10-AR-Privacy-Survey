import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const responseRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ answer: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.response.create({
        data: {
          answer: input.answer,
          userId: "",
          questionId: "",
        },
      });
    }),
});
