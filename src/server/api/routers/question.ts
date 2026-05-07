import type { ChooseRadioOption, InformationPage, Question, SurveyContent, SurveyData, TextRadioOption } from "prisma/survey-data";
import { createTRPCRouter, publicProcedure } from "../trpc";
import type { Prisma } from "@prisma/client";

type DbQuestion = {
  id: string;
  title: string | null;
  type: string;
  pageIndex: number | null;
  config: Prisma.JsonValue;
  imageName: string | null;
  required: boolean | null;
};

type PageType = "question" | "info";

export function toSurveyData(rows: DbQuestion[]): SurveyData {
  const surveyData: SurveyData = { pages: [] }
  const pages: SurveyContent[][] = [];
  const pageTypes: Record<number, PageType> = {};

  for (const row of rows.sort((a, b) => (a.pageIndex ?? 0) - (b.pageIndex ?? 0))) {
    const page = row.pageIndex ?? 0;

    // Initialize page if missing
    if (!pages[page]) {
      pages[page] = row.type === "info" ? [] as InformationPage[] : [] as Question[];
      pageTypes[page] = row.type === "info" ? "info" : "question";
    }

    const currentType = pageTypes[page];

    
    if (row.type === "info" && currentType !== "info") {
      throw new Error(`Page ${page} mixes Question and InformationPage`);
    }

    if (row.type !== "info" && currentType !== "question") {
      throw new Error(`Page ${page} mixes InformationPage and Question`);
    }

    
    if (row.type === "info") {
      (pages[page] as InformationPage[]).push({
        id: row.id,
        type: "info",
        lines: row.config && typeof row.config === "object" && !Array.isArray(row.config) && "lines" in row.config ? (row.config as { lines?: string[] }).lines ?? [] : [],
      });
    } else {
        const question: Question =
            row.type === "number"
                ? {
                    id: row.id,
                    title: row.title ?? "",
                    type: "number",
                    required: row.required ?? undefined,
                    min: row.config && typeof row.config === "object" && !Array.isArray(row.config) && "lines" in row.config ? (row.config as { min?: number }).min : undefined,
                    max: row.config && typeof row.config === "object" && !Array.isArray(row.config) && "lines" in row.config ? (row.config as { max?: number }).max : undefined,
                }
                : row.type === "radio"
                ? {
                    id: row.id,
                    title: row.title ?? "",
                    type: "radio",
                    required: row.required ?? undefined,
                    options: row.config && typeof row.config === "object" && !Array.isArray(row.config) && "lines" in row.config ? (row.config as { options?: (ChooseRadioOption | TextRadioOption)[] }).options ?? [] : [],
                }
                : {
                    id: row.id,
                    title: row.title ?? "",
                    type: "text",
                    required: row.required ?? undefined,
                    value: row.config && typeof row.config === "object" && !Array.isArray(row.config) && "lines" in row.config ? (row.config as { value?: string }).value ?? "" : "",
                };
        (pages[page] as Question[]).push(question);
    }
  }

  pages[0] = [];
  surveyData.pages = pages

  return surveyData;
}

export const surveyRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db.surveyQuestion.findMany({
      orderBy: {
        pageIndex: "asc",
      },
    });

    return toSurveyData(rows)
  }),
});