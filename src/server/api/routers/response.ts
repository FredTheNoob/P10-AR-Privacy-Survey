import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const responseRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ answer: z.string(), userId: z.string(), questionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.response.create({
        data: {
          answer: input.answer,
          userId: input.userId,
          questionId: input.questionId,
        }});
    }),
});
