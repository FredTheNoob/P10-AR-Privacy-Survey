import type { InformationPage, Question, SurveyData } from "~/app/lib/survey-types";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { SURVEY_DATA } from "~/app/lib/survey-data";

type DbQuestion = {
  id: string;
  title: string | null;
  type: string;
  pageIndex: number | null;
  config: any;
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
        lines: row.config?.lines ?? [],
        image: row.imageName ?? undefined,
        footer: row.config?.footer ?? undefined,
      });
    } else {
      (pages[page] as Question[]).push({
        visible: row.visible,
        id: row.id,
        title: row.title ?? "",
        type: row.type as any,
        required: row.required ?? undefined,
        ...(row.type === "number" && {
          min: row.config?.min,
          max: row.config?.max,
        }),
        ...(row.type === "radio" && {
          options: row.config?.options,
        }),
        ...(row.type === "rank" && {
          options: row.config?.options,
        }),
        ...(row.type === "text" && {
          value: row.config?.value,
          multiline: row.config?.multiline,
        }),
      });
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

    console.log("rows");
    console.log(toSurveyData(rows));
    console.log("survey data");
    console.log(SURVEY_DATA);
    

    return toSurveyData(rows)
  }),
});