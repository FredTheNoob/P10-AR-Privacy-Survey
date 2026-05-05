import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const responseRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ answer: z.string(), userId: z.string(), questionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const createdResponse = await ctx.db.response.create({
        data: {
          answer: input.answer,
          userId: input.userId,
          questionId: input.questionId,
        }});

      const updatedUser = await ctx.db.user.update({
        where: {
            id: input.userId,
        },
        data: {
            responses: {
                create: {
                    answer: input.answer,
                    userId: input.userId,
                    questionId: input.questionId,
                },
            },
        }
    });

      return createdResponse;
    }),
});
