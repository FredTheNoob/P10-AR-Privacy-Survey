import type { ChooseRadioOption, InformationPage, Question, SurveyData, TextRadioOption } from "~/app/lib/survey-types";
import { createTRPCRouter, publicProcedure } from "../trpc";
import type { JsonValue } from "@prisma/client/runtime/library";

type DbQuestion = {
  id: string;
  title: string | null;
  type: string;
  pageIndex: number | null;
  config: JsonValue | null;
  imageName: string | null;
  required: boolean | null;
  visible: boolean;
};

type PageType = "question" | "info";

export function toSurveyData(rows: DbQuestion[]): SurveyData {
  const surveyData: SurveyData = { pages: [] }
  const pages: (Question[] | InformationPage[])[] = [];
  const pageTypes: Record<number, PageType> = {};

  for (const row of rows.sort((a, b) => (a.pageIndex ?? 0) - (b.pageIndex ?? 0))) {
    const page = row.pageIndex ?? 0;

    const config = (row.config ?? {}) as {
      options?: (ChooseRadioOption | TextRadioOption)[] | string[];
      min?: number;
      max?: number;
      value?: string;
      lines?: string[];
      multiline?: boolean;
      footer?: string;
    };

    // Initialize page if missing
    if (!pages[page]) {
      pages[page] = row.type === "info" ? [] as InformationPage[] : [] as Question[];
      pageTypes[page] = row.type === "info" ? "info" : "question";
    }

    // ✅ Safe push with correct typing
    if (row.type === "info") {
      (pages[page] as InformationPage[]).push({
        id: row.id,
        type: "info",
        lines: config.lines ?? [],
        image: row.imageName ?? undefined,
        footer: config.footer ?? undefined,
      });
    } else {
      const base = {
        visible: row.visible,
        id: row.id,
        title: row.title ?? "",
        required: row.required ?? undefined,
      };

      switch (row.type) {
        case "number":
          (pages[page] as Question[]).push({
            ...base,
            type: "number",
            min: config.min,
            max: config.max,
          });
          break;
        case "radio":
          (pages[page] as Question[]).push({
            ...base,
            type: "radio",
            options: (config.options as (ChooseRadioOption | TextRadioOption)[]) ?? [],
          });
          break;
        case "rank":
          (pages[page] as Question[]).push({
            ...base,
            type: "rank",
            options: (config.options as string[]) ?? [],
          });
          break;
        case "text":
          (pages[page] as Question[]).push({
            ...base,
            type: "text",
            value: config.value ?? "",
            multiline: config.multiline,
          });
          break;
      }
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