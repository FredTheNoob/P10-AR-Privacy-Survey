import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const questionRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ question: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.surveyQuestion.create({
        data: {
            question: input.question,
        },
      })
    }),
});
