import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ }))
    .mutation(async ({ ctx, input }) => {
        const user = await ctx.db.user.create({
            data: {},
        });
        
        return user
    }),
});
