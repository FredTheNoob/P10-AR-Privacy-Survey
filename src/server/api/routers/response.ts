import { z } from "zod";
import type { SurveyContent } from "~/app/lib/survey-types";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const SurveyContentSchema: z.ZodType<SurveyContent> = z.lazy(() =>
  z.union([
    z.object({
      type: z.literal("info"),
      id: z.string().optional(),
      lines: z.array(z.string()),
      image: z.string().optional(),
    }),
    z.object({
      type: z.literal("radio"),
      id: z.string().optional(),
      title: z.string(),
      answer: z.string().optional(),
      options: z.array(z.any()), // simplify for now
    }),
    z.object({
      type: z.literal("number"),
      id: z.string().optional(),
      title: z.string(),
      answer: z.string().optional(),
    }),
    z.object({
      type: z.literal("text"),
      id: z.string().optional(),
      title: z.string(),
      value: z.string(),
      answer: z.string().optional(),
    }),
  ])
);

const SurveyDataSchema = z.object({
  pages: z.array(z.array(SurveyContentSchema)),
});

export const responseRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ answers: SurveyDataSchema, userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
        const flattened = input.answers.pages.flat();

        const mapped = flattened
            .filter((item) => item.type !== "info") // skip info pages
            .map((item) => {
                let answer = "";

                if (item.type === "text") {
                answer = item.value;
                } else {
                answer = item.answer ?? "";
                }

                return {
                answer,
                userId: input.userId,
                questionId: item.id ?? "",
                };
            })
            .filter((item) => item.questionId); // avoid empty IDs

        return ctx.db.response.createMany({
        data: mapped,
        skipDuplicates: true,
        });
    }),
});
