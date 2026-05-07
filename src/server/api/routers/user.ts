import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
    create: publicProcedure
        .input(z.object({ prolificId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const user = await ctx.db.user.create({
                data: {
                    prolificId: input.prolificId,
                    hasBeenRedirectedToProlific: false,
                },
            });

            return user
        }),

    hasCompletedSurvey: publicProcedure
        .input(z.object({ prolificId: z.string() }))
        .query(async ({ ctx, input }) => {
            const user = await ctx.db.user.findUnique({
                where: {
                    prolificId: input.prolificId
                },
            });

            return user !== null;
        }),

    hasBeenRedirectedToProlific: publicProcedure
        .input(z.object({ prolificId: z.string() }))
        .query(async ({ ctx, input }) => {
            const user = await ctx.db.user.findUnique({
                where: {
                    prolificId: input.prolificId
                },
            });

            return user?.hasBeenRedirectedToProlific ?? false;
        }),

    setHasBeenRedirectedToProlific: publicProcedure
        .input(z.object({ prolificId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const user = await ctx.db.user.update({
                where: {
                    prolificId: input.prolificId
                },
                data: {
                    hasBeenRedirectedToProlific: true,
                },
            });

            return user;
        }),
});
