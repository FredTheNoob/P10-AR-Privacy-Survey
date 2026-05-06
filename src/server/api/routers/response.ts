import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const responseRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ answers: z.object({ pages: z.array(z.array(z.object({ answer: z.string(), userId: z.string(), questionId: z.string() }))) }) }))
    .mutation(async ({ ctx, input }) => {
        const flattened = input.answers.pages.flat();

        const createdResponses = await ctx.db.response.createMany({
            data: flattened.map((item) => ({
                answer: item.answer,
                userId: item.userId,
                questionId: item.questionId,
            })),
            skipDuplicates: true,
        });

        return createdResponses;;
    }),
});
